/**
 * @ldesign/template - 多模板管理及动态渲染系统
 * 
 * 核心特性：
 * - 自动扫描模板：使用 import.meta.glob 自动扫描所有模板
 * - 懒加载：按需加载模板组件，优化性能
 * - 类型安全：完整的 TypeScript 类型支持
 * - Vue 集成：提供 Vue 组合式函数和组件
 */

// Vue 组件
export { TemplateDevPanel, TemplateRenderer, TemplateSelector, TemplateSkeleton, TemplateVersion } from './components'

export { default as InheritableTemplate } from './components/InheritableTemplate.vue'

// Vue 组合式函数
export {
  createDebugPanelData,
  createMiddlewareEventBus,
  createThemeManager,
  DebugLevel,
  EASING_FUNCTIONS,
  globalDebuggerManager,
  provideTemplateEventBus,
  provideTemplateTheme,
  templateEventBus,
  useAutoMigration,
  useDefaultTemplate,
  useGesture,
  useParallax,
  useScrollAnimation,
  useSequenceAnimation,
  useTemplate,
  // 动画系统
  useTemplateAnimation,
  // 调试工具
  useTemplateDebugger,
  useTemplateEvent,
  // 事件总线
  useTemplateEventBus,
  useTemplateEvents,
  // 表单系统  
  useTemplateForm,
  // 新增 hooks
  useTemplateLifecycle,
  useTemplateList,
  useTemplateManager,
  useTemplateModel,
  useTemplateNavigation,
  useTemplatePerformance,
  useTemplatePrefetch,
  // 快照与时间旅行
  useTemplateSnapshot,
  // 主题系统
  useTemplateTheme,
  // 版本控制
  useTemplateVersion,
  useTimeTravel,
  useVersionComparison,
} from './composables'

// 常量导出
export { PRESET_THEMES, TEMPLATE_EVENTS } from './composables'

export type {
  AnimationConfig,
  DebuggerConfig,
  DebugLog,
  EasingFunction,
  EventHandler,
  EventMiddleware,
  EventSubscribeOptions,
  FieldError,
  FieldRules,
  FormOptions,
  FormRules,
  FormState,
  GestureConfig,
  ParallaxConfig,
  SequenceStep,
  SnapshotOptions,
  TemplateEventBus,
  TemplateEventType,
  TemplateHookResult,
  TemplateLifecycle,
  TemplatePrefetchOptions,
  TemplateSnapshot,
  TemplateStateSnapshot,
  TemplateTheme,
  ThemeContext,
  TimeTravel,
  UseTemplateVersionOptions,
  ValidationRule,
  VersionState
} from './composables'

export {
  type TemplateInheritanceContext,
  useTemplateBlocks,
  useTemplateInheritance,
  type UseTemplateInheritanceOptions,
  useTemplateMixins
} from './composables/useTemplateInheritance'
// 核心模块（优化导出，支持 tree-shaking）
export {
  createTemplateManager,
  getLoader,
  getManager,
  getScanner,
  loadTemplate,
  preloadTemplate,
  scanTemplates,
  TemplateLoader,
  TemplateManager,
  TemplateScanner,
} from './core'

// 新增：智能缓存系统（按需导入）
export { createSmartCache, SmartCache } from './core/smart-cache'
export type { SmartCacheOptions, CacheMetrics } from './core/smart-cache'

// 新增：持久化缓存（按需导入）
export { getPersistentCache, PersistentCache } from './core/persistent-cache'

// 新增：版本管理（按需导入）
export { getVersionManager, createVersionManager, VersionManager } from './core/version-manager'
export type { TemplateVersion, VersionDiff, MigrationGuide } from './core/version-manager'

// 新增：依赖管理（按需导入）
export { getDependencyManager, createDependencyManager, DependencyManager } from './core/dependency-manager'
export type { TemplateDependency, DependencyNode } from './core/dependency-manager'

// 新增：A/B 测试（按需导入）
export { getABTestEngine, createABTestEngine, ABTestEngine } from './core/ab-test-engine'
export type { ABTestConfig, ABTestVariant, ABTestResult } from './core/ab-test-engine'

// SSR/SSG 支持（按需导入）
export * from './ssr'

// DevTools（仅开发环境，按需导入）
export * from './devtools'

// 可视化编辑器（按需导入）
export * from './editor'

// 默认导出
export { getManager as default } from './core'

// 模板继承系统
export {
  blockManager,
  createInheritableTemplate,
  createTemplateMixin,
  inheritanceManager,
  type MergeStrategy,
  registerBaseTemplate,
  type TemplateBlock,
  TemplateBlockManager,
  type TemplateInheritanceConfig,
  TemplateInheritanceManager
} from './core/inheritance'

// 指令系统
export {
  installTemplateDirective,
  vTemplate
} from './directives'

// 语言包
export {
  enUS,
  getLocale,
  jaJP,
  locales,
  supportedLocales,
  zhCN
} from './locales'

export type { LocaleKey, TemplateLocale } from './locales'

// 插件系统
export {
  createTemplatePlugin,
  type TemplatePlugin,
  type TemplatePluginOptions,
  TemplatePluginSymbol,
  useTemplatePlugin,
} from './plugin'

// 类型导出
export type * from './types'
// 错误处理
export {
  createErrorBoundary,
  ErrorRecoveryManager,
  globalErrorHandler,
  GlobalTemplateErrorHandler,
  TemplateError,
  TemplateErrorType
} from './utils'
export type { ErrorRecoveryStrategy } from './utils'
