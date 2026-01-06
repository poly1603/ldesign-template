<script setup lang="ts">
/**
 * 加载动画组件
 * 
 * 提供优雅的加载状态展示，支持多种模式：
 * - spinner: 旋转加载指示器
 * - skeleton: 骨架屏
 * - pulse: 脉冲动画
 * 
 * @example
 * ```vue
 * <LoadingSpinner mode="spinner" text="加载中..." />
 * <LoadingSpinner mode="skeleton" :lines="3" />
 * ```
 */

export interface LoadingSpinnerProps {
  /**
   * 加载模式
   * @default 'spinner'
   */
  mode?: 'spinner' | 'skeleton' | 'pulse'
  
  /**
   * 提示文本
   */
  text?: string
  
  /**
   * 尺寸
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  
  /**
   * 主题色
   */
  color?: string
  
  /**
   * 骨架屏行数（skeleton模式）
   * @default 3
   */
  lines?: number
  
  /**
   * 是否全屏覆盖
   * @default false
   */
  fullscreen?: boolean
  
  /**
   * 是否显示遮罩
   * @default false
   */
  overlay?: boolean
}

const props = withDefaults(defineProps<LoadingSpinnerProps>(), {
  mode: 'spinner',
  size: 'medium',
  lines: 3,
  fullscreen: false,
  overlay: false,
})

// 尺寸映射
const sizeMap = {
  small: { spinner: 24, stroke: 2 },
  medium: { spinner: 40, stroke: 3 },
  large: { spinner: 56, stroke: 4 },
}

const currentSize = sizeMap[props.size]
</script>

<template>
  <div 
    class="loading-spinner" 
    :class="[
      `loading-spinner--${mode}`,
      `loading-spinner--${size}`,
      { 
        'loading-spinner--fullscreen': fullscreen,
        'loading-spinner--overlay': overlay 
      }
    ]"
    :style="color ? { '--loading-color': color } : {}"
    role="status"
    aria-live="polite"
  >
    <!-- 遮罩层 -->
    <div v-if="overlay" class="loading-spinner__overlay" />
    
    <div class="loading-spinner__content">
      <!-- Spinner 模式 -->
      <template v-if="mode === 'spinner'">
        <svg 
          class="loading-spinner__svg"
          :width="currentSize.spinner"
          :height="currentSize.spinner"
          viewBox="0 0 50 50"
        >
          <circle
            class="loading-spinner__track"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            :stroke-width="currentSize.stroke"
          />
          <circle
            class="loading-spinner__circle"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            :stroke-width="currentSize.stroke"
            stroke-linecap="round"
          />
        </svg>
      </template>
      
      <!-- Skeleton 模式 -->
      <template v-else-if="mode === 'skeleton'">
        <div class="loading-spinner__skeleton">
          <div 
            v-for="i in lines" 
            :key="i" 
            class="loading-spinner__skeleton-line"
            :style="{ 
              width: i === lines ? '60%' : '100%',
              animationDelay: `${(i - 1) * 0.1}s`
            }"
          />
        </div>
      </template>
      
      <!-- Pulse 模式 -->
      <template v-else-if="mode === 'pulse'">
        <div class="loading-spinner__pulse">
          <span class="loading-spinner__dot" style="animation-delay: 0s" />
          <span class="loading-spinner__dot" style="animation-delay: 0.15s" />
          <span class="loading-spinner__dot" style="animation-delay: 0.3s" />
        </div>
      </template>
      
      <!-- 文本提示 -->
      <p v-if="text" class="loading-spinner__text">{{ text }}</p>
    </div>
  </div>
</template>

<style scoped>
.loading-spinner {
  --loading-color: var(--color-primary-500, #3b82f6);
  --loading-track-color: var(--color-gray-200, #e5e7eb);
  --loading-bg: var(--color-bg-container, #ffffff);
  --loading-text: var(--color-text-secondary, #6b7280);
  
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.loading-spinner--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--loading-bg);
}

.loading-spinner--overlay {
  position: relative;
}

.loading-spinner__overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1;
}

.loading-spinner__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 2;
}

/* Spinner 样式 */
.loading-spinner__svg {
  animation: rotate 2s linear infinite;
}

.loading-spinner__track {
  stroke: var(--loading-track-color);
}

.loading-spinner__circle {
  stroke: var(--loading-color);
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
  transform-origin: center;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Skeleton 样式 */
.loading-spinner__skeleton {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-spinner__skeleton-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    var(--loading-track-color) 25%,
    var(--color-gray-100, #f3f4f6) 50%,
    var(--loading-track-color) 75%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.loading-spinner--small .loading-spinner__skeleton-line {
  height: 12px;
}

.loading-spinner--large .loading-spinner__skeleton-line {
  height: 20px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Pulse 样式 */
.loading-spinner__pulse {
  display: flex;
  gap: 8px;
}

.loading-spinner__dot {
  width: 12px;
  height: 12px;
  background: var(--loading-color);
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite both;
}

.loading-spinner--small .loading-spinner__dot {
  width: 8px;
  height: 8px;
}

.loading-spinner--large .loading-spinner__dot {
  width: 16px;
  height: 16px;
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 文本样式 */
.loading-spinner__text {
  margin: 0;
  font-size: 14px;
  color: var(--loading-text);
  text-align: center;
  animation: fadeIn 0.3s ease-out;
}

.loading-spinner--small .loading-spinner__text {
  font-size: 12px;
}

.loading-spinner--large .loading-spinner__text {
  font-size: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>