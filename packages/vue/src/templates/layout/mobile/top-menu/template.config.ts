import type { TemplateConfig } from '@ldesign/template-core'

/**
 * TopMenu 移动端顶部导航布局配置
 *
 * 顶栏（下拉菜单）+ 内容区
 */
export default {
  name: 'top-menu',
  displayName: '顶部导航布局',
  description: '顶部下拉菜单 + 内容区，简洁轻量',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['top-menu', 'dropdown', 'mobile'],
  props: {
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 48 },
    /** 是否固定顶栏 */
    fixedHeader: { type: Boolean, default: true },
    /** 是否启用安全区域 */
    safeArea: { type: Boolean, default: true },
  },
} satisfies TemplateConfig

