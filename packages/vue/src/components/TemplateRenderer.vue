<script setup lang="ts">
/**
 * 模板渲染器组件
 *
 * 支持两种使用方式：
 * 1. 完整模式：传入 templateId（如 "login:desktop:default"）
 * 2. 简化模式：传入 category（如 "login"），自动检测设备类型
 *
 * @example
 * ```vue
 * <!-- 完整模式 -->
 * <TemplateRenderer template-id="login:desktop:default" :props="{ onSubmit }" />
 *
 * <!-- 简化模式（推荐） -->
 * <TemplateRenderer category="login" :props="{ onSubmit }" />
 *
 * <!-- 指定设备类型 -->
 * <TemplateRenderer category="login" device="mobile" :props="{ onSubmit }" />
 * ```
 */
import { computed, watch, onMounted } from 'vue'
import type { Component } from 'vue'
import { useTemplate } from '../composables/useTemplate'
import type { DeviceType } from '../types/config'

/** 组件属性 */
interface Props {
  /**
   * 模板ID（完整模式）
   * 格式: "category:device:name" 或 "category:device"
   * @deprecated 推荐使用 category + device 的简化模式
   */
  templateId?: string

  /**
   * 模板分类（简化模式）
   * 与 templateId 二选一，优先使用 category
   */
  category?: string

  /**
   * 设备类型（简化模式下可选）
   * 不传则自动检测
   */
  device?: DeviceType

  /**
   * 是否启用自动设备检测
   * @default true（当使用 category 且未指定 device 时）
   */
  autoDevice?: boolean

  /**
   * 传递给模板的属性
   */
  props?: Record<string, unknown>

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
  autoDevice: true,
})

// 计算有效的模板标识
const effectiveTemplateId = computed(() => {
  // 优先使用 category（简化模式）
  if (props.category) {
    return props.category
  }
  // 兼容 templateId（完整模式）
  return props.templateId || ''
})

// 判断是否应该自动检测设备
const shouldAutoDetect = computed(() => {
  // 使用 category 模式且未指定 device 且启用了 autoDevice
  return !!props.category && !props.device && props.autoDevice
})

const {
  component,
  loading,
  error,
  load,
  disabled,
  disabledMessage,
  deviceType,
} = useTemplate(effectiveTemplateId, {
  immediate: false,
  category: props.category,
  device: props.device,
  autoDevice: shouldAutoDetect.value,
  onLoad: props.onLoad ? () => props.onLoad?.() : undefined,
  onError: props.onError,
})

// 监听模板标识变化并加载
watch(
  effectiveTemplateId,
  (newId) => {
    if (newId) {
      load(newId)
    }
  },
  { immediate: true },
)

// 初始加载
onMounted(() => {
  if (effectiveTemplateId.value) {
    load(effectiveTemplateId.value)
  }
})

// 暴露给父组件的属性和方法
defineExpose({
  /** 当前加载的组件 */
  component,
  /** 加载状态 */
  loading,
  /** 错误信息 */
  error,
  /** 是否被禁用 */
  disabled,
  /** 禁用消息 */
  disabledMessage,
  /** 当前设备类型 */
  deviceType,
  /** 重新加载模板 */
  reload: () => load(effectiveTemplateId.value),
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

    <!-- 渲染模板组件（包括禁用状态组件） -->
    <component v-else-if="component" :is="component" v-bind="props.props" :category="props.category"
      :device="deviceType" :message="disabledMessage">
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