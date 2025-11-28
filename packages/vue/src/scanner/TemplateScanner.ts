import type { TemplateMetadata, TemplateConfig } from '@ldesign/template-core'
import { parsePath, generateTemplateId } from '@ldesign/template-core'
import type { Component } from 'vue'

/**
 * Glob 模块类型
 */
type GlobModule<T = any> = Record<string, () => Promise<T>>
type GlobEagerModule<T = any> = Record<string, T>

/**
 * 模板扫描器
 * 使用 import.meta.glob 自动发现和加载模板
 */
export class TemplateScanner {
  /**
   * 懒加载组件模块
   * eager: false 表示返回加载函数,不立即执行
   */
  private lazyComponents: GlobModule<{ default: Component }>

  /**
   * 即时加载配置模块
   * eager: true 表示构建时就加载
   */
  private eagerConfigs: GlobEagerModule<TemplateConfig>

  constructor() {
    // 扫描所有模板组件
    // 路径模式: ../templates/{category}/{device}/{name}/index.vue
    this.lazyComponents = import.meta.glob(
      '../templates/**/{desktop,mobile,tablet}/*/index.vue',
      { eager: false }
    ) as GlobModule<{ default: Component }>

    // 扫描所有配置文件
    // 路径模式: ../templates/{category}/{device}/{name}/template.config.ts
    this.eagerConfigs = import.meta.glob(
      '../templates/**/{desktop,mobile,tablet}/*/template.config.ts',
      { eager: true, import: 'default' }
    ) as GlobEagerModule<TemplateConfig>
  }

  /**
   * 扫描并生成模板元数据列表
   */
  scan(): TemplateMetadata[] {
    const templates: TemplateMetadata[] = []

    for (const [componentPath, loader] of Object.entries(this.lazyComponents)) {
      // 解析路径信息
      const parsed = parsePath(componentPath)
      
      if (!parsed) {
        console.warn(`无法解析模板路径: ${componentPath}`)
        continue
      }

      const { category, device, name } = parsed

      // 生成模板 ID
      const id = generateTemplateId(category, device, name)

      // 查找对应的配置文件
      const configPath = componentPath.replace('index.vue', 'template.config.ts')
      const config = this.eagerConfigs[configPath] || {}

      // 构建模板元数据
      templates.push({
        id,
        category,
        device,
        name,
        path: componentPath,
        loader,
        // 合并配置信息
        displayName: config.displayName,
        description: config.description,
        author: config.author,
        version: config.version,
        preview: config.preview,
        tags: config.tags,
        props: config.props,
        dependencies: config.dependencies,
      })
    }

    return templates
  }

  /**
   * 获取所有组件路径
   */
  getComponentPaths(): string[] {
    return Object.keys(this.lazyComponents)
  }

  /**
   * 获取所有配置路径
   */
  getConfigPaths(): string[] {
    return Object.keys(this.eagerConfigs)
  }

  /**
   * 获取扫描统计信息
   */
  getStats() {
    const componentCount = Object.keys(this.lazyComponents).length
    const configCount = Object.keys(this.eagerConfigs).length

    return {
      componentCount,
      configCount,
      matchRate: componentCount > 0 ? (configCount / componentCount) * 100 : 0,
    }
  }
}

/**
 * 创建模板扫描器实例
 */
export function createTemplateScanner(): TemplateScanner {
  return new TemplateScanner()
}