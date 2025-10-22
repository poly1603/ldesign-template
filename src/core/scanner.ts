/**
 * 模板扫描器 - 使用 import.meta.glob 动态扫描模板
 * 支持 IndexedDB 持久化缓存
 */

import type { Component } from 'vue'
import type { DeviceType, TemplateConfig, TemplateMetadata, TemplateRegistryItem, TemplateScanResult } from '../types'
import { generateTemplatesHash, getPersistentCache } from './persistent-cache'

/**
 * 模板路径解析结果
 */
interface PathInfo {
  category: string
  device: string
  name: string
  fullPath: string
}

/**
 * 解析模板路径 - 内存优化版本
 * 路径格式：../templates/{category}/{device}/{name}/config.ts
 */
function parseTemplatePath(path: string): PathInfo | null {
  // 使用正则，避免每次调用创建新正则
  const match = path.match(/templates\/([^/]+)\/([^/]+)\/([^/]+)\/config\.(ts|js)$/)

  if (!match) {
    return null
  }

  const [, category, device, name] = match

  // 直接返回对象字面量，避免中间变量
  return {
    category,
    device,
    name,
    fullPath: path,
  }
}

/**
 * 获取组件路径（从配置路径推导）- 内存优化
 */
function getComponentPath(configPath: string): string {
  // 使用正则，避免重复创建
  return configPath.replace(/config\.(ts|js)$/, 'index.vue')
}

/**
 * 获取打包后的组件路径 - 内存优化
 */
function getBuiltComponentPath(configPath: string): string {
  // 使用正则，避免重复创建
  return configPath.replace(/config\.(ts|js)$/, 'index.vue.js')
}

/**
 * 模板扫描器类 - 支持持久化缓存
 */
export class TemplateScanner {
  // 使用 null 初始化，扫描后立即清理，减少内存占用
  private configModules: Record<string, unknown> | null = null
  private componentModules: Record<string, unknown> | null = null
  // 使用 Map 存储注册表，支持高效查找
  private registry: Map<string, TemplateRegistryItem> = new Map()
  // 内存缓存扫描结果
  private scanResult: TemplateScanResult | null = null
  private currentHash: string | null = null
  // 持久化缓存实例
  private persistentCache = getPersistentCache()
  // 缓存版本
  private readonly CACHE_VERSION = '1.0.0'
  // 缓存过期时间（24小时）
  private readonly CACHE_MAX_AGE = 86400000
  // 复用正则表达式，避免重复创建
  static readonly PATH_REGEX = /templates\/([^/]+)\/([^/]+)\/([^/]+)\/config\.(ts|js)$/
  static readonly CONFIG_REPLACE_REGEX = /config\.(ts|js)$/

  /**
   * 扫描所有模板 - 支持持久化缓存
   * 
   * 关键点：
   * 1. 先检查 IndexedDB 缓存
   * 2. 使用文件列表哈希判断是否需要重新扫描
   * 3. 仅在缓存未命中或过期时重新扫描
   * 4. 扫描后保存到 IndexedDB
   */
  async scan(): Promise<TemplateScanResult> {
    const startTime = performance.now()

    // 如果已有内存缓存，直接返回
    if (this.scanResult && this.currentHash) {
      return this.scanResult
    }

    // 1. 扫描所有 config.ts/js 文件（eager 模式，同步加载）
    this.configModules = import.meta.glob(
      '../templates/**/config.{ts,js}',
      { eager: true }
    )

    // 2. 扫描所有 index.vue 和 index.vue.js 文件（懒加载模式）
    this.componentModules = {
      ...import.meta.glob('../templates/**/index.vue'),
      ...import.meta.glob('../templates/**/index.vue.js'),
    }

    // 3. 生成配置文件列表的哈希
    const configPaths = Object.keys(this.configModules)
    const hash = await generateTemplatesHash(configPaths)

    // 4. 尝试从持久化缓存加载
    if (hash === this.currentHash && this.scanResult) {
      // 哈希未变，使用内存缓存
      return this.scanResult
    }

    let cachedResult: TemplateScanResult | null = null

    try {
      cachedResult = await this.persistentCache.load(hash, this.CACHE_MAX_AGE)
    } catch (error) {
      console.warn('[TemplateScanner] Failed to load from persistent cache:', error)
    }

    if (cachedResult) {
      // 缓存命中，恢复注册表
      this.scanResult = cachedResult
      this.currentHash = hash
      await this.restoreRegistry(cachedResult)

      // 清理模块引用
      this.configModules = null
      this.componentModules = null

      if (import.meta.env.DEV) {
        console.log('[TemplateScanner] Loaded from cache:', {
          templates: cachedResult.total,
          time: `${(performance.now() - startTime).toFixed(2)}ms`
        })
      }

      return cachedResult
    }

    // 5. 缓存未命中，执行完整扫描
    const result = await this.performScan(startTime)

    // 6. 保存到持久化缓存
    this.currentHash = hash
    try {
      await this.persistentCache.save(hash, result, this.CACHE_VERSION)
    } catch (error) {
      console.warn('[TemplateScanner] Failed to save to persistent cache:', error)
    }

    return result
  }

