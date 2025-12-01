import type { TemplateConfig } from '@ldesign/template-core'

/**
 * Portal 门户网站布局配置
 *
 * 顶部导航式布局，适合门户网站、官网等
 */
export default {
  name: 'portal',
  displayName: '门户网站布局',
  description: '顶部导航式布局，适合门户网站、官网、博客等',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['portal', 'top-nav', 'website'],
  props: {
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 64 },
    /** 是否固定顶栏 */
    fixedHeader: { type: Boolean, default: true },
    /** 是否显示页脚 */
    showFooter: { type: Boolean, default: true },
    /** 页脚高度 */
    footerHeight: { type: Number, default: 64 },
    /** 内容区最大宽度 */
    maxWidth: { type: Number, default: 1200 },
    /** 是否居中内容 */
    centered: { type: Boolean, default: true },
  },
} satisfies TemplateConfig

