/**
 * 高性能懒加载指令
 *
 * @description
 * 基于 IntersectionObserver 的懒加载系统
 * 支持图片、组件、iframe 等资源的懒加载
 *
 * **特性：**
 * - 批量观察优化
 * - 预加载支持
 * - 错误重试机制
 * - 占位符管理
 * - 内存优化
 */

import type { Directive, DirectiveBinding } from 'vue'
import { createLogger } from '../utils/logger'

const logger = createLogger({ prefix: '[LazyLoad]' })

/**
 * 懒加载选项
 */
export interface LazyLoadOptions {
  /** 根边距（提前加载） */
  rootMargin?: string
  /** 阈值 */
  threshold?: number | number[]
  /** 加载中的占位符 */
  loading?: string
  /** 错误占位符 */
  error?: string
  /** 重试次数 */
  retryCount?: number
  /** 重试延迟（毫秒） */
  retryDelay?: number
  /** 是否预加载 */
  preload?: boolean
  /** 自定义加载函数 */
  loader?: (el: Element) => Promise<void>
  /** 成功回调 */
  onSuccess?: (el: Element) => void
  /** 错误回调 */
  onError?: (el: Element, error: Error) => void
}

/**
 * 懒加载状态
 */
interface LazyLoadState {
  /** 是否已加载 */
  loaded: boolean
  /** 是否正在加载 */
  loading: boolean
  /** 错误次数 */
  errorCount: number
  /** 观察器 */
  observer?: IntersectionObserver
  /** 原始src */
  originalSrc?: string
}

/**
 * 全局观察器池（复用观察器）
 */
const observerPool = new Map<string, IntersectionObserver>()

/**
 * 元素状态映射
 */
const elementStates = new WeakMap<Element, LazyLoadState>()

/**
 * 获取或创建观察器
 */
function getObserver(options: LazyLoadOptions): IntersectionObserver {
  const key = `${options.rootMargin || '0px'}_${options.threshold || 0}`

  if (!observerPool.has(key)) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleIntersection(entry.target as HTMLElement)
          }
        })
      },
      {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0,
      },
    )

    observerPool.set(key, observer)
  }

  return observerPool.get(key)!
}

/**
 * 处理元素进入视口
 */
async function handleIntersection(el: HTMLElement) {
  const state = elementStates.get(el)
  if (!state || state.loaded || state.loading)
    return

  state.loading = true
  const options = getOptionsFromElement(el)

  try {
    if (options.loader) {
      // 自定义加载器
      await options.loader(el)
    }
    else if (el.tagName === 'IMG') {
      // 图片加载
      await loadImage(el as HTMLImageElement)
    }
    else if (el.tagName === 'IFRAME') {
      // iframe加载
      await loadIframe(el as HTMLIFrameElement)
    }
    else {
      // 组件加载
      await loadComponent(el)
    }

    state.loaded = true
    state.loading = false
    el.classList.add('lazy-loaded')

    // 成功回调
    if (options.onSuccess) {
      options.onSuccess(el)
    }

    // 断开观察
    state.observer?.unobserve(el)

    logger.debug(`懒加载成功: ${el.getAttribute('data-src') || el.id}`)
  }
  catch (error) {
    state.loading = false
    state.errorCount++

    logger.error(`懒加载失败: ${error}`)

    // 错误处理
    if (state.errorCount < (options.retryCount || 3)) {
      // 重试
      setTimeout(() => {
        handleIntersection(el)
      }, options.retryDelay || 1000)
    }
    else {
      // 显示错误占位符
      if (options.error && el.tagName === 'IMG') {
        (el as HTMLImageElement).src = options.error
      }

      el.classList.add('lazy-error')

      // 错误回调
      if (options.onError) {
        options.onError(el, error as Error)
      }
    }
  }
}

/**
 * 加载图片
 */
async function loadImage(img: HTMLImageElement): Promise<void> {
  const dataSrc = img.getAttribute('data-src')
  const dataSrcset = img.getAttribute('data-srcset')

  if (!dataSrc && !dataSrcset) {
    throw new Error('缺少 data-src 或 data-srcset')
  }

  return new Promise((resolve, reject) => {
    const tempImg = new Image()

    // 加载成功
    tempImg.onload = () => {
      if (dataSrc)
        img.src = dataSrc
      if (dataSrcset)
        img.srcset = dataSrcset

      // 移除data属性（节省内存）
      img.removeAttribute('data-src')
      img.removeAttribute('data-srcset')

      // 淡入动画
      img.style.opacity = '0'
      img.style.transition = 'opacity 0.3s'
      requestAnimationFrame(() => {
        img.style.opacity = '1'
      })

      resolve()
    }

    // 加载失败
    tempImg.onerror = () => {
      reject(new Error(`图片加载失败: ${dataSrc}`))
    }

    // 开始加载
    if (dataSrcset)
      tempImg.srcset = dataSrcset
    if (dataSrc)
      tempImg.src = dataSrc
  })
}

/**
 * 加载iframe
 */
