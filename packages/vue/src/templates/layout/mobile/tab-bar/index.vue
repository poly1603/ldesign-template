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
  /* Semantic Colors Mapping */
  --color-bg-page: var(--color-gray-50, #f8fafc);
  --color-bg-container: var(--color-gray-0, #ffffff);
  --color-border-light: var(--color-gray-200, #e2e8f0);
  --color-text-primary: var(--color-gray-900, #0f172a);
  --color-text-tertiary: var(--color-gray-400, #94a3b8);
  --color-primary-default: var(--color-primary-500, #3b82f6);
  --color-primary-lighter: var(--color-primary-50, #eff6ff);
  --color-primary-light: var(--color-primary-100, #dbeafe);

  /* Shadows */
  --shadow-sm: 0 -1px 2px 0 rgba(0, 0, 0, 0.05);

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg-page);
  font-family: var(--size-font-family);
}

/* Dark Mode */
:root[data-theme-mode="dark"] .mobile-tab-bar,
.dark .mobile-tab-bar {
  --color-bg-page: var(--color-gray-950, #020617);
  --color-bg-container: var(--color-gray-900, #0f172a);
  --color-border-light: var(--color-gray-800, #1e293b);
  --color-text-primary: var(--color-gray-50, #f8fafc);
  --color-text-tertiary: var(--color-gray-500, #64748b);
  --color-primary-default: var(--color-primary-500, #3b82f6);
  --color-primary-lighter: var(--color-primary-900, #1e3a8a);
  --color-primary-light: var(--color-primary-800, #1e40af);
}

/* 顶栏 */
.mobile-tab-bar__header {
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border-light);
}

.header-title {
  font-size: var(--size-font-large);
  font-weight: var(--size-font-weight-semibold);
  color: var(--color-text-primary);
  text-align: center;
}

/* 内容区 */
.mobile-tab-bar__content {
  flex: 1;
  background: var(--color-bg-page);
  -webkit-overflow-scrolling: touch;
}

.content-inner {
  padding: var(--size-space-giant);
  min-height: 100%;
}

/* 底部导航 */
.mobile-tab-bar__nav {
  display: flex;
  align-items: flex-start;
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
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
  color: var(--color-text-tertiary);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s var(--size-ease-in-out);
}

.tab-item.is-active {
  color: var(--color-primary-default);
}

.tab-item:active {
  transform: scale(0.92);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--size-radius-medium);
  transition: all 0.2s var(--size-ease-in-out);
}

.tab-item.is-active .tab-icon {
  background: var(--color-primary-lighter);
  transform: scale(1.05);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tab-label {
  font-size: var(--size-font-tiny);
  font-weight: var(--size-font-weight-medium);
}

/* 深色模式 */
:root[data-theme-mode="dark"] .mobile-tab-bar__header,
.dark .mobile-tab-bar__header {
  background: var(--color-bg-container);
  border-bottom-color: var(--color-border-light);
}

:root[data-theme-mode="dark"] .mobile-tab-bar__nav,
.dark .mobile-tab-bar__nav {
  background: var(--color-bg-container);
  border-top-color: var(--color-border-light);
}

:root[data-theme-mode="dark"] .tab-item.is-active .tab-icon,
.dark .tab-item.is-active .tab-icon {
  background: var(--color-primary-light);
  opacity: 0.2;
}

/* ========== 高级动画优化 ========== */

/* Tab 项点击波纹效果 */
.tab-item::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--color-primary-lighter);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s, opacity 0.4s;
  opacity: 0;
}

.tab-item {
  position: relative;
  overflow: hidden;
}

.tab-item:active::before {
  width: 100px;
  height: 100px;
  opacity: 0.3;
}

/* 图标跳动动画 */
.tab-item.is-active .tab-icon {
  animation: iconBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes iconBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1.05);
  }
}

/* 图标光晕效果 */
.tab-item.is-active .tab-icon::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: inherit;
  background: var(--color-primary-default);
  opacity: 0;
  animation: iconGlow 0.5s ease forwards;
}

.tab-icon {
  position: relative;
}

@keyframes iconGlow {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

/* 底部导航栏美化 */
.mobile-tab-bar__nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

:root[data-theme-mode="dark"] .mobile-tab-bar__nav,
.dark .mobile-tab-bar__nav {
  background: rgba(15, 23, 42, 0.95);
}

/* Tab 标签渐变效果 */
.tab-item.is-active .tab-label {
  background: linear-gradient(135deg, var(--color-primary-default), #60a5fa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 内容区动画 */
.content-inner {
  animation: contentSlideIn 0.4s ease;
}

@keyframes contentSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 头部标题渐变 */
.header-title {
  background: linear-gradient(135deg, var(--color-text-primary), var(--color-primary-default));
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleShimmer 4s ease-in-out infinite;
}

@keyframes titleShimmer {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 200% center;
  }
}

/* 头部边框渐变线 */
.mobile-tab-bar__header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary-default), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.mobile-tab-bar__header {
  position: relative;
}

.mobile-tab-bar__header:hover::after {
  opacity: 0.3;
}

/* 底部导航上边框渐变线 */
.mobile-tab-bar__nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary-default), transparent);
  opacity: 0.3;
}

.mobile-tab-bar__nav {
  position: relative;
}

/* Tab 项点击缩放 */
.tab-item:active {
  transform: scale(0.9);
  transition: transform 0.1s;
}

/* 图标 SVG 动画 */
.tab-item svg {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tab-item.is-active svg {
  stroke-width: 2.5;
}

.tab-item:not(.is-active):hover svg {
  transform: scale(1.1);
}
</style>
