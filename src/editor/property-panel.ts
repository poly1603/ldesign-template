/**
 * 属性面板
 * 提供元素属性的可视化编辑
 */

import type { PropDefinition } from './components-registry'

export interface PropertyGroup {
  name: string
  label: string
  properties: string[]
  collapsed?: boolean
}

export interface PropertyChange {
  elementId: string
  property: string
  oldValue: any
  newValue: any
  timestamp: number
}

/**
 * 属性面板管理器
 */
export class PropertyPanel {
  private propertyGroups: PropertyGroup[] = [
    {
      name: 'basic',
      label: '基础属性',
      properties: ['id', 'class', 'style'],
    },
    {
      name: 'layout',
      label: '布局',
      properties: ['width', 'height', 'margin', 'padding'],
    },
    {
      name: 'typography',
      label: '文字',
      properties: ['fontSize', 'fontWeight', 'color', 'textAlign'],
    },
    {
      name: 'advanced',
      label: '高级',
      properties: [],
      collapsed: true,
    },
  ]

  private changeHistory: PropertyChange[] = []
  private maxHistory = 100

  /**
   * 获取属性分组
   */
  getGroups(): PropertyGroup[] {
    return this.propertyGroups
  }

  /**
   * 添加分组
   */
  addGroup(group: PropertyGroup): void {
    this.propertyGroups.push(group)
  }

  /**
   * 记录属性变化
   */
  recordChange(change: Omit<PropertyChange, 'timestamp'>): void {
    this.changeHistory.push({
      ...change,
      timestamp: Date.now(),
    })

    // 限制历史大小
    if (this.changeHistory.length > this.maxHistory) {
      this.changeHistory.shift()
    }
  }

  /**
   * 获取变化历史
   */
  getHistory(elementId?: string): PropertyChange[] {
    if (elementId) {
      return this.changeHistory.filter(c => c.elementId === elementId)
    }
    return this.changeHistory
  }

  /**
   * 清除历史
   */
  clearHistory(): void {
    this.changeHistory = []
  }

  /**
   * 验证属性值
   */
  validateProperty(value: any, definition: PropDefinition): boolean {
    // 类型检查
    if (definition.type && typeof value !== definition.type) {
      return false
    }

    // 范围检查
    if (definition.type === 'number') {
      if (definition.min !== undefined && value < definition.min) {
        return false
      }
      if (definition.max !== undefined && value > definition.max) {
        return false
      }
    }

    // 选项检查
    if (definition.options && !definition.options.includes(value)) {
      return false
    }

    // 自定义验证器
    if (definition.validator && !definition.validator(value)) {
      return false
    }

    return true
  }

  /**
   * 格式化属性值（用于显示）
   */
  formatValue(value: any, definition: PropDefinition): string {
    if (value === null || value === undefined) {
      return ''
    }

    switch (definition.type) {
      case 'boolean':
        return value ? '是' : '否'

      case 'object':
      case 'array':
        return JSON.stringify(value)

      case 'function':
        return '[Function]'

      default:
        return String(value)
    }
  }

  /**
   * 解析属性值（从字符串）
   */
  parseValue(str: string, definition: PropDefinition): any {
    switch (definition.type) {
      case 'number':
        return Number(str)

      case 'boolean':
        return str === 'true' || str === '是'

      case 'object':
      case 'array':
        try {
          return JSON.parse(str)
        } catch {
          return definition.default
        }

      default:
        return str
    }
  }
}

/**
 * 全局属性面板
 */
let globalPropertyPanel: PropertyPanel | null = null

/**
 * 获取全局属性面板
 */
export function getPropertyPanel(): PropertyPanel {
  if (!globalPropertyPanel) {
    globalPropertyPanel = new PropertyPanel()
  }
  return globalPropertyPanel
}



