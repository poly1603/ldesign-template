<script setup lang="ts">
/**
 * DualColumn 双栏布局模板
 * VS Code 风格升级版：侧边图标栏 + 资源侧边栏 + 内容区
 */
import { computed, ref, watch } from 'vue'
import { LayoutHeader, LayoutContent, LayoutFooter } from '../../../../components/layout'
import { ChromeTabs } from '@ldesign/bookmark-vue'
import { useAutoDevice } from '../../../../composables/useAutoDevice'

interface Props {
  iconBarWidth?: number
  siderWidth?: number
  siderCollapsedWidth?: number
  headerHeight?: number
  tabsHeight?: number
  showTabs?: boolean
  fixedHeader?: boolean
  defaultCollapsed?: boolean
  showFooter?: boolean
  footerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  iconBarWidth: 64,
  siderWidth: 240,
  siderCollapsedWidth: 0,
  headerHeight: 56,
  tabsHeight: 44,
  showTabs: true,
  fixedHeader: true,
  defaultCollapsed: false,
  showFooter: true,
  footerHeight: 28,
})

const { isMobile } = useAutoDevice()
const siderCollapsed = ref(props.defaultCollapsed)
const siderVisible = ref(false)

const actualSiderWidth = computed(() =>
  siderCollapsed.value ? props.siderCollapsedWidth : props.siderWidth,
)

const totalLeftWidth = computed(() => {
  if (isMobile.value) return 0
  return props.iconBarWidth + actualSiderWidth.value
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
  siderCollapsed.value = !siderCollapsed.value
}

function handleCloseSider() {
  siderVisible.value = false
}
</script>

<template>
  <div class="layout-dual" :class="{ 'is-collapsed': siderCollapsed }">
    <!-- 图标栏 -->
    <aside class="layout-dual__icon-bar" :style="{ width: iconBarWidth + 'px' }">
      <div class="icon-bar-logo">
        <slot name="logo" />
      </div>
      <nav class="icon-bar-nav">
        <slot name="icon-bar" />
      </nav>
      <div class="icon-bar-footer">
        <slot name="icon-bar-footer" />
      </div>
    </aside>

    <!-- 次级侧边栏 -->
    <aside v-show="!siderCollapsed" class="layout-dual__sider"
      :style="{ left: iconBarWidth + 'px', width: siderWidth + 'px' }">
      <div class="sider-header">
        <slot name="sider-header">
          <span class="sider-title">Explorer</span>
        </slot>
      </div>
      <nav class="sider-menu">
        <slot name="sider" :collapsed="siderCollapsed" />
      </nav>
    </aside>

    <!-- 遮罩层 -->
    <div v-if="isMobile && siderVisible" class="layout-dual__mask" @click="handleCloseSider" />

    <!-- 主区域 -->
    <div class="layout-dual__main" :style="{ marginLeft: totalLeftWidth + 'px' }">
      <!-- 顶栏 -->
      <LayoutHeader :height="headerHeight" :fixed="fixedHeader" :left-offset="totalLeftWidth"
        class="layout-dual__header" @toggle-sider="handleToggleSider">
        <template #left>
          <slot name="header-left" />
        </template>
        <template #right>
          <slot name="header-right" :variant="'light'" />
        </template>
      </LayoutHeader>

      <!-- 标签栏 -->
      <div v-if="showTabs" class="layout-dual__tabs"
        :style="{ top: fixedHeader ? `${headerHeight}px` : undefined, left: `${totalLeftWidth}px` }">
        <slot name="tabs">
          <ChromeTabs :height="tabsHeight" />
        </slot>
      </div>

      <!-- 内容区 -->
      <LayoutContent class="layout-dual__content" :style="{ paddingTop: contentTopOffset + 'px' }">
        <div class="content-inner">
          <slot />
        </div>
      </LayoutContent>

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
    </div>
  </div>
</template>

<style scoped>
/* ========== CSS Variables Mapping ========== */
.layout-dual {
  /* Colors - Modern Theme */
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
  --color-primary-active: #2563eb;

  --color-fill-hover: #f1f5f9;
  /* Slate-100 */

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

  /* Sizes */
  --header-height: v-bind('props.headerHeight + "px"');
  --icon-bar-width: v-bind('props.iconBarWidth + "px"');
  --sider-width: v-bind('props.siderWidth + "px"');
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --glass-blur: 12px;
}

/* Dark Mode Overrides */
:root[data-theme-mode="dark"] .layout-dual,
.dark .layout-dual {
  --color-bg-layout: #020617;
  /* Slate-950 */
  --color-bg-container: #0f172a;
  /* Slate-900 */

  --color-border: #1e293b;
  /* Slate-800 */

  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #64748b;

  --color-fill-hover: #1e293b;

  /* Dark Icon Bar */
  --icon-bar-bg: #0f172a;

  --shadow-header: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-sider: 4px 0 24px 0 rgba(0, 0, 0, 0.3);
}

/* ========== Main Layout Container ========== */
.layout-dual {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-layout);
  color: var(--color-text-primary);
  font-family: var(--size-font-family, system-ui, -apple-system, sans-serif);
}

