import type { DeviceType, TemplateMetadata } from '../types'

/**
 * 模板注册表
 * 使用 Map 数据结构提供高效的模板存储和查询
 */
export class TemplateRegistry {
  /**
   * 主存储 - 按 ID 存储模板元数据
   */
  private templates = new Map<string, TemplateMetadata>()

  /**
   * 分类索引 - 按功能分类存储模板 ID 集合
   */
  private categoryIndex = new Map<string, Set<string>>()

  /**
   * 设备索引 - 按设备类型存储模板 ID 集合
   */
  private deviceIndex = new Map<DeviceType, Set<string>>()

  /**
   * 注册单个模板
   */
  register(metadata: TemplateMetadata): void {
    const { id, category, device } = metadata

    if (!id || !category || !device) {
      throw new Error('模板元数据缺少必需字段: id, category, device')
    }

    // 主存储
    this.templates.set(id, metadata)

    // 构建分类索引
    if (!this.categoryIndex.has(category)) {
      this.categoryIndex.set(category, new Set())
    }
    this.categoryIndex.get(category)!.add(id)

    // 构建设备索引
    if (!this.deviceIndex.has(device)) {
      this.deviceIndex.set(device, new Set())
    }
    this.deviceIndex.get(device)!.add(id)
  }

  /**
   * 批量注册模板
   */
  registerBatch(metadataList: TemplateMetadata[]): void {
    metadataList.forEach((metadata) => this.register(metadata))
  }

  /**
   * 注销模板
   */
  unregister(id: string): boolean {
    const template = this.templates.get(id)
    if (!template) {
      return false
    }

    const { category, device } = template

    // 从主存储删除
    this.templates.delete(id)

    // 从分类索引删除
    const categorySet = this.categoryIndex.get(category)
    if (categorySet) {
      categorySet.delete(id)
      if (categorySet.size === 0) {
        this.categoryIndex.delete(category)
      }
    }

    // 从设备索引删除
    const deviceSet = this.deviceIndex.get(device)
    if (deviceSet) {
      deviceSet.delete(id)
      if (deviceSet.size === 0) {
        this.deviceIndex.delete(device)
      }
    }

    return true
  }

  /**
   * 通过 ID 获取模板
   */
  get(id: string): TemplateMetadata | undefined {
    return this.templates.get(id)
  }

  /**
   * 检查模板是否存在
   */
  has(id: string): boolean {
    return this.templates.has(id)
  }

  /**
   * 获取所有模板
   */
  getAll(): TemplateMetadata[] {
    return Array.from(this.templates.values())
  }

  /**
   * 通过分类获取所有模板 ID
   */
  getIdsByCategory(category: string): string[] {
    const categorySet = this.categoryIndex.get(category)
    return categorySet ? Array.from(categorySet) : []
  }

  /**
   * 通过设备类型获取所有模板 ID
   */
  getIdsByDevice(device: DeviceType): string[] {
    const deviceSet = this.deviceIndex.get(device)
    return deviceSet ? Array.from(deviceSet) : []
  }

  /**
   * 通过分类和设备获取模板 ID
   * 返回同时满足分类和设备类型条件的模板 ID（交集）
   */
  getIdsByCategoryAndDevice(category: string, device: DeviceType): string[] {
    const categoryIds = this.categoryIndex.get(category)
    const deviceIds = this.deviceIndex.get(device)

    if (!categoryIds || !deviceIds) {
      return []
    }

    // 计算交集
    return Array.from(categoryIds).filter((id) => deviceIds.has(id))
  }

  /**
   * 获取所有分类
   */
  getCategories(): string[] {
    return Array.from(this.categoryIndex.keys())
  }

  /**
   * 获取所有设备类型
   */
  getDevices(): DeviceType[] {
    return Array.from(this.deviceIndex.keys())
  }

  /**
   * 获取模板总数
   */
  get size(): number {
    return this.templates.size
  }

  /**
   * 清空注册表
   */
  clear(): void {
    this.templates.clear()
    this.categoryIndex.clear()
    this.deviceIndex.clear()
  }

  /**
   * 导出所有数据（用于序列化）
   */
  toJSON(): TemplateMetadata[] {
    return this.getAll()
  }
}