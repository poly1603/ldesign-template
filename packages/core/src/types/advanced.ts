/**
 * @ldesign/template-core - Advanced TypeScript Types
 * 高级类型定义，包含泛型、类型守卫、工具类型等
 */

import type { DeviceType, TemplateMetadata, TemplateConfig } from './template'

// ============================================================================
// 泛型类型定义
// ============================================================================

/**
 * 模板加载器泛型接口
 * @template T - 模板组件类型
 * @template P - 模板属性类型
 */
export interface TemplateLoader<T = any, P = Record<string, any>> {
  (): Promise<{
    default: T
    props?: P
    metadata?: Partial<TemplateMetadata>
  }>
}

/**
 * 模板实例泛型接口
 * @template T - 模板组件类型
 * @template P - 模板属性类型
 */
export interface TemplateInstance<T = any, P = Record<string, any>> {
  id: string
  component: T
  props: P
  metadata: TemplateMetadata
  loading: boolean
  error: Error | null
}

/**
 * 模板注册选项泛型接口
 * @template T - 模板组件类型
 * @template P - 模板属性类型
 */
export interface TemplateRegisterOptions<T = any, P = Record<string, any>> {
  metadata: TemplateMetadata
  loader: TemplateLoader<T, P>
  config?: TemplateConfig
  validator?: (props: P) => boolean
}

// ============================================================================
// 工具类型
// ============================================================================

/**
 * 深度只读类型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? readonly U[]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

/**
 * 深度部分类型
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}

/**
 * 必需字段类型
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * 可选字段类型
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * 排除函数属性
 */
export type ExcludeFunctions<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

/**
 * 提取函数属性
 */
export type ExtractFunctions<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K]
}

/**
 * 字符串字面量联合类型
 */
export type StringLiteral<T> = T extends string ? T : never

/**
 * 模板ID类型（品牌类型）
 */
export type TemplateId = string & { __brand: 'TemplateId' }

/**
 * 模板分类类型（品牌类型）
 */
export type TemplateCategory = string & { __brand: 'TemplateCategory' }

// ============================================================================
// 高级接口定义
// ============================================================================

/**
 * 模板版本信息接口
 */
export interface TemplateVersion {
  version: string
  releaseDate: Date
  changelog?: string
  deprecated?: boolean
  breaking?: boolean
  migration?: () => Promise<void>
}

/**
 * 模板权限接口
 */
export interface TemplatePermission {
  role: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
  conditions?: Record<string, any>
}

/**
 * 模板性能指标接口
 */
export interface TemplateMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  cacheHitRate: number
  errorRate: number
  timestamp: number
}

/**
 * A/B测试变体接口
 */
export interface TemplateVariant {
  id: string
  templateId: string
  weight: number
  metadata?: Partial<TemplateMetadata>
  metrics?: TemplateMetrics
}

/**
 * 实验配置接口
 */
export interface ExperimentConfig {
  id: string
  name: string
  description?: string
  variants: TemplateVariant[]
  startDate: Date
  endDate?: Date
  status: 'draft' | 'running' | 'paused' | 'completed'
  targetAudience?: {
    percentage: number
    segments?: string[]
    userIds?: string[]
  }
}

/**
 * 缓存策略接口
 */
export interface CacheStrategy {
  type: 'lru' | 'lfu' | 'fifo' | 'ttl'
  maxSize?: number
  ttl?: number
  storage?: 'memory' | 'indexeddb' | 'localstorage' | 'sessionStorage'
  serialize?: (data: any) => string
  deserialize?: (data: string) => any
}

/**
 * 模板生命周期钩子
 */
export interface TemplateLifecycleHooks {
  beforeLoad?: () => void | Promise<void>
  afterLoad?: (metadata: TemplateMetadata) => void | Promise<void>
  beforeRender?: (props: any) => void | Promise<void>
  afterRender?: (instance: any) => void | Promise<void>
  beforeUnmount?: () => void | Promise<void>
  afterUnmount?: () => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

// ============================================================================
// 类型守卫函数
// ============================================================================

/**
 * 检查是否为有效的设备类型
 */
export function isDeviceType(value: any): value is DeviceType {
  return ['desktop', 'mobile', 'tablet'].includes(value)
}

/**
 * 检查是否为有效的模板元数据
 */
export function isTemplateMetadata(value: any): value is TemplateMetadata {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.category === 'string' &&
    isDeviceType(value.device) &&
    typeof value.name === 'string' &&
    typeof value.path === 'string'
  )
}

/**
 * 检查是否为有效的模板配置
 */
export function isTemplateConfig(value: any): value is TemplateConfig {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.name === 'string'
  )
}

/**
 * 检查是否为模板加载器
 */
export function isTemplateLoader(value: any): value is TemplateLoader {
  return typeof value === 'function'
}

/**
 * 检查是否为有效的模板ID格式
 */
