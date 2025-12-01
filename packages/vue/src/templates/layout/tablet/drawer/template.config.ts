import type { TemplateConfig } from '@ldesign/template-core'

/**
 * Drawer 平板端抽屉式侧边栏布局配置
 *
 * 抽屉式侧边栏 + 顶栏，点击触发侧边栏滑出
 */
export default {
  name: 'drawer',
  displayName: '抽屉式布局',
  description: '抽屉式侧边栏 + 顶栏，点击触发滑出',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['drawer', 'slide', 'tablet'],
  props: {
    /** 侧边栏宽度 */
    siderWidth: { type: Number, default: 280 },
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

