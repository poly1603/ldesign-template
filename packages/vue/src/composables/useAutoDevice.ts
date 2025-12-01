import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { DeviceType } from '../types/config'
import { getBreakpoints } from '../plugin/template-config-context'

/**
 * useAutoDevice 返回值类型
 */
export interface UseAutoDeviceReturn {
  /** 当前设备类型（响应式） */
  deviceType: Readonly<Ref<DeviceType>>
  /** 是否为移动端 */
  isMobile: Readonly<Ref<boolean>>
  /** 是否为平板端 */
  isTablet: Readonly<Ref<boolean>>
  /** 是否为桌面端 */
  isDesktop: Readonly<Ref<boolean>>
  /** 手动刷新设备类型 */
  refresh: () => void
}

/**
 * useAutoDevice 配置选项
 */
export interface UseAutoDeviceOptions {
  /** 自定义断点配置（覆盖全局配置） */
  breakpoints?: {
    mobile?: number
    tablet?: number
  }
  /** 是否启用自动监听窗口变化 @default true */
  enableResize?: boolean
  /** 防抖延迟（毫秒） @default 100 */
  debounceDelay?: number
}

/**
 * 自动设备检测 Composable
 *
 * 用于模板系统内部的设备类型检测，支持响应式监听窗口变化
 * 会自动使用模板插件配置的断点，也支持自定义断点
 *
 * @param options - 配置选项
 * @returns 设备检测相关的响应式数据和方法
 *
 * @example
 * ```ts
 * // 基本用法
 * const { deviceType, isMobile } = useAutoDevice()
 *
 * // 自定义断点
 * const { deviceType } = useAutoDevice({
 *   breakpoints: { mobile: 640, tablet: 1024 }
 * })
 * ```
 */
export function useAutoDevice(options: UseAutoDeviceOptions = {}): UseAutoDeviceReturn {
  const {
    breakpoints: customBreakpoints,
    enableResize = true,
    debounceDelay = 100,
  } = options

  // 获取断点配置（优先使用自定义，其次使用全局配置）
  const getEffectiveBreakpoints = () => {
    const globalBreakpoints = getBreakpoints()
    return {
      mobile: customBreakpoints?.mobile ?? globalBreakpoints.mobile,
      tablet: customBreakpoints?.tablet ?? globalBreakpoints.tablet,
    }
  }

  // 根据宽度计算设备类型
  const calculateDeviceType = (width: number): DeviceType => {
    const bp = getEffectiveBreakpoints()
    if (width < bp.mobile) return 'mobile'
    if (width < bp.tablet) return 'tablet'
    return 'desktop'
  }

  // 响应式状态
  const deviceType = ref<DeviceType>('desktop')

  // 计算属性
  const isMobile = computed(() => deviceType.value === 'mobile')
  const isTablet = computed(() => deviceType.value === 'tablet')
  const isDesktop = computed(() => deviceType.value === 'desktop')

  // 防抖定时器
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * 刷新设备类型
   */
  const refresh = () => {
    if (typeof window === 'undefined') return
    const newType = calculateDeviceType(window.innerWidth)
    if (deviceType.value !== newType) {
      deviceType.value = newType
    }
  }

  /**
   * 带防抖的刷新
   */
  const debouncedRefresh = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      refresh()
      debounceTimer = null
    }, debounceDelay)
  }

  // 组件挂载时初始化
  onMounted(() => {
    // 初始检测
    refresh()

    // 监听窗口大小变化
    if (enableResize && typeof window !== 'undefined') {
      window.addEventListener('resize', debouncedRefresh)
    }
  })

  // 组件卸载时清理
  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', debouncedRefresh)
    }
  })

  return {
    deviceType: computed(() => deviceType.value),
    isMobile: computed(() => isMobile.value),
    isTablet: computed(() => isTablet.value),
    isDesktop: computed(() => isDesktop.value),
    refresh,
  }
}

/**
 * 获取当前设备类型（非响应式，一次性调用）
 *
 * 适用于不需要响应式监听的场景
 *
 * @param breakpoints - 可选的自定义断点配置
 * @returns 当前设备类型
 */
export function getCurrentDeviceType(breakpoints?: { mobile?: number, tablet?: number }): DeviceType {
  if (typeof window === 'undefined') return 'desktop'

  const globalBreakpoints = getBreakpoints()
  const bp = {
    mobile: breakpoints?.mobile ?? globalBreakpoints.mobile,
    tablet: breakpoints?.tablet ?? globalBreakpoints.tablet,
  }

  const width = window.innerWidth
  if (width < bp.mobile) return 'mobile'
  if (width < bp.tablet) return 'tablet'
  return 'desktop'
}

