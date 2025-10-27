/**
 * 模板搜索工具
 * 
 * @description
 * 提供强大的模板搜索功能：
 * - 全文搜索：搜索模板名称、描述、标签等
 * - 模糊搜索：支持拼写错误容错
 * - 相似度搜索：基于模板特征的相似度匹配
 * - 智能排序：根据相关性和权重排序结果
 * 
 * @example
 * ```ts
 * const searcher = new TemplateSearcher(templates)
 * 
 * // 全文搜索
 * const results = searcher.search('登录')
 * 
 * // 模糊搜索
 * const fuzzyResults = searcher.fuzzySearch('loign') // 容错 'login'
 * 
 * // 相似度搜索
 * const similar = searcher.findSimilar(currentTemplate, { limit: 5 })
 * ```
 */

import type { TemplateMetadata } from '../types'

/**
 * 搜索选项
 */
export interface SearchOptions {
  /** 
   * 搜索字段
   * @default ['name', 'displayName', 'description', 'tags']
   */
  fields?: Array<keyof TemplateMetadata>

  /** 
   * 是否区分大小写
   * @default false
   */
  caseSensitive?: boolean

  /** 
   * 最大结果数
   * @default 50
   */
  limit?: number

  /** 
   * 最小相关性分数（0-1）
   * @default 0.3
   */
  minScore?: number

  /**
   * 字段权重配置
   * @default { name: 2, displayName: 2, description: 1, tags: 1.5 }
   */
  fieldWeights?: Partial<Record<keyof TemplateMetadata, number>>
}

/**
 * 搜索结果
 */
export interface SearchResult {
  /** 模板元数据 */
  template: TemplateMetadata

  /** 相关性分数（0-1） */
  score: number

  /** 匹配的字段 */
  matchedFields: Array<keyof TemplateMetadata>

  /** 匹配的高亮片段 */
  highlights?: Record<string, string>
}

/**
 * 模糊搜索选项
 */
export interface FuzzySearchOptions extends SearchOptions {
  /**
   * 最大编辑距离
   * @default 2
   */
  maxDistance?: number

  /**
   * 容错阈值（0-1）
   * @default 0.7
   */
  threshold?: number
}

/**
 * 相似度搜索选项
 */
export interface SimilarityOptions {
  /**
   * 结果数量限制
   * @default 10
   */
  limit?: number

  /**
   * 最小相似度（0-1）
   * @default 0.5
   */
  minSimilarity?: number

  /**
   * 特征权重
   */
  weights?: {
    /** 分类权重 */
    category?: number
    /** 设备权重 */
    device?: number
    /** 标签权重 */
    tags?: number
    /** 作者权重 */
    author?: number
  }
}

/**
 * 模板搜索器
 */
export class TemplateSearcher {
  private templates: TemplateMetadata[]
  private index: Map<string, Set<number>> // 倒排索引

  /**
   * 创建模板搜索器
   * 
   * @param templates - 模板列表
   */
  constructor(templates: TemplateMetadata[]) {
    this.templates = templates
    this.index = this.buildIndex(templates)
  }

  /**
   * 构建倒排索引
   * 
   * @description
   * 为快速搜索构建倒排索引：
   * - 分词：将文本分解为词条
   * - 归一化：统一大小写、去除标点
   * - 建立映射：词条 → 模板ID列表
   * 
   * @param templates - 模板列表
   * @returns 倒排索引
   */
  private buildIndex(templates: TemplateMetadata[]): Map<string, Set<number>> {
    const index = new Map<string, Set<number>>()

    templates.forEach((template, idx) => {
      // 提取可搜索的文本
      const texts: string[] = [
        template.name,
        template.displayName,
        template.description || '',
        ...(template.tags || []),
        template.author || '',
      ]

      // 分词并建立索引
      texts.forEach(text => {
        const tokens = this.tokenize(text)
        tokens.forEach(token => {
          if (!index.has(token)) {
            index.set(token, new Set())
          }
          index.get(token)!.add(idx)
        })
      })
    })

    return index
  }

