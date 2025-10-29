/**
 * useTemplateRenderer
 * 
 * 核心渲染 composable - 整合所有功能
 */

import { ref, computed, onMounted, onUnmounted, type Ref, type Component } from 'vue'
import {
  TemplateRegistry,
  TemplateStateManager,
  TemplateLoadCoordinator,
  TemplateOrchestrator,
  DeviceDetector,
  createDeviceDetector,
  type OrchestratorOptions,
} from '@ldesign/template-core'
import { VueStateAdapter } from '../core/VueStateAdapter'
import { createVueLoader, createVueStyleLoader } from '../core/VueLoaderAdapter'

/**
 * Renderer 配置
 */
export interface UseTemplateRendererOptions {
  /**
   * 初始分类
   */
  initialCategory: string
  
  /**
   * 初始设备（不提供则自动检测）
   */
  initialDevice?: string
  
  /**
   * 编排器配置
   */
  orchestrator?: OrchestratorOptions
  
  /**
   * 是否启用设备自动检测
   */
  enableDeviceDetection?: boolean
  
  /**
   * 设备检测去抖时间（毫秒）
   */
  deviceDetectionDebounce?: number
}

/**
 * Renderer 返回值
 */
export interface TemplateRendererResult {
  // 当前加载的组件
  component: Ref<Component | null>
  
  // 响应式状态
  category: Ref<string>
  device: Ref<string>
  template: Ref<any>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  
  // 可用选项
  availableCategories: Ref<string[]>
  availableDevices: Ref<string[]>
  availableTemplates: Ref<any[]>
  
  // 操作方法
  switchCategory: (category: string) => Promise<void>
  switchDevice: (device: string) => Promise<void>
  switchTemplate: (name: string) => Promise<void>
  reload: () => Promise<void>
  
  // 设备检测
  deviceDetector: DeviceDetector | null
}

/**
 * 全局注册表实例（单例）
 */
let globalRegistry: TemplateRegistry<Component> | null = null

/**
 * 获取或创建全局注册表
 */
export function getGlobalRegistry(): TemplateRegistry<Component> {
  if (!globalRegistry) {
    globalRegistry = new TemplateRegistry<Component>()
  }
  return globalRegistry
}

/**
 * 核心模板渲染 composable
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useTemplateRenderer } from '@ldesign/template-vue'
 * 
 * const {
 *   component,
 *   category,
 *   device,
 *   isLoading,
 *   switchCategory,
 *   switchDevice,
 * } = useTemplateRenderer({
 *   initialCategory: 'login',
 *   enableDeviceDetection: true,
 * })
 * </script>
 * 
 * <template>
 *   <component :is="component" v-if="component && !isLoading" />
 *   <div v-else-if="isLoading">Loading...</div>
 * </template>
 * ```
 */
export function useTemplateRenderer(
  options: UseTemplateRendererOptions
): TemplateRendererResult {
  const registry = getGlobalRegistry()
  
  // 设备检测
  let deviceDetector: DeviceDetector | null = null
  const detectedDevice = ref<string>('desktop')
  
  if (options.enableDeviceDetection !== false) {
    deviceDetector = createDeviceDetector()
    detectedDevice.value = deviceDetector.detect()
  }
  
  const initialDevice = options.initialDevice || detectedDevice.value
  
  // 创建核心管理器
  const stateManager = new TemplateStateManager<Component>(
    registry,
    options.initialCategory,
    initialDevice
  )
  
  const componentLoader = createVueLoader()
  const styleLoader = createVueStyleLoader()
  
  const loadCoordinator = new TemplateLoadCoordinator<Component>(
    componentLoader,
    registry,
    styleLoader
  )
  
  const orchestrator = new TemplateOrchestrator<Component>(
    stateManager,
    loadCoordinator,
    options.orchestrator
  )
  
  // 创建 Vue 适配器
  const vueAdapter = new VueStateAdapter(stateManager)
  const state = vueAdapter.getState()
  const computed = vueAdapter.getComputedValues()
  
  // 当前加载的组件
  const component = ref<Component | null>(null)
  
  // 初始化
  onMounted(async () => {
    try {
      await orchestrator.initialize()
      component.value = orchestrator.getLoadedComponent()
    } catch (error) {
      console.error('[useTemplateRenderer] Initialization failed:', error)
    }
    
    // 启动设备检测
    if (deviceDetector && options.enableDeviceDetection !== false) {
      const stopDetection = deviceDetector.startAutoDetect(
        options.deviceDetectionDebounce || 300
      )
      
      // 监听设备变化
      const unsubscribe = deviceDetector.onChange((newDevice) => {
        vueAdapter.setDevice(newDevice)
      })
      
      onUnmounted(() => {
        stopDetection()
        unsubscribe()
      })
    }
  })
  
  // 清理
  onUnmounted(() => {
    orchestrator.dispose()
    vueAdapter.dispose()
    if (deviceDetector) {
      deviceDetector.dispose()
    }
  })
  
  // 操作方法
  const switchCategory = async (category: string) => {
    const result = await orchestrator.switchCategory(category)
    if (result) {
      component.value = result
    }
  }
  
  const switchDevice = async (device: string) => {
    const result = await orchestrator.switchDevice(device)
    if (result) {
      component.value = result
    }
  }
  
  const switchTemplate = async (name: string) => {
    const result = await orchestrator.switchTemplate(name)
    if (result) {
      component.value = result
    }
  }
  
  const reload = async () => {
    const result = await orchestrator.loadCurrentTemplate()
    if (result) {
      component.value = result
    }
  }
  
  return {
    // 组件
    component,
    
    // 状态
    category: state.category,
    device: state.device,
    template: state.template,
    isLoading: state.isLoading,
    error: state.error,
    
    // 计算属性
    availableCategories: computed.availableCategories,
    availableDevices: computed.availableDevices,
    availableTemplates: computed.availableTemplates,
    
    // 方法
    switchCategory,
    switchDevice,
    switchTemplate,
    reload,
    
    // 设备检测器
    deviceDetector,
  }
}
