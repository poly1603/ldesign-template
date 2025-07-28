/**
 * 设备检测组合式函数
 */

import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { DeviceType, UseDeviceDetectorReturn } from '../types'
import { DeviceDetector } from '../utils'

/**
 * 设备检测组合式函数
 */
export function useDeviceDetector(): UseDeviceDetectorReturn {
  // 响应式状态
  const deviceType = ref<DeviceType>('desktop')
  const screenWidth = ref(0)
  const screenHeight = ref(0)

  // 计算属性
  const isMobile = computed(() => deviceType.value === 'mobile')
  const isTablet = computed(() => deviceType.value === 'tablet')
  const isDesktop = computed(() => deviceType.value === 'desktop')

  // 更新设备信息
  const updateDeviceInfo = () => {
    if (typeof window !== 'undefined') {
      screenWidth.value = window.innerWidth
      screenHeight.value = window.innerHeight
      const detector = DeviceDetector.getInstance()
      deviceType.value = detector.getCurrentDevice()
    }
  }

  // 设备变化监听器
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    // 初始化设备信息
    updateDeviceInfo()

    // 监听设备变化
    const detector = DeviceDetector.getInstance()
    unsubscribe = detector.addListener((newDeviceType: DeviceType) => {
      deviceType.value = newDeviceType
      updateDeviceInfo()
    })
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  // 计算屏幕方向
  const orientation = computed(() =>
    screenWidth.value > screenHeight.value ? 'landscape' : 'portrait'
  )
  const isLandscape = computed(() => orientation.value === 'landscape')
  const isPortrait = computed(() => orientation.value === 'portrait')

  // 触摸支持检测
  const supportTouch = ref(false)
  const maxTouchPoints = ref(0)

  // 设备信息
  const deviceInfo = ref<DeviceInfo>({
    type: deviceType.value,
    os: 'unknown',
    browser: 'unknown',
    version: 'unknown',
    screen: {
      width: screenWidth.value,
      height: screenHeight.value,
      pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      colorDepth: typeof window !== 'undefined' ? window.screen.colorDepth : 24
    },
    features: {
      touch: supportTouch.value,
      webgl: false,
      canvas: false,
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      indexedDB: typeof indexedDB !== 'undefined'
    },
    userAgent: {
      raw: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      browser: 'unknown',
      browserVersion: 'unknown',
      engine: 'unknown',
      engineVersion: 'unknown',
      os: 'unknown',
      osVersion: 'unknown',
      device: 'unknown',
      vendor: 'unknown',
      model: 'unknown'
    }
  })

  // 刷新设备信息
  const refresh = () => {
    updateDeviceInfo()
    if (typeof window !== 'undefined') {
      supportTouch.value = 'ontouchstart' in window
      maxTouchPoints.value = navigator.maxTouchPoints || 0
    }
  }

  // 获取断点
  const getBreakpoint = (width: number): DeviceType => {
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
    orientation,
    isLandscape,
    isPortrait,
    supportTouch,
    maxTouchPoints,
    deviceInfo,
    refresh,
    getBreakpoint
  }
}