export function isValidTemplateId(id: string): id is TemplateId {
  const pattern = /^[a-z0-9-]+:[a-z]+:[a-z0-9-]+$/
  return pattern.test(id)
}

// ============================================================================
// 类型推导助手
// ============================================================================

/**
 * 从模板元数据推导属性类型
 */
export type InferTemplateProps<T extends TemplateMetadata> = T['props'] extends Record<string, any>
  ? T['props']
  : Record<string, any>

/**
 * 从加载器推导组件类型
 */
export type InferComponentType<T extends TemplateLoader> = T extends TemplateLoader<infer C, any>
  ? C
  : never

/**
 * 从加载器推导属性类型
 */
export type InferPropsType<T extends TemplateLoader> = T extends TemplateLoader<any, infer P>
  ? P
  : never

// ============================================================================
// 条件类型
// ============================================================================

/**
 * 如果T是U的子类型，返回X，否则返回Y
 */
export type IfEquals<T, U, X = T, Y = never> = (<G>() => G extends T ? 1 : 2) extends (<G>() => G extends U ? 1 : 2) ? X : Y

/**
 * 检查类型是否为any
 */
export type IsAny<T> = 0 extends (1 & T) ? true : false

/**
 * 检查类型是否为unknown
 */
export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false

/**
 * 检查类型是否为never
 */
export type IsNever<T> = [T] extends [never] ? true : false

// ============================================================================
// 映射类型
// ============================================================================

/**
 * 模板注册表类型
 */
export type TemplateRegistry<T extends Record<string, TemplateMetadata> = Record<string, TemplateMetadata>> = {
  [K in keyof T]: T[K]
}

/**
 * 模板加载器映射
 */
export type TemplateLoaderMap<T extends Record<string, any> = Record<string, any>> = {
  [K in keyof T]: TemplateLoader<T[K], any>
}

// ============================================================================
// 事件类型
// ============================================================================

/**
 * 模板事件类型
 */
export interface TemplateEvents {
  'template:register': { metadata: TemplateMetadata }
  'template:unregister': { id: string }
  'template:load': { id: string }
  'template:loaded': { id: string; metadata: TemplateMetadata }
  'template:error': { id: string; error: Error }
  'template:render': { id: string; props: any }
  'template:rendered': { id: string; instance: any }
  'template:cache:hit': { id: string }
  'template:cache:miss': { id: string }
  'template:cache:evict': { id: string }
}

/**
 * 事件处理器类型
 */
export type TemplateEventHandler<E extends keyof TemplateEvents> = (
  payload: TemplateEvents[E]
) => void | Promise<void>

/**
 * 事件发射器接口
 */
export interface TemplateEventEmitter {
  on<E extends keyof TemplateEvents>(event: E, handler: TemplateEventHandler<E>): void
  off<E extends keyof TemplateEvents>(event: E, handler: TemplateEventHandler<E>): void
  emit<E extends keyof TemplateEvents>(event: E, payload: TemplateEvents[E]): void
  once<E extends keyof TemplateEvents>(event: E, handler: TemplateEventHandler<E>): void
}

// ============================================================================
// 验证器类型
// ============================================================================

/**
 * 验证规则
 */
export interface ValidationRule<T = any> {
  validator: (value: T) => boolean | Promise<boolean>
  message?: string | ((value: T) => string)
}

/**
 * 验证结果
 */
export interface ValidationResult {
  valid: boolean
  errors?: string[]
  warnings?: string[]
}

/**
 * 模板验证器
 */
export interface TemplateValidator<P = any> {
  rules: ValidationRule<P>[]
  validate(props: P): ValidationResult | Promise<ValidationResult>
}

// ============================================================================
// 异步类型
// ============================================================================

/**
 * 异步数据包装器
 */
export interface AsyncData<T, E = Error> {
  data: T | null
  loading: boolean
  error: E | null
  refresh: () => Promise<void>
}

/**
 * Promise-like 类型
 */
export type Awaitable<T> = T | Promise<T>

/**
 * 异步函数类型
 */
export type AsyncFunction<T = any, R = any> = (...args: T[]) => Promise<R>

// ============================================================================
// 导出类型别名
// ============================================================================

/**
 * 模板映射表
 */
export type TemplateMap = Map<string, TemplateMetadata>

/**
 * 模板记录
 */
export type TemplateRecord = Record<string, TemplateMetadata>

/**
 * 模板数组
 */
export type TemplateArray = TemplateMetadata[]

/**
 * 模板过滤器
 */
export type TemplateFilter = (template: TemplateMetadata) => boolean

/**
 * 模板排序器
 */
export type TemplateSorter = (a: TemplateMetadata, b: TemplateMetadata) => number

/**
 * 模板转换器
 */
export type TemplateTransformer = (template: TemplateMetadata) => TemplateMetadata