import type { TemplateConfig } from '@ldesign/template-core'

/**
 * TopMenu 平板端顶部菜单布局配置
 *
 * 顶部导航栏 + 内容区
 */
export default {
  name: 'top-menu',
  displayName: '顶部菜单布局',
  description: '顶部水平导航 + 内容区，适合菜单项较少的应用',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['top-menu', 'horizontal', 'tablet'],
  props: {
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 56 },
    /** 是否固定顶栏 */
    fixedHeader: { type: Boolean, default: true },
    /** 是否显示页脚 */
    showFooter: { type: Boolean, default: false },
    /** 页脚高度 */
    footerHeight: { type: Number, default: 48 },
  },
} satisfies TemplateConfig

