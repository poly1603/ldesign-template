<script setup lang="ts">
/**
 * 模板卡片组件
 * 
 * 用于展示单个模板的预览卡片，支持选中状态和交互动画
 * 
 * @example
 * ```vue
 * <TemplateCard 
 *   :template="template"
 *   :selected="selectedId === template.id"
 *   @select="handleSelect"
 *   @preview="handlePreview"
 * />
 * ```
 */
import { computed, ref } from 'vue'
import type { TemplateMetadata } from '@ldesign/template-core'

export interface TemplateCardProps {
  /**
   * 模板元数据
   */
  template: TemplateMetadata
  
  /**
   * 是否选中
   * @default false
   */
  selected?: boolean
  
  /**
   * 是否显示预览图
   * @default true
   */
  showPreview?: boolean
  
  /**
   * 是否显示描述
   * @default true
   */
  showDescription?: boolean
  
  /**
   * 是否显示标签
   * @default true
   */
  showTags?: boolean
  
  /**
   * 是否显示操作按钮
   * @default true
   */
  showActions?: boolean
  
  /**
   * 卡片尺寸
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  
  /**
   * 布局模式
   * @default 'vertical'
   */
  layout?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<TemplateCardProps>(), {
  selected: false,
  showPreview: true,
  showDescription: true,
  showTags: true,
  showActions: true,
  size: 'medium',
  disabled: false,
  layout: 'vertical',
})

const emit = defineEmits<{
  select: [template: TemplateMetadata]
  preview: [template: TemplateMetadata]
}>()

// 悬停状态
const isHovered = ref(false)

// 图片加载状态
const imageLoaded = ref(false)
const imageError = ref(false)

// 预览图高度映射
const previewHeightMap = {
  small: 100,
  medium: 140,
  large: 180,
}

// 计算预览图URL（支持相对路径）
const previewUrl = computed(() => {
  if (!props.template.preview) return null
  return props.template.preview
})

function handleSelect() {
  if (props.disabled) return
  emit('select', props.template)
}

function handlePreview(event: Event) {
  event.stopPropagation()
  emit('preview', props.template)
}

function handleImageLoad() {
  imageLoaded.value = true
}

function handleImageError() {
  imageError.value = true
}
</script>

<template>
  <div
    class="template-card"
    :class="[
      `template-card--${size}`,
      `template-card--${layout}`,
      {
        'template-card--selected': selected,
        'template-card--disabled': disabled,
        'template-card--hovered': isHovered,
      }
    ]"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-selected="selected"
    :aria-disabled="disabled"
    @click="handleSelect"
    @keydown.enter="handleSelect"
    @keydown.space.prevent="handleSelect"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 预览图区域 -->
    <div 
      v-if="showPreview" 
      class="template-card__preview"
      :style="{ height: `${previewHeightMap[size]}px` }"
    >
      <!-- 加载骨架 -->
      <div v-if="!imageLoaded && !imageError && previewUrl" class="template-card__preview-skeleton" />
      
      <!-- 预览图 -->
      <img
        v-if="previewUrl && !imageError"
        :src="previewUrl"
        :alt="template.displayName || template.name"
        class="template-card__preview-img"
        :class="{ 'is-loaded': imageLoaded }"
        loading="lazy"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      
      <!-- 无预览图占位 -->
      <div v-else class="template-card__preview-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      
      <!-- 悬停遮罩 -->
      <Transition name="fade">
        <div v-if="isHovered && showActions" class="template-card__overlay">
          <button 
            class="template-card__preview-btn" 
            @click="handlePreview"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            预览
          </button>
        </div>
      </Transition>
    </div>
    
    <!-- 内容区域 -->
    <div class="template-card__content">
      <!-- 标题行 -->
      <div class="template-card__header">
        <h4 class="template-card__title">
          {{ template.displayName || template.name }}
        </h4>
        
        <!-- 选中图标 -->
        <Transition name="pop">
          <div v-if="selected" class="template-card__check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </Transition>
      </div>
      
      <!-- 描述 -->
      <p v-if="showDescription && template.description" class="template-card__description">
        {{ template.description }}
      </p>
      
      <!-- 标签 -->
      <div v-if="showTags && template.tags?.length" class="template-card__tags">
        <span 
          v-for="tag in template.tags.slice(0, 3)" 
          :key="tag" 
          class="template-card__tag"
        >
          {{ tag }}
        </span>
        <span v-if="template.tags.length > 3" class="template-card__tag template-card__tag--more">
          +{{ template.tags.length - 3 }}
        </span>
      </div>
      
      <!-- 元信息 -->
      <div class="template-card__meta">
        <span v-if="template.version" class="template-card__version">
          v{{ template.version }}
        </span>
        <span v-if="template.author" class="template-card__author">
          by {{ template.author }}
        </span>
      </div>
    </div>
    
    <!-- 选中边框动画 -->
    <div class="template-card__border" />
  </div>
