<script setup lang="ts">
/**
 * Sidebar 经典侧边栏布局模板
 * 现代化设计，支持平滑动画和深色模式
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
  showFooter?: boolean
  showBreadcrumb?: boolean
  footerHeight?: number
  defaultCollapsed?: boolean
  
  // 布局行为控制
  fixedHeader?: boolean
  fixedTabs?: boolean
  fixedBreadcrumb?: boolean
  fixedSider?: boolean
  
  // 滚动行为
  autoHideHeader?: boolean
  scrollMode?: 'wrapper' | 'body' // 'wrapper': 内容区滚动(类似App), 'body': 整体滚动(类似Web)
}

const props = withDefaults(defineProps<Props>(), {
  siderWidth: 240,
  siderCollapsedWidth: 64,
  headerHeight: 60,
  tabsHeight: 44,
  breadcrumbHeight: 40,
  showTabs: true,
  showFooter: true,
  showBreadcrumb: false,
  footerHeight: 48,
  defaultCollapsed: false,
  fixedHeader: true,
  fixedTabs: true,
  fixedBreadcrumb: false,
  fixedSider: true,
  autoHideHeader: false,
  scrollMode: 'wrapper',
})

const emit = defineEmits<{
  siderCollapse: [collapsed: boolean]
}>()

const { isMobile } = useAutoDevice()
const siderCollapsed = ref(props.defaultCollapsed)
const siderVisible = ref(false)
const isHovering = ref(false)

// 滚动相关
const headerVisible = ref(true)
const lastScrollTop = ref(0)
const scrollContainer = ref<HTMLElement | null>(null)

// 实际侧边栏宽度
const actualSiderWidth = computed(() =>
  siderCollapsed.value ? props.siderCollapsedWidth : props.siderWidth,
)

// 监听移动端切换
watch(isMobile, (mobile) => {
  if (mobile) {
    siderCollapsed.value = true
    siderVisible.value = false
  }
})

// 处理侧边栏切换
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
  const threshold = 100 // 滚动多少距离后开始生效

  if (scrollTop > threshold) {
    // 向下滚动隐藏，向上滚动显示
    headerVisible.value = scrollTop < lastScrollTop.value
  } else {
    // 顶部总是显示
    headerVisible.value = true
  }
  
  lastScrollTop.value = scrollTop
}

// 注册滚动监听
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

// CSS 变量
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
  <div class="layout-sidebar" :class="[
    `mode-${scrollMode}`,
    { 'is-collapsed': siderCollapsed, 'is-mobile': isMobile }
  ]" :style="cssVars">
    
    <!-- 侧边栏 (Grid Area: sider) -->
    <div class="layout-area-sider" :class="{ 'fixed-sider': fixedSider }">
      <LayoutSider 
        v-model:collapsed="siderCollapsed" 
        v-model:visible="siderVisible" 
        :width="siderWidth"
        :collapsed-width="siderCollapsedWidth" 
        :fixed="false" 
        :drawer="isMobile" 
        class="layout-sider-component" 
        @mask-click="handleCloseSider" 
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <template #logo>
          <div class="layout-sidebar__logo" :class="{ 'is-collapsed': siderCollapsed }">
            <slot name="logo" :collapsed="siderCollapsed" />
          </div>
        </template>

        <div class="layout-sidebar__menu">
          <slot name="sider" :collapsed="siderCollapsed" />
        </div>

        <template #footer>
          <div class="layout-sidebar__sider-footer">
            <slot name="sider-footer" :collapsed="siderCollapsed">
              <button class="collapse-btn" @click="handleToggleSider" :title="siderCollapsed ? '展开菜单' : '收起菜单'">
                <svg :class="{ 'is-collapsed': siderCollapsed }" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </slot>
          </div>
        </template>
      </LayoutSider>
    </div>

    <!-- 主区域 (Grid Area: main) -->
    <main class="layout-area-main">
      
      <!-- 头部区域组 (Header + Tabs + Breadcrumb) -->
      <div class="layout-header-group" :class="[
        { 'is-hidden': !headerVisible, 'is-fixed': fixedHeader },
        fixedHeader ? 'sticky-top' : ''
      ]">
        
        <!-- 顶栏 -->
        <LayoutHeader :height="headerHeight" :fixed="false" class="layout-header-component" @toggle-sider="handleToggleSider">
          <template #menuButton>
            <slot name="menu-button">
              <div class="menu-toggle-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </div>
            </slot>
          </template>
          <template #left><slot name="header-left" /></template>
          <template #center><slot name="header-center" /></template>
          <template #right><slot name="header-right" :variant="'light'" /></template>
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
      </div>

      <!-- 内容滚动区 -->
      <LayoutContent 
        class="layout-content-scroll" 
        :class="{ 'scroll-wrapper': scrollMode === 'wrapper' }"
        @scroll="scrollMode === 'wrapper' ? handleScroll($event) : undefined"
      >
        <div class="content-wrapper">
          <slot />
        </div>
        
        <!-- 页脚 -->
        <LayoutFooter v-if="showFooter" :height="footerHeight" class="layout-sidebar__footer">
          <slot name="footer">
            <div class="footer-content">
              <span>© 2024 LDesign. All rights reserved.</span>
            </div>
          </slot>
        </LayoutFooter>
      </LayoutContent>

    </main>
  </div>
</template>

<style scoped>
.layout-sidebar {
  /* Colors */
  --color-bg-layout: #f8fafc;
  --color-bg-container: #ffffff;
  --color-border: rgba(226, 232, 240, 0.8);
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-primary: var(--color-primary-500, #3b82f6);
  
  /* Sider Specific */
  --sider-bg: var(--color-primary);
  --sider-text: #ffffff;
  --sider-text-secondary: rgba(255, 255, 255, 0.85);
  --sider-hover: rgba(255, 255, 255, 0.15);
  --sider-active: rgba(255, 255, 255, 0.25);
  
  /* Shadows */
  --shadow-header: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sider: 4px 0 24px 0 rgba(0, 0, 0, 0.1);
  --shadow-tabs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  display: grid;
  width: 100%;
  min-height: 100vh; /* Ensure full viewport height */
  background: var(--color-bg-layout);
  transition: all 0.3s ease;
}

