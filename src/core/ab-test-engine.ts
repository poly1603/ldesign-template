/**
 * A/B 测试引擎
 * 提供完整的 A/B 测试解决方案，包括流量分配、数据收集和自动决策
 */

export interface ABTestVariant {
  id: string
  name: string
  templateId: string
  weight: number
  description?: string
}

export interface ABTestConfig {
  id: string
  name: string
  variants: ABTestVariant[]
  startDate?: Date
  endDate?: Date
  targetAudience?: {
    devices?: string[]
    locations?: string[]
    userGroups?: string[]
  }
  successMetrics?: string[]
  autoDecision?: boolean
  minSampleSize?: number
  confidenceLevel?: number
}

export interface ABTestMetrics {
  variantId: string
  impressions: number
  conversions: number
  conversionRate: number
  averageTime: number
  bounceRate: number
  customMetrics: Record<string, number>
}

export interface ABTestResult {
  testId: string
  winner: string | null
  confidence: number
  metrics: Record<string, ABTestMetrics>
  recommendation: 'continue' | 'stop' | 'winner_found'
  reason?: string
}

/**
 * 用户分配策略
 */
type AllocationStrategy = 'random' | 'consistent' | 'weighted'

/**
 * A/B 测试引擎
 */
export class ABTestEngine {
  // 活跃的测试
  private activeTests = new Map<string, ABTestConfig>()
  // 用户分配记录（持久化到 localStorage）
  private userAllocations = new Map<string, Map<string, string>>()
  // 测试指标
  private metrics = new Map<string, Map<string, ABTestMetrics>>()
  // 分配策略
  private strategy: AllocationStrategy = 'weighted'

  constructor(strategy: AllocationStrategy = 'weighted') {
    this.strategy = strategy
    this.loadFromStorage()
  }

  /**
   * 创建测试
   */
  createTest(config: ABTestConfig): void {
    // 验证权重总和
    const totalWeight = config.variants.reduce((sum, v) => sum + v.weight, 0)
    if (Math.abs(totalWeight - 1) > 0.01) {
      console.warn(`[ABTest] Total weight should be 1.0, got ${totalWeight}`)
    }

    this.activeTests.set(config.id, config)
    this.metrics.set(config.id, new Map())

    // 初始化每个变体的指标
    config.variants.forEach(variant => {
      this.metrics.get(config.id)!.set(variant.id, {
        variantId: variant.id,
        impressions: 0,
        conversions: 0,
        conversionRate: 0,
        averageTime: 0,
        bounceRate: 0,
        customMetrics: {},
      })
    })

    this.saveToStorage()
  }

  /**
   * 为用户分配变体
   */
  allocate(testId: string, userId: string): string | null {
    const test = this.activeTests.get(testId)
    if (!test) {
      console.warn(`[ABTest] Test ${testId} not found`)
      return null
    }

    // 检查是否已分配
    if (!this.userAllocations.has(testId)) {
      this.userAllocations.set(testId, new Map())
    }

    const testAllocations = this.userAllocations.get(testId)!
    const existing = testAllocations.get(userId)

    if (existing) {
      return existing
    }

    // 根据策略分配
    let variantId: string

    switch (this.strategy) {
      case 'random':
        variantId = this.randomAllocation(test.variants)
        break
      case 'consistent':
        variantId = this.consistentAllocation(userId, test.variants)
        break
      case 'weighted':
      default:
        variantId = this.weightedAllocation(test.variants)
        break
    }

    testAllocations.set(userId, variantId)
    this.saveToStorage()

    // 记录曝光
    this.recordImpression(testId, variantId)

    return variantId
  }

  /**
   * 随机分配
   */
  private randomAllocation(variants: ABTestVariant[]): string {
    const index = Math.floor(Math.random() * variants.length)
    return variants[index].id
  }