</template>

<style scoped>
.template-card {
  --card-radius: 12px;
  --card-padding: 16px;
  --card-bg: var(--color-bg-container, #ffffff);
  --card-border: var(--color-gray-200, #e5e7eb);
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --card-shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.1);
  --card-primary: var(--color-primary-500, #3b82f6);
  
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

/* 尺寸变体 */
.template-card--small {
  --card-radius: 8px;
  --card-padding: 12px;
}

.template-card--large {
  --card-radius: 16px;
  --card-padding: 20px;
}

/* 水平布局 */
.template-card--horizontal {
  flex-direction: row;
}

.template-card--horizontal .template-card__preview {
  width: 160px;
  flex-shrink: 0;
}

.template-card--horizontal .template-card__content {
  flex: 1;
}

/* 悬停状态 */
.template-card:hover:not(.template-card--disabled) {
  border-color: var(--color-gray-300, #d1d5db);
  box-shadow: var(--card-shadow-hover);
  transform: translateY(-2px);
}

.template-card:focus-visible {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* 选中状态 */
.template-card--selected {
  border-color: var(--card-primary);
  background: var(--color-primary-50, #eff6ff);
}

.template-card--selected:hover {
  border-color: var(--card-primary);
}

/* 禁用状态 */
.template-card--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* 预览图区域 */
.template-card__preview {
  position: relative;
  background: var(--color-gray-100, #f3f4f6);
  overflow: hidden;
}

.template-card__preview-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--color-gray-200, #e5e7eb) 25%,
    var(--color-gray-100, #f3f4f6) 50%,
    var(--color-gray-200, #e5e7eb) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.template-card__preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.template-card__preview-img.is-loaded {
  opacity: 1;
}

.template-card__preview-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-400, #9ca3af);
}

.template-card__preview-placeholder svg {
  width: 48px;
  height: 48px;
}

/* 悬停遮罩 */
.template-card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.template-card__preview-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: var(--card-primary);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-card__preview-btn:hover {
  background: var(--color-primary-600, #2563eb);
  transform: scale(1.05);
}

.template-card__preview-btn svg {
  width: 16px;
  height: 16px;
}

/* 内容区域 */
.template-card__content {
  padding: var(--card-padding);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.template-card__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary, #111827);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.template-card--small .template-card__title {
  font-size: 14px;
}

.template-card--large .template-card__title {
  font-size: 16px;
}

.template-card--selected .template-card__title {
  color: var(--card-primary);
}

.template-card__check {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-primary);
  border-radius: 50%;
  color: #fff;
}

.template-card__check svg {
  width: 12px;
  height: 12px;
}

.template-card__description {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-secondary, #6b7280);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.template-card--small .template-card__description {
  font-size: 12px;
  -webkit-line-clamp: 1;
}

/* 标签 */
.template-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.template-card__tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: 11px;
  color: var(--color-text-tertiary, #9ca3af);
  background: var(--color-gray-100, #f3f4f6);
  border-radius: 4px;
}

.template-card--selected .template-card__tag {
  background: var(--color-primary-100, #dbeafe);
  color: var(--color-primary-700, #1d4ed8);
}

.template-card__tag--more {
  font-weight: 500;
}

/* 元信息 */
.template-card__meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-tertiary, #9ca3af);
}

/* 选中边框动画 */
.template-card__border {
  position: absolute;
  inset: -1px;
  border: 2px solid transparent;
  border-radius: var(--card-radius);
  pointer-events: none;
  transition: border-color 0.2s ease;
}

.template-card--selected .template-card__border {
  border-color: var(--card-primary);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  animation: pop 0.3s ease;
}

.pop-leave-active {
  animation: pop 0.2s ease reverse;
}

@keyframes pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>