import type { App, Plugin } from 'vue'
import { TemplateRegistry, TemplateManager } from '@ldesign/template-core'
import type { TemplateMetadata } from '@ldesign/template-core'
import { getBuiltinTemplates } from '../templates'
import { setTemplateManager } from './context'

/**
 * 模板插件选项
 */
export interface TemplatePluginOptions {
  /**
   * 是否自动加载内置模板
   * @default true
   */
  autoScan?: boolean

  /**
   * 额外的模板列表（用户自定义模板）
   */
  templates?: TemplateMetadata[]

  /**
   * 是否启用调试模式
   * @default false
   */
  debug?: boolean
}

/**
 * 创建模板插件
 *
 * @param options - 插件选项
 * @returns Vue 插件
 *
 * @example
 * ```ts
 * // 使用内置模板（推荐）
 * app.use(createTemplatePlugin())
 *
 * // 添加自定义模板
 * app.use(createTemplatePlugin({
 *   templates: [myCustomTemplate],
 * }))
 * ```
 */
export function createTemplatePlugin(
  options: TemplatePluginOptions = {},
): Plugin {
  const { autoScan = true, templates = [], debug = false } = options

  return {
    install(app: App) {
      // 创建注册表和管理器
      const registry = new TemplateRegistry()
      const manager = new TemplateManager(registry)

      // 加载内置模板
      if (autoScan) {
        const builtinTemplates = getBuiltinTemplates()

        if (debug) {
          console.log('[TemplatePlugin] 内置模板:', builtinTemplates.map(t => t.id))
        }

        registry.registerBatch(builtinTemplates)
      }

      // 注册用户自定义模板
      if (templates.length > 0) {
        registry.registerBatch(templates)
        if (debug) {
          console.log('[TemplatePlugin] 注册自定义模板:', templates.length)
        }
      }

      // 设置全局管理器
      setTemplateManager(manager)

      // 提供给组件使用
      app.provide('templateManager', manager)

      // 全局属性
      app.config.globalProperties.$templates = manager

      if (debug) {
        console.log('[TemplatePlugin] 插件已安装')
        console.log('[TemplatePlugin] 总模板数:', manager.getTemplateCount())
      }
    },
  }
}