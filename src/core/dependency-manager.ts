/**
 * 模板依赖管理系统
 * 处理模板间的依赖关系、循环检测和预加载
 */

export interface TemplateDependency {
  templateId: string
  version?: string
  optional?: boolean
  reason?: string
}

export interface DependencyNode {
  id: string
  dependencies: TemplateDependency[]
  dependents: string[]
  level: number
}

export interface CircularDependency {
  chain: string[]
  resolved: boolean
}

/**
 * 依赖管理器
 */
export class DependencyManager {
  // 依赖图
  private dependencyGraph = new Map<string, DependencyNode>()
  // 循环依赖记录
  private circularDependencies: CircularDependency[] = []
  // 已解析的模板
  private resolved = new Set<string>()

  /**
   * 注册模板依赖
   */
  register(templateId: string, dependencies: TemplateDependency[]): void {
    if (!this.dependencyGraph.has(templateId)) {
      this.dependencyGraph.set(templateId, {
        id: templateId,
        dependencies: [],
        dependents: [],
        level: 0,
      })
    }

    const node = this.dependencyGraph.get(templateId)!
    node.dependencies = dependencies

    // 更新依赖项的 dependents
    dependencies.forEach(dep => {
      if (!this.dependencyGraph.has(dep.templateId)) {
        this.dependencyGraph.set(dep.templateId, {
          id: dep.templateId,
          dependencies: [],
          dependents: [],
          level: 0,
        })
      }

      const depNode = this.dependencyGraph.get(dep.templateId)!
      if (!depNode.dependents.includes(templateId)) {
        depNode.dependents.push(templateId)
      }
    })

    // 重新计算层级
    this.calculateLevels()
  }

  /**
   * 获取模板依赖
   */
  getDependencies(templateId: string, recursive = false): TemplateDependency[] {
    const node = this.dependencyGraph.get(templateId)
    if (!node) return []

    if (!recursive) {
      return node.dependencies
    }

    // 递归获取所有依赖
    const allDeps: TemplateDependency[] = []
    const visited = new Set<string>()

    const collect = (id: string) => {
      if (visited.has(id)) return
      visited.add(id)

      const n = this.dependencyGraph.get(id)
      if (!n) return

      n.dependencies.forEach(dep => {
        allDeps.push(dep)
        collect(dep.templateId)
      })
    }

    collect(templateId)
    return allDeps
  }

  /**
   * 获取依赖此模板的模板（反向依赖）
   */
  getDependents(templateId: string, recursive = false): string[] {
    const node = this.dependencyGraph.get(templateId)
    if (!node) return []

    if (!recursive) {
      return node.dependents
    }

    // 递归获取所有依赖者
    const allDependents: string[] = []
    const visited = new Set<string>()

    const collect = (id: string) => {
      if (visited.has(id)) return
      visited.add(id)

      const n = this.dependencyGraph.get(id)
      if (!n) return

      n.dependents.forEach(depId => {
        allDependents.push(depId)
        collect(depId)
      })
    }

    collect(templateId)
    return allDependents
  }

  /**
   * 检测循环依赖
   */
  detectCircular(templateId: string): CircularDependency[] {
    const circular: CircularDependency[] = []
    const visiting = new Set<string>()
    const visited = new Set<string>()

    const visit = (id: string, path: string[]) => {
      if (visiting.has(id)) {
        // 发现循环
        const cycleStart = path.indexOf(id)
        const chain = [...path.slice(cycleStart), id]
        circular.push({ chain, resolved: false })
        return
      }

      if (visited.has(id)) return

      visiting.add(id)
      path.push(id)

      const node = this.dependencyGraph.get(id)
      if (node) {
        node.dependencies.forEach(dep => {
          if (!dep.optional) {
            visit(dep.templateId, [...path])
          }
        })
      }

      visiting.delete(id)
      visited.add(id)
      path.pop()
    }

    visit(templateId, [])
    return circular
  }

  /**
   * 检测所有循环依赖
   */
  detectAllCircular(): CircularDependency[] {
    this.circularDependencies = []
    const checked = new Set<string>()

    this.dependencyGraph.forEach((_, id) => {
      if (!checked.has(id)) {
        const circular = this.detectCircular(id)
        circular.forEach(c => {
          // 避免重复记录
          const chainKey = c.chain.join('->')
          if (!this.circularDependencies.some(existing =>
            existing.chain.join('->') === chainKey
          )) {
            this.circularDependencies.push(c)
          }
        })
        c.chain.forEach(n => checked.add(n))
      }
    })

    return this.circularDependencies
  }

