/**
 * 模板依赖分析器
 * 
 * @description
 * 分析和管理模板之间的依赖关系：
 * - 依赖关系解析：自动发现模板间依赖
 * - 依赖图构建：生成完整的依赖关系图
 * - 循环依赖检测：识别和报告循环依赖
 * - 依赖排序：拓扑排序生成加载顺序
 * - 依赖可视化：生成可视化图表数据
 * 
 * @example
 * ```ts
 * const analyzer = new DependencyAnalyzer(templates)
 * 
 * // 分析依赖
 * const graph = analyzer.analyze()
 * 
 * // 检测循环依赖
 * const cycles = analyzer.detectCycles()
 * if (cycles.length > 0) {
 *   console.warn('发现循环依赖:', cycles)
 * }
 * 
 * // 获取加载顺序
 * const order = analyzer.getLoadOrder()
 * ```
 */

import type { TemplateMetadata } from '../types'

/**
 * 依赖节点
 */
export interface DependencyNode {
  /** 模板ID */
  id: string
  /** 模板元数据 */
  metadata: TemplateMetadata
  /** 依赖的模板ID列表 */
  dependencies: string[]
  /** 被依赖的模板ID列表 */
  dependents: string[]
  /** 依赖深度（从根节点的距离） */
  depth: number
}

/**
 * 依赖关系图
 */
export interface DependencyGraph {
  /** 所有节点 */
  nodes: Map<string, DependencyNode>
  /** 根节点（无依赖的节点） */
  roots: string[]
  /** 叶子节点（无被依赖的节点） */
  leaves: string[]
  /** 依赖边数量 */
  edgeCount: number
}

/**
 * 循环依赖信息
 */
export interface CircularDependency {
  /** 循环路径 */
  cycle: string[]
  /** 循环大小 */
  size: number
  /** 影响的模板 */
  affected: string[]
}

/**
 * 依赖分析结果
 */
export interface DependencyAnalysisResult {
  /** 依赖图 */
  graph: DependencyGraph
  /** 循环依赖列表 */
  cycles: CircularDependency[]
  /** 拓扑排序结果 */
  topologicalOrder: string[]
  /** 分析统计 */
  statistics: DependencyStatistics
}

/**
 * 依赖统计信息
 */
export interface DependencyStatistics {
  /** 总模板数 */
  totalTemplates: number
  /** 有依赖的模板数 */
  templatesWithDependencies: number
  /** 被依赖的模板数 */
  dependedTemplates: number
  /** 独立模板数（无依赖且不被依赖） */
  isolatedTemplates: number
  /** 平均依赖数 */
  averageDependencies: number
  /** 最大依赖深度 */
  maxDepth: number
  /** 循环依赖数 */
  circularDependencies: number
}

/**
 * 可视化图表数据
 */
export interface VisualizationData {
  /** 节点数据 */
  nodes: VisualizationNode[]
  /** 边数据 */
  edges: VisualizationEdge[]
  /** 布局配置 */
  layout?: LayoutConfig
}

/**
 * 可视化节点
 */
export interface VisualizationNode {
  /** 节点ID */
  id: string
  /** 节点标签 */
  label: string
  /** 节点类型 */
  type: 'root' | 'intermediate' | 'leaf' | 'isolated'
  /** 节点大小（基于依赖数） */
  size: number
  /** 节点颜色 */
  color: string
  /** 元数据 */
  metadata?: Record<string, any>
}

/**
 * 可视化边
 */
export interface VisualizationEdge {
  /** 源节点ID */
  source: string
  /** 目标节点ID */
  target: string
  /** 边类型 */
  type: 'normal' | 'circular'
  /** 边权重 */
  weight: number
}

/**
 * 布局配置
 */
export interface LayoutConfig {
  /** 布局算法 */
  algorithm: 'force' | 'hierarchical' | 'circular' | 'tree'
  /** 节点间距 */
  nodeSpacing: number
  /** 层级间距 */
  levelSpacing?: number
}

/**
 * 依赖分析器配置
 */
export interface DependencyAnalyzerOptions {
  /** 是否自动解析依赖 */
  autoResolve?: boolean
  /** 是否检测循环依赖 */
  detectCycles?: boolean
  /** 依赖解析器 */
  dependencyResolver?: (template: TemplateMetadata) => string[]
}

/**
 * 模板依赖分析器
 */
export class DependencyAnalyzer {
  private templates: Map<string, TemplateMetadata>
  private graph: DependencyGraph | null = null
  private options: Required<DependencyAnalyzerOptions>

