/**
 * 模板管理器核心类
 */

import type {
  DeviceType,
  TemplateCategory,
  TemplateConfig,
  TemplateInstance,
  TemplateManagerConfig
} from '../types'
import { EventEmitter } from '../utils'

/**
 * 模板管理器
 */
export class TemplateManager extends EventEmitter {
  private config: Required<TemplateManagerConfig>
  private templates: Map<string, TemplateInstance> = new Map()
  private categories: Map<string, TemplateCategory> = new Map()
  private scanTimer: NodeJS.Timeout | null = null
  private isScanning = false

  constructor(config: TemplateManagerConfig) {
    super()

    this.config = {
      templateRoot: config.templateRoot || '/src/templates',
      enableCache: config.enableCache ?? true,
      cacheExpiry: config.cacheExpiry ?? 1000 * 60 * 30, // 30分钟
      autoScan: config.autoScan ?? true,
      scanInterval: config.scanInterval ?? 1000 * 60 * 5, // 5分钟
      defaultDeviceType: config.defaultDeviceType ?? 'desktop',
      onError: config.onError,
      onTemplateLoaded: config.onTemplateLoaded
    } as Required<TemplateManagerConfig>

    if (this.config.autoScan) {
      this.startAutoScan()
    }
  }

  /**
   * 初始化模板管理器
   */
  async initialize(): Promise<void> {
    await this.scanTemplates()
  }

  /**
   * 扫描模板目录
   */
  async scanTemplates(): Promise<void> {
    if (this.isScanning) {
      return
    }

    this.isScanning = true

    try {
      // 使用 import.meta.glob 扫描模板文件
      const templateModules = (import.meta as any).glob(
        `${this.config.templateRoot}/**/index.ts`,
        { eager: false }
      )

      const categories = new Map<string, TemplateCategory>()

      for (const [path, moduleLoader] of Object.entries(templateModules)) {
        try {
          const module = await moduleLoader() as any
          const templateConfig: TemplateConfig = module.default || module.config

          if (this.validateTemplateConfig(templateConfig)) {
            this.processTemplateConfig(templateConfig, path, categories)
          }
        } catch (error) {
          console.warn(`Failed to load template config from ${path}:`, error)
        }
      }

      this.categories = categories
      this.emit('scan:complete', Array.from(categories.values()))
    } catch (error) {
      console.error('Failed to scan templates:', error)
    } finally {
      this.isScanning = false
    }
  }

  /**
   * 处理模板配置
   */
  private processTemplateConfig(
    config: TemplateConfig,
    configPath: string,
    categories: Map<string, TemplateCategory>
  ): void {
    const { category, deviceType } = config

    // 计算组件和样式文件路径
    const basePath = configPath.replace('/index.ts', '')
    config.componentPath = `${basePath}/component.tsx`
    config.stylePath = `${basePath}/style.less`

    // 获取或创建分类
    let categoryData = categories.get(category)
    if (!categoryData) {
      categoryData = {
        name: category,
        deviceTypes: [],
        templates: {
          desktop: [],
          mobile: [],
          tablet: []
        }
      }
      categories.set(category, categoryData)
    }

    // 添加设备类型
    if (!categoryData.deviceTypes.includes(deviceType)) {
      categoryData.deviceTypes.push(deviceType)
    }

    // 添加模板到对应的设备类型
    categoryData.templates[deviceType].push(config)
  }

  /**
   * 验证模板配置
   */
  private validateTemplateConfig(config: any): config is TemplateConfig {
    return (
      config &&
      typeof config.id === 'string' &&
      typeof config.name === 'string' &&
      typeof config.category === 'string' &&
      typeof config.deviceType === 'string' &&
      ['desktop', 'mobile', 'tablet'].includes(config.deviceType)
    )
  }

