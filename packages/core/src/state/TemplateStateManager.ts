/**
 * Template State Manager
 * 
 * 纯 JavaScript 状态管理，使用观察者模式
 * 框架无关，可被任何框架适配
 */

export interface TemplateState {
  /** 当前模板分类 */
  category: string
  /** 当前设备类型 */
  device: string
  /** 当前模板名称 */
  template: string
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: Error | null
}

export type StateChangeListener = (state: Readonly<TemplateState>) => void

/**
 * 模板状态管理器
 * 
 * 使用观察者模式管理状态变化
 * 任何状态更新都会通知所有订阅者
 */
export class TemplateStateManager {
  private state: TemplateState
  private listeners = new Set<StateChangeListener>()
  
  constructor(initial: Partial<TemplateState> = {}) {
    this.state = {
      category: '',
      device: 'desktop',
      template: '',
      loading: false,
      error: null,
      ...initial,
    }
  }
  
  /**
   * 获取当前状态（只读副本）
   */
  getState(): Readonly<TemplateState> {
    return { ...this.state }
  }
  
  /**
   * 更新状态（部分更新）
   */
  setState(partial: Partial<TemplateState>): void {
    this.state = { ...this.state, ...partial }
    this.notify()
  }
  
  /**
   * 订阅状态变化
   * 
   * @returns 取消订阅函数
   */
  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener)
    
    // 返回取消订阅函数
    return () => {
      this.listeners.delete(listener)
    }
  }
  
  /**
   * 通知所有订阅者
   */
  private notify(): void {
    const state = this.getState()
    this.listeners.forEach(listener => {
      try {
        listener(state)
      } catch (error) {
        console.error('[TemplateStateManager] Listener error:', error)
      }
    })
  }
  
  /**
   * 清理所有订阅
   */
  destroy(): void {
    this.listeners.clear()
  }
}
