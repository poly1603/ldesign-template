<script setup lang="ts">
/**
 * 布局顶栏组件
 *
 * 提供顶栏的基础结构和样式，支持固定、响应式等特性
 *
 * @example
 * ```vue
 * <LayoutHeader :fixed="true" :height="64">
 *   <template #left>
 *     <Logo />
 *   </template>
 *   <template #center>
 *     <SearchBar />
 *   </template>
 *   <template #right>
 *     <UserMenu />
 *   </template>
 * </LayoutHeader>
 * ```
 */
import { computed } from 'vue'

interface Props {
  /** 顶栏高度 @default 64 */
  height?: number
  /** 是否固定 @default true */
  fixed?: boolean
  /** 是否显示阴影 @default true */
  shadow?: boolean
  /** 是否显示底部边框 @default false */
  bordered?: boolean
  /** 左侧偏移量（用于配合侧边栏） @default 0 */
  leftOffset?: number
  /** 自定义类名 */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 64,
  fixed: true,
  shadow: true,
  bordered: false,
  leftOffset: 0,
})

const emit = defineEmits<{
  /** 点击菜单按钮 */
  toggleSider: []
}>()

/** 顶栏样式 */
const headerStyle = computed(() => ({
  height: `${props.height}px`,
  left: props.fixed ? `${props.leftOffset}px` : undefined,
}))

/** 顶栏类名 */
const headerClass = computed(() => [
  'layout-header',
  {
    'layout-header--fixed': props.fixed,
    'layout-header--shadow': props.shadow,
    'layout-header--bordered': props.bordered,
  },
  props.class,
])

/** 处理菜单按钮点击 */
function handleToggleSider() {
  emit('toggleSider')
}
</script>

<template>
  <header :class="headerClass" :style="headerStyle">
    <div class="layout-header__inner">
      <!-- 左侧区域（Logo、菜单按钮等） -->
      <div class="layout-header__left">
        <button
          v-if="$slots.menuButton"
          class="layout-header__menu-btn"
          type="button"
          aria-label="切换菜单"
          @click="handleToggleSider"
        >
          <slot name="menuButton">
            <span class="layout-header__menu-icon">☰</span>
          </slot>
        </button>
        <slot name="left" />
      </div>

      <!-- 中间区域（搜索、导航等） -->
      <div class="layout-header__center">
        <slot name="center" />
      </div>

      <!-- 右侧区域（用户菜单、操作按钮等） -->
      <div class="layout-header__right">
        <slot name="right" />
      </div>
    </div>

    <!-- 默认插槽 -->
    <slot />
  </header>
</template>

<style scoped>
.layout-header {
  display: flex;
  align-items: center;
  background-color: var(--layout-header-bg, #fff);
  color: var(--layout-header-color, #333);
  transition: all 0.3s ease;
  z-index: 100;
}

.layout-header--fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
}

.layout-header--shadow {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.layout-header--bordered {
  border-bottom: 1px solid var(--layout-border-color, #e8e8e8);
}

.layout-header__inner {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
}

.layout-header__left,
.layout-header__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.layout-header__center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
}

.layout-header__menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.layout-header__menu-btn:hover {
  background-color: var(--layout-hover-bg, rgba(0, 0, 0, 0.04));
}

.layout-header__menu-icon {
  font-size: 20px;
}
</style>

