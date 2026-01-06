<script setup lang="ts">
/**
 * 错误展示组件
 * 
 * 提供优雅的错误状态展示，支持多种错误类型和重试操作
 * 
 * @example
 * ```vue
 * <ErrorDisplay 
 *   :error="error" 
 *   title="加载失败" 
 *   @retry="handleRetry" 
 * />
 * ```
 */

export interface ErrorDisplayProps {
  /**
   * 错误对象
   */
  error?: Error | null
  
  /**
   * 错误标题
   * @default '出错了'
   */
  title?: string
  
  /**
   * 错误描述（优先使用，否则使用error.message）
   */
  description?: string
  
  /**
   * 错误类型
   * @default 'error'
   */
  type?: 'error' | 'warning' | 'info' | 'network'
  
  /**
   * 是否显示重试按钮
   * @default true
   */
  showRetry?: boolean
  
  /**
   * 重试按钮文本
   * @default '重试'
   */
  retryText?: string
  
  /**
   * 是否显示详细错误信息
   * @default false
   */
  showDetail?: boolean
  
  /**
   * 是否全屏显示
   * @default false
   */
  fullscreen?: boolean
  
  /**
   * 图标大小
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<ErrorDisplayProps>(), {
  title: '出错了',
  type: 'error',
  showRetry: true,
  retryText: '重试',
  showDetail: false,
  fullscreen: false,
  size: 'medium',
})

const emit = defineEmits<{
  retry: []
}>()

// 错误类型对应的颜色
const typeColors = {
  error: {
    bg: 'var(--color-error-50, #fef2f2)',
    icon: 'var(--color-error-500, #ef4444)',
    border: 'var(--color-error-200, #fecaca)',
  },
  warning: {
    bg: 'var(--color-warning-50, #fffbeb)',
    icon: 'var(--color-warning-500, #f59e0b)',
    border: 'var(--color-warning-200, #fde68a)',
  },
  info: {
    bg: 'var(--color-info-50, #eff6ff)',
    icon: 'var(--color-info-500, #3b82f6)',
    border: 'var(--color-info-200, #bfdbfe)',
  },
  network: {
    bg: 'var(--color-gray-50, #f9fafb)',
    icon: 'var(--color-gray-500, #6b7280)',
    border: 'var(--color-gray-200, #e5e7eb)',
  },
}

const currentColors = typeColors[props.type]

// 图标大小映射
const iconSizeMap = {
  small: 48,
  medium: 64,
  large: 80,
}

function handleRetry() {
  emit('retry')
}
</script>

<template>
  <div 
    class="error-display" 
    :class="[
      `error-display--${type}`,
      `error-display--${size}`,
      { 'error-display--fullscreen': fullscreen }
    ]"
    :style="{
      '--error-bg': currentColors.bg,
      '--error-icon': currentColors.icon,
      '--error-border': currentColors.border,
    }"
    role="alert"
    aria-live="assertive"
  >
    <div class="error-display__content">
      <!-- 图标 -->
      <div class="error-display__icon">
        <!-- 错误图标 -->
        <svg v-if="type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" stroke-linecap="round" />
        </svg>
        
        <!-- 警告图标 -->
        <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 9v4M12 17h.01" stroke-linecap="round" />
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        
        <!-- 信息图标 -->
        <svg v-else-if="type === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" stroke-linecap="round" />
        </svg>
        
        <!-- 网络错误图标 -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M1 1l22 22M9 9a3 3 0 000 6M16.5 12c0 .83-.34 1.58-.88 2.12" stroke-linecap="round" />
          <path d="M6.34 6.34A8 8 0 005 12M12 4a8 8 0 018 8M6.34 17.66A8 8 0 0012 20" stroke-linecap="round" />
        </svg>
      </div>
      
      <!-- 标题 -->
      <h3 class="error-display__title">{{ title }}</h3>
      
      <!-- 描述 -->
      <p class="error-display__description">
        {{ description || error?.message || '发生未知错误，请稍后重试' }}
      </p>
      
      <!-- 详细错误信息 -->
      <details v-if="showDetail && error?.stack" class="error-display__detail">
        <summary>查看详情</summary>
        <pre>{{ error.stack }}</pre>
      </details>
      
      <!-- 操作按钮 -->
      <div v-if="showRetry" class="error-display__actions">
        <button 
          class="error-display__retry-btn" 
          @click="handleRetry"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          {{ retryText }}
        </button>
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-display {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  min-height: 200px;
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  border-radius: 12px;
}

.error-display--fullscreen {
  position: fixed;
  inset: 0;
  min-height: 100vh;
  border-radius: 0;
  z-index: 9999;
}

.error-display__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-display__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--error-icon);
  animation: shake 0.5s ease-out;
}

.error-display__icon svg {
  width: 64px;
  height: 64px;
}

.error-display--small .error-display__icon svg {
  width: 48px;
  height: 48px;
}

.error-display--large .error-display__icon svg {
  width: 80px;
  height: 80px;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-5px);
  }
  40%, 80% {
    transform: translateX(5px);
  }
}

.error-display__title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary, #111827);
}

.error-display--small .error-display__title {
  font-size: 16px;
}

.error-display--large .error-display__title {
  font-size: 20px;
}

.error-display__description {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--color-text-secondary, #6b7280);
  line-height: 1.5;
}

.error-display--small .error-display__description {
  font-size: 13px;
}

.error-display--large .error-display__description {
  font-size: 15px;
}

.error-display__detail {
  width: 100%;
  margin-bottom: 20px;
  text-align: left;
}

.error-display__detail summary {
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-tertiary, #9ca3af);
  padding: 8px 0;
  outline: none;
}

.error-display__detail summary:hover {
  color: var(--color-text-secondary, #6b7280);
}

.error-display__detail pre {
  margin-top: 8px;
  padding: 12px;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  color: var(--color-text-secondary, #6b7280);
  background: var(--color-gray-100, #f3f4f6);
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-display__actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.error-display__retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: var(--color-primary-500, #3b82f6);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.error-display__retry-btn:hover {
  background: var(--color-primary-600, #2563eb);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.error-display__retry-btn:active {
  transform: translateY(0);
}

.error-display__retry-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
}

.error-display__retry-btn svg {
  width: 16px;
  height: 16px;
}
</style>