  /**
   * 执行实际扫描（从 scan 方法提取）
   */
  private async performScan(startTime: number): Promise<TemplateScanResult> {

    if (!this.configModules) {
      throw new Error('Config modules not loaded')
    }

    // 解析并注册所有模板 - 预分配数组大小以减少扩容
    const moduleEntries = Object.entries(this.configModules)
    const templates: TemplateMetadata[] = Array.from({ length: moduleEntries.length })
    let templateIndex = 0
    const byCategory: Record<string, number> = Object.create(null)
    const byDevice: Record<string, number> = Object.create(null)

    for (const [path, module] of moduleEntries) {
      const pathInfo = parseTemplatePath(path)

      if (!pathInfo) {
        console.warn(`[TemplateScanner] 无法解析路径: ${path}`)
        continue
      }

      // 获取配置（支持 default export 和直接 export）
      const mod = module as unknown as { default?: TemplateConfig } | TemplateConfig
      const config: TemplateConfig = (mod && typeof mod === 'object' && 'default' in mod)
        ? (mod.default as TemplateConfig)
        : (mod as TemplateConfig)

      // 构建完整的元数据
      const metadata: TemplateMetadata = {
        ...config,
        category: pathInfo.category,
        device: pathInfo.device as DeviceType,
        name: config.name || pathInfo.name,
      }

      // 获取组件路径（尝试 .vue 和 .vue.js）
      const componentPath = getComponentPath(path)
      const builtComponentPath = getBuiltComponentPath(path)

      // 优先使用 .vue 文件（开发环境），如果不存在则使用 .vue.js（生产环境）
      const componentLoader = this.componentModules[componentPath] ||
        this.componentModules[builtComponentPath]

      const actualComponentPath = this.componentModules[componentPath] ?
        componentPath : builtComponentPath

      if (!componentLoader) {
        console.warn(
          `[TemplateScanner] 未找到组件: ${componentPath} 或 ${builtComponentPath} (配置: ${path})`
        )
        continue
      }

      // 创建注册表项
      const registryItem: TemplateRegistryItem = {
        metadata,
        loader: async () => {
          const mod = await (componentLoader as () => Promise<unknown>)()
          const m = mod as { default?: Component }
          return (m.default ?? (mod as Component))
        },
        configPath: path,
        componentPath: actualComponentPath,
      }

      // 生成唯一键：category/device/name
      const key = `${metadata.category}/${metadata.device}/${metadata.name}`
      this.registry.set(key, registryItem)

      // 统计 - 使用预分配的数组位置
      templates[templateIndex++] = metadata
      byCategory[metadata.category] = (byCategory[metadata.category] || 0) + 1
      byDevice[metadata.device] = (byDevice[metadata.device] || 0) + 1
    }

    // 调整数组大小到实际使用的长度
    templates.length = templateIndex

    const scanTime = performance.now() - startTime

    const result: TemplateScanResult = {
      total: templates.length,
      byCategory,
      byDevice,
      scanTime,
      templates,
    }

    // 保存到内存缓存
    this.scanResult = result

    // 清理不再需要的模块引用，释放内存
    this.configModules = null
    this.componentModules = null

    if (import.meta.env.DEV) {
      console.log('[TemplateScanner] Scan completed:', {
        templates: result.total,
        time: `${scanTime.toFixed(2)}ms`,
        byCategory,
        byDevice
      })
    }

    return result
  }

  /**
   * 从缓存结果恢复注册表
   */
  private async restoreRegistry(cachedResult: TemplateScanResult): Promise<void> {
    // 需要重新加载组件模块以恢复 loader
    this.componentModules = {
      ...import.meta.glob('../templates/**/index.vue'),
      ...import.meta.glob('../templates/**/index.vue.js'),
    }

    for (const metadata of cachedResult.templates) {
      const { category, device, name } = metadata

      // 重建配置路径
      const configPath = `../templates/${category}/${device}/${name}/config.ts`
      const componentPath = getComponentPath(configPath)
      const builtComponentPath = getBuiltComponentPath(configPath)

      const componentLoader = this.componentModules?.[componentPath] ||
        this.componentModules?.[builtComponentPath]

      if (!componentLoader) {
        console.warn(`[TemplateScanner] Component not found: ${componentPath}`)
        continue
      }

      const actualComponentPath = this.componentModules?.[componentPath] ?
        componentPath : builtComponentPath

      const registryItem: TemplateRegistryItem = {
        metadata,
        loader: async () => {
          const mod = await (componentLoader as () => Promise<unknown>)()
          const m = mod as { default?: Component }
          return (m.default ?? (mod as Component))
        },
        configPath,
        componentPath: actualComponentPath,
      }

      const key = `${category}/${device}/${name}`
      this.registry.set(key, registryItem)
    }

    // 清理组件模块引用
    this.componentModules = null
  }

  /**
   * 清除持久化缓存
   */
  async clearPersistentCache(): Promise<void> {
    await this.persistentCache.clear()
    this.scanResult = null
    this.currentHash = null
  }

  /**
   * 获取缓存统计
   */
  async getCacheStats() {
    return this.persistentCache.getStats()
  }

  /**
   * 获取注册表
   */
  getRegistry(): Map<string, TemplateRegistryItem> {
    return this.registry
  }

  /**
   * 根据键获取模板
   */
  getTemplate(category: string, device: string, name: string): TemplateRegistryItem | undefined {
    const key = `${category}/${device}/${name}`
    return this.registry.get(key)
  }

  /**
   * 获取所有模板元数据
   */
  getAllMetadata(): TemplateMetadata[] {
    return Array.from(this.registry.values()).map(item => item.metadata)
  }
}

/**
 * 全局扫描器实例
 */
let globalScanner: TemplateScanner | null = null

/**
 * 获取全局扫描器实例
 */
export function getScanner(): TemplateScanner {
  if (!globalScanner) {
    globalScanner = new TemplateScanner()
  }
  return globalScanner
}

/**
 * 扫描所有模板（便捷方法）
 */
export async function scanTemplates(): Promise<TemplateScanResult> {
  const scanner = getScanner()
  return scanner.scan()
}
