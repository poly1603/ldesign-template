import type { Ref, ComputedRef } from 'vue'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useAutoDevice } from './useAutoDevice'

/**
 * 侧边栏状态接口
 */
export interface SiderState {
  /** 是否折叠 */
  collapsed: boolean
  /** 是否固定 */
  fixed: boolean
  /** 侧边栏宽度 */
  width: number
  /** 折叠后宽度 */
  collapsedWidth: number
  /** 是否显示 */
  visible: boolean
}

/**
 * useSider 返回值类型
 */
export interface UseSiderReturn {
  /** 是否折叠 */
  collapsed: Ref<boolean>
  /** 是否固定 */
  fixed: Ref<boolean>
  /** 侧边栏宽度 */
  width: Ref<number>
  /** 折叠后宽度 */
  collapsedWidth: Ref<number>
  /** 是否显示（移动端可通过此属性控制抽屉） */
  visible: Ref<boolean>
  /** 实际显示宽度（根据折叠状态计算） */
  actualWidth: ComputedRef<number>
  /** 是否为移动端抽屉模式 */
  isDrawerMode: ComputedRef<boolean>
  /** 切换折叠状态 */
  toggle: () => void
  /** 设置折叠状态 */
  setCollapsed: (value: boolean) => void
  /** 显示侧边栏（移动端） */
  show: () => void
  /** 隐藏侧边栏（移动端） */
  hide: () => void
  /** 切换显示状态（移动端） */
  toggleVisible: () => void
}

/**
 * useSider 配置选项
 */
export interface UseSiderOptions {
  /** 初始折叠状态 @default false */
  defaultCollapsed?: boolean
  /** 侧边栏宽度 @default 240 */
  width?: number
  /** 折叠后宽度 @default 64 */
  collapsedWidth?: number
  /** 移动端断点（小于此宽度自动切换为抽屉模式） @default 768 */
  mobileBreakpoint?: number
  /** 移动端是否默认隐藏 @default true */
  hideOnMobile?: boolean
  /** 切换时是否启用过渡动画 @default true */
  transition?: boolean
}

/** 默认配置 */
const DEFAULT_OPTIONS: Required<UseSiderOptions> = {
  defaultCollapsed: false,
  width: 240,
  collapsedWidth: 64,
  mobileBreakpoint: 768,
  hideOnMobile: true,
  transition: true,
}

/**
 * 侧边栏控制 Composable
 *
 * 专门管理侧边栏的状态和行为，支持折叠、固定、移动端抽屉模式等
 *
 * @param options - 配置选项
 * @returns 侧边栏状态和操作方法
 *
 * @example
 * ```ts
 * const { collapsed, toggle, actualWidth, isDrawerMode } = useSider({
 *   width: 260,
 *   collapsedWidth: 80,
 * })
 * ```
 */
export function useSider(options: UseSiderOptions = {}): UseSiderReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // 使用自动设备检测
  const { isMobile } = useAutoDevice()

  // 侧边栏状态
  const collapsed = ref(opts.defaultCollapsed)
  const fixed = ref(true)
  const width = ref(opts.width)
  const collapsedWidth = ref(opts.collapsedWidth)
  const visible = ref(!opts.hideOnMobile || !isMobile.value)

  // 计算实际宽度
  const actualWidth = computed(() => {
    if (isMobile.value) {
      return visible.value ? opts.width : 0
    }
    return collapsed.value ? opts.collapsedWidth : opts.width
  })

  // 是否为抽屉模式（移动端）
  const isDrawerMode = computed(() => isMobile.value)

  /** 切换折叠状态 */
  const toggle = () => {
    if (isMobile.value) {
      toggleVisible()
    }
    else {
      collapsed.value = !collapsed.value
    }
  }

  /** 设置折叠状态 */
  const setCollapsed = (value: boolean) => {
    collapsed.value = value
  }

  /** 显示侧边栏（移动端抽屉） */
  const show = () => {
    visible.value = true
  }

  /** 隐藏侧边栏（移动端抽屉） */
  const hide = () => {
    visible.value = false
  }

  /** 切换显示状态 */
  const toggleVisible = () => {
    visible.value = !visible.value
  }

  // 监听设备变化，移动端自动折叠/隐藏
  watch(isMobile, (mobile) => {
    if (mobile && opts.hideOnMobile) {
      visible.value = false
      collapsed.value = true
    }
    else {
      visible.value = true
    }
  })

  return {
    collapsed,
    fixed,
    width,
    collapsedWidth,
    visible,
    actualWidth,
    isDrawerMode,
    toggle,
    setCollapsed,
    show,
    hide,
    toggleVisible,
  }
}

