/**
 * Device Detector
 * 
 * 设备检测逻辑 - 框架无关
 */

/**
 * 设备类型
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'default'

/**
 * 设备信息
 */
export interface DeviceInfo {
  type: DeviceType
  width: number
  height: number
  userAgent: string
  isTouch: boolean
}

/**
 * 设备检测配置
 */
export interface DeviceDetectorConfig {
  /**
   * 移动设备的最大宽度（默认 768px）
   */
  mobileMaxWidth?: number
  
  /**
   * 平板设备的最大宽度（默认 1024px）
   */
  tabletMaxWidth?: number
  
  /**
   * 自定义检测函数
   */
  customDetect?: (info: DeviceInfo) => DeviceType
}

/**
 * 设备检测器
 */
export class DeviceDetector {
  private config: Required<DeviceDetectorConfig>
  private currentDevice: DeviceType = 'default'
  private listeners = new Set<(device: DeviceType) => void>()
  
  constructor(config: DeviceDetectorConfig = {}) {
    this.config = {
      mobileMaxWidth: config.mobileMaxWidth ?? 768,
      tabletMaxWidth: config.tabletMaxWidth ?? 1024,
      customDetect: config.customDetect ?? this.defaultDetect.bind(this),
    }
  }
  
  /**
   * 默认检测逻辑
   */
  private defaultDetect(info: DeviceInfo): DeviceType {
    const { width } = info
    
    if (width <= this.config.mobileMaxWidth) {
      return 'mobile'
    }
    
    if (width <= this.config.tabletMaxWidth) {
      return 'tablet'
    }
    
    return 'desktop'
  }
  
  /**
   * 获取设备信息（需要在浏览器环境中）
   */
  private getDeviceInfo(): DeviceInfo | null {
    if (typeof window === 'undefined') {
      return null
    }
    
    return {
      type: 'default',
      width: window.innerWidth,
      height: window.innerHeight,
      userAgent: navigator.userAgent,
      isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    }
  }
  
  /**
   * 检测当前设备
   */
  detect(): DeviceType {
    const info = this.getDeviceInfo()
    
    if (!info) {
      return 'default'
    }
    
    const detected = this.config.customDetect(info)
    
    if (detected !== this.currentDevice) {
      this.currentDevice = detected
      this.notifyListeners(detected)
    }
    
    return detected
  }
  
  /**
   * 获取当前设备类型
   */
  getCurrentDevice(): DeviceType {
    return this.currentDevice
  }
  
  /**
   * 监听设备变化
   */
  onChange(listener: (device: DeviceType) => void): () => void {
    this.listeners.add(listener)
    
    return () => {
      this.listeners.delete(listener)
    }
  }
  
  /**
   * 移除监听器
   */
  offChange(listener: (device: DeviceType) => void): void {
    this.listeners.delete(listener)
  }
  
  /**
   * 通知所有监听器
   */
  private notifyListeners(device: DeviceType): void {
    this.listeners.forEach(listener => listener(device))
  }
  
  /**
   * 启动自动检测（监听窗口大小变化）
   */
  startAutoDetect(debounceMs = 300): () => void {
    if (typeof window === 'undefined') {
      return () => {}
    }
    
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        this.detect()
      }, debounceMs)
    }
    
    window.addEventListener('resize', handleResize)
    
    // 初始检测
    this.detect()
    
    // 返回停止函数
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }
  
  /**
   * 清理资源
   */
  dispose(): void {
    this.listeners.clear()
  }
}

/**
 * 创建默认的设备检测器
 */
export function createDeviceDetector(config?: DeviceDetectorConfig): DeviceDetector {
  return new DeviceDetector(config)
}
