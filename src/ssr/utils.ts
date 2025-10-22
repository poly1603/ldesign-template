/**
 * SSR 工具函数
 */

/**
 * 提取关键 CSS
 */
export function extractCriticalCSS(html: string, allStyles: string): string {
  // 简化版：提取在 HTML 中实际使用的选择器
  const usedSelectors = new Set<string>()

  // 提取 class
  const classMatches = html.matchAll(/class="([^"]*)"/g)
  for (const match of classMatches) {
    const classes = match[1].split(' ')
    classes.forEach(cls => {
      if (cls) usedSelectors.add(`.${cls}`)
    })
  }

  // 提取 id
  const idMatches = html.matchAll(/id="([^"]*)"/g)
  for (const match of idMatches) {
    const id = match[1]
    if (id) usedSelectors.add(`#${id}`)
  }

  // 简化的 CSS 过滤（实际应使用 CSS 解析器）
  const lines = allStyles.split('\n')
  const criticalCSS: string[] = []

  for (const line of lines) {
    for (const selector of usedSelectors) {
      if (line.includes(selector)) {
        criticalCSS.push(line)
        break
      }
    }
  }

  return criticalCSS.join('\n')
}

/**
 * 生成预加载链接
 */
export function generatePreloadLinks(resources: string[]): string {
  return resources
    .map(resource => {
      const ext = resource.split('.').pop()?.toLowerCase()
      let as = 'fetch'

      switch (ext) {
        case 'js':
          as = 'script'
          break
        case 'css':
          as = 'style'
          break
        case 'woff':
        case 'woff2':
        case 'ttf':
          as = 'font'
          break
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'webp':
        case 'svg':
          as = 'image'
          break
      }

      return `<link rel="preload" href="${resource}" as="${as}"${as === 'font' ? ' crossorigin' : ''}>`
    })
    .join('\n')
}

/**
 * 内联关键 CSS
 */
export function inlineCSS(css: string): string {
  return `<style>${css}</style>`
}

/**
 * 生成 noscript 降级内容
 */
export function generateNoScript(message: string = '请启用 JavaScript 以获得最佳体验'): string {
  return `<noscript><div style="padding: 20px; text-align: center; color: #666;">${message}</div></noscript>`
}

/**
 * 压缩 HTML
 */
export function minifyHTML(html: string): string {
  return html
    // 移除注释
    .replace(/<!--[\s\S]*?-->/g, '')
    // 移除多余空白
    .replace(/\s+/g, ' ')
    // 移除标签间空白
    .replace(/>\s+</g, '><')
    .trim()
}

/**
 * 注入内联脚本
 */
export function injectScript(html: string, script: string, position: 'head' | 'body' = 'body'): string {
  const scriptTag = `<script>${script}</script>`

  if (position === 'head') {
    return html.replace('</head>', `${scriptTag}\n</head>`)
  }

  return html.replace('</body>', `${scriptTag}\n</body>`)
}

/**
 * 注入元标签
 */
export function injectMeta(html: string, meta: Record<string, string>): string {
  const metaTags = Object.entries(meta)
    .map(([name, content]) => `<meta name="${name}" content="${content}">`)
    .join('\n')

  return html.replace('</head>', `${metaTags}\n</head>`)
}



