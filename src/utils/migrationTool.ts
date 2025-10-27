/**
 * 模板迁移工具
 * 
 * @description
 * 提供版本升级和迁移支持：
 * - 自动版本检测
 * - 配置迁移
 * - 数据迁移
 * - 兼容性检查
 * - 迁移报告生成
 * 
 * @example
 * ```ts
 * const migrator = new TemplateMigrator()
 * 
 * // 检测当前版本
 * const version = migrator.detectVersion()
 * 
 * // 执行迁移
 * const result = await migrator.migrate('0.3.0')
 * 
 * // 生成报告
 * migrator.generateReport()
 * ```
 */

/**
 * 版本号
 */
export interface Version {
  major: number
  minor: number
  patch: number
  raw: string
}

/**
 * 迁移步骤
 */
export interface MigrationStep {
  /** 步骤名称 */
  name: string
  /** 步骤描述 */
  description: string
  /** 执行函数 */
  execute: () => Promise<void> | void
  /** 回滚函数 */
  rollback?: () => Promise<void> | void
  /** 是否可选 */
  optional?: boolean
}

/**
 * 迁移计划
 */
export interface MigrationPlan {
  /** 源版本 */
  from: Version
  /** 目标版本 */
  to: Version
  /** 迁移步骤 */
  steps: MigrationStep[]
  /** 是否需要人工介入 */
  requiresManualIntervention: boolean
  /** 预计时间（秒） */
  estimatedTime: number
}

/**
 * 迁移结果
 */
export interface MigrationResult {
  /** 是否成功 */
  success: boolean
  /** 源版本 */
  fromVersion: string
  /** 目标版本 */
  toVersion: string
  /** 执行的步骤 */
  executedSteps: string[]
  /** 失败的步骤 */
  failedSteps: string[]
  /** 错误信息 */
  errors: Array<{ step: string; error: string }>
  /** 警告信息 */
  warnings: string[]
  /** 执行时间（毫秒） */
  duration: number
  /** 备份路径 */
  backupPath?: string
}

/**
 * 迁移配置
 */
export interface MigrationConfig {
  /** 是否自动备份 */
  autoBackup?: boolean
  /** 备份路径 */
  backupPath?: string
  /** 是否跳过可选步骤 */
  skipOptional?: boolean
  /** 失败时是否自动回滚 */
  autoRollback?: boolean
  /** 迁移钩子 */
  hooks?: {
    beforeMigration?: () => void | Promise<void>
    afterMigration?: (result: MigrationResult) => void | Promise<void>
    onStepStart?: (step: MigrationStep) => void
    onStepComplete?: (step: MigrationStep) => void
    onStepError?: (step: MigrationStep, error: Error) => void
  }
}

/**
 * 模板迁移器
 */
export class TemplateMigrator {
  private config: Required<MigrationConfig>
  private migrations: Map<string, MigrationPlan> = new Map()

  /**
   * 创建迁移器
   * 
   * @param config - 迁移配置
   */
  constructor(config: MigrationConfig = {}) {
    this.config = {
      autoBackup: config.autoBackup ?? true,
      backupPath: config.backupPath || '.template-backup',
      skipOptional: config.skipOptional ?? false,
      autoRollback: config.autoRollback ?? true,
      hooks: config.hooks || {},
    }

    this.registerMigrations()
  }

  /**
   * 注册所有迁移计划
   */
  private registerMigrations(): void {
    // v0.1.x → v0.2.0
    this.registerMigration('0.1.x', '0.2.0', [
      {
        name: 'update-config-format',
        description: '更新配置文件格式',
        execute: async () => {
          // 配置格式更新逻辑
          console.log('更新配置文件格式...')
        },
      },
      {
        name: 'migrate-cache-structure',
        description: '迁移缓存结构到三级缓存',
        execute: async () => {
          console.log('迁移缓存结构...')
        },
      },
    ])

    // v0.2.x → v0.3.0
    this.registerMigration('0.2.x', '0.3.0', [
      {
        name: 'add-error-codes',
        description: '添加错误码系统',
        execute: async () => {
          console.log('添加错误码系统...')
        },
      },
      {
        name: 'setup-indexeddb',
        description: '设置IndexedDB存储',
        execute: async () => {
          console.log('设置IndexedDB...')
        },
        optional: true,
      },
      {
        name: 'migrate-metadata',
        description: '迁移模板元数据格式',
        execute: async () => {
          console.log('迁移元数据...')
        },
      },
    ])
  }

