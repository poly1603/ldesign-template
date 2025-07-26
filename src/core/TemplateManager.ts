/**
 * 模板管理器核心类
 */

import {
  Template,
  TemplateCategory,
  TemplateManagerConfig,
  DeviceType,
  TemplateStatus,
  ScanResult,
  TemplateFilter,
  TemplateSortOptions,
  TemplateInfo
} from '../types'
import {
  CacheManager,
  TemplatePathUtils,
  TemplateFilterUtils,
  validateTemplateConfig
} from '../utils'

/**
 * 模板管理器类
 */
export class TemplateManager {
  private static instance: TemplateManager
  private config: Required<TemplateManagerConfig>
  private categories: Map<string, TemplateCategory> = new Map()
  private templates: Map<string, Template> = new Map()
  private cacheManager: CacheManager
  private scanTimer?: NodeJS.Timeout
  private eventListeners: Map<string, Function[]> = new Map()

  private constructor(config: TemplateManagerConfig = {}) {
    this.config = {
      templatePath: '/src/templates',
      enableCache: true,
      cacheExpiry: 5 * 60 * 1000, // 5分钟
      autoScan: true,
      scanInterval: 30 * 1000, // 30秒
      defaultDevice: DeviceType.DESKTOP,
      onError: (error: Error) => console.error('Template Manager Error:', error),
      onTemplateLoaded: () => {},
      ...config
    }

    this.cacheManager = new CacheManager(this.config.cacheExpiry)
    
    if (this.config.autoScan) {
      this.startAutoScan()
    }
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: TemplateManagerConfig): TemplateManager {
    if (!TemplateManager.instance) {
      TemplateManager.instance = new TemplateManager(config)
    }
    return TemplateManager.instance
  }

  /**
   * 初始化模板管理器
   */
  async initialize(): Promise<void> {
    try {
      await this.scanTemplates()
    } catch (error) {
      this.config.onError(error as Error)
    }
  }

  /**
   * 扫描模板目录
   */
  async scanTemplates(): Promise<ScanResult> {
    const startTime = Date.now()
    const errors: Array<{ path: string; error: string }> = []
    let totalTemplates = 0

    try {
      // 使用 import.meta.glob 扫描模板文件
      // 新的三层结构：/src/templates/category/device/templateName/index.ts
      const templateModules = import.meta.glob('/src/templates/*/*/*/index.ts', {
        eager: false
      })

      const categoryMap = new Map<string, TemplateCategory>()

      // 处理每个模板模块
      for (const [path, moduleLoader] of Object.entries(templateModules)) {
        try {
          const pathInfo = TemplatePathUtils.parsePath(path)
          if (!pathInfo) {
            errors.push({ path, error: 'Invalid template path format' })
            continue
          }

          const { category, device, templateName } = pathInfo
          
          // 确保分类存在
          if (!categoryMap.has(category)) {
            categoryMap.set(category, {
              name: category,
              displayName: this.formatCategoryName(category),
              templates: {
                [DeviceType.DESKTOP]: [],
                [DeviceType.MOBILE]: [],
                [DeviceType.TABLET]: []
              }
            })
          }

          // 加载模板配置
          const template = await this.loadTemplate(path, moduleLoader, pathInfo)
          if (template) {
            const categoryData = categoryMap.get(category)!
            categoryData.templates[device].push(template)
            
            const templateId = TemplatePathUtils.getTemplateId(category, device, templateName)
            this.templates.set(templateId, template)
            totalTemplates++

            this.config.onTemplateLoaded(template)
          }
        } catch (error) {
          errors.push({ path, error: (error as Error).message })
        }
      }

      // 更新分类数据
      this.categories.clear()
      for (const [name, category] of categoryMap) {
        this.categories.set(name, category)
      }

      const scanTime = Date.now() - startTime
      const result: ScanResult = {
        categories: Array.from(this.categories.values()),
        totalTemplates,
        scanTime,
        errors
      }

      this.emit('scan:complete', result)
      return result

    } catch (error) {
      const scanTime = Date.now() - startTime
      const result: ScanResult = {
        categories: [],
        totalTemplates: 0,
        scanTime,
        errors: [{ path: 'root', error: (error as Error).message }]
      }
      
      this.config.onError(error as Error)
      return result
    }
  }

  /**
   * 加载单个模板
   */
  private async loadTemplate(
    path: string,
    moduleLoader: () => Promise<any>,
    pathInfo: { category: string; device: DeviceType; templateName: string }
  ): Promise<Template | null> {
    try {
      const { category, device, templateName } = pathInfo
      const templateId = TemplatePathUtils.getTemplateId(category, device, templateName)

      // 检查缓存
      if (this.config.enableCache) {
        const cached = this.cacheManager.get<Template>(templateId)
        if (cached) {
          return { ...cached, status: TemplateStatus.CACHED }
        }
      }

      // 加载模板配置
      const module = await moduleLoader()
      const templateInfo: TemplateInfo = module.default || module

      if (!validateTemplateConfig(templateInfo)) {
        throw new Error(`Invalid template configuration in ${path}`)
      }

      // 动态加载组件
      const componentPath = path.replace('/index.ts', '/LoginTemplate.vue')
      const stylePath = path.replace('/index.ts', '/LoginTemplate.less')

      const template: Template = {
        info: {
          ...templateInfo,
          id: templateId
        },
        status: TemplateStatus.LOADED,
        loadedAt: Date.now()
      }

      // 缓存模板
      if (this.config.enableCache) {
        this.cacheManager.set(templateId, template)
      }

      return template
    } catch (error) {
      return {
        info: {
          id: TemplatePathUtils.getTemplateId(pathInfo.category, pathInfo.device, pathInfo.templateName),
          name: pathInfo.templateName,
          version: '0.0.0'
        },
        status: TemplateStatus.ERROR,
        error: (error as Error).message
      }
    }
  }

