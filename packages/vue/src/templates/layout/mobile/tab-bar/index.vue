<script setup lang="ts">
/**
 * Mobile TabBar 移动端底部导航布局
 * iOS/Android 风格，底部 Tab 栏 + 顶栏 + 内容区
 */
import { computed, ref } from 'vue'
import { LayoutHeader, LayoutContent } from '../../../../components/layout'

interface Props {
  headerHeight?: number
  showHeader?: boolean
  fixedHeader?: boolean
  tabBarHeight?: number
  showTabBar?: boolean
  fixedTabBar?: boolean
  safeArea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 52,
  showHeader: true,
  fixedHeader: true,
  tabBarHeight: 56,
  showTabBar: true,
  fixedTabBar: true,
  safeArea: true,
})

const activeTab = ref(0)

const contentTopOffset = computed(() =>
  props.showHeader && props.fixedHeader ? props.headerHeight : 0,
)

const contentBottomOffset = computed(() =>
  props.showTabBar && props.fixedTabBar ? props.tabBarHeight : 0,
)

const contentStyle = computed(() => ({
  paddingTop: `${contentTopOffset.value}px`,
  paddingBottom: props.safeArea
    ? `calc(${contentBottomOffset.value}px + env(safe-area-inset-bottom))`
    : `${contentBottomOffset.value}px`,
}))

const tabBarStyle = computed(() => ({
  height: props.safeArea
    ? `calc(${props.tabBarHeight}px + env(safe-area-inset-bottom))`
    : `${props.tabBarHeight}px`,
  paddingBottom: props.safeArea ? 'env(safe-area-inset-bottom)' : undefined,
}))
</script>

<template>
  <div class="mobile-tab-bar">
    <!-- 顶栏 -->
    <LayoutHeader v-if="showHeader" :height="headerHeight" :fixed="fixedHeader" class="mobile-tab-bar__header">
      <template #left>
        <slot name="header-left" />
      </template>
      <template #center>
        <div class="header-title">
          <slot name="header-center" />
        </div>
      </template>
      <template #right>
        <slot name="header-right" />
      </template>
    </LayoutHeader>

    <!-- 内容区 -->
    <LayoutContent class="mobile-tab-bar__content" :style="contentStyle">
      <div class="content-inner">
        <slot />
      </div>
    </LayoutContent>

    <!-- 底部导航 -->
    <nav v-if="showTabBar" :class="['mobile-tab-bar__nav', { 'is-fixed': fixedTabBar }]" :style="tabBarStyle">
      <slot name="tab-bar" :active="activeTab">
        <!-- 默认 Tab 栏示例 -->
        <div class="tab-bar-default">
          <button v-for="i in 4" :key="i" class="tab-item" :class="{ 'is-active': activeTab === i - 1 }"
            @click="activeTab = i - 1">
            <span class="tab-icon">
              <svg v-if="i === 1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <svg v-else-if="i === 2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <svg v-else-if="i === 3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <span class="tab-label">{{ ['首页', '发现', '消息', '我的'][i - 1] }}</span>
          </button>
        </div>
      </slot>
    </nav>
  </div>
</template>

<style scoped>
.mobile-tab-bar {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg-layout, #f5f7fa);
}

/* 顶栏 */
.mobile-tab-bar__header {
  background: var(--color-bg-container, #fff);
  border-bottom: 1px solid var(--color-border-secondary, #eef0f3);
}

.header-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
  text-align: center;
}

/* 内容区 */
.mobile-tab-bar__content {
  flex: 1;
  background: var(--color-bg-layout, #f5f7fa);
  -webkit-overflow-scrolling: touch;
}

.content-inner {
  padding: 16px;
  min-height: 100%;
}

/* 底部导航 */
.mobile-tab-bar__nav {
  display: flex;
  align-items: flex-start;
  background: var(--color-bg-container, #fff);
  border-top: 1px solid var(--color-border-secondary, #eef0f3);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
}

.mobile-tab-bar__nav.is-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* 默认 Tab 栏 */
.tab-bar-default {
  display: flex;
  width: 100%;
  height: 100%;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 0;
  background: transparent;
  border: none;
  color: var(--color-text-tertiary, #8c8c8c);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s ease;
}

.tab-item.is-active {
  color: var(--color-primary-default, #6366f1);
}

.tab-item:active {
  transform: scale(0.95);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.tab-item.is-active .tab-icon {
  background: var(--color-primary-50, #eef2ff);
}

.tab-label {
  font-size: 10px;
  font-weight: 500;
}

/* 深色模式 */
:root[data-theme-mode="dark"] .mobile-tab-bar__header,
.dark .mobile-tab-bar__header {
  background: var(--color-bg-container, #1f1f1f);
  border-bottom-color: var(--color-border-secondary, #303030);
}

:root[data-theme-mode="dark"] .mobile-tab-bar__nav,
.dark .mobile-tab-bar__nav {
  background: var(--color-bg-container, #1f1f1f);
  border-top-color: var(--color-border-secondary, #303030);
}

:root[data-theme-mode="dark"] .tab-item.is-active .tab-icon,
.dark .tab-item.is-active .tab-icon {
  background: rgba(99, 102, 241, 0.15);
}
</style>
