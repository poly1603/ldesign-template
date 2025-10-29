/**
 * Template Orchestrator
 * 
 * 模板编排器 - 整合加载协调器和状态管理器
 */

import type { TemplateLoadCoordinator } from '../loader/TemplateLoadCoordinator'
import type { TemplateStateManager } from './TemplateStateManager'
import type { TemplateLoadOptions } from '../types'

/**
 * 编排器配置
 */
export interface OrchestratorOptions {
  /**
   * 是否在初始化时自动加载默认模板
   */
  autoLoad?: boolean
  
  /**
   * 是否启用预加载
   */
  enablePreload?: boolean
  
  /**
   * 预加载策略
   */
  preloadStrategy?: 'adjacent' | 'all' | 'none'
  
  /**
   * 加载超时时间（毫秒）
   */
  loadTimeout?: number
}

/**
 * 模板编排器
 * 
 * 协调加载和状态管理，提供统一的高层 API
 */
export class TemplateOrchestrator<TComponent = unknown> {
  private loadedComponent: TComponent | null = null
  
  constructor(
    private stateManager: TemplateStateManager<TComponent>,
    private loadCoordinator: TemplateLoadCoordinator<TComponent>,
    private options: OrchestratorOptions = {}
  ) {
    // 监听模板变更，自动加载
    if (this.options.autoLoad !== false) {
      this.stateManager.addListener({
        onTemplateChange: (template) => {
          this.loadCurrentTemplate().catch(error => {
            console.error('[TemplateOrchestrator] Auto-load failed:', error)
          })
        },
      })
    }
  }
  
  /**
   * 初始化
   */
  async initialize(): Promise<void> {
    if (this.options.autoLoad !== false) {
      await this.loadCurrentTemplate()
    }
    
    if (this.options.enablePreload) {
      await this.performPreload()
    }
  }
  
  /**
   * 加载当前模板
   */
  async loadCurrentTemplate(options?: TemplateLoadOptions): Promise<TComponent | null> {
    const template = this.stateManager.getCurrentTemplate()
    
    if (!template) {
      this.stateManager.setError(new Error('No template selected'))
      return null
    }
    
    this.stateManager.setLoading(true)
    this.stateManager.setError(null)
    
    try {
      const component = await this.loadCoordinator.loadTemplate(
        template.category,
        template.device,
        template.name,
        {
          timeout: this.options.loadTimeout,
          ...options,
        }
      )
      
      this.loadedComponent = component
      this.stateManager.setLoading(false)
      
      return component
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.stateManager.setError(err)
      this.stateManager.setLoading(false)
      throw error
    }
  }
  
  /**
   * 切换分类
   */
  async switchCategory(category: string, options?: TemplateLoadOptions): Promise<TComponent | null> {
    this.stateManager.setCategory(category)
    
    // autoLoad 模式下会自动触发加载
    if (this.options.autoLoad === false) {
      return this.loadCurrentTemplate(options)
    }
    
    return null
  }
  
  /**
   * 切换设备
   */
  async switchDevice(device: string, options?: TemplateLoadOptions): Promise<TComponent | null> {
    this.stateManager.setDevice(device)
    
    // autoLoad 模式下会自动触发加载
    if (this.options.autoLoad === false) {
      return this.loadCurrentTemplate(options)
    }
    
    return null
  }
  
  /**
   * 切换模板
   */
  async switchTemplate(name: string, options?: TemplateLoadOptions): Promise<TComponent | null> {
    const currentTemplate = this.stateManager.getCurrentTemplate()
    
    if (!currentTemplate) {
      throw new Error('No current template')
    }
    
    const success = this.stateManager.switchToTemplate(name)
    
    if (!success) {
      return null
    }
    
    const newTemplate = this.stateManager.getCurrentTemplate()
    
    if (!newTemplate) {
      return null
    }
    
    // 使用协调器的 switchTemplate 方法（支持样式卸载等）
    return this.loadCoordinator.switchTemplate(
      {
        category: currentTemplate.category,
        device: currentTemplate.device,
        name: currentTemplate.name,
      },
      {
        category: newTemplate.category,
        device: newTemplate.device,
        name: newTemplate.name,
      },
      {
        timeout: this.options.loadTimeout,
        ...options,
      }
    )
  }
  
  /**
   * 执行预加载
   */
  private async performPreload(): Promise<void> {
    const strategy = this.options.preloadStrategy || 'adjacent'
    
    if (strategy === 'none') {
      return
    }
    
    const currentTemplate = this.stateManager.getCurrentTemplate()
    
    if (!currentTemplate) {
      return
    }
    
    if (strategy === 'all') {
      // 预加载当前分类和设备的所有模板
      const templates = this.stateManager.getTemplatesForCurrent()
      await this.loadCoordinator.preloadBatch(
        templates.map(t => ({
          category: t.category,
          device: t.device,
          name: t.name,
        }))
      )
    } else if (strategy === 'adjacent') {
      // 预加载相邻模板（简单实现：预加载同分类同设备的其他模板）
      const templates = this.stateManager.getTemplatesForCurrent()
        .filter(t => t.name !== currentTemplate.name)
        .slice(0, 2) // 只预加载前两个
      
      await this.loadCoordinator.preloadBatch(
        templates.map(t => ({
          category: t.category,
          device: t.device,
          name: t.name,
        }))
      )
    }
  }
  
  /**
   * 手动预加载指定模板
   */
  async preload(category: string, device: string, name: string): Promise<void> {
    await this.loadCoordinator.preloadTemplate(category, device, name)
  }
  
  /**
   * 获取当前加载的组件
   */
  getLoadedComponent(): TComponent | null {
    return this.loadedComponent
  }
  
  /**
   * 获取状态管理器（用于更细粒度的控制）
   */
  getStateManager(): TemplateStateManager<TComponent> {
    return this.stateManager
  }
  
  /**
   * 获取加载协调器（用于更细粒度的控制）
   */
  getLoadCoordinator(): TemplateLoadCoordinator<TComponent> {
    return this.loadCoordinator
  }
  
  /**
   * 清理资源
   */
  dispose(): void {
    this.stateManager.dispose()
    this.loadCoordinator.cancelAll()
    this.loadedComponent = null
  }
}
