/**
 * Template Engine Plugin
 *
 * 将 Template 功能集成到 LDesign Engine
 *
 * @example
 * ```ts
 * import { createVueEngine } from '@ldesign/engine-vue3'
 * import { createTemplateEnginePlugin } from '@ldesign/template-vue/plugins'
 *
 * const engine = createVueEngine({
 *   plugins: [
 *     createTemplateEnginePlugin({
 *       autoScan: true,
 *       debug: import.meta.env.DEV,
 *       categories: {
 *         login: {
 *           defaults: {
 *             desktop: 'default',
 *             tablet: 'default',
 *             mobile: false, // 禁用移动端
 *           },
 *           disabledMessage: '请在桌面端或平板端访问登录页面',
 *         },
 *       },
 *       cache: {
 *         enabled: true,
 *         storage: 'localStorage',
 *       },
 *       onTemplateChange: (info) => {
 *         console.log('模板切换:', info)
 *       },
 *     })
 *   ]
 * })
 * ```
 */
import type { App } from 'vue'
import type { TemplateMetadata } from '@ldesign/template-core'
import { TemplateManager, TemplateRegistry, createTemplateLocaleManager } from '@ldesign/template-core'
import { getBuiltinTemplates } from '../templates'
import { setTemplateManager } from '../plugin/context'
import { setTemplateConfig } from '../plugin/template-config-context'
import type { TemplateConfig } from '../types/config'

/** 全局 locale manager 实例 */
let templateLocaleManager = createTemplateLocaleManager()

/** 引擎类型接口 */
interface EngineLike {
  getApp?: () => App | null
  events?: {
    on: (event: string, handler: (...args: unknown[]) => void) => void
    emit: (event: string, payload?: unknown) => void
    once: (event: string, handler: (...args: unknown[]) => void) => void
  }
  api?: {
    register: (api: { name: string, version: string, [key: string]: unknown }) => void
    get: (name: string) => unknown
  }
  logger?: {
    info: (...args: unknown[]) => void
    debug: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
  }
  /** i18n 实例（可选） */
  i18n?: {
    t: (key: string, ...args: unknown[]) => string
    has?: (key: string) => boolean
    getLocale?: () => string
  }
}

/** 插件上下文 */
interface PluginContext {
  engine?: EngineLike
}

/** 插件接口 */
interface Plugin {
  name: string
  version: string
  dependencies?: string[]
  install: (context: PluginContext | EngineLike) => void | Promise<void>
  uninstall?: (context: PluginContext | EngineLike) => void | Promise<void>
}

/**
 * Template Engine 插件选项
 *
 * 继承自 TemplateConfig，支持完整的模板配置能力
 */
export interface TemplateEnginePluginOptions extends TemplateConfig {
  /** 插件名称 @default 'template' */
  name?: string
  /** 插件版本 @default '1.0.0' */
  version?: string
  /** 是否自动加载内置模板 @default true */
  autoScan?: boolean
  /** 额外的模板列表（用户自定义模板） */
  templates?: TemplateMetadata[]
  /** 是否启用调试模式 @default false */
  debug?: boolean
  /** 全局属性名 @default '$templates' */
  globalPropertyName?: string
}

/**
 * 从插件选项中提取模板配置
 *
 * @param options - 插件选项
 * @returns 模板配置对象
 */
function extractTemplateConfig(options: TemplateEnginePluginOptions): TemplateConfig {
  const { categories, selector, cache, breakpoints, onTemplateChange } = options
  return {
    categories,
    selector,
    cache,
    breakpoints,
    onTemplateChange,
  }
}

