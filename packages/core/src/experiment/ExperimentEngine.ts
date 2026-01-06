/**
 * @ldesign/template-core - Experiment Engine
 * A/B测试引擎，支持多变体测试、流量分配、数据收集和分析
 */

import type { TemplateMetadata, ExperimentConfig, TemplateVariant } from '../types'

/**
 * 实验状态
 */
export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed'

/**
 * 实验事件
 */
export interface ExperimentEvent {
  experimentId: string
  variantId: string
  userId: string
  eventName: string
  eventData?: Record<string, any>
  timestamp: number
}

/**
 * 实验指标
 */
export interface ExperimentMetrics {
  variantId: string
  impressions: number
  conversions: number
  conversionRate: number
  averageEngagement: number
  events: Record<string, number>
}

/**
 * 实验结果
 */
export interface ExperimentResult {
  experimentId: string
  startDate: number
  endDate?: number
  status: ExperimentStatus
  winner?: string
  confidence: number
  metrics: ExperimentMetrics[]
  recommendation: string
}

/**
 * 用户分配记录
 */
interface UserAssignment {
  experimentId: string
  variantId: string
  assignedAt: number
}

/**
 * 实验引擎配置
 */
export interface ExperimentEngineConfig {
  /**
   * 用户ID获取函数
   */
  getUserId?: () => string
  
  /**
   * 事件上报端点
   */
  reportEndpoint?: string
  
  /**
   * 是否自动上报
   * @default true
   */
  autoReport?: boolean
  
  /**
   * 上报批次大小
   * @default 10
   */
  batchSize?: number
  
  /**
   * 上报间隔（毫秒）
   * @default 5000
   */
  reportInterval?: number
}

/**
 * A/B测试引擎
 */
export class ExperimentEngine {
  private experiments: Map<string, ExperimentConfig> = new Map()
  private userAssignments: Map<string, UserAssignment> = new Map()
  private eventQueue: ExperimentEvent[] = []
  private metricsCache: Map<string, Map<string, ExperimentMetrics>> = new Map()
  private config: Required<ExperimentEngineConfig>
  private reportTimer: ReturnType<typeof setInterval> | null = null
  
  constructor(config: ExperimentEngineConfig = {}) {
    this.config = {
      getUserId: config.getUserId ?? (() => this.generateUserId()),
      reportEndpoint: config.reportEndpoint ?? '',
      autoReport: config.autoReport ?? true,
      batchSize: config.batchSize ?? 10,
      reportInterval: config.reportInterval ?? 5000,
    }
    
    // 启动自动上报
    if (this.config.autoReport && this.config.reportEndpoint) {
      this.startAutoReport()
    }
  }
  
  /**
   * 创建实验
   */
  createExperiment(config: ExperimentConfig): void {
    // 验证变体权重
    const totalWeight = config.variants.reduce((sum, v) => sum + v.weight, 0)
    if (Math.abs(totalWeight - 100) > 0.01) {
      console.warn(`实验 ${config.id} 的变体权重总和应为 100，当前为 ${totalWeight}`)
    }
    
    this.experiments.set(config.id, {
      ...config,
      status: config.status || 'draft',
    })
    
    // 初始化指标缓存
    const metricsMap = new Map<string, ExperimentMetrics>()
    for (const variant of config.variants) {
      metricsMap.set(variant.id, {
        variantId: variant.id,
        impressions: 0,
        conversions: 0,
        conversionRate: 0,
        averageEngagement: 0,
        events: {},
      })
    }
    this.metricsCache.set(config.id, metricsMap)
  }
  
