/**
 * @ldesign/template-core
 * 模板管理核心库 - 框架无关
 */

// 导出类型
export type {
  DeviceType,
  TemplateMetadata,
  TemplateConfig,
  QueryConditions,
  QueryResult,
} from './types'

// 导出注册表
export { TemplateRegistry } from './registry'

// 导出管理器
export { TemplateManager } from './manager'

// 导出查询构建器
export { TemplateQuery } from './query'

// 导出工具函数
export {
  parsePath,
  generateTemplateId,
  parseTemplateId,
  isValidDevice,
  normalizePath,
  validateTemplateMetadata,
  validateTemplateConfig,
  isValidTemplateId,
  type ParsedPath,
} from './utils'