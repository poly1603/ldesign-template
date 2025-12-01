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
  background-color: var(--layout-footer-bg, #fff);
  color: var(--layout-footer-color, rgba(0, 0, 0, 0.65));
  font-size: 14px;
}

.layout-footer--fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
}

.layout-footer--bordered {
  border-top: 1px solid var(--layout-border-color, #e8e8e8);
}

.layout-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 24px;
}

.layout-footer__left,
.layout-footer__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.layout-footer__center {
  flex: 1;
  text-align: center;
}
</style>

