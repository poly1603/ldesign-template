/**
 * SSR 水合（Hydration）工具
 */

import type { Component } from 'vue'
import { createSSRApp, h } from 'vue'
import type { SSRContext } from './context'

export interface HydrateOptions {
  /** 挂载点选择器 */
  selector?: string
  /** SSR 上下文数据 */
  ssrContext?: Partial<SSRContext>
  /** 水合前钩子 */
  beforeHydrate?: () => void | Promise<void>
  /** 水合后钩子 */
  afterHydrate?: () => void
  /** 应用配置 */
  appConfig?: (app: any) => void
}

/**
 * 水合 SSR 渲染的内容
 */
export async function hydrate(
  component: Component,
  props: Record<string, any> = {},
  options: HydrateOptions = {}
): Promise<void> {
  const selector = options.selector || '#app'

  try {
    // 执行水合前钩子
    if (options.beforeHydrate) {
      await options.beforeHydrate()
    }

    // 获取 SSR 上下文
    const ssrContext: Partial<SSRContext> = options.ssrContext ||
      (typeof window !== 'undefined' ? (window as any).__SSR_CONTEXT__ : {})

    // 创建应用
    const app = createSSRApp({
      render: () => h(component, props),
    })

    // 应用配置
    if (options.appConfig) {
      options.appConfig(app)
    }

    // 提供 SSR 上下文
    if (ssrContext) {
      app.provide('ssrContext', ssrContext)
    }

    // 水合
    const container = document.querySelector(selector)
    if (!container) {
      throw new Error(`Hydration container not found: ${selector}`)
    }

    app.mount(container, true) // true 表示水合模式

    // 执行水合后钩子
    if (options.afterHydrate) {
      options.afterHydrate()
    }

    // 清理 SSR 数据
    if (typeof window !== 'undefined') {
      delete (window as any).__SSR_CONTEXT__
    }
  } catch (error) {
    console.error('[Hydrate] Failed:', error)
    throw error
  }
}

/**
 * 检查是否为水合环境
 */
export function isHydrating(): boolean {
  if (typeof window === 'undefined') return false
  return '__SSR_CONTEXT__' in window
}

/**
 * 获取 SSR 数据
 */
export function getSSRData<T = any>(key: string, defaultValue?: T): T | undefined {
  if (typeof window === 'undefined') return defaultValue

  const context = (window as any).__SSR_CONTEXT__
  if (!context) return defaultValue

  return context[key] ?? defaultValue
}

/**
 * 创建水合应用
 */
export function createHydrateApp(
  component: Component,
  props: Record<string, any> = {},
  options: Omit<HydrateOptions, 'selector'> = {}
) {
  const ssrContext: Partial<SSRContext> = options.ssrContext ||
    (typeof window !== 'undefined' ? (window as any).__SSR_CONTEXT__ : {})

  const app = createSSRApp({
    render: () => h(component, props),
  })

  if (options.appConfig) {
    options.appConfig(app)
  }

  if (ssrContext) {
    app.provide('ssrContext', ssrContext)
  }

  return app
}
