/**
 * Template State Manager
 * 
 * 模板状态管理器 - 框架无关的状态管理核心
 */

import type { TemplateRegistry } from '../registry/TemplateRegistry'
import type { TemplateMetadata } from '../types'

/**
 * 状态变更监听器
 */
export interface StateChangeListener<TComponent = unknown> {
  onCategoryChange?(category: string): void
  onDeviceChange?(device: string): void
  onTemplateChange?(template: TemplateMetadata<TComponent>): void
  onLoadingChange?(isLoading: boolean): void
  onError?(error: Error): void
}

/**
 * 当前状态快照
 */
export interface TemplateState<TComponent = unknown> {
  category: string
  device: string
  template: TemplateMetadata<TComponent> | null
  isLoading: boolean
  error: Error | null
}

/**
 * 模板状态管理器
 * 
 * 管理当前选中的分类、设备、模板等状态
 * 框架无关的纯逻辑实现
 */
export class TemplateStateManager<TComponent = unknown> {
  private currentCategory: string
  private currentDevice: string
  private currentTemplate: TemplateMetadata<TComponent> | null = null
  private isLoading = false
  private lastError: Error | null = null
  
  private listeners = new Set<StateChangeListener<TComponent>>()
  
  constructor(
    private registry: TemplateRegistry<TComponent>,
    initialCategory: string,
    initialDevice: string
  ) {
    this.currentCategory = initialCategory
    this.currentDevice = initialDevice
  }
  
  /**
   * 获取当前状态快照
   */
  getState(): TemplateState<TComponent> {
    return {
      category: this.currentCategory,
      device: this.currentDevice,
      template: this.currentTemplate,
      isLoading: this.isLoading,
      error: this.lastError,
    }
  }
  
  /**
   * 获取当前分类
   */
  getCategory(): string {
    return this.currentCategory
  }
  
  /**
   * 获取当前设备
   */
  getDevice(): string {
    return this.currentDevice
  }
  
  /**
   * 获取当前模板
   */
  getCurrentTemplate(): TemplateMetadata<TComponent> | null {
    return this.currentTemplate
  }
  
  /**
   * 设置分类
   */
  setCategory(category: string): void {
    if (this.currentCategory === category) return
    
    this.currentCategory = category
    this.notifyListeners('onCategoryChange', category)
    
    // 分类变更时，需要重新选择模板
    this.updateCurrentTemplate()
  }
  
  /**
   * 设置设备
   */
  setDevice(device: string): void {
    if (this.currentDevice === device) return
    
    this.currentDevice = device
    this.notifyListeners('onDeviceChange', device)
    
    // 设备变更时，需要重新选择模板
    this.updateCurrentTemplate()
  }
  
  /**
   * 设置当前模板
   */
  setCurrentTemplate(template: TemplateMetadata<TComponent> | null): void {
    this.currentTemplate = template
    if (template) {
      this.notifyListeners('onTemplateChange', template)
    }
  }
  
  /**
   * 更新当前模板（从注册表中选择合适的模板）
   */
  private updateCurrentTemplate(): void {
    const templates = this.registry.getTemplatesByCategory(this.currentCategory)
    
    // 优先查找当前设备的模板
    let template = templates.find(
      t => t.device === this.currentDevice && t.isDefault
    )
    
    // 如果没有默认模板，选择第一个匹配设备的
    if (!template) {
      template = templates.find(t => t.device === this.currentDevice)
    }
    
    // 如果当前设备没有模板，尝试通用设备
    if (!template) {
      template = templates.find(t => t.device === 'default')
    }
    
    this.setCurrentTemplate(template || null)
  }
  
  /**
   * 设置加载状态
   */
  setLoading(isLoading: boolean): void {
    if (this.isLoading === isLoading) return
    
    this.isLoading = isLoading
    this.notifyListeners('onLoadingChange', isLoading)
  }
  
  /**
   * 设置错误
   */
  setError(error: Error | null): void {
    this.lastError = error
    if (error) {
      this.notifyListeners('onError', error)
    }
  }
  
  /**
   * 获取可用的分类列表
   */
  getAvailableCategories(): string[] {
    return this.registry.getCategories()
  }
  
  /**
   * 获取可用的设备列表
   */
  getAvailableDevices(): string[] {
    return this.registry.getDevices()
  }
  
  /**
   * 获取当前分类下的模板列表
   */
  getTemplatesForCurrentCategory(): TemplateMetadata<TComponent>[] {
    return this.registry.getTemplatesByCategory(this.currentCategory)
  }
  
  /**
   * 获取当前设备下的模板列表
   */
  getTemplatesForCurrentDevice(): TemplateMetadata<TComponent>[] {
    return this.registry.getTemplatesByDevice(this.currentDevice)
  }
  
  /**
   * 获取当前分类和设备下的模板列表
   */
  getTemplatesForCurrent(): TemplateMetadata<TComponent>[] {
    return this.registry
      .getTemplatesByCategory(this.currentCategory)
      .filter(t => t.device === this.currentDevice)
  }
  
  /**
   * 切换到指定模板
   */
  switchToTemplate(name: string): boolean {
    const template = this.registry.getTemplate(
      this.currentCategory,
      this.currentDevice,
      name
    )
    
    if (!template) {
      this.setError(new Error(`Template not found: ${name}`))
      return false
    }
    
    this.setCurrentTemplate(template)
    return true
  }
  
  /**
   * 添加监听器
   */
  addListener(listener: StateChangeListener<TComponent>): () => void {
    this.listeners.add(listener)
    
    // 返回移除监听器的函数
    return () => {
      this.listeners.delete(listener)
    }
  }
  
  /**
   * 移除监听器
   */
  removeListener(listener: StateChangeListener<TComponent>): void {
    this.listeners.delete(listener)
  }
  
  /**
   * 通知所有监听器
   */
  private notifyListeners<K extends keyof StateChangeListener<TComponent>>(
    method: K,
    ...args: Parameters<Required<StateChangeListener<TComponent>>[K]>
  ): void {
    this.listeners.forEach(listener => {
      const handler = listener[method]
      if (handler) {
        // @ts-expect-error - complex generic type inference
        handler(...args)
      }
    })
  }
  
  /**
   * 清理所有监听器
   */
  dispose(): void {
    this.listeners.clear()
  }
}
