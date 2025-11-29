/**
 * 模板配置上下文
 *
 * 管理模板插件配置的存储和访问
 *
 * @module plugin/template-config-context
 */
import type {
  BreakpointConfig,
  CategoryTemplateConfig,
  DeviceType,
  TemplateConfig,
  TemplateCacheConfig,
  TemplateChangeInfo,
  TemplateSelectorConfig,
} from '../types/config'

/** 全局配置实例 */
let globalConfig: TemplateConfig | null = null

/** 默认断点配置 */
const DEFAULT_BREAKPOINTS: Required<BreakpointConfig> = {
  mobile: 768,
  tablet: 1024,
}

/** 默认缓存配置 */
const DEFAULT_CACHE_CONFIG: Required<Omit<TemplateCacheConfig, 'getUserId'>> = {
  enabled: true,
  keyPrefix: 'ldesign:template:',
  storage: 'localStorage',
  ttl: 0,
  perUser: false,
}

/** 默认选择器配置 */
const DEFAULT_SELECTOR_CONFIG: Required<Omit<TemplateSelectorConfig, 'filter' | 'props'>> = {
  enabled: true,
  position: 'top-right',
  showPreview: true,
  showDescription: true,
  showTags: true,
}

/**
 * 设置全局模板配置
 */
export function setTemplateConfig(config: TemplateConfig | null): void {
  globalConfig = config
}

/**
 * 获取全局模板配置
 */
export function getTemplateConfig(): TemplateConfig | null {
  return globalConfig
}

/**
 * 检查是否有模板配置
 */
export function hasTemplateConfig(): boolean {
  return globalConfig !== null
}

/**
 * 获取分类配置
 */
export function getCategoryConfig(category: string): CategoryTemplateConfig | undefined {
  return globalConfig?.categories?.[category]
}

/**
 * 获取某分类某设备的默认模板名称
 * @returns 模板名称，或 false/null 表示禁用
 */
export function getDefaultTemplateName(
  category: string,
  device: DeviceType,
): string | false | null | undefined {
  const categoryConfig = getCategoryConfig(category)
  if (!categoryConfig?.defaults) {
    return undefined // 未配置，使用系统默认
  }
  return categoryConfig.defaults[device]
}

/**
 * 检查某分类某设备是否被禁用
 */
export function isDeviceDisabled(category: string, device: DeviceType): boolean {
  const defaultName = getDefaultTemplateName(category, device)
  return defaultName === false || defaultName === null
}

/**
 * 获取禁用时的提示消息
 */
export function getDisabledMessage(category: string, device: DeviceType): string {
  const categoryConfig = getCategoryConfig(category)
  const customMessage = categoryConfig?.disabledMessage

  if (typeof customMessage === 'function') {
    return customMessage(device, category)
  }

  if (typeof customMessage === 'string') {
    return customMessage
  }

  // 默认消息
  const deviceNames: Record<DeviceType, string> = {
    desktop: '桌面端',
    tablet: '平板端',
    mobile: '移动端',
  }
  return `当前 ${category} 模板不支持在${deviceNames[device]}中使用`
}

/**
 * 获取断点配置
 */
export function getBreakpoints(): Required<BreakpointConfig> {
  return {
    ...DEFAULT_BREAKPOINTS,
    ...globalConfig?.breakpoints,
  }
}

/**
 * 获取缓存配置
 */
export function getCacheConfig(): Required<Omit<TemplateCacheConfig, 'getUserId'>> & Pick<TemplateCacheConfig, 'getUserId'> {
  return {
    ...DEFAULT_CACHE_CONFIG,
    ...globalConfig?.cache,
  }
}

/**
 * 获取选择器配置
 */
export function getSelectorConfig(): Required<Omit<TemplateSelectorConfig, 'filter' | 'props'>> & Pick<TemplateSelectorConfig, 'filter' | 'props'> {
  return {
    ...DEFAULT_SELECTOR_CONFIG,
    ...globalConfig?.selector,
  }
}

/**
 * 触发模板切换回调
 */
export async function triggerTemplateChange(info: TemplateChangeInfo): Promise<void> {
  if (globalConfig?.onTemplateChange) {
    await globalConfig.onTemplateChange(info)
  }
}

