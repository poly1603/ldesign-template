/**
 * 设备检测组合式函数
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { UseDeviceDetectorReturn, DeviceType } from '../types'
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
      deviceType.value = DeviceDetector.detect()
    }
  }

  // 设备变化监听器
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    // 初始化设备信息
    updateDeviceInfo()

    // 监听设备变化
    unsubscribe = DeviceDetector.onDeviceChange((newDeviceType) => {
      deviceType.value = newDeviceType
      updateDeviceInfo()
    })
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight
  }
}