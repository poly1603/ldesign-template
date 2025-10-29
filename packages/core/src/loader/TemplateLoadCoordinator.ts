/**
 * Template Load Coordinator
 * 
 * 模板加载协调器 - 泛型实现，框架无关
 */

import type { ComponentLoader, StyleLoader, TemplateLoadOptions } from '../types'
import type { TemplateRegistry } from '../registry/TemplateRegistry'

/**
 * 模板加载协调器
 * 
 * 协调组件加载、样式加载、缓存等
 * 使用泛型支持任意框架的组件类型
 */
export class TemplateLoadCoordinator<TComponent = unknown> {
  private loadingPromises = new Map<string, Promise<TComponent>>()
  
  constructor(
    private componentLoader: ComponentLoader<TComponent>,
    private registry: TemplateRegistry<TComponent>,
    private styleLoader?: StyleLoader
  ) {}
  
  /**
   * 生成加载键
   */
  private createKey(category: string, device: string, name: string): string {
    return `${category}/${device}/${name}`
  }
  
  /**
   * 加载模板
   */
  async loadTemplate(
    category: string,
    device: string,
    name: string,
    options?: TemplateLoadOptions
  ): Promise<TComponent> {
    const key = this.createKey(category, device, name)
    
    // 检查是否正在加载（避免重复加载）
    const pending = this.loadingPromises.get(key)
    if (pending) {
      return pending
    }
    
    // 从注册表获取模板信息
    const template = this.registry.getTemplate(category, device, name)
    if (!template) {
      const error = new Error(`Template not found: ${key}`)
      options?.onError?.(error)
      throw error
    }
    
    // 创建加载 Promise
    const loadPromise = this.performLoad(template, options)
    this.loadingPromises.set(key, loadPromise)
    
    try {
      const component = await loadPromise
      options?.onLoad?.(component)
      return component
    } finally {
      // 加载完成后清理
      this.loadingPromises.delete(key)
    }
  }
  
  /**
   * 执行加载（内部方法）
   */
  private async performLoad(
    template: any,
    options?: TemplateLoadOptions
  ): Promise<TComponent> {
    // 加载样式（如果有）
    if (this.styleLoader && template.stylePath) {
      try {
        await this.styleLoader.load(template.stylePath)
      } catch (error) {
        console.warn('[TemplateLoadCoordinator] Style load failed:', error)
        // 样式加载失败不影响组件加载
      }
    }
    
    // 加载组件
    let loadPromise: Promise<TComponent>
    
    if (template.loader) {
      // 使用注册表的 loader
      loadPromise = template.loader()
    } else if (template.componentPath) {
      // 使用组件加载器
      loadPromise = this.componentLoader.load(template.componentPath)
    } else {
      throw new Error('No loader or component path provided')
    }
    
    // 处理超时
    if (options?.timeout) {
      loadPromise = Promise.race([
        loadPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Load timeout')), options.timeout)
        ),
      ])
    }
    
    return loadPromise
  }
  
  /**
   * 切换模板（可以添加预加载、过渡等逻辑）
   */
  async switchTemplate(
    fromKey: { category: string; device: string; name: string },
    toKey: { category: string; device: string; name: string },
    options?: TemplateLoadOptions
  ): Promise<TComponent> {
    // 可以在这里添加切换逻辑：
    // 1. 预加载新模板
    // 2. 卸载旧模板的样式
    // 3. 触发过渡动画
    // 4. 清理旧模板的缓存
    
    // 卸载旧样式
    if (this.styleLoader?.unload) {
      const oldTemplate = this.registry.getTemplate(
        fromKey.category,
        fromKey.device,
        fromKey.name
      )
      if (oldTemplate?.stylePath) {
        this.styleLoader.unload(oldTemplate.stylePath)
      }
    }
    
    // 加载新模板
    return this.loadTemplate(
      toKey.category,
      toKey.device,
      toKey.name,
      options
    )
  }
  
  /**
   * 预加载模板
   */
  async preloadTemplate(
    category: string,
    device: string,
    name: string
  ): Promise<void> {
    try {
      await this.loadTemplate(category, device, name, { preload: true })
    } catch (error) {
      console.warn(`[TemplateLoadCoordinator] Preload failed: ${category}/${device}/${name}`, error)
    }
  }
  
  /**
   * 批量预加载
   */
  async preloadBatch(
    templates: Array<{ category: string; device: string; name: string }>
  ): Promise<void> {
    await Promise.allSettled(
      templates.map(t => this.preloadTemplate(t.category, t.device, t.name))
    )
  }
  
  /**
   * 获取正在加载的数量
   */
  getLoadingCount(): number {
    return this.loadingPromises.size
  }
  
  /**
   * 取消所有加载
   */
  cancelAll(): void {
    this.loadingPromises.clear()
  }
}
