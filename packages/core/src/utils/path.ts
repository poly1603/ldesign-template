import type { DeviceType } from '../types'

/**
 * 路径解析结果
 */
export interface ParsedPath {
  category: string
  device: DeviceType
  name: string
}

/**
 * 从路径解析模板信息
 * 路径格式: ../templates/{category}/{device}/{name}/index.vue
 * 或: templates/{category}/{device}/{name}/
 */
export function parsePath(path: string): ParsedPath | null {
  // 匹配模式: templates/category/device/name/
  const regex = /templates\/([^/]+)\/([^/]+)\/([^/]+)\//
  const match = path.match(regex)

  if (!match) {
    return null
  }

  const [, category, device, name] = match

  // 验证设备类型
  if (!isValidDevice(device)) {
    return null
  }

  return {
    category,
    device: device as DeviceType,
    name,
  }
}

/**
 * 生成模板 ID
 * 格式: {category}:{device}:{name}
 */
export function generateTemplateId(
  category: string,
  device: DeviceType,
  name: string
): string {
  return `${category}:${device}:${name}`
}

/**
 * 解析模板 ID
 * 格式: {category}:{device}:{name}
 */
export function parseTemplateId(id: string): ParsedPath | null {
  const parts = id.split(':')
  
  if (parts.length !== 3) {
    return null
  }

  const [category, device, name] = parts

  if (!isValidDevice(device)) {
    return null
  }

  return {
    category,
    device: device as DeviceType,
    name,
  }
}

/**
 * 验证设备类型
 */
export function isValidDevice(device: string): device is DeviceType {
  return device === 'desktop' || device === 'mobile' || device === 'tablet'
}

/**
 * 规范化路径（移除多余的斜杠和点）
 */
export function normalizePath(path: string): string {
  return path
    .replace(/\\/g, '/') // 将反斜杠转为正斜杠
    .replace(/\/+/g, '/') // 移除连续的斜杠
    .replace(/^\.\//, '') // 移除开头的 ./
}