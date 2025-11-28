import type { TemplateManager } from '@ldesign/template-core'

/**
 * 全局模板管理器实例
 */
let globalManager: TemplateManager | null = null

/**
 * 设置全局模板管理器
 */
export function setTemplateManager(manager: TemplateManager): void {
  globalManager = manager
}

/**
 * 获取全局模板管理器
 * @throws {Error} 如果插件未安装
 */
export function getTemplateManager(): TemplateManager {
  if (!globalManager) {
    throw new Error(
      '模板管理器未初始化。请确保已安装 TemplatePlugin: app.use(createTemplatePlugin())'
    )
  }
  return globalManager
}

/**
 * 检查模板管理器是否已初始化
 */
export function hasTemplateManager(): boolean {
  return globalManager !== null
}