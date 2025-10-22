/**
 * 模板版本管理系统
 * 支持版本控制、对比、回滚和迁移
 */

import type { TemplateMetadata } from '../types'

export interface TemplateVersion {
  version: string
  metadata: TemplateMetadata
  content?: string
  timestamp: number
  author?: string
  changelog?: string
  deprecated?: boolean
  breaking?: boolean
}

export interface VersionDiff {
  added: string[]
  removed: string[]
  modified: Array<{
    field: string
    oldValue: any
    newValue: any
  }>
}

export interface MigrationGuide {
  fromVersion: string
  toVersion: string
  breaking: boolean
  steps: string[]
  codeChanges?: Array<{
    description: string
    before: string
    after: string
  }>
}

/**
 * 版本管理器
 */
export class VersionManager {
  // 版本历史存储
  private versionHistory = new Map<string, TemplateVersion[]>()
  // 当前版本映射
  private currentVersions = new Map<string, string>()
  // 迁移指南
  private migrationGuides = new Map<string, MigrationGuide>()

  /**
   * 注册模板版本
   */
  registerVersion(
    templateId: string,
    version: string,
    metadata: TemplateMetadata,
    options?: {
      content?: string
      author?: string
      changelog?: string
      deprecated?: boolean
      breaking?: boolean
    }
  ): void {
    if (!this.versionHistory.has(templateId)) {
      this.versionHistory.set(templateId, [])
    }

    const versions = this.versionHistory.get(templateId)!

    // 检查版本是否已存在
    const existing = versions.find(v => v.version === version)
    if (existing) {
      console.warn(`[VersionManager] Version ${version} already exists for ${templateId}`)
      return
    }

    const versionEntry: TemplateVersion = {
      version,
      metadata,
      timestamp: Date.now(),
      ...options,
    }

    versions.push(versionEntry)

    // 按版本号排序
    versions.sort((a, b) => this.compareVersions(a.version, b.version))

    // 设置为当前版本（如果是最新的）
    if (!this.currentVersions.has(templateId)) {
      this.currentVersions.set(templateId, version)
    }
  }

  /**
   * 获取模板的所有版本
   */
  getVersions(templateId: string): TemplateVersion[] {
    return this.versionHistory.get(templateId) || []
  }

  /**
   * 获取当前版本
   */
  getCurrentVersion(templateId: string): string | null {
    return this.currentVersions.get(templateId) || null
  }

  /**
   * 切换到指定版本
   */
  switchVersion(templateId: string, version: string): TemplateVersion | null {
    const versions = this.versionHistory.get(templateId)
    if (!versions) {
      console.error(`[VersionManager] Template ${templateId} not found`)
      return null
    }

    const targetVersion = versions.find(v => v.version === version)
    if (!targetVersion) {
      console.error(`[VersionManager] Version ${version} not found`)
      return null
    }

    this.currentVersions.set(templateId, version)
    return targetVersion
  }

  /**
   * 回滚到上一个版本
   */
  rollback(templateId: string): TemplateVersion | null {
    const versions = this.versionHistory.get(templateId)
    const currentVersion = this.currentVersions.get(templateId)

    if (!versions || !currentVersion) {
      return null
    }

    const currentIndex = versions.findIndex(v => v.version === currentVersion)
    if (currentIndex <= 0) {
      console.warn(`[VersionManager] No previous version to rollback to`)
      return null
    }

    const previousVersion = versions[currentIndex - 1]
    return this.switchVersion(templateId, previousVersion.version)
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
    const versions = this.versionHistory.get(templateId)
    if (!versions) return null

    const from = versions.find(v => v.version === fromVersion)
    const to = versions.find(v => v.version === toVersion)

    if (!from || !to) return null

    const diff: VersionDiff = {
      added: [],
      removed: [],
      modified: [],
    }

    // 比较元数据
    const fromMeta = from.metadata
    const toMeta = to.metadata

    // 检查字段变化
    const allKeys = new Set([
      ...Object.keys(fromMeta),
      ...Object.keys(toMeta),
    ])

    allKeys.forEach(key => {
      const fromValue = (fromMeta as any)[key]
      const toValue = (toMeta as any)[key]

      if (fromValue === undefined && toValue !== undefined) {
        diff.added.push(key)
      } else if (fromValue !== undefined && toValue === undefined) {
        diff.removed.push(key)
      } else if (JSON.stringify(fromValue) !== JSON.stringify(toValue)) {
        diff.modified.push({
          field: key,
          oldValue: fromValue,
          newValue: toValue,
        })
      }
    })

    return diff
  }

