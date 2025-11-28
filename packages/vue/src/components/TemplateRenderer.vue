<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import type { Component } from 'vue'
import { useTemplate } from '../composables/useTemplate'

interface Props {
  /**
   * 模板ID
   * 格式: "category:device:name" 或 "category:device"
   */
  templateId: string

  /**
   * 传递给模板的属性
   */
  props?: Record<string, any>

  /**
   * 后备组件
   */
  fallback?: Component

  /**
   * 加载成功回调
   */
  onLoad?: () => void

  /**
   * 加载失败回调
   */
  onError?: (error: Error) => void
}

const props = withDefaults(defineProps<Props>(), {
  props: () => ({}),
})

const { component, loading, error, load } = useTemplate(
  computed(() => props.templateId),
  {
    immediate: false,
    onLoad: props.onLoad,
    onError: props.onError,
  }
)

// 监听模板ID变化并加载
watch(
  () => props.templateId,
  (newId) => {
    if (newId) {
      load(newId)
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.templateId) {
    load(props.templateId)
  }
})
</script>

<template>
  <div class="template-renderer">
    <!-- 加载中状态 -->
    <div v-if="loading" class="template-renderer__loading">
      <slot name="loading">
        <div class="template-renderer__spinner">加载中...</div>
      </slot>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="template-renderer__error">
      <slot name="error" :error="error">
        <div class="template-renderer__error-message">
          <p>模板加载失败</p>
          <p class="template-renderer__error-detail">{{ error.message }}</p>
        </div>
      </slot>
    </div>

    <!-- 渲染模板组件 -->
    <component
      v-else-if="component"
      :is="component"
      v-bind="props.props"
    >
      <!-- 透传插槽 -->
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </component>

    <!-- 后备内容 -->
    <component v-else-if="fallback" :is="fallback" />
  </div>
</template>

<style scoped>
.template-renderer {
  width: 100%;
  height: 100%;
}

.template-renderer__loading,
.template-renderer__error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 20px;
}

.template-renderer__spinner {
  color: #409eff;
  font-size: 14px;
}

.template-renderer__error {
  color: #f56c6c;
}

.template-renderer__error-message {
  text-align: center;
}

.template-renderer__error-message p {
  margin: 0;
  padding: 4px 0;
}

.template-renderer__error-detail {
  font-size: 12px;
  opacity: 0.8;
}
</style>