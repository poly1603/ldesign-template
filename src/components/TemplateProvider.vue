<template>
  <div class="template-provider">
    <!-- 模板内容渲染区域 -->
    <div class="template-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import type { DeviceType, Template } from '../types'

// Props定义
interface Props {
  category: string
  defaultTemplates?: Record<string, string>
  autoSwitchByDevice?: boolean
  storageKey?: string
  storageType?: 'localStorage' | 'sessionStorage'
}

const props = withDefaults(defineProps<Props>(), {
  autoSwitchByDevice: false,
  storageType: 'localStorage'
})

// Events定义
const emit = defineEmits<{
  'template:change': [template: Template]
  'template:error': [error: string]
  'device:change': [device: DeviceType]
}>()

// 状态
const isLoading = ref(false)
const error = ref<string | null>(null)
const currentTemplate = ref<Template | null>(null)

// 提供给子组件的上下文
provide('templateProvider', {
  isLoading,
  error,
  currentTemplate,
  category: props.category
})
</script>

<style scoped>
.template-provider {
  width: 100%;
  height: 100%;
}

.template-content {
  width: 100%;
  height: 100%;
}
</style>