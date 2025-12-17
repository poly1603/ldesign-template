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
  headerHeight: 64,
  tabsHeight: 40,
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
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
              <span class="collapse-text" :class="{ 'is-hidden': siderCollapsed }">收起菜单</span>
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
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
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
          <slot name="header-right" />
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
            <span> 2024 LDesign. All rights reserved.</span>
          </div>
        </slot>
      </LayoutFooter>
    </div>
  </div>
</template>

<style scoped>
/* ========== CSS Variables Mapping ========== */
.layout-sidebar {
  /* Semantic Colors Mapping to @ldesign/color tokens */
  --color-bg-layout: var(--color-gray-50, #f8fafc);
  --color-bg-container: var(--color-gray-0, #ffffff);
  --color-bg-elevated: var(--color-gray-0, #ffffff);
  --color-border-secondary: var(--color-gray-100, #e2e8f0);
  --color-border-default: var(--color-gray-200, #cbd5e1);
  --color-text-primary: var(--color-gray-900, #0f172a);
  --color-text-secondary: var(--color-gray-600, #475569);
  --color-text-tertiary: var(--color-gray-400, #94a3b8);
  --color-text-quaternary: var(--color-gray-300, #cbd5e1);
  --color-fill-secondary: var(--color-gray-100, #f1f5f9);
  --color-fill-tertiary: var(--color-gray-200, #e2e8f0);
  --color-fill-quaternary: var(--color-gray-50, #f8fafc);

  /* Shadow */
  --shadow-sider: 2px 0 8px rgba(0, 0, 0, 0.02);
  --shadow-sider-hover: 4px 0 16px rgba(0, 0, 0, 0.04);
  --shadow-header: 0 1px 4px rgba(0, 0, 0, 0.02);
  --shadow-tabs: 0 2px 8px rgba(0, 0, 0, 0.02);
}

/* Dark Mode Overrides */
:root[data-theme-mode="dark"] .layout-sidebar,
.dark .layout-sidebar {
  --color-bg-layout: var(--color-gray-950, #020617);
  --color-bg-container: var(--color-gray-900, #0f172a);
  --color-bg-elevated: var(--color-gray-800, #1e293b);
  --color-border-secondary: var(--color-gray-800, #1e293b);
  --color-border-default: var(--color-gray-700, #334155);
  --color-text-primary: var(--color-gray-50, #f8fafc);
  --color-text-secondary: var(--color-gray-300, #cbd5e1);
  --color-text-tertiary: var(--color-gray-500, #64748b);
  --color-text-quaternary: var(--color-gray-600, #475569);
  --color-fill-secondary: var(--color-gray-800, #1e293b);
  --color-fill-tertiary: var(--color-gray-700, #334155);
  --color-fill-quaternary: var(--color-gray-900, #0f172a);

  --shadow-sider: 2px 0 8px rgba(0, 0, 0, 0.2);
  --shadow-sider-hover: 4px 0 16px rgba(0, 0, 0, 0.4);
}

/* ========== Main Layout Container ========== */
.layout-sidebar {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-layout);
  color: var(--color-text-primary);
  font-family: var(--size-font-family);
  line-height: var(--size-line-normal);
}

/* ========== Sider ========== */
.layout-sidebar__sider {
  background: linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-container) 100%);
  border-right: 1px solid var(--color-border-secondary);
  box-shadow: var(--shadow-sider);
  transition: all var(--size-duration-normal) var(--size-ease-in-out);
  z-index: var(--size-z-fixed, 1030);
  will-change: width, transform;
}

.layout-sidebar__sider:hover {
  box-shadow: var(--shadow-sider-hover);
}

/* Logo Area */
.layout-sidebar__logo {
  height: v-bind('props.headerHeight + "px"');
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 var(--size-spacing-xl);
  border-bottom: 1px solid var(--color-border-secondary);
  background: var(--color-bg-container);
  transition: all var(--size-duration-normal) var(--size-ease-in-out);
  overflow: hidden;
  white-space: nowrap;
}

.layout-sidebar__logo.is-collapsed {
  justify-content: center;
  padding: 0;
}

/* Menu Area */
.layout-sidebar__menu {
  flex: 1;
  padding: var(--size-spacing-md) var(--size-spacing-xs);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-secondary) transparent;
}

.layout-sidebar__menu::-webkit-scrollbar {
  width: 4px;
}

.layout-sidebar__menu::-webkit-scrollbar-thumb {
  background: var(--color-border-secondary);
  border-radius: var(--size-radius-full);
}

.layout-sidebar__menu::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-default);
}

/* Sider Footer */
.layout-sidebar__sider-footer {
  padding: var(--size-spacing-md);
  border-top: 1px solid var(--color-border-secondary);
  background: var(--color-bg-container);
}

/* Collapse Button */
.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-spacing-sm);
  width: 100%;
  height: var(--size-comp-size-m);
  padding: 0 var(--size-spacing-sm);
  background: var(--color-fill-quaternary);
  border: 1px solid transparent;
  border-radius: var(--size-radius-lg);
  color: var(--color-text-tertiary);
  font-size: var(--size-font-sm);
  cursor: pointer;
  transition: all var(--size-duration-fast) var(--size-ease-in-out);
  overflow: hidden;
}

.collapse-btn:hover {
  background: var(--color-fill-tertiary);
  color: var(--color-text-secondary);
}

.collapse-btn:focus-visible {
  outline: 2px solid var(--color-primary-default);
  outline-offset: 2px;
}

.collapse-btn svg {
  flex-shrink: 0;
  transition: transform var(--size-duration-normal) var(--size-ease-in-out);
}

.collapse-btn svg.is-collapsed {
  transform: rotate(180deg);
}

.collapse-text {
  white-space: nowrap;
  opacity: 1;
  transition: opacity var(--size-duration-normal), width var(--size-duration-normal);
}

.collapse-text.is-hidden {
  opacity: 0;
  width: 0;
  display: none;
}

/* ========== Main Content Area ========== */
.layout-sidebar__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left var(--size-duration-normal) var(--size-ease-in-out);
  will-change: margin-left;
}

/* ========== Header ========== */
.layout-sidebar__header {
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border-secondary);
  box-shadow: var(--shadow-header);
  padding: 0 var(--size-spacing-lg);
  z-index: var(--size-z-sticky, 1020);
}

.menu-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size-comp-size-m);
  height: var(--size-comp-size-m);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--size-radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--size-duration-fast);
}

.menu-toggle-btn:hover {
  background: var(--color-fill-secondary);
  color: var(--color-text-primary);
}

.menu-toggle-btn:active {
  transform: scale(0.95);
}

/* ========== Tabs ========== */
.layout-sidebar__tabs {
  position: fixed;
  right: 0;
  z-index: var(--size-z-sticky, 1020);
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border-secondary);
  box-shadow: var(--shadow-tabs);
  transition: left var(--size-duration-normal) var(--size-ease-in-out), top var(--size-duration-normal) var(--size-ease-in-out);
}

/* ========== Content ========== */
.layout-sidebar__content {
  flex: 1;
  background: var(--color-bg-layout);
  transition: padding-top var(--size-duration-normal) var(--size-ease-in-out);
}

.content-wrapper {
  padding: var(--size-spacing-lg);
  min-height: calc(100vh - 200px);
  animation: fadeIn var(--size-duration-normal) var(--size-ease-out);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(var(--size-spacing-sm));
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== Footer ========== */
.layout-sidebar__footer {
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border-secondary);
  padding: 0 var(--size-spacing-lg);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: var(--size-font-sm);
  color: var(--color-text-quaternary);
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
  .content-wrapper {
    padding: var(--size-spacing-md);
  }
}
</style>
