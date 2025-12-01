import type { TemplateConfig } from '@ldesign/template-core'

/**
 * Mix 混合布局配置
 *
 * 顶部一级导航 + 左侧二级导航 + 内容区
 */
export default {
  name: 'mix',
  displayName: '混合布局',
  description: '顶部一级导航 + 左侧二级导航，适合大型后台系统',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['mix', 'hybrid', 'two-level'],
  props: {
    /** 侧边栏宽度 */
    siderWidth: { type: Number, default: 200 },
    /** 侧边栏折叠后宽度 */
    siderCollapsedWidth: { type: Number, default: 48 },
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 64 },
    /** 是否固定顶栏 */
    fixedHeader: { type: Boolean, default: true },
    /** 是否固定侧边栏 */
    fixedSider: { type: Boolean, default: true },
    /** 侧边栏初始折叠状态 */
    defaultCollapsed: { type: Boolean, default: false },
    /** 是否显示页脚 */
    showFooter: { type: Boolean, default: true },
    /** 页脚高度 */
    footerHeight: { type: Number, default: 48 },
  },
} satisfies TemplateConfig

