<script setup lang="ts">
/**
 * Tablet Sidebar 平板端侧边栏布局
 * 可折叠侧边栏 + 顶栏，优化触摸交互
 * 优化：Grid 布局、多种滚动模式、自动隐藏头部
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from '../../../../components/layout'
import { ChromeTabs } from '@ldesign/bookmark-vue'

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
  siderWidth: 240,
  siderCollapsedWidth: 72,
  headerHeight: 56,
  tabsHeight: 44,
  breadcrumbHeight: 40,
  showTabs: false,
  showBreadcrumb: false,
  fixedHeader: true,
  fixedTabs: true,
  fixedBreadcrumb: false,
  fixedSider: true,
  defaultCollapsed: true,
  showFooter: false,
  footerHeight: 48,
  autoHideHeader: false,
  scrollMode: 'wrapper',
})

const emit = defineEmits<{
  siderCollapse: [collapsed: boolean]
}>()

const siderCollapsed = ref(props.defaultCollapsed)

// 滚动相关
const headerVisible = ref(true)
const lastScrollTop = ref(0)

const actualSiderWidth = computed(() =>
  siderCollapsed.value ? props.siderCollapsedWidth : props.siderWidth,
)

function handleToggleSider() {
  siderCollapsed.value = !siderCollapsed.value
  emit('siderCollapse', siderCollapsed.value)
}

function handleCloseSider() {
  // 平板模式下点击遮罩可能需要关闭侧边栏（如果它是浮动的）
  // 这里暂时保持折叠逻辑
  siderCollapsed.value = true
  emit('siderCollapse', true)
}

// 自动隐藏 Header 逻辑
function handleScroll(e: Event) {
  if (!props.autoHideHeader) return
  
  const target = props.scrollMode === 'wrapper' ? (e.target as HTMLElement) : document.documentElement
  const scrollTop = target.scrollTop
  const threshold = 60 // 平板端阈值稍小

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
  <div class="tablet-sidebar" :class="[
    `mode-${scrollMode}`,
    { 'is-collapsed': siderCollapsed }
  ]" :style="cssVars">
    
    <!-- 侧边栏 (Grid: Sider) -->
    <aside class="layout-area-sider" :class="{ 'fixed-sider': fixedSider }">
      <LayoutSider v-model:collapsed="siderCollapsed" :width="siderWidth" :collapsed-width="siderCollapsedWidth"
        :fixed="false" :top-offset="0" class="tablet-sidebar__sider">
        <template #logo>
          <div class="sider-logo" :class="{ 'is-collapsed': siderCollapsed }">
            <slot name="logo" :collapsed="siderCollapsed" />
          </div>
        </template>

        <div class="sider-menu">
          <slot name="sider" :collapsed="siderCollapsed" />
        </div>

        <template #footer>
          <div class="sider-footer">
            <slot name="sider-footer" :collapsed="siderCollapsed">
              <button class="collapse-toggle" @click="handleToggleSider">
                <svg :class="{ 'is-collapsed': siderCollapsed }" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="11 17 6 12 11 7" />
                  <polyline points="18 17 13 12 18 7" />
                </svg>
              </button>
            </slot>
          </div>
        </template>
      </LayoutSider>
    </aside>

    <!-- 主区域 (Grid: Main) -->
    <main class="layout-area-main">
      
      <!-- 头部区域 (Header + Tabs + Breadcrumb) -->
      <header class="layout-header-group" :class="[
        { 'is-hidden': !headerVisible, 'is-fixed': fixedHeader },
        fixedHeader ? 'sticky-top' : ''
      ]">
        <!-- 顶栏 -->
        <LayoutHeader :height="headerHeight" :fixed="false" class="tablet-sidebar__header" @toggle-sider="handleToggleSider">
          <template #menuButton>
            <slot name="menu-button">
              <button class="menu-btn" @click="handleToggleSider">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
            </slot>
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
        :class="scrollMode === 'wrapper' ? 'scroll-wrapper' : ''"
        @scroll="scrollMode === 'wrapper' ? handleScroll($event) : undefined"
      >
        <div class="content-inner">
          <slot />
        </div>
        
        <!-- 页脚 -->
        <LayoutFooter v-if="showFooter" :height="footerHeight" class="tablet-sidebar__footer">
          <slot name="footer" />
        </LayoutFooter>
      </LayoutContent>
    </main>
  </div>
</template>

<style scoped>
/* ========== CSS Variables Mapping ========== */
.tablet-sidebar {
  /* Colors */
  --color-bg-layout: #f5f7fa;
  --color-bg-container: #ffffff;
  --color-bg-elevated: #ffffff;
  --color-border: rgba(226, 232, 240, 0.8);
  --color-border-secondary: #eef0f3;
  --color-text-primary: #0f172a;
  --color-text-secondary: #595959;
  --color-text-tertiary: #8c8c8c;
  --color-primary-500: #3b82f6;
  --color-fill-secondary: #f0f0f0;
  --color-fill-tertiary: #e8e8e8;
  --color-fill-quaternary: #f5f5f5;

  display: grid;
  width: 100%;
  background: var(--color-bg-layout);
  transition: all 0.3s ease;
}

/* Grid Definitions */
.tablet-sidebar.mode-wrapper {
  height: 100vh;
  grid-template-columns: auto 1fr;
  grid-template-rows: 100%;
  overflow: hidden;
}

.tablet-sidebar.mode-body {
  min-height: 100vh;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
}

