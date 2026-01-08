<script setup lang="ts">
/**
 * Tablet Drawer 平板端抽屉布局
 * 滑出式抽屉菜单，触摸优化
 * 优化：Grid 布局、多种滚动模式、自动隐藏头部
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { LayoutHeader, LayoutContent, LayoutFooter } from '../../../../components/layout'
import { ChromeTabs } from '@ldesign/bookmark-vue'

interface Props {
  drawerWidth?: number
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
  drawerPosition?: 'left' | 'right'
  
  // 滚动行为
  autoHideHeader?: boolean
  scrollMode?: 'wrapper' | 'body'
}

const props = withDefaults(defineProps<Props>(), {
  drawerWidth: 280,
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
  drawerPosition: 'left',
  autoHideHeader: false,
  scrollMode: 'wrapper',
})

const drawerVisible = ref(false)

// 滚动相关
const headerVisible = ref(true)
const lastScrollTop = ref(0)

function openDrawer() {
  drawerVisible.value = true
}

function closeDrawer() {
  drawerVisible.value = false
}

function toggleDrawer() {
  drawerVisible.value = !drawerVisible.value
}

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

defineExpose({ openDrawer, closeDrawer, toggleDrawer })

const cssVars = computed(() => ({
  '--header-height': `${props.headerHeight}px`,
  '--tabs-height': `${props.tabsHeight}px`,
  '--breadcrumb-height': `${props.breadcrumbHeight}px`,
  '--footer-height': `${props.footerHeight}px`,
}))
</script>

<template>
  <div class="tablet-drawer" :class="[`mode-${scrollMode}`]" :style="cssVars">
    <!-- 抽屉 (Fixed overlay) -->
    <Teleport to="body">
      <Transition name="drawer-fade">
        <div v-if="drawerVisible" class="drawer-overlay" @click="closeDrawer" />
      </Transition>
      <Transition :name="drawerPosition === 'left' ? 'drawer-slide-left' : 'drawer-slide-right'">
        <aside v-if="drawerVisible" class="drawer-panel" :class="`drawer-panel--${drawerPosition}`"
          :style="{ width: `${drawerWidth}px` }">
          <div class="drawer-header">
            <slot name="logo">
              <span class="drawer-title">菜单</span>
            </slot>
            <button class="drawer-close" @click="closeDrawer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="drawer-body">
            <slot name="sider" />
          </div>
          <div class="drawer-footer" v-if="$slots['sider-footer']">
            <slot name="sider-footer" />
          </div>
        </aside>
      </Transition>
    </Teleport>

    <!-- 主区域 (Grid: Main) -->
    <main class="layout-area-main">
      
      <!-- 头部区域 (Header + Tabs + Breadcrumb) -->
      <header class="layout-header-group" :class="[
        { 'is-hidden': !headerVisible, 'is-fixed': fixedHeader },
        fixedHeader ? 'sticky-top' : ''
      ]">
        <!-- 顶栏 -->
        <LayoutHeader :height="headerHeight" :fixed="false" class="tablet-drawer__header">
          <template #menuButton>
            <button class="menu-btn" @click="toggleDrawer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </template>
          <template #left><slot name="header-left" /></template>
          <template #center><slot name="header-center" /></template>
          <template #right><slot name="header-right" /></template>
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
        <LayoutFooter v-if="showFooter" :height="footerHeight" class="tablet-drawer__footer">
          <slot name="footer" />
        </LayoutFooter>
      </LayoutContent>
    </main>
  </div>
</template>

<style scoped>
/* ========== CSS Variables Mapping ========== */
.tablet-drawer {
  /* Colors */
  --color-bg-layout: #f5f7fa;
  --color-bg-container: #ffffff;
  --color-border: rgba(226, 232, 240, 0.8);
  --color-border-secondary: #eef0f3;
  --color-text-primary: #1f2937;
  --color-text-tertiary: #8c8c8c;
  --color-text-secondary: #595959;
  --color-fill-secondary: #f0f0f0;
  --color-fill-tertiary: #e8e8e8;
  --color-fill-quaternary: #f5f5f5;

  display: grid;
  width: 100%;
  min-height: 100vh;
  background: var(--color-bg-layout);
}

/* Grid Definitions */
.tablet-drawer.mode-wrapper {
  height: 100vh;
  grid-template-columns: 1fr;
  grid-template-rows: 100%;
  overflow: hidden;
}

.tablet-drawer.mode-body {
  min-height: 100vh;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
}

/* ========== Main Area ========== */
.layout-area-main {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
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

.tablet-drawer__header {
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border-secondary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

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
}

/* ========== Footer ========== */
.tablet-drawer__footer {
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border-secondary);
}

/* ========== Drawer Components ========== */
.drawer-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(4px); z-index: 1000; }
.drawer-panel { position: fixed; top: 0; bottom: 0; display: flex; flex-direction: column; background: var(--color-bg-container); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12); z-index: 1001; }
.drawer-panel--left { left: 0; border-radius: 0 20px 20px 0; }
.drawer-panel--right { right: 0; border-radius: 20px 0 0 20px; }
.drawer-header { display: flex; align-items: center; justify-content: space-between; height: 60px; padding: 0 20px; border-bottom: 1px solid var(--color-border-secondary); }
.drawer-title { font-size: 18px; font-weight: 600; color: var(--color-text-primary); }
.drawer-close { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: var(--color-fill-quaternary); border: none; border-radius: 10px; color: var(--color-text-tertiary); cursor: pointer; -webkit-tap-highlight-color: transparent; transition: all 0.2s ease; }
.drawer-close:active { transform: scale(0.9); background: var(--color-fill-tertiary); }
.drawer-body { flex: 1; padding: 16px; overflow-y: auto; -webkit-overflow-scrolling: touch; }
.drawer-footer { padding: 16px; border-top: 1px solid var(--color-border-secondary); }
.menu-btn { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: transparent; border: none; border-radius: 12px; color: var(--color-text-secondary); cursor: pointer; -webkit-tap-highlight-color: transparent; transition: all 0.2s ease; }
.menu-btn:active { background: var(--color-fill-secondary); transform: scale(0.9); }

/* Animation */
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.3s ease; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }
.drawer-slide-left-enter-active, .drawer-slide-left-leave-active, .drawer-slide-right-enter-active, .drawer-slide-right-leave-active { transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1); }
.drawer-slide-left-enter-from, .drawer-slide-left-leave-to { transform: translateX(-100%); }
.drawer-slide-right-enter-from, .drawer-slide-right-leave-to { transform: translateX(100%); }

/* Dark Mode */
:root[data-theme-mode="dark"] .tablet-drawer,
.dark .tablet-drawer {
  --color-bg-layout: #000000;
  --color-bg-container: #141414;
  --color-border-secondary: #303030;
}

:root[data-theme-mode="dark"] .drawer-panel,
.dark .drawer-panel {
  background: #1f1f1f;
}
</style>
