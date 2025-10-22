/**
 * DevTools 面板
 * 提供可视化调试界面
 */

import { getDebugger } from './template-debugger'
import { getInspector } from './inspector'
import { getProfiler } from './performance-profiler'

export interface PanelTab {
  id: string
  label: string
  icon?: string
  component: string
}

export interface PanelState {
  visible: boolean
  activeTab: string
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  expanded: boolean
}

/**
 * DevTools 面板管理器
 */
export class DevToolsPanel {
  private state: PanelState = {
    visible: false,
    activeTab: 'inspector',
    position: 'bottom-right',
    expanded: false,
  }

  private tabs: PanelTab[] = [
    { id: 'inspector', label: '检查器', icon: '🔍' },
    { id: 'performance', label: '性能', icon: '⚡' },
    { id: 'debugger', label: '调试器', icon: '🐛' },
    { id: 'cache', label: '缓存', icon: '💾' },
  ]

  /**
   * 显示面板
   */
  show(): void {
    this.state.visible = true
    this.dispatchEvent('show')
  }

  /**
   * 隐藏面板
   */
  hide(): void {
    this.state.visible = false
    this.dispatchEvent('hide')
  }

  /**
   * 切换显示状态
   */
  toggle(): void {
    this.state.visible = !this.state.visible
    this.dispatchEvent(this.state.visible ? 'show' : 'hide')
  }

  /**
   * 切换标签
   */
  switchTab(tabId: string): void {
    if (this.tabs.some(tab => tab.id === tabId)) {
      this.state.activeTab = tabId
      this.dispatchEvent('tabChange', { tab: tabId })
    }
  }

  /**
   * 切换展开状态
   */
  toggleExpanded(): void {
    this.state.expanded = !this.state.expanded
    this.dispatchEvent('expandChange', { expanded: this.state.expanded })
  }

  /**
   * 设置位置
   */
  setPosition(position: PanelState['position']): void {
    this.state.position = position
    this.dispatchEvent('positionChange', { position })
  }

  /**
   * 获取状态
   */
  getState(): PanelState {
    return { ...this.state }
  }

  /**
   * 获取标签列表
   */
  getTabs(): PanelTab[] {
    return [...this.tabs]
  }

  /**
   * 获取当前数据
   */
  getCurrentData(): any {
    switch (this.state.activeTab) {
      case 'inspector':
        return getInspector().getActive()

      case 'performance':
        return getProfiler().generateReport()

      case 'debugger':
        return {
          logs: getDebugger().getLogs(),
          isPaused: getDebugger().isPaused(),
        }

      case 'cache':
        // 这里应该从 loader 获取缓存信息
        return { message: 'Cache data will be implemented' }

      default:
        return null
    }
  }

  /**
   * 分发事件
   */
  private dispatchEvent(type: string, detail?: any): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`devtools:${type}`, { detail }))
    }
  }
}

/**
 * 全局面板
 */
let globalPanel: DevToolsPanel | null = null

/**
 * 获取全局面板
 */
export function getPanel(): DevToolsPanel {
  if (!globalPanel) {
    globalPanel = new DevToolsPanel()
  }
  return globalPanel
}



