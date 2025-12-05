/**
 * 组件模块导出
 */

export { default as TemplateRenderer } from './TemplateRenderer.vue'
export { default as TemplateSelector } from './TemplateSelector.vue'
export { default as TemplateSwitcher } from './TemplateSwitcher'

// 布局组件
export {
  LayoutHeader,
  LayoutSider,
  LayoutContent,
  LayoutFooter,
} from './layout'

// 注意：LayoutTabs 已迁移到 @ldesign/bookmark-vue 包中
// 请使用: import { ChromeTabs } from '@ldesign/bookmark-vue'