import type { DeviceType, TemplateMetadata } from '../types'
import type { TemplateRegistry } from '../registry/TemplateRegistry'

/**
 * 模板查询构建器
 * 提供链式调用的查询接口
 */
export class TemplateQuery {
  private conditions: {
    id?: string
    category?: string
    device?: DeviceType
    tags?: string[]
    filters: Array<(template: TemplateMetadata) => boolean>
  } = {
    filters: [],
  }

  constructor(private registry: TemplateRegistry) {}

  /**
   * 按 ID 查询
   */
  byId(id: string): this {
    this.conditions.id = id
    return this
  }

  /**
   * 按分类查询
   */
  byCategory(category: string): this {
    this.conditions.category = category
    return this
  }

  /**
   * 按设备类型查询
   */
  byDevice(device: DeviceType): this {
    this.conditions.device = device
    return this
  }

  /**
   * 按标签查询
   */
  byTag(tag: string): this {
    if (!this.conditions.tags) {
      this.conditions.tags = []
    }
    this.conditions.tags.push(tag)
    return this
  }

  /**
   * 添加自定义过滤条件
   */
  filter(predicate: (template: TemplateMetadata) => boolean): this {
    this.conditions.filters.push(predicate)
    return this
  }

  /**
   * 执行查询，返回所有匹配的模板
   */
  execute(): TemplateMetadata[] {
    // 如果指定了 ID，直接返回
    if (this.conditions.id) {
      const template = this.registry.get(this.conditions.id)
      return template ? [template] : []
    }

    // 获取候选模板列表
    let candidates: TemplateMetadata[]

    if (this.conditions.category && this.conditions.device) {
      // 同时指定分类和设备
      const ids = this.registry.getIdsByCategoryAndDevice(
        this.conditions.category,
        this.conditions.device
      )
      candidates = ids.map((id) => this.registry.get(id)!).filter(Boolean)
    } else if (this.conditions.category) {
      // 只指定分类
      const ids = this.registry.getIdsByCategory(this.conditions.category)
      candidates = ids.map((id) => this.registry.get(id)!).filter(Boolean)
    } else if (this.conditions.device) {
      // 只指定设备
      const ids = this.registry.getIdsByDevice(this.conditions.device)
      candidates = ids.map((id) => this.registry.get(id)!).filter(Boolean)
    } else {
      // 都不指定，获取所有模板
      candidates = this.registry.getAll()
    }

    // 应用标签过滤
    if (this.conditions.tags && this.conditions.tags.length > 0) {
      candidates = candidates.filter((template) => {
        if (!template.tags || template.tags.length === 0) {
          return false
        }
        // 检查是否包含所有指定的标签
        return this.conditions.tags!.every((tag) => template.tags!.includes(tag))
      })
    }

    // 应用自定义过滤器
    for (const filter of this.conditions.filters) {
      candidates = candidates.filter(filter)
    }

    return candidates
  }

  /**
   * 执行查询并返回第一个结果
   */
  first(): TemplateMetadata | undefined {
    const results = this.execute()
    return results.length > 0 ? results[0] : undefined
  }

  /**
   * 执行查询并返回结果数量
   */
  count(): number {
    return this.execute().length
  }

  /**
   * 检查是否存在匹配的模板
   */
  exists(): boolean {
    return this.count() > 0
  }
}