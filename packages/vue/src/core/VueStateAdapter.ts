/**
 * Vue State Adapter
 * 
 * 将 Core 的状态管理适配为 Vue 的响应式系统
 */

import { ref, computed, readonly, watch, type Ref, type ComputedRef } from 'vue'
import type { Component } from 'vue'
import { TemplateStateManager, type TemplateState, type StateChangeListener, type TemplateMetadata } from '@ldesign/template-core'

/**
 * Vue 响应式状态
 */
export interface VueTemplateState {
  category: Ref<string>
  device: Ref<string>
  template: Ref<TemplateMetadata<Component> | null>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
}

/**
 * Vue 状态适配器
 * 
 * 将框架无关的 TemplateStateManager 适配为 Vue 的响应式状态
 */
export class VueStateAdapter {
  // Vue 响应式状态
  private categoryRef: Ref<string>
  private deviceRef: Ref<string>
  private templateRef: Ref<TemplateMetadata<Component> | null>
  private isLoadingRef: Ref<boolean>
  private errorRef: Ref<Error | null>
  
  // 计算属性
  private availableCategoriesRef: ComputedRef<string[]>
  private availableDevicesRef: ComputedRef<string[]>
  private availableTemplatesRef: ComputedRef<TemplateMetadata<Component>[]>
  
  private unsubscribe: (() => void) | null = null
  
  constructor(private stateManager: TemplateStateManager<Component>) {
    const initialState = stateManager.getState()
    
    // 初始化响应式 refs
    this.categoryRef = ref(initialState.category)
    this.deviceRef = ref(initialState.device)
    this.templateRef = ref(initialState.template)
    this.isLoadingRef = ref(initialState.isLoading)
    this.errorRef = ref(initialState.error)
    
    // 初始化计算属性
    this.availableCategoriesRef = computed(() => 
      this.stateManager.getAvailableCategories()
    )
    
    this.availableDevicesRef = computed(() => 
      this.stateManager.getAvailableDevices()
    )
    
    this.availableTemplatesRef = computed(() => 
      this.stateManager.getTemplatesForCurrent()
    )
    
    // 监听 Core 状态变更，同步到 Vue 响应式
    this.setupListeners()
    
    // 监听 Vue 响应式变更，同步到 Core 状态
    this.setupWatchers()
  }
  
  /**
   * 设置 Core 状态监听器
   */
  private setupListeners(): void {
    const listener: StateChangeListener<Component> = {
      onCategoryChange: (category) => {
        if (this.categoryRef.value !== category) {
          this.categoryRef.value = category
        }
      },
      onDeviceChange: (device) => {
        if (this.deviceRef.value !== device) {
          this.deviceRef.value = device
        }
      },
      onTemplateChange: (template) => {
        this.templateRef.value = template
      },
      onLoadingChange: (isLoading) => {
        this.isLoadingRef.value = isLoading
      },
      onError: (error) => {
        this.errorRef.value = error
      },
    }
    
    this.unsubscribe = this.stateManager.addListener(listener)
  }
  
  /**
   * 设置 Vue 响应式监听器
   */
  private setupWatchers(): void {
    // 监听分类变更
    watch(this.categoryRef, (newCategory) => {
      if (this.stateManager.getCategory() !== newCategory) {
        this.stateManager.setCategory(newCategory)
      }
    })
    
    // 监听设备变更
    watch(this.deviceRef, (newDevice) => {
      if (this.stateManager.getDevice() !== newDevice) {
        this.stateManager.setDevice(newDevice)
      }
    })
  }
  
  /**
   * 获取响应式状态
   */
  getState(): VueTemplateState {
    return {
      category: this.categoryRef,
      device: this.deviceRef,
      template: this.templateRef,
      isLoading: this.isLoadingRef,
      error: this.errorRef,
    }
  }
  
  /**
   * 获取只读状态（防止外部直接修改）
   */
  getReadonlyState() {
    return {
      category: readonly(this.categoryRef),
      device: readonly(this.deviceRef),
      template: readonly(this.templateRef),
      isLoading: readonly(this.isLoadingRef),
      error: readonly(this.errorRef),
    }
  }
  
  /**
   * 获取计算属性
   */
  getComputedValues() {
    return {
      availableCategories: this.availableCategoriesRef,
      availableDevices: this.availableDevicesRef,
      availableTemplates: this.availableTemplatesRef,
    }
  }
  
  /**
   * 切换分类
   */
  setCategory(category: string): void {
    this.categoryRef.value = category
  }
  
  /**
   * 切换设备
   */
  setDevice(device: string): void {
    this.deviceRef.value = device
  }
  
  /**
   * 切换模板
   */
  switchTemplate(name: string): boolean {
    return this.stateManager.switchToTemplate(name)
  }
  
  /**
   * 设置错误
   */
  setError(error: Error | null): void {
    this.stateManager.setError(error)
  }
  
  /**
   * 清理资源
   */
  dispose(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
  }
}

/**
 * 创建 Vue 状态适配器
 */
export function createVueStateAdapter(
  stateManager: TemplateStateManager<Component>
): VueStateAdapter {
  return new VueStateAdapter(stateManager)
}
