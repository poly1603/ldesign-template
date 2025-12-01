/**
 * v-template-device 指令
 *
 * @description 根据设备类型控制元素显示/隐藏
 *
 * @module @ldesign/template-vue/directives
 * @author LDesign Team
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 仅在桌面端显示 -->
 *   <div v-template-device.desktop>桌面端专属内容</div>
 *
 *   <!-- 仅在移动端显示 -->
 *   <div v-template-device.mobile>移动端内容</div>
 *
 *   <!-- 仅在平板端显示 -->
 *   <div v-template-device.tablet>平板端内容</div>
 *
 *   <!-- 多设备支持 -->
 *   <div v-template-device="['desktop', 'tablet']">非移动端内容</div>
 *
 *   <!-- 禁用而非隐藏 -->
 *   <button v-template-device.mobile.disable>移动端禁用此按钮</button>
 *
 *   <!-- 移除元素而非隐藏 -->
 *   <div v-template-device.desktop.remove>桌面端专属（移除模式）</div>
 * </template>
 * ```
 */

import type { Directive, DirectiveBinding } from 'vue'
import type { DeviceType } from '../types/config'
import { getBreakpoints } from '../plugin/template-config-context'

/**
 * 设备指令绑定值类型
 */
export type TemplateDeviceDirectiveValue =
  | DeviceType
  | DeviceType[]
  | {
    /** 需要的设备类型 */
    devices: DeviceType | DeviceType[]
    /** 检查模式 */
    mode?: 'include' | 'exclude'
    /** 无匹配时的行为 */
    action?: 'hide' | 'disable' | 'remove'
  }

/**
 * 设备指令修饰符
 */
export interface TemplateDeviceDirectiveModifiers {
  /** 桌面端 */
  desktop?: boolean
  /** 平板端 */
  tablet?: boolean
  /** 移动端 */
  mobile?: boolean
  /** 禁用元素而非隐藏 */
  disable?: boolean
  /** 移除元素而非隐藏 */
  remove?: boolean
  /** 排除模式（显示非指定设备） */
  exclude?: boolean
}

/** 存储原始显示样式 */
const originalDisplayMap = new WeakMap<HTMLElement, string>()

/** 存储占位注释节点 */
const placeholderMap = new WeakMap<HTMLElement, Comment>()

/** 存储 resize 监听器清理函数 */
const cleanupMap = new WeakMap<HTMLElement, () => void>()

/**
 * 根据宽度计算设备类型
 */
function calculateDeviceType(width: number): DeviceType {
  const bp = getBreakpoints()
  if (width < bp.mobile) return 'mobile'
  if (width < bp.tablet) return 'tablet'
  return 'desktop'
}

/**
 * 获取当前设备类型
 */
function getCurrentDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop'
  return calculateDeviceType(window.innerWidth)
}

/**
 * 解析指令绑定值
 */
function parseBinding(
  binding: DirectiveBinding<TemplateDeviceDirectiveValue>,
): {
  devices: DeviceType[]
  mode: 'include' | 'exclude'
  action: 'hide' | 'disable' | 'remove'
} {
  const { value, modifiers } = binding

  // 默认值
  let devices: DeviceType[] = []
  let mode: 'include' | 'exclude' = 'include'
  let action: 'hide' | 'disable' | 'remove' = 'hide'

  // 从修饰符解析设备类型
  if (modifiers.desktop) devices.push('desktop')
  if (modifiers.tablet) devices.push('tablet')
  if (modifiers.mobile) devices.push('mobile')

  // 从修饰符解析行为
  if (modifiers.disable) action = 'disable'
  if (modifiers.remove) action = 'remove'
  if (modifiers.exclude) mode = 'exclude'

  // 解析值
  if (typeof value === 'string') {
    devices = [value as DeviceType]
  }
  else if (Array.isArray(value)) {
    devices = value
  }
  else if (value && typeof value === 'object') {
    devices = Array.isArray(value.devices) ? value.devices : [value.devices]
    mode = value.mode ?? mode
    action = value.action ?? action
  }

  return { devices, mode, action }
}

/**
 * 检查设备类型是否匹配
 */
function checkDeviceMatch(
  currentDevice: DeviceType,
  devices: DeviceType[],
  mode: 'include' | 'exclude',
): boolean {
  if (devices.length === 0) return true

  const isIncluded = devices.includes(currentDevice)
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
      // 保存原始显示样式
      if (!originalDisplayMap.has(el)) {
        originalDisplayMap.set(el, el.style.display)
      }
      el.style.display = 'none'
      break

    case 'disable':
      el.setAttribute('disabled', 'disabled')
      el.classList.add('template-device-disabled')
      el.style.pointerEvents = 'none'
      el.style.opacity = '0.5'
      break

    case 'remove':
      // 创建占位注释节点
      if (!placeholderMap.has(el)) {
        const placeholder = document.createComment('v-template-device')
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
      // 恢复原始显示样式
      const originalDisplay = originalDisplayMap.get(el)
      el.style.display = originalDisplay ?? ''
      break

    case 'disable':
      el.removeAttribute('disabled')
      el.classList.remove('template-device-disabled')
      el.style.pointerEvents = ''
      el.style.opacity = ''
      break

    case 'remove':
      // 恢复元素到占位符位置
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
  binding: DirectiveBinding<TemplateDeviceDirectiveValue>,
): void {
  const { devices, mode, action } = parseBinding(binding)
  const currentDevice = getCurrentDeviceType()
  const isMatch = checkDeviceMatch(currentDevice, devices, mode)
  updateElement(el, isMatch, action)
}

/**
 * v-template-device 指令
 */
export const vTemplateDevice: Directive<HTMLElement, TemplateDeviceDirectiveValue> = {
  mounted(el, binding) {
    // 初始检查
    checkAndUpdate(el, binding)

    // 监听窗口大小变化
    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const handleResize = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        checkAndUpdate(el, binding)
      }, 100)
    }

    window.addEventListener('resize', handleResize)

    // 存储清理函数
    cleanupMap.set(el, () => {
      window.removeEventListener('resize', handleResize)
      if (debounceTimer) clearTimeout(debounceTimer)
    })
  },

  updated(el, binding) {
    checkAndUpdate(el, binding)
  },

  unmounted(el) {
    // 清理监听器
    const cleanup = cleanupMap.get(el)
    if (cleanup) {
      cleanup()
      cleanupMap.delete(el)
    }

    // 清理缓存
    originalDisplayMap.delete(el)
    placeholderMap.delete(el)
  },
}

/**
 * 创建设备指令（用于自定义配置）
 */
export function createTemplateDeviceDirective(): Directive<HTMLElement, TemplateDeviceDirectiveValue> {
  return vTemplateDevice
}

export default vTemplateDevice

