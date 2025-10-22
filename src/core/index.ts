/**
 * 核心模块导出
 * 优化：确保所有导出都支持 tree-shaking
 */

// 核心加载器和管理器
export { getLoader, loadTemplate, preloadTemplate, TemplateLoader } from './loader'
export { createTemplateManager, getManager, TemplateManager } from './manager'
export { getScanner, scanTemplates, TemplateScanner } from './scanner'
export { clearLoadedStyles, loadComponentStyle, loadGlobalStyles, loadStyles } from './style-loader'

// 智能缓存系统
export { createSmartCache, SmartCache, type SmartCacheOptions, type CacheMetrics } from './smart-cache'

// 持久化缓存
export { getPersistentCache, PersistentCache, generateHash, generateTemplatesHash } from './persistent-cache'

// 版本管理
export { createVersionManager, getVersionManager, VersionManager } from './version-manager'
export type { TemplateVersion, VersionDiff, MigrationGuide } from './version-manager'

// 依赖管理
export { createDependencyManager, getDependencyManager, DependencyManager } from './dependency-manager'
export type { TemplateDependency, DependencyNode, CircularDependency } from './dependency-manager'

// A/B 测试引擎
export { createABTestEngine, getABTestEngine, ABTestEngine } from './ab-test-engine'
export type { ABTestConfig, ABTestVariant, ABTestMetrics, ABTestResult } from './ab-test-engine'

// 动画系统（轻量级核心）
export * from './animation'
