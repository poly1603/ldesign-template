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
  tabsHeight: 40,
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
          <slot name="header-right" />
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
          <span>© 2024 LDesign. Powered by Vue3 + TypeScript</span>
        </div>
      </slot>
    </LayoutFooter>
  </div>
</template>

<style scoped>
/* ========== 主容器 ========== */
.layout-top-menu {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg-layout, #f5f7fa);
}

/* ========== 顶栏 ========== */
.layout-top-menu__header {
  background: linear-gradient(135deg, var(--color-primary-800, #1e3a5f) 0%, var(--color-primary-950, #0a1628) 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
  height: 100%;
  padding-left: 24px;
}

.header-logo {
  display: flex;
  align-items: center;
  height: 100%;
}

.header-menu {
  display: flex;
  align-items: center;
  height: 100%;
}

.header-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 24px;
}

/* ========== 标签栏 ========== */
.layout-top-menu__tabs {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  background: var(--color-bg-container, #fff);
  border-bottom: 1px solid var(--color-border-secondary, #eef0f3);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

/* ========== 内容区 ========== */
.layout-top-menu__content {
  flex: 1;
  background: var(--color-bg-layout, #f5f7fa);
}

.content-wrapper {
  padding: 24px;
  min-height: calc(100vh - 200px);
  animation: fadeSlideUp 0.4s ease;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 页脚 ========== */
.layout-top-menu__footer {
  background: var(--color-bg-container, #fff);
  border-top: 1px solid var(--color-border-secondary, #eef0f3);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
  color: var(--color-text-quaternary, #bfbfbf);
}

/* ========== 深色模式 ========== */
:root[data-theme-mode="dark"] .layout-top-menu__header,
.dark .layout-top-menu__header {
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
}

:root[data-theme-mode="dark"] .layout-top-menu__tabs,
.dark .layout-top-menu__tabs {
  background: var(--color-bg-container, #1f1f1f);
  border-bottom-color: var(--color-border-secondary, #303030);
}

:root[data-theme-mode="dark"] .layout-top-menu__content,
.dark .layout-top-menu__content {
  background: var(--color-bg-layout, #0a0a0f);
}

:root[data-theme-mode="dark"] .layout-top-menu__footer,
.dark .layout-top-menu__footer {
  background: var(--color-bg-container, #1f1f1f);
  border-top-color: var(--color-border-secondary, #303030);
}
</style>
