/**
 * @ldesign/template-vue
 * Vue 3 模板管理系统
 */

// 导出核心类型 (从 core 包重新导出)
export type {
  TemplateMetadata,
  TemplateConfig as CoreTemplateConfig,
} from '@ldesign/template-core'

// 导出配置类型
export type {
  DeviceType,
  TemplateChangeInfo,
  DeviceTemplateConfig,
  CategoryTemplateConfig,
  TemplateSelectorConfig,
  TemplateCacheConfig,
  BreakpointConfig,
  TemplateConfig,
} from './types/config'

// 导出扫描器
export { TemplateScanner, createTemplateScanner } from './scanner'

// 导出 Vue 插件（直接使用）
export { createTemplatePlugin, type TemplatePluginOptions } from './plugin'

// 导出引擎插件（与其他包统一）
export {
  createTemplateEnginePlugin,
  type TemplateEnginePluginOptions,
} from './plugins'

// 导出 Composables
export {
  useTemplate,
  useTemplateList,
  useAutoDevice,
  getCurrentDeviceType,
  // 布局相关 composables
  useLayout,
  useSider,
  type UseTemplateReturn,
  type UseTemplateOptions,
  type UseTemplateListReturn,
  type UseAutoDeviceReturn,
  type UseAutoDeviceOptions,
  // 布局相关类型
  type LayoutMode,
  type LayoutState,
  type UseLayoutReturn,
  type UseLayoutOptions,
  type SiderState,
  type UseSiderReturn,
  type UseSiderOptions,
} from './composables'

// 注意：useRouteTabs 已迁移到 @ldesign/bookmark-vue 包中

// 导出组件
export {
  TemplateRenderer,
  TemplateSelector,
  // 布局组件
  LayoutHeader,
  LayoutSider,
  LayoutContent,
  LayoutFooter,
} from './components'

// 注意：LayoutTabs 已迁移到 @ldesign/bookmark-vue 包中
// 请使用: import { ChromeTabs } from '@ldesign/bookmark-vue'

// 导出指令
export {
  vTemplateDevice,
  vTemplateCategory,
  createTemplateDeviceDirective,
  createTemplateCategoryDirective,
  type TemplateDeviceDirectiveValue,
  type TemplateDeviceDirectiveModifiers,
  type TemplateCategoryDirectiveValue,
  type TemplateCategoryDirectiveModifiers,
} from './directives'

// 导出内置模板
export { getBuiltinTemplates, builtinTemplates } from './templates'

// 默认导出引擎插件
export { createTemplateEnginePlugin as default } from './plugins'