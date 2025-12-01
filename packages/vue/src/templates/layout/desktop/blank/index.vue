<script setup lang="ts">
/**
 * Blank 空白布局模板
 *
 * 无任何装饰的空白布局，适合登录页、错误页等
 *
 * @example
 * ```vue
 * <TemplateRenderer category="layout" template-name="blank">
 *   <LoginForm />
 * </TemplateRenderer>
 * ```
 */
import { computed } from 'vue'

interface Props {
  /** 背景色 @default '#f0f2f5' */
  background?: string
  /** 是否居中内容 @default false */
  centered?: boolean
  /** 内边距 @default 0 */
  padding?: number
}

const props = withDefaults(defineProps<Props>(), {
  background: '#f0f2f5',
  centered: false,
  padding: 0,
})

/** 布局样式 */
const layoutStyle = computed(() => ({
  background: props.background,
  padding: props.padding ? `${props.padding}px` : undefined,
}))

/** 布局类名 */
const layoutClass = computed(() => [
  'blank-layout',
  {
    'blank-layout--centered': props.centered,
  },
])
</script>

<template>
  <div :class="layoutClass" :style="layoutStyle">
    <slot />
  </div>
</template>

<style scoped>
.blank-layout {
  min-height: 100vh;
}

.blank-layout--centered {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

