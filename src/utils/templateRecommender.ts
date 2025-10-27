/**
 * 智能模板推荐系统
 * 
 * @description
 * 基于多种策略的智能模板推荐引擎：
 * - 用户行为分析：根据历史使用记录推荐
 * - 设备优化选择：基于设备特性推荐最优模板
 * - 协同过滤：基于相似用户的选择推荐
 * - A/B测试集成：自动应用测试结果
 * - 内容相似度：推荐相似的模板
 * - 流行度推荐：推荐热门模板
 * 
 * @example
 * ```ts
 * const recommender = new TemplateRecommender(templates)
 * 
 * // 记录用户行为
 * recommender.recordUsage(userId, templateId)
 * 
 * // 获取推荐
 * const recommendations = recommender.getRecommendations(userId, {
 *   device: 'mobile',
 *   category: 'login',
 *   limit: 5
 * })
 * ```
 */

import type { DeviceType, TemplateMetadata } from '../types'

/**
 * 用户行为记录
 */
export interface UserBehavior {
  /** 用户ID */
  userId: string
  /** 模板ID */
  templateId: string
  /** 行为类型 */
  action: 'view' | 'use' | 'like' | 'share'
  /** 时间戳 */
  timestamp: number
  /** 停留时间（毫秒） */
  duration?: number
  /** 设备类型 */
  device?: DeviceType
  /** 附加元数据 */
  metadata?: Record<string, any>
}

/**
 * 推荐选项
 */
export interface RecommendationOptions {
  /** 限制结果数量 */
  limit?: number
  /** 设备类型过滤 */
  device?: DeviceType
  /** 分类过滤 */
  category?: string
  /** 排除的模板ID */
  exclude?: string[]
  /** 推荐策略 */
  strategy?: RecommendationStrategy | RecommendationStrategy[]
  /** 策略权重 */
  weights?: Partial<Record<RecommendationStrategy, number>>
}

/**
 * 推荐策略
 */
export type RecommendationStrategy =
  | 'collaborative'  // 协同过滤
  | 'content-based'  // 基于内容
  | 'popularity'     // 基于流行度
  | 'recent'         // 最近使用
  | 'device-optimized' // 设备优化
  | 'ab-test'        // A/B测试

/**
 * 推荐结果
 */
export interface Recommendation {
  /** 模板元数据 */
  template: TemplateMetadata
  /** 推荐分数（0-1） */
  score: number
  /** 推荐原因 */
  reasons: string[]
  /** 使用的策略 */
  strategies: RecommendationStrategy[]
  /** 置信度（0-1） */
  confidence: number
}

/**
 * 设备性能指标
 */
export interface DeviceMetrics {
  /** CPU核心数 */
  cpuCores?: number
  /** 内存大小（GB） */
  memory?: number
  /** 屏幕分辨率 */
  screenResolution?: { width: number; height: number }
  /** 网络类型 */
  networkType?: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'wifi'
  /** 电池状态 */
  batteryLevel?: number
}

/**
 * A/B测试结果
 */
export interface ABTestResult {
  /** 模板ID */
  templateId: string
  /** 变体标识 */
  variant: string
  /** 转化率 */
  conversionRate: number
  /** 样本数 */
  sampleSize: number
  /** 置信度 */
  confidence: number
}

/**
 * 智能模板推荐器
 */
export class TemplateRecommender {
  private templates: Map<string, TemplateMetadata>
  private behaviors: UserBehavior[] = []
  private userPreferences: Map<string, Map<string, number>> = new Map()
  private templateScores: Map<string, number> = new Map()
  private abTestResults: Map<string, ABTestResult> = new Map()

  /**
   * 创建推荐器
   * 
   * @param templates - 模板列表
   */
  constructor(templates: TemplateMetadata[]) {
    this.templates = new Map(
      templates.map(t => [this.getTemplateId(t), t])
    )
    this.initializeScores()
  }

  /**
   * 获取模板ID
   */
  private getTemplateId(template: TemplateMetadata): string {
    return `${template.category}/${template.device}/${template.name}`
  }