  /**
   * 获取加载顺序（拓扑排序）
   */
  getLoadOrder(templateIds: string[]): string[] {
    const order: string[] = []
    const visited = new Set<string>()
    const visiting = new Set<string>()

    const visit = (id: string) => {
      if (visited.has(id)) return
      if (visiting.has(id)) {
        // 循环依赖，跳过
        return
      }

      visiting.add(id)

      const node = this.dependencyGraph.get(id)
      if (node) {
        // 先加载依赖
        node.dependencies.forEach(dep => {
          if (!dep.optional) {
            visit(dep.templateId)
          }
        })
      }

      visiting.delete(id)
      visited.add(id)
      order.push(id)
    }

    templateIds.forEach(id => visit(id))
    return order
  }

  /**
   * 计算依赖层级
   */
  private calculateLevels(): void {
    // 重置所有层级
    this.dependencyGraph.forEach(node => {
      node.level = 0
    })

    // 使用 BFS 计算层级
    const queue: string[] = []

    // 找到所有根节点（无依赖）
    this.dependencyGraph.forEach((node, id) => {
      if (node.dependencies.length === 0) {
        queue.push(id)
      }
    })

    while (queue.length > 0) {
      const id = queue.shift()!
      const node = this.dependencyGraph.get(id)!

      node.dependents.forEach(depId => {
        const depNode = this.dependencyGraph.get(depId)!
        depNode.level = Math.max(depNode.level, node.level + 1)

        if (!queue.includes(depId)) {
          queue.push(depId)
        }
      })
    }
  }

  /**
   * 获取依赖树
   */
  getDependencyTree(templateId: string, maxDepth = 10): any {
    const node = this.dependencyGraph.get(templateId)
    if (!node) return null

    const visited = new Set<string>()

    const buildTree = (id: string, depth: number): any => {
      if (depth > maxDepth || visited.has(id)) {
        return { id, truncated: true }
      }

      visited.add(id)
      const n = this.dependencyGraph.get(id)

      if (!n) {
        return { id, notFound: true }
      }

      return {
        id,
        level: n.level,
        dependencies: n.dependencies.map(dep => ({
          ...dep,
          tree: buildTree(dep.templateId, depth + 1),
        })),
      }
    }

    return buildTree(templateId, 0)
  }

  /**
   * 验证依赖完整性
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // 检查循环依赖
    const circular = this.detectAllCircular()
    if (circular.length > 0) {
      circular.forEach(c => {
        errors.push(`Circular dependency detected: ${c.chain.join(' -> ')}`)
      })
    }

    // 检查缺失的依赖
    this.dependencyGraph.forEach((node, id) => {
      node.dependencies.forEach(dep => {
        if (!dep.optional && !this.dependencyGraph.has(dep.templateId)) {
          errors.push(`Missing dependency: ${id} requires ${dep.templateId}`)
        }
      })
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const totalTemplates = this.dependencyGraph.size
    const withDependencies = Array.from(this.dependencyGraph.values())
      .filter(n => n.dependencies.length > 0).length
    const withDependents = Array.from(this.dependencyGraph.values())
      .filter(n => n.dependents.length > 0).length

    let totalDependencies = 0
    let maxDependencies = 0
    let maxLevel = 0

    this.dependencyGraph.forEach(node => {
      totalDependencies += node.dependencies.length
      maxDependencies = Math.max(maxDependencies, node.dependencies.length)
      maxLevel = Math.max(maxLevel, node.level)
    })

    return {
      totalTemplates,
      withDependencies,
      withDependents,
      totalDependencies,
      avgDependencies: totalTemplates > 0 ? totalDependencies / totalTemplates : 0,
      maxDependencies,
      maxLevel,
      circularDependencies: this.circularDependencies.length,
    }
  }

  /**
   * 清空依赖图
   */
  clear(): void {
    this.dependencyGraph.clear()
    this.circularDependencies = []
    this.resolved.clear()
  }
}

/**
 * 全局依赖管理器
 */
let globalDependencyManager: DependencyManager | null = null

/**
 * 获取全局依赖管理器
 */
export function getDependencyManager(): DependencyManager {
  if (!globalDependencyManager) {
    globalDependencyManager = new DependencyManager()
  }
  return globalDependencyManager
}

/**
 * 创建依赖管理器
 */
export function createDependencyManager(): DependencyManager {
  return new DependencyManager()
}