  /**
   * 创建依赖分析器
   * 
   * @param templates - 模板列表或映射
   * @param options - 配置选项
   */
  constructor(
    templates: TemplateMetadata[] | Map<string, TemplateMetadata>,
    options: DependencyAnalyzerOptions = {}
  ) {
    this.templates = templates instanceof Map
      ? templates
      : new Map(templates.map(t => [this.getTemplateId(t), t]))

    this.options = {
      autoResolve: options.autoResolve ?? true,
      detectCycles: options.detectCycles ?? true,
      dependencyResolver: options.dependencyResolver || this.defaultDependencyResolver.bind(this),
    }

    if (this.options.autoResolve) {
      this.analyze()
    }
  }

  /**
   * 获取模板ID
   * 
   * @param template - 模板元数据
   * @returns 模板ID
   */
  private getTemplateId(template: TemplateMetadata): string {
    return `${template.category}/${template.device}/${template.name}`
  }

  /**
   * 默认依赖解析器
   * 
   * @description
   * 从模板元数据中提取依赖信息。
   * 可以通过配置自定义解析逻辑。
   * 
   * @param template - 模板元数据
   * @returns 依赖的模板ID列表
   */
  private defaultDependencyResolver(template: TemplateMetadata): string[] {
    const dependencies: string[] = []

    // 从元数据的特定字段提取依赖
    // 这里假设元数据可能有 extends、mixins 等字段
    const metadata = template as any

    if (metadata.extends) {
      dependencies.push(metadata.extends)
    }

    if (metadata.mixins && Array.isArray(metadata.mixins)) {
      dependencies.push(...metadata.mixins)
    }

    if (metadata.dependencies && Array.isArray(metadata.dependencies)) {
      dependencies.push(...metadata.dependencies)
    }

    return dependencies
  }

  /**
   * 分析依赖关系
   * 
   * @description
   * 构建完整的依赖关系图：
   * 1. 创建所有节点
   * 2. 解析依赖关系
   * 3. 构建双向引用
   * 4. 计算依赖深度
   * 
   * @returns 依赖关系图
   */
  analyze(): DependencyGraph {
    const nodes = new Map<string, DependencyNode>()

    // 1. 创建所有节点
    this.templates.forEach((metadata, id) => {
      nodes.set(id, {
        id,
        metadata,
        dependencies: [],
        dependents: [],
        depth: 0,
      })
    })

    // 2. 解析依赖关系
    nodes.forEach((node, id) => {
      const dependencies = this.options.dependencyResolver(node.metadata)
      node.dependencies = dependencies.filter(depId => nodes.has(depId))

      // 构建反向引用
      node.dependencies.forEach(depId => {
        const depNode = nodes.get(depId)
        if (depNode && !depNode.dependents.includes(id)) {
          depNode.dependents.push(id)
        }
      })
    })

    // 3. 计算依赖深度
    this.calculateDepths(nodes)

    // 4. 识别根节点和叶子节点
    const roots: string[] = []
    const leaves: string[] = []
    let edgeCount = 0

    nodes.forEach((node, id) => {
      if (node.dependencies.length === 0) {
        roots.push(id)
      }
      if (node.dependents.length === 0) {
        leaves.push(id)
      }
      edgeCount += node.dependencies.length
    })

    this.graph = {
      nodes,
      roots,
      leaves,
      edgeCount,
    }

    return this.graph
  }

