// LDesign Template - 模板管理系统主入口文件

// 核心类和管理器
export { TemplateManager, getGlobalTemplateManager, setGlobalTemplateManager } from './core/template-manager'
export type { TemplateManagerConfig } from './types'

// Vue 组合式函数
export {
  useTemplate,
  useDeviceDetector,
  useStorage,
  useReactiveStorage,
  useTemplateCache
} from './composables'

// Vue 组件
// 注意：Vue组件需要在使用时直接导入
// import TemplateProvider from '@ldesign/template/src/components/TemplateProvider.vue'
// import TemplateRenderer from '@ldesign/template/src/components/TemplateRenderer.vue'
// import TemplateSelector from '@ldesign/template/src/components/TemplateSelector.vue'

// 工具函数
export { DeviceDetector, StorageManager, EventEmitter, debounce, throttle, generateId, deepClone, formatFileSizeileSize,
  delay
} from './utils'

// 模板相关
export {
  templateConfigs,
  templateCategories,
  defaultConfig,
  getTemplatesByDevice,
  getTemplatesByCategory,
  getDefaultTemplate,
  getTemplateById,
  searchTemplates,
  getTemplateStats,
  validateTemplateConfig,
  createTemplateLoader,
  preloadDefaultTemplates,
  clearTemplateCache
} from './templates'

// 类型定义
export type {
  // 核心类型
  DeviceType,
  TemplateStatus,
  TemplateInfo,
  TemplateConfig,
  TemplateInstance,
  TemplateCategory,
  TemplateManagerConfig,
  TemplateEvents,
  TemplateLoader,
  DeviceDetector as DeviceDetectorType,
  StorageAdapter as StorageAdapterType,
  
  // Vue 相关类型
  UseTemplateConfig,
  UseTemplateReturn,
  TemplateContext,
  TemplateProviderProps,
  TemplateProviderSlots,
  TemplateRendererProps,
  TemplateSelectorProps,
  TemplateSelectorEmits,
  TemplateSelectorConfig,
  UseDeviceDetectorReturn,
  UseStorageReturn,
  UseTemplateCacheReturn
} from './types'

// 默认配置
export const DEFAULT_TEMPLATE_CONFIG = {
  autoScan: true,
  scanDirectories: ['./templates'],
  enableCache: true,
  cacheExpiry: 3600000, // 1小时
  preloadDefault: true,
  enableDeviceDetection: true,
  enableStorage: true,
  storageKey: 'ldesign-template-preferences',
  errorRetryCount: 3,
  errorRetryDelay: 1000
}

// 版本信息
export const VERSION = '1.0.0'

// 创建模板管理器实例的便捷函数
export const createTemplateManager = (config?: Partial<TemplateManagerConfig>) => {
  return new TemplateManager({
    ...DEFAULT_TEMPLATE_CONFIG,
    ...config
  })
}

// 初始化函数
export const initTemplateSystem = async (config?: Partial<TemplateManagerConfig>) => {
  const manager = createTemplateManager(config)
  
  // 设置为全局管理器
  setGlobalTemplateManager(manager)
  
  // 初始化管理器
  await manager.initialize()
  
  return manager
}

// 快速安装函数（用于 Vue 插件）
export const install = (app: any, options?: Partial<TemplateManagerConfig>) => {
  // 创建全局模板管理器
  const manager = createTemplateManager(options)
  
  // 提供给整个应用
  app.provide('templateManager', manager)
  
  // 添加全局属性
  app.config.globalProperties.$templateManager = manager
  
  // 初始化管理器
  manager.initialize().catch(error => {
    console.error('Failed to initialize template manager:', error)
  })
}

// 默认导出
export default {
  install,
  TemplateManager,
  createTemplateManager,
  initTemplateSystem,
  VERSION
}