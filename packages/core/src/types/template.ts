/**
 * 设备类型枚举
 */
export type DeviceType = 'desktop' | 'mobile' | 'tablet'

/**
 * 模板元数据接口
 */
export interface TemplateMetadata {
  /**
   * 模板唯一标识
   * 格式: {category}:{device}:{name}
   * 示例: "login:desktop:default"
   */
  id: string

  /**
   * 功能分类
   * 示例: "login", "dashboard", "form"
   */
  category: string

  /**
   * 设备类型
   */
  device: DeviceType

  /**
   * 模板名称
   * 示例: "default", "split", "card"
   */
  name: string

  /**
   * 显示名称
   */
  displayName?: string

  /**
   * 模板描述
   */
  description?: string

  /**
   * 文件路径
   */
  path: string

  /**
   * 懒加载函数
   */
  loader?: () => Promise<any>

  /**
   * 预览图路径
   */
  preview?: string

  /**
   * 标签列表
   */
  tags?: string[]

  /**
   * 版本号
   */
  version?: string

  /**
   * 作者
   */
  author?: string

  /**
   * 模板属性配置
   */
  props?: Record<string, any>

  /**
   * 依赖的其他模板
   */
  dependencies?: string[]

  /**
   * 自定义元数据
   */
  [key: string]: any
}

/**
 * 模板配置接口
 */
export interface TemplateConfig {
  /**
   * 模板名称
   */
  name: string

  /**
   * 显示名称
   */
  displayName?: string

  /**
   * 模板描述
   */
  description?: string

  /**
   * 作者
   */
  author?: string

  /**
   * 版本号
   */
  version?: string

  /**
   * 预览图路径
   */
  preview?: string

  /**
   * 标签列表
   */
  tags?: string[]

  /**
   * 模板支持的属性
   */
  props?: Record<string, any>

  /**
   * 依赖的其他模板
   */
  dependencies?: string[]
}