/**
 * @ldesign/template-core
 * 模板管理核心库 - 框架无关
 */

// 导出类型
export type {
  DeviceType,
  TemplateMetadata,
  TemplateConfig,
  QueryConditions,
  QueryResult,
} from './types'

// 导出注册表
export { TemplateRegistry } from './registry'

// 导出管理器
export { TemplateManager } from './manager'

// 导出查询构建器
export { TemplateQuery } from './query'

// 导出工具函数
export {
  parsePath,
  generateTemplateId,
  parseTemplateId,
  isValidDevice,
  normalizePath,
  validateTemplateMetadata,
  validateTemplateConfig,
  isValidTemplateId,
  type ParsedPath,
} from './utils'

// 导出多语言支持
export {
  zhCN as templateZhCN,
  enUS as templateEnUS,
  jaJP as templateJaJP,
  koKR as templateKoKR,
  deDE as templateDeDE,
  frFR as templateFrFR,
  esES as templateEsES,
  locales as templateLocales,
  getLocale as getTemplateLocale,
  type TemplateLocale,
  type LocaleKey as TemplateLocaleKey,
} from './locales'

// 导出 locale manager（单独导出避免循环引用）
export {
  TemplateLocaleManager,
  createTemplateLocaleManager,
  type ExternalI18n as TemplateExternalI18n,
  type LocaleKey,
} from './locales/manager'

// 导出缓存系统
export {
  TemplateCache,
  createTemplateCache,
  type CacheStats,
} from './cache'

// 导出版本管理
export {
  VersionManager,
  createVersionManager,
  type VersionManagerConfig,
  type VersionDiff,
} from './version'

// 导出A/B测试引擎
export {
  ExperimentEngine,
  createExperimentEngine,
  type ExperimentStatus,
  type ExperimentEvent,
  type ExperimentMetrics,
  type ExperimentResult,
  type ExperimentEngineConfig,
} from './experiment'

// 导出错误处理
export {
  TemplateError,
  LoadError,
  ValidationError,
  PermissionError,
  NetworkError,
  CacheError,
  TemplateErrorCode,
  ErrorManager,
  errorManager,
  createError,
  assert,
  assertDefined,
  defaultRecoveryStrategy,
  type ErrorSeverity,
  type ErrorContext,
  type ErrorHandler,
  type RecoveryStrategy,
} from './errors'

// 导出数据验证
export {
  Validator,
  createValidator,
  validator,
  validate,
  sanitize,
  detectXSS,
  type ValidationRuleType,
  type Schema,
} from './validation'
