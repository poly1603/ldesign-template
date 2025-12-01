import type { TemplateConfig } from '@ldesign/template-core'

/**
 * TopMenu 顶部菜单布局配置
 *
 * 顶部水平导航布局：顶栏包含 Logo 和水平菜单 + 内容区
 */
export default {
  name: 'top-menu',
  displayName: '顶部菜单布局',
  description: '顶部水平导航 + 内容区，适合菜单项较少的系统',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['top-menu', 'horizontal', 'navbar'],
  props: {
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 64 },
    /** 是否固定顶栏 */
    fixedHeader: { type: Boolean, default: true },
    /** 是否显示页脚 */
    showFooter: { type: Boolean, default: true },
    /** 页脚高度 */
    footerHeight: { type: Number, default: 48 },
    /** 内容区最大宽度 */
    maxContentWidth: { type: Number, default: 0 },
  },
} satisfies TemplateConfig

