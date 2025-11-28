/**
 * @ldesign/template-vue
 * Vue 3 模板管理系统
 */

// 导出核心类型 (从 core 包重新导出)
export type {
  DeviceType,
  TemplateMetadata,
  TemplateConfig,
} from '@ldesign/template-core'

// 导出扫描器
export { TemplateScanner, createTemplateScanner } from './scanner'

// 导出插件
export { createTemplatePlugin, type TemplatePluginOptions } from './plugin'

// 导出 Composables
export {
  useTemplate,
  useTemplateList,
  type UseTemplateReturn,
  type UseTemplateListReturn,
} from './composables'

// 导出组件
export { TemplateRenderer, TemplateSelector } from './components'

// 默认导出插件
export { createTemplatePlugin as default } from './plugin'