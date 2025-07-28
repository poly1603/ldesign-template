import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useStorage } from '../../src/composables/useStorage'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

// Mock storage event
const mockStorageEvent = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}

describe('useStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    
    Object.defineProperty(global, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    })
    
    Object.defineProperty(global, 'window', {
      value: mockStorageEvent,
      writable: true
    })
    
    // 重置 mock 返回值
    mockLocalStorage.getItem.mockReturnValue(null)
    mockSessionStorage.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('基础功能', () => {
    it('应该使用默认值初始化', () => {
      const { value } = useStorage('test-key', 'default-value')
      
      expect(value.value).toBe('default-value')
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
    })

    it('应该从存储中恢复值', () => {
      mockLocalStorage.getItem.mockReturnValue('"stored-value"')
      
      const { value } = useStorage('test-key', 'default-value')
      
      expect(value.value).toBe('stored-value')
    })

    it('应该在值变化时保存到存储', async () => {
      const { value } = useStorage('test-key', 'initial')
      
      value.value = 'updated'
      await nextTick()
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', '"updated"')
    })

    it('应该支持复杂对象', async () => {
      const defaultValue = { name: 'test', count: 0 }
      const { value } = useStorage('test-key', defaultValue)
      
      value.value = { name: 'updated', count: 5 }
      await nextTick()
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify({ name: 'updated', count: 5 })
      )
    })
  })

  describe('存储类型', () => {
    it('应该支持 localStorage', () => {
      const { value } = useStorage('test-key', 'value', {
        storage: 'localStorage'
      })
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
    })

    it('应该支持 sessionStorage', () => {
      const { value } = useStorage('test-key', 'value', {
        storage: 'sessionStorage'
      })
      
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('test-key')
    })

    it('应该在指定存储类型时使用对应的存储', async () => {
      const { value } = useStorage('session-key', 'value', {
        storage: 'sessionStorage'
      })
      
      value.value = 'updated'
      await nextTick()
      
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('session-key', '"updated"')
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
    })
  })

  describe('序列化器', () => {
    it('应该使用默认 JSON 序列化器', async () => {
      const { value } = useStorage('test-key', { test: true })
      
      value.value = { test: false, new: 'value' }
      await nextTick()
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify({ test: false, new: 'value' })
      )
    })

    it('应该支持自定义序列化器', async () => {
      const customSerializer = {
        read: vi.fn().mockReturnValue('deserialized'),
        write: vi.fn().mockReturnValue('serialized')
      }
      
      mockLocalStorage.getItem.mockReturnValue('stored-data')
      
      const { value } = useStorage('test-key', 'default', {
        serializer: customSerializer
      })
      
      expect(customSerializer.read).toHaveBeenCalledWith('stored-data')
      expect(value.value).toBe('deserialized')
      
      value.value = 'new-value'
      await nextTick()
      
      expect(customSerializer.write).toHaveBeenCalledWith('new-value')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'serialized')
    })

    it('应该处理序列化错误', async () => {
      const faultySerializer = {
        read: vi.fn().mockImplementation(() => {
          throw new Error('Deserialization error')
        }),
        write: vi.fn().mockReturnValue('serialized')
      }
      
      mockLocalStorage.getItem.mockReturnValue('invalid-data')
      
      const { value } = useStorage('test-key', 'fallback', {
        serializer: faultySerializer
      })
      
      // 应该使用默认值
      expect(value.value).toBe('fallback')
    })
  })

  describe('跨标签页同步', () => {
    it('应该监听存储事件', () => {
      useStorage('test-key', 'value', {
        enableSync: true
      })
      
      expect(mockStorageEvent.addEventListener).toHaveBeenCalledWith(
        'storage',
        expect.any(Function)
      )
    })

    it('应该在存储事件时更新值', async () => {
      const { value } = useStorage('test-key', 'initial', {
        enableSync: true
      })
      
      expect(value.value).toBe('initial')
      
      // 模拟存储事件
      const storageListener = mockStorageEvent.addEventListener.mock.calls
        .find(call => call[0] === 'storage')?.[1]
      
      if (storageListener) {
        storageListener({
          key: 'test-key',
          newValue: '"updated-from-another-tab"',
          storageArea: mockLocalStorage
        })
        
        await nextTick()
        expect(value.value).toBe('updated-from-another-tab')
      }
    })

    it('应该忽略其他键的存储事件', async () => {
      const { value } = useStorage('test-key', 'initial', {
        enableSync: true
      })
      
      const storageListener = mockStorageEvent.addEventListener.mock.calls
        .find(call => call[0] === 'storage')?.[1]
      
      if (storageListener) {
        storageListener({
          key: 'other-key',
          newValue: '"other-value"',
          storageArea: mockLocalStorage
        })
        
        await nextTick()
        expect(value.value).toBe('initial') // 不应该变化
      }
    })

    it('应该在禁用同步时不监听事件', () => {
      useStorage('test-key', 'value', {
        enableSync: false
      })
      
      expect(mockStorageEvent.addEventListener).not.toHaveBeenCalled()
    })
  })

  describe('SSR 支持', () => {
    it('应该在 SSR 环境中工作', () => {
      // 模拟 SSR 环境
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true
      })
      
      const { value, isSupported } = useStorage('test-key', 'default', {
        enableSSR: true
      })
      
      expect(value.value).toBe('default')
      expect(isSupported.value).toBe(false)
    })

    it('应该在客户端水合时恢复值', async () => {
      // 先模拟 SSR
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true
      })
      
      const { value } = useStorage('test-key', 'ssr-default', {
        enableSSR: true
      })
      
      expect(value.value).toBe('ssr-default')
      
      // 模拟客户端水合
      Object.defineProperty(global, 'window', {
        value: mockStorageEvent,
        writable: true
      })
      
      Object.defineProperty(global, 'localStorage', {
        value: mockLocalStorage,
        writable: true
      })
      
      mockLocalStorage.getItem.mockReturnValue('"client-value"')
      
      // 触发水合
      const { refresh } = useStorage('test-key', 'ssr-default', {
        enableSSR: true
      })
      
      if (refresh) {
        refresh()
        await nextTick()
        expect(value.value).toBe('client-value')
      }
    })
  })

  describe('工具方法', () => {
    it('应该提供移除方法', () => {
      const { value, remove } = useStorage('test-key', 'value')
      
      remove()
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key')
      expect(value.value).toBe('value') // 应该回到默认值
    })

    it('应该提供清空方法', () => {
      const { clear } = useStorage('test-key', 'value')
      
      clear()
      
      expect(mockLocalStorage.clear).toHaveBeenCalled()
    })

    it('应该提供刷新方法', () => {
      mockLocalStorage.getItem.mockReturnValue('"refreshed-value"')
      
      const { value, refresh } = useStorage('test-key', 'default')
      
      expect(value.value).toBe('default')
      
      refresh()
      
      expect(value.value).toBe('refreshed-value')
    })

    it('应该提供获取大小方法', () => {
      const { getSize } = useStorage('test-key', 'value')
      
      mockLocalStorage.getItem.mockReturnValue('"test-value"')
      
      const size = getSize()
      expect(size).toBe('"test-value"'.length)
    })
  })

  describe('存储支持检测', () => {
    it('应该检测存储是否可用', () => {
      const { isSupported } = useStorage('test-key', 'value')
      
      expect(isSupported.value).toBe(true)
    })

    it('应该在存储不可用时返回 false', () => {
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        writable: true
      })
      
      const { isSupported } = useStorage('test-key', 'value')
      
      expect(isSupported.value).toBe(false)
    })

    it('应该在存储抛出异常时返回 false', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage not available')
      })
      
      const { isSupported } = useStorage('test-key', 'value')
      
      expect(isSupported.value).toBe(false)
    })
  })

  describe('错误处理', () => {
    it('应该处理存储读取错误', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage read error')
      })
      
      const { value } = useStorage('test-key', 'fallback')
      
      expect(value.value).toBe('fallback')
    })

    it('应该处理存储写入错误', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage write error')
      })
      
      const { value } = useStorage('test-key', 'initial')
      
      // 应该不抛出错误
      expect(() => {
        value.value = 'updated'
      }).not.toThrow()
    })

    it('应该处理无效的 JSON 数据', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json')
      
      const { value } = useStorage('test-key', 'fallback')
      
      expect(value.value).toBe('fallback')
    })
  })

  describe('生命周期管理', () => {
    it('应该在组件卸载时清理事件监听器', () => {
      const { cleanup } = useStorage('test-key', 'value', {
        enableSync: true
      })
      
      expect(mockStorageEvent.addEventListener).toHaveBeenCalled()
      
      if (cleanup) {
        cleanup()
      }
      
      expect(mockStorageEvent.removeEventListener).toHaveBeenCalled()
    })
  })

  describe('类型安全', () => {
    it('应该保持类型安全', () => {
      const { value } = useStorage('number-key', 42)
      
      // TypeScript 应该推断出 value 是 number 类型
      expect(typeof value.value).toBe('number')
      
      value.value = 100 // 应该是类型安全的
      expect(value.value).toBe(100)
    })

    it('应该支持复杂类型', () => {
      interface User {
        id: number
        name: string
        email: string
      }
      
      const defaultUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }
      
      const { value } = useStorage('user-key', defaultUser)
      
      expect(value.value).toEqual(defaultUser)
      
      value.value = {
        id: 2,
        name: 'Updated User',
        email: 'updated@example.com'
      }
      
      expect(value.value.id).toBe(2)
      expect(value.value.name).toBe('Updated User')
    })
  })
})
