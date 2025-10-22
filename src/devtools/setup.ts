/**
 * DevTools 设置和初始化
 */

import type { App } from 'vue'

export interface DevToolsConfig {
  /** 是否启用 */
  enabled?: boolean
  /** 面板位置 */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** 是否默认展开 */
  defaultExpanded?: boolean
  /** 快捷键 */
  shortcut?: string
  /** 性能监控 */
  performance?: boolean
  /** 模板检查器 */
  inspector?: boolean
}

let devToolsEnabled = false

/**
 * 设置开发者工具
 */
export function setupDevTools(app: App, config: DevToolsConfig = {}): void {
  // 仅在开发环境启用
  if (import.meta.env.PROD && !config.enabled) {
    return
  }

  devToolsEnabled = true

  // 注册全局属性
  app.config.globalProperties.$devtools = {
    enabled: true,
    config,
  }

  // 在 window 上暴露 API
  if (typeof window !== 'undefined') {
    (window as any).__LDESIGN_DEVTOOLS__ = {
      version: '1.0.0',
      enabled: true,
      config,
    }

    // 注册快捷键
    if (config.shortcut) {
      document.addEventListener('keydown', (e) => {
        if (matchShortcut(e, config.shortcut!)) {
          toggleDevToolsPanel()
        }
      })
    }
  }

  console.log('[DevTools] Initialized', config)
}

/**
 * 检查是否启用 DevTools
 */
export function isDevToolsEnabled(): boolean {
  return devToolsEnabled
}

/**
 * 匹配快捷键
 */
function matchShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const parts = shortcut.toLowerCase().split('+')

  const modifiers = {
    ctrl: event.ctrlKey,
    meta: event.metaKey,
    alt: event.altKey,
    shift: event.shiftKey,
  }

  const key = parts[parts.length - 1]
  const requiredModifiers = parts.slice(0, -1)

  // 检查所有修饰键
  for (const [mod, pressed] of Object.entries(modifiers)) {
    const required = requiredModifiers.includes(mod)
    if (required !== pressed) {
      return false
    }
  }

  // 检查按键
  return event.key.toLowerCase() === key
}

/**
 * 切换 DevTools 面板
 */
function toggleDevToolsPanel(): void {
  const event = new CustomEvent('devtools:toggle')
  window.dispatchEvent(event)
}



