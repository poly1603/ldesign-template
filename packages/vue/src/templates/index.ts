/**
 * 内置模板注册表
 *
 * 支持两种模式：
 * 1. 开发模式：使用 import.meta.glob 动态扫描模板
 * 2. 生产模式/打包后：使用静态模板列表
 */
import type { TemplateMetadata } from '@ldesign/template-core'
import { TemplateScanner } from '../scanner'

/**
 * 缓存的模板列表
 */
let cachedTemplates: TemplateMetadata[] | null = null

/**
 * 尝试使用 TemplateScanner 动态扫描模板
 * 如果扫描器可用且能扫描到模板，则使用动态扫描结果
 *
 * @returns 扫描到的模板列表，如果扫描不可用则返回 null
 */
function tryDynamicScan(): TemplateMetadata[] | null {
  try {
    const scanner = new TemplateScanner()
    const templates = scanner.scan()
    if (templates.length > 0) {
      return templates
    }
  }
  catch (e) {
    // glob 在某些环境下不可用，忽略错误
  }
  return null
}

/**
 * 静态模板列表（作为回退方案）
 * 当 import.meta.glob 不可用时使用
 */
export const builtinTemplates: TemplateMetadata[] = [
  // ===== 桌面端模板 =====
  {
    id: 'login:desktop:default',
    category: 'login',
    device: 'desktop',
    name: 'default',
    displayName: '经典卡片',
    description: '居中卡片式布局，紫色渐变背景',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['card', 'gradient', 'center'],
    loader: () => import('./login/desktop/default/index.vue'),
  },
  {
    id: 'login:desktop:minimal',
    category: 'login',
    device: 'desktop',
    name: 'minimal',
    displayName: '简约分栏',
    description: '左右分栏布局，暗色品牌展示区',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['split', 'dark', 'brand'],
    loader: () => import('./login/desktop/minimal/index.vue'),
  },
  // ===== 平板端模板 =====
  {
    id: 'login:tablet:default',
    category: 'login',
    device: 'tablet',
    name: 'default',
    displayName: '渐变卡片',
    description: '带副标题的卡片式布局',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['card', 'subtitle', 'gradient'],
    loader: () => import('./login/tablet/default/index.vue'),
  },
  {
    id: 'login:tablet:minimal',
    category: 'login',
    device: 'tablet',
    name: 'minimal',
    displayName: '清新蓝调',
    description: '蓝色渐变背景，图标输入框',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['blue', 'icon', 'gradient'],
    loader: () => import('./login/tablet/minimal/index.vue'),
  },
  // ===== 移动端模板 =====
  {
    id: 'login:mobile:default',
    category: 'login',
    device: 'mobile',
    name: 'default',
    displayName: '渐变全屏',
    description: '渐变背景，简洁无标签设计',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['gradient', 'simple', 'fullscreen'],
    loader: () => import('./login/mobile/default/index.vue'),
  },
  {
    id: 'login:mobile:minimal',
    category: 'login',
    device: 'mobile',
    name: 'minimal',
    displayName: '暗夜极简',
    description: '暗色主题，极简设计风格',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['dark', 'minimal', 'night'],
    loader: () => import('./login/mobile/minimal/index.vue'),
  },
]

/**
 * 获取所有内置模板
 *
 * 优先使用 import.meta.glob 动态扫描，如果不可用则回退到静态列表
 *
 * @returns 内置模板列表
 */
export function getBuiltinTemplates(): TemplateMetadata[] {
  // 使用缓存
  if (cachedTemplates) {
    return cachedTemplates
  }

  // 尝试动态扫描
  const scanned = tryDynamicScan()
  if (scanned) {
    cachedTemplates = scanned
    return scanned
  }

  // 回退到静态列表
  cachedTemplates = builtinTemplates
  return builtinTemplates
}
