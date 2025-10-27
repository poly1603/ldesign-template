/**
 * 性能分析器
 * 
 * @description
 * 深度性能分析工具，提供：
 * - 组件加载时间分析
 * - 渲染性能监控
 * - 内存使用分析
 * - 慢查询检测
 * - 性能火焰图数据生成
 * - 性能评分和优化建议
 * 
 * @example
 * ```ts
 * const analyzer = new PerformanceAnalyzer()
 * 
 * // 开始分析
 * analyzer.startProfile('template-load')
 * await loadTemplate()
 * analyzer.endProfile('template-load')
 * 
 * // 生成报告
 * const report = analyzer.generateReport()
 * console.log(report)
 * ```
 */

/**
 * 性能度量数据
 */
export interface PerformanceMetric {
  /** 度量名称 */
  name: string
  /** 开始时间 */
  startTime: number
  /** 结束时间 */
  endTime?: number
  /** 持续时间（毫秒） */
  duration?: number
  /** 元数据 */
  metadata?: Record<string, any>
  /** 子度量 */
  children?: PerformanceMetric[]
}

/**
 * 性能报告
 */
export interface PerformanceReport {
  /** 生成时间 */
  timestamp: number
  /** 总执行时间 */
  totalDuration: number
  /** 所有度量 */
  metrics: PerformanceMetric[]
  /** 慢操作列表 */
  slowOperations: SlowOperation[]
  /** 内存快照 */
  memorySnapshot?: MemorySnapshot
  /** 性能评分 */
  performanceScore: PerformanceScore
  /** 优化建议 */
  recommendations: PerformanceRecommendation[]
  /** 火焰图数据 */
  flameGraphData?: FlameGraphNode[]
}

/**
 * 慢操作
 */
export interface SlowOperation {
  /** 操作名称 */
  name: string
  /** 持续时间 */
  duration: number
  /** 阈值 */
  threshold: number
  /** 超出百分比 */
  overagePercent: number
  /** 堆栈跟踪 */
  stack?: string
}

/**
 * 内存快照
 */
export interface MemorySnapshot {
  /** 时间戳 */
  timestamp: number
  /** 已用堆大小（字节） */
  usedJSHeapSize: number
  /** 总堆大小（字节） */
  totalJSHeapSize: number
  /** 堆大小限制（字节） */
  jsHeapSizeLimit: number
  /** 使用率（百分比） */
  usagePercent: number
  /** DOM节点数 */
  domNodes?: number
  /** 监听器数量 */
  listeners?: number
}

/**
 * 性能评分
 */
export interface PerformanceScore {
  /** 总分（0-100） */
  overall: number
  /** 加载速度分数 */
  loadSpeed: number
  /** 渲染性能分数 */
  renderPerformance: number
  /** 内存效率分数 */
  memoryEfficiency: number
  /** 响应速度分数 */
  responsiveness: number
}

/**
 * 性能建议
 */
export interface PerformanceRecommendation {
  /** 建议类型 */
  type: 'critical' | 'warning' | 'info'
  /** 建议标题 */
  title: string
  /** 建议描述 */
  description: string
  /** 预期收益 */
  expectedImpact: string
  /** 相关度量 */
  relatedMetrics: string[]
}

/**
 * 火焰图节点
 */
export interface FlameGraphNode {
  /** 节点名称 */
  name: string
  /** 开始时间 */
  start: number
  /** 持续时间 */
  duration: number
  /** 子节点 */
  children: FlameGraphNode[]
  /** 颜色（用于可视化） */
  color?: string
}

/**
 * 性能阈值配置
 */
export interface PerformanceThresholds {
  /** 慢操作阈值（毫秒） */
  slowOperationThreshold?: number
  /** 内存警告阈值（百分比） */
  memoryWarningThreshold?: number
  /** FPS警告阈值 */
  fpsWarningThreshold?: number
}

/**
 * 性能分析器类
 */
export class PerformanceAnalyzer {
  private metrics: Map<string, PerformanceMetric> = new Map()
  private activeMetrics: Map<string, PerformanceMetric> = new Map()
  private memorySnapshots: MemorySnapshot[] = []
  private frameTimestamps: number[] = []
  private thresholds: Required<PerformanceThresholds>

  /**
   * 创建性能分析器
   * 
   * @param thresholds - 性能阈值配置
   */
  constructor(thresholds: PerformanceThresholds = {}) {
    this.thresholds = {
      slowOperationThreshold: thresholds.slowOperationThreshold || 100,
      memoryWarningThreshold: thresholds.memoryWarningThreshold || 80,
      fpsWarningThreshold: thresholds.fpsWarningThreshold || 30,
    }

    // 启动FPS监控
    if (typeof requestAnimationFrame !== 'undefined') {
      this.startFPSMonitoring()
    }
  }

