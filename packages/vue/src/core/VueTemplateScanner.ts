/**
 * Vue Template Scanner
 * 
 * 使用 Vite 的 import.meta.glob 扫描模板文件
 */

import type { Component } from 'vue'
import type { TemplateRegistry, TemplateMetadata, TemplateRegistryItem } from '@ldesign/template-core'

/**
 * Vite glob 导入结果
 */
type GlobImport = Record<string, () => Promise<any>>

/**
 * 扫描选项
 */
export interface ScanOptions {
  /**
   * 模板根目录（相对路径）
   */
  baseDir?: string
  
  /**
   * 是否立即加载配置文件
   */
  eager?: boolean
  
  /**
   * 自定义路径解析
   */
  resolvePath?: (path: string) => { category: string; device: string; name: string }
}

/**
 * 从路径解析模板信息
 * 
 * 例如: ./templates/login/mobile/DefaultTemplate/config.ts
 * 解析为: { category: 'login', device: 'mobile', name: 'DefaultTemplate' }
 */
function parseTemplatePath(path: string): { category: string; device: string; name: string } | null {
  // 匹配: templates/{category}/{device}/{name}/config.ts
  const match = path.match(/templates\/([^/]+)\/([^/]+)\/([^/]+)\/config\.ts$/)
  
  if (!match) {
    return null
  }
  
  return {
    category: match[1],
    device: match[2],
    name: match[3],
  }
}

/**
 * Vue 模板扫描器
 */
export class VueTemplateScanner {
  constructor(private options: ScanOptions = {}) {}
  
  /**
   * 扫描模板并注册到注册表
   */
  async scan(
    configModules: GlobImport,
    componentModules: GlobImport,
    registry: TemplateRegistry<Component>
  ): Promise<void> {
    const startTime = Date.now()
    let count = 0
    
    // 遍历所有配置文件
    for (const [configPath, configLoader] of Object.entries(configModules)) {
      try {
        const parsed = this.options.resolvePath
          ? this.options.resolvePath(configPath)
          : parseTemplatePath(configPath)
        
        if (!parsed) {
          console.warn(`[VueTemplateScanner] Unable to parse path: ${configPath}`)
          continue
        }
        
        const { category, device, name } = parsed
        
        // 加载配置
        const configModule = await configLoader()
        const config = configModule.default || configModule
        
        // 构建组件路径
        const componentPath = configPath.replace('/config.ts', '/index.vue')
        
        // 检查组件模块是否存在
        if (!componentModules[componentPath]) {
          console.warn(`[VueTemplateScanner] Component not found for: ${configPath}`)
          continue
        }
        
        // 构建元数据
        const metadata: TemplateMetadata<Component> = {
          name,
          displayName: config.displayName || name,
          description: config.description,
          category,
          device: device as any,
          version: config.version,
          author: config.author,
          tags: config.tags,
          isDefault: config.isDefault || false,
          preview: config.preview,
          lastModified: Date.now(),
        }
        
        // 构建注册表项
        const registryItem: TemplateRegistryItem<Component> = {
          metadata,
          loader: componentModules[componentPath],
          configPath,
          componentPath,
          stylePath: config.stylePath,
        }
        
        // 注册到注册表
        registry.register(category, device as any, name, registryItem)
        count++
      } catch (error) {
        console.error(`[VueTemplateScanner] Failed to scan: ${configPath}`, error)
      }
    }
    
    const scanTime = Date.now() - startTime
    console.log(`[VueTemplateScanner] Scanned ${count} templates in ${scanTime}ms`)
  }
  
  /**
   * 使用 Vite glob 扫描
   * 
   * @example
   * ```ts
   * const scanner = new VueTemplateScanner()
   * 
   * await scanner.scanWithGlob(
   *   import.meta.glob('./templates/**\/config.ts'),
   *   import.meta.glob('./templates/**\/index.vue'),
   *   registry
   * )
   * ```
   */
  async scanWithGlob(
    configGlob: GlobImport,
    componentGlob: GlobImport,
    registry: TemplateRegistry<Component>
  ): Promise<void> {
    return this.scan(configGlob, componentGlob, registry)
  }
}

/**
 * 创建 Vue 模板扫描器
 */
export function createVueScanner(options?: ScanOptions): VueTemplateScanner {
  return new VueTemplateScanner(options)
}

/**
 * 便捷函数：使用默认配置扫描模板
 */
export async function scanTemplates(
  registry: TemplateRegistry<Component>,
  options?: ScanOptions
): Promise<void> {
  // 这个函数需要在实际使用时根据项目结构调整 glob 路径
  // 这里提供一个示例实现
  
  const baseDir = options?.baseDir || './templates'
  
  // 使用 Vite 的 import.meta.glob
  const configModules = import.meta.glob(`${baseDir}/**/config.ts`)
  const componentModules = import.meta.glob(`${baseDir}/**/index.vue`)
  
  const scanner = new VueTemplateScanner(options)
  await scanner.scan(configModules, componentModules, registry)
}
