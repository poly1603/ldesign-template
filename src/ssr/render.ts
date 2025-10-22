/**
 * SSR 渲染工具
 */

import type { Component } from 'vue'
import { renderToString as vueRenderToString } from 'vue/server-renderer'
import { createSSRApp, h } from 'vue'
import type { SSRContext } from './context'
import { getManager } from '../core/manager'

export interface RenderOptions {
  /** SSR 上下文 */
  context?: SSRContext
  /** 是否内联样式 */
  inlineStyles?: boolean
  /** 是否生成预加载链接 */
  generatePreloads?: boolean
  /** 自定义应用配置 */
  appConfig?: (app: any) => void
}

export interface RenderResult {
  /** 渲染的 HTML */
  html: string
  /** 收集的样式 */
  styles: string[]
  /** 收集的脚本 */
  scripts: string[]
  /** 预加载链接 */
  preloads: string[]
  /** SSR 上下文 */
  context: SSRContext
}

/**
 * 渲染模板为字符串（SSR）
 */
export async function renderToString(
  category: string,
  device: string,
  name: string,
  props: Record<string, any> = {},
  options: RenderOptions = {}
): Promise<RenderResult> {
  const context = options.context || {
    isSSR: true,
    device,
    templates: new Map(),
    styles: new Set(),
    scripts: new Set(),
    preloads: new Set(),
    data: {},
  }

  try {
    // 加载模板
    const manager = getManager()
    await manager.initialize()

    const component = await manager.loadTemplate(category, device, name)

    // 创建 SSR 应用
    const app = createSSRApp({
      render: () => h(component as Component, props),
    })

    // 应用自定义配置
    if (options.appConfig) {
      options.appConfig(app)
    }

    // 提供 SSR 上下文
    app.provide('ssrContext', context)

    // 渲染为字符串
    const html = await vueRenderToString(app, context)

    // 收集资源
    const result: RenderResult = {
      html,
      styles: Array.from(context.styles),
      scripts: Array.from(context.scripts),
      preloads: options.generatePreloads ? Array.from(context.preloads) : [],
      context,
    }

    return result
  } catch (error) {
    console.error('[SSR] Render failed:', error)
    throw error
  }
}

/**
 * 渲染完整 HTML 页面
 */
export async function renderFullPage(
  category: string,
  device: string,
  name: string,
  props: Record<string, any> = {},
  options: RenderOptions & {
    title?: string
    meta?: Array<{ name?: string; property?: string; content: string }>
    lang?: string
  } = {}
): Promise<string> {
  const result = await renderToString(category, device, name, props, options)

  const title = options.title || 'LDesign Template'
  const lang = options.lang || 'zh-CN'
  const meta = options.meta || []

  // 构建完整 HTML
  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${meta.map(m => {
    const attrs = Object.entries(m)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')
    return `<meta ${attrs}>`
  }).join('\n  ')}
  ${result.preloads.map(href => `<link rel="preload" href="${href}">`).join('\n  ')}
  ${result.styles.map(style =>
    options.inlineStyles
      ? `<style>${style}</style>`
      : `<link rel="stylesheet" href="${style}">`
  ).join('\n  ')}
</head>
<body>
  <div id="app">${result.html}</div>
  ${result.scripts.map(src => `<script type="module" src="${src}"></script>`).join('\n  ')}
  <script type="module">
    // Hydration data
    window.__SSR_CONTEXT__ = ${JSON.stringify(result.context.data)}
  </script>
</body>
</html>
  `.trim()

  return html
}

/**
 * 渲染为静态 HTML（SSG）
 */
export async function renderStatic(
  category: string,
  device: string,
  name: string,
  props: Record<string, any> = {},
  options: RenderOptions = {}
): Promise<string> {
  return renderFullPage(category, device, name, props, {
    ...options,
    inlineStyles: true, // 静态生成默认内联样式
    generatePreloads: false, // 静态生成不需要预加载
  })
}



