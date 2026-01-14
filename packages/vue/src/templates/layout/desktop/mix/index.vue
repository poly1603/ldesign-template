<script setup lang="ts">
/**
 * Mix 混合布局模板
 * 顶部一级导航 + 左侧二级导航 + 内容区
 * 现代化设计，适用于大型后台系统
 * 优化：Grid 布局、多种滚动模式、自动隐藏头部
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from '../../../../components/layout'
import { ChromeTabs } from '@ldesign/bookmark-vue'
import { useAutoDevice } from '../../../../composables/useAutoDevice'

interface Props {
  siderWidth?: number
  siderCollapsedWidth?: number
  headerHeight?: number
  tabsHeight?: number
  breadcrumbHeight?: number
  showTabs?: boolean
  showBreadcrumb?: boolean
  fixedHeader?: boolean
  fixedTabs?: boolean
  fixedBreadcrumb?: boolean
  fixedSider?: boolean
  defaultCollapsed?: boolean
  showFooter?: boolean
  footerHeight?: number

  // 滚动行为
  autoHideHeader?: boolean
  scrollMode?: 'wrapper' | 'body'
}

const props = withDefaults(defineProps<Props>(), {
  siderWidth: 220,
  siderCollapsedWidth: 56,
  headerHeight: 56,
  tabsHeight: 44,
  breadcrumbHeight: 40,
  showTabs: true,
  showBreadcrumb: false,
  fixedHeader: true,
  fixedTabs: true,
  fixedBreadcrumb: false,
  fixedSider: true,
  defaultCollapsed: false,
  showFooter: true,
  footerHeight: 48,
  autoHideHeader: false,
  scrollMode: 'wrapper',
})

const emit = defineEmits<{
  siderCollapse: [collapsed: boolean]
}>()

const { isMobile } = useAutoDevice()
const siderCollapsed = ref(props.defaultCollapsed)
const siderVisible = ref(false)

// 滚动相关
const headerVisible = ref(true)
const lastScrollTop = ref(0)

const actualSiderWidth = computed(() =>
  siderCollapsed.value ? props.siderCollapsedWidth : props.siderWidth,
)

watch(isMobile, (mobile) => {
  if (mobile) {
    siderCollapsed.value = true
    siderVisible.value = false
  }
})

function handleToggleSider() {
  if (isMobile.value) {
    siderVisible.value = !siderVisible.value
  } else {
    siderCollapsed.value = !siderCollapsed.value
    emit('siderCollapse', siderCollapsed.value)
  }
}

function handleCloseSider() {
  siderVisible.value = false
}

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
  '--sider-width': `${props.siderWidth}px`,
  '--sider-collapsed-width': `${props.siderCollapsedWidth}px`,
  '--footer-height': `${props.footerHeight}px`,
}))
</script>

<template>
  <div class="layout-mix" :class="[
    `mode-${scrollMode}`,
    { 'is-collapsed': siderCollapsed, 'is-mobile': isMobile }
  ]" :style="cssVars">

    <!-- 头部区域 (Grid: Header) -->
    <header class="layout-area-header" :class="[
      { 'is-hidden': !headerVisible, 'is-fixed': fixedHeader },
      fixedHeader ? 'sticky-top' : ''
    ]">
      <LayoutHeader :height="headerHeight" :fixed="false" class="layout-mix__header">
        <template #left>
          <div class="layout-mix__brand">
            <div class="layout-mix__logo">
              <slot name="logo" />
            </div>
            <nav class="layout-mix__top-menu">
              <slot name="top-menu" />
            </nav>
          </div>
        </template>
        <template #right>
          <div class="layout-mix__header-right">
            <slot name="header-right" :variant="'primary'" />
          </div>
        </template>
      </LayoutHeader>
    </header>

    <!-- 侧边栏 (Grid: Sider) -->
    <aside class="layout-area-sider" :class="[
      { 'fixed-sider': fixedSider },
      { 'header-hidden': !headerVisible }
    ]">
      <LayoutSider v-model:collapsed="siderCollapsed" v-model:visible="siderVisible" :width="siderWidth"
        :collapsed-width="siderCollapsedWidth" :fixed="false" :drawer="isMobile" :top-offset="0"
        class="layout-mix__sider" @mask-click="handleCloseSider">
        <div class="layout-mix__sider-title" v-if="!siderCollapsed">
          <slot name="sider-title">
            <span class="sider-title-text">导航菜单</span>
          </slot>
        </div>
        <div class="layout-mix__sider-menu">
          <slot name="sider" :collapsed="siderCollapsed" />
        </div>
        <template #footer>
          <div class="layout-mix__sider-footer">
            <button class="sider-collapse-btn" @click="handleToggleSider" :title="siderCollapsed ? '展开菜单' : '收起菜单'">
              <svg :class="{ 'is-collapsed': siderCollapsed }" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 17l-5-5 5-5" />
                <path d="M18 17l-5-5 5-5" />
              </svg>
            </button>
          </div>
        </template>
      </LayoutSider>
    </aside>

    <!-- 主区域 (Grid: Main) -->
    <main class="layout-area-main">

      <!-- 顶部锚点区域 (Tabs + Breadcrumb) -->
      <div class="layout-anchor-group" :class="[
        { 'is-hidden': !headerVisible && autoHideHeader },
        { 'is-fixed': fixedTabs || fixedBreadcrumb }
      ]">
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
      </div>

      <!-- 内容滚动区 -->
      <LayoutContent class="layout-content-scroll" :class="scrollMode === 'wrapper' ? 'scroll-wrapper' : ''"
        @scroll="scrollMode === 'wrapper' ? handleScroll($event) : undefined">
        <div class="content-inner">
          <slot />
        </div>

        <!-- 页脚 -->
        <LayoutFooter v-if="showFooter" :height="footerHeight" class="layout-mix__footer">
          <slot name="footer">
            <div class="footer-inner">© 2024 LDesign. All rights reserved.</div>
          </slot>
        </LayoutFooter>
      </LayoutContent>
    </main>
  </div>
</template>

<style scoped>
/* ========== CSS Variables Mapping ========== */
.layout-mix {
  /* Colors */
  --color-bg-layout: #f8fafc;
  --color-bg-container: #ffffff;
  --color-border: rgba(226, 232, 240, 0.8);
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-text-quaternary: #cbd5e1;
  --color-primary: var(--color-primary-500, #3b82f6);
  --color-primary-active: #2563eb;
  --color-fill-hover: #f1f5f9;

  /* Header */
  --header-bg: var(--color-primary);
  --header-text: #ffffff;
  --header-text-secondary: rgba(255, 255, 255, 0.8);
  --header-border: rgba(255, 255, 255, 0.1);
  --header-hover: rgba(255, 255, 255, 0.1);

  /* Shadows */
  --shadow-header: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-sider: 4px 0 24px 0 rgba(0, 0, 0, 0.05);
  --shadow-tabs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  display: grid;
  width: 100%;
  background: var(--color-bg-layout);
  transition: all 0.3s ease;
}

/* Grid Definitions */
.layout-mix.mode-wrapper {
  height: 100vh;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.layout-mix.mode-body {
  min-height: 100vh;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
}

.layout-mix.is-mobile {
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
}

/* ========== Header Area ========== */
.layout-area-header {
  grid-column: 1 / -1;
  grid-row: 1;
  z-index: 1020;
  transition: transform 0.3s ease;
}

.layout-area-header.sticky-top {
  position: sticky;
  top: 0;
}

.layout-area-header.is-hidden {
  transform: translateY(-100%);
}

.layout-mix__header {
  background: var(--header-bg);
  color: var(--header-text);
  border-bottom: 1px solid var(--header-border);
  box-shadow: var(--shadow-header);
  /* Override menu colors */
  --color-text-primary: var(--header-text);
  --color-text-secondary: var(--header-text-secondary);
  --color-fill-hover: var(--header-hover);
}

/* ========== Sider Area ========== */
.layout-area-sider {
  grid-column: 1;
  grid-row: 2;
  width: var(--sider-width);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1010;
  background: var(--color-bg-container);
  border-right: 1px solid var(--color-border);
  height: 100%;
  /* Force full height */
}

.layout-mix.is-collapsed .layout-area-sider {
  width: var(--sider-collapsed-width);
}

.layout-mix.is-mobile .layout-area-sider {
  width: 0;
}

/* Sticky Sider in Body Mode */
.layout-mix.mode-body .layout-area-sider.fixed-sider {
  position: sticky;
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  transition: top 0.3s ease, height 0.3s ease;
}

/* Adjust sticky top when header is hidden */
.layout-mix.mode-body .layout-area-sider.fixed-sider.header-hidden {
  top: 0;
  height: 100vh;
}

.layout-mix__sider {
  height: 100%;
  background: transparent !important;
}

/* ========== Main Area ========== */
.layout-area-main {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.layout-mix.is-mobile .layout-area-main {
  grid-column: 1;
}

/* Anchor Group (Tabs/Breadcrumb) */
.layout-anchor-group {
  z-index: 1005;
  background: var(--color-bg-layout);
  transition: transform 0.3s ease;
}

.layout-anchor-group.is-fixed {
  position: sticky;
  top: 0;
  /* Relative to Main Area or Window depending on context */
}

/* If body scroll, sticky relies on window scroll */
.layout-mix.mode-body .layout-anchor-group.is-fixed {
  top: var(--header-height);
}

.layout-mix.mode-body .layout-area-header.is-hidden~.layout-area-main .layout-anchor-group.is-fixed {
  top: 0;
}

.layout-tabs-wrapper {
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-tabs);
}

.layout-breadcrumb-wrapper {
  padding: 8px 16px;
}

/* Content */
.layout-content-scroll {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.layout-content-scroll.scroll-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  height: 0;
}

.content-inner {
  flex: 1;
  padding: 24px;
  min-height: calc(100vh - 200px);
  animation: slideUpFade 0.5s ease-out;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Footer */
.layout-mix__footer {
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border);
}

/* Internal Components */
.layout-mix__brand {
  display: flex;
  align-items: center;
  gap: 48px;
  height: 100%;
  flex: 1;
  min-width: 0;
}

.layout-mix__logo {
  display: flex;
  align-items: center;
  padding-left: 24px;
  min-width: 200px;
  color: var(--header-text);
}

.layout-mix__top-menu {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.layout-mix__header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-right: 24px;
  flex: 0 0 auto;
}

.layout-mix__sider-title {
  padding: 24px 20px 12px;
  transition: all 0.25s ease;
  overflow: hidden;
  white-space: nowrap;
}

.sider-title-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.layout-mix__sider-menu {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
  overflow-x: hidden;
}

.layout-mix__sider-footer {
  display: flex;
  justify-content: center;
  padding: 12px;
  border-top: 1px solid var(--color-border);
}

.sider-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
}

.sider-collapse-btn:hover {
  background: var(--color-fill-hover);
  color: var(--color-text-primary);
  transform: scale(1.05);
}

.sider-collapse-btn svg.is-collapsed {
  transform: rotate(180deg);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

/* Dark Mode */
:root[data-theme-mode="dark"] .layout-mix,
.dark .layout-mix {
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
  .content-inner {
    padding: 16px;
  }

  .layout-mix__brand {
    gap: 16px;
  }

  .layout-mix__logo {
    min-width: auto;
    padding-left: 16px;
  }
}

/* Top Menu Styles (Retained) */
.layout-mix__top-menu :deep(.l-menu) {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  background: transparent;
  gap: 4px;
}

.layout-mix__top-menu :deep(.l-menu-item),
.layout-mix__top-menu :deep(.l-submenu__title) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  height: 36px;
  border-radius: 8px;
  color: var(--header-text-secondary);
  font-size: 14px;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.layout-mix__top-menu :deep(.l-menu__more-label) {
  display: none;
}

.layout-mix__top-menu :deep(.l-menu__more .l-submenu__title) {
  justify-content: center;
  width: 36px;
  padding: 0;
}

.layout-mix__top-menu :deep(.l-menu__more .l-submenu__arrow) {
  padding-left: 0;
}

.layout-mix__top-menu :deep(.l-menu-item:hover),
.layout-mix__top-menu :deep(.l-submenu__title:hover) {
  color: var(--header-text);
  background: var(--header-hover);
  transform: translateY(-1px);
}

.layout-mix__top-menu :deep(.l-menu-item.is-active)::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: var(--header-text);
  border-radius: 3px;
}
</style>
