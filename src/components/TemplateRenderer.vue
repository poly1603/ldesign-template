<template>
  <div class="template-renderer">
    <!-- 加载状态 -->
    <div v-if="template.status === 'loading' && showLoading" class="renderer-loading">
      <slot name="loading">
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <span>渲染模板中...</span>
        </div>
      </slot>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="template.status === 'error' && showError" class="renderer-error">
      <slot name="error" :error="template.error">
        <div class="error-content">
          <h4>模板渲染失败</h4>
          <p>{{ template.error?.message || '未知错误' }}</p>
          <details v-if="template.error">
            <summary>错误详情</summary>
            <pre>{{ template.error.stack }}</pre>
          </details>
        </div>
      </slot>
    </div>

    <!-- 模板内容 -->
    <div v-else-if="template.component" class="renderer-content">
      <!-- 动态渲染模板组件 -->
      <component
        :is="template.component"
        v-bind="mergedProps"
        :template-config="template.config"
        class="template-component"
      />
      
      <!-- 样式通过JavaScript注入到head中 -->
    </div>

    <!-- 无组件状态 -->
    <div v-else class="renderer-empty">
      <slot name="empty">
        <div class="empty-content">
          <p>模板组件未加载</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { TemplateRendererProps } from '../types'

// 组件属性
const props = withDefaults(defineProps<TemplateRendererProps>(), {
  props: () => ({}),
  showLoading: true,
  showError: true
})

// 组件事件
const emit = defineEmits<{
  /** 渲染完成事件 */
  'render-complete': []
  /** 渲染错误事件 */
  'render-error': [error: Error]
  /** 组件挂载事件 */
  'component-mounted': []
  /** 组件卸载事件 */
  'component-unmounted': []
}>()

// 合并属性
const mergedProps = computed(() => ({
  ...props.template.config.props,
  ...props.props
}))

// 渲染状态
const isRendered = ref(false)

// 监听模板状态变化
const handleTemplateStatusChange = () => {
  if (props.template.status === 'loaded' && props.template.component) {
    isRendered.value = true
    emit('render-complete')
  } else if (props.template.status === 'error') {
    isRendered.value = false
    if (props.template.error) {
      emit('render-error', props.template.error)
    }
  }
}

// 注入样式到页面
const injectStyles = () => {
  if (!props.template.styles) return

  const styleId = `template-style-${props.template.config.id}`
  let styleElement = document.getElementById(styleId)
  
  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = styleId
    styleElement.type = 'text/css'
    document.head.appendChild(styleElement)
  }
  
  styleElement.textContent = props.template.styles
}

// 移除注入的样式
const removeInjectedStyles = () => {
  const styleId = `template-style-${props.template.config.id}`
  const styleElement = document.getElementById(styleId)
  if (styleElement) {
    styleElement.remove()
  }
}

// 组件挂载
onMounted(() => {
  handleTemplateStatusChange()
  injectStyles()
  emit('component-mounted')
})

// 组件卸载
onUnmounted(() => {
  removeInjectedStyles()
  emit('component-unmounted')
})

// 暴露方法
defineExpose({
  isRendered,
  injectStyles,
  removeInjectedStyles
})
</script>

<style scoped>
.template-renderer {
  position: relative;
  width: 100%;
  height: 100%;
}

.renderer-loading,
.renderer-error,
.renderer-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  padding: 16px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-content {
  text-align: center;
  color: #ff4d4f;
  max-width: 400px;
}

.error-content h4 {
  margin-bottom: 8px;
  font-size: 16px;
}

.error-content p {
  margin-bottom: 12px;
  font-size: 14px;
}

.error-content details {
  text-align: left;
  margin-top: 12px;
}

.error-content summary {
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 8px;
}

.error-content pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.empty-content {
  text-align: center;
  color: #999;
  font-size: 14px;
}

.renderer-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.template-component {
  width: 100%;
  height: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .renderer-loading,
  .renderer-error,
  .renderer-empty {
    min-height: 80px;
    padding: 12px;
  }
  
  .error-content {
    max-width: 300px;
  }
  
  .error-content h4 {
    font-size: 14px;
  }
  
  .error-content p {
    font-size: 12px;
  }
}
</style>