/**
 * @ldesign/template - Theme Integration
 * 
 * 主题集成工具，提供主题初始化、切换和 CSS 变量注入功能
 */

import type { Ref } from 'vue'
import { ref, watch, onMounted } from 'vue'

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 主题配置选项
 */
export interface ThemeOptions {
  /**
   * 初始主题模式
   * @default 'light'
   */
  mode?: ThemeMode

  /**
   * 是否自动注入 CSS 变量文件
   * @default true
   */
  autoInjectVariables?: boolean

  /**
   * CSS 变量文件路径（相对于 @ldesign/template 包）
   * @default '/styles/variables.css'
   */
  variablesPath?: string

  /**
   * 是否启用系统主题跟随（当 mode 为 'auto' 时生效）
   * @default true
   */
  followSystemTheme?: boolean

  /**
   * 主题变更回调
   */
  onChange?: (mode: ThemeMode) => void
}

/**
 * 主题管理器类
 */
export class TemplateThemeManager {
  private mode: Ref<ThemeMode>
  private actualMode: Ref<'light' | 'dark'>
  private options: Required<ThemeOptions>
  private mediaQuery?: MediaQueryList
  private isInitialized = false

  constructor(options: ThemeOptions = {}) {
    this.options = {
      mode: options.mode || 'light',
      autoInjectVariables: options.autoInjectVariables !== false,
      variablesPath: options.variablesPath || '/styles/variables.css',
      followSystemTheme: options.followSystemTheme !== false,
      onChange: options.onChange || (() => { }),
    }

    this.mode = ref(this.options.mode)
    this.actualMode = ref(this.resolveActualMode(this.options.mode))
  }

  /**
   * 初始化主题
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    // 1. 注入 CSS 变量文件
    if (this.options.autoInjectVariables) {
      await this.injectVariablesCSS()
    }

    // 2. 应用当前主题
    this.applyTheme(this.actualMode.value)

    // 3. 设置系统主题监听
    if (this.options.followSystemTheme && this.mode.value === 'auto') {
      this.setupSystemThemeListener()
    }

    // 4. 监听主题模式变化
    watch(this.mode, (newMode) => {
      const newActualMode = this.resolveActualMode(newMode)
      this.actualMode.value = newActualMode
      this.applyTheme(newActualMode)
      this.options.onChange(newMode)

      // 处理 auto 模式下的系统主题监听
      if (newMode === 'auto' && this.options.followSystemTheme) {
        this.setupSystemThemeListener()
      } else {
        this.removeSystemThemeListener()
      }
    })

    this.isInitialized = true
  }

  /**
   * 注入 CSS 变量文件
   */
  private async injectVariablesCSS(): Promise<void> {
    if (typeof document === 'undefined') {
      return
    }

    // 检查是否已经注入
    const existingLink = document.querySelector('link[data-template-variables]')
    if (existingLink) {
      return
    }

    // 创建 link 元素
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = this.options.variablesPath
    link.setAttribute('data-template-variables', 'true')

    // 插入到 head
    document.head.appendChild(link)

    // 等待样式加载
    return new Promise((resolve, reject) => {
      link.onload = () => resolve()
      link.onerror = () => reject(new Error('Failed to load template variables CSS'))
    })
  }

  /**
   * 解析实际的主题模式
   */
  private resolveActualMode(mode: ThemeMode): 'light' | 'dark' {
    if (mode === 'auto') {
      return this.getSystemTheme()
    }
    return mode
  }

  /**
   * 获取系统主题
   */
  private getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  /**
   * 应用主题
   */
  private applyTheme(mode: 'light' | 'dark'): void {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement

    // 设置 data-theme-mode 属性
    root.setAttribute('data-theme-mode', mode)

    // 设置 class（兼容旧版本）
    root.classList.remove('theme-light', 'theme-dark')
    root.classList.add(`theme-${mode}`)
  }

  /**
   * 设置系统主题监听器
   */
  private setupSystemThemeListener(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    // 移除旧的监听器
    this.removeSystemThemeListener()

    // 创建新的监听器
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? 'dark' : 'light'
      this.actualMode.value = newMode
      this.applyTheme(newMode)
    }