/* Grid Definitions */
/* Mode: Wrapper (App-like, fixed height, internal scroll) */
.layout-sidebar.mode-wrapper {
  height: 100vh;
  grid-template-columns: auto 1fr;
  grid-template-rows: 100%;
  overflow: hidden;
}

/* Mode: Body (Web-like, window scroll) */
.layout-sidebar.mode-body {
  min-height: 100vh;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
}

/* Mobile */
.layout-sidebar.is-mobile {
  grid-template-columns: 1fr; /* Sider becomes drawer */
}

/* ========== Sider Area ========== */
.layout-area-sider {
  grid-column: 1;
  grid-row: 1 / -1;
  width: var(--sider-width);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  background: var(--sider-bg); /* Ensure background covers full height */
  height: 100%; /* Force fill grid cell */
}

.layout-sidebar.is-collapsed .layout-area-sider {
  width: var(--sider-collapsed-width);
}

.layout-sidebar.is-mobile .layout-area-sider {
  width: 0; /* Hidden in grid, handled by fixed drawer */
}

/* Sider Component Styling */
.layout-sider-component {
  height: 100%;
  background: var(--sider-bg) !important;
  color: var(--sider-text);
  box-shadow: var(--shadow-sider);
}

/* Sticky Sider in Body Mode */
.layout-sidebar.mode-body .layout-area-sider.fixed-sider {
  position: sticky;
  top: 0;
  height: 100vh;
}