/* ========== Icon Bar ========== */
.layout-dual__icon-bar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: var(--icon-bar-bg);
  color: var(--icon-bar-text);
  z-index: 1030;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
  /* Override menu colors for primary icon bar */
  --color-text-secondary: var(--icon-bar-text);
  --color-fill-hover: var(--icon-bar-hover);
  --color-primary: var(--icon-bar-text-active);
  --color-primary-active: var(--icon-bar-text-active);
}

.icon-bar-logo {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: var(--icon-bar-text-active);
}

.icon-bar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  overflow-y: auto;
}

.icon-bar-footer {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* ========== Secondary Sider ========== */
.layout-dual__sider {
  position: fixed;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-container);
  border-right: 1px solid var(--color-border);
  z-index: 1020;
  transition: transform var(--transition-normal);
  box-shadow: var(--shadow-sider);
}

.sider-header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border);
}

.sider-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.sider-menu {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px;
  /* 去除菜单背景色，仅保留文字/指示条 */
  --l-menu-bg-color: transparent;
  --l-menu-hover-bg-color: transparent;
  --l-menu-active-bg-color: transparent;
  --l-menu-selected-bg-color: transparent;
  --l-menu-text-color: var(--color-text-primary);
  --l-menu-hover-text-color: var(--color-text-primary);
  --l-menu-selected-text-color: var(--color-text-primary);
  --l-menu-selected-indicator-color: var(--color-primary);
}

.sider-menu::-webkit-scrollbar {
  width: 4px;
}

.sider-menu::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

/* ========== Mask ========== */
.layout-dual__mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1015;
  transition: opacity 0.3s;
}

/* ========== Main Area ========== */
.layout-dual__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left var(--transition-normal);
}

/* ========== Header ========== */
.layout-dual__header {
  background: var(--layout-header-bg, var(--color-bg-container));
  color: var(--layout-header-color, var(--color-text-primary));
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-header);
  z-index: 1010;
}

/* ========== Tabs ========== */
.layout-dual__tabs {
  position: fixed;
  right: 0;
  z-index: 1005;
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-tabs);
  transition: left var(--transition-normal);
}

/* ========== Content ========== */
.layout-dual__content {
  flex: 1;
  background: var(--color-bg-layout);
  padding: 0;
  transition: padding-top var(--transition-normal);
}

.content-inner {
  padding: 24px;
  min-height: calc(100vh - 200px);
  animation: fadeIn 0.4s ease-out;
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

/* ========== Footer Status Bar ========== */
.layout-dual__footer {
  background: var(--color-primary, #3b82f6);
  color: white;
  z-index: 1020;
}

.status-bar {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  font-size: 12px;
}

.status-item {
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.9;
  cursor: default;
  transition: opacity 0.2s;
}

.status-item:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  height: 100%;
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
  .content-inner {
    padding: 16px;
  }
}
</style>