  /**
   * 开始性能分析
   * 
   * @description
   * 标记性能分析的开始点，记录时间戳和初始状态
   * 
   * @param name - 度量名称
   * @param metadata - 元数据
   * @returns 度量ID
   */
  startProfile(name: string, metadata?: Record<string, any>): string {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
      children: [],
    }

    const id = `${name}-${Date.now()}`
    this.activeMetrics.set(id, metric)

    // 记录内存快照
    this.captureMemorySnapshot()

    return id
  }

  /**
   * 结束性能分析
   * 
   * @description
   * 标记性能分析的结束点，计算持续时间并保存结果
   * 
   * @param id - 度量ID（由startProfile返回）
   * @returns 持续时间（毫秒）
   */
  endProfile(id: string): number | null {
    const metric = this.activeMetrics.get(id)
    if (!metric) {
      console.warn(`[PerformanceAnalyzer] 未找到度量: ${id}`)
      return null
    }

    metric.endTime = performance.now()
    metric.duration = metric.endTime - metric.startTime

    // 移动到完成的度量集合
    this.metrics.set(id, metric)
    this.activeMetrics.delete(id)

    // 记录内存快照
    this.captureMemorySnapshot()

    return metric.duration
  }

  /**
   * 标记性能点
   * 
   * @description
   * 在代码中标记关键性能点，用于分析瓶颈
   * 
   * @param name - 标记名称
   * @param metadata - 元数据
   */
  mark(name: string, metadata?: Record<string, any>): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name)
    }

    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      endTime: performance.now(),
      duration: 0,
      metadata,
    }

    this.metrics.set(`mark-${name}-${Date.now()}`, metric)
  }

  /**
   * 测量性能区间
   * 
   * @description
   * 测量两个标记之间的性能
   * 
   * @param name - 测量名称
   * @param startMark - 开始标记
   * @param endMark - 结束标记
   * @returns 持续时间（毫秒）
   */
  measure(name: string, startMark: string, endMark: string): number | null {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark)
        const entries = performance.getEntriesByName(name, 'measure')
        if (entries.length > 0) {
          const duration = entries[entries.length - 1].duration

          const metric: PerformanceMetric = {
            name,
            startTime: entries[entries.length - 1].startTime,
            endTime: entries[entries.length - 1].startTime + duration,
            duration,
          }

          this.metrics.set(`measure-${name}-${Date.now()}`, metric)
          return duration
        }
      } catch (error) {
        console.warn('[PerformanceAnalyzer] 测量失败:', error)
      }
    }
    return null
  }

  /**
   * 捕获内存快照
   * 
   * @description
   * 记录当前内存使用情况
   * 
   * @returns 内存快照
   */
  private captureMemorySnapshot(): MemorySnapshot | null {
    if (typeof performance === 'undefined' || !('memory' in performance)) {
      return null
    }

    const memory = (performance as any).memory
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    }

    // 记录DOM节点数
    if (typeof document !== 'undefined') {
      snapshot.domNodes = document.getElementsByTagName('*').length
    }

    this.memorySnapshots.push(snapshot)

    // 保留最近20个快照
    if (this.memorySnapshots.length > 20) {
      this.memorySnapshots.shift()
    }

    return snapshot
  }

  /**
   * 启动FPS监控
   * 
   * @description
   * 使用requestAnimationFrame监控帧率
   */
  private startFPSMonitoring(): void {
    const monitorFrame = () => {
      this.frameTimestamps.push(performance.now())

      // 保留最近60帧
      if (this.frameTimestamps.length > 60) {
        this.frameTimestamps.shift()
      }

      requestAnimationFrame(monitorFrame)
    }

    requestAnimationFrame(monitorFrame)
  }

  /**
   * 计算当前FPS
   * 
   * @returns FPS值
   */
  private calculateFPS(): number {
    if (this.frameTimestamps.length < 2) return 60

    const timeSpan = this.frameTimestamps[this.frameTimestamps.length - 1] - this.frameTimestamps[0]
    const frameCount = this.frameTimestamps.length - 1

    return timeSpan > 0 ? (frameCount / timeSpan) * 1000 : 60
  }

  /**
   * 检测慢操作
   * 
   * @description
   * 识别执行时间超过阈值的操作
   * 
   * @returns 慢操作列表
   */
  private detectSlowOperations(): SlowOperation[] {
    const slowOps: SlowOperation[] = []

    this.metrics.forEach(metric => {
      if (metric.duration && metric.duration > this.thresholds.slowOperationThreshold) {
        slowOps.push({
          name: metric.name,
          duration: metric.duration,
          threshold: this.thresholds.slowOperationThreshold,
          overagePercent: ((metric.duration - this.thresholds.slowOperationThreshold) /
            this.thresholds.slowOperationThreshold) * 100,
        })
      }
    })

    return slowOps.sort((a, b) => b.duration - a.duration)
  }

  /**
   * 计算性能评分
   * 
   * @description
   * 基于多个指标综合评分
   * 
   * @returns 性能评分对象
   */
  private calculatePerformanceScore(): PerformanceScore {
    // 加载速度评分
    const loadMetrics = Array.from(this.metrics.values()).filter(m =>
      m.name.includes('load') || m.name.includes('init')
    )
    const avgLoadTime = loadMetrics.length > 0
      ? loadMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / loadMetrics.length
      : 0
    const loadSpeed = Math.max(0, 100 - (avgLoadTime / 10)) // 每10ms扣1分

    // 渲染性能评分（基于FPS）
    const currentFPS = this.calculateFPS()
    const renderPerformance = Math.min(100, (currentFPS / 60) * 100)

    // 内存效率评分
    const latestMemory = this.memorySnapshots[this.memorySnapshots.length - 1]
    const memoryEfficiency = latestMemory
      ? Math.max(0, 100 - latestMemory.usagePercent)
      : 100

    // 响应速度评分（基于慢操作数量）
    const slowOps = this.detectSlowOperations()
    const responsiveness = Math.max(0, 100 - (slowOps.length * 10))

    // 综合评分
    const overall = (loadSpeed * 0.3 + renderPerformance * 0.3 +
      memoryEfficiency * 0.2 + responsiveness * 0.2)

    return {
      overall: Math.round(overall),
      loadSpeed: Math.round(loadSpeed),
      renderPerformance: Math.round(renderPerformance),
      memoryEfficiency: Math.round(memoryEfficiency),
      responsiveness: Math.round(responsiveness),
    }
  }

  /**
   * 生成性能建议
   * 
   * @description
   * 基于性能数据生成优化建议
   * 
   * @param score - 性能评分
   * @param slowOps - 慢操作列表
   * @returns 建议列表
   */
  private generateRecommendations(
    score: PerformanceScore,
    slowOps: SlowOperation[]
  ): PerformanceRecommendation[] {
    const recommendations: PerformanceRecommendation[] = []

    // 加载速度建议
    if (score.loadSpeed < 70) {
      recommendations.push({
        type: 'critical',
        title: '优化模板加载速度',
        description: '模板加载时间过长，考虑使用预加载、代码分割或懒加载策略',
        expectedImpact: '可提升 20-30% 的加载速度',
        relatedMetrics: ['load', 'init'],
      })
    }

    // 渲染性能建议
    if (score.renderPerformance < 70) {
      recommendations.push({
        type: 'warning',
        title: '改善渲染性能',
        description: 'FPS低于推荐值，考虑减少DOM操作、使用虚拟滚动或优化动画',
        expectedImpact: '可提升 15-25% 的流畅度',
        relatedMetrics: ['render', 'update'],
      })
    }

    // 内存效率建议
    if (score.memoryEfficiency < 70) {
      const latestMemory = this.memorySnapshots[this.memorySnapshots.length - 1]
      recommendations.push({
        type: latestMemory && latestMemory.usagePercent > 90 ? 'critical' : 'warning',
        title: '优化内存使用',
        description: '内存使用率过高，检查是否存在内存泄漏或缓存策略不当',
        expectedImpact: '可降低 20-40% 的内存占用',
        relatedMetrics: ['memory'],
      })
    }

    // 慢操作建议
    if (slowOps.length > 0) {
      const topSlow = slowOps[0]
      recommendations.push({
        type: topSlow.overagePercent > 100 ? 'critical' : 'warning',
        title: `优化慢操作: ${topSlow.name}`,
        description: `该操作耗时 ${topSlow.duration.toFixed(2)}ms，超出阈值 ${topSlow.overagePercent.toFixed(0)}%`,
        expectedImpact: '可提升整体响应速度',
        relatedMetrics: [topSlow.name],
      })
    }

    // DOM节点建议
    const latestMemory = this.memorySnapshots[this.memorySnapshots.length - 1]
    if (latestMemory && latestMemory.domNodes && latestMemory.domNodes > 3000) {
      recommendations.push({
        type: 'info',
        title: '减少DOM节点数量',
        description: `当前DOM节点数: ${latestMemory.domNodes}，过多的DOM节点会影响性能`,
        expectedImpact: '可提升 10-20% 的渲染速度',
        relatedMetrics: ['dom'],
      })
    }

    return recommendations
  }

  /**
   * 生成火焰图数据
   * 
   * @description
   * 将性能度量转换为火焰图可视化数据
   * 
   * @returns 火焰图节点列表
   */
  private generateFlameGraphData(): FlameGraphNode[] {
    const nodes: FlameGraphNode[] = []

    this.metrics.forEach(metric => {
      if (!metric.duration) return

      const node: FlameGraphNode = {
        name: metric.name,
        start: metric.startTime,
        duration: metric.duration,
        children: [],
        color: this.getFlameColor(metric.duration),
      }

      nodes.push(node)
    })

    // 按开始时间排序
    nodes.sort((a, b) => a.start - b.start)

    return nodes
  }

  /**
   * 获取火焰图颜色
   * 
   * @param duration - 持续时间
   * @returns 颜色值
   */
  private getFlameColor(duration: number): string {
    // 根据持续时间返回不同颜色
    if (duration < 10) return '#4CAF50' // 绿色 - 快速
    if (duration < 50) return '#FFC107' // 黄色 - 正常
    if (duration < 100) return '#FF9800' // 橙色 - 偏慢
    return '#F44336' // 红色 - 慢
  }

  /**
   * 生成性能报告
   * 
   * @description
   * 综合所有性能数据生成完整报告
   * 
   * @returns 性能报告对象
   */
  generateReport(): PerformanceReport {
    const metrics = Array.from(this.metrics.values())
    const totalDuration = metrics.reduce((sum, m) => sum + (m.duration || 0), 0)
    const slowOps = this.detectSlowOperations()
    const score = this.calculatePerformanceScore()
    const recommendations = this.generateRecommendations(score, slowOps)
    const flameGraphData = this.generateFlameGraphData()
    const memorySnapshot = this.memorySnapshots[this.memorySnapshots.length - 1]

    return {
      timestamp: Date.now(),
      totalDuration,
      metrics,
      slowOperations: slowOps,
      memorySnapshot,
      performanceScore: score,
      recommendations,
      flameGraphData,
    }
  }

  /**
   * 清空所有度量数据
   */
  clear(): void {
    this.metrics.clear()
    this.activeMetrics.clear()
    this.memorySnapshots = []
    this.frameTimestamps = []
  }

  /**
   * 导出报告为JSON
   * 
   * @returns JSON字符串
   */
  exportReport(): string {
    const report = this.generateReport()
    return JSON.stringify(report, null, 2)
  }

  /**
   * 打印性能摘要
   * 
   * @description
   * 在控制台打印格式化的性能摘要
   */
  printSummary(): void {
    const report = this.generateReport()

    console.group('📊 性能分析报告')
    console.log(`总执行时间: ${report.totalDuration.toFixed(2)}ms`)
    console.log(`性能评分: ${report.performanceScore.overall}/100`)
    console.log(`- 加载速度: ${report.performanceScore.loadSpeed}/100`)
    console.log(`- 渲染性能: ${report.performanceScore.renderPerformance}/100`)
    console.log(`- 内存效率: ${report.performanceScore.memoryEfficiency}/100`)
    console.log(`- 响应速度: ${report.performanceScore.responsiveness}/100`)

    if (report.slowOperations.length > 0) {
      console.group(`⚠️ 慢操作 (${report.slowOperations.length})`)
      report.slowOperations.forEach(op => {
        console.log(`- ${op.name}: ${op.duration.toFixed(2)}ms (超出 ${op.overagePercent.toFixed(0)}%)`)
      })
      console.groupEnd()
    }

    if (report.recommendations.length > 0) {
      console.group(`💡 优化建议 (${report.recommendations.length})`)
      report.recommendations.forEach(rec => {
        const icon = rec.type === 'critical' ? '🔴' : rec.type === 'warning' ? '🟡' : '🔵'
        console.log(`${icon} ${rec.title}`)
        console.log(`   ${rec.description}`)
      })
      console.groupEnd()
    }

    console.groupEnd()
  }
}

/**
 * 创建性能分析器
 * 
 * @param thresholds - 性能阈值配置
 * @returns 性能分析器实例
 */
export function createPerformanceAnalyzer(
  thresholds?: PerformanceThresholds
): PerformanceAnalyzer {
  return new PerformanceAnalyzer(thresholds)
}

/**
 * 全局性能分析器实例
 */
let globalAnalyzer: PerformanceAnalyzer | null = null

/**
 * 获取全局性能分析器
 * 
 * @returns 性能分析器实例
 */
export function getPerformanceAnalyzer(): PerformanceAnalyzer {
  if (!globalAnalyzer) {
    globalAnalyzer = new PerformanceAnalyzer()
  }
  return globalAnalyzer
}



