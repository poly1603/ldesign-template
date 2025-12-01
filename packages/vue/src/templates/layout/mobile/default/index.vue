<script setup lang="ts">
/**
 * Mobile 移动端布局模板
 *
 * 移动端布局，底部导航 + 顶栏
 *
 * @example
 * ```vue
 * <TemplateRenderer category="layout">
 *   <template #header-left>
 *     <BackButton />
 *   </template>
 *   <template #header-center>
 *     <h1>页面标题</h1>
 *   </template>
 *   <template #tab-bar>
 *     <TabBar :items="tabItems" />
 *   </template>
 *   <template #default>
 *     <router-view />
 *   </template>
 * </TemplateRenderer>
 * ```
 */
import { computed } from 'vue'
import { LayoutHeader, LayoutContent } from '../../../../components/layout'

interface Props {
  /** 顶栏高度 @default 48 */
  headerHeight?: number
  /** 是否显示顶栏 @default true */
  showHeader?: boolean
  /** 是否固定顶栏 @default true */
  fixedHeader?: boolean
  /** 底部导航高度 @default 56 */
  tabBarHeight?: number
  /** 是否显示底部导航 @default true */
  showTabBar?: boolean
  /** 是否固定底部导航 @default true */
  fixedTabBar?: boolean
  /** 是否启用安全区域 @default true */
  safeArea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 48,
  showHeader: true,
  fixedHeader: true,
  tabBarHeight: 56,
  showTabBar: true,
  fixedTabBar: true,
  safeArea: true,
})

/** 内容区顶部偏移 */
const contentTopOffset = computed(() =>
  props.showHeader && props.fixedHeader ? props.headerHeight : 0,
)

/** 内容区底部偏移 */
const contentBottomOffset = computed(() =>
  props.showTabBar && props.fixedTabBar ? props.tabBarHeight : 0,
)

/** 内容区样式 */
const contentStyle = computed(() => ({
  paddingTop: `${contentTopOffset.value}px`,
  paddingBottom: props.safeArea
    ? `calc(${contentBottomOffset.value}px + env(safe-area-inset-bottom))`
    : `${contentBottomOffset.value}px`,
}))

/** 底部导航样式 */
const tabBarStyle = computed(() => ({
  height: props.safeArea
    ? `calc(${props.tabBarHeight}px + env(safe-area-inset-bottom))`
    : `${props.tabBarHeight}px`,
  paddingBottom: props.safeArea ? 'env(safe-area-inset-bottom)' : undefined,
}))
</script>

<template>
  <div class="mobile-layout">
    <!-- 顶栏 -->
    <LayoutHeader
      v-if="showHeader"
      :height="headerHeight"
      :fixed="fixedHeader"
      class="mobile-layout__header"
    >
      <template #left>
        <slot name="header-left" />
      </template>
      <template #center>
        <slot name="header-center" />
      </template>
      <template #right>
        <slot name="header-right" />
      </template>
    </LayoutHeader>

    <!-- 内容区 -->
    <LayoutContent class="mobile-layout__content" :style="contentStyle">
      <slot />
    </LayoutContent>

    <!-- 底部导航 -->
    <nav
      v-if="showTabBar"
      :class="['mobile-layout__tab-bar', { 'mobile-layout__tab-bar--fixed': fixedTabBar }]"
      :style="tabBarStyle"
    >
      <slot name="tab-bar" />
    </nav>
  </div>
</template>

<style scoped>
.mobile-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--layout-bg, #f5f5f5);
}

.mobile-layout__header {
  background-color: var(--layout-header-bg, #fff);
}

.mobile-layout__content {
  flex: 1;
  background-color: var(--layout-content-bg, #f5f5f5);
}

.mobile-layout__tab-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--layout-tab-bar-bg, #fff);
  border-top: 1px solid var(--layout-border-color, #e8e8e8);
}

.mobile-layout__tab-bar--fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>

