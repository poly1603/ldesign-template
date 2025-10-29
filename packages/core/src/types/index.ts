/**
 * Core Types - Framework Agnostic
 * 
 * 所有框架无关的类型定义
 */

import type { DeviceType } from '../state/DeviceDetector'

export type { DeviceType }

/**
 * 模板分类
 */
export type TemplateCategory = 'login' | 'dashboard' | 'profile' | 'settings' | 'form' | 'list' | string

/**
 * 模板元数据
 */
export interface TemplateMetadata {
  /** 模板名称（唯一标识） */
  name: string
  /** 显示名称 */
  displayName: string
  /** 模板描述 */
  description?: string
  /** 模板分类 */
  category: TemplateCategory
  /** 设备类型 */
  device: DeviceType
  /** 版本号 */
  version?: string
  /** 作者 */
  author?: string
  /** 标签 */
  tags?: string[]
  /** 是否为默认模板 */
  isDefault?: boolean
  /** 预览图 */
  preview?: string
  /** 最后修改时间 */
  lastModified?: number
}

/**
 * 模板配置
 */
export interface TemplateConfig extends Omit<TemplateMetadata, 'category' | 'device'> {
  /** 支持的插槽定义 */
  slots?: Array<{
    name: string
    description?: string
    example?: string
    props?: Record<string, any>
    required?: boolean
  }>
  /** 额外配置 */
  [key: string]: any
}

/**
 * 模板注册表项
 */
export interface TemplateRegistryItem<TComponent = unknown> {
  /** 模板元数据 */
  metadata: TemplateMetadata
  /** 组件加载器（懒加载） */
  loader: () => Promise<TComponent>
  /** 配置文件路径 */
  configPath: string
  /** 组件文件路径 */
  componentPath: string
  /** 样式文件路径 */
  stylePath?: string
}

/**
 * 模板过滤选项
 */
export interface TemplateFilter {
  /** 模板分类 */
  category?: TemplateCategory | TemplateCategory[]
  /** 设备类型 */
  device?: DeviceType | DeviceType[]
  /** 模板名称 */
  name?: string | string[]
  /** 标签 */
  tags?: string | string[]
  /** 是否只返回默认模板 */
  defaultOnly?: boolean
}

/**
 * 模板扫描结果
 */
export interface TemplateScanResult {
  /** 扫描到的模板数量 */
  total: number
  /** 按分类统计 */
  byCategory: Record<TemplateCategory, number>
  /** 按设备统计 */
  byDevice: Record<DeviceType, number>
  /** 扫描时间（毫秒） */
  scanTime: number
  /** 所有模板的元数据列表 */
  templates: TemplateMetadata[]
}

/**
 * 模板加载选项
 */
export interface TemplateLoadOptions {
  /** 是否预加载 */
  preload?: boolean
  /** 加载超时时间（毫秒） */
  timeout?: number
  /** 错误处理 */
  onError?: (error: Error) => void
  /** 加载成功回调 */
  onLoad?: (component: unknown) => void
}

/**
 * 组件加载器接口（泛型）
 */
export interface ComponentLoader<TComponent = unknown> {
  /**
   * 加载组件
   * @param path 组件路径
   */
  load(path: string): Promise<TComponent>
}

/**
 * 样式加载器接口
 */
export interface StyleLoader {
  /**
   * 加载样式
   * @param path 样式路径
   */
  load(path: string): Promise<void>
  
  /**
   * 卸载样式
   * @param path 样式路径
   */
  unload?(path: string): void
}
