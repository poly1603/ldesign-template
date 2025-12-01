import type { TemplateConfig } from '@ldesign/template-core'

/**
 * Mobile 移动端布局配置
 *
 * 移动端布局，底部导航 + 顶栏
 */
export default {
  name: 'default',
  displayName: '移动端布局',
  description: '移动端布局，包含顶栏和底部导航栏',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['mobile', 'bottom-nav', 'app'],
  props: {
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 48 },
    /** 是否显示顶栏 */
    showHeader: { type: Boolean, default: true },
    /** 是否固定顶栏 */
    fixedHeader: { type: Boolean, default: true },
    /** 底部导航高度 */
    tabBarHeight: { type: Number, default: 56 },
    /** 是否显示底部导航 */
    showTabBar: { type: Boolean, default: true },
    /** 是否固定底部导航 */
    fixedTabBar: { type: Boolean, default: true },
    /** 是否启用安全区域 */
    safeArea: { type: Boolean, default: true },
  },
} satisfies TemplateConfig

