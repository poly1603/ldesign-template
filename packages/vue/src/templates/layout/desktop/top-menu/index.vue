<script setup lang="ts">
/**
 * TopMenu 顶部菜单布局模板
 * 现代化宽屏布局，顶部水平导航
 * 优化：Grid/Flex 布局、多种滚动模式、自动隐藏头部
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
  showFooter?: boolean
  footerHeight?: number
  maxContentWidth?: number
  
  // 布局行为
  fixedHeader?: boolean
  fixedTabs?: boolean
  fixedBreadcrumb?: boolean
  
  // 滚动行为
  autoHideHeader?: boolean
  scrollMode?: 'wrapper' | 'body'
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 60,
  tabsHeight: 44,
  breadcrumbHeight: 40,
  showTabs: true,
  showBreadcrumb: false,
  fixedHeader: true,
  fixedTabs: true,
  fixedBreadcrumb: false,
  showFooter: true,
  footerHeight: 48,
  maxContentWidth: 0,
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
  const threshold = 100

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
  '--max-content-width': props.maxContentWidth > 0 ? `${props.maxContentWidth}px` : '100%',
}))
</script>

<template>
  <div class="layout-top-menu" :class="[`mode-${scrollMode}`]" :style="cssVars">
    
    <!-- 头部区域组 -->
    <header class="layout-header-group" :class="[
      { 'is-hidden': !headerVisible, 'is-fixed': fixedHeader },
      fixedHeader ? 'sticky-top' : ''
    ]">
      <!-- 顶栏 -->
      <LayoutHeader :height="headerHeight" :fixed="false" class="layout-top-menu__header">
        <template #left>
          <div class="header-left">
            <div class="header-logo">
              <slot name="logo" />
            </div>
            <nav class="header-menu">
              <slot name="menu" />
            </nav>
          </div>
        </template>
        <template #center>
          <div class="header-center">
            <slot name="header-center" />
          </div>
        </template>
        <template #right>
          <div class="header-right">
            <slot name="header-right" :variant="'primary'" />
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
      <div class="content-container">
        <div class="content-wrapper">
          <slot />
        </div>
      </div>

      <!-- 页脚 -->
      <LayoutFooter v-if="showFooter" :height="footerHeight" class="layout-top-menu__footer">
        <slot name="footer">
          <div class="footer-content">
            <span>© 2024 LDesign. All rights reserved.</span>
          </div>
        </slot>
      </LayoutFooter>
    </LayoutContent>
  </div>
</template>

<style scoped>
.layout-top-menu {
  /* Colors - Modern Theme */
  --color-bg-layout: #f8fafc;
  --color-bg-container: #ffffff;
  --color-border: rgba(226, 232, 240, 0.8);
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-primary: var(--color-primary-500, #3b82f6);
  --color-primary-active: #2563eb;

  /* Header Specific */
  --header-bg: var(--color-primary);
  --header-text: #ffffff;
  --header-text-secondary: rgba(255, 255, 255, 0.8);
  --header-border: rgba(255, 255, 255, 0.1);
  --header-hover: rgba(255, 255, 255, 0.1);

  /* Shadows */
  --shadow-header: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-tabs: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--color-bg-layout);
  font-family: var(--size-font-family, system-ui, -apple-system, sans-serif);
}

/* Scroll Modes */
.layout-top-menu.mode-wrapper {
  height: 100vh;
  overflow: hidden;
}

.layout-top-menu.mode-body {
  min-height: 100vh;
}

/* Header Group */
.layout-header-group {
  z-index: 1020;
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

.layout-top-menu__header {
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  box-shadow: var(--shadow-header);
  color: var(--header-text);
  /* Override menu colors */
  --color-text-primary: var(--header-text);
  --color-text-secondary: var(--header-text-secondary);
  --color-fill-hover: var(--header-hover);
  --layout-header-bg: var(--header-bg);
  --layout-header-color: var(--header-text);
}

.layout-tabs-wrapper {
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-tabs);
}

.layout-breadcrumb-wrapper {
  padding: 8px 16px;
  max-width: var(--max-content-width);
  margin: 0 auto;
  width: 100%;
}

/* Content Area */
.layout-content-scroll {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.layout-content-scroll.scroll-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
}

.content-container {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  flex: 1;
  padding: 24px;
  max-width: var(--max-content-width);
  min-height: calc(100vh - 200px);
  animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header Inner Elements */
.header-left {
  display: flex; align-items: center; gap: 32px; height: 100%; padding-left: 24px;
}
.header-logo {
  display: flex; align-items: center; height: 100%; color: var(--header-text);
}
.header-menu {
  display: flex; align-items: center; height: 100%; margin-left: 16px; gap: 4px;
}
.header-center {
  display: flex; align-items: center; justify-content: center;
}
.header-right {
  display: flex; align-items: center; gap: 16px; padding-right: 24px;
}

/* Footer */
.layout-top-menu__footer {
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border);
}
.footer-content {
  display: flex; align-items: center; justify-content: center;
  height: 100%; font-size: 13px; color: var(--color-text-tertiary);
}

/* Dark Mode */
:root[data-theme-mode="dark"] .layout-top-menu,
.dark .layout-top-menu {
  --color-bg-layout: #020617;
  --color-bg-container: #0f172a;
  --color-border: #1e293b;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --header-bg: #0f172a;
  --header-text: #f8fafc;
  --header-border: #1e293b;
  --header-hover: #1e293b;
}

/* Responsive */
@media (max-width: 768px) {
  .header-left { gap: 16px; padding-left: 16px; }
  .header-right { padding-right: 16px; }
  .content-wrapper { padding: 16px; }
}

/* 保持原有的菜单样式 (省略部分以节省空间，但应保留关键样式) */
.header-menu :deep(.l-menu) { display: flex; flex-direction: row; align-items: center; height: 100%; background: transparent; gap: 4px; }
.header-menu :deep(.l-menu-item), .header-menu :deep(.l-submenu-title) {
  display: flex; align-items: center; gap: 8px; padding: 8px 16px; height: 36px; border-radius: 8px;
  color: var(--header-text-secondary); font-size: 14px; font-weight: 500; background: transparent;
  border: none; cursor: pointer; white-space: nowrap; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.header-menu :deep(.l-menu-item:hover), .header-menu :deep(.l-submenu-title:hover) {
  color: var(--header-text); background: var(--header-hover); transform: translateY(-1px);
}
.header-menu :deep(.l-menu-item.is-active), .header-menu :deep(.l-menu-item--active) {
  color: var(--header-text); background: var(--header-hover); position: relative;
}
.header-menu :deep(.l-menu-item.is-active)::after {
  content: ''; position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
  width: 20px; height: 3px; background: var(--header-text); border-radius: 3px;
}
</style>