/**
 * 创建 Template Engine 插件
 *
 * @param options - 插件配置选项
 * @returns Engine 插件实例
 *
 * @example
 * ```ts
 * createTemplateEnginePlugin({
 *   autoScan: true,
 *   debug: import.meta.env.DEV,
 *   // 分类模板配置
 *   categories: {
 *     login: {
 *       defaults: {
 *         desktop: 'default',
 *         tablet: 'default',
 *         mobile: false, // 禁用移动端
 *       },
 *       disabledMessage: '请在桌面端或平板端访问登录页面',
 *     },
 *     dashboard: {
 *       defaults: {
 *         desktop: 'full',
 *         tablet: 'compact',
 *         mobile: 'minimal',
 *       },
 *     },
 *   },
 *   // 模板选择器配置
 *   selector: {
 *     enabled: true,
 *     position: 'top-right',
 *     showPreview: true,
 *     showDescription: true,
 *     showTags: true,
 *     filter: (templates, category, device) => {
 *       // 自定义过滤逻辑
 *       return templates.filter(t => !t.tags?.includes('deprecated'))
 *     },
 *     props: {
 *       // 传递给选择器组件的额外属性
 *     },
 *   },
 *   // 缓存配置
 *   cache: {
 *     enabled: true,
 *     storage: 'localStorage',
 *     keyPrefix: 'my-app:template:',
 *     ttl: 7 * 24 * 60 * 60 * 1000, // 7天
 *     perUser: true,
 *     getUserId: () => userStore.userId,
 *   },
 *   // 设备断点配置
 *   breakpoints: {
 *     mobile: 768,
 *     tablet: 1024,
 *   },
 *   // 模板切换回调
 *   onTemplateChange: async (info) => {
 *     console.log('模板切换:', info)
 *     // 可在此处保存用户偏好到服务器
 *     await saveUserPreference({
 *       category: info.category,
 *       device: info.device,
 *       templateName: info.templateName,
 *       templateId: info.templateId,
 *     })
 *   },
 * })
 * ```
 */
