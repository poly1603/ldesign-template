/**
 * 编辑器核心
 */

import type { Component } from 'vue'

export interface EditorElement {
  id: string
  type: string
  component?: Component | string
  props: Record<string, any>
  style: Record<string, any>
  children: EditorElement[]
  parent: string | null
  locked: boolean
  hidden: boolean
}

export interface EditorState {
  elements: Map<string, EditorElement>
  selected: string | null
  clipboard: EditorElement | null
  history: EditorElement[][]
  historyIndex: number
  modified: boolean
}

export interface EditorOptions {
  /** 最大历史记录 */
  maxHistory?: number
  /** 是否启用自动保存 */
  autoSave?: boolean
  /** 自动保存间隔 */
  autoSaveInterval?: number
}

/**
 * 编辑器实例
 */
export class EditorInstance {
  private state: EditorState
  private options: EditorOptions
  private autoSaveTimer: ReturnType<typeof setTimeout> | null = null

  constructor(options: EditorOptions = {}) {
    this.options = {
      maxHistory: options.maxHistory || 50,
      autoSave: options.autoSave ?? true,
      autoSaveInterval: options.autoSaveInterval || 5000,
    }

    this.state = {
      elements: new Map(),
      selected: null,
      clipboard: null,
      history: [],
      historyIndex: -1,
      modified: false,
    }

    if (this.options.autoSave) {
      this.startAutoSave()
    }
  }

  /**
   * 添加元素
   */
  addElement(element: Omit<EditorElement, 'id' | 'children'>, parentId?: string): string {
    const id = this.generateId()

    const newElement: EditorElement = {
      id,
      children: [],
      parent: parentId || null,
      locked: false,
      hidden: false,
      ...element,
    }

    this.state.elements.set(id, newElement)

    // 如果有父元素，添加到父元素的children
    if (parentId) {
      const parent = this.state.elements.get(parentId)
      if (parent) {
        parent.children.push(newElement)
      }
    }

    this.recordHistory()
    return id
  }

  /**
   * 删除元素
   */
  deleteElement(id: string): boolean {
    const element = this.state.elements.get(id)
    if (!element || element.locked) {
      return false
    }

    // 递归删除子元素
    element.children.forEach(child => {
      this.deleteElement(child.id)
    })

    // 从父元素移除
    if (element.parent) {
      const parent = this.state.elements.get(element.parent)
      if (parent) {
        const index = parent.children.findIndex(c => c.id === id)
        if (index > -1) {
          parent.children.splice(index, 1)
        }
      }
    }

    this.state.elements.delete(id)

    if (this.state.selected === id) {
      this.state.selected = null
    }

    this.recordHistory()
    return true
  }

  /**
   * 更新元素属性
   */
  updateElement(id: string, updates: Partial<EditorElement>): boolean {
    const element = this.state.elements.get(id)
    if (!element || element.locked) {
      return false
    }

    Object.assign(element, updates)
    this.recordHistory()
    return true
  }

  /**
   * 选择元素
   */
  select(id: string | null): void {
    this.state.selected = id
  }

  /**
   * 复制元素
   */
  copy(id: string): boolean {
    const element = this.state.elements.get(id)
    if (!element) return false

    this.state.clipboard = this.cloneElement(element)
    return true
  }

  /**
   * 粘贴元素
   */
  paste(parentId?: string): string | null {
    if (!this.state.clipboard) return null

    const cloned = this.cloneElement(this.state.clipboard)
    const id = this.addElement(cloned, parentId)

    return id
  }

  /**
   * 撤销
   */
  undo(): boolean {
    if (this.state.historyIndex <= 0) return false

    this.state.historyIndex--
    this.restoreFromHistory()
    return true
  }

  /**
   * 重做
   */
  redo(): boolean {
    if (this.state.historyIndex >= this.state.history.length - 1) return false

    this.state.historyIndex++
    this.restoreFromHistory()
    return true
  }

  /**
   * 导出为 JSON
   */
  export(): string {
    const root = Array.from(this.state.elements.values())
      .filter(e => !e.parent)

    return JSON.stringify(root, null, 2)
  }

  /**
   * 从 JSON 导入
   */
  import(json: string): boolean {
    try {
      const elements = JSON.parse(json)

      this.state.elements.clear()
      this.state.selected = null

      const loadElement = (el: any, parentId: string | null = null) => {
        this.state.elements.set(el.id, {
          ...el,
          parent: parentId,
        })

        if (el.children) {
          el.children.forEach((child: any) => loadElement(child, el.id))
        }
      }

      elements.forEach((el: any) => loadElement(el))

      this.recordHistory()
      return true
    } catch (error) {
      console.error('[Editor] Import failed:', error)
      return false
    }
  }

  /**
   * 克隆元素
   */
  private cloneElement(element: EditorElement): EditorElement {
    return {
      ...element,
      id: this.generateId(),
      children: element.children.map(child => this.cloneElement(child)),
    }
  }

  /**
   * 记录历史
   */
  private recordHistory(): void {
    const snapshot = Array.from(this.state.elements.values())

    // 移除当前索引后的历史
    if (this.state.historyIndex < this.state.history.length - 1) {
      this.state.history = this.state.history.slice(0, this.state.historyIndex + 1)
    }

    this.state.history.push(snapshot)

    // 限制历史记录数量
    if (this.state.history.length > this.options.maxHistory!) {
      this.state.history.shift()
    } else {
      this.state.historyIndex++
    }

    this.state.modified = true
  }

  /**
   * 从历史恢复
   */
  private restoreFromHistory(): void {
    const snapshot = this.state.history[this.state.historyIndex]
    if (!snapshot) return

    this.state.elements.clear()
    snapshot.forEach(element => {
      this.state.elements.set(element.id, element)
    })
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 开始自动保存
   */
  private startAutoSave(): void {
    this.autoSaveTimer = setInterval(() => {
      if (this.state.modified) {
        this.save()
      }
    }, this.options.autoSaveInterval)
  }

  /**
   * 保存（自动保存钩子）
   */
  private save(): void {
    // 这里可以实现保存到 localStorage 或服务器
    this.state.modified = false
    console.log('[Editor] Auto saved')
  }

  /**
   * 销毁编辑器
   */
  destroy(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = null
    }
  }
}

/**
 * 创建编辑器实例
 */
export function createEditor(options?: EditorOptions): EditorInstance {
  return new EditorInstance(options)
}