  /**
   * 启动实验
   */
  startExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId)
    if (!experiment) return false
    
    experiment.status = 'running'
    experiment.startDate = new Date()
    return true
  }
  
  /**
   * 暂停实验
   */
  pauseExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId)
    if (!experiment || experiment.status !== 'running') return false
    
    experiment.status = 'paused'
    return true
  }
  
  /**
   * 完成实验
   */
  completeExperiment(experimentId: string): ExperimentResult | null {
    const experiment = this.experiments.get(experimentId)
    if (!experiment) return null
    
    experiment.status = 'completed'
    experiment.endDate = new Date()
    
    return this.getResults(experimentId)
  }
  
  /**
   * 获取用户变体
   */
  getVariant(experimentId: string, userId?: string): TemplateVariant | null {
    const experiment = this.experiments.get(experimentId)
    if (!experiment || experiment.status !== 'running') return null
    
    const uid = userId || this.config.getUserId()
    const assignmentKey = `${experimentId}:${uid}`
    
    // 检查是否已分配
    let assignment = this.userAssignments.get(assignmentKey)
    
    if (!assignment) {
      // 检查目标受众
      if (!this.isUserInAudience(experiment, uid)) {
        return null
      }
      
      // 分配变体
      const variant = this.assignVariant(experiment, uid)
      if (!variant) return null
      
      assignment = {
        experimentId,
        variantId: variant.id,
        assignedAt: Date.now(),
      }
      this.userAssignments.set(assignmentKey, assignment)
      
      // 记录曝光
      this.recordImpression(experimentId, variant.id, uid)
    }
    
    return experiment.variants.find(v => v.id === assignment!.variantId) || null
  }
  
  /**
   * 记录事件
   */
  track(
    experimentId: string,
    eventName: string,
    eventData?: Record<string, any>,
    userId?: string
  ): void {
    const experiment = this.experiments.get(experimentId)
    if (!experiment) return
    
    const uid = userId || this.config.getUserId()
    const assignmentKey = `${experimentId}:${uid}`
    const assignment = this.userAssignments.get(assignmentKey)
    
    if (!assignment) return
    
    const event: ExperimentEvent = {
      experimentId,
      variantId: assignment.variantId,
      userId: uid,
      eventName,
      eventData,
      timestamp: Date.now(),
    }
    
    // 添加到队列
    this.eventQueue.push(event)
    
    // 更新指标
    this.updateMetrics(experimentId, assignment.variantId, eventName)
    
    // 检查是否需要立即上报
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flushEvents()
    }
  }
  
  /**
   * 记录转化
   */
  trackConversion(experimentId: string, userId?: string, value?: number): void {
    this.track(experimentId, 'conversion', { value }, userId)
    
    // 更新转化率
    const uid = userId || this.config.getUserId()
    const assignmentKey = `${experimentId}:${uid}`
    const assignment = this.userAssignments.get(assignmentKey)
    
    if (assignment) {
      const metricsMap = this.metricsCache.get(experimentId)
      const metrics = metricsMap?.get(assignment.variantId)
      if (metrics) {
        metrics.conversions++
        metrics.conversionRate = metrics.conversions / metrics.impressions
      }
    }
  }
  
  /**
   * 获取实验结果
   */
  getResults(experimentId: string): ExperimentResult | null {
    const experiment = this.experiments.get(experimentId)
    if (!experiment) return null
    
    const metricsMap = this.metricsCache.get(experimentId)
    if (!metricsMap) return null
    
    const metrics = Array.from(metricsMap.values())
    
    // 计算获胜者
    const winner = this.calculateWinner(metrics)
    const confidence = this.calculateConfidence(metrics)
    
    return {
      experimentId,
      startDate: experiment.startDate?.getTime() || 0,
      endDate: experiment.endDate?.getTime(),
      status: experiment.status,
      winner: winner?.variantId,
      confidence,
      metrics,
      recommendation: this.generateRecommendation(winner, confidence, experiment.status),
    }
  }
  
  /**
   * 获取实验列表
   */
  getExperiments(status?: ExperimentStatus): ExperimentConfig[] {
    const experiments = Array.from(this.experiments.values())
    if (status) {
      return experiments.filter(e => e.status === status)
    }
    return experiments
  }
  
  /**
   * 删除实验
   */
  deleteExperiment(experimentId: string): boolean {
    const deleted = this.experiments.delete(experimentId)
    this.metricsCache.delete(experimentId)
    
    // 清理用户分配
    for (const [key] of this.userAssignments) {
      if (key.startsWith(`${experimentId}:`)) {
        this.userAssignments.delete(key)
      }
    }
    
    return deleted
  }
  
  /**
   * 检查用户是否在目标受众中
   */
  private isUserInAudience(experiment: ExperimentConfig, userId: string): boolean {
    const audience = experiment.targetAudience
    if (!audience) return true
    
    // 检查用户ID白名单
    if (audience.userIds?.includes(userId)) return true
    
    // 检查百分比
    if (audience.percentage < 100) {
      const hash = this.hashUserId(userId)
      return (hash % 100) < audience.percentage
    }
    
    return true
  }
  
  /**
   * 分配变体
   */
  private assignVariant(experiment: ExperimentConfig, userId: string): TemplateVariant | null {
    const variants = experiment.variants
    if (variants.length === 0) return null
    
    // 使用用户ID哈希确保一致性
    const hash = this.hashUserId(`${experiment.id}:${userId}`)
    const normalizedHash = hash % 100
    
    let cumulativeWeight = 0
    for (const variant of variants) {
      cumulativeWeight += variant.weight
      if (normalizedHash < cumulativeWeight) {
        return variant
      }
    }
    
    return variants[variants.length - 1]
  }
  
  /**
   * 记录曝光
   */
  private recordImpression(experimentId: string, variantId: string, userId: string): void {
    const metricsMap = this.metricsCache.get(experimentId)
    const metrics = metricsMap?.get(variantId)
    if (metrics) {
      metrics.impressions++
    }
    
    this.track(experimentId, 'impression', undefined, userId)
  }
  
  /**
   * 更新指标
   */
  private updateMetrics(experimentId: string, variantId: string, eventName: string): void {
    const metricsMap = this.metricsCache.get(experimentId)
    const metrics = metricsMap?.get(variantId)
    if (!metrics) return
    
    if (!metrics.events[eventName]) {
      metrics.events[eventName] = 0
    }
    metrics.events[eventName]++
  }
  
  /**
   * 计算获胜者
   */
  private calculateWinner(metrics: ExperimentMetrics[]): ExperimentMetrics | null {
    if (metrics.length === 0) return null
    
    // 按转化率排序
    const sorted = [...metrics].sort((a, b) => b.conversionRate - a.conversionRate)
    return sorted[0]
  }
  
  /**
   * 计算置信度（简化的卡方检验）
   */
  private calculateConfidence(metrics: ExperimentMetrics[]): number {
    if (metrics.length < 2) return 0
    
    const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0)
    const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0)
    
    if (totalImpressions === 0 || totalConversions === 0) return 0
    
    // 简化计算：基于样本量和转化率差异
    const avgRate = totalConversions / totalImpressions
    const rateVariance = metrics.reduce(
      (sum, m) => sum + Math.pow(m.conversionRate - avgRate, 2),
      0
    ) / metrics.length
    
    // 根据样本量和方差估算置信度
    const sampleFactor = Math.min(totalImpressions / 1000, 1)
    const varianceFactor = Math.sqrt(rateVariance) * 10
    
    const confidence = Math.min(sampleFactor * (1 - Math.exp(-varianceFactor)), 0.99)
    return Math.round(confidence * 100) / 100
  }
  
  /**
   * 生成推荐
   */
  private generateRecommendation(
    winner: ExperimentMetrics | null,
    confidence: number,
    status: ExperimentStatus
  ): string {
    if (status === 'running') {
      if (confidence < 0.9) {
        return '实验进行中，尚未达到统计显著性，建议继续收集数据'
      }
      return `实验进行中，变体 ${winner?.variantId} 表现最佳，置信度 ${(confidence * 100).toFixed(0)}%`
    }
    
    if (status === 'completed') {
      if (confidence >= 0.95) {
        return `实验完成，推荐采用变体 ${winner?.variantId}，置信度 ${(confidence * 100).toFixed(0)}%`
      }
      return '实验完成，但结果未达到统计显著性，建议重新设计实验'
    }
    
    return '实验尚未开始'
  }
  
  /**
   * 用户ID哈希
   */
  private hashUserId(userId: string): number {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }
  
  /**
   * 生成用户ID
   */
  private generateUserId(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      let userId = localStorage.getItem('_experiment_user_id')
      if (!userId) {
        userId = `u_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
        localStorage.setItem('_experiment_user_id', userId)
      }
      return userId
    }
    return `u_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
  }
  
  /**
   * 启动自动上报
   */
  private startAutoReport(): void {
    this.reportTimer = setInterval(() => {
      this.flushEvents()
    }, this.config.reportInterval)
  }
  
  /**
   * 停止自动上报
   */
  stopAutoReport(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer)
      this.reportTimer = null
    }
  }
  
  /**
   * 上报事件
   */
  async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0 || !this.config.reportEndpoint) return
    
    const events = [...this.eventQueue]
    this.eventQueue = []
    
    try {
      await fetch(this.config.reportEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      })
    } catch (error) {
      console.error('Failed to report experiment events:', error)
      // 重新添加失败的事件
      this.eventQueue.unshift(...events)
    }
  }
  
  /**
   * 销毁引擎
   */
  destroy(): void {
    this.stopAutoReport()
    this.flushEvents()
    this.experiments.clear()
    this.userAssignments.clear()
    this.metricsCache.clear()
  }
}

/**
 * 创建实验引擎实例
 */
export function createExperimentEngine(config?: ExperimentEngineConfig): ExperimentEngine {
  return new ExperimentEngine(config)
}