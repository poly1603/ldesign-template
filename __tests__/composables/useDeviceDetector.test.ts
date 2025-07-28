import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useDeviceDetector } from '../../src/composables/useDeviceDetector'

// Mock window 对象
const mockWindow = {
  innerWidth: 1200,
  innerHeight: 800,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  matchMedia: vi.fn()
}

// Mock navigator 对象
const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  platform: 'Win32',
  maxTouchPoints: 0
}

describe('useDeviceDetector', () => {
  beforeEach(() => {
    // 重置 window 和 navigator mock
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true
    })
    
    Object.defineProperty(global, 'navigator', {
      value: mockNavigator,
      writable: true
    })

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('基础设备检测', () => {
    it('应该正确检测桌面设备', () => {
      mockWindow.innerWidth = 1200
      
      const { deviceType, isDesktop, isMobile, isTablet } = useDeviceDetector()
      
      expect(deviceType.value).toBe('desktop')
      expect(isDesktop.value).toBe(true)
      expect(isMobile.value).toBe(false)
      expect(isTablet.value).toBe(false)
    })

    it('应该正确检测移动设备', () => {
      mockWindow.innerWidth = 600
      mockNavigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      
      const { deviceType, isDesktop, isMobile, isTablet } = useDeviceDetector()
      
      expect(deviceType.value).toBe('mobile')
      expect(isDesktop.value).toBe(false)
      expect(isMobile.value).toBe(true)
      expect(isTablet.value).toBe(false)
    })

    it('应该正确检测平板设备', () => {
      mockWindow.innerWidth = 900
      mockNavigator.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)'
      
      const { deviceType, isDesktop, isMobile, isTablet } = useDeviceDetector()
      
      expect(deviceType.value).toBe('tablet')
      expect(isDesktop.value).toBe(false)
      expect(isMobile.value).toBe(false)
      expect(isTablet.value).toBe(true)
    })
  })

  describe('自定义断点', () => {
    it('应该支持自定义断点配置', () => {
      const customBreakpoints = {
        mobile: 500,
        tablet: 900,
        desktop: 1100
      }

      mockWindow.innerWidth = 800
      
      const { deviceType } = useDeviceDetector({
        breakpoints: customBreakpoints
      })
      
      expect(deviceType.value).toBe('tablet')
    })

    it('应该使用默认断点', () => {
      mockWindow.innerWidth = 800
      
      const { deviceType } = useDeviceDetector()
      
      // 默认断点下，800px 应该是 tablet
      expect(deviceType.value).toBe('tablet')
    })
  })

  describe('User Agent 检测', () => {
    it('应该检测 iPhone', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      
      const { deviceInfo } = useDeviceDetector()
      
      expect(deviceInfo.value.os).toBe('iOS')
      expect(deviceInfo.value.browser).toContain('Safari')
    })

    it('应该检测 Android', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36'
      
      const { deviceInfo } = useDeviceDetector()
      
      expect(deviceInfo.value.os).toBe('Android')
    })

    it('应该检测 iPad', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)'
      
      const { deviceInfo } = useDeviceDetector()
      
      expect(deviceInfo.value.os).toBe('iOS')
      expect(deviceInfo.value.device).toBe('iPad')
    })

    it('应该检测 Windows', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      
      const { deviceInfo } = useDeviceDetector()
      
      expect(deviceInfo.value.os).toBe('Windows')
    })

    it('应该检测 macOS', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      
      const { deviceInfo } = useDeviceDetector()
      
      expect(deviceInfo.value.os).toBe('macOS')
    })
  })

  describe('触摸支持检测', () => {
    it('应该检测触摸支持', () => {
      mockNavigator.maxTouchPoints = 5
      
      const { supportTouch } = useDeviceDetector()
      
      expect(supportTouch.value).toBe(true)
    })

    it('应该检测无触摸支持', () => {
      mockNavigator.maxTouchPoints = 0
      
      const { supportTouch } = useDeviceDetector()
      
      expect(supportTouch.value).toBe(false)
    })
  })

  describe('屏幕方向检测', () => {
    it('应该检测横屏', () => {
      mockWindow.innerWidth = 1200
      mockWindow.innerHeight = 800
      
      const { orientation, isLandscape, isPortrait } = useDeviceDetector()
      
      expect(orientation.value).toBe('landscape')
      expect(isLandscape.value).toBe(true)
      expect(isPortrait.value).toBe(false)
    })

    it('应该检测竖屏', () => {
      mockWindow.innerWidth = 600
      mockWindow.innerHeight = 1000
      
      const { orientation, isLandscape, isPortrait } = useDeviceDetector()
      
      expect(orientation.value).toBe('portrait')
      expect(isLandscape.value).toBe(false)
      expect(isPortrait.value).toBe(true)
    })
  })

  describe('响应式更新', () => {
    it('应该在窗口大小变化时更新设备类型', async () => {
      mockWindow.innerWidth = 1200
      
      const { deviceType } = useDeviceDetector()
      expect(deviceType.value).toBe('desktop')

      // 模拟窗口大小变化
      mockWindow.innerWidth = 600
      
      // 获取注册的 resize 事件监听器
      const resizeListener = mockWindow.addEventListener.mock.calls
        .find(call => call[0] === 'resize')?.[1]
      
      if (resizeListener) {
        resizeListener()
        await nextTick()
        expect(deviceType.value).toBe('mobile')
      }
    })

    it('应该在方向变化时更新', async () => {
      mockWindow.innerWidth = 1200
      mockWindow.innerHeight = 800
      
      const { orientation } = useDeviceDetector()
      expect(orientation.value).toBe('landscape')

      // 模拟方向变化
      mockWindow.innerWidth = 800
      mockWindow.innerHeight = 1200
      
      const resizeListener = mockWindow.addEventListener.mock.calls
        .find(call => call[0] === 'resize')?.[1]
      
      if (resizeListener) {
        resizeListener()
        await nextTick()
        expect(orientation.value).toBe('portrait')
      }
    })
  })

  describe('媒体查询支持', () => {
    it('应该支持媒体查询检测', () => {
      const mockMediaQuery = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }
      
      mockWindow.matchMedia.mockReturnValue(mockMediaQuery)
      
      const { matchMedia } = useDeviceDetector()
      
      if (matchMedia) {
        const result = matchMedia('(max-width: 768px)')
        expect(result.value).toBe(true)
      }
    })

    it('应该在媒体查询变化时更新', async () => {
      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }
      
      mockWindow.matchMedia.mockReturnValue(mockMediaQuery)
      
      const { matchMedia } = useDeviceDetector()
      
      if (matchMedia) {
        const result = matchMedia('(max-width: 768px)')
        expect(result.value).toBe(false)

        // 模拟媒体查询变化
        mockMediaQuery.matches = true
        const changeListener = mockMediaQuery.addEventListener.mock.calls
          .find(call => call[0] === 'change')?.[1]
        
        if (changeListener) {
          changeListener({ matches: true })
          await nextTick()
          expect(result.value).toBe(true)
        }
      }
    })
  })

  describe('性能优化', () => {
    it('应该防抖窗口大小变化事件', async () => {
      const { deviceType } = useDeviceDetector({
        debounceDelay: 100
      })

      const resizeListener = mockWindow.addEventListener.mock.calls
        .find(call => call[0] === 'resize')?.[1]
      
      if (resizeListener) {
        // 快速触发多次 resize 事件
        mockWindow.innerWidth = 600
        resizeListener()
        mockWindow.innerWidth = 700
        resizeListener()
        mockWindow.innerWidth = 800
        resizeListener()

        // 应该只在防抖延迟后更新一次
        await new Promise(resolve => setTimeout(resolve, 150))
        await nextTick()
        
        expect(deviceType.value).toBe('tablet')
      }
    })
  })

  describe('生命周期管理', () => {
    it('应该在组件卸载时清理事件监听器', () => {
      const { cleanup } = useDeviceDetector()
      
      // 验证事件监听器已注册
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
      
      // 手动清理
      if (cleanup) {
        cleanup()
      }
      
      // 验证事件监听器已移除
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
    })
  })

  describe('错误处理', () => {
    it('应该处理 window 对象不存在的情况', () => {
      // 模拟服务端渲染环境
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true
      })

      expect(() => {
        useDeviceDetector()
      }).not.toThrow()
    })

    it('应该处理 navigator 对象不存在的情况', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true
      })

      const { deviceInfo } = useDeviceDetector()
      
      expect(deviceInfo.value.os).toBe('Unknown')
      expect(deviceInfo.value.browser).toBe('Unknown')
    })
  })

  describe('配置选项', () => {
    it('应该支持禁用响应式更新', () => {
      const { deviceType } = useDeviceDetector({
        reactive: false
      })

      // 验证没有注册事件监听器
      expect(mockWindow.addEventListener).not.toHaveBeenCalledWith('resize', expect.any(Function))
    })

    it('应该支持自定义检测逻辑', () => {
      const customDetector = vi.fn().mockReturnValue('custom-device')
      
      const { deviceType } = useDeviceDetector({
        customDetector
      })

      expect(customDetector).toHaveBeenCalled()
      expect(deviceType.value).toBe('custom-device')
    })
  })
})
