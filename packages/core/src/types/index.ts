/**
 * @ldesign/template-core - Type Definitions
 * 核心类型定义导出
 */

// 基础类型
export type { DeviceType, TemplateMetadata, TemplateConfig } from './template'
export type { QueryConditions, QueryResult } from './query'

// 高级类型
export type {
  // 泛型接口
  TemplateLoader,
  TemplateInstance,
  TemplateRegisterOptions,
  
  // 工具类型
  DeepReadonly,
  DeepPartial,
  RequiredFields,
  OptionalFields,
  ExcludeFunctions,
  ExtractFunctions,
  StringLiteral,
  TemplateId,
  TemplateCategory,
  
  // 高级接口
  TemplateVersion,
  TemplatePermission,
  TemplateMetrics,
  TemplateVariant,
  ExperimentConfig,
  CacheStrategy,
  TemplateLifecycleHooks,
  
  // 事件类型
  TemplateEvents,
  TemplateEventHandler,
  TemplateEventEmitter,
  
  // 验证器类型
  ValidationRule,
  ValidationResult,
  TemplateValidator,
  
  // 异步类型
  AsyncData,
  Awaitable,
  AsyncFunction,
  
  // 类型别名
  TemplateMap,
  TemplateRecord,
  TemplateArray,
  TemplateFilter,
  TemplateSorter,
  TemplateTransformer,
  
  // 类型推导
  InferTemplateProps,
  InferComponentType,
  InferPropsType,
  
  // 条件类型
  IfEquals,
  IsAny,
  IsUnknown,
  IsNever,
  
  // 映射类型
  TemplateRegistry,
  TemplateLoaderMap,
} from './advanced'

// 导出类型守卫函数
export {
  isDeviceType,
  isTemplateMetadata,
  isTemplateConfig,
  isTemplateLoader,
  isValidTemplateId,
} from './advanced'
