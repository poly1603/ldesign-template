<script setup lang="ts">
/**
 * Mix 混合布局模板
 * 顶部一级导航 + 左侧二级导航 + 内容区
 * 现代化设计，适用于大型后台系统
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
  fixedHeader?: boolean
  fixedSider?: boolean
  defaultCollapsed?: boolean
  showFooter?: boolean
  footerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  siderWidth: 220,
  siderCollapsedWidth: 56,
  headerHeight: 56,
  tabsHeight: 44,
  showTabs: true,
  fixedHeader: true,
  fixedSider: true,
  defaultCollapsed: false,
  showFooter: true,
  footerHeight: 48,
})

const emit = defineEmits<{
  siderCollapse: [collapsed: boolean]
}>()

const { isMobile } = useAutoDevice()
const siderCollapsed = ref(props.defaultCollapsed)
const siderVisible = ref(false)

const actualSiderWidth = computed(() =>
  siderCollapsed.value ? props.siderCollapsedWidth : props.siderWidth,
)

const contentOffset = computed(() => {
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
  <div class="layout-mix" :class="{ 'is-collapsed': siderCollapsed }">
    <!-- 顶栏（包含一级导航） -->
    <LayoutHeader :height="headerHeight" :fixed="fixedHeader" class="layout-mix__header">
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
          <slot name="header-right" />
        </div>
      </template>
    </LayoutHeader>

    <!-- 侧边栏（二级导航） -->
    <LayoutSider v-model:collapsed="siderCollapsed" v-model:visible="siderVisible" :width="siderWidth"
      :collapsed-width="siderCollapsedWidth" :fixed="fixedSider" :drawer="isMobile" :top-offset="headerHeight"
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

    <!-- 主区域 -->
    <div class="layout-mix__main" :style="{ marginLeft: `${contentOffset}px`, paddingTop: `${contentTopOffset}px` }">
      <!-- 标签栏 -->
      <div v-if="showTabs" class="layout-mix__tabs"
        :style="{ top: fixedHeader ? `${headerHeight}px` : undefined, left: `${contentOffset}px` }">
        <slot name="tabs">
          <ChromeTabs :height="tabsHeight" />
        </slot>
      </div>

      <!-- 内容区 -->
      <LayoutContent class="layout-mix__content">
        <div class="content-inner">
          <slot />
        </div>
      </LayoutContent>

      <!-- 页脚 -->
      <LayoutFooter v-if="showFooter" :height="footerHeight" class="layout-mix__footer">
        <slot name="footer">
          <div class="footer-inner">© 2024 LDesign. All rights reserved.</div>
        </slot>
      </LayoutFooter>
    </div>
  </div>
</template>

<style scoped>
/* ========== CSS Variables Mapping ========== */
.layout-mix {
  /* Colors - Modern Theme */
  --color-bg-layout: #f8fafc; /* Slate-50 */
  --color-bg-container: #ffffff;
  
  --color-border: rgba(226, 232, 240, 0.8); /* Slate-200 */
  
  --color-text-primary: #0f172a; /* Slate-900 */
  --color-text-secondary: #475569; /* Slate-600 */
  --color-text-tertiary: #94a3b8; /* Slate-400 */
  --color-text-quaternary: #cbd5e1; /* Slate-300 */
  
  /* Use System Primary Color */
  --color-primary: var(--color-primary-500, #3b82f6);
  --color-primary-active: #2563eb;
  
  --color-fill-hover: #f1f5f9; /* Slate-100 */
  
  /* Header Specific (Primary Color) */
  --header-bg: var(--color-primary);
  --header-text: #ffffff;
  --header-text-secondary: rgba(255, 255, 255, 0.8);
  --header-border: rgba(255, 255, 255, 0.1);
  --header-hover: rgba(255, 255, 255, 0.1);
  
  /* Shadows */
  --shadow-header: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-sider: 4px 0 24px 0 rgba(0, 0, 0, 0.05);
  --shadow-tabs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* Sizes */
  --header-height: v-bind('props.headerHeight + "px"');
  --sider-width: v-bind('props.siderWidth + "px"');
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark Mode Overrides */
:root[data-theme-mode="dark"] .layout-mix,
.dark .layout-mix {
  --color-bg-layout: #020617; /* Slate-950 */
  --color-bg-container: #0f172a; /* Slate-900 */
  
  --color-border: #1e293b; /* Slate-800 */
  
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #64748b;
  --color-text-quaternary: #475569;
  
  --color-fill-hover: #1e293b;
  
  /* Dark Header */
  --header-bg: #0f172a;
  --header-text: #f8fafc;
  --header-border: #1e293b;
  --header-hover: #1e293b;
  
  --shadow-header: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-sider: 4px 0 24px 0 rgba(0, 0, 0, 0.3);
}

/* ========== Main Layout Container ========== */
.layout-mix {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg-layout);
  color: var(--color-text-primary);
  font-family: var(--size-font-family, system-ui, -apple-system, sans-serif);
}

/* ========== Header ========== */
.layout-mix__header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1020;
  background: var(--header-bg);
  color: var(--header-text);
  border-bottom: 1px solid var(--header-border);
  box-shadow: var(--shadow-header);
  /* Override menu colors for primary header */
  --color-text-primary: var(--header-text);
  --color-text-secondary: var(--header-text-secondary);
  --color-fill-hover: var(--header-hover);
}

.layout-mix__brand {
  display: flex;
  align-items: center;
  gap: 48px;
  height: 100%;
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
}

.layout-mix__header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-right: 24px;
}

/* ========== Sider ========== */
.layout-mix__sider {
  background: var(--color-bg-container) !important;
  border-right: 1px solid var(--color-border);
  box-shadow: var(--shadow-sider);
  z-index: 1010;
  /* Reset text colors for white background sidebar */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-fill-hover: #f1f5f9;
}

:root[data-theme-mode="dark"] .layout-mix__sider,
.dark .layout-mix__sider {
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-fill-hover: #1e293b;
}

.layout-mix__sider-title {
  padding: 24px 20px 12px;
  /* border-bottom: 1px solid var(--color-border); */
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

.layout-mix__sider-menu::-webkit-scrollbar {
  width: 4px;
}

.layout-mix__sider-menu::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
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
}

.sider-collapse-btn svg {
  transition: transform 0.3s ease;
}

.sider-collapse-btn svg.is-collapsed {
  transform: rotate(180deg);
}

/* ========== Main Content Area ========== */
.layout-mix__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: all var(--transition-normal);
}

/* ========== Tabs ========== */
.layout-mix__tabs {
  position: fixed;
  right: 0;
  z-index: 1005;
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-tabs);
  transition: left var(--transition-normal);
}

/* ========== Content ========== */
.layout-mix__content {
  flex: 1;
  background: var(--color-bg-layout);
}

.content-inner {
  padding: 24px;
  min-height: calc(100vh - 200px);
  animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== Footer ========== */
.layout-mix__footer {
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

/* ========== Responsive ========== */
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
</style>