  /**
   * 一致性分配（基于用户ID哈希）
   */
  private consistentAllocation(userId: string, variants: ABTestVariant[]): string {
    // 简单哈希
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i)
      hash = hash & hash
    }

    const index = Math.abs(hash) % variants.length
    return variants[index].id
  }

  /**
   * 加权分配
   */
  private weightedAllocation(variants: ABTestVariant[]): string {
    const random = Math.random()
    let cumulative = 0

    for (const variant of variants) {
      cumulative += variant.weight
      if (random <= cumulative) {
        return variant.id
      }
    }

    // 降级：返回第一个
    return variants[0].id
  }

  /**
   * 记录曝光
   */
  recordImpression(testId: string, variantId: string): void {
    const testMetrics = this.metrics.get(testId)
    if (!testMetrics) return

    const variantMetrics = testMetrics.get(variantId)
    if (!variantMetrics) return

    variantMetrics.impressions++
    this.saveToStorage()
  }

  /**
   * 记录转化
   */
  recordConversion(testId: string, variantId: string, value: number = 1): void {
    const testMetrics = this.metrics.get(testId)
    if (!testMetrics) return

    const variantMetrics = testMetrics.get(variantId)
    if (!variantMetrics) return

    variantMetrics.conversions += value
    variantMetrics.conversionRate = variantMetrics.impressions > 0
      ? variantMetrics.conversions / variantMetrics.impressions
      : 0

    this.saveToStorage()
  }

  /**
   * 记录自定义指标
   */
  recordMetric(testId: string, variantId: string, metricName: string, value: number): void {
    const testMetrics = this.metrics.get(testId)
    if (!testMetrics) return

    const variantMetrics = testMetrics.get(variantId)
    if (!variantMetrics) return

    if (!variantMetrics.customMetrics[metricName]) {
      variantMetrics.customMetrics[metricName] = 0
    }

    variantMetrics.customMetrics[metricName] += value
    this.saveToStorage()
  }

  /**
   * 分析测试结果
   */
  analyze(testId: string): ABTestResult | null {
    const test = this.activeTests.get(testId)
    const testMetrics = this.metrics.get(testId)

    if (!test || !testMetrics) {
      return null
    }

    const metricsObj: Record<string, ABTestMetrics> = {}
    testMetrics.forEach((metrics, variantId) => {
      metricsObj[variantId] = metrics
    })

    // 找到转化率最高的变体
    let winner: string | null = null
    let maxRate = 0

    testMetrics.forEach((metrics, variantId) => {
      if (metrics.conversionRate > maxRate) {
        maxRate = metrics.conversionRate
        winner = variantId
      }
    })

    // 计算置信度（简化版卡方检验）
    const confidence = this.calculateConfidence(testMetrics, winner)

    // 确定推荐
    const minSampleSize = test.minSampleSize || 100
    const minConfidence = test.confidenceLevel || 0.95
    const totalImpressions = Array.from(testMetrics.values())
      .reduce((sum, m) => sum + m.impressions, 0)

    let recommendation: 'continue' | 'stop' | 'winner_found' = 'continue'
    let reason: string | undefined

    if (totalImpressions < minSampleSize) {
      recommendation = 'continue'
      reason = `需要更多样本 (当前: ${totalImpressions}, 需要: ${minSampleSize})`
    } else if (confidence >= minConfidence && winner) {
      recommendation = 'winner_found'
      reason = `找到胜出变体: ${winner} (置信度: ${(confidence * 100).toFixed(1)}%)`
    } else if (test.autoDecision && totalImpressions > minSampleSize * 2) {
      recommendation = 'stop'
      reason = `样本充足但未达到置信度要求，建议停止测试`
    }

    return {
      testId,
      winner,
      confidence,
      metrics: metricsObj,
      recommendation,
      reason,
    }
  }

  /**
   * 计算置信度（简化版）
   */
  private calculateConfidence(
    testMetrics: Map<string, ABTestMetrics>,
    winner: string | null
  ): number {
    if (!winner || testMetrics.size < 2) return 0

    const winnerMetrics = testMetrics.get(winner)
    if (!winnerMetrics || winnerMetrics.impressions < 10) return 0

    // 与次优变体对比
    let secondBest: ABTestMetrics | null = null
    testMetrics.forEach((metrics, variantId) => {
      if (variantId !== winner &&
        (!secondBest || metrics.conversionRate > secondBest.conversionRate)) {
        secondBest = metrics
      }
    })

    if (!secondBest || secondBest.impressions < 10) return 0

    // 简化的置信度计算（基于差异和样本量）
    const rateDiff = Math.abs(winnerMetrics.conversionRate - secondBest.conversionRate)
    const sampleSizeFactor = Math.min(
      winnerMetrics.impressions,
      secondBest.impressions
    ) / 100

    const confidence = Math.min(rateDiff * sampleSizeFactor * 10, 0.99)
    return confidence
  }

  /**
   * 获取测试配置
   */
  getTest(testId: string): ABTestConfig | null {
    return this.activeTests.get(testId) || null
  }

  /**
   * 获取所有活跃测试
   */
  getActiveTests(): ABTestConfig[] {
    return Array.from(this.activeTests.values())
  }

  /**
   * 停止测试
   */
  stopTest(testId: string): void {
    this.activeTests.delete(testId)
    this.saveToStorage()
  }

  /**
   * 获取用户的变体
   */
  getUserVariant(testId: string, userId: string): string | null {
    return this.userAllocations.get(testId)?.get(userId) || null
  }

  /**
   * 导出测试数据
   */
  export(testId?: string): any {
    if (testId) {
      return {
        config: this.activeTests.get(testId),
        metrics: this.metrics.get(testId),
        allocations: this.userAllocations.get(testId),
      }
    }

    const result: any = {}
    this.activeTests.forEach((config, id) => {
      result[id] = {
        config,
        metrics: this.metrics.get(id),
        allocations: this.userAllocations.get(id),
      }
    })
    return result
  }

  /**
   * 保存到 localStorage
   */
  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return

    try {
      const data = {
        tests: Array.from(this.activeTests.entries()),
        allocations: Array.from(this.userAllocations.entries()).map(([testId, userMap]) => [
          testId,
          Array.from(userMap.entries()),
        ]),
        metrics: Array.from(this.metrics.entries()).map(([testId, variantMap]) => [
          testId,
          Array.from(variantMap.entries()),
        ]),
      }

      localStorage.setItem('ldesign-ab-tests', JSON.stringify(data))
    } catch (error) {
      console.warn('[ABTestEngine] Failed to save to storage:', error)
    }
  }

  /**
   * 从 localStorage 加载
   */
  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return

    try {
      const stored = localStorage.getItem('ldesign-ab-tests')
      if (!stored) return

      const data = JSON.parse(stored)

      // 恢复测试
      if (data.tests) {
        this.activeTests = new Map(data.tests)
      }

      // 恢复分配
      if (data.allocations) {
        this.userAllocations = new Map(
          data.allocations.map(([testId, entries]: [string, any[]]) => [
            testId,
            new Map(entries),
          ])
        )
      }

      // 恢复指标
      if (data.metrics) {
        this.metrics = new Map(
          data.metrics.map(([testId, entries]: [string, any[]]) => [
            testId,
            new Map(entries),
          ])
        )
      }
    } catch (error) {
      console.warn('[ABTestEngine] Failed to load from storage:', error)
    }
  }

  /**
   * 清除测试数据
   */
  clear(testId?: string): void {
    if (testId) {
      this.activeTests.delete(testId)
      this.userAllocations.delete(testId)
      this.metrics.delete(testId)
    } else {
      this.activeTests.clear()
      this.userAllocations.clear()
      this.metrics.clear()
    }

    this.saveToStorage()
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const activeTestCount = this.activeTests.size
    let totalVariants = 0
    let totalUsers = 0
    let totalImpressions = 0
    let totalConversions = 0

    this.activeTests.forEach(test => {
      totalVariants += test.variants.length
    })

    this.userAllocations.forEach(userMap => {
      totalUsers += userMap.size
    })

    this.metrics.forEach(variantMap => {
      variantMap.forEach(metrics => {
        totalImpressions += metrics.impressions
        totalConversions += metrics.conversions
      })
    })

    return {
      activeTests: activeTestCount,
      totalVariants,
      totalUsers,
      totalImpressions,
      totalConversions,
      overallConversionRate: totalImpressions > 0
        ? totalConversions / totalImpressions
        : 0,
    }
  }
}

/**
 * 全局 A/B 测试引擎
 */
let globalABTestEngine: ABTestEngine | null = null

/**
 * 获取全局 A/B 测试引擎
 */
export function getABTestEngine(): ABTestEngine {
  if (!globalABTestEngine) {
    globalABTestEngine = new ABTestEngine()
  }
  return globalABTestEngine
}

/**
 * 创建 A/B 测试引擎
 */
export function createABTestEngine(strategy?: AllocationStrategy): ABTestEngine {
  return new ABTestEngine(strategy)
}



