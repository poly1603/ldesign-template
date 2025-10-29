/**
 * Device Detector
 * 
 * 设备类型检测 - 纯逻辑，框架无关
 */

export type DeviceType = 'desktop' | 'mobile' | 'tablet'

export interface DeviceDetectorOptions {
  /** 移动端断点 (default: 768) */
  mobileBreakpoint?: number
  /** 平板端断点 (default: 1024) */
  tabletBreakpoint?: number
  /** 自定义检测函数 */
  customDetector?: () => DeviceType
}

/**
 * 设备检测器
 */
export class DeviceDetector {
  private mobileBreakpoint: number
  private tabletBreakpoint: number
  private customDetector?: () => DeviceType
  private listeners = new Set<(device: DeviceType) => void>()
  private currentDevice: DeviceType | null = null
  private resizeObserver: ((this: Window, ev: UIEvent) => void) | null = null
  
  constructor(options: DeviceDetectorOptions = {}) {
    this.mobileBreakpoint = options.mobileBreakpoint ?? 768
    this.tabletBreakpoint = options.tabletBreakpoint ?? 1024
    this.customDetector = options.customDetector
  }
  
  /**
   * 检测当前设备类型
   */
  detect(): DeviceType {
    // 优先使用自定义检测
    if (this.customDetector) {
      return this.customDetector()
    }
    
    // SSR 环境
    if (typeof window === 'undefined') {
      return 'desktop'
    }
    
    // 基于窗口宽度检测
    const width = window.innerWidth
    
    if (width < this.mobileBreakpoint) {
      return 'mobile'
    }
    
    if (width < this.tabletBreakpoint) {
      return 'tablet'
    }
    
    return 'desktop'
  }
  
  /**
   * 监听设备变化
   * 
   * @returns 取消监听函数
   */
  observe(callback: (device: DeviceType) => void): () => void {
    this.listeners.add(callback)
    
    // 首次执行
    const device = this.detect()
    this.currentDevice = device
    callback(device)
    
    // 监听窗口大小变化
    if (typeof window !== 'undefined' && !this.resizeObserver) {
      this.resizeObserver = this.createResizeHandler()
      window.addEventListener('resize', this.resizeObserver)
    }
    
    // 返回取消监听函数
    return () => {
      this.listeners.delete(callback)
      
      // 如果没有监听者了，移除resize监听
      if (this.listeners.size === 0 && this.resizeObserver) {
        window.removeEventListener('resize', this.resizeObserver)
        this.resizeObserver = null
      }
    }
  }
  
  /**
   * 创建resize处理函数（带防抖）
   */
  private createResizeHandler(): (this: Window, ev: UIEvent) => void {
    let timer: ReturnType<typeof setTimeout> | null = null
    
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
      
      timer = setTimeout(() => {
        const newDevice = this.detect()
        
        // 仅当设备类型变化时通知
        if (newDevice !== this.currentDevice) {
          this.currentDevice = newDevice
          this.notify(newDevice)
        }
        
        timer = null
      }, 150) // 150ms 防抖
    }
  }
  
  /**
   * 通知所有监听者
   */
  private notify(device: DeviceType): void {
    this.listeners.forEach(listener => {
      try {
        listener(device)
      } catch (error) {
        console.error('[DeviceDetector] Listener error:', error)
      }
    })
  }
  
  /**
   * 清理
   */
  destroy(): void {
    if (this.resizeObserver) {
      window.removeEventListener('resize', this.resizeObserver)
      this.resizeObserver = null
    }
    this.listeners.clear()
    this.currentDevice = null
  }
}

/**
 * 创建设备检测器（便捷函数）
 */
export function createDeviceDetector(options?: DeviceDetectorOptions): DeviceDetector {
  return new DeviceDetector(options)
}
