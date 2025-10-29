/**
 * @ldesign/template-vue
 * 
 * Vue 3 模板管理系统
 */

// Core adapters
export * from './core/VueStateAdapter'
export * from './core/VueLoaderAdapter'
export * from './core/VueTemplateScanner'

// Composables
export * from './composables/useTemplateRenderer'

// Re-export core types
export type {
  TemplateMetadata,
  TemplateConfig,
  TemplateCategory,
  DeviceType,
  TemplateLoadOptions,
} from '@ldesign/template-core'