async function loadIframe(iframe: HTMLIFrameElement): Promise<void> {
  const dataSrc = iframe.getAttribute('data-src')

  if (!dataSrc) {
    throw new Error('缺少 data-src')
  }

  return new Promise((resolve) => {
    iframe.onload = () => resolve()
    iframe.src = dataSrc
    iframe.removeAttribute('data-src')
  })
}

/**
 * 加载组件
 */
async function loadComponent(el: HTMLElement): Promise<void> {
  const componentName = el.getAttribute('data-component')

  if (!componentName) {
    throw new Error('缺少 data-component')
  }

  // 触发自定义事件，让父组件处理
  el.dispatchEvent(new CustomEvent('lazy-load', {
    detail: { componentName },
    bubbles: true,
  }))

  el.removeAttribute('data-component')
}

/**
 * 从元素获取选项
 */
function getOptionsFromElement(el: Element): LazyLoadOptions {
  const options: LazyLoadOptions = {}

  // 从data属性读取选项
  const loading = el.getAttribute('data-loading')
  const error = el.getAttribute('data-error')
  const rootMargin = el.getAttribute('data-root-margin')
  const threshold = el.getAttribute('data-threshold')
  const retryCount = el.getAttribute('data-retry-count')
  const retryDelay = el.getAttribute('data-retry-delay')
  const preload = el.getAttribute('data-preload')

  if (loading)
    options.loading = loading
  if (error)
    options.error = error
  if (rootMargin)
    options.rootMargin = rootMargin
  if (threshold)
    options.threshold = Number.parseFloat(threshold)
  if (retryCount)
    options.retryCount = Number.parseInt(retryCount)
  if (retryDelay)
    options.retryDelay = Number.parseInt(retryDelay)
  if (preload)
    options.preload = preload === 'true'

  // 从元素的自定义属性获取回调
  const callbacks = (el as any).__lazyCallbacks
  if (callbacks) {
    options.onSuccess = callbacks.onSuccess
    options.onError = callbacks.onError
    options.loader = callbacks.loader
  }

  return options
}

/**
 * 设置占位符
 */
function setPlaceholder(el: HTMLElement, options: LazyLoadOptions) {
  if (options.loading && el.tagName === 'IMG') {
    const state = elementStates.get(el)
    if (state) {
      state.originalSrc = (el as HTMLImageElement).src
    }
    (el as HTMLImageElement).src = options.loading
  }

  el.classList.add('lazy-loading')
}

/**
 * 懒加载指令
 */
export const vLazyLoad: Directive<HTMLElement, LazyLoadOptions | string> = {
  mounted(el, binding) {
    // 解析选项
    const options: LazyLoadOptions = typeof binding.value === 'string'
      ? { loading: binding.value }
      : binding.value || {}

    // 保存回调到元素
    if (options.onSuccess || options.onError || options.loader) {
      (el as any).__lazyCallbacks = {
        onSuccess: options.onSuccess,
        onError: options.onError,
        loader: options.loader,
      }
    }

    // 初始化状态
    const state: LazyLoadState = {
      loaded: false,
      loading: false,
      errorCount: 0,
    }

    elementStates.set(el, state)

    // 设置占位符
    setPlaceholder(el, options)

    // 如果启用预加载，立即加载
    if (options.preload) {
      handleIntersection(el)
    }
    else {
      // 创建或获取观察器
      const observer = getObserver(options)
      state.observer = observer

      // 开始观察
      observer.observe(el)
    }
  },

  updated(el, binding) {
    const state = elementStates.get(el)
    if (!state)
      return

    // 如果data-src变化，重新加载
    const newSrc = el.getAttribute('data-src')
    if (newSrc && newSrc !== state.originalSrc) {
      state.loaded = false
      state.loading = false
      state.errorCount = 0

      if (!state.observer) {
        const options = typeof binding.value === 'string'
          ? { loading: binding.value }
          : binding.value || {}
        const observer = getObserver(options)
        state.observer = observer
        observer.observe(el)
      }
    }
  },

  unmounted(el) {
    const state = elementStates.get(el)
    if (state?.observer) {
      state.observer.unobserve(el)
    }

    elementStates.delete(el)

    // 清理自定义属性
    delete (el as any).__lazyCallbacks
  },
}

/**
 * 手动触发懒加载
 */
export function triggerLazyLoad(el: HTMLElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const state = elementStates.get(el)
    if (!state) {
      reject(new Error('元素未初始化懒加载'))
      return
    }

    if (state.loaded) {
      resolve()
      return
    }

    handleIntersection(el).then(resolve).catch(reject)
  })
}

/**
 * 预加载一组元素
 */
export function preloadElements(selector: string): Promise<void[]> {
  const elements = document.querySelectorAll<HTMLElement>(selector)
  const promises: Promise<void>[] = []

  elements.forEach((el) => {
    promises.push(triggerLazyLoad(el))
  })

  return Promise.all(promises)
}

/**
 * 清理观察器池（释放内存）
 */
export function cleanupObservers(): void {
  observerPool.forEach((observer) => {
    observer.disconnect()
  })
  observerPool.clear()

  logger.info('清理了所有懒加载观察器')
}

// 导出指令
export default vLazyLoad
