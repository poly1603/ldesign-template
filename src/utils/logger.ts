/**
 * 生产环境优化的日志系统
 *
 * @description
 * 在开发环境输出日志，在生产环境自动静默
 * 避免 console 语句影响性能和内存
 */

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * 日志配置
 */
export interface LoggerConfig {
  /** 日志级别 */
  level?: LogLevel
  /** 是否启用 */
  enabled?: boolean
  /** 是否在生产环境启用 */
  enabledInProduction?: boolean
  /** 自定义前缀 */
  prefix?: string
  /** 是否显示时间戳 */
  showTimestamp?: boolean
}

/**
 * 日志器类
 */
export class Logger {
  private config: Required<LoggerConfig>
  private isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'

  constructor(config: LoggerConfig = {}) {
    this.config = {
      level: config.level ?? (this.isDev ? LogLevel.DEBUG : LogLevel.ERROR),
      enabled: config.enabled ?? true,
      enabledInProduction: config.enabledInProduction ?? false,
      prefix: config.prefix ?? '[Template]',
      showTimestamp: config.showTimestamp ?? this.isDev,
    }
  }

  /**
   * 是否应该输出日志
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled)
      return false
    if (!this.isDev && !this.config.enabledInProduction)
      return false
    return level >= this.config.level
  }

  /**
   * 格式化消息
   */
  private formatMessage(message: string): string {
    const parts: string[] = []

    if (this.config.showTimestamp) {
      parts.push(new Date().toISOString())
    }

    if (this.config.prefix) {
      parts.push(this.config.prefix)
    }

    parts.push(message)

    return parts.join(' ')
  }

  /**
   * Debug 日志
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(message), ...args)
    }
  }

  /**
   * Info 日志
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(message), ...args)
    }
  }

  /**
   * 警告日志
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(message), ...args)
    }
  }

  /**
   * 错误日志
   */
  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(message), ...args)
    }
  }

  /**
   * 性能日志（仅开发环境）
   */
  time(label: string): void {
    if (this.isDev && this.shouldLog(LogLevel.DEBUG)) {
      console.time(`${this.config.prefix} ${label}`)
    }
  }

  timeEnd(label: string): void {
    if (this.isDev && this.shouldLog(LogLevel.DEBUG)) {
      console.timeEnd(`${this.config.prefix} ${label}`)
    }
  }

  /**
   * 表格日志（仅开发环境）
   */
  table(data: any): void {
    if (this.isDev && this.shouldLog(LogLevel.DEBUG)) {
      console.table(data)
    }
  }

  /**
   * 分组日志（仅开发环境）
   */
  group(label: string): void {
    if (this.isDev && this.shouldLog(LogLevel.DEBUG)) {
      console.group(this.formatMessage(label))
    }
  }

  groupEnd(): void {
    if (this.isDev && this.shouldLog(LogLevel.DEBUG)) {
      console.groupEnd()
    }
  }

  /**
   * 更新配置
   */
  setConfig(config: Partial<LoggerConfig>): void {
    Object.assign(this.config, config)
  }

  /**
   * 创建子日志器
   */
  createChild(prefix: string, config?: Partial<LoggerConfig>): Logger {
    return new Logger({
      ...this.config,
      ...config,
      prefix: `${this.config.prefix} ${prefix}`,
    })
  }
}

/**
 * 默认日志器实例
 */
export const logger = new Logger()

/**
 * 创建日志器
 */
export function createLogger(config?: LoggerConfig): Logger {
  return new Logger(config)
}

/**
 * 开发环境日志助手
 */
export const devLog = {
  debug: (message: string, ...args: any[]) => {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.debug(message, ...args)
    }
  },
  info: (message: string, ...args: any[]) => {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.info(message, ...args)
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.warn(message, ...args)
    }
  },
  error: (message: string, ...args: any[]) => {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.error(message, ...args)
    }
  },
}
