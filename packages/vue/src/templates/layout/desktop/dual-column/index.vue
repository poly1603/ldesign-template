<script setup lang="ts">
/**
 * DualColumn 双栏布局模板
 * VS Code 风格升级版：侧边图标栏 + 资源侧边栏 + 内容区
 * 优化：Grid 布局、多种滚动模式、自动隐藏头部
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { LayoutHeader, LayoutContent, LayoutFooter } from '../../../../components/layout'
import { ChromeTabs } from '@ldesign/bookmark-vue'
import { useAutoDevice } from '../../../../composables/useAutoDevice'

interface Props {
  iconBarWidth?: number
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
  defaultCollapsed?: boolean
  showFooter?: boolean
  footerHeight?: number
  
  // 滚动行为
  autoHideHeader?: boolean
  scrollMode?: 'wrapper' | 'body'
}

const props = withDefaults(defineProps<Props>(), {
  iconBarWidth: 64,
  siderWidth: 240,
  siderCollapsedWidth: 0,
  headerHeight: 56,
  tabsHeight: 44,
  breadcrumbHeight: 40,
  showTabs: true,
  showBreadcrumb: false,
  fixedHeader: true,
  fixedTabs: true,
  fixedBreadcrumb: false,
  defaultCollapsed: false,
  showFooter: true,
  footerHeight: 28,
  autoHideHeader: false,
  scrollMode: 'wrapper',
})

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
  siderCollapsed.value = !siderCollapsed.value
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
  '--icon-bar-width': `${props.iconBarWidth}px`,
  '--sider-width': `${props.siderWidth}px`,
  '--sider-collapsed-width': `${props.siderCollapsedWidth}px`,
  '--footer-height': `${props.footerHeight}px`,
}))
</script>

<template>
  <div class="layout-dual" :class="[
    `mode-${scrollMode}`,
    { 'is-collapsed': siderCollapsed, 'is-mobile': isMobile }
  ]" :style="cssVars">
    
    <!-- 图标栏 (Grid: IconBar) -->
    <aside class="layout-area-iconbar">
      <div class="icon-bar-wrapper">
        <div class="icon-bar-logo">
          <slot name="logo" />
        </div>
        <nav class="icon-bar-nav">
          <slot name="icon-bar" />
        </nav>
        <div class="icon-bar-footer">
          <slot name="icon-bar-footer">
            <button class="icon-bar-collapse-btn" @click="handleToggleSider" :title="siderCollapsed ? '展开侧边栏' : '收起侧边栏'">
              <svg :class="{ 'is-collapsed': siderCollapsed }" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </button>
          </slot>
        </div>
      </div>
    </aside>

    <!-- 次级侧边栏 (Grid: Sider) -->
    <aside class="layout-area-sider">
      <div class="sider-wrapper">
        <div class="sider-header">
          <slot name="sider-header">
            <span class="sider-title">Explorer</span>
          </slot>
        </div>
        <nav class="sider-menu">
          <slot name="sider" :collapsed="siderCollapsed" />
        </nav>
      </div>
    </aside>

    <!-- 遮罩层 -->
    <div v-if="isMobile && siderVisible" class="layout-dual__mask" @click="handleCloseSider" />

    <!-- 主区域 (Grid: Main) -->
    <main class="layout-area-main">
      
      <!-- 头部区域 (Header + Tabs + Breadcrumb) -->
      <header class="layout-header-group" :class="[
        { 'is-hidden': !headerVisible, 'is-fixed': fixedHeader },
        fixedHeader ? 'sticky-top' : ''
      ]">
        <!-- 顶栏 -->
        <LayoutHeader :height="headerHeight" :fixed="false" class="layout-dual__header" @toggle-sider="handleToggleSider">
          <template #left>
            <slot name="header-left" />
          </template>
          <template #right>
            <slot name="header-right" :variant="'light'" />
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
        
        <!-- 页脚状态栏 -->
        <LayoutFooter v-if="showFooter" :height="footerHeight" class="layout-dual__footer">
          <slot name="footer">
            <div class="status-bar">
              <span class="status-item">Ready</span>
              <span class="status-item">Ln 1, Col 1</span>
              <span class="status-item">UTF-8</span>
            </div>
          </slot>
        </LayoutFooter>
      </LayoutContent>
    </main>
  </div>
</template>

<style scoped>
/* ========== CSS Variables Mapping ========== */
.layout-dual {
  /* Colors - Modern Theme */
  --color-bg-layout: #f8fafc;
  --color-bg-container: #ffffff;
  --color-border: rgba(226, 232, 240, 0.8);
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-primary: var(--color-primary-500, #3b82f6);
  --color-primary-active: #2563eb;
  --color-fill-hover: #f1f5f9;

  /* Icon Bar Specific (Primary Color) */
  --icon-bar-bg: var(--color-primary);
  --icon-bar-text: rgba(255, 255, 255, 0.7);
  --icon-bar-text-active: #ffffff;
  --icon-bar-active-bg: rgba(255, 255, 255, 0.1);
  --icon-bar-hover: rgba(255, 255, 255, 0.1);

  /* Shadows */
  --shadow-header: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sider: 4px 0 24px 0 rgba(0, 0, 0, 0.05);
  --shadow-tabs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  display: grid;
  width: 100%;
  background: var(--color-bg-layout);
  transition: all 0.3s ease;
}

/* Grid Definitions */
.layout-dual.mode-wrapper {
  height: 100vh;
  grid-template-columns: var(--icon-bar-width) auto 1fr;
  grid-template-rows: 100vh;
  overflow: hidden;
}

.layout-dual.mode-body {
  min-height: 100vh;
  grid-template-columns: var(--icon-bar-width) auto 1fr;
  grid-template-rows: auto;
}

/* Mobile */
.layout-dual.is-mobile {
  grid-template-columns: 1fr;
}

/* ========== Icon Bar Area ========== */
.layout-area-iconbar {
  grid-column: 1;
  grid-row: 1;
  z-index: 1030;
  background: var(--icon-bar-bg);
}

.icon-bar-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: var(--icon-bar-text);
  /* Sticky logic for body mode */
}

