/**
 * 统一错误处理系统
 * 
 * @description
 * 提供统一的错误类型、错误码和错误处理策略：
 * - 标准化错误类型
 * - 错误码系统
 * - 错误恢复策略
 * - 错误追踪和报告
 * - 多语言错误消息
 * 
 * @example
 * ```ts
 * // 抛出错误
 * throw new TemplateError(
 *   ErrorCode.TEMPLATE_NOT_FOUND,
 *   'Template not found',
 *   { templateId: 'login/mobile/default' }
 * )
 * 
 * // 使用错误处理器
 * const handler = createErrorHandler({
 *   onError: (error) => console.error(error),
 *   recovery: RecoveryStrategy.FALLBACK
 * })
 * ```
 */

/**
 * 错误码枚举
 */
export enum ErrorCode {
  // 通用错误 (1000-1999)
  /** 未知错误 */
  UNKNOWN = 1000,
  /** 参数无效 */
  INVALID_ARGUMENT = 1001,
  /** 配置错误 */
  INVALID_CONFIG = 1002,
  /** 权限不足 */
  PERMISSION_DENIED = 1003,
  /** 操作超时 */
  TIMEOUT = 1004,
  /** 操作取消 */
  CANCELLED = 1005,

  // 模板相关错误 (2000-2999)
  /** 模板未找到 */
  TEMPLATE_NOT_FOUND = 2000,
  /** 模板加载失败 */
  TEMPLATE_LOAD_FAILED = 2001,
  /** 模板解析错误 */
  TEMPLATE_PARSE_ERROR = 2002,
  /** 模板渲染错误 */
  TEMPLATE_RENDER_ERROR = 2003,
  /** 模板配置无效 */
  TEMPLATE_INVALID_CONFIG = 2004,
  /** 模板版本不兼容 */
  TEMPLATE_VERSION_INCOMPATIBLE = 2005,
  /** 循环依赖 */
  TEMPLATE_CIRCULAR_DEPENDENCY = 2006,

  // 缓存相关错误 (3000-3999)
  /** 缓存错误 */
  CACHE_ERROR = 3000,
  /** 缓存已满 */
  CACHE_FULL = 3001,
  /** 缓存项过期 */
  CACHE_EXPIRED = 3002,
  /** 缓存损坏 */
  CACHE_CORRUPTED = 3003,

  // 网络相关错误 (4000-4999)
  /** 网络错误 */
  NETWORK_ERROR = 4000,
  /** 请求失败 */
  REQUEST_FAILED = 4001,
  /** 响应无效 */
  INVALID_RESPONSE = 4002,

  // 存储相关错误 (5000-5999)
  /** 存储错误 */
  STORAGE_ERROR = 5000,
  /** 存储已满 */
  STORAGE_FULL = 5001,
  /** 存储不可用 */
  STORAGE_UNAVAILABLE = 5002,

  // 性能相关错误 (6000-6999)
  /** 内存不足 */
  OUT_OF_MEMORY = 6000,
  /** 性能降级 */
  PERFORMANCE_DEGRADED = 6001,
}

/**
 * 错误严重级别
 */
export enum ErrorSeverity {
  /** 低：不影响功能，可以忽略 */
  LOW = 'low',
  /** 中：影响部分功能，需要注意 */
  MEDIUM = 'medium',
  /** 高：影响主要功能，需要处理 */
  HIGH = 'high',
  /** 严重：系统无法继续运行 */
  CRITICAL = 'critical',
}

/**
 * 错误恢复策略
 */
export enum RecoveryStrategy {
  /** 不处理，直接抛出 */
  NONE = 'none',
  /** 重试 */
  RETRY = 'retry',
  /** 使用降级方案 */
  FALLBACK = 'fallback',
  /** 忽略错误继续执行 */
  IGNORE = 'ignore',
  /** 使用缓存 */
  USE_CACHE = 'use_cache',
  /** 使用默认值 */
  USE_DEFAULT = 'use_default',
}

/**
 * 模板错误类
 */
export class TemplateError extends Error {
  /** 错误码 */
  public readonly code: ErrorCode

  /** 错误严重级别 */
  public readonly severity: ErrorSeverity

  /** 错误详情 */
  public readonly details?: Record<string, any>

  /** 时间戳 */
  public readonly timestamp: number

  /** 错误堆栈 */
  public readonly stack?: string

  /** 内部错误 */
  public readonly cause?: Error

