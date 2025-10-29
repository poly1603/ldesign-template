/**
 * Vue Loader Adapter
 * 
 * Vue 组件加载适配器 - 实现 ComponentLoader 接口
 */

import type { Component } from 'vue'
import type { ComponentLoader } from '@ldesign/template-core'

/**
 * Vue 组件加载器配置
 */
export interface VueLoaderOptions {
  /**
   * 是否启用缓存
   */
  cache?: boolean
  
  /**
   * 加载超时（毫秒）
   */
  timeout?: number
  
  /**
   * 错误重试次数
   */
  retryCount?: number
  
  /**
   * 自定义模块解析函数
   */
  resolveModule?: (module: any) => Component
}

/**
 * Vue 组件加载器
 * 
 * 处理 Vue 组件的动态导入，支持多种模块格式
 */
export class VueLoaderAdapter implements ComponentLoader<Component> {
  private cache = new Map<string, Component>()
  
  constructor(private options: VueLoaderOptions = {}) {}
  
  /**
   * 加载组件
   */
  async load(path: string): Promise<Component> {
    // 检查缓存
    if (this.options.cache !== false) {
      const cached = this.cache.get(path)
      if (cached) {
        return cached
      }
    }
    
    // 加载组件
    let component: Component
    
    if (this.options.timeout) {
      component = await this.loadWithTimeout(path, this.options.timeout)
    } else {
      component = await this.performLoad(path)
    }
    
    // 缓存组件
    if (this.options.cache !== false) {
      this.cache.set(path, component)
    }
    
    return component
  }
  
  /**
   * 执行加载（带重试）
   */
  private async performLoad(path: string, retryCount = 0): Promise<Component> {
    try {
      const module = await import(/* @vite-ignore */ path)
      return this.resolveModule(module)
    } catch (error) {
      const maxRetries = this.options.retryCount ?? 0
      
      if (retryCount < maxRetries) {
        // 延迟重试
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
        return this.performLoad(path, retryCount + 1)
      }
      
      throw new Error(`Failed to load component: ${path}`, { cause: error })
    }
  }
  
  /**
   * 带超时的加载
   */
  private async loadWithTimeout(path: string, timeout: number): Promise<Component> {
    return Promise.race([
      this.performLoad(path),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Load timeout: ${path}`)), timeout)
      ),
    ])
  }
  
  /**
   * 解析模块为组件
   */
  private resolveModule(module: any): Component {
    // 使用自定义解析函数
    if (this.options.resolveModule) {
      return this.options.resolveModule(module)
    }
    
    // 标准 ES 模块格式：export default Component
    if (module.default) {
      return module.default
    }
    
    // 命名导出：export { Component }
    if (module.Component) {
      return module.Component
    }
    
    // 直接就是组件
    if (this.isVueComponent(module)) {
      return module
    }
    
    throw new Error('Unable to resolve Vue component from module')
  }
  
  /**
   * 检查是否为 Vue 组件
   */
  private isVueComponent(obj: any): obj is Component {
    return (
      obj &&
      (typeof obj === 'function' ||
        typeof obj === 'object' &&
        (obj.setup || obj.render || obj.template))
    )
  }
  
  /**
   * 预加载组件
   */
  async preload(paths: string[]): Promise<void> {
    await Promise.allSettled(
      paths.map(path => this.load(path))
    )
  }
  
  /**
   * 清除缓存
   */
  clearCache(path?: string): void {
    if (path) {
      this.cache.delete(path)
    } else {
      this.cache.clear()
    }
  }
  
  /**
   * 获取缓存大小
   */
  getCacheSize(): number {
    return this.cache.size
  }
}

/**
 * 创建 Vue 加载器
 */
export function createVueLoader(options?: VueLoaderOptions): VueLoaderAdapter {
  return new VueLoaderAdapter(options)
}

/**
 * Vue 样式加载器
 */
export class VueStyleLoader {
  private loadedStyles = new Set<string>()
  private styleElements = new Map<string, HTMLStyleElement | HTMLLinkElement>()
  
  /**
   * 加载样式
   */
  async load(path: string): Promise<void> {
    if (this.loadedStyles.has(path)) {
      return
    }
    
    try {
      if (path.endsWith('.css')) {
        await this.loadCSS(path)
      } else if (path.endsWith('.scss') || path.endsWith('.sass')) {
        // Vite 会自动处理 SCSS/SASS
        await this.loadCSS(path)
      } else {
        // 动态导入样式模块
        await import(/* @vite-ignore */ path)
      }
      
      this.loadedStyles.add(path)
    } catch (error) {
      console.error(`Failed to load style: ${path}`, error)
      throw error
    }
  }
  
  /**
   * 加载 CSS 文件
   */
  private async loadCSS(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = path
      
      link.onload = () => {
        this.styleElements.set(path, link)
        resolve()
      }
      
      link.onerror = () => {
        reject(new Error(`Failed to load CSS: ${path}`))
      }
      
      document.head.appendChild(link)
    })
  }
  
  /**
   * 卸载样式
   */
  unload(path: string): void {
    const element = this.styleElements.get(path)
    if (element && element.parentNode) {
      element.parentNode.removeChild(element)
    }
    
    this.styleElements.delete(path)
    this.loadedStyles.delete(path)
  }
  
  /**
   * 清除所有样式
   */
  clear(): void {
    this.styleElements.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })
    
    this.styleElements.clear()
    this.loadedStyles.clear()
  }
}

/**
 * 创建 Vue 样式加载器
 */
export function createVueStyleLoader(): VueStyleLoader {
  return new VueStyleLoader()
}
