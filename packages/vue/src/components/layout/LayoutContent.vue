<script setup lang="ts">
/**
 * 布局内容区组件
 *
 * 提供主内容区域的容器，支持内边距、滚动等配置
 *
 * @example
 * ```vue
 * <LayoutContent :padding="24">
 *   <router-view />
 * </LayoutContent>
 * ```
 */
import { computed } from 'vue'

interface Props {
  /** 内边距 @default 24 */
  padding?: number | string
  /** 是否全屏（隐藏其他布局元素） @default false */
  fullscreen?: boolean
  /** 背景色 */
  background?: string
  /** 最小高度 */
  minHeight?: string
  /** 是否启用滚动 @default true */
  scroll?: boolean
  /** 自定义类名 */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  padding: 24,
  fullscreen: false,
  scroll: true,
})

/** 内容区样式 */
const contentStyle = computed(() => {
  const paddingValue = typeof props.padding === 'number'
    ? `${props.padding}px`
    : props.padding

  return {
    padding: paddingValue,
    background: props.background,
    minHeight: props.minHeight,
  }
})

/** 内容区类名 */
const contentClass = computed(() => [
  'layout-content',
  {
    'layout-content--fullscreen': props.fullscreen,
    'layout-content--scroll': props.scroll,
  },
  props.class,
])
</script>

<template>
  <main :class="contentClass" :style="contentStyle">
    <slot />
  </main>
</template>

<style scoped>
.layout-content {
  flex: 1;
  background-color: var(--color-bg-page);
  transition: all var(--size-duration-fast) ease;
}

.layout-content--scroll {
  overflow-y: auto;
}

.layout-content--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  padding: 0 !important;
}
</style>