    // 添加监听器
    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', handler)
    } else {
      // 兼容旧版浏览器
      this.mediaQuery.addListener(handler)
    }
  }

  /**
   * 移除系统主题监听器
   */
  private removeSystemThemeListener(): void {
    if (this.mediaQuery) {
      if (this.mediaQuery.removeEventListener) {
        this.mediaQuery.removeEventListener('change', () => { })
      } else {
        // 兼容旧版浏览器
        this.mediaQuery.removeListener(() => { })
      }
      this.mediaQuery = undefined
    }
  }

  /**
   * 设置主题模式
   */
  setMode(mode: ThemeMode): void {
    this.mode.value = mode
  }

  /**
   * 获取当前主题模式
   */
  getMode(): ThemeMode {
    return this.mode.value
  }

  /**
   * 获取实际应用的主题模式
   */
  getActualMode(): 'light' | 'dark' {
    return this.actualMode.value
  }

  /**
   * 切换主题（在 light 和 dark 之间切换）
   */
  toggle(): void {
    const currentActual = this.actualMode.value
    this.mode.value = currentActual === 'light' ? 'dark' : 'light'
  }

  /**
   * 销毁主题管理器
   */
  destroy(): void {
    this.removeSystemThemeListener()
    this.isInitialized = false
  }
}

/**
 * 全局主题管理器实例
 */
let globalThemeManager: TemplateThemeManager | null = null

/**
 * 初始化模板主题
 * 
 * @param options - 主题配置选项
 * @returns 主题管理器实例
 * 
 * @example
 * ```ts
 * import { initTemplateTheme } from '@ldesign/template/theme'
 * 
 * const theme = await initTemplateTheme({
 *   mode: 'auto',
 *   followSystemTheme: true
 * })
 * ```
 */
export async function initTemplateTheme(options?: ThemeOptions): Promise<TemplateThemeManager> {
  if (!globalThemeManager) {
    globalThemeManager = new TemplateThemeManager(options)
  }
  await globalThemeManager.init()
  return globalThemeManager
}

/**
 * 获取全局主题管理器
 * 
 * @returns 主题管理器实例，如果未初始化则返回 null
 */
export function getTemplateTheme(): TemplateThemeManager | null {
  return globalThemeManager
}

/**
 * Vue Composable: 使用模板主题
 * 
 * @param options - 主题配置选项
 * @returns 主题管理相关的响应式状态和方法
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useTemplateTheme } from '@ldesign/template/theme'
 * 
 * const { mode, actualMode, setMode, toggle } = useTemplateTheme()
 * </script>
 * ```
 */
export function useTemplateTheme(options?: ThemeOptions) {
  const themeManager = ref<TemplateThemeManager | null>(null)
  const mode = ref<ThemeMode>('light')
  const actualMode = ref<'light' | 'dark'>('light')

  // 初始化主题
  onMounted(async () => {
    themeManager.value = await initTemplateTheme(options)
    mode.value = themeManager.value.getMode()
    actualMode.value = themeManager.value.getActualMode()

    // 同步状态
    watch(() => themeManager.value?.getMode(), (newMode) => {
      if (newMode) mode.value = newMode
    })
    watch(() => themeManager.value?.getActualMode(), (newMode) => {
      if (newMode) actualMode.value = newMode
    })
  })

  /**
   * 设置主题模式
   */
  const setMode = (newMode: ThemeMode) => {
    themeManager.value?.setMode(newMode)
    mode.value = newMode
  }

  /**
   * 切换主题
   */
  const toggle = () => {
    themeManager.value?.toggle()
  }

  /**
   * 判断是否为深色模式
   */
  const isDark = ref(false)
  watch(actualMode, (newMode) => {
    isDark.value = newMode === 'dark'
  }, { immediate: true })

  return {
    themeManager,
    mode,
    actualMode,
    isDark,
    setMode,
    toggle,
  }
}

/**
 * 手动注入 CSS 变量
 * 
 * @param customVars - 自定义 CSS 变量对象
 * 
 * @example
 * ```ts
 * import { injectCSSVariables } from '@ldesign/template/theme'
 * 
 * injectCSSVariables({
 *   '--template-primary': '#ff6b6b',
 *   '--template-radius-md': '12px'
 * })
 * ```
 */
export function injectCSSVariables(customVars: Record<string, string>): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  Object.entries(customVars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

/**
 * 获取 CSS 变量值
 * 
 * @param varName - CSS 变量名称
 * @param element - 元素，默认为 document.documentElement
 * @returns CSS 变量值
 * 
 * @example
 * ```ts
 * import { getCSSVariable } from '@ldesign/template/theme'
 * 
 * const primaryColor = getCSSVariable('--template-primary')
 * ```
 */
export function getCSSVariable(varName: string, element?: HTMLElement): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const el = element || document.documentElement
  return getComputedStyle(el).getPropertyValue(varName).trim()
}

/**
 * 移除 CSS 变量
 * 
 * @param varName - CSS 变量名称
 * @param element - 元素，默认为 document.documentElement
 */
export function removeCSSVariable(varName: string, element?: HTMLElement): void {
  if (typeof document === 'undefined') {
    return
  }

  const el = element || document.documentElement
  el.style.removeProperty(varName)
}