  /**
   * 动态加载模板组件
   */
  async loadTemplateComponent(templateId: string): Promise<any> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    if (template.component) {
      return template.component.component
    }

    try {
      // 构建组件路径
      const [category, device, templateName] = templateId.split('-')
      const componentPath = `/src/templates/${category}/${device}/${templateName}/LoginTemplate.vue`
      
      // 动态导入组件
      const componentModule = await import(/* @vite-ignore */ componentPath)
      const component = componentModule.default || componentModule

      // 缓存组件
      template.component = {
        component,
        styles: [`/src/templates/${category}/${device}/${templateName}/LoginTemplate.less`]
      }

      return component
    } catch (error) {
      template.status = TemplateStatus.ERROR
      template.error = `Failed to load component: ${(error as Error).message}`
      throw error
    }
  }

  /**
   * 获取所有分类
   */
  getCategories(): TemplateCategory[] {
    return Array.from(this.categories.values())
  }

  /**
   * 获取指定分类
   */
  getCategory(name: string): TemplateCategory | null {
    return this.categories.get(name) || null
  }

  /**
   * 获取指定分类和设备类型的模板
   */
  getTemplates(category: string, device: DeviceType): Template[] {
    const categoryData = this.categories.get(category)
    if (!categoryData) {
      return []
    }
    return categoryData.templates[device] || []
  }

  /**
   * 获取单个模板
   */
  getTemplate(templateId: string): Template | null {
    return this.templates.get(templateId) || null
  }

  /**
   * 获取默认模板
   */
  getDefaultTemplate(category: string, device: DeviceType): Template | null {
    const templates = this.getTemplates(category, device)
    return templates.find(t => t.info.isDefault) || templates[0] || null
  }

  /**
   * 过滤模板
   */
  filterTemplates(templates: Template[], filter: TemplateFilter): Template[] {
    return TemplateFilterUtils.filterTemplates(templates, filter)
  }

  /**
   * 排序模板
   */
  sortTemplates(templates: Template[], sortOptions: TemplateSortOptions): Template[] {
    return TemplateFilterUtils.sortTemplates(templates, sortOptions)
  }

  /**
   * 搜索模板
   */
  searchTemplates(query: string, category?: string, device?: DeviceType): Template[] {
    let templates: Template[]
    
    if (category && device) {
      templates = this.getTemplates(category, device)
    } else if (category) {
      const categoryData = this.getCategory(category)
      if (!categoryData) return []
      
      templates = [
        ...categoryData.templates[DeviceType.DESKTOP],
        ...categoryData.templates[DeviceType.MOBILE],
        ...categoryData.templates[DeviceType.TABLET]
      ]
    } else {
      templates = Array.from(this.templates.values())
    }

    return TemplateFilterUtils.searchTemplates(templates, query)
  }

  /**
   * 重新加载模板
   */
  async reloadTemplate(templateId: string): Promise<Template | null> {
    // 清除缓存
    this.cacheManager.delete(templateId)
    
    // 重新扫描
    await this.scanTemplates()
    
    return this.getTemplate(templateId)
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cacheManager.clear()
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): { size: number; cleaned: number } {
    const cleaned = this.cacheManager.cleanup()
    return {
      size: this.cacheManager.size(),
      cleaned
    }
  }

  /**
   * 开始自动扫描
   */
  private startAutoScan(): void {
    if (this.scanTimer) {
      clearInterval(this.scanTimer)
    }

    this.scanTimer = setInterval(() => {
      this.scanTemplates().catch(error => {
        this.config.onError(error)
      })
    }, this.config.scanInterval)
  }

  /**
   * 停止自动扫描
   */
  stopAutoScan(): void {
    if (this.scanTimer) {
      clearInterval(this.scanTimer)
      this.scanTimer = undefined
    }
  }

  /**
   * 格式化分类名称
   */
  private formatCategoryName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  /**
   * 事件监听
   */
  on(event: string, listener: Function): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    
    const listeners = this.eventListeners.get(event)!
    listeners.push(listener)
    
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(...args)
        } catch (error) {
          this.config.onError(error as Error)
        }
      })
    }
  }

  /**
   * 移除事件监听
   */
  off(event: string, listener?: Function): void {
    if (!listener) {
      this.eventListeners.delete(event)
      return
    }

    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    this.stopAutoScan()
    this.clearCache()
    this.categories.clear()
    this.templates.clear()
    this.eventListeners.clear()
    TemplateManager.instance = null as any
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    categories: number
    templates: number
    cached: number
    errors: number
  } {
    let totalTemplates = 0
    let errorTemplates = 0

    for (const template of this.templates.values()) {
      totalTemplates++
      if (template.status === TemplateStatus.ERROR) {
        errorTemplates++
      }
    }

    return {
      categories: this.categories.size,
      templates: totalTemplates,
      cached: this.cacheManager.size(),
      errors: errorTemplates
    }
  }
}

export default TemplateManager