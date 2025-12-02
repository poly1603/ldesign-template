/**
 * Template 包的多语言管理器
 *
 * 支持外部 i18n 注入 + 内置 fallback
 *
 * @module locales/manager
 */

import * as locales from './index'
import type { TemplateLocale } from './index'

/** 支持的语言键 */
export type LocaleKey = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR' | 'de-DE' | 'fr-FR' | 'es-ES'

/** 外部 i18n 实例接口 */
export interface ExternalI18n {
  getLocale?: () => string
  t: (key: string, ...args: unknown[]) => string
  has?: (key: string) => boolean
}

/**
 * Template 多语言管理器
 *
 * 设计原则：
 * 1. 优先使用外部 i18n（如果有）
 * 2. 外部 i18n 不存在或翻译失败时，使用内置 locales
 * 3. 支持动态切换语言
 */
export class TemplateLocaleManager {
  private builtInLocales: Record<string, TemplateLocale> = {
    'zh-CN': locales.zhCN,
    'en-US': locales.enUS,
    'ja-JP': locales.jaJP,
    'ko-KR': locales.koKR,
    'de-DE': locales.deDE,
    'fr-FR': locales.frFR,
    'es-ES': locales.esES,
  }

  private externalI18n: ExternalI18n | null = null
  private currentLocale: LocaleKey = 'zh-CN'
  private fallbackLocale: LocaleKey = 'en-US'

  constructor(locale: LocaleKey = 'zh-CN', fallbackLocale: LocaleKey = 'en-US') {
    this.currentLocale = locale
    this.fallbackLocale = fallbackLocale
  }

  setExternalI18n(i18n: ExternalI18n | null): void {
    this.externalI18n = i18n
  }

  setLocale(locale: string): void {
    const normalizedLocale = this.normalizeLocale(locale)
    if (this.builtInLocales[normalizedLocale]) {
      this.currentLocale = normalizedLocale as LocaleKey
    }
  }

  getLocale(): LocaleKey {
    return this.currentLocale
  }

  t(key: string): string {
    if (this.externalI18n) {
      try {
        const namespacedKey = `template.${key}`
        if (this.externalI18n.has && !this.externalI18n.has(namespacedKey)) {
          return this.getBuiltInTranslation(key)
        }
        const translation = this.externalI18n.t(namespacedKey)
        if (translation && translation !== namespacedKey) {
          return translation
        }
      }
      catch (error) {
        console.warn('[TemplateLocaleManager] External i18n translation failed:', error)
      }
    }
    return this.getBuiltInTranslation(key)
  }

  /**
   * 获取模板的翻译名称
   * @param templateName - 模板名称（如 sidebar, mix 等）
   * @param fallback - 如果没有翻译时的备用显示名称
   * @returns 翻译后的显示名称
   */
  getTemplateDisplayName(templateName: string, fallback?: string): string {
    const translation = this.t(`templates.${templateName}.displayName`)
    // 如果返回的是 key 本身，说明没有找到翻译
    if (translation === `templates.${templateName}.displayName`) {
      return fallback || templateName
    }
    return translation
  }

  /**
   * 获取模板的翻译描述
   * @param templateName - 模板名称（如 sidebar, mix 等）
   * @param fallback - 如果没有翻译时的备用描述
   * @returns 翻译后的描述
   */
  getTemplateDescription(templateName: string, fallback?: string): string {
    const translation = this.t(`templates.${templateName}.description`)
    // 如果返回的是 key 本身，说明没有找到翻译
    if (translation === `templates.${templateName}.description`) {
      return fallback || ''
    }
    return translation
  }

  private getBuiltInTranslation(key: string): string {
    const currentLocaleData = this.builtInLocales[this.currentLocale]
    if (currentLocaleData) {
      const value = this.getNestedValue(currentLocaleData, key)
      if (value) return value
    }
    const fallbackLocaleData = this.builtInLocales[this.fallbackLocale]
    if (fallbackLocaleData) {
      const value = this.getNestedValue(fallbackLocaleData, key)
      if (value) return value
    }
    return key
  }

  private getNestedValue(obj: unknown, path: string): string | undefined {
    const keys = path.split('.')
    let current = obj as Record<string, unknown>
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k] as Record<string, unknown>
      }
      else {
        return undefined
      }
    }
    return typeof current === 'string' ? current : undefined
  }

  private normalizeLocale(locale: string): string {
    const lower = locale.toLowerCase()
    const mapping: Record<string, string> = {
      'zh-cn': 'zh-CN', 'zh_cn': 'zh-CN', 'zhcn': 'zh-CN', 'zh': 'zh-CN',
      'en-us': 'en-US', 'en_us': 'en-US', 'enus': 'en-US', 'en': 'en-US',
      'ja-jp': 'ja-JP', 'ja_jp': 'ja-JP', 'jajp': 'ja-JP', 'ja': 'ja-JP',
      'ko-kr': 'ko-KR', 'ko_kr': 'ko-KR', 'kokr': 'ko-KR', 'ko': 'ko-KR',
      'de-de': 'de-DE', 'de_de': 'de-DE', 'dede': 'de-DE', 'de': 'de-DE',
      'fr-fr': 'fr-FR', 'fr_fr': 'fr-FR', 'frfr': 'fr-FR', 'fr': 'fr-FR',
      'es-es': 'es-ES', 'es_es': 'es-ES', 'eses': 'es-ES', 'es': 'es-ES',
    }
    return mapping[lower] || locale
  }

  getSupportedLocales(): LocaleKey[] {
    return Object.keys(this.builtInLocales) as LocaleKey[]
  }

  isSupported(locale: string): boolean {
    const normalized = this.normalizeLocale(locale)
    return normalized in this.builtInLocales
  }
}

/** 创建默认的 TemplateLocaleManager 实例 */
export function createTemplateLocaleManager(
  locale: LocaleKey = 'zh-CN',
  fallbackLocale: LocaleKey = 'en-US',
): TemplateLocaleManager {
  return new TemplateLocaleManager(locale, fallbackLocale)
}