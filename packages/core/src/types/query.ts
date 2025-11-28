import type { DeviceType, TemplateMetadata } from './template'

/**
 * 查询条件接口
 */
export interface QueryConditions {
  /**
   * 按模板ID查询
   */
  id?: string

  /**
   * 按分类查询
   */
  category?: string

  /**
   * 按设备类型查询
   */
  device?: DeviceType

  /**
   * 按标签查询
   */
  tag?: string

  /**
   * 按名称查询
   */
  name?: string

  /**
   * 自定义过滤函数
   */
  filter?: (template: TemplateMetadata) => boolean
}

/**
 * 查询结果接口
 */
export interface QueryResult {
  /**
   * 查询到的模板列表
   */
  templates: TemplateMetadata[]

  /**
   * 总数
   */
  total: number
}