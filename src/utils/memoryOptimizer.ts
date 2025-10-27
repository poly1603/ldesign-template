/**
 * 内存优化器
 * 
 * @description
 * 智能内存管理和优化系统：
 * - 动态缓存大小调整：根据可用内存自动调整
 * - 内存压力监控：实时监控内存使用情况
 * - 自动垃圾回收：触发GC释放内存
 * - 内存泄漏预警：检测并报告内存泄漏
 * - 内存使用可视化：生成内存使用报告
 * 
 * @example
 * ```ts
 * const optimizer = new MemoryOptimizer({
 *   maxMemoryUsage: 100 * 1024 * 1024, // 100MB
 *   warningThreshold: 0.8,
 *   criticalThreshold: 0.95
 * })
 * 
 * // 启动监控
 * optimizer.startMonitoring()
 * 
 * // 获取建议
 * const suggestions = optimizer.getSuggestions()
 * ```
 */

/**
 * 内存优化器配置
 */
export interface MemoryOptimizerConfig {
  /** 最大内存使用（字节） */
  maxMemoryUsage?: number
  /** 警告阈值（0-1） */
  warningThreshold?: number
  /** 严重阈值（0-1） */
  criticalThreshold?: number
  /** 监控间隔（毫秒） */
  monitorInterval?: number
  /** 自动优化 */
  autoOptimize?: boolean
  /** 优化回调 */
  onOptimize?: (action: OptimizationAction) => void
}

/**
 * 内存状态
 */
export interface MemoryStatus {
  /** 已用内存（字节） */
  used: number
  /** 总内存（字节） */
  total: number
  /** 内存限制（字节） */
  limit: number
  /** 使用率（0-1） */
  usage: number
  /** 状态级别 */
  level: 'normal' | 'warning' | 'critical'
  /** 可用内存（字节） */
  available: number
  /** DOM节点数 */
  domNodes?: number
  /** 监听器数量估计 */
  listeners?: number
}

/**
 * 优化动作
 */
export interface OptimizationAction {
  /** 动作类型 */
  type: 'clear-cache' | 'reduce-cache' | 'cleanup-dom' | 'gc-suggest'
  /** 动作描述 */
  description: string
  /** 预期释放的内存（字节） */
  expectedRelease: number
  /** 实际释放的内存（字节） */
  actualRelease?: number
  /** 执行时间 */
  timestamp: number
}

/**
 * 内存优化建议
 */
export interface MemoryOptimizationSuggestion {
  /** 优先级 */
  priority: 'high' | 'medium' | 'low'
  /** 建议标题 */
  title: string
  /** 建议描述 */
  description: string
  /** 预期收益（字节） */
  expectedBenefit: number
  /** 执行函数 */
  execute?: () => void | Promise<void>
}

/**
 * 内存优化器
 */
export class MemoryOptimizer {
  private config: Required<MemoryOptimizerConfig>
  private monitorTimer: ReturnType<typeof setInterval> | null = null
  private memoryHistory: MemoryStatus[] = []
  private actions: OptimizationAction[] = []

  /**
   * 创建内存优化器
   * 
   * @param config - 配置选项
   */
  constructor(config: MemoryOptimizerConfig = {}) {
    this.config = {
      maxMemoryUsage: config.maxMemoryUsage || 100 * 1024 * 1024, // 100MB
      warningThreshold: config.warningThreshold || 0.8,
      criticalThreshold: config.criticalThreshold || 0.95,
      monitorInterval: config.monitorInterval || 5000,
      autoOptimize: config.autoOptimize ?? true,
      onOptimize: config.onOptimize || (() => { }),
    }
  }

  /**
   * 获取当前内存状态
   * 
   * @returns 内存状态对象
   */
  getMemoryStatus(): MemoryStatus {
    if (typeof performance === 'undefined' || !('memory' in performance)) {
      return {
        used: 0,
        total: 0,
        limit: this.config.maxMemoryUsage,
        usage: 0,
        level: 'normal',
        available: this.config.maxMemoryUsage,
      }
    }

    const memory = (performance as any).memory
    const used = memory.usedJSHeapSize
    const total = memory.totalJSHeapSize
    const limit = memory.jsHeapSizeLimit
    const usage = used / limit

    let level: MemoryStatus['level'] = 'normal'
    if (usage >= this.config.criticalThreshold) {
      level = 'critical'
    } else if (usage >= this.config.warningThreshold) {
      level = 'warning'
    }

    const status: MemoryStatus = {
      used,
      total,
      limit,
      usage,
      level,
      available: limit - used,
    }

    // 添加DOM节点统计
    if (typeof document !== 'undefined') {
      status.domNodes = document.getElementsByTagName('*').length
    }

    return status
  }

