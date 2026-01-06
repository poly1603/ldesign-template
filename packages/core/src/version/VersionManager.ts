/**
 * @ldesign/template-core - Version Manager
 * 模板版本管理器，支持版本控制、回滚、比较等功能
 */

import type { TemplateMetadata, TemplateVersion } from '../types'

/**
 * 版本历史记录
 */
interface VersionHistory {
  templateId: string
  versions: VersionEntry[]
  currentVersion: string
  createdAt: number
  updatedAt: number
}

/**
 * 版本条目
 */
interface VersionEntry {
  version: string
  metadata: TemplateMetadata
  releaseDate: number
  changelog?: string
  deprecated?: boolean
  breaking?: boolean
  size?: number
  hash?: string
}

/**
 * 版本比较结果
 */
export interface VersionDiff {
  from: string
  to: string
  changes: {
    field: string
    oldValue: any
    newValue: any
    type: 'added' | 'removed' | 'modified'
  }[]
  breaking: boolean
  summary: string
}

/**
 * 版本管理器配置
 */
export interface VersionManagerConfig {
  /**
   * 最大保留版本数
   * @default 10
   */
  maxVersions?: number
  
  /**
   * 是否自动清理旧版本
   * @default true
   */
  autoCleanup?: boolean
  
  /**
   * 版本存储方式
   * @default 'memory'
   */
  storage?: 'memory' | 'indexeddb' | 'remote'
  
  /**
   * 远程存储端点
   */
  remoteEndpoint?: string
}

/**
 * 模板版本管理器
 */
export class VersionManager {
  private histories: Map<string, VersionHistory> = new Map()
  private config: Required<VersionManagerConfig>
  
  constructor(config: VersionManagerConfig = {}) {
    this.config = {
      maxVersions: config.maxVersions ?? 10,
      autoCleanup: config.autoCleanup ?? true,
      storage: config.storage ?? 'memory',
      remoteEndpoint: config.remoteEndpoint ?? '',
    }
  }
  
  /**
   * 注册新版本
   */
  registerVersion(
    templateId: string,
    metadata: TemplateMetadata,
    options: {
      changelog?: string
      breaking?: boolean
      deprecated?: boolean
    } = {}
  ): void {
    const version = metadata.version || '1.0.0'
    const entry: VersionEntry = {
      version,
      metadata,
      releaseDate: Date.now(),
      changelog: options.changelog,
      breaking: options.breaking,
      deprecated: options.deprecated,
      size: this.calculateSize(metadata),
      hash: this.calculateHash(metadata),
    }
    
    let history = this.histories.get(templateId)
    
    if (!history) {
      history = {
        templateId,
        versions: [],
        currentVersion: version,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      this.histories.set(templateId, history)
    }
    
    // 检查版本是否已存在
    const existingIndex = history.versions.findIndex(v => v.version === version)
    if (existingIndex >= 0) {
      history.versions[existingIndex] = entry
    } else {
      history.versions.push(entry)
      // 按版本号排序
      history.versions.sort((a, b) => this.compareVersions(b.version, a.version))
    }
    
    history.currentVersion = version
    history.updatedAt = Date.now()
    
    // 自动清理旧版本
    if (this.config.autoCleanup && history.versions.length > this.config.maxVersions) {
      this.cleanupOldVersions(templateId)
    }
  }
  
  /**
   * 获取所有版本
   */
  getVersions(templateId: string): VersionEntry[] {
    const history = this.histories.get(templateId)
    return history?.versions || []
  }
  
  /**
   * 获取当前版本
   */
  getCurrentVersion(templateId: string): string | null {
    const history = this.histories.get(templateId)
    return history?.currentVersion || null
  }
  
  /**
   * 获取指定版本
   */
  getVersion(templateId: string, version: string): VersionEntry | null {
    const history = this.histories.get(templateId)
    return history?.versions.find(v => v.version === version) || null
  }
  
  /**
   * 获取最新版本
   */
  getLatestVersion(templateId: string): VersionEntry | null {
    const history = this.histories.get(templateId)
    if (!history || history.versions.length === 0) return null
    return history.versions[0]
  }
  
  /**
   * 切换到指定版本
   */
  switchVersion(templateId: string, version: string): VersionEntry | null {
    const history = this.histories.get(templateId)
    if (!history) return null
    
    const entry = history.versions.find(v => v.version === version)
    if (!entry) return null
    
    history.currentVersion = version
    history.updatedAt = Date.now()
    
    return entry
  }
  
  /**
   * 回滚到上一个版本
   */
  rollback(templateId: string): VersionEntry | null {
    const history = this.histories.get(templateId)
    if (!history || history.versions.length < 2) return null
    
    const currentIndex = history.versions.findIndex(
      v => v.version === history.currentVersion
    )
    
    if (currentIndex < 0 || currentIndex >= history.versions.length - 1) {
      return null
    }
    
    const previousVersion = history.versions[currentIndex + 1]
    history.currentVersion = previousVersion.version
    history.updatedAt = Date.now()
    
    return previousVersion
  }
  
  /**
   * 比较两个版本
   */
  compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number)
    const parts2 = v2.split('.').map(Number)
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0
      const p2 = parts2[i] || 0
      
