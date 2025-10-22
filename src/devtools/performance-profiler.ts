/**
 * 性能分析器
 * 收集和分析模板性能数据
 */

export interface PerformanceProfile {
  templateId: string
  loadTime: number
  renderTime: number
  updateTime: number
  memoryUsage: number
  cacheHits: number
  cacheMisses: number
  timestamp: number
}

export interface PerformanceReport {
  profiles: PerformanceProfile[]
  summary: {
    avgLoadTime: number
    avgRenderTime: number
    totalMemory: number
    cacheHitRate: number
    slowestTemplate: string
    fastestTemplate: string
  }
  recommendations: string[]
}

/**
 * 性能分析器
 */
export class PerformanceProfiler {
  private profiles: PerformanceProfile[] = []
  private maxProfiles = 100
  private recording = false

  /**
   * 开始记录
   */
  start(): void {
    this.recording = true
    console.log('[Profiler] Recording started')
  }

  /**
   * 停止记录
   */
  stop(): void {
    this.recording = false
    console.log('[Profiler] Recording stopped')
  }

  /**
   * 记录性能数据
   */
  record(profile: PerformanceProfile): void {
    if (!this.recording) return

    this.profiles.push(profile)

    // 限制数组大小
    if (this.profiles.length > this.maxProfiles) {
      this.profiles.shift()
    }
  }

  /**
   * 生成报告
   */
  generateReport(): PerformanceReport {
    if (this.profiles.length === 0) {
      return {
        profiles: [],
        summary: {
          avgLoadTime: 0,
          avgRenderTime: 0,
          totalMemory: 0,
          cacheHitRate: 0,
          slowestTemplate: '',
          fastestTemplate: '',
        },
        recommendations: ['没有性能数据'],
      }
    }

    // 计算汇总数据
    const totalLoadTime = this.profiles.reduce((sum, p) => sum + p.loadTime, 0)
    const totalRenderTime = this.profiles.reduce((sum, p) => sum + p.renderTime, 0)
    const totalMemory = this.profiles.reduce((sum, p) => sum + p.memoryUsage, 0)
    const totalHits = this.profiles.reduce((sum, p) => sum + p.cacheHits, 0)
    const totalMisses = this.profiles.reduce((sum, p) => sum + p.cacheMisses, 0)

    const avgLoadTime = totalLoadTime / this.profiles.length
    const avgRenderTime = totalRenderTime / this.profiles.length
    const cacheHitRate = (totalHits + totalMisses) > 0
      ? totalHits / (totalHits + totalMisses)
      : 0

    // 找到最慢和最快的模板
    let slowest = this.profiles[0]
    let fastest = this.profiles[0]

    this.profiles.forEach(p => {
      if (p.loadTime + p.renderTime > slowest.loadTime + slowest.renderTime) {
        slowest = p
      }
      if (p.loadTime + p.renderTime < fastest.loadTime + fastest.renderTime) {
        fastest = p
      }
    })

    // 生成建议
    const recommendations: string[] = []

    if (avgLoadTime > 100) {
      recommendations.push('平均加载时间较长，考虑启用预加载')
    }

    if (cacheHitRate < 0.8) {
      recommendations.push('缓存命中率较低，检查缓存配置')
    }

    if (totalMemory / this.profiles.length > 10 * 1024 * 1024) {
      recommendations.push('内存占用较高，考虑清理未使用的模板')
    }

    return {
      profiles: this.profiles,
      summary: {
        avgLoadTime,
        avgRenderTime,
        totalMemory,
        cacheHitRate,
        slowestTemplate: slowest.templateId,
        fastestTemplate: fastest.templateId,
      },
      recommendations,
    }
  }

  /**
   * 清除数据
   */
  clear(): void {
    this.profiles = []
  }

  /**
   * 导出数据
   */
  export(): string {
    return JSON.stringify(this.generateReport(), null, 2)
  }
}

/**
 * 全局性能分析器
 */
let globalProfiler: PerformanceProfiler | null = null

/**
 * 获取全局性能分析器
 */
export function getProfiler(): PerformanceProfiler {
  if (!globalProfiler) {
    globalProfiler = new PerformanceProfiler()
  }
  return globalProfiler
}



