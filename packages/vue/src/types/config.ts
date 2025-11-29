/**
 * 模板插件配置类型定义
 *
 * @module types/config
 */
import type { Component } from 'vue'
import type { TemplateMetadata } from '@ldesign/template-core'

/** 设备类型 */
export type DeviceType = 'desktop' | 'tablet' | 'mobile'

/**
 * 模板切换信息
 * 用于 onTemplateChange 回调，包含完整的切换上下文
 */
export interface TemplateChangeInfo {
  /** 模板分类（如 'login', 'dashboard'） */
  category: string
  /** 设备类型 */
  device: DeviceType
  /** 模板名称（如 'default', 'minimal'） */
  templateName: string
  /** 完整模板ID（如 'login:desktop:default'） */
  templateId: string
  /** 完整模板元数据 */
  template: TemplateMetadata
  /** 之前使用的模板（首次加载时为 undefined） */
  previousTemplate?: TemplateMetadata
  /** 切换时间戳（毫秒） */
  timestamp: number
  /** 切换来源 */
  source: 'user' | 'auto' | 'cache' | 'default'
}

/**
 * 设备模板配置
 * 定义单个设备类型的模板配置
 */
export interface DeviceTemplateConfig {
  /** 默认模板名称，false/null 表示禁用该设备 */
  default?: string | false | null
  /** 是否启用该设备 @default true */
  enabled?: boolean
}

/**
 * 分类模板配置
 * 定义单个分类（如 login）的完整配置
 */
export interface CategoryTemplateConfig {
  /** 各设备默认模板配置 */
  defaults?: {
    desktop?: string | false | null
    tablet?: string | false | null
    mobile?: string | false | null
  }
  /** 禁用时显示的自定义组件 */
  disabledComponent?: Component
  /** 禁用时显示的消息（支持函数动态生成） */
  disabledMessage?: string | ((device: DeviceType, category: string) => string)
  /** 禁用时的图标 */
  disabledIcon?: string
}

/**
 * 模板选择器配置
 */
export interface TemplateSelectorConfig {
  /** 是否启用选择器 @default true */
  enabled?: boolean
  /** 选择器位置 @default 'top-right' */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** 自定义过滤函数，过滤可选模板列表 */
  filter?: (templates: TemplateMetadata[], category: string, device: DeviceType) => TemplateMetadata[]
  /** 选择器组件的额外 props */
  props?: Record<string, unknown>
  /** 是否显示预览 @default true */
  showPreview?: boolean
  /** 是否显示描述 @default true */
  showDescription?: boolean
  /** 是否显示标签 @default true */
  showTags?: boolean
}

/**
 * 模板缓存配置
 */
export interface TemplateCacheConfig {
  /** 是否启用缓存 @default true */
  enabled?: boolean
  /** 缓存键前缀 @default 'ldesign:template:' */
  keyPrefix?: string
  /** 存储类型 @default 'localStorage' */
  storage?: 'localStorage' | 'sessionStorage' | 'memory'
  /** 过期时间（毫秒），0 表示永不过期 @default 0 */
  ttl?: number
  /** 是否按用户隔离缓存（需要提供 getUserId） */
  perUser?: boolean
  /** 获取用户ID的函数（用于按用户隔离缓存） */
  getUserId?: () => string | undefined
}

/**
 * 设备断点配置
 */
export interface BreakpointConfig {
  /** 移动端最大宽度 @default 768 */
  mobile?: number
  /** 平板端最大宽度 @default 1024 */
  tablet?: number
}

/**
 * 完整的模板配置
 * 在 createTemplateEnginePlugin 中使用
 */
export interface TemplateConfig {
  /** 分类模板配置 */
  categories?: Record<string, CategoryTemplateConfig>
  /** 模板选择器配置 */
  selector?: TemplateSelectorConfig
  /** 缓存配置 */
  cache?: TemplateCacheConfig
  /** 设备断点配置 */
  breakpoints?: BreakpointConfig
  /** 模板切换回调 */
  onTemplateChange?: (info: TemplateChangeInfo) => void | Promise<void>
}