/* ========== Sider Area ========== */
.layout-area-sider {
  grid-column: 1;
  grid-row: 1 / -1;
  width: var(--sider-width);
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%; /* Force full height */
  background: linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-container) 100%); /* Apply background here */
  border-right: 1px solid var(--color-border-secondary);
}

.tablet-sidebar.is-collapsed .layout-area-sider {
  width: var(--sider-collapsed-width);
}

/* Sider Component */
.tablet-sidebar__sider {
  height: 100%;
  background: transparent !important; /* Remove background from inner component */
  box-shadow: none; /* Move shadow to container if needed, or keep here but background is transparent */
  border-right: none;
}

/* Sticky Sider in Body Mode */
.tablet-sidebar.mode-body .layout-area-sider.fixed-sider {
  position: sticky;
  top: 0;
  height: 100vh;
}

/* ========== Main Area ========== */
.layout-area-main {
  grid-column: 2;
  grid-row: 1 / -1;
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

.tablet-sidebar__header {
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
  animation: contentFadeIn 0.5s ease;
}

@keyframes contentFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== Footer ========== */
.tablet-sidebar__footer {
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border-secondary);
}

/* ========== Internal Components ========== */
.sider-logo { height: 56px; display: flex; align-items: center; justify-content: flex-start; padding: 0 20px; border-bottom: 1px solid var(--color-border-secondary); transition: all 0.3s ease; }
.sider-logo.is-collapsed { justify-content: center; padding: 0; }
.sider-menu { flex: 1; padding: 12px 8px; overflow-y: auto; -webkit-overflow-scrolling: touch; }
.sider-footer { display: flex; justify-content: center; padding: 12px; border-top: 1px solid var(--color-border-secondary); }
.collapse-toggle { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: var(--color-fill-quaternary); border: none; border-radius: 12px; color: var(--color-text-tertiary); cursor: pointer; transition: all 0.2s ease; -webkit-tap-highlight-color: transparent; }
.collapse-toggle:active { transform: scale(0.9); background: var(--color-fill-tertiary); }
.collapse-toggle svg { transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.collapse-toggle svg.is-collapsed { transform: rotate(180deg); }
.menu-btn { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: transparent; border: none; border-radius: 12px; color: var(--color-text-secondary); cursor: pointer; -webkit-tap-highlight-color: transparent; transition: all 0.2s ease; }
.menu-btn:active { background: var(--color-fill-secondary); transform: scale(0.9); }

/* Dark Mode */
:root[data-theme-mode="dark"] .tablet-sidebar,
.dark .tablet-sidebar {
  --color-bg-layout: #000000;
  --color-bg-container: #141414;
  --color-bg-elevated: #1f1f1f;
  --color-border-secondary: #303030;
}

:root[data-theme-mode="dark"] .tablet-sidebar__sider {
  background: linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-container) 100%);
}

/* ========== 高级动画优化 ========== */
.tablet-sidebar__sider::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, transparent 50%, rgba(59, 130, 246, 0.02) 100%); pointer-events: none; opacity: 0; transition: opacity 0.4s ease; }
.tablet-sidebar__sider:hover::before { opacity: 1; }
.sider-logo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent); transform: translateX(-100%); transition: transform 0.5s ease; }
.sider-logo { position: relative; overflow: hidden; }
.sider-logo:hover::after { transform: translateX(100%); }
.collapse-toggle::before { content: ''; position: absolute; inset: -3px; border-radius: 15px; background: linear-gradient(135deg, var(--color-primary-500), transparent); opacity: 0; z-index: -1; transition: opacity 0.3s, transform 0.3s; }
.collapse-toggle { position: relative; }
.collapse-toggle:hover::before { opacity: 0.2; animation: toggleGlow 1.5s ease-in-out infinite; }
@keyframes toggleGlow { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.05); opacity: 0.25; } }
.menu-btn svg { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.menu-btn:active svg { transform: rotate(90deg); }
.menu-btn::after { content: ''; position: absolute; inset: 0; border-radius: 12px; background: radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%); opacity: 0; transform: scale(0); transition: all 0.4s ease; }
.menu-btn { position: relative; overflow: hidden; }
.menu-btn:active::after { opacity: 0.15; transform: scale(2); }
.tablet-sidebar__header::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--color-primary-500), transparent); opacity: 0; transition: opacity 0.3s; }
.tablet-sidebar__header { position: relative; }
.tablet-sidebar__header:hover::after { opacity: 0.3; }
.tablet-sidebar__sider::after { content: ''; position: absolute; top: 0; right: 0; bottom: 0; width: 1px; background: linear-gradient(180deg, transparent, var(--color-primary-500), transparent); opacity: 0; transition: opacity 0.3s; }
.tablet-sidebar__sider:hover::after { opacity: 0.2; }
/* 滚动条美化 */
.sider-menu::-webkit-scrollbar { width: 4px; }
.sider-menu::-webkit-scrollbar-track { background: transparent; }
.sider-menu::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 2px; transition: background 0.3s; }
.sider-menu:hover::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.2); }
:root[data-theme-mode="dark"] .sider-menu::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
:root[data-theme-mode="dark"] .sider-menu:hover::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); }
/* Logo 文字渐隐动画 */
.sider-logo :deep(.logo-text) { transition: opacity 0.2s ease, width 0.25s ease; white-space: nowrap; overflow: hidden; }
.sider-logo.is-collapsed :deep(.logo-text) { opacity: 0; width: 0; }
</style>
