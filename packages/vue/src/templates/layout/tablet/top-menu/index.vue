<script setup lang="ts">
/**
 * Tablet TopMenu 平板端顶部导航布局
 * 水平导航栏 + 内容区
 * 优化：Grid 布局、多种滚动模式、自动隐藏头部
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { LayoutHeader, LayoutContent, LayoutFooter } from '../../../../components/layout'
import { ChromeTabs } from '@ldesign/bookmark-vue'

interface Props {
  headerHeight?: number
  tabsHeight?: number
  breadcrumbHeight?: number
  showTabs?: boolean
  showBreadcrumb?: boolean
  fixedHeader?: boolean
  fixedTabs?: boolean
  fixedBreadcrumb?: boolean
  showFooter?: boolean
  footerHeight?: number
  
  // 滚动行为
  autoHideHeader?: boolean
  scrollMode?: 'wrapper' | 'body'
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 56,
  tabsHeight: 44,
  breadcrumbHeight: 40,
  showTabs: false,
  showBreadcrumb: false,
  fixedHeader: true,
  fixedTabs: true,
  fixedBreadcrumb: false,
  showFooter: false,
  footerHeight: 48,
  autoHideHeader: false,
  scrollMode: 'wrapper',
})

// 滚动相关
const headerVisible = ref(true)
const lastScrollTop = ref(0)

// 自动隐藏 Header 逻辑
function handleScroll(e: Event) {
  if (!props.autoHideHeader) return
  
  const target = props.scrollMode === 'wrapper' ? (e.target as HTMLElement) : document.documentElement
  const scrollTop = target.scrollTop
  const threshold = 60

  if (scrollTop > threshold) {
    headerVisible.value = scrollTop < lastScrollTop.value
  } else {
    headerVisible.value = true
  }
  
  lastScrollTop.value = scrollTop
}

onMounted(() => {
  if (props.scrollMode === 'body') {
    window.addEventListener('scroll', () => handleScroll({ target: document.documentElement } as any))
  }
})

onUnmounted(() => {
  if (props.scrollMode === 'body') {
    window.removeEventListener('scroll', () => handleScroll({ target: document.documentElement } as any))
  }
})

const cssVars = computed(() => ({
  '--header-height': `${props.headerHeight}px`,
  '--tabs-height': `${props.tabsHeight}px`,
  '--breadcrumb-height': `${props.breadcrumbHeight}px`,
  '--footer-height': `${props.footerHeight}px`,
}))
</script>

<template>
  <div class="tablet-top-menu" :class="[`mode-${scrollMode}`]" :style="cssVars">
    
    <!-- 头部区域 (Header + Tabs + Breadcrumb) -->
    <header class="layout-header-group" :class="[
      { 'is-hidden': !headerVisible, 'is-fixed': fixedHeader },
      fixedHeader ? 'sticky-top' : ''
    ]">
      <!-- 顶栏 -->
      <LayoutHeader :height="headerHeight" :fixed="false" class="tablet-top-menu__header">
        <template #left>
          <div class="header-brand">
            <slot name="logo" />
          </div>
        </template>
        <template #center>
          <nav class="header-nav">
            <slot name="menu" />
          </nav>
        </template>
        <template #right>
          <div class="header-actions">
            <slot name="header-right" />
          </div>
        </template>
      </LayoutHeader>

      <!-- 标签栏 -->
      <div v-if="showTabs" class="layout-tabs-wrapper" :class="{ 'is-fixed': fixedTabs }">
        <slot name="tabs">
          <ChromeTabs :height="tabsHeight" />
        </slot>
      </div>

      <!-- 面包屑 -->
      <div v-if="showBreadcrumb" class="layout-breadcrumb-wrapper" :class="{ 'is-fixed': fixedBreadcrumb }">
         <slot name="breadcrumb"></slot>
      </div>
    </header>

    <!-- 内容滚动区 -->
    <LayoutContent 
      class="layout-content-scroll" 
      :class="{ 'scroll-wrapper': scrollMode === 'wrapper' }"
      @scroll="scrollMode === 'wrapper' ? handleScroll($event) : undefined"
    >
      <div class="content-inner">
        <slot />
      </div>
      
      <!-- 页脚 -->
      <LayoutFooter v-if="showFooter" :height="footerHeight" class="tablet-top-menu__footer">
        <slot name="footer" />
      </LayoutFooter>
    </LayoutContent>
  </div>
</template>

<style scoped>
/* ========== CSS Variables Mapping ========== */
.tablet-top-menu {
  /* Colors */
  --color-bg-layout: #f5f7fa;
  --color-bg-container: #ffffff;
  --color-border: rgba(226, 232, 240, 0.8);
  --color-border-secondary: #eef0f3;
  --color-text-primary: #0f172a;
  --color-text-secondary: #595959;
  --color-text-tertiary: #8c8c8c;
  --color-primary-700: #1e3a5f;
  --color-primary-900: #0d1f33;

  display: grid;
  width: 100%;
  background: var(--color-bg-layout);
  transition: all 0.3s ease;
}

/* Grid Definitions */
.tablet-top-menu.mode-wrapper {
  height: 100vh;
  grid-template-columns: 1fr;
  grid-template-rows: 100%;
  overflow: hidden;
}

.tablet-top-menu.mode-body {
  min-height: 100vh;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
}

/* ========== Header Group ========== */
.layout-header-group {
  z-index: 90;
  background: var(--color-bg-layout);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.layout-header-group.sticky-top {
  position: sticky;
  top: 0;
}

.layout-header-group.is-hidden {
  transform: translateY(-100%);
}

.tablet-top-menu__header {
  background: linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-900) 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  color: white;
}

.header-brand { display: flex; align-items: center; padding-left: 20px; }
.header-nav { display: flex; align-items: center; justify-content: center; height: 100%; }
.header-actions { display: flex; align-items: center; gap: 8px; padding-right: 20px; }

.layout-tabs-wrapper {
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border-secondary);
}

.layout-breadcrumb-wrapper {
  padding: 8px 16px;
}

/* ========== Content Area ========== */
.layout-content-scroll {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-layout);
}

.layout-content-scroll.scroll-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  height: 0;
}

.content-inner {
  flex: 1;
  padding: 20px;
  min-height: calc(100vh - 120px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== Footer ========== */
.tablet-top-menu__footer {
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border-secondary);
}

/* 导航栏悬停效果 */
.header-nav :deep(a),
.header-nav :deep(button) {
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.8);
}

.header-nav :deep(a:hover),
.header-nav :deep(button:hover) {
  transform: translateY(-2px);
  color: white;
}

/* 深色模式 */
:root[data-theme-mode="dark"] .tablet-top-menu,
.dark .tablet-top-menu {
  --color-bg-layout: #000000;
  --color-bg-container: #141414;
  --color-border-secondary: #303030;
}

:root[data-theme-mode="dark"] .tablet-top-menu__header,
.dark .tablet-top-menu__header {
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
}
</style>
