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

  // ===== 布局模板 - 桌面端 =====
  {
    id: 'layout:desktop:sidebar',
    category: 'layout',
    device: 'desktop',
    name: 'sidebar',
    displayName: '经典侧边栏布局',
    description: '左侧边栏 + 顶栏 + 内容区，适合大多数后台管理系统',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['sidebar', 'classic', 'admin'],
    loader: () => import('./layout/desktop/sidebar/index.vue'),
  },
  {
    id: 'layout:desktop:top-menu',
    category: 'layout',
    device: 'desktop',
    name: 'top-menu',
    displayName: '顶部菜单布局',
    description: '顶部水平导航 + 内容区，适合菜单项较少的系统',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['top-menu', 'horizontal', 'navbar'],
    loader: () => import('./layout/desktop/top-menu/index.vue'),
  },
  {
    id: 'layout:desktop:mix',
    category: 'layout',
    device: 'desktop',
    name: 'mix',
    displayName: '混合布局',
    description: '顶部一级导航 + 左侧二级导航，适合大型后台系统',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['mix', 'hybrid', 'two-level'],
    loader: () => import('./layout/desktop/mix/index.vue'),
  },
  {
    id: 'layout:desktop:dual-column',
    category: 'layout',
    device: 'desktop',
    name: 'dual-column',
    displayName: '双栏布局',
    description: '图标栏 + 菜单栏 + 内容区，VS Code 风格',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['dual-column', 'vscode', 'icon-bar'],
    loader: () => import('./layout/desktop/dual-column/index.vue'),
  },

  // ===== 布局模板 - 平板端 =====
  {
    id: 'layout:tablet:sidebar',
    category: 'layout',
    device: 'tablet',
    name: 'sidebar',
    displayName: '可折叠侧边栏布局',
    description: '可折叠侧边栏 + 顶栏，默认折叠状态，适合平板设备',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['sidebar', 'collapsible', 'tablet'],
    loader: () => import('./layout/tablet/sidebar/index.vue'),
  },
  {
    id: 'layout:tablet:drawer',
    category: 'layout',
    device: 'tablet',
    name: 'drawer',
    displayName: '抽屉式布局',
    description: '抽屉式侧边栏 + 顶栏，点击触发滑出',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['drawer', 'slide', 'tablet'],
    loader: () => import('./layout/tablet/drawer/index.vue'),
  },
  {
    id: 'layout:tablet:top-menu',
    category: 'layout',
    device: 'tablet',
    name: 'top-menu',
    displayName: '顶部菜单布局',
    description: '顶部水平导航 + 内容区，适合菜单项较少的应用',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['top-menu', 'horizontal', 'tablet'],
    loader: () => import('./layout/tablet/top-menu/index.vue'),
  },

  // ===== 布局模板 - 移动端 =====
  {
    id: 'layout:mobile:tab-bar',
    category: 'layout',
    device: 'mobile',
    name: 'tab-bar',
    displayName: '底部导航布局',
    description: '顶栏 + 内容区 + 底部 Tab 栏，iOS/Android 风格',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['tab-bar', 'bottom-nav', 'mobile'],
    loader: () => import('./layout/mobile/tab-bar/index.vue'),
  },
  {
    id: 'layout:mobile:drawer',
    category: 'layout',
    device: 'mobile',
    name: 'drawer',
    displayName: '抽屉式布局',
    description: '汉堡菜单 + 抽屉式侧边栏，适合菜单项较多的应用',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['drawer', 'hamburger', 'mobile'],
    loader: () => import('./layout/mobile/drawer/index.vue'),
  },
  {
    id: 'layout:mobile:top-menu',
    category: 'layout',
    device: 'mobile',
    name: 'top-menu',
    displayName: '顶部导航布局',
    description: '顶部下拉菜单 + 内容区，简洁轻量',
    author: 'ldesign',
    version: '1.0.0',
    tags: ['top-menu', 'dropdown', 'mobile'],
    loader: () => import('./layout/mobile/top-menu/index.vue'),
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
