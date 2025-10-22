/**
 * 模板调试器
 * 提供断点、日志和追踪功能
 */

export interface DebugLog {
  timestamp: number
  level: 'log' | 'warn' | 'error' | 'info'
  message: string
  data?: any
  templateId?: string
}

export interface Breakpoint {
  id: string
  templateId: string
  condition?: string
  enabled: boolean
  hitCount: number
}

/**
 * 模板调试器
 */
export class TemplateDebugger {
  private logs: DebugLog[] = []
  private breakpoints = new Map<string, Breakpoint>()
  private maxLogs = 1000
  private paused = false
  private logEnabled = true

  /**
   * 记录日志
   */
  log(level: DebugLog['level'], message: string, data?: any, templateId?: string): void {
    if (!this.logEnabled) return

    const log: DebugLog = {
      timestamp: Date.now(),
      level,
      message,
      data,
      templateId,
    }

    this.logs.push(log)

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // 输出到控制台
    if (import.meta.env.DEV) {
      const prefix = `[Template${templateId ? `:${templateId}` : ''}]`
      console[level](prefix, message, data)
    }
  }

  /**
   * 获取日志
   */
  getLogs(filter?: {
    level?: DebugLog['level']
    templateId?: string
    since?: number
  }): DebugLog[] {
    let filtered = this.logs

    if (filter) {
      if (filter.level) {
        filtered = filtered.filter(log => log.level === filter.level)
      }

      if (filter.templateId) {
        filtered = filtered.filter(log => log.templateId === filter.templateId)
      }

      if (filter.since) {
        filtered = filtered.filter(log => log.timestamp >= filter.since)
      }
    }

    return filtered
  }

  /**
   * 添加断点
   */
  addBreakpoint(templateId: string, condition?: string): string {
    const id = `bp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    this.breakpoints.set(id, {
      id,
      templateId,
      condition,
      enabled: true,
      hitCount: 0,
    })

    return id
  }

  /**
   * 移除断点
   */
  removeBreakpoint(id: string): boolean {
    return this.breakpoints.delete(id)
  }

  /**
   * 启用/禁用断点
   */
  toggleBreakpoint(id: string, enabled?: boolean): void {
    const bp = this.breakpoints.get(id)
    if (bp) {
      bp.enabled = enabled ?? !bp.enabled
    }
  }

  /**
   * 检查断点
   */
  checkBreakpoint(templateId: string, context?: any): boolean {
    let shouldBreak = false

    this.breakpoints.forEach(bp => {
      if (!bp.enabled || bp.templateId !== templateId) return

      bp.hitCount++

      // 检查条件
      if (bp.condition) {
        try {
          // 简单的条件检查（实际应使用安全的表达式求值）
          const result = new Function('context', `return ${bp.condition}`)(context)
          if (result) {
            shouldBreak = true
            this.pause()
          }
        } catch (error) {
          console.warn('[Debugger] Invalid breakpoint condition:', bp.condition)
        }
      } else {
        shouldBreak = true
        this.pause()
      }
    })

    return shouldBreak
  }

  /**
   * 暂停执行
   */
  pause(): void {
    this.paused = true
    console.log('[Debugger] Paused')
  }

  /**
   * 继续执行
   */
  resume(): void {
    this.paused = false
    console.log('[Debugger] Resumed')
  }

  /**
   * 检查是否暂停
   */
  isPaused(): boolean {
    return this.paused
  }

  /**
   * 清除日志
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * 导出日志
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2)
    }

    // CSV 格式
    const headers = ['Timestamp', 'Level', 'Template', 'Message', 'Data']
    const rows = this.logs.map(log => [
      new Date(log.timestamp).toISOString(),
      log.level,
      log.templateId || '',
      log.message,
      JSON.stringify(log.data || ''),
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }
}

/**
 * 全局调试器
 */
let globalDebugger: TemplateDebugger | null = null

/**
 * 获取全局调试器
 */
export function getDebugger(): TemplateDebugger {
  if (!globalDebugger) {
    globalDebugger = new TemplateDebugger()
  }
  return globalDebugger
}