export function createTemplateEnginePlugin(
  options: TemplateEnginePluginOptions = {},
): Plugin {
  const {
    name = 'template',
    version = '1.0.0',
    autoScan = true,
    templates = [],
    debug = false,
    globalPropertyName = '$templates',
  } = options

  // 提取模板配置
  const templateConfig = extractTemplateConfig(options)

  // Vue 插件安装标志
  let vueInstalled = false

  if (debug) {
    console.log('[Template Plugin] createTemplateEnginePlugin called with options:', options)
    console.log('[Template Plugin] 模板配置:', templateConfig)
  }

  return {
    name,
    version,
    dependencies: [],

    async install(context: PluginContext | EngineLike) {
      const engine = (context as PluginContext).engine || (context as EngineLike)

      if (debug) {
        console.log('[Template Plugin] install called, engine:', !!engine)
      }

      // 设置全局模板配置（供 useTemplate 等使用）
      setTemplateConfig(templateConfig)

      if (debug) {
        console.log('[Template Plugin] 全局模板配置已设置')
      }

      // 创建注册表和管理器
      const registry = new TemplateRegistry()
      const manager = new TemplateManager(registry)

      // 加载内置模板
      if (autoScan) {
        const builtinTemplates = getBuiltinTemplates()
        if (debug) {
          console.log('[Template Plugin] 内置模板:', builtinTemplates.map(t => t.id))
        }
        registry.registerBatch(builtinTemplates)
      }

      // 注册用户自定义模板
      if (templates.length > 0) {
        registry.registerBatch(templates)
        if (debug) {
          console.log('[Template Plugin] 注册自定义模板:', templates.length)
        }
      }

      // 设置全局管理器（供 useTemplate 使用）
      setTemplateManager(manager)

      // 注册 Template API 到 API 注册表
      if (engine?.api?.register) {
        const templateAPI = {
          name: 'template',
          version,
          // 代理管理器方法
          getTemplate: (id: string) => manager.getTemplate(id),
          getTemplatesByCategory: (category: string) => manager.getTemplatesByCategory(category),
          getTemplatesByDevice: (device: string) => manager.getTemplatesByDevice(device),
          getTemplatesByCategoryAndDevice: (category: string, device: string) =>
            manager.getTemplatesByCategoryAndDevice(category, device),
          getDefaultTemplate: (category: string, device: string) =>
            manager.getDefaultTemplate(category, device),
          getTemplateCount: () => manager.getTemplateCount(),
          getAllTemplates: () => manager.getAllTemplates(),
          // 获取管理器实例
          getManager: () => manager,
          // 获取当前配置
          getConfig: () => templateConfig,
        }
        // 注册 API 到 API 注册表（API 对象必须包含 name 和 version）
        engine.api.register(templateAPI)
        if (debug) {
          console.log('[Template Plugin] Template API 已注册到引擎')
        }
      }

      // 安装 Vue 插件
      const installVuePlugin = (app: App): void => {
        if (vueInstalled) return
        vueInstalled = true

        // 提供给组件使用
        app.provide('templateManager', manager)
        app.provide('templateConfig', templateConfig)

        // 全局属性
        app.config.globalProperties[globalPropertyName] = manager

        if (debug) {
          console.log('[Template Plugin] Vue 插件已安装')
          console.log('[Template Plugin] 总模板数:', manager.getTemplateCount())
        }
      }

      // 尝试立即安装到 Vue
      const vueApp = engine?.getApp?.()
      if (vueApp) {
        installVuePlugin(vueApp)
      }
      else {
        // 等待 Vue 应用创建
        engine?.events?.once?.('app:created', (payload: unknown) => {
          const app = (payload as { app?: App })?.app
          if (app) installVuePlugin(app)
        })
      }

      // 监听语言变化事件，实时更新 locale manager
      if (engine?.events?.on) {
        engine.events.on('i18n:localeChanged', (payload: unknown) => {
          const locale = (payload as { locale?: string })?.locale || (payload as string)
          if (locale && typeof locale === 'string') {
            templateLocaleManager.setLocale(locale)
            if (debug) {
              console.log('[Template Plugin] 语言已切换:', locale)
            }
          }
        })
      }

      // 尝试从 engine 获取外部 i18n 实例
      let i18nInstance: any = null
      try {
        // 尝试从容器获取 i18n 实例
        const container = context?.container || (engine as any).container
        if (container && typeof container.has === 'function' && container.has('i18n')) {
          i18nInstance = container.resolve('i18n')
          if (debug) {
            console.log('[Template Plugin] 从容器获取到 i18n 实例')
          }
        }
      }
      catch (error) {
        if (debug) {
          console.log('[Template Plugin] 未在容器中找到 i18n 实例，使用内置 locales')
        }
      }

      // 获取初始语言
      let initialLocale = 'zh-CN'
      if (i18nInstance && typeof i18nInstance.getLocale === 'function') {
        initialLocale = i18nInstance.getLocale()
      }
      else if (engine.state?.get) {
        initialLocale = engine.state.get('i18n:locale') || 'zh-CN'
      }

      // 设置初始语言
      templateLocaleManager.setLocale(initialLocale)
      if (debug) {
        console.log('[Template Plugin] 初始语言:', initialLocale)
      }

      // 如果有 i18n 实例，设置外部 i18n
      if (i18nInstance && typeof i18nInstance.t === 'function') {
        templateLocaleManager.setExternalI18n({
          t: (key: string) => i18nInstance.t(key),
          has: i18nInstance.has ? (key: string) => i18nInstance.has(key) : undefined,
          getLocale: i18nInstance.getLocale ? () => i18nInstance.getLocale() : undefined,
        })
        if (debug) {
          console.log('[Template Plugin] 已集成外部 i18n')
        }
      }
    },

    async uninstall(context: PluginContext | EngineLike) {
      const engine = (context as PluginContext).engine || (context as EngineLike)
      vueInstalled = false

      // 清除全局配置
      setTemplateConfig(null)

      if (debug) {
        console.log('[Template Plugin] uninstall called')
      }
    },
  }
}

/**
 * 获取 Template Locale Manager 实例
 * @returns TemplateLocaleManager 实例
 */
export function getTemplateLocaleManager() {
  return templateLocaleManager
}

