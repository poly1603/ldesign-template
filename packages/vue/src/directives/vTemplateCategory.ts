/**
 * v-template-category 指令
 *
 * @description 根据当前模板分类控制元素显示/隐藏
 *
 * @module @ldesign/template-vue/directives
 * @author LDesign Team
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 仅在登录模板中显示 -->
 *   <div v-template-category="'login'">登录页专属内容</div>
 *
 *   <!-- 多分类支持 -->
 *   <div v-template-category="['login', 'register']">认证页专属内容</div>
 *
 *   <!-- 排除模式（非登录模板显示） -->
 *   <div v-template-category.exclude="'login'">非登录页内容</div>
 *
 *   <!-- 禁用而非隐藏 -->
 *   <button v-template-category.disable="'admin'">管理页专属按钮</button>
 * </template>
 * ```
 */

import type { Directive, DirectiveBinding } from 'vue'
import { getCurrentCategory, onCategoryChange } from '../plugin/template-config-context'

/**
 * 分类指令绑定值类型
 */
export type TemplateCategoryDirectiveValue =
  | string
  | string[]
  | {
    /** 需要的分类 */
    categories: string | string[]
    /** 检查模式 */
    mode?: 'include' | 'exclude'
    /** 无匹配时的行为 */
    action?: 'hide' | 'disable' | 'remove'
  }

/**
 * 分类指令修饰符
 */
export interface TemplateCategoryDirectiveModifiers {
  /** 禁用元素而非隐藏 */
  disable?: boolean
  /** 移除元素而非隐藏 */
  remove?: boolean
  /** 排除模式（显示非指定分类） */
  exclude?: boolean
}

/** 存储原始显示样式 */
const originalDisplayMap = new WeakMap<HTMLElement, string>()

/** 存储占位注释节点 */
const placeholderMap = new WeakMap<HTMLElement, Comment>()

/** 存储取消订阅函数 */
const unsubscribeMap = new WeakMap<HTMLElement, () => void>()

/**
 * 解析指令绑定值
 */
function parseBinding(
  binding: DirectiveBinding<TemplateCategoryDirectiveValue>,
): {
  categories: string[]
  mode: 'include' | 'exclude'
  action: 'hide' | 'disable' | 'remove'
} {
  const { value, modifiers } = binding

  // 默认值
  let categories: string[] = []
  let mode: 'include' | 'exclude' = 'include'
  let action: 'hide' | 'disable' | 'remove' = 'hide'

  // 从修饰符解析行为
  if (modifiers.disable) action = 'disable'
  if (modifiers.remove) action = 'remove'
  if (modifiers.exclude) mode = 'exclude'

  // 解析值
  if (typeof value === 'string') {
    categories = [value]
  }
  else if (Array.isArray(value)) {
    categories = value
  }
  else if (value && typeof value === 'object') {
    categories = Array.isArray(value.categories) ? value.categories : [value.categories]
    mode = value.mode ?? mode
    action = value.action ?? action
  }

  return { categories, mode, action }
}

/**
 * 检查分类是否匹配
 */
function checkCategoryMatch(
  currentCategory: string | undefined,
  categories: string[],
  mode: 'include' | 'exclude',
): boolean {
  if (categories.length === 0) return true
  if (!currentCategory) return mode === 'exclude'

  const isIncluded = categories.includes(currentCategory)
  return mode === 'include' ? isIncluded : !isIncluded
}

/**
 * 更新元素状态
 */
function updateElement(
  el: HTMLElement,
  isMatch: boolean,
  action: 'hide' | 'disable' | 'remove',
): void {
  if (isMatch) {
    restoreElement(el, action)
  }
  else {
    applyRestriction(el, action)
  }
}

/**
 * 应用限制（隐藏/禁用/移除）
 */
function applyRestriction(
  el: HTMLElement,
  action: 'hide' | 'disable' | 'remove',
): void {
  switch (action) {
    case 'hide':
      if (!originalDisplayMap.has(el)) {
        originalDisplayMap.set(el, el.style.display)
      }
      el.style.display = 'none'
      break

    case 'disable':
      el.setAttribute('disabled', 'disabled')
      el.classList.add('template-category-disabled')
      el.style.pointerEvents = 'none'
      el.style.opacity = '0.5'
      break

    case 'remove':
      if (!placeholderMap.has(el)) {
        const placeholder = document.createComment('v-template-category')
        placeholderMap.set(el, placeholder)
      }
      const placeholder = placeholderMap.get(el)!
      if (el.parentNode && !placeholder.parentNode) {
        el.parentNode.insertBefore(placeholder, el)
        el.parentNode.removeChild(el)
      }
      break
  }
}

/**
 * 恢复元素状态
 */
function restoreElement(
  el: HTMLElement,
  action: 'hide' | 'disable' | 'remove',
): void {
  switch (action) {
    case 'hide':
      const originalDisplay = originalDisplayMap.get(el)
      el.style.display = originalDisplay ?? ''
      break

    case 'disable':
      el.removeAttribute('disabled')
      el.classList.remove('template-category-disabled')
      el.style.pointerEvents = ''
      el.style.opacity = ''
      break

    case 'remove':
      const placeholder = placeholderMap.get(el)
      if (placeholder?.parentNode) {
        placeholder.parentNode.insertBefore(el, placeholder)
        placeholder.parentNode.removeChild(placeholder)
      }
      break
  }
}

/**
 * 检查并更新元素
 */
function checkAndUpdate(
  el: HTMLElement,
  binding: DirectiveBinding<TemplateCategoryDirectiveValue>,
): void {
  const { categories, mode, action } = parseBinding(binding)
  const currentCategory = getCurrentCategory()
  const isMatch = checkCategoryMatch(currentCategory, categories, mode)
  updateElement(el, isMatch, action)
}

/**
 * v-template-category 指令
 */
export const vTemplateCategory: Directive<HTMLElement, TemplateCategoryDirectiveValue> = {
  mounted(el, binding) {
    // 初始检查
    checkAndUpdate(el, binding)

    // 监听分类变化
    const unsubscribe = onCategoryChange(() => {
      checkAndUpdate(el, binding)
    })

    unsubscribeMap.set(el, unsubscribe)
  },

  updated(el, binding) {
    checkAndUpdate(el, binding)
  },

  unmounted(el) {
    // 取消订阅
    const unsubscribe = unsubscribeMap.get(el)
    if (unsubscribe) {
      unsubscribe()
      unsubscribeMap.delete(el)
    }

    // 清理缓存
    originalDisplayMap.delete(el)
    placeholderMap.delete(el)
  },
}

/**
 * 创建分类指令（用于自定义配置）
 */
export function createTemplateCategoryDirective(): Directive<HTMLElement, TemplateCategoryDirectiveValue> {
  return vTemplateCategory
}

export default vTemplateCategory

