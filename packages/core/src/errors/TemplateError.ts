/**
 * @ldesign/template-core - Error Handling
 * 错误处理模块，包含错误类型定义、错误边界和恢复机制
 */

/**
 * 错误代码枚举
 */
export enum TemplateErrorCode {
  // 通用错误 1xxx
  UNKNOWN = 1000,
  INVALID_ARGUMENT = 1001,
  NOT_FOUND = 1002,
  ALREADY_EXISTS = 1003,
  TIMEOUT = 1004,
  ABORTED = 1005,
  
  // 加载错误 2xxx
  LOAD_FAILED = 2000,
  LOAD_TIMEOUT = 2001,
  LOADER_NOT_FOUND = 2002,
  COMPONENT_INVALID = 2003,
  IMPORT_FAILED = 2004,
  
  // 注册错误 3xxx
  REGISTER_FAILED = 3000,
  INVALID_METADATA = 3001,
  INVALID_CONFIG = 3002,
  DUPLICATE_ID = 3003,
  
  // 渲染错误 4xxx
  RENDER_FAILED = 4000,
  PROPS_INVALID = 4001,
  SLOT_NOT_FOUND = 4002,
  
  // 缓存错误 5xxx
  CACHE_ERROR = 5000,
  CACHE_MISS = 5001,
  CACHE_FULL = 5002,
  STORAGE_ERROR = 5003,
  
  // 权限错误 6xxx
  PERMISSION_DENIED = 6000,
  UNAUTHORIZED = 6001,
  FORBIDDEN = 6002,
  
  // 网络错误 7xxx
  NETWORK_ERROR = 7000,
  REQUEST_FAILED = 7001,
  RESPONSE_INVALID = 7002,
  
  // 验证错误 8xxx
  VALIDATION_FAILED = 8000,
  SCHEMA_INVALID = 8001,
  TYPE_MISMATCH = 8002,
  XSS_DETECTED = 8003,
}

/**
 * 错误严重级别
 */
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info'

/**
 * 错误上下文
 */
export interface ErrorContext {
  templateId?: string
  category?: string
  device?: string
  operation?: string
  component?: string
  timestamp?: number
  metadata?: Record<string, any>
}

/**
 * 模板系统错误基类
 */
export class TemplateError extends Error {
  public readonly code: TemplateErrorCode
  public readonly severity: ErrorSeverity
  public readonly context: ErrorContext
  public readonly timestamp: number
  public readonly recoverable: boolean
  public readonly originalError?: Error
  
  constructor(
    message: string,
    code: TemplateErrorCode = TemplateErrorCode.UNKNOWN,
    options: {
      severity?: ErrorSeverity
      context?: ErrorContext
      recoverable?: boolean
      cause?: Error
    } = {}
  ) {
    super(message)
    this.name = 'TemplateError'
    this.code = code
    this.severity = options.severity ?? 'error'
    this.context = options.context ?? {}
    this.timestamp = Date.now()
    this.recoverable = options.recoverable ?? false
    this.originalError = options.cause
    
    // 维护正确的堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TemplateError)
    }
  }
  
  /**
   * 转换为JSON
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      context: this.context,
      timestamp: this.timestamp,
      recoverable: this.recoverable,
      stack: this.stack,
    }
  }
  
  /**
   * 格式化错误信息
   */
  format(): string {
    const parts = [
      `[${this.name}]`,
      `Code: ${this.code}`,
      `Message: ${this.message}`,
    ]
    
    if (this.context.templateId) {
      parts.push(`Template: ${this.context.templateId}`)
    }
    
    if (this.context.operation) {
      parts.push(`Operation: ${this.context.operation}`)
    }
    
    return parts.join(' | ')
  }
}

/**
 * 加载错误
 */
export class LoadError extends TemplateError {
  constructor(
    message: string,
    context?: ErrorContext,
    cause?: Error
  ) {
    super(message, TemplateErrorCode.LOAD_FAILED, {
      severity: 'error',
      context: { ...context, operation: 'load' },
      recoverable: true,
      cause,
    })
    this.name = 'LoadError'
  }
}

/**
 * 验证错误
 */
export class ValidationError extends TemplateError {
  public readonly violations: string[]
  
  constructor(
    message: string,
    violations: string[] = [],
    context?: ErrorContext
  ) {
    super(message, TemplateErrorCode.VALIDATION_FAILED, {
      severity: 'warning',
      context: { ...context, operation: 'validate' },
      recoverable: true,
    })
    this.name = 'ValidationError'
    this.violations = violations
  }
}

/**
 * 权限错误
 */
export class PermissionError extends TemplateError {
  public readonly requiredPermissions: string[]
  
