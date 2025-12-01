import type { TemplateConfig } from '@ldesign/template-core'

/**
 * Admin 后台管理布局配置
 *
 * 经典的后台管理系统布局：左侧边栏 + 顶栏 + 内容区
 */
export default {
  name: 'admin',
  displayName: '后台管理布局',
  description: '经典后台管理布局，包含侧边栏、顶栏、标签栏和内容区',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['admin', 'sidebar', 'classic'],
  props: {
    /** 侧边栏宽度 */
    siderWidth: { type: Number, default: 240 },
    /** 侧边栏折叠后宽度 */
    siderCollapsedWidth: { type: Number, default: 64 },
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 64 },
    /** 标签栏高度 */
    tabsHeight: { type: Number, default: 40 },
    /** 是否显示标签栏 */
    showTabs: { type: Boolean, default: true },
    /** 是否显示页脚 */
    showFooter: { type: Boolean, default: true },
    /** 页脚高度 */
    footerHeight: { type: Number, default: 48 },
    /** 侧边栏初始折叠状态 */
    defaultCollapsed: { type: Boolean, default: false },
    /** 是否固定顶栏 */
    fixedHeader: { type: Boolean, default: true },
    /** 是否固定侧边栏 */
    fixedSider: { type: Boolean, default: true },
  },
} satisfies TemplateConfig

