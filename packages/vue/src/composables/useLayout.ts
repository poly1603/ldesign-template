import type { Ref } from 'vue'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import type { DeviceType } from '../types/config'
import { useAutoDevice } from './useAutoDevice'

/**
 * 布局模式类型
 */
export type LayoutMode = 'admin' | 'portal' | 'dashboard' | 'blank'

/**
 * 布局状态接口
 */
export interface LayoutState {
  /** 布局模式 */
  mode: LayoutMode
  /** 侧边栏是否折叠 */
  siderCollapsed: boolean
  /** 侧边栏是否固定 */
  siderFixed: boolean
  /** 顶栏是否固定 */
  headerFixed: boolean
  /** 是否显示标签栏 */
  showTabs: boolean
  /** 是否显示面包屑 */
  showBreadcrumb: boolean
  /** 是否显示页脚 */
  showFooter: boolean
  /** 内容区是否全屏 */
  contentFullscreen: boolean
}

/**
 * useLayout 返回值类型
 */
export interface UseLayoutReturn {
  /** 布局模式 */
  layoutMode: Ref<LayoutMode>
  /** 侧边栏折叠状态 */
  siderCollapsed: Ref<boolean>
  /** 侧边栏固定状态 */
  siderFixed: Ref<boolean>
  /** 顶栏固定状态 */
  headerFixed: Ref<boolean>
  /** 是否显示标签栏 */
  showTabs: Ref<boolean>
  /** 是否显示面包屑 */
  showBreadcrumb: Ref<boolean>
  /** 是否显示页脚 */
  showFooter: Ref<boolean>
  /** 内容区全屏状态 */
  contentFullscreen: Ref<boolean>
  /** 当前设备类型 */
  deviceType: Readonly<Ref<DeviceType>>
  /** 是否为移动端 */
  isMobile: Readonly<Ref<boolean>>
  /** 切换侧边栏折叠状态 */
  toggleSider: () => void
  /** 设置侧边栏折叠状态 */
  setSiderCollapsed: (collapsed: boolean) => void
  /** 切换布局模式 */
  setLayoutMode: (mode: LayoutMode) => void
  /** 切换内容区全屏 */
  toggleFullscreen: () => void
  /** 重置布局状态 */
  resetLayout: () => void
  /** 获取完整布局状态 */
  getLayoutState: () => LayoutState
}

/**
 * useLayout 配置选项
 */
export interface UseLayoutOptions {
  /** 初始布局模式 @default 'admin' */
  defaultMode?: LayoutMode
  /** 侧边栏初始折叠状态 @default false */
  defaultSiderCollapsed?: boolean
  /** 移动端是否自动折叠侧边栏 @default true */
  autoCollapseMobile?: boolean
  /** 是否持久化布局状态 @default false */
  persist?: boolean
  /** 持久化存储键 @default 'ldesign:layout' */
  persistKey?: string
}

/** 默认配置 */
const DEFAULT_OPTIONS: Required<UseLayoutOptions> = {
  defaultMode: 'admin',
  defaultSiderCollapsed: false,
  autoCollapseMobile: true,
  persist: false,
  persistKey: 'ldesign:layout',
}

/**
 * 布局状态管理 Composable
 *
 * 管理整体布局状态，包括布局模式、侧边栏、顶栏等
 *
 * @param options - 配置选项
 * @returns 布局状态和操作方法
 *
 * @example
 * ```ts
 * const {
 *   layoutMode,
 *   siderCollapsed,
 *   toggleSider,
 *   isMobile
 * } = useLayout({ defaultMode: 'admin' })
 * ```
 */
export function useLayout(options: UseLayoutOptions = {}): UseLayoutReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // 使用自动设备检测
  const { deviceType, isMobile } = useAutoDevice()

  // 布局状态
  const layoutMode = ref<LayoutMode>(opts.defaultMode)
  const siderCollapsed = ref(opts.defaultSiderCollapsed)
  const siderFixed = ref(true)
  const headerFixed = ref(true)
  const showTabs = ref(true)
  const showBreadcrumb = ref(true)
  const showFooter = ref(true)
  const contentFullscreen = ref(false)

  // 从存储恢复状态
  const loadFromStorage = () => {
    if (!opts.persist || typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem(opts.persistKey)
      if (saved) {
        const state = JSON.parse(saved) as Partial<LayoutState>
        if (state.mode) layoutMode.value = state.mode
        if (typeof state.siderCollapsed === 'boolean') siderCollapsed.value = state.siderCollapsed
        if (typeof state.siderFixed === 'boolean') siderFixed.value = state.siderFixed
        if (typeof state.headerFixed === 'boolean') headerFixed.value = state.headerFixed
        if (typeof state.showTabs === 'boolean') showTabs.value = state.showTabs
        if (typeof state.showBreadcrumb === 'boolean') showBreadcrumb.value = state.showBreadcrumb
        if (typeof state.showFooter === 'boolean') showFooter.value = state.showFooter
      }
    }
    catch (e) {
      console.warn('加载布局状态失败:', e)
    }
  }

  // 保存状态到存储
  const saveToStorage = () => {
    if (!opts.persist || typeof localStorage === 'undefined') return
    try {
      const state: LayoutState = getLayoutState()
      localStorage.setItem(opts.persistKey, JSON.stringify(state))
    }
    catch (e) {
      console.warn('保存布局状态失败:', e)
    }
  }

  /** 切换侧边栏折叠状态 */
  const toggleSider = () => {
    siderCollapsed.value = !siderCollapsed.value
  }

  /** 设置侧边栏折叠状态 */
  const setSiderCollapsed = (collapsed: boolean) => {
    siderCollapsed.value = collapsed
  }

  /** 设置布局模式 */
  const setLayoutMode = (mode: LayoutMode) => {
    layoutMode.value = mode
  }

  /** 切换全屏模式 */
  const toggleFullscreen = () => {
    contentFullscreen.value = !contentFullscreen.value
  }

  /** 重置布局状态 */
  const resetLayout = () => {
    layoutMode.value = opts.defaultMode
    siderCollapsed.value = opts.defaultSiderCollapsed
    siderFixed.value = true
    headerFixed.value = true
    showTabs.value = true
    showBreadcrumb.value = true
    showFooter.value = true
    contentFullscreen.value = false
  }

  /** 获取完整布局状态 */
  const getLayoutState = (): LayoutState => ({
    mode: layoutMode.value,
    siderCollapsed: siderCollapsed.value,
    siderFixed: siderFixed.value,
    headerFixed: headerFixed.value,
    showTabs: showTabs.value,
    showBreadcrumb: showBreadcrumb.value,
    showFooter: showFooter.value,
    contentFullscreen: contentFullscreen.value,
  })

  // 监听移动端自动折叠
  if (opts.autoCollapseMobile) {
    watch(isMobile, (mobile) => {
      if (mobile) {
        siderCollapsed.value = true
      }
    })
  }

  // 监听状态变化并持久化
  if (opts.persist) {
    watch(
      [layoutMode, siderCollapsed, siderFixed, headerFixed, showTabs, showBreadcrumb, showFooter],
      () => saveToStorage(),
      { deep: true },
    )
  }

  // 初始化
  onMounted(() => {
    loadFromStorage()
  })

  return {
    layoutMode,
    siderCollapsed,
    siderFixed,
    headerFixed,
    showTabs,
    showBreadcrumb,
    showFooter,
    contentFullscreen,
    deviceType,
    isMobile,
    toggleSider,
    setSiderCollapsed,
    setLayoutMode,
    toggleFullscreen,
    resetLayout,
    getLayoutState,
  }
}

