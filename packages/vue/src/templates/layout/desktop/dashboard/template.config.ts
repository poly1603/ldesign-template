import type { TemplateConfig } from '@ldesign/template-core'

/**
 * Dashboard 仪表盘布局配置
 *
 * 全屏仪表盘布局，适合数据可视化大屏
 */
export default {
  name: 'dashboard',
  displayName: '仪表盘布局',
  description: '全屏仪表盘布局，适合数据可视化大屏、监控中心等',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['dashboard', 'fullscreen', 'visualization'],
  props: {
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 56 },
    /** 是否显示顶栏 */
    showHeader: { type: Boolean, default: true },
    /** 背景色 */
    background: { type: String, default: '#0d1117' },
    /** 内边距 */
    padding: { type: Number, default: 16 },
  },
} satisfies TemplateConfig

