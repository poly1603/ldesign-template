<script setup lang="ts">
/**
 * TopMenu 顶部菜单布局模板
 * 现代化宽屏布局，顶部水平导航
 */
import { computed } from 'vue'
import { LayoutHeader, LayoutContent, LayoutFooter } from '../../../../components/layout'
import { ChromeTabs } from '@ldesign/bookmark-vue'

interface Props {
  headerHeight?: number
  tabsHeight?: number
  showTabs?: boolean
  fixedHeader?: boolean
  showFooter?: boolean
  footerHeight?: number
  maxContentWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 60,
  tabsHeight: 44,
  showTabs: true,
  fixedHeader: true,
  showFooter: true,
  footerHeight: 48,
  maxContentWidth: 0,
})

const contentTopOffset = computed(() => {
  let offset = props.fixedHeader ? props.headerHeight : 0
  if (props.showTabs) offset += props.tabsHeight
  return offset
})

const contentStyle = computed(() => ({
  paddingTop: `${contentTopOffset.value}px`,
  maxWidth: props.maxContentWidth > 0 ? `${props.maxContentWidth}px` : undefined,
  margin: props.maxContentWidth > 0 ? '0 auto' : undefined,
}))
</script>

<template>
  <div class="layout-top-menu">
    <!-- 顶栏 -->
    <LayoutHeader :height="headerHeight" :fixed="fixedHeader" class="layout-top-menu__header">
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
    <div v-if="showTabs" class="layout-top-menu__tabs" :style="{ top: fixedHeader ? `${headerHeight}px` : undefined }">
      <slot name="tabs">
        <ChromeTabs :height="tabsHeight" />
      </slot>
    </div>

    <!-- 内容区 -->
    <LayoutContent class="layout-top-menu__content" :style="contentStyle">
      <div class="content-wrapper">
        <slot />
      </div>
    </LayoutContent>

    <!-- 页脚 -->
    <LayoutFooter v-if="showFooter" :height="footerHeight" class="layout-top-menu__footer">
      <slot name="footer">
        <div class="footer-content">
          <span>© 2024 LDesign. All rights reserved.</span>
        </div>
      </slot>
    </LayoutFooter>
  </div>
</template>

<style scoped>
/* ========== CSS Variables Mapping ========== */
.layout-top-menu {
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

  /* Header Specific (Primary Color) */
  --header-bg: var(--color-primary);
  --header-text: #ffffff;
  --header-text-secondary: rgba(255, 255, 255, 0.8);
  --header-border: rgba(255, 255, 255, 0.1);
  --header-hover: rgba(255, 255, 255, 0.1);

  /* Shadows */
  --shadow-header: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-tabs: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  /* Sizes */
  --header-height: v-bind('props.headerHeight + "px"');
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark Mode Overrides */
:root[data-theme-mode="dark"] .layout-top-menu,
.dark .layout-top-menu {
  --color-bg-layout: #020617;
  /* Slate-950 */
  --color-bg-container: #0f172a;
  /* Slate-900 */

  --color-border: #1e293b;
  /* Slate-800 */

  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #64748b;

  /* Dark Header */
  --header-bg: #0f172a;
  --header-text: #f8fafc;
  --header-border: #1e293b;
  --header-hover: #1e293b;

  --shadow-header: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-tabs: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

/* ========== Main Layout Container ========== */
.layout-top-menu {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg-layout);
  color: var(--color-text-primary);
  font-family: var(--size-font-family, system-ui, -apple-system, sans-serif);
}

/* ========== Header ========== */
.layout-top-menu__header {
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  box-shadow: var(--shadow-header);
  color: var(--header-text);
  z-index: 1020;
  /* Override menu colors for primary header */
  --color-text-primary: var(--header-text);
  --color-text-secondary: var(--header-text-secondary);
  --color-fill-hover: var(--header-hover);
  /* 为统一的头部变量赋值，便于全局样式自适配 */
  --layout-header-bg: var(--header-bg);
  --layout-header-color: var(--header-text);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 100%;
  padding-left: 24px;
}

.header-logo {
  display: flex;
  align-items: center;
  height: 100%;
  color: var(--header-text);
}

.header-menu {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: 16px;
}

.header-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-right: 24px;
}

/* ========== Tabs ========== */
.layout-top-menu__tabs {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1010;
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-tabs);
  transition: top var(--transition-normal);
}

/* ========== Content ========== */
.layout-top-menu__content {
  flex: 1;
  background: var(--color-bg-layout);
  transition: padding-top var(--transition-normal);
}

.content-wrapper {
  padding: 24px;
  min-height: calc(100vh - 200px);
  animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
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
.layout-top-menu__footer {
  background: var(--color-bg-container);
  border-top: 1px solid var(--color-border);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
  .header-left {
    gap: 16px;
    padding-left: 16px;
  }

  .header-right {
    padding-right: 16px;
  }

  .content-wrapper {
    padding: 16px;
  }
}
</style>