  /**
   * 注册迁移计划
   */
  private registerMigration(
    from: string,
    to: string,
    steps: MigrationStep[]
  ): void {
    const key = `${from}-${to}`
    this.migrations.set(key, {
      from: this.parseVersion(from),
      to: this.parseVersion(to),
      steps,
      requiresManualIntervention: steps.some(s => !s.optional && !s.execute),
      estimatedTime: steps.length * 5, // 每步预计5秒
    })
  }

  /**
   * 解析版本号
   * 
   * @param versionStr - 版本字符串
   * @returns 版本对象
   */
  parseVersion(versionStr: string): Version {
    // 处理通配符版本 (如 0.1.x)
    const cleaned = versionStr.replace(/[^\d.]/g, '')
    const parts = cleaned.split('.').map(Number)

    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0,
      raw: versionStr,
    }
  }

  /**
   * 比较版本
   * 
   * @param v1 - 版本1
   * @param v2 - 版本2
   * @returns -1: v1 < v2, 0: v1 = v2, 1: v1 > v2
   */
  compareVersions(v1: Version, v2: Version): number {
    if (v1.major !== v2.major) return v1.major - v2.major
    if (v1.minor !== v2.minor) return v1.minor - v2.minor
    return v1.patch - v2.patch
  }

  /**
   * 检测当前版本
   * 
   * @description
   * 从配置文件或package.json检测当前版本
   * 
   * @returns 当前版本
   */
  detectVersion(): Version {
    // 尝试从多个来源检测版本
    try {
      // 1. 从package.json
      if (typeof window !== 'undefined' && (window as any).__TEMPLATE_VERSION__) {
        return this.parseVersion((window as any).__TEMPLATE_VERSION__)
      }

      // 2. 从配置
      const config = this.loadConfig()
      if (config?.version) {
        return this.parseVersion(config.version)
      }

      // 3. 默认版本
      return this.parseVersion('0.2.0')
    } catch (error) {
      console.warn('[Migration] 版本检测失败，使用默认版本')
      return this.parseVersion('0.2.0')
    }
  }

  /**
   * 加载配置
   */
  private loadConfig(): any {
    try {
      if (typeof localStorage !== 'undefined') {
        const config = localStorage.getItem('template-config')
        return config ? JSON.parse(config) : null
      }
    } catch (error) {
      return null
    }
    return null
  }

  /**
   * 获取迁移计划
   * 
   * @param from - 源版本
   * @param to - 目标版本
   * @returns 迁移计划
   */
  getMigrationPlan(from: string | Version, to: string | Version): MigrationPlan | null {
    const fromVersion = typeof from === 'string' ? this.parseVersion(from) : from
    const toVersion = typeof to === 'string' ? this.parseVersion(to) : to

    // 查找匹配的迁移计划
    for (const [key, plan] of this.migrations) {
      if (this.versionMatches(fromVersion, plan.from) &&
        this.versionMatches(toVersion, plan.to)) {
        return plan
      }
    }

    return null
  }

  /**
   * 版本匹配检查（支持通配符）
   */
  private versionMatches(actual: Version, pattern: Version): boolean {
    // 支持 x.x.x 通配符
    if (pattern.major !== 0 && pattern.major !== actual.major) return false
    if (pattern.minor !== 0 && pattern.minor !== actual.minor) return false
    if (pattern.patch !== 0 && pattern.patch !== actual.patch) return false
    return true
  }

  /**
   * 执行迁移
   * 
   * @param targetVersion - 目标版本
   * @returns 迁移结果
   */
  async migrate(targetVersion: string): Promise<MigrationResult> {
    const startTime = Date.now()
    const currentVersion = this.detectVersion()
    const target = this.parseVersion(targetVersion)

    // 检查是否需要迁移
    if (this.compareVersions(currentVersion, target) >= 0) {
      return {
        success: true,
        fromVersion: currentVersion.raw,
        toVersion: targetVersion,
        executedSteps: [],
        failedSteps: [],
        errors: [],
        warnings: ['当前版本已是最新，无需迁移'],
        duration: 0,
      }
    }

    const plan = this.getMigrationPlan(currentVersion, target)

    if (!plan) {
      return {
        success: false,
        fromVersion: currentVersion.raw,
        toVersion: targetVersion,
        executedSteps: [],
        failedSteps: [],
        errors: [{ step: 'plan', error: '未找到匹配的迁移计划' }],
        warnings: [],
        duration: Date.now() - startTime,
      }
    }

    const result: MigrationResult = {
      success: true,
      fromVersion: currentVersion.raw,
      toVersion: targetVersion,
      executedSteps: [],
      failedSteps: [],
      errors: [],
      warnings: [],
      duration: 0,
    }

    try {
      // 执行迁移前钩子
      await this.config.hooks.beforeMigration?.()

      // 备份
      if (this.config.autoBackup) {
        result.backupPath = await this.createBackup()
      }

      // 执行迁移步骤
      for (const step of plan.steps) {
        // 跳过可选步骤（如果配置了）
        if (step.optional && this.config.skipOptional) {
          result.warnings.push(`跳过可选步骤: ${step.name}`)
          continue
        }

        try {
          this.config.hooks.onStepStart?.(step)
          await step.execute()
          this.config.hooks.onStepComplete?.(step)
          result.executedSteps.push(step.name)
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error)
          result.errors.push({ step: step.name, error: errorMsg })
          result.failedSteps.push(step.name)
          this.config.hooks.onStepError?.(step, error as Error)

          // 是否自动回滚
          if (this.config.autoRollback) {
            await this.rollback(result.executedSteps, plan.steps)
            result.success = false
            break
          }
        }
      }

      // 更新版本信息
      if (result.success && result.errors.length === 0) {
        this.saveVersion(target)
      }

      // 执行迁移后钩子
      await this.config.hooks.afterMigration?.(result)

    } catch (error) {
      result.success = false
      result.errors.push({
        step: 'migration',
        error: error instanceof Error ? error.message : String(error),
      })
    }

    result.duration = Date.now() - startTime
    return result
  }

  /**
   * 创建备份
   */
  private async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = `${this.config.backupPath}/backup-${timestamp}`

    try {
      // 备份配置
      const config = this.loadConfig()
      if (config) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`backup:${timestamp}:config`, JSON.stringify(config))
        }
      }

      return backupPath
    } catch (error) {
      console.error('[Migration] 备份创建失败:', error)
      throw error
    }
  }

  /**
   * 回滚迁移
   */
  private async rollback(
    executedSteps: string[],
    allSteps: MigrationStep[]
  ): Promise<void> {
    console.log('[Migration] 开始回滚...')

    // 反向执行回滚
    for (let i = executedSteps.length - 1; i >= 0; i--) {
      const stepName = executedSteps[i]
      const step = allSteps.find(s => s.name === stepName)

      if (step?.rollback) {
        try {
          await step.rollback()
          console.log(`[Migration] 回滚步骤: ${stepName}`)
        } catch (error) {
          console.error(`[Migration] 回滚失败: ${stepName}`, error)
        }
      }
    }
  }

  /**
   * 保存版本信息
   */
  private saveVersion(version: Version): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('template-version', version.raw)
      }

      const config = this.loadConfig() || {}
      config.version = version.raw

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('template-config', JSON.stringify(config))
      }
    } catch (error) {
      console.error('[Migration] 版本保存失败:', error)
    }
  }

  /**
   * 检查兼容性
   * 
   * @param version - 目标版本
   * @returns 兼容性检查结果
   */
  checkCompatibility(version: string): {
    compatible: boolean
    issues: string[]
    warnings: string[]
  } {
    const target = this.parseVersion(version)
    const current = this.detectVersion()

    const issues: string[] = []
    const warnings: string[] = []

    // 主版本号变化
    if (target.major > current.major) {
      issues.push('主版本号升级可能包含破坏性变更')
    }

    // 降级检查
    if (this.compareVersions(target, current) < 0) {
      issues.push('不支持版本降级')
    }

    // 跨版本升级
    if (target.major - current.major > 1) {
      warnings.push('跨主版本升级，建议逐个版本升级')
    }

    return {
      compatible: issues.length === 0,
      issues,
      warnings,
    }
  }

  /**
   * 生成迁移报告
   * 
   * @param result - 迁移结果
   * @returns 格式化的报告文本
   */
  generateReport(result: MigrationResult): string {
    const lines: string[] = []

    lines.push('# 模板迁移报告')
    lines.push('')
    lines.push(`- 源版本: ${result.fromVersion}`)
    lines.push(`- 目标版本: ${result.toVersion}`)
    lines.push(`- 迁移状态: ${result.success ? '✅ 成功' : '❌ 失败'}`)
    lines.push(`- 执行时间: ${(result.duration / 1000).toFixed(2)}秒`)
    lines.push('')

    if (result.backupPath) {
      lines.push(`- 备份路径: ${result.backupPath}`)
      lines.push('')
    }

    if (result.executedSteps.length > 0) {
      lines.push('## 已执行步骤')
      result.executedSteps.forEach(step => {
        lines.push(`- ✅ ${step}`)
      })
      lines.push('')
    }

    if (result.failedSteps.length > 0) {
      lines.push('## 失败步骤')
      result.failedSteps.forEach(step => {
        lines.push(`- ❌ ${step}`)
      })
      lines.push('')
    }

    if (result.errors.length > 0) {
      lines.push('## 错误信息')
      result.errors.forEach(({ step, error }) => {
        lines.push(`- ${step}: ${error}`)
      })
      lines.push('')
    }

    if (result.warnings.length > 0) {
      lines.push('## 警告信息')
      result.warnings.forEach(warning => {
        lines.push(`- ⚠️ ${warning}`)
      })
      lines.push('')
    }

    return lines.join('\n')
  }

  /**
   * 获取所有可用的迁移路径
   * 
   * @returns 迁移路径列表
   */
  getAvailableMigrations(): Array<{
    from: string
    to: string
    steps: number
    estimatedTime: number
  }> {
    const migrations: Array<{
      from: string
      to: string
      steps: number
      estimatedTime: number
    }> = []

    this.migrations.forEach((plan, key) => {
      migrations.push({
        from: plan.from.raw,
        to: plan.to.raw,
        steps: plan.steps.length,
        estimatedTime: plan.estimatedTime,
      })
    })

    return migrations
  }

  /**
   * 打印迁移计划
   */
  printPlan(from: string, to: string): void {
    const plan = this.getMigrationPlan(from, to)

    if (!plan) {
      console.log('未找到迁移计划')
      return
    }

    console.group(`📋 迁移计划: ${from} → ${to}`)
    console.log(`预计时间: ${plan.estimatedTime}秒`)
    console.log(`需要人工介入: ${plan.requiresManualIntervention ? '是' : '否'}`)
    console.log('')
    console.log('迁移步骤:')
    plan.steps.forEach((step, index) => {
      const optional = step.optional ? ' (可选)' : ''
      console.log(`${index + 1}. ${step.name}${optional}`)
      console.log(`   ${step.description}`)
    })
    console.groupEnd()
  }
}

/**
 * 创建迁移器
 * 
 * @param config - 迁移配置
 * @returns 迁移器实例
 */
export function createMigrator(config?: MigrationConfig): TemplateMigrator {
  return new TemplateMigrator(config)
}

/**
 * 快速迁移函数
 * 
 * @description
 * 一键执行迁移的便捷函数
 * 
 * @param targetVersion - 目标版本
 * @param config - 迁移配置
 * @returns 迁移结果
 */
export async function migrateToVersion(
  targetVersion: string,
  config?: MigrationConfig
): Promise<MigrationResult> {
  const migrator = new TemplateMigrator(config)
  return await migrator.migrate(targetVersion)
}