.layout-dual.mode-body .icon-bar-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
}

.layout-dual.is-mobile .layout-area-iconbar {
  display: none; /* Hide or convert to drawer in mobile */
}

/* ========== Secondary Sider Area ========== */
.layout-area-sider {
  grid-column: 2;
  grid-row: 1;
  width: var(--sider-width);
  z-index: 1020;
  background: var(--color-bg-container);
  border-right: 1px solid var(--color-border);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  overflow: hidden;
}

.layout-dual.is-collapsed .layout-area-sider {
  width: var(--sider-collapsed-width); /* Usually 0 */
  border-right: none;
}

.sider-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: var(--sider-width); /* Fix width inside to prevent squashing */
}

.layout-dual.mode-body .sider-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
}

/* ========== Main Area ========== */
.layout-area-main {
  grid-column: 3;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.layout-dual.is-mobile .layout-area-main {
  grid-column: 1;
}

/* Header Group */
.layout-header-group {
  z-index: 1010;
  background: var(--color-bg-layout);
  transition: transform 0.3s ease;
}

.layout-header-group.sticky-top {
  position: sticky;
  top: 0;
}

.layout-header-group.is-hidden {
  transform: translateY(-100%);
}

.layout-dual__header {
  background: var(--layout-header-bg, var(--color-bg-container));
  color: var(--layout-header-color, var(--color-text-primary));
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-header);
}

.layout-tabs-wrapper {
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-tabs);
}

.layout-breadcrumb-wrapper {
  padding: 8px 16px;
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
  height: 0;
}

.content-inner {
  flex: 1;
  padding: 24px;
  min-height: calc(100vh - 200px);
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Footer Status Bar */
.layout-dual__footer {
  background: var(--color-primary, #3b82f6);
  color: white;
  z-index: 1020;
}

/* Internal Components */
.icon-bar-logo { height: 56px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; color: var(--icon-bar-text-active); }
.icon-bar-nav { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px 0; overflow-y: auto; }
.icon-bar-footer { padding: 16px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.icon-bar-collapse-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: none; border-radius: 8px; background: var(--icon-bar-hover); color: var(--icon-bar-text); cursor: pointer; transition: all 0.3s; }
.icon-bar-collapse-btn:hover { background: var(--icon-bar-active-bg); color: var(--icon-bar-text-active); transform: scale(1.1); }
.icon-bar-collapse-btn svg.is-collapsed { transform: rotate(180deg); }

.sider-header { height: 56px; display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid var(--color-border); }
.sider-title { font-size: 14px; font-weight: 600; color: var(--color-text-primary); }
.sider-menu { flex: 1; overflow-y: auto; padding: 12px 8px; --l-menu-bg-color: transparent; --l-menu-text-color: var(--color-text-primary); }
.status-bar { display: flex; align-items: center; height: 100%; padding: 0 16px; font-size: 12px; }
.status-item { padding: 0 12px; display: flex; align-items: center; gap: 6px; opacity: 0.9; cursor: default; transition: opacity 0.2s; }
.status-item:hover { opacity: 1; background: rgba(255, 255, 255, 0.1); height: 100%; }

/* Dark Mode */
:root[data-theme-mode="dark"] .layout-dual,
.dark .layout-dual {
  --color-bg-layout: #020617;
  --color-bg-container: #0f172a;
  --color-border: #1e293b;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --icon-bar-bg: #0f172a;
}

/* Mobile Mask */
.layout-dual__mask { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(2px); z-index: 1015; }

/* Responsive */
@media (max-width: 768px) {
  .content-inner { padding: 16px; }
}
</style>
