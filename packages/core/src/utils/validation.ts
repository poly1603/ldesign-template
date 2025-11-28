import type { TemplateMetadata, TemplateConfig } from '../types'

/**
 * 验证模板元数据是否完整
 */
export function validateTemplateMetadata(
  metadata: Partial<TemplateMetadata>
): metadata is TemplateMetadata {
  if (!metadata.id || typeof metadata.id !== 'string') {
    console.error('模板元数据缺少有效的 id')
    return false
  }

  if (!metadata.category || typeof metadata.category !== 'string') {
    console.error(`模板 ${metadata.id} 缺少有效的 category`)
    return false
  }

  if (!metadata.device || !['desktop', 'mobile', 'tablet'].includes(metadata.device)) {
    console.error(`模板 ${metadata.id} 缺少有效的 device`)
    return false
  }

  if (!metadata.name || typeof metadata.name !== 'string') {
    console.error(`模板 ${metadata.id} 缺少有效的 name`)
    return false
  }

  if (!metadata.path || typeof metadata.path !== 'string') {
    console.error(`模板 ${metadata.id} 缺少有效的 path`)
    return false
  }

  return true
}

/**
 * 验证模板配置是否有效
 */
export function validateTemplateConfig(
  config: Partial<TemplateConfig>
): config is TemplateConfig {
  if (!config.name || typeof config.name !== 'string') {
    console.error('模板配置缺少有效的 name')
    return false
  }

  return true
}

/**
 * 验证模板 ID 格式
 * 格式: {category}:{device}:{name}
 */
export function isValidTemplateId(id: string): boolean {
  const parts = id.split(':')
  
  if (parts.length !== 3) {
    return false
  }

  const [category, device, name] = parts

  // 检查各部分是否为非空字符串
  if (!category || !device || !name) {
    return false
  }

  // 检查设备类型是否有效
  if (!['desktop', 'mobile', 'tablet'].includes(device)) {
    return false
  }

  return true
}