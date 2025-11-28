import type { DeviceType, TemplateMetadata } from '../types'
import { TemplateRegistry } from '../registry/TemplateRegistry'
import { TemplateQuery } from '../query/TemplateQuery'

/**
 * 模板管理器
 * 提供高级的模板管理和查询功能
 */
export class TemplateManager {
  constructor(private registry: TemplateRegistry) {}

  /**
   * 获取单个模板
   */
  getTemplate(id: string): TemplateMetadata | undefined {
    return this.registry.get(id)
  }

  /**
   * 解析模板标识符并获取模板
   * 支持格式:
   * 1. "login:desktop:default" - 完整ID
   * 2. "login:desktop" - 获取该分类和设备的默认模板或第一个模板
   */
  resolveTemplate(idOrPattern: string): TemplateMetadata | undefined {
    // 尝试直接获取
    let template = this.registry.get(idOrPattern)
    if (template) {
      return template
    }

    // 尝试解析模式
    const parts = idOrPattern.split(':')
    
    if (parts.length === 2) {
      // 格式: "login:desktop"
      const [category, device] = parts
      const ids = this.registry.getIdsByCategoryAndDevice(
        category,
        device as DeviceType
      )

      if (ids.length === 0) {
        return undefined
      }

      // 优先返回名为 'default' 的模板
      const defaultId = ids.find((id) => id.endsWith(':default'))
      if (defaultId) {
        return this.registry.get(defaultId)
      }

      // 否则返回第一个
      return this.registry.get(ids[0])
    }

    return undefined
  }

  /**
   * 获取分类下的所有模板
   */
  getTemplatesByCategory(category: string): TemplateMetadata[] {
    const ids = this.registry.getIdsByCategory(category)
    return ids.map((id) => this.registry.get(id)!).filter(Boolean)
  }

  /**
   * 获取设备类型的所有模板
   */
  getTemplatesByDevice(device: DeviceType): TemplateMetadata[] {
    const ids = this.registry.getIdsByDevice(device)
    return ids.map((id) => this.registry.get(id)!).filter(Boolean)
  }

  /**
   * 获取特定分类和设备的模板
   */
  getTemplatesByCategoryAndDevice(
    category: string,
    device: DeviceType
  ): TemplateMetadata[] {
    const ids = this.registry.getIdsByCategoryAndDevice(category, device)
    return ids.map((id) => this.registry.get(id)!).filter(Boolean)
  }

  /**
   * 获取所有分类
   */
  getCategories(): string[] {
    return this.registry.getCategories()
  }

  /**
   * 获取所有设备类型
   */
  getDevices(): DeviceType[] {
    return this.registry.getDevices()
  }

  /**
   * 获取所有模板
   */
  getAllTemplates(): TemplateMetadata[] {
    return this.registry.getAll()
  }

  /**
   * 检查模板是否存在
   */
  hasTemplate(id: string): boolean {
    return this.registry.has(id)
  }

  /**
   * 获取模板总数
   */
  getTemplateCount(): number {
    return this.registry.size
  }

  /**
   * 创建查询构建器
   */
  query(): TemplateQuery {
    return new TemplateQuery(this.registry)
  }

  /**
   * 按标签查找模板
   */
  findByTag(tag: string): TemplateMetadata[] {
    return this.query().byTag(tag).execute()
  }

  /**
   * 按名称查找模板
   */
  findByName(name: string): TemplateMetadata[] {
    return this.registry
      .getAll()
      .filter((template) => template.name === name)
  }

  /**
   * 搜索模板（模糊匹配）
   */
  search(keyword: string): TemplateMetadata[] {
    const lowerKeyword = keyword.toLowerCase()
    
    return this.registry.getAll().filter((template) => {
      // 在 ID、名称、显示名称、描述中搜索
      return (
        template.id.toLowerCase().includes(lowerKeyword) ||
        template.name.toLowerCase().includes(lowerKeyword) ||
        template.displayName?.toLowerCase().includes(lowerKeyword) ||
        template.description?.toLowerCase().includes(lowerKeyword) ||
        template.tags?.some((tag) => tag.toLowerCase().includes(lowerKeyword))
      )
    })
  }

  /**
   * 获取注册表实例（供高级用户使用）
   */
  getRegistry(): TemplateRegistry {
    return this.registry
  }
}