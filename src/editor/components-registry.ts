/**
 * 组件注册表
 * 管理可用于编辑器的组件库
 */

import type { Component } from 'vue'

export interface ComponentDefinition {
  id: string
  name: string
  displayName: string
  category: string
  icon?: string
  description?: string
  component: Component | string
  defaultProps?: Record<string, any>
  propSchema?: Record<string, PropDefinition>
  previewImage?: string
  tags?: string[]
}

export interface PropDefinition {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function'
  default?: any
  required?: boolean
  description?: string
  options?: any[]
  min?: number
  max?: number
  validator?: (value: any) => boolean
}

/**
 * 组件注册表
 */
export class ComponentsRegistry {
  private components = new Map<string, ComponentDefinition>()
  private categories = new Map<string, string[]>()

  /**
   * 注册组件
   */
  register(definition: ComponentDefinition): void {
    this.components.set(definition.id, definition)

    // 更新分类索引
    if (!this.categories.has(definition.category)) {
      this.categories.set(definition.category, [])
    }

    const categoryComponents = this.categories.get(definition.category)!
    if (!categoryComponents.includes(definition.id)) {
      categoryComponents.push(definition.id)
    }
  }

  /**
   * 批量注册
   */
  registerMany(definitions: ComponentDefinition[]): void {
    definitions.forEach(def => this.register(def))
  }

  /**
   * 获取组件定义
   */
  get(id: string): ComponentDefinition | null {
    return this.components.get(id) || null
  }

  /**
   * 获取所有组件
   */
  getAll(): ComponentDefinition[] {
    return Array.from(this.components.values())
  }

  /**
   * 按分类获取组件
   */
  getByCategory(category: string): ComponentDefinition[] {
    const ids = this.categories.get(category) || []
    return ids.map(id => this.components.get(id)!).filter(Boolean)
  }

  /**
   * 获取所有分类
   */
  getCategories(): string[] {
    return Array.from(this.categories.keys())
  }

  /**
   * 搜索组件
   */
  search(query: string): ComponentDefinition[] {
    const lowerQuery = query.toLowerCase()

    return this.getAll().filter(comp =>
      comp.name.toLowerCase().includes(lowerQuery) ||
      comp.displayName.toLowerCase().includes(lowerQuery) ||
      comp.description?.toLowerCase().includes(lowerQuery) ||
      comp.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * 注销组件
   */
  unregister(id: string): boolean {
    const definition = this.components.get(id)
    if (!definition) return false

    this.components.delete(id)

    // 从分类中移除
    const categoryComponents = this.categories.get(definition.category)
    if (categoryComponents) {
      const index = categoryComponents.indexOf(id)
      if (index > -1) {
        categoryComponents.splice(index, 1)
      }
    }

    return true
  }

  /**
   * 清空注册表
   */
  clear(): void {
    this.components.clear()
    this.categories.clear()
  }
}

/**
 * 全局组件注册表
 */
let globalRegistry: ComponentsRegistry | null = null

/**
 * 获取全局组件注册表
 */
export function getComponentsRegistry(): ComponentsRegistry {
  if (!globalRegistry) {
    globalRegistry = new ComponentsRegistry()

    // 注册内置组件
    registerBuiltInComponents(globalRegistry)
  }
  return globalRegistry
}

/**
 * 注册内置组件
 */
function registerBuiltInComponents(registry: ComponentsRegistry): void {
  // 基础组件
  registry.registerMany([
    {
      id: 'div',
      name: 'div',
      displayName: '容器',
      category: 'layout',
      component: 'div',
      icon: '📦',
      description: '通用容器元素',
      defaultProps: {},
      propSchema: {
        class: { type: 'string', description: 'CSS 类名' },
        style: { type: 'object', description: '内联样式' },
      },
    },
    {
      id: 'button',
      name: 'button',
      displayName: '按钮',
      category: 'form',
      component: 'button',
      icon: '🔘',
      description: '按钮元素',
      defaultProps: { type: 'button' },
      propSchema: {
        type: { type: 'string', options: ['button', 'submit', 'reset'] },
        disabled: { type: 'boolean' },
      },
    },
    {
      id: 'input',
      name: 'input',
      displayName: '输入框',
      category: 'form',
      component: 'input',
      icon: '📝',
      description: '输入框元素',
      defaultProps: { type: 'text' },
      propSchema: {
        type: { type: 'string', options: ['text', 'password', 'email', 'number'] },
        placeholder: { type: 'string' },
        disabled: { type: 'boolean' },
      },
    },
  ])
}