  constructor(
    message: string,
    requiredPermissions: string[] = [],
    context?: ErrorContext
  ) {
    super(message, TemplateErrorCode.PERMISSION_DENIED, {
      severity: 'error',
      context: { ...context, operation: 'authorize' },
      recoverable: false,
    })
    this.name = 'PermissionError'
    this.requiredPermissions = requiredPermissions
  }
}

/**
 * 网络错误
 */
export class NetworkError extends TemplateError {
  public readonly statusCode?: number
  public readonly url?: string
  
  constructor(
    message: string,
    options: {
      statusCode?: number
      url?: string
      context?: ErrorContext
      cause?: Error
    } = {}
  ) {
    super(message, TemplateErrorCode.NETWORK_ERROR, {
      severity: 'error',
      context: { ...options.context, operation: 'fetch' },
      recoverable: true,
      cause: options.cause,
    })
    this.name = 'NetworkError'
    this.statusCode = options.statusCode
    this.url = options.url
  }
}

/**
 * 缓存错误
 */
export class CacheError extends TemplateError {
  constructor(
    message: string,
    code: TemplateErrorCode = TemplateErrorCode.CACHE_ERROR,
    context?: ErrorContext
  ) {
    super(message, code, {
      severity: 'warning',
      context: { ...context, operation: 'cache' },
      recoverable: true,
    })
    this.name = 'CacheError'
  }
}

/**
 * 错误处理器接口
 */
export interface ErrorHandler {
  (error: TemplateError): void | Promise<void>
}

/**
 * 错误恢复策略
 */
export interface RecoveryStrategy {
  maxRetries: number
  retryDelay: number
  shouldRetry: (error: TemplateError) => boolean
  onRetry?: (attempt: number, error: TemplateError) => void
}

/**
 * 默认恢复策略
 */
export const defaultRecoveryStrategy: RecoveryStrategy = {
  maxRetries: 3,
  retryDelay: 1000,
  shouldRetry: (error) => error.recoverable,
}

/**
 * 错误管理器
 */
export class ErrorManager {
  private handlers: ErrorHandler[] = []
  private errorLog: TemplateError[] = []
  private maxLogSize: number = 100
  
  /**
   * 注册错误处理器
   */
  addHandler(handler: ErrorHandler): () => void {
    this.handlers.push(handler)
    return () => {
      const index = this.handlers.indexOf(handler)
      if (index >= 0) {
        this.handlers.splice(index, 1)
      }
    }
  }
  
  /**
   * 处理错误
   */
  async handle(error: TemplateError): Promise<void> {
    // 记录错误
    this.log(error)
    
    // 调用所有处理器
    for (const handler of this.handlers) {
      try {
        await handler(error)
      } catch (e) {
        console.error('Error handler failed:', e)
      }
    }
    
    // 根据严重级别决定是否抛出
    if (error.severity === 'fatal') {
      throw error
    }
  }
  
  /**
   * 记录错误
   */
  private log(error: TemplateError): void {
    this.errorLog.push(error)
    
    // 保持日志大小
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift()
    }
    
    // 控制台输出
    const logMethod = error.severity === 'warning' ? console.warn : console.error
    logMethod(`[Template ${error.severity.toUpperCase()}]`, error.format())
  }
  
  /**
   * 获取错误日志
   */
  getErrorLog(): TemplateError[] {
    return [...this.errorLog]
  }
  
  /**
   * 清除错误日志
   */
  clearLog(): void {
    this.errorLog = []
  }
  
  /**
   * 带重试的操作执行
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    strategy: Partial<RecoveryStrategy> = {}
  ): Promise<T> {
    const config = { ...defaultRecoveryStrategy, ...strategy }
    let lastError: TemplateError | null = null
    
    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error instanceof TemplateError
          ? error
          : new TemplateError(
              error instanceof Error ? error.message : String(error),
              TemplateErrorCode.UNKNOWN,
              { cause: error instanceof Error ? error : undefined }
            )
        
        if (!config.shouldRetry(lastError) || attempt >= config.maxRetries) {
          break
        }
        
        config.onRetry?.(attempt, lastError)
        await this.delay(config.retryDelay * attempt)
      }
    }
    
    throw lastError
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * 全局错误管理器实例
 */
export const errorManager = new ErrorManager()

/**
 * 创建错误
 */
export function createError(
  message: string,
  code?: TemplateErrorCode,
  context?: ErrorContext
): TemplateError {
  return new TemplateError(message, code, { context })
}

/**
 * 断言函数
 */
export function assert(
  condition: boolean,
  message: string,
  code: TemplateErrorCode = TemplateErrorCode.INVALID_ARGUMENT
): asserts condition {
  if (!condition) {
    throw new TemplateError(message, code)
  }
}

/**
 * 非空断言
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new TemplateError(message, TemplateErrorCode.NOT_FOUND)
  }
}