  /**
   * 计算依赖深度
   * 
   * @description
   * 使用BFS算法计算每个节点从根节点的距离
   * 
   * @param nodes - 节点映射
   */
  private calculateDepths(nodes: Map<string, DependencyNode>): void {
    // 找出所有根节点
    const roots = Array.from(nodes.values()).filter(n => n.dependencies.length === 0)

    // BFS计算深度
    const visited = new Set<string>()
    const queue: Array<{ id: string; depth: number }> = roots.map(n => ({ id: n.id, depth: 0 }))

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!

      if (visited.has(id)) continue
      visited.add(id)

      const node = nodes.get(id)
      if (node) {
        node.depth = Math.max(node.depth, depth)

        // 将所有依赖者加入队列
        node.dependents.forEach(depId => {
          queue.push({ id: depId, depth: depth + 1 })
        })
      }
    }
  }

  /**
   * 检测循环依赖
   * 
   * @description
   * 使用DFS算法检测依赖图中的环
   * 
   * @returns 循环依赖列表
   */
  detectCycles(): CircularDependency[] {
    if (!this.graph) {
      this.analyze()
    }

    const cycles: CircularDependency[] = []
    const visited = new Set<string>()
    const recursionStack = new Set<string>()
    const path: string[] = []

    const dfs = (nodeId: string): void => {
      visited.add(nodeId)
      recursionStack.add(nodeId)
      path.push(nodeId)

      const node = this.graph!.nodes.get(nodeId)
      if (node) {
        for (const depId of node.dependencies) {
          if (!visited.has(depId)) {
            dfs(depId)
          } else if (recursionStack.has(depId)) {
            // 找到环
            const cycleStart = path.indexOf(depId)
            const cycle = path.slice(cycleStart)

            cycles.push({
              cycle: [...cycle, depId], // 闭环
              size: cycle.length,
              affected: [...new Set(cycle)],
            })
          }
        }
      }

      path.pop()
      recursionStack.delete(nodeId)
    }

    // 对所有未访问的节点进行DFS
    this.graph!.nodes.forEach((_, nodeId) => {
      if (!visited.has(nodeId)) {
        dfs(nodeId)
      }
    })

    return cycles
  }

  /**
   * 拓扑排序
   * 
   * @description
   * 生成模板的加载顺序，确保依赖的模板先加载
   * 使用Kahn算法实现
   * 
   * @returns 排序后的模板ID列表，如果存在循环依赖则返回null
   */
  getLoadOrder(): string[] | null {
    if (!this.graph) {
      this.analyze()
    }

    const inDegree = new Map<string, number>()
    const result: string[] = []
    const queue: string[] = []

    // 计算入度
    this.graph!.nodes.forEach((node, id) => {
      inDegree.set(id, node.dependencies.length)
      if (node.dependencies.length === 0) {
        queue.push(id)
      }
    })

    // Kahn算法
    while (queue.length > 0) {
      const nodeId = queue.shift()!
      result.push(nodeId)

      const node = this.graph!.nodes.get(nodeId)
      if (node) {
        node.dependents.forEach(depId => {
          const degree = inDegree.get(depId)! - 1
          inDegree.set(depId, degree)

          if (degree === 0) {
            queue.push(depId)
          }
        })
      }
    }

    // 如果结果数量不等于节点数量，说明存在循环依赖
    if (result.length !== this.graph!.nodes.size) {
      return null
    }

    return result
  }

  /**
   * 生成依赖统计
   * 
   * @returns 统计信息
   */
  getStatistics(): DependencyStatistics {
    if (!this.graph) {
      this.analyze()
    }

    const cycles = this.options.detectCycles ? this.detectCycles() : []

    let totalDeps = 0
    let maxDepth = 0
    let withDeps = 0
    let depended = 0
    let isolated = 0

    this.graph!.nodes.forEach(node => {
      totalDeps += node.dependencies.length
      maxDepth = Math.max(maxDepth, node.depth)

      if (node.dependencies.length > 0) withDeps++
      if (node.dependents.length > 0) depended++
      if (node.dependencies.length === 0 && node.dependents.length === 0) isolated++
    })

    return {
      totalTemplates: this.graph!.nodes.size,
      templatesWithDependencies: withDeps,
      dependedTemplates: depended,
      isolatedTemplates: isolated,
      averageDependencies: totalDeps / this.graph!.nodes.size,
      maxDepth,
      circularDependencies: cycles.length,
    }
  }

  /**
   * 生成完整分析结果
   * 
   * @returns 分析结果
   */
  generateReport(): DependencyAnalysisResult {
    if (!this.graph) {
      this.analyze()
    }

    const cycles = this.detectCycles()
    const topologicalOrder = this.getLoadOrder() || []
    const statistics = this.getStatistics()

    return {
      graph: this.graph!,
      cycles,
      topologicalOrder,
      statistics,
    }
  }

  /**
   * 生成可视化数据
   * 
   * @description
   * 将依赖图转换为可视化库（如D3.js、ECharts）可用的格式
   * 
   * @param layoutAlgorithm - 布局算法
   * @returns 可视化数据
   */
  generateVisualizationData(layoutAlgorithm: LayoutConfig['algorithm'] = 'force'): VisualizationData {
    if (!this.graph) {
      this.analyze()
    }

    const cycles = this.detectCycles()
    const cycleNodeIds = new Set(cycles.flatMap(c => c.affected))

    const nodes: VisualizationNode[] = []
    const edges: VisualizationEdge[] = []

    // 生成节点数据
    this.graph!.nodes.forEach((node, id) => {
      let type: VisualizationNode['type'] = 'intermediate'
      if (node.dependencies.length === 0 && node.dependents.length === 0) {
        type = 'isolated'
      } else if (node.dependencies.length === 0) {
        type = 'root'
      } else if (node.dependents.length === 0) {
        type = 'leaf'
      }

      const color = cycleNodeIds.has(id)
        ? '#f44336' // 红色 - 循环依赖
        : type === 'root'
          ? '#4CAF50' // 绿色 - 根节点
          : type === 'leaf'
            ? '#2196F3' // 蓝色 - 叶子节点
            : type === 'isolated'
              ? '#9E9E9E' // 灰色 - 孤立节点
              : '#FF9800' // 橙色 - 中间节点

      nodes.push({
        id,
        label: node.metadata.displayName || node.metadata.name,
        type,
        size: (node.dependencies.length + node.dependents.length) * 5 + 10,
        color,
        metadata: {
          category: node.metadata.category,
          device: node.metadata.device,
          depth: node.depth,
          dependencyCount: node.dependencies.length,
          dependentCount: node.dependents.length,
        },
      })
    })

    // 生成边数据
    this.graph!.nodes.forEach((node, id) => {
      node.dependencies.forEach(depId => {
        // 检查是否为循环依赖的边
        const isCircular = cycles.some(cycle =>
          cycle.cycle.includes(id) && cycle.cycle.includes(depId)
        )

        edges.push({
          source: id,
          target: depId,
          type: isCircular ? 'circular' : 'normal',
          weight: 1,
        })
      })
    })

    return {
      nodes,
      edges,
      layout: {
        algorithm: layoutAlgorithm,
        nodeSpacing: 50,
        levelSpacing: 100,
      },
    }
  }

  /**
   * 获取模板的依赖链
   * 
   * @description
   * 获取指定模板的完整依赖链（从根到该模板）
   * 
   * @param templateId - 模板ID
   * @returns 依赖链（从根节点到目标节点）
   */
  getDependencyChain(templateId: string): string[][] {
    if (!this.graph) {
      this.analyze()
    }

    const node = this.graph!.nodes.get(templateId)
    if (!node) {
      return []
    }

    const chains: string[][] = []
    const visited = new Set<string>()

    const dfs = (currentId: string, path: string[]): void => {
      if (visited.has(currentId)) return
      visited.add(currentId)

      const currentNode = this.graph!.nodes.get(currentId)
      if (!currentNode) return

      const newPath = [...path, currentId]

      if (currentNode.dependencies.length === 0) {
        // 到达根节点
        chains.push(newPath)
      } else {
        // 继续向上追溯
        currentNode.dependencies.forEach(depId => {
          dfs(depId, newPath)
        })
      }
    }

    dfs(templateId, [])
    return chains
  }

  /**
   * 打印分析报告
   * 
   * @description
   * 在控制台打印格式化的依赖分析报告
   */
  printReport(): void {
    const report = this.generateReport()

    console.group('📊 模板依赖分析报告')

    console.group('📈 统计信息')
    console.log(`总模板数: ${report.statistics.totalTemplates}`)
    console.log(`有依赖的模板: ${report.statistics.templatesWithDependencies}`)
    console.log(`被依赖的模板: ${report.statistics.dependedTemplates}`)
    console.log(`独立模板: ${report.statistics.isolatedTemplates}`)
    console.log(`平均依赖数: ${report.statistics.averageDependencies.toFixed(2)}`)
    console.log(`最大依赖深度: ${report.statistics.maxDepth}`)
    console.groupEnd()

    if (report.cycles.length > 0) {
      console.group(`⚠️ 循环依赖 (${report.cycles.length})`)
      report.cycles.forEach((cycle, index) => {
        console.log(`${index + 1}. ${cycle.cycle.join(' → ')}`)
      })
      console.groupEnd()
    } else {
      console.log('✅ 未发现循环依赖')
    }

    if (report.topologicalOrder.length > 0) {
      console.group('📋 推荐加载顺序')
      console.log(report.topologicalOrder.slice(0, 10).join(' → '))
      if (report.topologicalOrder.length > 10) {
        console.log(`... (还有 ${report.topologicalOrder.length - 10} 个模板)`)
      }
      console.groupEnd()
    }

    console.groupEnd()
  }
}

/**
 * 创建依赖分析器
 * 
 * @param templates - 模板列表
 * @param options - 配置选项
 * @returns 依赖分析器实例
 */
export function createDependencyAnalyzer(
  templates: TemplateMetadata[],
  options?: DependencyAnalyzerOptions
): DependencyAnalyzer {
  return new DependencyAnalyzer(templates, options)
}