/* ========== Main Area ========== */
.layout-area-main {
  grid-column: 2; /* 默认在第二列 */
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevent flex child overflow */
}

.layout-sidebar.is-mobile .layout-area-main {
  grid-column: 1;
}

/* ========== Header Group ========== */
.layout-header-group {
  z-index: 90;
  background: var(--color-bg-layout);
  transition: transform 0.3s ease;
}

/* Sticky/Fixed Header Logic */
.layout-header-group.sticky-top {
  position: sticky;
  top: 0;
}

.layout-header-group.is-hidden {
  transform: translateY(-100%);
}

.layout-header-component {
  background: var(--color-bg-container);
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

/* ========== Content Area ========== */
.layout-content-scroll {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Wrapper mode scroll */
.layout-content-scroll.scroll-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  height: 0; /* Force flex item to respect container height */
}

.content-wrapper {
  flex: 1;
  padding: 24px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Mobile tweaks */
@media (max-width: 768px) {
  .content-wrapper { padding: 16px; }
}

/* Dark Mode Overrides */
:root[data-theme-mode="dark"] .layout-sidebar,
.dark .layout-sidebar {
  --color-bg-layout: #020617;
  --color-bg-container: #0f172a;
  --color-border: #1e293b;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --sider-bg: var(--color-primary-950, #172554);
  --sider-text: #f8fafc;
}

/* ========== Sider Inner Elements (Menu, Logo, Footer) ========== */
/* Reuse existing styles for inner elements */
.layout-sidebar__logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: var(--sider-text);
  transition: padding 0.3s ease, justify-content 0.3s ease;
}
.layout-sidebar__logo.is-collapsed { justify-content: center; padding: 0; }

.layout-sidebar__menu {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Menu variable overrides for dark/colored sidebar */
  --l-menu-bg-color: transparent;
  --l-menu-hover-bg-color: rgba(255, 255, 255, 0.1);
  --l-menu-active-bg-color: rgba(255, 255, 255, 0.15);
  --l-menu-selected-bg-color: rgba(255, 255, 255, 0.2);
  
  /* Text Colors */
  --l-menu-text-color: rgba(255, 255, 255, 0.85);
  --l-menu-hover-text-color: #ffffff;
  --l-menu-active-text-color: #ffffff;
  --l-menu-selected-text-color: #ffffff;
  
  /* Indicator */
  --l-menu-selected-indicator-color: #ffffff;
}

/* Force menu item background transparency and text color */
.layout-sidebar__menu :deep(.l-menu-item),
.layout-sidebar__menu :deep(.l-submenu-title) {
  background-color: transparent !important;
  color: var(--l-menu-text-color) !important;
}

.layout-sidebar__menu :deep(.l-menu-item:hover),
.layout-sidebar__menu :deep(.l-submenu-title:hover) {
  background-color: var(--l-menu-hover-bg-color) !important;
  color: var(--l-menu-hover-text-color) !important;
}

.layout-sidebar__menu :deep(.l-menu-item.is-selected),
.layout-sidebar__menu :deep(.l-menu-item.is-active) {
  background-color: var(--l-menu-selected-bg-color) !important;
  color: var(--l-menu-selected-text-color) !important;
}

/* Menu icons */
.layout-sidebar__menu :deep(.l-icon) {
  color: inherit !important;
}

.layout-sidebar__sider-footer {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent;
  color: var(--sider-text-secondary);
  border-radius: 6px; cursor: pointer;
  transition: all 0.2s;
}
.collapse-btn:hover { background: var(--sider-hover); color: var(--sider-text); }
.collapse-btn svg.is-collapsed { transform: rotate(180deg); }

.menu-toggle-btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border: none; background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
}
.layout-sidebar__footer {
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border);
  padding: 0 24px;
}
.footer-content {
  display: flex; align-items: center; justify-content: center;
  height: 100%; font-size: 13px; color: var(--color-text-tertiary);
}
</style>
