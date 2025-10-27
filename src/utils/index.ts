/**
 * Utilities Module Export
 */

export {
  createErrorBoundary,
  defaultRecoveryStrategies,
  ErrorRecoveryManager,
  type ErrorRecoveryStrategy,
  globalErrorHandler,
  GlobalTemplateErrorHandler,
  TemplateErrorType
} from './errorHandler'

export {
  arrayToObject,
  debounce,
  deepClone,
  deepMerge,
  formatBytes,
  generateId,
  get,
  groupBy,
  isEmpty,
  isObject,
  omit,
  pick,
  retry,
  set,
  sleep,
  throttle,
  unset
} from './helpers'

export {
  type AnalyticsConfig,
  type AnalyticsReport,
  globalAnalytics,
  type InteractionEvent,
  type PerformanceMetrics,
  TemplateAnalytics,
  type TemplateUsage,
  useTemplateAnalytics,
  withPerformanceTracking
} from './templateAnalytics'

export {
  type EmitTypeDefinition,
  generateJSONSchema,
  generateTypeDeclarationFile,
  generateTypeGuard,
  generateTypeScriptInterface,
  inferTypeFromComponent,
  type PropTypeDefinition,
  type SlotTypeDefinition,
  type TemplateTypeDefinition,
  TemplateTypeGenerator,
  typeGenerator,
  type TypeGeneratorOptions,
  validateComponentProps
} from './typeGenerator'

// 模板搜索
export {
  createTemplateSearcher,
  TemplateSearcher
} from './templateSearch'
export type {
  FuzzySearchOptions,
  SearchOptions,
  SearchResult,
  SimilarityOptions
} from './templateSearch'

// 性能分析
export {
  createPerformanceAnalyzer,
  getPerformanceAnalyzer,
  PerformanceAnalyzer
} from './performanceAnalyzer'
export type {
  FlameGraphNode,
  MemorySnapshot,
  PerformanceMetric,
  PerformanceRecommendation,
  PerformanceReport,
  PerformanceScore,
  PerformanceThresholds,
  SlowOperation
} from './performanceAnalyzer'

// 性能工具（增强版）
export type {
  DebouncedFunction,
  ThrottledFunction
} from './performance'
export {
  batch,
  calculateVisibleRange,
  fastHash,
  lazy,
  memoize,
  objectFingerprint,
  ObjectPool,
  processBatch,
  runInNextFrame,
  runWhenIdle
} from './performance'

// 依赖分析器
export {
  createDependencyAnalyzer,
  DependencyAnalyzer
} from './dependencyAnalyzer'
export type {
  CircularDependency,
  DependencyAnalysisResult,
  DependencyAnalyzerOptions,
  DependencyGraph,
  DependencyNode,
  DependencyStatistics,
  LayoutConfig,
  VisualizationData,
  VisualizationEdge,
  VisualizationNode
} from './dependencyAnalyzer'

// 智能推荐系统
export {
  createTemplateRecommender,
  TemplateRecommender
} from './templateRecommender'
export type {
  ABTestResult,
  DeviceMetrics,
  Recommendation,
  RecommendationOptions,
  RecommendationStrategy,
  UserBehavior
} from './templateRecommender'

// 统一错误处理
export {
  createErrorHandler,
  ErrorCode,
  ErrorFactory,
  ErrorHandler,
  ErrorSeverity,
  getGlobalErrorHandler,
  RecoveryStrategy,
  setGlobalErrorHandler,
  TemplateError,
  withErrorBoundary
} from './errors'
export type {
  ErrorHandlerConfig
} from './errors'

// 模板预览功能
export {
  createTemplatePreviewManager,
  getPreviewManager,
  TemplatePreviewManager
} from './templatePreview'
export type {
  PreviewData,
  PreviewOptions,
  PreviewStorageOptions
} from './templatePreview'

// 迁移工具
export {
  createMigrator,
  migrateToVersion,
  TemplateMigrator
} from './migrationTool'
export type {
  MigrationConfig,
  MigrationPlan,
  MigrationResult,
  MigrationStep,
  Version
} from './migrationTool'

// 测试工具集
export {
  AccessibilityTester,
  createA11yTester,
  createPerfTester,
  createTestSuite,
  createVisualTester,
  PerformanceRegressionTester,
  TemplateTestSuite,
  VisualRegressionTester
} from './testingTools'
export type {
  AccessibilityIssue,
  AccessibilityTestResult,
  PerformanceImprovement,
  PerformanceMetrics,
  PerformanceRegression,
  PerformanceRegressionResult,
  ScreenshotComparisonResult
} from './testingTools'

// 内存优化器
export {
  createMemoryOptimizer,
  getMemoryOptimizer,
  MemoryOptimizer
} from './memoryOptimizer'
export type {
  MemoryOptimizerConfig,
  MemoryOptimizationSuggestion,
  MemoryStatus,
  OptimizationAction
} from './memoryOptimizer'