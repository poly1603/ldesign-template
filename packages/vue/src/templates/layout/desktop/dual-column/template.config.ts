import type { TemplateConfig } from '@ldesign/template-core'

/**
 * DualColumn 双栏布局配置
 *
 * 左侧窄图标栏 + 次级菜单栏 + 顶栏 + 内容区
 */
export default {
  name: 'dual-column',
  displayName: '双栏布局',
  description: '图标栏 + 菜单栏 + 内容区，VS Code 风格',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['dual-column', 'vscode', 'icon-bar'],
  props: {
    /** 图标栏宽度 */
    iconBarWidth: { type: Number, default: 64 },
    /** 次级菜单栏宽度 */
    siderWidth: { type: Number, default: 200 },
    /** 次级菜单栏折叠后宽度 */
    siderCollapsedWidth: { type: Number, default: 0 },
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 56 },
    /** 是否固定顶栏 */
    fixedHeader: { type: Boolean, default: true },
    /** 次级菜单栏初始折叠状态 */
    defaultCollapsed: { type: Boolean, default: false },
    /** 是否显示页脚 */
    showFooter: { type: Boolean, default: false },
    /** 页脚高度 */
    footerHeight: { type: Number, default: 48 },
  },
} satisfies TemplateConfig

