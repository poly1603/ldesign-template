/**
 * 本地存储组合式函数
 */

import { ref, watch, Ref } from 'vue'
import type { UseStorageReturn } from '../types'
import { StorageManager } from '../utils'

/**
 * 本地存储组合式函数
 */
export function useStorage<T>(
  key: string,
  defaultValue: T,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
): UseStorageReturn<T> {
  const storage = new StorageManager(storageType)
  
  // 从存储中读取初始值
  const storedValue = storage.get<T>(key, defaultValue)
  const value = ref<T>(storedValue) as Ref<T>

  // 监听值的变化并同步到存储
  watch(
    value,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        storage.remove(key)
      } else {
        storage.set(key, newValue)
      }
    },
    { deep: true }
  )

  // 设置值
  const setValue = (newValue: T) => {
    value.value = newValue
  }

  // 移除值
  const removeValue = () => {
    storage.remove(key)
    value.value = defaultValue
  }

  // 重置为默认值
  const resetValue = () => {
    value.value = defaultValue
  }

  return {
    value,
    setValue,
    removeValue,
    resetValue
  }
}

/**
 * 响应式本地存储（支持跨标签页同步）
 */
export function useReactiveStorage<T>(
  key: string,
  defaultValue: T,
  storageType: 'localStorage' | 'sessionStorage' = 'localStorage'
): UseStorageReturn<T> {
  const storage = new StorageManager(storageType)
  const storedValue = storage.get<T>(key, defaultValue)
  const value = ref<T>(storedValue) as Ref<T>

  // 监听存储变化（跨标签页同步）
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue !== null) {
      try {
        const newValue = JSON.parse(e.newValue)
        value.value = newValue
      } catch (error) {
        console.warn(`Failed to parse storage value for key ${key}:`, error)
      }
    } else if (e.key === key && e.newValue === null) {
      value.value = defaultValue
    }
  }

  // 只在浏览器环境中监听存储事件
  if (typeof window !== 'undefined' && storageType === 'localStorage') {
    window.addEventListener('storage', handleStorageChange)
  }

  // 监听值的变化并同步到存储
  watch(
    value,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        storage.remove(key)
      } else {
        storage.set(key, newValue)
      }
    },
    { deep: true }
  )

  const setValue = (newValue: T) => {
    value.value = newValue
  }

  const removeValue = () => {
    storage.remove(key)
    value.value = defaultValue
  }

  const resetValue = () => {
    value.value = defaultValue
  }

  return {
    value,
    setValue,
    removeValue,
    resetValue
  }
}