  /**
   * 初始化模板分数
   */
  private initializeScores(): void {
    this.templates.forEach((template, id) => {
      // 初始分数基于是否为默认模板
      this.templateScores.set(id, template.isDefault ? 0.8 : 0.5)
    })
  }

  /**
   * 记录用户行为
   * 
   * @description
   * 记录用户的使用行为，用于后续推荐分析
   * 
   * @param userId - 用户ID
   * @param templateId - 模板ID
   * @param action - 行为类型
   * @param metadata - 附加元数据
   */
  recordUsage(
    userId: string,
    templateId: string,
    action: UserBehavior['action'] = 'use',
    metadata?: UserBehavior['metadata']
  ): void {
    const behavior: UserBehavior = {
      userId,
      templateId,
      action,
      timestamp: Date.now(),
      ...metadata,
    }

    this.behaviors.push(behavior)

    // 更新用户偏好
    if (!this.userPreferences.has(userId)) {
      this.userPreferences.set(userId, new Map())
    }

    const preferences = this.userPreferences.get(userId)!
    const currentScore = preferences.get(templateId) || 0

    // 根据行为类型更新分数
    const actionWeights = {
      view: 0.1,
      use: 0.5,
      like: 0.8,
      share: 1.0,
    }

    const newScore = currentScore + actionWeights[action]
    preferences.set(templateId, newScore)

    // 更新全局模板分数
    const globalScore = this.templateScores.get(templateId) || 0.5
    this.templateScores.set(templateId, globalScore + actionWeights[action] * 0.01)

    // 保持行为记录在合理范围内（最近1000条）
    if (this.behaviors.length > 1000) {
      this.behaviors = this.behaviors.slice(-1000)
    }
  }

  /**
   * 获取推荐
   * 
   * @description
   * 基于多种策略生成个性化推荐列表
   * 
   * @param userId - 用户ID
   * @param options - 推荐选项
   * @returns 推荐列表
   */
  getRecommendations(
    userId: string,
    options: RecommendationOptions = {}
  ): Recommendation[] {
    const {
      limit = 10,
      device,
      category,
      exclude = [],
      strategy = ['collaborative', 'content-based', 'popularity'],
      weights = {
        collaborative: 0.4,
        'content-based': 0.3,
        popularity: 0.2,
        recent: 0.1,
      },
    } = options

    // 获取候选模板
    let candidates = Array.from(this.templates.values())

    // 应用过滤条件
    if (device) {
      candidates = candidates.filter(t => t.device === device)
    }
    if (category) {
      candidates = candidates.filter(t => t.category === category)
    }
    candidates = candidates.filter(t => !exclude.includes(this.getTemplateId(t)))

    // 使用多种策略计算推荐分数
    const strategies = Array.isArray(strategy) ? strategy : [strategy]
    const recommendations: Recommendation[] = []

    candidates.forEach(template => {
      const templateId = this.getTemplateId(template)
      let totalScore = 0
      const usedStrategies: RecommendationStrategy[] = []
      const reasons: string[] = []

      strategies.forEach(strat => {
        const weight = weights[strat] || 0.25
        let strategyScore = 0

        switch (strat) {
          case 'collaborative':
            strategyScore = this.collaborativeFiltering(userId, templateId)
            if (strategyScore > 0.5) {
              reasons.push('相似用户也喜欢这个模板')
            }
            break

          case 'content-based':
            strategyScore = this.contentBasedFiltering(userId, template)
            if (strategyScore > 0.5) {
              reasons.push('与您使用过的模板相似')
            }
            break

          case 'popularity':
            strategyScore = this.templateScores.get(templateId) || 0.5
            if (strategyScore > 0.7) {
              reasons.push('热门模板')
            }
            break

          case 'recent':
            strategyScore = this.recentUsageScore(userId, templateId)
            if (strategyScore > 0.5) {
              reasons.push('您最近使用过')
            }
            break

          case 'device-optimized':
            strategyScore = this.deviceOptimizedScore(template, device)
            if (strategyScore > 0.7) {
              reasons.push('为当前设备优化')
            }
            break

          case 'ab-test':
            strategyScore = this.abTestScore(templateId)
            if (strategyScore > 0.7) {
              reasons.push('测试表现优秀')
            }
            break
        }

        if (strategyScore > 0) {
          totalScore += strategyScore * weight
          usedStrategies.push(strat)
        }
      })

      // 归一化分数
      const finalScore = totalScore / strategies.length

      if (finalScore > 0.3) {
        recommendations.push({
          template,
          score: finalScore,
          reasons,
          strategies: usedStrategies,
          confidence: this.calculateConfidence(usedStrategies, finalScore),
        })
      }
    })

    // 排序并返回
    recommendations.sort((a, b) => b.score - a.score)
    return recommendations.slice(0, limit)
  }

