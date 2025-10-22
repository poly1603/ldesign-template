/**
 * SSR 渲染测试
 */

import { describe, it, expect } from 'vitest'
import { createSSRContext, detectDeviceFromUA } from '../../src/ssr/context'
import { inlineCSS, generatePreloadLinks, minifyHTML } from '../../src/ssr/utils'

describe('SSR Context', () => {
  it('should create SSR context', () => {
    const context = createSSRContext()

    expect(context.isSSR).toBe(true)
    expect(context.templates).toBeInstanceOf(Map)
    expect(context.styles).toBeInstanceOf(Set)
  })

  it('should detect device from user agent', () => {
    expect(detectDeviceFromUA('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)')).toBe('mobile')
    expect(detectDeviceFromUA('Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)')).toBe('tablet')
    expect(detectDeviceFromUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('desktop')
  })
})

describe('SSR Utils', () => {
  it('should inline CSS', () => {
    const css = 'body { color: red; }'
    const result = inlineCSS(css)

    expect(result).toContain('<style>')
    expect(result).toContain(css)
  })

  it('should generate preload links', () => {
    const resources = ['script.js', 'style.css', 'font.woff2']
    const links = generatePreloadLinks(resources)

    expect(links).toContain('rel="preload"')
    expect(links).toContain('as="script"')
    expect(links).toContain('as="style"')
    expect(links).toContain('as="font"')
  })

  it('should minify HTML', () => {
    const html = `
      <div>
        <p>  Test  </p>
      </div>
    `

    const minified = minifyHTML(html)
    expect(minified).not.toContain('\n')
    expect(minified.length).toBeLessThan(html.length)
  })
})


