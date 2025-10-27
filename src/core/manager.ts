/**
 * 模板管理器 - 统一管理模板扫描、加载和查询
 * 
 * @description
 * 核心管理器类，负责：
 * - 模板扫描和注册
 * - 模板加载和缓存
 * - 模板查询和过滤
 * - 性能优化（LRU缓存、对象池等）
 * 
 * @example
 * ```ts
 * const manager = getManager()
 * await manager.initialize()
 * const templates = await manager.queryTemplates({ category: 'login', device: 'mobile' })
 * ```
 */

import type { Component } from 'vue'
import type {
  DeviceType,
  TemplateFilter,
  TemplateLoadOptions,
  TemplateManagerOptions,
  TemplateMetadata,
  TemplateRegistryItem,
  TemplateScanResult,
} from '../types'
import { createSetPool } from '../utils/objectPool'
import { objectFingerprint } from '../utils/performance'
import { getLoader } from './loader'
import { getScanner } from './scanner'

export class TemplateManager {
  private initialized = false
  private scanResult: TemplateScanResult | null = null
  private options: TemplateManagerOptions
  // 使用 Map 缓存过滤结果，使用字符串化的 key
  private filterCache = new Map<string, { data: TemplateMetadata[]; timestamp: number }>()
  private readonly FILTER_CACHE_TTL = 60000 // 缓存1分钟
  private readonly FILTER_CACHE_MAX_SIZE = 100 // 最大缓存条目
  // Set 池用于高效过滤
  private setPool = createSetPool<string>(20)

  /**
   * 构造函数
   */
  constructor(options: TemplateManagerOptions = {}) {
    this.options = options
  }

  /**
   * 初始化（扫描所有模板）
   */
  async initialize(): Promise<TemplateScanResult> {
    if (this.initialized && this.scanResult) {
      return this.scanResult
    }

    const scanner = getScanner()
    this.scanResult = await scanner.scan()
    this.initialized = true

    return this.scanResult
  }

  /**
   * 确保已初始化
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize()
    }
  }

  /**
   * 加载模板组件
   */
  async loadTemplate(
    category: string,
    device: string,
    name: string,
    options?: TemplateLoadOptions
  ): Promise<Component> {
    await this.ensureInitialized()
    const loader = getLoader()
    return loader.load(category, device, name, options)
  }

  /**
   * 获取所有模板元数据
   */
  async getAllTemplates(): Promise<TemplateMetadata[]> {
    await this.ensureInitialized()
    const scanner = getScanner()
    return scanner.getAllMetadata()
  }

  /**
   * 根据过滤条件查询模板
   */
  async queryTemplates(filter: TemplateFilter): Promise<TemplateMetadata[]> {
    await this.ensureInitialized()
    const allTemplates = await this.getAllTemplates()
    return this.filterTemplates(allTemplates, filter)
  }

  /**
   * 获取指定分类的所有模板
   */
  async getTemplatesByCategory(category: string): Promise<TemplateMetadata[]> {
    return this.queryTemplates({ category })
  }

  /**
   * 获取指定设备的所有模板
   */
  async getTemplatesByDevice(device: DeviceType): Promise<TemplateMetadata[]> {
    return this.queryTemplates({ device })
  }

  /**
   * 获取默认模板
   */
  async getDefaultTemplate(category: string, device: DeviceType | string): Promise<TemplateMetadata | null> {
    const templates = await this.queryTemplates({
      category,
      device: device as DeviceType,
      defaultOnly: true,
    })
    return templates[0] || null
  }

  /**
   * 获取扫描结果
   */
  getScanResult(): TemplateScanResult | null {
    return this.scanResult
  }

  /**
   * 预加载模板
   */
  async preloadTemplate(category: string, device: string, name: string): Promise<void> {
    await this.ensureInitialized()
    const loader = getLoader()
    return loader.preload(category, device, name)
  }

  /**
   * 根据过滤条件预加载模板
   */
  async preloadByFilter(filter: TemplateFilter): Promise<void> {
    await this.ensureInitialized()
    const loader = getLoader()
    return loader.preloadByFilter(filter)
  }

  /**
   * 清除缓存
   */
  clearCache(category?: string, device?: string, name?: string): void {
    const loader = getLoader()
    loader.clearCache(category, device, name)
    // 同时清空过滤缓存
    this.filterCache.clear()
  }

  /**
   * 扫描模板（别名方法）
   */
  async scanTemplates(): Promise<Map<string, TemplateRegistryItem>> {
    await this.initialize()
    // 返回注册表的 Map 格式
    const scanner = getScanner()
    return scanner.getRegistry()
  }

