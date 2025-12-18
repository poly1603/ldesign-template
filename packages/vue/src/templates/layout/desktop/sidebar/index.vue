<script setup lang="ts">
/**
 * Sidebar 经典侧边栏布局模板
 * 现代化设计，支持平滑动画和深色模式
 */
import { computed, ref, watch } from 'vue'
import { LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from '../../../../components/layout'
import { ChromeTabs } from '@ldesign/bookmark-vue'
import { useAutoDevice } from '../../../../composables/useAutoDevice'

interface Props {
  siderWidth?: number
  siderCollapsedWidth?: number
  headerHeight?: number
  tabsHeight?: number
  showTabs?: boolean
  showFooter?: boolean
  footerHeight?: number
  defaultCollapsed?: boolean
  fixedHeader?: boolean
  fixedSider?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  siderWidth: 240,
  siderCollapsedWidth: 64,
  headerHeight: 60,
  tabsHeight: 44,
  showTabs: true,
  showFooter: true,
  footerHeight: 48,
  defaultCollapsed: false,
  fixedHeader: true,
  fixedSider: true,
})

const emit = defineEmits<{
  siderCollapse: [collapsed: boolean]
}>()

const { isMobile } = useAutoDevice()
const siderCollapsed = ref(props.defaultCollapsed)
const siderVisible = ref(false)
const isHovering = ref(false)

const actualSiderWidth = computed(() =>
  siderCollapsed.value ? props.siderCollapsedWidth : props.siderWidth,
)

const contentOffset = computed(() => {
  if (isMobile.value) return 0
  return props.fixedSider ? actualSiderWidth.value : 0
})

const headerOffset = computed(() => {
  if (isMobile.value) return 0
  return props.fixedSider ? actualSiderWidth.value : 0
})

const contentTopOffset = computed(() => {
  let offset = props.fixedHeader ? props.headerHeight : 0
  if (props.showTabs) offset += props.tabsHeight
  return offset
})

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
</script>

<template>
  <div class="layout-sidebar" :class="{ 'is-collapsed': siderCollapsed, 'is-mobile': isMobile }">
    <!-- 侧边栏 -->
    <LayoutSider v-model:collapsed="siderCollapsed" v-model:visible="siderVisible" :width="siderWidth"
      :collapsed-width="siderCollapsedWidth" :fixed="fixedSider" :drawer="isMobile" :top-offset="0"
      class="layout-sidebar__sider" @mask-click="handleCloseSider" @mouseenter="isHovering = true"
      @mouseleave="isHovering = false">
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
            <!-- 折叠按钮 -->
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

    <!-- 主区域 -->
    <div class="layout-sidebar__main" :style="{ marginLeft: `${contentOffset}px` }">
      <!-- 顶栏 -->
      <LayoutHeader :height="headerHeight" :fixed="fixedHeader" :left-offset="headerOffset"
        class="layout-sidebar__header" @toggle-sider="handleToggleSider">
        <template #menuButton>
          <slot name="menu-button">
            <button class="menu-toggle-btn" @click="handleToggleSider">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </slot>
        </template>
        <template #left>
          <slot name="header-left" />
        </template>
        <template #center>
          <slot name="header-center" />
        </template>
        <template #right>
          <slot name="header-right" :variant="'light'" />
        </template>
      </LayoutHeader>

      <!-- 标签栏 -->
      <div v-if="showTabs" class="layout-sidebar__tabs"
        :style="{ top: fixedHeader ? `${headerHeight}px` : undefined, left: `${headerOffset}px` }">
        <slot name="tabs">
          <ChromeTabs :height="tabsHeight" />
        </slot>
      </div>

      <!-- 内容区 -->
      <LayoutContent class="layout-sidebar__content" :style="{ paddingTop: `${contentTopOffset}px` }">
        <div class="content-wrapper">
          <slot />
        </div>
      </LayoutContent>

      <!-- 页脚 -->
      <LayoutFooter v-if="showFooter" :height="footerHeight" class="layout-sidebar__footer">
        <slot name="footer">
          <div class="footer-content">
            <span>© 2024 LDesign. All rights reserved.</span>
          </div>
        </slot>
      </LayoutFooter>
    </div>
  </div>
</template>

