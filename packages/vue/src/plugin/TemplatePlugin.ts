import type { App, Plugin } from 'vue'
import { TemplateRegistry, TemplateManager } from '@ldesign/template-core'
import type { TemplateMetadata } from '@ldesign/template-core'
import { createTemplateScanner } from '../scanner'
import { setTemplateManager } from './context'

/**
 * 模板插件选项
 */
export interface TemplatePluginOptions {
  /**
   * 是否自动扫描模板
   * @default true
   */
  autoScan?: boolean

  /**
   * 初始模板列表
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
 */
export function createTemplatePlugin(
  options: TemplatePluginOptions = {}
): Plugin {
  const { autoScan = true, templates = [], debug = false } = options

  return {
    install(app: App) {
      // 创建注册表和管理器
      const registry = new TemplateRegistry()
      const manager = new TemplateManager(registry)

      // 自动扫描模板
      if (autoScan) {
        try {
          const scanner = createTemplateScanner()
          const scannedTemplates = scanner.scan()
          
          if (debug) {
            console.log('[TemplatePlugin] 扫描到的模板:', scannedTemplates)
            console.log('[TemplatePlugin] 扫描统计:', scanner.getStats())
          }
          
          registry.registerBatch(scannedTemplates)
        } catch (error) {
          console.error('[TemplatePlugin] 模板扫描失败:', error)
        }
      }

      // 注册预定义模板
      if (templates.length > 0) {
        registry.registerBatch(templates)
        if (debug) {
          console.log('[TemplatePlugin] 注册预定义模板:', templates.length)
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