  /**
   * 分词
   * 
   * @description
   * 将文本分解为可搜索的词条：
   * - 转小写
   * - 分割为单词
   * - 过滤短词和停用词
   * 
   * @param text - 输入文本
   * @returns 词条数组
   */
  private tokenize(text: string): string[] {
    if (!text) return []

    // 转小写并分割
    const words = text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ') // 保留中英文和数字
      .split(/\s+/)
      .filter(word => word.length > 1) // 过滤单字符

    // 中文分词（简单版本，实际可使用专业分词库）
    const tokens: string[] = []
    words.forEach(word => {
      // 英文单词直接添加
      if (/^[a-z0-9]+$/.test(word)) {
        tokens.push(word)
      } else {
        // 中文按字符添加（简化处理）
        tokens.push(word)
        // 也可以添加双字组合
        for (let i = 0; i < word.length - 1; i++) {
          tokens.push(word.slice(i, i + 2))
        }
      }
    })

    return [...new Set(tokens)] // 去重
  }

  /**
   * 全文搜索
   * 
   * @description
   * 使用倒排索引进行快速全文搜索：
   * 1. 分词查询文本
   * 2. 查找倒排索引
   * 3. 计算相关性分数
   * 4. 排序并返回结果
   * 
   * @param query - 搜索查询
   * @param options - 搜索选项
   * @returns 搜索结果列表
   */
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    const {
      caseSensitive = false,
      limit = 50,
      minScore = 0.3,
      fieldWeights = {
        name: 2,
        displayName: 2,
        description: 1,
        tags: 1.5,
      },
    } = options

    if (!query.trim()) return []

    // 分词查询
    const queryTokens = this.tokenize(caseSensitive ? query : query.toLowerCase())
    if (queryTokens.length === 0) return []

    // 使用倒排索引查找候选模板
    const candidates = new Map<number, number>() // 模板索引 → 匹配词数

    queryTokens.forEach(token => {
      const templateIndices = this.index.get(token)
      if (templateIndices) {
        templateIndices.forEach(idx => {
          candidates.set(idx, (candidates.get(idx) || 0) + 1)
        })
      }
    })

    // 计算分数并构建结果
    const results: SearchResult[] = []

    candidates.forEach((matchCount, idx) => {
      const template = this.templates[idx]
      const score = this.calculateScore(template, queryTokens, matchCount, fieldWeights)

      if (score >= minScore) {
        results.push({
          template,
          score,
          matchedFields: this.getMatchedFields(template, queryTokens),
          highlights: this.generateHighlights(template, queryTokens),
        })
      }
    })

    // 按分数排序
    results.sort((a, b) => b.score - a.score)

