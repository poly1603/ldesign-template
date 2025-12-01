import type { TemplateConfig } from '@ldesign/template-core'

/**
 * Blank 空白布局配置
 *
 * 无任何装饰的空白布局，适合登录页、错误页等
 */
export default {
  name: 'blank',
  displayName: '空白布局',
  description: '无任何装饰的空白布局，适合登录页、错误页、打印页等',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['blank', 'empty', 'clean'],
  props: {
    /** 背景色 */
    background: { type: String, default: '#f0f2f5' },
    /** 是否居中内容 */
    centered: { type: Boolean, default: false },
    /** 内边距 */
    padding: { type: Number, default: 0 },
  },
} satisfies TemplateConfig