  /**
   * 创建模板错误
   * 
   * @param code - 错误码
   * @param message - 错误消息
   * @param details - 错误详情
   * @param cause - 原始错误
   */
  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, any>,
    cause?: Error
  ) {
    super(message)

    this.name = 'TemplateError'
    this.code = code
    this.severity = this.determineSeverity(code)
    this.details = details
    this.timestamp = Date.now()
    this.cause = cause

    // 捕获堆栈
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TemplateError)
    }
  }

  /**
   * 判断错误严重级别
   */
  private determineSeverity(code: ErrorCode): ErrorSeverity {
    if (code >= 6000) return ErrorSeverity.CRITICAL
    if (code >= 5000) return ErrorSeverity.HIGH
    if (code >= 4000) return ErrorSeverity.MEDIUM
    if (code >= 3000) return ErrorSeverity.MEDIUM
    if (code >= 2000) return ErrorSeverity.HIGH
    return ErrorSeverity.MEDIUM
  }

  /**
   * 转换为JSON
   */
  toJSON(): object {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      severity: this.severity,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
      cause: this.cause?.message,
    }
  }

  /**
   * 格式化错误消息
   */
  format(): string {
    let formatted = `[${this.code}] ${this.message}`

    if (this.details) {
      formatted += `\n详情: ${JSON.stringify(this.details, null, 2)}`
    }

    if (this.cause) {
      formatted += `\n原因: ${this.cause.message}`
    }

    return formatted
  }
}

/**
 * 错误处理器配置
 */
export interface ErrorHandlerConfig {
  /** 错误回调 */
  onError?: (error: TemplateError) => void

  /** 恢复策略 */
  recovery?: RecoveryStrategy

  /** 重试配置 */
  retry?: {
    /** 最大重试次数 */
    maxAttempts?: number
    /** 重试延迟（毫秒） */
    delay?: number
    /** 延迟倍增因子 */
    backoff?: number
  }

  /** 降级配置 */
  fallback?: {
    /** 降级值或函数 */
    value?: any
    /** 降级函数 */
    handler?: () => any
  }

  /** 是否报告错误 */
  reportErrors?: boolean

  /** 错误报告端点 */
  reportEndpoint?: string
}

/**
 * 错误处理器
 */
export class ErrorHandler {
  private config: Required<ErrorHandlerConfig>
  private errorHistory: TemplateError[] = []

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      onError: config.onError || ((error) => console.error(error)),
      recovery: config.recovery || RecoveryStrategy.NONE,
      retry: {
        maxAttempts: config.retry?.maxAttempts || 3,
        delay: config.retry?.delay || 1000,
        backoff: config.retry?.backoff || 2,
      },
      fallback: config.fallback || {},
      reportErrors: config.reportErrors ?? true,
      reportEndpoint: config.reportEndpoint || '',
    }
  }

  /**
   * 处理错误
   * 
   * @param error - 错误对象
   * @param context - 错误上下文
   * @returns 处理结果
   */
  async handle(
    error: Error | TemplateError,
    context?: Record<string, any>
  ): Promise<{
    recovered: boolean
    result?: any
    error?: TemplateError
  }> {
    // 转换为TemplateError
    const templateError = error instanceof TemplateError
      ? error
      : new TemplateError(
        ErrorCode.UNKNOWN,
        error.message,
        { ...context, originalError: error.name },
        error
      )

    // 记录错误
    this.errorHistory.push(templateError)
    this.config.onError(templateError)

    // 报告错误
    if (this.config.reportErrors) {
      this.reportError(templateError)
    }

    // 应用恢复策略
    const recoveryResult = await this.applyRecovery(templateError, context)

    return recoveryResult
  }

  /**
   * 应用恢复策略
   */
  private async applyRecovery(
    error: TemplateError,
    context?: Record<string, any>
  ): Promise<{ recovered: boolean; result?: any; error?: TemplateError }> {
    switch (this.config.recovery) {
      case RecoveryStrategy.RETRY:
        return await this.retry(error, context)

      case RecoveryStrategy.FALLBACK:
        return this.fallback(error)

      case RecoveryStrategy.IGNORE:
        return { recovered: true, result: null }

      case RecoveryStrategy.USE_CACHE:
        return this.useCache(error, context)

      case RecoveryStrategy.USE_DEFAULT:
        return this.useDefault(error)

      case RecoveryStrategy.NONE:
      default:
        return { recovered: false, error }
    }
  }

  /**
   * 重试策略
   */
  private async retry(
    error: TemplateError,
    context?: Record<string, any>
  ): Promise<{ recovered: boolean; result?: any; error?: TemplateError }> {
    const { maxAttempts, delay, backoff } = this.config.retry

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // 等待延迟
        if (attempt > 1) {
          await this.sleep(delay * Math.pow(backoff, attempt - 2))
        }

        // 尝试重新执行（需要外部提供重试逻辑）
        console.log(`重试 ${attempt}/${maxAttempts}...`)

        // 这里无法真正重试，返回未恢复
        return { recovered: false, error }
      } catch (err) {
        if (attempt === maxAttempts) {
          return { recovered: false, error }
        }
      }
    }

    return { recovered: false, error }
  }

  /**
   * 降级策略
   */
  private fallback(
    error: TemplateError
  ): { recovered: boolean; result?: any; error?: TemplateError } {
    const { value, handler } = this.config.fallback

    if (handler) {
      try {
        const result = handler()
        return { recovered: true, result }
      } catch (err) {
        return { recovered: false, error }
      }
    }

    if (value !== undefined) {
      return { recovered: true, result: value }
    }

    return { recovered: false, error }
  }

  /**
   * 使用缓存策略
   */
  private useCache(
    error: TemplateError,
    context?: Record<string, any>
  ): { recovered: boolean; result?: any; error?: TemplateError } {
    // 这里需要访问外部缓存，简化处理
    console.warn('尝试使用缓存恢复，但未配置缓存访问')
    return { recovered: false, error }
  }

  /**
   * 使用默认值策略
   */
  private useDefault(
    error: TemplateError
  ): { recovered: boolean; result?: any; error?: TemplateError } {
    return { recovered: true, result: null }
  }

  /**
   * 报告错误
   */
  private async reportError(error: TemplateError): Promise<void> {
    if (!this.config.reportEndpoint) {
      return
    }

    try {
      await fetch(this.config.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error.toJSON()),
      })
    } catch (err) {
      console.warn('错误报告失败:', err)
    }
  }

  /**
   * 获取错误历史
   */
  getErrorHistory(): TemplateError[] {
    return [...this.errorHistory]
  }

  /**
   * 清空错误历史
   */
  clearHistory(): void {
    this.errorHistory = []
  }

  /**
   * 工具：延迟
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * 创建错误处理器
 * 
 * @param config - 配置选项
 * @returns 错误处理器实例
 */