      if (p1 > p2) return 1
      if (p1 < p2) return -1
    }
    
    return 0
  }
  
  /**
   * 获取版本差异
   */
  diff(templateId: string, fromVersion: string, toVersion: string): VersionDiff | null {
    const fromEntry = this.getVersion(templateId, fromVersion)
    const toEntry = this.getVersion(templateId, toVersion)
    
    if (!fromEntry || !toEntry) return null
    
    const changes: VersionDiff['changes'] = []
    const fromMeta = fromEntry.metadata
    const toMeta = toEntry.metadata
    
    // 比较所有字段
    const allKeys = new Set([
      ...Object.keys(fromMeta),
      ...Object.keys(toMeta),
    ])
    
    for (const key of allKeys) {
      const oldValue = (fromMeta as any)[key]
      const newValue = (toMeta as any)[key]
      
      if (oldValue === undefined && newValue !== undefined) {
        changes.push({ field: key, oldValue, newValue, type: 'added' })
      } else if (oldValue !== undefined && newValue === undefined) {
        changes.push({ field: key, oldValue, newValue, type: 'removed' })
      } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({ field: key, oldValue, newValue, type: 'modified' })
      }
    }
    
    const breaking = toEntry.breaking || false
    
    return {
      from: fromVersion,
      to: toVersion,
      changes,
      breaking,
      summary: this.generateDiffSummary(changes, breaking),
    }
  }
  
  /**
   * 标记版本为废弃
   */
  deprecateVersion(templateId: string, version: string, reason?: string): boolean {
    const entry = this.getVersion(templateId, version)
    if (!entry) return false
    
    entry.deprecated = true
    if (reason) {
      entry.changelog = `[DEPRECATED] ${reason}`
    }
    
    return true
  }
  
  /**
   * 检查是否有可用更新
   */
  hasUpdate(templateId: string): boolean {
    const history = this.histories.get(templateId)
    if (!history || history.versions.length === 0) return false
    
    const latestVersion = history.versions[0].version
    return this.compareVersions(latestVersion, history.currentVersion) > 0
  }
  
  /**
   * 获取版本统计
   */
  getStats(templateId: string): {
    totalVersions: number
    deprecatedCount: number
    breakingCount: number
    averageSize: number
    oldestVersion: string
    newestVersion: string
  } | null {
    const history = this.histories.get(templateId)
    if (!history || history.versions.length === 0) return null
    
    const versions = history.versions
    const deprecatedCount = versions.filter(v => v.deprecated).length
    const breakingCount = versions.filter(v => v.breaking).length
    const totalSize = versions.reduce((sum, v) => sum + (v.size || 0), 0)
    
    return {
      totalVersions: versions.length,
      deprecatedCount,
      breakingCount,
      averageSize: totalSize / versions.length,
      oldestVersion: versions[versions.length - 1].version,
      newestVersion: versions[0].version,
    }
  }
  
  /**
   * 清理旧版本
   */
  private cleanupOldVersions(templateId: string): void {
    const history = this.histories.get(templateId)
    if (!history) return
    
    // 保留最新的 N 个版本
    history.versions = history.versions.slice(0, this.config.maxVersions)
  }
  
  /**
   * 计算元数据大小
   */
  private calculateSize(metadata: TemplateMetadata): number {
    try {
      return JSON.stringify(metadata).length
    } catch {
      return 0
    }
  }
  
  /**
   * 计算元数据哈希
   */
  private calculateHash(metadata: TemplateMetadata): string {
    try {
      const str = JSON.stringify(metadata)
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
      }
      return Math.abs(hash).toString(16)
    } catch {
      return ''
    }
  }
  
  /**
   * 生成差异摘要
   */
  private generateDiffSummary(changes: VersionDiff['changes'], breaking: boolean): string {
    const added = changes.filter(c => c.type === 'added').length
    const removed = changes.filter(c => c.type === 'removed').length
    const modified = changes.filter(c => c.type === 'modified').length
    
    const parts: string[] = []
    if (added > 0) parts.push(`${added} 项新增`)
    if (removed > 0) parts.push(`${removed} 项移除`)
    if (modified > 0) parts.push(`${modified} 项修改`)
    
    let summary = parts.length > 0 ? parts.join('，') : '无变更'
    if (breaking) {
      summary = `[破坏性变更] ${summary}`
    }
    
    return summary
  }
  
  /**
   * 导出版本历史
   */
  export(templateId?: string): VersionHistory[] {
    if (templateId) {
      const history = this.histories.get(templateId)
      return history ? [history] : []
    }
    return Array.from(this.histories.values())
  }
  
  /**
   * 导入版本历史
   */
  import(histories: VersionHistory[]): void {
    for (const history of histories) {
      this.histories.set(history.templateId, history)
    }
  }
  
  /**
   * 清空所有版本历史
   */
  clear(): void {
    this.histories.clear()
  }
}

/**
 * 创建版本管理器实例
 */
export function createVersionManager(config?: VersionManagerConfig): VersionManager {
  return new VersionManager(config)
}