  /**
   * 重新扫描模板
   */
  async rescan(): Promise<TemplateScanResult> {
    this.initialized = false
    return this.initialize()
  }

  /**
   * 过滤模板 - 性能优化版本
   * 
   * @description
   * 使用多级优化策略：
   * 1. 使用快速哈希函数代替JSON.stringify生成缓存键
   * 2. 针对单值条件优化，避免创建Set
   * 3. 使用对象池复用Set对象
   * 4. LRU缓存策略，避免缓存无限增长
   * 
   * @param templates - 所有模板列表
   * @param filter - 过滤条件
   * @returns 过滤后的模板列表
   */
  private filterTemplates(templates: TemplateMetadata[], filter: TemplateFilter): TemplateMetadata[] {
    // 生成缓存键 - 使用快速哈希替代JSON.stringify
    const cacheKey = objectFingerprint(filter)
    const now = Date.now()

    // 检查缓存
    const cached = this.filterCache.get(cacheKey)
    if (cached && (now - cached.timestamp) < this.FILTER_CACHE_TTL) {
      return cached.data
    }

    // 优化：针对单值条件直接比较，避免创建Set
    const isSingleCategory = filter.category && !Array.isArray(filter.category)
    const isSingleDevice = filter.device && !Array.isArray(filter.device)
    const isSingleName = filter.name && !Array.isArray(filter.name)

    // 只在需要时创建Set（多值条件）
    const categorySet = !isSingleCategory ? this.createFilterSet(filter.category) : null
    const deviceSet = !isSingleDevice ? this.createFilterSet(filter.device) : null
    const nameSet = !isSingleName ? this.createFilterSet(filter.name) : null
    const tagsArray = filter.tags ? (Array.isArray(filter.tags) ? filter.tags : [filter.tags]) : null

    // 过滤逻辑
    const result = templates.filter(t => {
      // 单值条件直接比较（更快）
      if (isSingleCategory && t.category !== filter.category) return false
      if (isSingleDevice && t.device !== filter.device) return false
      if (isSingleName && t.name !== filter.name) return false

      // 多值条件使用Set（O(1)查找）
      if (categorySet && !categorySet.has(t.category)) return false
      if (deviceSet && !deviceSet.has(t.device)) return false
      if (nameSet && !nameSet.has(t.name)) return false

      // 标签过滤
      if (tagsArray && (!t.tags || !tagsArray.some(tag => t.tags!.includes(tag)))) return false

      // 默认模板过滤
      if (filter.defaultOnly && !t.isDefault) return false

      return true
    })

    // 释放 Set 对象回池
    if (categorySet) this.setPool.release(categorySet)
    if (deviceSet) this.setPool.release(deviceSet)
    if (nameSet) this.setPool.release(nameSet)

    // 缓存结果，使用 LRU 策略
    if (this.filterCache.size >= this.FILTER_CACHE_MAX_SIZE) {
      // 删除最旧的缓存项（Map的第一个键）
      const firstKey = this.filterCache.keys().next().value
      if (firstKey) {
        this.filterCache.delete(firstKey)
      }
    }
    this.filterCache.set(cacheKey, { data: result, timestamp: now })

    return result
  }

  /**
   * 创建过滤用的 Set
   * 
   * @description
   * 从对象池获取Set并填充值，使用完后需要释放回池
   * 
   * @param value - 字符串或字符串数组
   * @returns Set对象或null（如果value为空）
   */
  private createFilterSet(value: string | string[] | undefined): Set<string> | null {
    if (!value) return null
    const set = this.setPool.acquire()
    const values = Array.isArray(value) ? value : [value]
    for (const v of values) {
      set.add(v)
    }
    return set
  }

  /**
   * 获取缓存统计信息
   * 
   * @returns 缓存统计对象
   */
  getCacheStats() {
    return {
      filterCache: {
        size: this.filterCache.size,
        maxSize: this.FILTER_CACHE_MAX_SIZE,
        ttl: this.FILTER_CACHE_TTL,
      },
      setPool: {
        available: this.setPool.size,
      },
    }
  }
}

/**
 * 全局管理器实例
 */
let globalManager: TemplateManager | null = null

/**
 * 获取全局管理器实例
 */
export function getManager(): TemplateManager {
  if (!globalManager) {
    globalManager = new TemplateManager()
  }
  return globalManager
}

/**
 * 创建模板管理器实例
 */
export function createTemplateManager(): TemplateManager {
  return new TemplateManager()
}