  /**
   * 加载模板
   */
  async loadTemplate(templateId: string): Promise<TemplateInstance> {
    // 检查缓存
    const cached = this.getCachedTemplate(templateId)
    if (cached) {
      return cached
    }

    const config = this.getTemplateConfig(templateId)
    if (!config) {
      throw new Error(`Template not found: ${templateId}`)
    }

    this.emit('template:loading', config)

    const instance: TemplateInstance = {
      config,
      status: 'loading'
    }

    try {
      // 动态加载组件
      const componentModule = await import(/* @vite-ignore */ config.componentPath)
      instance.component = componentModule.default || componentModule

      // 动态加载样式（如果存在）
      if (config.stylePath) {
        try {
          const styleModule = await import(/* @vite-ignore */ config.stylePath)
          instance.styles = styleModule.default || styleModule
        } catch (error) {
          console.warn(`Failed to load styles for template ${templateId}:`, error)
        }
      }

      instance.status = 'loaded'
      instance.cachedAt = Date.now()

      // 缓存模板
      if (this.config.enableCache) {
        this.templates.set(templateId, instance)
      }

      this.emit('template:loaded', instance)
      return instance
    } catch (error) {
      instance.status = 'error'
      instance.error = error as Error

      this.emit('template:error', config, error as Error)
      throw error
    }
  }

  /**
   * 获取缓存的模板
   */
  private getCachedTemplate(templateId: string): TemplateInstance | null {
    if (!this.config.enableCache) {
      return null
    }

    const cached = this.templates.get(templateId)
    if (!cached) {
      return null
    }

    // 检查缓存是否过期
    if (cached.cachedAt && Date.now() - cached.cachedAt > this.config.cacheExpiry) {
      this.templates.delete(templateId)
      return null
    }

    return cached
  }

  /**
   * 获取模板配置
   */
  getTemplateConfig(templateId: string): TemplateConfig | null {
    for (const category of this.categories.values()) {
      for (const deviceTemplates of Object.values(category.templates)) {
        const template = deviceTemplates.find(t => t.id === templateId)
        if (template) {
          return template
        }
      }
    }
    return null
  }

  /**
   * 获取分类下的模板列表
   */
  getTemplatesByCategory(category: string, deviceType?: DeviceType): TemplateConfig[] {
    const categoryData = this.categories.get(category)
    if (!categoryData) {
      return []
    }

    if (deviceType) {
      return categoryData.templates[deviceType] || []
    }

    // 返回所有设备类型的模板
    return Object.values(categoryData.templates).flat()
  }

  /**
   * 获取默认模板
   */
  getDefaultTemplate(category: string, deviceType: DeviceType): TemplateConfig | null {
    const templates = this.getTemplatesByCategory(category, deviceType)
    return templates.find(t => t.isDefault) || templates[0] || null
  }

  /**
   * 获取所有分类
   */
  getCategories(): TemplateCategory[] {
    return Array.from(this.categories.values())
  }

  /**
   * 预加载模板
   */
  async preloadTemplates(templateIds: string[]): Promise<void> {
    const loadPromises = templateIds.map(id =>
      this.loadTemplate(id).catch(error => {
        console.warn(`Failed to preload template ${id}:`, error)
      })
    )

    await Promise.allSettled(loadPromises)
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.templates.clear()
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): { size: number; keys: string[]; totalMemory: number } {
    const keys = Array.from(this.templates.keys())
    const totalMemory = keys.reduce((total, key) => {
      const template = this.templates.get(key)
      if (template) {
        // 简单估算内存占用
        return total + JSON.stringify(template.config).length
      }
      return total
    }, 0)

    return {
      size: this.templates.size,
      keys,
      totalMemory
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
      this.scanTemplates()
    }, this.config.scanInterval)
  }

  /**
   * 停止自动扫描
   */
  stopAutoScan(): void {
    if (this.scanTimer) {
      clearInterval(this.scanTimer)
      this.scanTimer = null
    }
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    this.stopAutoScan()
    this.clearCache()
    this.clear()
  }
}

// 创建全局单例
let globalTemplateManager: TemplateManager | null = null

/**
 * 获取全局模板管理器实例
 */
export function getGlobalTemplateManager(): TemplateManager | null {
  return globalTemplateManager
}

/**
 * 设置全局模板管理器实例
 */
export function setGlobalTemplateManager(manager: TemplateManager): void {
  globalTemplateManager = manager
}

/**
 * 创建模板管理器实例
 */
export function createTemplateManager(config: TemplateManagerConfig): TemplateManager {
  const manager = new TemplateManager(config)

  // 如果没有全局实例，设置为全局实例
  if (!globalTemplateManager) {
    setGlobalTemplateManager(manager)
  }

  return manager
}