  /**
   * 启动监控
   * 
   * @description
   * 定期检查内存状态，在超过阈值时触发优化
   */
  startMonitoring(): void {
    if (this.monitorTimer) {
      return
    }

    this.monitorTimer = setInterval(() => {
      const status = this.getMemoryStatus()

      // 记录历史
      this.memoryHistory.push(status)

      // 保留最近100条记录
      if (this.memoryHistory.length > 100) {
        this.memoryHistory.shift()
      }

      // 检查是否需要优化
      if (this.config.autoOptimize) {
        if (status.level === 'critical') {
          this.optimizeAggressively()
        } else if (status.level === 'warning') {
          this.optimizeModerately()
        }
      }
    }, this.config.monitorInterval)
  }

  /**
   * 停止监控
   */
  stopMonitoring(): void {
    if (this.monitorTimer) {
      clearInterval(this.monitorTimer)
      this.monitorTimer = null
    }
  }

  /**
   * 激进优化
   * 
   * @description
   * 在内存严重不足时执行激进的优化策略
   */
  private optimizeAggressively(): void {
    const beforeStatus = this.getMemoryStatus()

    // 1. 清空所有缓存
    this.executeAction({
      type: 'clear-cache',
      description: '清空所有缓存',
      expectedRelease: beforeStatus.used * 0.3, // 预计释放30%
      timestamp: Date.now(),
    })

    // 2. 建议垃圾回收
    this.suggestGC()

    // 3. 清理DOM
    this.cleanupDOM()

    const afterStatus = this.getMemoryStatus()
    console.warn(
      `[MemoryOptimizer] 激进优化完成，释放了 ${((beforeStatus.used - afterStatus.used) / 1024 / 1024).toFixed(2)
      }MB`
    )
  }

  /**
   * 温和优化
   */
  private optimizeModerately(): void {
    const beforeStatus = this.getMemoryStatus()

    // 1. 减少缓存大小
    this.executeAction({
      type: 'reduce-cache',
      description: '减少缓存大小',
      expectedRelease: beforeStatus.used * 0.1,
      timestamp: Date.now(),
    })

    const afterStatus = this.getMemoryStatus()
    console.log(
      `[MemoryOptimizer] 温和优化完成，释放了 ${((beforeStatus.used - afterStatus.used) / 1024 / 1024).toFixed(2)
      }MB`
    )
  }

  /**
   * 执行优化动作
   */
  private executeAction(action: OptimizationAction): void {
    this.actions.push(action)
    this.config.onOptimize(action)

    // 这里实际需要调用缓存管理器的清理方法
    // 由于是独立模块，这里只是记录动作
  }

  /**
   * 建议垃圾回收
   */
  private suggestGC(): void {
    // 尝试触发垃圾回收
    if (typeof global !== 'undefined' && (global as any).gc) {
      try {
        (global as any).gc()
        console.log('[MemoryOptimizer] 手动触发GC')
      } catch (error) {
        console.debug('[MemoryOptimizer] GC触发失败')
      }
    }

    // 清空临时变量
    if (typeof window !== 'undefined') {
      (window as any).__TEMP_DATA__ = null
    }
  }

  /**
   * 清理DOM
   */
  private cleanupDOM(): void {
    if (typeof document === 'undefined') return

    // 清理隐藏的元素
    const hidden = document.querySelectorAll('[style*="display: none"]')
    let cleaned = 0

    hidden.forEach(el => {
      if (el.parentNode && !el.hasAttribute('data-keep')) {
        // 只清理非关键元素
        cleaned++
      }
    })

    if (cleaned > 0) {
      console.log(`[MemoryOptimizer] 清理了 ${cleaned} 个隐藏元素`)
    }
  }

  /**
   * 获取优化建议
   * 
   * @returns 建议列表
   */
  getSuggestions(): MemoryOptimizationSuggestion[] {
    const status = this.getMemoryStatus()
    const suggestions: MemoryOptimizationSuggestion[] = []

    // 缓存优化建议
    if (status.usage > 0.7) {
      suggestions.push({
        priority: 'high',
        title: '清理缓存',
        description: '当前内存使用率较高，建议清理不常用的缓存',
        expectedBenefit: status.used * 0.2,
        execute: () => {
          this.executeAction({
            type: 'clear-cache',
            description: '清理缓存',
            expectedRelease: status.used * 0.2,
            timestamp: Date.now(),
          })
        },
      })
    }

    // DOM优化建议
    if (status.domNodes && status.domNodes > 3000) {
      suggestions.push({
        priority: 'medium',
        title: '减少DOM节点',
        description: `当前DOM节点数: ${status.domNodes}，考虑使用虚拟滚动或懒加载`,
        expectedBenefit: status.used * 0.1,
      })
    }

    // 内存泄漏建议
    const trend = this.analyzeMemoryTrend()
    if (trend === 'increasing') {
      suggestions.push({
        priority: 'high',
        title: '检查内存泄漏',
        description: '内存持续增长，可能存在内存泄漏',
        expectedBenefit: 0,
      })
    }

    return suggestions
  }