  /**
   * 协同过滤
   * 
   * @description
   * 基于相似用户的偏好进行推荐
   * 
   * @param userId - 用户ID
   * @param templateId - 模板ID
   * @returns 推荐分数
   */
  private collaborativeFiltering(userId: string, templateId: string): number {
    const userPrefs = this.userPreferences.get(userId)
    if (!userPrefs || userPrefs.size === 0) {
      return 0.5 // 新用户返回中等分数
    }

    // 找到相似用户
    const similarUsers = this.findSimilarUsers(userId, 5)

    if (similarUsers.length === 0) {
      return 0.5
    }

    // 计算相似用户对该模板的平均偏好
    let totalScore = 0
    let count = 0

    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarUserPrefs = this.userPreferences.get(similarUserId)
      if (similarUserPrefs?.has(templateId)) {
        totalScore += similarUserPrefs.get(templateId)! * similarity
        count++
      }
    })

    return count > 0 ? Math.min(totalScore / count / 10, 1) : 0.5
  }

  /**
   * 查找相似用户
   * 
   * @param userId - 用户ID
   * @param limit - 限制数量
   * @returns 相似用户列表
   */
  private findSimilarUsers(
    userId: string,
    limit: number
  ): Array<{ userId: string; similarity: number }> {
    const userPrefs = this.userPreferences.get(userId)
    if (!userPrefs) return []

    const similarities: Array<{ userId: string; similarity: number }> = []

    this.userPreferences.forEach((otherPrefs, otherUserId) => {
      if (otherUserId === userId) return

      // 计算余弦相似度
      const similarity = this.cosineSimilarity(userPrefs, otherPrefs)
      if (similarity > 0.3) {
        similarities.push({ userId: otherUserId, similarity })
      }
    })

    similarities.sort((a, b) => b.similarity - a.similarity)
    return similarities.slice(0, limit)
  }

  /**
   * 计算余弦相似度
   */
  private cosineSimilarity(
    prefs1: Map<string, number>,
    prefs2: Map<string, number>
  ): number {
    const common = new Set(
      Array.from(prefs1.keys()).filter(k => prefs2.has(k))
    )

    if (common.size === 0) return 0

    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    common.forEach(templateId => {
      const val1 = prefs1.get(templateId)!
      const val2 = prefs2.get(templateId)!
      dotProduct += val1 * val2
      norm1 += val1 * val1
      norm2 += val2 * val2
    })

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }

  /**
   * 基于内容的过滤
   * 
   * @param userId - 用户ID
   * @param template - 模板
   * @returns 推荐分数
   */
  private contentBasedFiltering(
    userId: string,
    template: TemplateMetadata
  ): number {
    const userPrefs = this.userPreferences.get(userId)
    if (!userPrefs || userPrefs.size === 0) {
      return 0.5
    }

    // 获取用户喜欢的模板
    const likedTemplates = Array.from(userPrefs.entries())
      .filter(([_, score]) => score > 5)
      .map(([id, _]) => this.templates.get(id))
      .filter(Boolean) as TemplateMetadata[]

    if (likedTemplates.length === 0) {
      return 0.5
    }

    // 计算与喜欢的模板的平均相似度
    let totalSimilarity = 0

    likedTemplates.forEach(likedTemplate => {
      totalSimilarity += this.templateSimilarity(template, likedTemplate)
    })

    return totalSimilarity / likedTemplates.length
  }

  /**
   * 计算模板相似度
   */
  private templateSimilarity(
    template1: TemplateMetadata,
    template2: TemplateMetadata
  ): number {
    let similarity = 0

    // 分类相同
    if (template1.category === template2.category) {
      similarity += 0.4
    }

    // 设备相同
    if (template1.device === template2.device) {
      similarity += 0.3
    }

    // 标签相似度（Jaccard）
    if (template1.tags && template2.tags) {
      const tags1 = new Set(template1.tags)
      const tags2 = new Set(template2.tags)
      const intersection = new Set([...tags1].filter(t => tags2.has(t)))
      const union = new Set([...tags1, ...tags2])

      if (union.size > 0) {
        similarity += (intersection.size / union.size) * 0.3
      }
    }

    return similarity
  }

  /**
   * 最近使用分数
   */
  private recentUsageScore(userId: string, templateId: string): number {
    const recentBehaviors = this.behaviors
      .filter(b => b.userId === userId && b.templateId === templateId)
      .slice(-5)

    if (recentBehaviors.length === 0) return 0

    const now = Date.now()
    const dayInMs = 24 * 60 * 60 * 1000

    // 计算时间衰减分数
    let score = 0
    recentBehaviors.forEach(behavior => {
      const daysAgo = (now - behavior.timestamp) / dayInMs
      const decayScore = Math.exp(-daysAgo / 7) // 7天半衰期
      score += decayScore
    })

    return Math.min(score / 5, 1)
  }

  /**
   * 设备优化分数
   */
  private deviceOptimizedScore(
    template: TemplateMetadata,
    device?: DeviceType
  ): number {
    if (!device) return 0.5

    // 精确匹配
    if (template.device === device) {
      return 1.0
    }

    // 部分匹配（例如tablet可以降级到mobile）
    if (device === 'tablet' && template.device === 'mobile') {
      return 0.7
    }

    if (device === 'mobile' && template.device === 'tablet') {
      return 0.6
    }

    return 0.3
  }

  /**
   * A/B测试分数
   */
  private abTestScore(templateId: string): number {
    const result = this.abTestResults.get(templateId)
    if (!result) return 0.5

    // 基于转化率和置信度计算分数
    return result.conversionRate * result.confidence
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(
    strategies: RecommendationStrategy[],
    score: number
  ): number {
    // 使用的策略越多，置信度越高
    const strategyFactor = Math.min(strategies.length / 4, 1)

    // 分数越高，置信度越高
    const scoreFactor = score

    return (strategyFactor * 0.5 + scoreFactor * 0.5)
  }

  /**
   * 设置A/B测试结果
   * 
   * @param templateId - 模板ID
   * @param result - 测试结果
   */
  setABTestResult(templateId: string, result: ABTestResult): void {
    this.abTestResults.set(templateId, result)
  }

  /**
   * 获取用户统计
   * 
   * @param userId - 用户ID
   * @returns 用户统计信息
   */
  getUserStats(userId: string): {
    totalBehaviors: number
    preferredTemplates: Array<{ templateId: string; score: number }>
    recentBehaviors: UserBehavior[]
  } {
    const userBehaviors = this.behaviors.filter(b => b.userId === userId)
    const preferences = this.userPreferences.get(userId)

    const preferredTemplates = preferences
      ? Array.from(preferences.entries())
        .map(([templateId, score]) => ({ templateId, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
      : []

    return {
      totalBehaviors: userBehaviors.length,
      preferredTemplates,
      recentBehaviors: userBehaviors.slice(-10),
    }
  }

  /**
   * 清理旧数据
   * 
   * @param daysToKeep - 保留天数
   */
  cleanupOldData(daysToKeep: number = 30): void {
    const cutoff = Date.now() - daysToKeep * 24 * 60 * 60 * 1000
    this.behaviors = this.behaviors.filter(b => b.timestamp > cutoff)
  }
}

/**
 * 创建模板推荐器
 * 
 * @param templates - 模板列表
 * @returns 推荐器实例
 */
export function createTemplateRecommender(
  templates: TemplateMetadata[]
): TemplateRecommender {
  return new TemplateRecommender(templates)
}


