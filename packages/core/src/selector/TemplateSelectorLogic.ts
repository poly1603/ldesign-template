/**
 * Template Selector Logic
 * 
 * 模板选择逻辑 - 纯业务逻辑，框架无关
 */

import type { TemplateStateManager } from '../state/TemplateStateManager'
import type { TemplateRegistry } from '../registry/TemplateRegistry'
import type { TemplateMetadata, TemplateFilter } from '../types'

/**
 * 模板选择器逻辑类
 * 
 * 处理模板选择、过滤、默认模板等业务逻辑
 */
export class TemplateSelectorLogic<TComponent = unknown> {
  constructor(
    private stateManager: TemplateStateManager,
    private registry: TemplateRegistry<TComponent>
  ) {}
  
  /**
   * 获取可用模板列表
   */
  getAvailableTemplates(category: string, device: string): TemplateMetadata[] {
    return this.registry.query({ category, device })
  }
  
  /**
   * 选择模板（更新状态）
   */
  selectTemplate(templateName: string): void {
    const currentState = this.stateManager.getState()
    
    // 检查模板是否存在
    if (!this.registry.has(currentState.category, currentState.device, templateName)) {
      console.warn(`[TemplateSelectorLogic] Template not found: ${templateName}`)
      return
    }
    
    // 更新状态
    this.stateManager.setState({
      template: templateName,
      loading: true,
      error: null,
    })
  }
  
  /**
   * 切换到指定分类和设备的模板
   */
  switchTo(category: string, device: string, templateName?: string): void {
    // 如果没有指定模板名，尝试获取默认模板
    if (!templateName) {
      const defaultTemplate = this.getDefaultTemplate(category, device)
      templateName = defaultTemplate?.name
      
      if (!templateName) {
        console.warn(`[TemplateSelectorLogic] No template found for ${category}/${device}`)
        return
      }
    }
    
    // 更新状态
    this.stateManager.setState({
      category,
      device,
      template: templateName,
      loading: true,
      error: null,
    })
  }
  
  /**
   * 获取默认模板
   */
  getDefaultTemplate(category: string, device: string): TemplateMetadata | null {
    const templates = this.getAvailableTemplates(category, device)
    
    // 优先返回标记为默认的模板
    const defaultTemplate = templates.find(t => t.isDefault)
    if (defaultTemplate) {
      return defaultTemplate
    }
    
    // 如果没有标记默认的，返回第一个
    return templates[0] || null
  }
  
  /**
   * 根据过滤条件查询模板
   */
  queryTemplates(filter: TemplateFilter): TemplateMetadata[] {
    return this.registry.query(filter)
  }
  
  /**
   * 检查模板是否存在
   */
  hasTemplate(category: string, device: string, name: string): boolean {
    return this.registry.has(category, device, name)
  }
  
  /**
   * 按分类获取所有模板
   */
  getTemplatesByCategory(category: string): TemplateMetadata[] {
    return this.registry.query({ category })
  }
  
  /**
   * 按设备类型获取所有模板
   */
  getTemplatesByDevice(device: string): TemplateMetadata[] {
    return this.registry.query({ device })
  }
  
  /**
   * 搜索模板（按名称或描述）
   */
  searchTemplates(keyword: string): TemplateMetadata[] {
    const allTemplates = this.registry.getAllMetadata()
    const lowerKeyword = keyword.toLowerCase()
    
    return allTemplates.filter(t => 
      t.name.toLowerCase().includes(lowerKeyword) ||
      t.displayName.toLowerCase().includes(lowerKeyword) ||
      t.description?.toLowerCase().includes(lowerKeyword) ||
      t.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))
    )
  }
}
