/**
 * 模板检查器
 * 提供模板结构、属性和状态的实时检查
 */

import type { Component } from 'vue'
import type { TemplateMetadata } from '../types'

export interface InspectorData {
  templateId: string
  metadata: TemplateMetadata
  component: Component | null
  props: Record<string, any>
  slots: string[]
  events: string[]
  dependencies: string[]
  state: Record<string, any>
  performance: {
    loadTime: number
    renderTime: number
    updateCount: number
  }
}

/**
 * 模板检查器
 */
export class TemplateInspector {
  private inspectedTemplates = new Map<string, InspectorData>()
  private activeTemplate: string | null = null

  /**
   * 检查模板
   */
  inspect(templateId: string, data: Partial<InspectorData>): void {
    const existing = this.inspectedTemplates.get(templateId)

    if (existing) {
      // 更新现有数据
      Object.assign(existing, data)
    } else {
      // 创建新记录
      this.inspectedTemplates.set(templateId, {
        templateId,
        metadata: data.metadata || {} as TemplateMetadata,
        component: data.component || null,
        props: data.props || {},
        slots: data.slots || [],
        events: data.events || [],
        dependencies: data.dependencies || [],
        state: data.state || {},
        performance: data.performance || {
          loadTime: 0,
          renderTime: 0,
          updateCount: 0,
        },
      })
    }

    this.activeTemplate = templateId
  }

  /**
   * 获取检查数据
   */
  getData(templateId: string): InspectorData | null {
    return this.inspectedTemplates.get(templateId) || null
  }

  /**
   * 获取活跃模板
   */
  getActive(): InspectorData | null {
    return this.activeTemplate ? this.getData(this.activeTemplate) : null
  }

  /**
   * 获取所有检查数据
   */
  getAll(): InspectorData[] {
    return Array.from(this.inspectedTemplates.values())
  }

  /**
   * 更新属性
   */
  updateProps(templateId: string, props: Record<string, any>): void {
    const data = this.inspectedTemplates.get(templateId)
    if (data) {
      data.props = { ...data.props, ...props }
    }
  }

  /**
   * 更新状态
   */
  updateState(templateId: string, state: Record<string, any>): void {
    const data = this.inspectedTemplates.get(templateId)
    if (data) {
      data.state = { ...data.state, ...state }
    }
  }

  /**
   * 记录性能数据
   */
  recordPerformance(
    templateId: string,
    metric: 'loadTime' | 'renderTime' | 'updateCount',
    value: number
  ): void {
    const data = this.inspectedTemplates.get(templateId)
    if (data) {
      data.performance[metric] = value
    }
  }

  /**
   * 清除检查数据
   */
  clear(templateId?: string): void {
    if (templateId) {
      this.inspectedTemplates.delete(templateId)
      if (this.activeTemplate === templateId) {
        this.activeTemplate = null
      }
    } else {
      this.inspectedTemplates.clear()
      this.activeTemplate = null
    }
  }

  /**
   * 导出检查数据
   */
  export(): string {
    return JSON.stringify(Array.from(this.inspectedTemplates.values()), null, 2)
  }
}

/**
 * 全局检查器
 */
let globalInspector: TemplateInspector | null = null

/**
 * 获取全局检查器
 */
export function getInspector(): TemplateInspector {
  if (!globalInspector) {
    globalInspector = new TemplateInspector()
  }
  return globalInspector
}



