/**
 * @ldesign/template-core - Error Handling
 * 错误处理模块导出
 */

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
} from './TemplateError'