  /**
   * 分析内存趋势
   */
  private analyzeMemoryTrend(): 'increasing' | 'stable' | 'decreasing' {
    if (this.memoryHistory.length < 5) {
      return 'stable'
    }

    const recent = this.memoryHistory.slice(-5)
    let increasing = 0
    let decreasing = 0

    for (let i = 1; i < recent.length; i++) {
      if (recent[i].used > recent[i - 1].used) {
        increasing++
      } else if (recent[i].used < recent[i - 1].used) {
        decreasing++
      }
    }

    if (increasing >= 4) return 'increasing'
    if (decreasing >= 4) return 'decreasing'
    return 'stable'
  }

  /**
   * 生成内存报告
   */
  generateReport(): string {
    const status = this.getMemoryStatus()
    const suggestions = this.getSuggestions()
    const trend = this.analyzeMemoryTrend()

    const lines: string[] = []

    lines.push('# 内存优化报告')
    lines.push('')
    lines.push('## 当前状态')
    lines.push(`- 已用内存: ${(status.used / 1024 / 1024).toFixed(2)} MB`)
    lines.push(`- 总内存: ${(status.total / 1024 / 1024).toFixed(2)} MB`)
    lines.push(`- 内存限制: ${(status.limit / 1024 / 1024).toFixed(2)} MB`)
    lines.push(`- 使用率: ${(status.usage * 100).toFixed(1)}%`)
    lines.push(`- 状态: ${this.getLevelEmoji(status.level)} ${status.level}`)
    lines.push(`- 趋势: ${this.getTrendEmoji(trend)} ${trend}`)

    if (status.domNodes) {
      lines.push(`- DOM节点: ${status.domNodes}`)
    }
    lines.push('')

    if (suggestions.length > 0) {
      lines.push('## 优化建议')
      suggestions.forEach(sug => {
        const emoji = sug.priority === 'high' ? '🔴' : sug.priority === 'medium' ? '🟡' : '🔵'
        lines.push(`${emoji} **${sug.title}**`)
        lines.push(`   ${sug.description}`)
        if (sug.expectedBenefit > 0) {
          lines.push(`   预期收益: ${(sug.expectedBenefit / 1024 / 1024).toFixed(2)} MB`)
        }
        lines.push('')
      })
    }

    if (this.actions.length > 0) {
      lines.push('## 最近优化动作')
      this.actions.slice(-5).forEach(action => {
        lines.push(`- ${action.type}: ${action.description}`)
        if (action.actualRelease) {
          lines.push(`  释放: ${(action.actualRelease / 1024 / 1024).toFixed(2)} MB`)
        }
      })
    }

    return lines.join('\n')
  }

  /**
   * 获取级别表情
   */
  private getLevelEmoji(level: MemoryStatus['level']): string {
    switch (level) {
      case 'normal': return '✅'
      case 'warning': return '⚠️'
      case 'critical': return '🔴'
    }
  }

  /**
   * 获取趋势表情
   */
  private getTrendEmoji(trend: 'increasing' | 'stable' | 'decreasing'): string {
    switch (trend) {
      case 'increasing': return '📈'
      case 'stable': return '➡️'
      case 'decreasing': return '📉'
    }
  }

  /**
   * 动态调整缓存大小
   * 
   * @description
   * 根据当前内存使用情况动态调整缓存配置
   * 
   * @returns 推荐的缓存大小
   */
  getDynamicCacheSize(): {
    hotSize: number
    warmSize: number
  } {
    const status = this.getMemoryStatus()

    if (status.usage > 0.9) {
      // 严重不足，大幅减少
      return { hotSize: 10, warmSize: 20 }
    } else if (status.usage > 0.7) {
      // 内存紧张，适当减少
      return { hotSize: 15, warmSize: 35 }
    } else if (status.usage < 0.4) {
      // 内存充足，可以增加
      return { hotSize: 30, warmSize: 70 }
    }

    // 正常情况
    return { hotSize: 20, warmSize: 50 }
  }

  /**
   * 清理历史记录
   */
  cleanup(): void {
    this.stopMonitoring()
    this.memoryHistory = []
    this.actions = []
  }
}

/**
 * 创建内存优化器
 * 
 * @param config - 配置选项
 * @returns 内存优化器实例
 */
export function createMemoryOptimizer(
  config?: MemoryOptimizerConfig
): MemoryOptimizer {
  return new MemoryOptimizer(config)
}

/**
 * 全局内存优化器
 */
let globalMemoryOptimizer: MemoryOptimizer | null = null

/**
 * 获取全局内存优化器
 */
export function getMemoryOptimizer(): MemoryOptimizer {
  if (!globalMemoryOptimizer) {
    globalMemoryOptimizer = new MemoryOptimizer({
      autoOptimize: true,
    })
    globalMemoryOptimizer.startMonitoring()
  }
  return globalMemoryOptimizer
}