export function createErrorHandler(config?: ErrorHandlerConfig): ErrorHandler {
  return new ErrorHandler(config)
}

/**
 * 错误工厂函数
 */
export const ErrorFactory = {
  /**
   * 创建模板未找到错误
   */
  templateNotFound(templateId: string): TemplateError {
    return new TemplateError(
      ErrorCode.TEMPLATE_NOT_FOUND,
      '模板未找到',
      { templateId }
    )
  },

  /**
   * 创建模板加载失败错误
   */
  templateLoadFailed(templateId: string, reason: string): TemplateError {
    return new TemplateError(
      ErrorCode.TEMPLATE_LOAD_FAILED,
      '模板加载失败',
      { templateId, reason }
    )
  },

  /**
   * 创建循环依赖错误
   */
  circularDependency(cycle: string[]): TemplateError {
    return new TemplateError(
      ErrorCode.TEMPLATE_CIRCULAR_DEPENDENCY,
      '检测到循环依赖',
      { cycle }
    )
  },

  /**
   * 创建缓存错误
   */
  cacheError(operation: string, reason: string): TemplateError {
    return new TemplateError(
      ErrorCode.CACHE_ERROR,
      '缓存操作失败',
      { operation, reason }
    )
  },

  /**
   * 创建内存不足错误
   */
  outOfMemory(usage: number, limit: number): TemplateError {
    return new TemplateError(
      ErrorCode.OUT_OF_MEMORY,
      '内存不足',
      { usage, limit, usagePercent: (usage / limit) * 100 }
    )
  },
}

/**
 * 全局错误处理器
 */
let globalErrorHandler: ErrorHandler | null = null

/**
 * 获取全局错误处理器
 */
export function getGlobalErrorHandler(): ErrorHandler {
  if (!globalErrorHandler) {
    globalErrorHandler = new ErrorHandler({
      onError: (error) => {
        console.error('[TemplateError]', error.format())
      },
      recovery: RecoveryStrategy.FALLBACK,
      reportErrors: false,
    })
  }
  return globalErrorHandler
}

/**
 * 设置全局错误处理器
 */
export function setGlobalErrorHandler(handler: ErrorHandler): void {
  globalErrorHandler = handler
}

/**
 * 错误边界包装器
 * 
 * @description
 * 用于包装可能抛出错误的函数，自动处理错误
 * 
 * @param fn - 要包装的函数
 * @param handler - 错误处理器
 * @returns 包装后的函数
 */
export function withErrorBoundary<T extends (...args: any[]) => any>(
  fn: T,
  handler?: ErrorHandler
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  const errorHandler = handler || getGlobalErrorHandler()

  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args)
    } catch (error) {
      const result = await errorHandler.handle(error as Error, {
        function: fn.name,
        arguments: args,
      })

      if (result.recovered) {
        return result.result
      }

      throw result.error
    }
  }
}


