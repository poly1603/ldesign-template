<script setup lang="ts">
/**
 * 布局页脚组件
 *
 * 提供页脚的基础结构和样式
 *
 * @example
 * ```vue
 * <LayoutFooter :height="48">
 *   <template #left>
 *     <span>Copyright © 2024</span>
 *   </template>
 *   <template #right>
 *     <Links />
 *   </template>
 * </LayoutFooter>
 * ```
 */
import { computed } from 'vue'

interface Props {
  /** 页脚高度 @default 48 */
  height?: number
  /** 是否固定在底部 @default false */
  fixed?: boolean
  /** 是否显示顶部边框 @default true */
  bordered?: boolean
  /** 背景色 */
  background?: string
  /** 自定义类名 */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 48,
  fixed: false,
  bordered: true,
})

/** 页脚样式 */
const footerStyle = computed(() => ({
  height: `${props.height}px`,
  background: props.background,
}))

/** 页脚类名 */
const footerClass = computed(() => [
  'layout-footer',
  {
    'layout-footer--fixed': props.fixed,
    'layout-footer--bordered': props.bordered,
  },
  props.class,
])
</script>

<template>
  <footer :class="footerClass" :style="footerStyle">
    <div class="layout-footer__inner">
      <!-- 左侧区域 -->
      <div class="layout-footer__left">
        <slot name="left" />
      </div>

      <!-- 中间区域 -->
      <div class="layout-footer__center">
        <slot />
      </div>

      <!-- 右侧区域 -->
      <div class="layout-footer__right">
        <slot name="right" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.layout-footer {
  display: flex;
  align-items: center;
  background-color: var(--color-bg-container);
  color: var(--color-text-secondary);
  font-size: var(--size-font-md);
}

.layout-footer--fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
}

.layout-footer--bordered {
  border-top: var(--size-border-width-thin) solid var(--color-border);
}

.layout-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 var(--size-space-lg);
}

.layout-footer__left,
.layout-footer__right {
  display: flex;
  align-items: center;
  gap: var(--size-space-md);
}

.layout-footer__center {
  flex: 1;
  text-align: center;
}
</style>