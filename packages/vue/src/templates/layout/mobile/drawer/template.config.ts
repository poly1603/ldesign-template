import type { TemplateConfig } from '@ldesign/template-core'

/**
 * Drawer 移动端抽屉式布局配置
 *
 * 顶栏（汉堡菜单）+ 抽屉式侧边栏 + 内容区
 */
export default {
  name: 'drawer',
  displayName: '抽屉式布局',
  description: '汉堡菜单 + 抽屉式侧边栏，适合菜单项较多的应用',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['drawer', 'hamburger', 'mobile'],
  props: {
    /** 顶栏高度 */
    headerHeight: { type: Number, default: 48 },
    /** 是否固定顶栏 */
    fixedHeader: { type: Boolean, default: true },
    /** 侧边栏宽度 */
    siderWidth: { type: Number, default: 280 },
    /** 是否启用安全区域 */
    safeArea: { type: Boolean, default: true },
  },
} satisfies TemplateConfig

