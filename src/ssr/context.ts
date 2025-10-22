/**
 * SSR 上下文
 */

import type { TemplateMetadata } from '../types'

export interface SSRContext {
  /** 是否为 SSR 环境 */
  isSSR: boolean
  /** 当前请求 URL */
  url?: string
  /** 用户代理 */
  userAgent?: string
  /** 设备类型 */
  device?: 'desktop' | 'mobile' | 'tablet'
  /** 已加载的模板 */
  templates: Map<string, TemplateMetadata>
  /** 收集的样式 */
  styles: Set<string>
  /** 收集的脚本 */
  scripts: Set<string>
  /** 预加载的资源 */
  preloads: Set<string>
  /** 自定义数据 */
  data: Record<string, any>
}

/**
 * 创建 SSR 上下文
 */
export function createSSRContext(options: Partial<SSRContext> = {}): SSRContext {
  return {
    isSSR: true,
    templates: new Map(),
    styles: new Set(),
    scripts: new Set(),
    preloads: new Set(),
    data: {},
    ...options,
  }
}

/**
 * 检测设备类型（基于 User-Agent）
 */
export function detectDeviceFromUA(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
  const ua = userAgent.toLowerCase()

  // 移动设备检测
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone']
  if (mobileKeywords.some(keyword => ua.includes(keyword))) {
    return 'mobile'
  }

  // 平板检测
  const tabletKeywords = ['ipad', 'tablet', 'kindle']
  if (tabletKeywords.some(keyword => ua.includes(keyword))) {
    return 'tablet'
  }

  return 'desktop'
}



