/**
 * Template Registry
 * 
 * 模板注册表 - 抽象类，由框架适配层实现
 */

import type {
  TemplateMetadata,
  TemplateRegistryItem,
  TemplateFilter,
  TemplateCategory,
  DeviceType,
} from '../types'

/**
 * 模板注册表抽象类
 * 
 * 框架适配层需要实现扫描逻辑
 */
export abstract class TemplateRegistry<TComponent = unknown> {
  protected registry = new Map<string, TemplateRegistryItem<TComponent>>()
  protected initialized = false
  
  /**
   * 生成注册键
   */
  protected createKey(category: string, device: string, name: string): string {
    return `${category}/${device}/${name}`
  }
  
  /**
   * 扫描并注册所有模板（由子类实现）
   */
  abstract scan(): Promise<void>
  
  /**
   * 注册单个模板
   */
  register(item: TemplateRegistryItem<TComponent>): void {
    const { category, device, name } = item.metadata
    const key = this.createKey(category, device, name)
    this.registry.set(key, item)
  }
  
  /**
   * 获取指定模板
   */
  getTemplate(
    category: string,
    device: string,
    name: string
  ): TemplateRegistryItem<TComponent> | null {
    const key = this.createKey(category, device, name)
    return this.registry.get(key) || null
  }
  
  /**
   * 查询模板（支持过滤）
   */
  query(filter: TemplateFilter = {}): TemplateMetadata[] {
    const allTemplates = Array.from(this.registry.values()).map(item => item.metadata)
    return this.filterTemplates(allTemplates, filter)
  }
  
  /**
   * 获取所有元数据
   */
  getAllMetadata(): TemplateMetadata[] {
    return Array.from(this.registry.values()).map(item => item.metadata)
  }
  
  /**
   * 获取注册表 Map
   */
  getRegistry(): Map<string, TemplateRegistryItem<TComponent>> {
    return this.registry
  }
  
  /**
   * 检查模板是否存在
   */
  has(category: string, device: string, name: string): boolean {
    const key = this.createKey(category, device, name)
    return this.registry.has(key)
  }
  
  /**
   * 清空注册表
   */
  clear(): void {
    this.registry.clear()
    this.initialized = false
  }
  
  /**
   * 过滤模板 - 高性能实现
   */
  private filterTemplates(
    templates: TemplateMetadata[],
    filter: TemplateFilter
  ): TemplateMetadata[] {
    // 判断是否为单值条件
    const isSingleCategory = filter.category && !Array.isArray(filter.category)
    const isSingleDevice = filter.device && !Array.isArray(filter.device)
    const isSingleName = filter.name && !Array.isArray(filter.name)
    
    // 只在多值时创建 Set（性能优化）
    const categorySet = !isSingleCategory && filter.category
      ? new Set(Array.isArray(filter.category) ? filter.category : [filter.category])
      : null
      
    const deviceSet = !isSingleDevice && filter.device
      ? new Set(Array.isArray(filter.device) ? filter.device : [filter.device])
      : null
      
    const nameSet = !isSingleName && filter.name
      ? new Set(Array.isArray(filter.name) ? filter.name : [filter.name])
      : null
      
    const tagsArray = filter.tags
      ? (Array.isArray(filter.tags) ? filter.tags : [filter.tags])
      : null
    
    return templates.filter(t => {
      // 单值条件直接比较（更快）
      if (isSingleCategory && t.category !== filter.category) return false
      if (isSingleDevice && t.device !== filter.device) return false
      if (isSingleName && t.name !== filter.name) return false
      
      // 多值条件使用 Set（O(1) 查找）
      if (categorySet && !categorySet.has(t.category)) return false
      if (deviceSet && !deviceSet.has(t.device)) return false
      if (nameSet && !nameSet.has(t.name)) return false
      
      // 标签过滤
      if (tagsArray && (!t.tags || !tagsArray.some(tag => t.tags!.includes(tag)))) {
        return false
      }
      
      // 默认模板过滤
      if (filter.defaultOnly && !t.isDefault) return false
      
      return true
    })
  }
  
  /**
   * 是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized
  }
}