  /**
   * 检查版本兼容性
   */
  isCompatible(templateId: string, minVersion: string, maxVersion?: string): boolean {
    const currentVersion = this.currentVersions.get(templateId)
    if (!currentVersion) return false

    const isAboveMin = this.compareVersions(currentVersion, minVersion) >= 0
    if (!maxVersion) return isAboveMin

    const isBelowMax = this.compareVersions(currentVersion, maxVersion) <= 0
    return isAboveMin && isBelowMax
  }

  /**
   * 注册迁移指南
   */
  registerMigration(
    templateId: string,
    fromVersion: string,
    toVersion: string,
    guide: Omit<MigrationGuide, 'fromVersion' | 'toVersion'>
  ): void {
    const key = `${templateId}:${fromVersion}->${toVersion}`

    this.migrationGuides.set(key, {
      fromVersion,
      toVersion,
      ...guide,
    })
  }

  /**
   * 获取迁移指南
   */
  getMigrationGuide(templateId: string, fromVersion: string, toVersion: string): MigrationGuide | null {
    const key = `${templateId}:${fromVersion}->${toVersion}`
    return this.migrationGuides.get(key) || null
  }

  /**
   * 获取最新版本
   */
  getLatestVersion(templateId: string): TemplateVersion | null {
    const versions = this.versionHistory.get(templateId)
    if (!versions || versions.length === 0) return null

    return versions[versions.length - 1]
  }

  /**
   * 获取废弃版本列表
   */
  getDeprecatedVersions(templateId: string): TemplateVersion[] {
    const versions = this.versionHistory.get(templateId)
    if (!versions) return []

    return versions.filter(v => v.deprecated)
  }

  /**
   * 检查是否有破坏性更新
   */
  hasBreakingChanges(templateId: string, fromVersion: string, toVersion: string): boolean {
    const versions = this.versionHistory.get(templateId)
    if (!versions) return false

    const fromIndex = versions.findIndex(v => v.version === fromVersion)
    const toIndex = versions.findIndex(v => v.version === toVersion)

    if (fromIndex === -1 || toIndex === -1) return false

    // 检查中间版本是否有破坏性更新
    for (let i = fromIndex + 1; i <= toIndex; i++) {
      if (versions[i].breaking) {
        return true
      }
    }

    return false
  }

  /**
   * 导出版本历史
   */
  exportHistory(templateId?: string): Record<string, TemplateVersion[]> {
    if (templateId) {
      const versions = this.versionHistory.get(templateId)
      return versions ? { [templateId]: versions } : {}
    }

    const result: Record<string, TemplateVersion[]> = {}
    this.versionHistory.forEach((versions, id) => {
      result[id] = versions
    })
    return result
  }

  /**
   * 清空版本历史
   */
  clear(): void {
    this.versionHistory.clear()
    this.currentVersions.clear()
    this.migrationGuides.clear()
  }
}

/**
 * 全局版本管理器
 */
let globalVersionManager: VersionManager | null = null

/**
 * 获取全局版本管理器
 */
export function getVersionManager(): VersionManager {
  if (!globalVersionManager) {
    globalVersionManager = new VersionManager()
  }
  return globalVersionManager
}

/**
 * 创建版本管理器
 */
export function createVersionManager(): VersionManager {
  return new VersionManager()
}