<style scoped>
/* ========== CSS Variables Mapping ========== */
.layout-sidebar {
  /* Colors - Modern Theme with Primary Sider */
  --color-bg-layout: #f8fafc;
  /* Slate-50 */
  --color-bg-container: #ffffff;

  --color-border: rgba(226, 232, 240, 0.8);
  /* Slate-200 */

  --color-text-primary: #0f172a;
  /* Slate-900 */
  --color-text-secondary: #475569;
  /* Slate-600 */
  --color-text-tertiary: #94a3b8;
  /* Slate-400 */

  /* Use System Primary Color */
  --color-primary: var(--color-primary-500, #3b82f6);

  /* Sider Specific */
  --sider-bg: var(--color-primary);
  --sider-text: #ffffff;
  --sider-text-secondary: rgba(255, 255, 255, 0.85);
  /* Increased opacity for better readability */
  --sider-border: rgba(255, 255, 255, 0.08);
  /* Very subtle or none */
  --sider-hover: rgba(255, 255, 255, 0.15);
  --sider-active: rgba(255, 255, 255, 0.25);

  --color-fill-hover: #f1f5f9;
  /* Slate-100 */

  /* Shadows */
  --shadow-header: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sider: 4px 0 24px 0 rgba(0, 0, 0, 0.1);
  --shadow-tabs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* Sizes */
  --header-height: v-bind('props.headerHeight + "px"');
  --sider-width: v-bind('props.siderWidth + "px"');
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --glass-blur: 12px;
}

/* Dark Mode Overrides */
:root[data-theme-mode="dark"] .layout-sidebar,
.dark .layout-sidebar {
  --color-bg-layout: #020617;
  --color-bg-container: #0f172a;

  --color-border: #1e293b;

  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #64748b;

  --color-fill-hover: #1e293b;

  /* In dark mode, sidebar can still be primary or switch to dark primary */
  --sider-bg: var(--color-primary-950, #172554);
  --sider-text: #f8fafc;
  --sider-text-secondary: #94a3b8;

  --shadow-header: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
}

/* ========== Main Layout Container ========== */
.layout-sidebar {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-layout);
  color: var(--color-text-primary);
  font-family: var(--size-font-family, system-ui, -apple-system, sans-serif);
}

/* ========== Sider ========== */
.layout-sidebar__sider {
  background: var(--sider-bg) !important;
  color: var(--sider-text);
  border-right: none;
  box-shadow: var(--shadow-sider);
  transition: all var(--transition-normal);
  z-index: var(--size-z-fixed, 1030);
}

/* Logo Area */
.layout-sidebar__logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: transparent;
  color: var(--sider-text);
  overflow: hidden;
  /* Removed border for seamless look */
  border-bottom: none;
}

.layout-sidebar__logo.is-collapsed {
  justify-content: center;
  padding: 0;
}

/* Menu Area */
.layout-sidebar__menu {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  /* Override menu text colors for dark background */
  --color-text-primary: var(--sider-text);
  --color-text-secondary: var(--sider-text-secondary);
  --color-fill-hover: transparent;
  /* 侧栏菜单不使用块状背景 */
  --color-primary-active: currentColor;
  --color-fill-active: transparent;
  /* LDesign Menu 变量覆盖，去除背景色 */
  --l-menu-bg-color: transparent;
  --l-menu-hover-bg-color: transparent;
  --l-menu-active-bg-color: transparent;
  --l-menu-selected-bg-color: transparent;
  --l-menu-text-color: var(--sider-text);
  --l-menu-hover-text-color: var(--sider-text);
  --l-menu-selected-text-color: var(--sider-text);
  --l-menu-selected-indicator-color: rgba(255, 255, 255, 0.95);
}

.layout-sidebar__menu::-webkit-scrollbar {
  width: 4px;
}

.layout-sidebar__menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

/* Sider Footer */
.layout-sidebar__sider-footer {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Removed border for seamless look */
  border-top: none;
  background: transparent;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--sider-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: var(--sider-hover);
  color: var(--sider-text);
}

.collapse-btn svg {
  transition: transform 0.3s ease;
}

.collapse-btn svg.is-collapsed {
  transform: rotate(180deg);
}

/* ========== Main Content Area ========== */
.layout-sidebar__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left var(--transition-normal);
}

/* ========== Header ========== */
.layout-sidebar__header {
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-header);
  padding: 0 20px;
  z-index: var(--size-z-sticky, 1020);
}

.menu-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.menu-toggle-btn:hover {
  background: var(--color-fill-hover);
  color: var(--color-text-primary);
}

/* ========== Tabs ========== */
.layout-sidebar__tabs {
  position: fixed;
  right: 0;
  z-index: 1010;
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-tabs);
  transition: left var(--transition-normal), top var(--transition-normal);
}

/* ========== Content ========== */
.layout-sidebar__content {
  flex: 1;
  background: var(--color-bg-layout);
  transition: padding-top var(--transition-normal);
}

.content-wrapper {
  padding: 24px;
  min-height: calc(100vh - 200px);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== Footer ========== */
.layout-sidebar__footer {
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border);
  padding: 0 24px;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

/* ========== Mobile Response ========== */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }
}
</style>
