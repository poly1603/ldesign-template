import type { TemplateConfig } from '@ldesign/template-core'

/**
 * Tablet 平板端布局配置
 *
 * 平板端布局，可折叠侧边栏 + 顶栏
 */
export default {
  name: 'default',
  displayName: '平板端布局',
  description: '平板端布局，可折叠侧边栏 + 顶栏，适合 iPad 等平板设备',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['tablet', 'sidebar', 'responsive'],
  props: {
    /** 侧边栏宽度 */
    siderWidth: { type: Number, default: 200 },
    /** 侧边栏折叠后宽度 */
    siderCollapsedWidth: { type: Number, default: 64 },
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 56 },
    /** 是否固定顶栏 */
    fixedHeader: { type: Boolean, default: true },
    /** 是否固定侧边栏 */
    fixedSider: { type: Boolean, default: true },
    /** 侧边栏初始折叠状态 */
    defaultCollapsed: { type: Boolean, default: true },
    /** 是否显示页脚 */
    showFooter: { type: Boolean, default: false },
    /** 页脚高度 */
    footerHeight: { type: Number, default: 48 },
  },
} satisfies TemplateConfig