    return results.slice(0, limit)
  }

  /**
   * 计算相关性分数
   * 
   * @description
   * 综合考虑多个因素：
   * - 词条匹配数量
   * - 字段权重
   * - 完全匹配加成
   * - 位置加成（前面的权重更高）
   * 
   * @param template - 模板
   * @param queryTokens - 查询词条
   * @param matchCount - 匹配数量
   * @param fieldWeights - 字段权重
   * @returns 相关性分数（0-1）
   */
  private calculateScore(
    template: TemplateMetadata,
    queryTokens: string[],
    matchCount: number,
    fieldWeights: Partial<Record<keyof TemplateMetadata, number>>
  ): number {
    let score = matchCount / queryTokens.length // 基础分数

    // 字段权重加成
    const fields: Array<keyof TemplateMetadata> = ['name', 'displayName', 'description', 'tags']
    fields.forEach(field => {
      const value = template[field]
      if (!value) return

      const text = Array.isArray(value) ? value.join(' ') : String(value)
      const tokens = this.tokenize(text)
      const matches = queryTokens.filter(token => tokens.includes(token))

      if (matches.length > 0) {
        const weight = (fieldWeights[field] || 1)
        score += (matches.length / queryTokens.length) * weight * 0.5
      }
    })

    // 完全匹配加成
    const fullText = [
      template.name,
      template.displayName,
      template.description || '',
    ].join(' ').toLowerCase()

    if (fullText.includes(queryTokens.join(' '))) {
      score += 0.3
    }

    // 归一化到 0-1
    return Math.min(score, 1)
  }

  /**
   * 获取匹配的字段
   * 
   * @param template - 模板
   * @param queryTokens - 查询词条
   * @returns 匹配的字段名列表
   */
  private getMatchedFields(
    template: TemplateMetadata,
    queryTokens: string[]
  ): Array<keyof TemplateMetadata> {
    const matchedFields: Array<keyof TemplateMetadata> = []

    const fields: Array<keyof TemplateMetadata> = ['name', 'displayName', 'description', 'tags']
    fields.forEach(field => {
      const value = template[field]
      if (!value) return

      const text = Array.isArray(value) ? value.join(' ') : String(value)
      const tokens = this.tokenize(text)

      if (queryTokens.some(token => tokens.includes(token))) {
        matchedFields.push(field)
      }
    })

    return matchedFields
  }

  /**
   * 生成高亮片段
   * 
   * @param template - 模板
   * @param queryTokens - 查询词条
   * @returns 高亮片段映射
   */
  private generateHighlights(
    template: TemplateMetadata,
    queryTokens: string[]
  ): Record<string, string> {
    const highlights: Record<string, string> = {}

    const fields: Array<keyof TemplateMetadata> = ['name', 'displayName', 'description']
    fields.forEach(field => {
      const value = template[field]
      if (!value || typeof value !== 'string') return

      // 简单高亮实现
      let highlighted = value
      queryTokens.forEach(token => {
        const regex = new RegExp(token, 'gi')
        highlighted = highlighted.replace(regex, match => `<mark>${match}</mark>`)
      })

      if (highlighted !== value) {
        highlights[field] = highlighted
      }
    })

    return highlights
  }

  /**
   * 模糊搜索
   * 
   * @description
   * 使用编辑距离（Levenshtein Distance）实现容错搜索：
   * - 支持拼写错误
   * - 支持部分匹配
   * - 自动纠错建议
   * 
   * @param query - 搜索查询
   * @param options - 模糊搜索选项
   * @returns 搜索结果列表
   */
  fuzzySearch(query: string, options: FuzzySearchOptions = {}): SearchResult[] {
    const {
      maxDistance = 2,
      threshold = 0.7,
      ...searchOptions
    } = options

    if (!query.trim()) return []

    // 对每个模板计算模糊匹配分数
    const results: SearchResult[] = []

    this.templates.forEach(template => {
      const score = this.calculateFuzzyScore(template, query, maxDistance, threshold)

      if (score >= (searchOptions.minScore || 0.3)) {
        results.push({
          template,
          score,
          matchedFields: this.getFuzzyMatchedFields(template, query, maxDistance),
        })
      }
    })

    // 按分数排序
    results.sort((a, b) => b.score - a.score)

    return results.slice(0, searchOptions.limit || 50)
  }

  /**
   * 计算编辑距离
   * 
   * @description
   * 使用动态规划计算两个字符串的Levenshtein距离
   * 
   * @param str1 - 字符串1
   * @param str2 - 字符串2
   * @returns 编辑距离
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length
    const n = str2.length
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,    // 删除
            dp[i][j - 1] + 1,    // 插入
            dp[i - 1][j - 1] + 1 // 替换
          )
        }
      }
    }

    return dp[m][n]
  }

  /**
   * 计算模糊匹配分数
   * 
   * @param template - 模板
   * @param query - 查询字符串
   * @param maxDistance - 最大编辑距离
   * @param threshold - 阈值
   * @returns 模糊匹配分数
   */
  private calculateFuzzyScore(
    template: TemplateMetadata,
    query: string,
    maxDistance: number,
    threshold: number
  ): number {
    const queryLower = query.toLowerCase()
    let maxScore = 0

    // 检查各个字段
    const fields = [template.name, template.displayName, template.description || '']

    fields.forEach(field => {
      const fieldLower = field.toLowerCase()

      // 计算整体相似度
      const distance = this.levenshteinDistance(queryLower, fieldLower)
      const maxLen = Math.max(queryLower.length, fieldLower.length)
      const similarity = 1 - (distance / maxLen)

      if (similarity >= threshold) {
        maxScore = Math.max(maxScore, similarity)
      }

      // 检查子串匹配
      if (fieldLower.includes(queryLower)) {
        maxScore = Math.max(maxScore, 0.9)
      }

      // 检查词条级别的模糊匹配
      const fieldWords = fieldLower.split(/\s+/)
      const queryWords = queryLower.split(/\s+/)

      queryWords.forEach(queryWord => {
        fieldWords.forEach(fieldWord => {
          const dist = this.levenshteinDistance(queryWord, fieldWord)
          if (dist <= maxDistance) {
            const sim = 1 - (dist / Math.max(queryWord.length, fieldWord.length))
            maxScore = Math.max(maxScore, sim * 0.8)
          }
        })
      })
    })

    return maxScore
  }

  /**
   * 获取模糊匹配的字段
   * 
   * @param template - 模板
   * @param query - 查询字符串
   * @param maxDistance - 最大编辑距离
   * @returns 匹配的字段列表
   */
  private getFuzzyMatchedFields(
    template: TemplateMetadata,
    query: string,
    maxDistance: number
  ): Array<keyof TemplateMetadata> {
    const matchedFields: Array<keyof TemplateMetadata> = []
    const queryLower = query.toLowerCase()

    const fieldMap: Array<[keyof TemplateMetadata, string]> = [
      ['name', template.name],
      ['displayName', template.displayName],
      ['description', template.description || ''],
    ]

    fieldMap.forEach(([fieldName, fieldValue]) => {
      const distance = this.levenshteinDistance(queryLower, fieldValue.toLowerCase())
      if (distance <= maxDistance || fieldValue.toLowerCase().includes(queryLower)) {
        matchedFields.push(fieldName)
      }
    })

    return matchedFields
  }

  /**
   * 查找相似模板
   * 
   * @description
   * 基于模板特征计算相似度：
   * - 分类相似度
   * - 设备相似度
   * - 标签相似度
   * - 作者相似度
   * 
   * @param template - 参考模板
   * @param options - 相似度选项
   * @returns 相似模板列表
   */
  findSimilar(template: TemplateMetadata, options: SimilarityOptions = {}): SearchResult[] {
    const {
      limit = 10,
      minSimilarity = 0.5,
      weights = {
        category: 3,
        device: 2,
        tags: 2,
        author: 1,
      },
    } = options

    const results: SearchResult[] = []

    this.templates.forEach(candidate => {
      // 跳过自己
      if (candidate.name === template.name && candidate.category === template.category) {
        return
      }

      const similarity = this.calculateSimilarity(template, candidate, weights)

      if (similarity >= minSimilarity) {
        results.push({
          template: candidate,
          score: similarity,
          matchedFields: this.getSimilarFields(template, candidate),
        })
      }
    })

    // 按相似度排序
    results.sort((a, b) => b.score - a.score)

    return results.slice(0, limit)
  }

  /**
   * 计算模板相似度
   * 
   * @param template1 - 模板1
   * @param template2 - 模板2
   * @param weights - 特征权重
   * @returns 相似度分数（0-1）
   */
  private calculateSimilarity(
    template1: TemplateMetadata,
    template2: TemplateMetadata,
    weights: Required<SimilarityOptions['weights']>
  ): number {
    let totalWeight = 0
    let weightedScore = 0

    // 分类相似度
    if (template1.category === template2.category) {
      weightedScore += weights.category
    }
    totalWeight += weights.category

    // 设备相似度
    if (template1.device === template2.device) {
      weightedScore += weights.device
    }
    totalWeight += weights.device

    // 标签相似度（Jaccard相似度）
    if (template1.tags && template2.tags) {
      const tags1 = new Set(template1.tags)
      const tags2 = new Set(template2.tags)
      const intersection = new Set([...tags1].filter(x => tags2.has(x)))
      const union = new Set([...tags1, ...tags2])

      if (union.size > 0) {
        const jaccard = intersection.size / union.size
        weightedScore += jaccard * weights.tags
      }
    }
    totalWeight += weights.tags

    // 作者相似度
    if (template1.author && template2.author && template1.author === template2.author) {
      weightedScore += weights.author
    }
    totalWeight += weights.author

    return weightedScore / totalWeight
  }

  /**
   * 获取相似的字段
   * 
   * @param template1 - 模板1
   * @param template2 - 模板2
   * @returns 相似字段列表
   */
  private getSimilarFields(
    template1: TemplateMetadata,
    template2: TemplateMetadata
  ): Array<keyof TemplateMetadata> {
    const similarFields: Array<keyof TemplateMetadata> = []

    if (template1.category === template2.category) similarFields.push('category')
    if (template1.device === template2.device) similarFields.push('device')
    if (template1.author === template2.author) similarFields.push('author')

    if (template1.tags && template2.tags) {
      const intersection = template1.tags.filter(tag => template2.tags!.includes(tag))
      if (intersection.length > 0) similarFields.push('tags')
    }

    return similarFields
  }

  /**
   * 更新模板列表
   * 
   * @param templates - 新的模板列表
   */
  updateTemplates(templates: TemplateMetadata[]): void {
    this.templates = templates
    this.index = this.buildIndex(templates)
  }
}

/**
 * 创建模板搜索器
 * 
 * @param templates - 模板列表
 * @returns 模板搜索器实例
 */
export function createTemplateSearcher(templates: TemplateMetadata[]): TemplateSearcher {
  return new TemplateSearcher(templates)
}



