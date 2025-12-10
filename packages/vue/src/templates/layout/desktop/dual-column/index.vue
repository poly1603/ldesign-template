<script setup lang="ts">
/**
 * DualColumn 双栏布局模板
 * VS Code 风格：左侧图标栏 + 次级菜单栏 + 内容区
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
  iconBarWidth: 52,
  siderWidth: 240,
  siderCollapsedWidth: 0,
  headerHeight: 48,
  tabsHeight: 38,
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
          <span class="sider-title">资源管理器</span>
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
          <slot name="header-right" />
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
        <slot />
      </LayoutContent>

      <!-- 页脚状态栏 -->
      <LayoutFooter v-if="showFooter" :height="footerHeight" class="layout-dual__footer">
        <slot name="footer">
          <div class="status-bar">
            <span class="status-item">LDesign</span>
            <span class="status-item">UTF-8</span>
            <span class="status-item">Vue 3</span>
          </div>
        </slot>
      </LayoutFooter>
    </div>
  </div>
</template>

<style scoped>
.layout-dual {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-layout, #1e1e1e);
}

/* 图标栏 */
.layout-dual__icon-bar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-container-dark, #333333);
  z-index: 1002;
}

.icon-bar-logo {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.icon-bar-footer {
  padding: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 次级侧边栏 */
.layout-dual__sider {
  position: fixed;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-container, #252526);
  border-right: 1px solid var(--color-border-secondary, #3c3c3c);
  z-index: 1001;
  transition: transform 0.2s ease;
}

.sider-header {
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary, #cccccc);
}

.sider-title {
  opacity: 0.8;
}

.sider-menu {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.sider-menu::-webkit-scrollbar {
  width: 10px;
}

.sider-menu::-webkit-scrollbar-thumb {
  background: rgba(121, 121, 121, 0.4);
}

.sider-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 100, 100, 0.7);
}

/* 遮罩 */
.layout-dual__mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* 主区域 */
.layout-dual__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left 0.2s ease;
}

/* 顶栏 */
.layout-dual__header {
  background: var(--color-bg-container, #3c3c3c);
  border-bottom: 1px solid var(--color-border-secondary, #454545);
}

/* 标签栏 */
.layout-dual__tabs {
  position: fixed;
  right: 0;
  z-index: 999;
  background: var(--color-bg-container, #252526);
  border-bottom: 1px solid var(--color-border-secondary, #3c3c3c);
  transition: left 0.2s ease;
}

/* 内容区 */
.layout-dual__content {
  flex: 1;
  background: var(--color-bg-layout, #1e1e1e);
  padding: 0;
}

/* 状态栏页脚 */
.layout-dual__footer {
  background: var(--color-primary-default, #007acc);
}

.status-bar {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  font-size: 12px;
  color: #fff;
}

.status-item {
  padding: 0 8px;
  opacity: 0.9;
}

.status-item:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.3);
}

/* 亮色模式 */
:root:not([data-theme-mode="dark"]) .layout-dual,
.light .layout-dual {
  background: var(--color-bg-layout, #f3f3f3);
}

:root:not([data-theme-mode="dark"]) .layout-dual__icon-bar,
.light .layout-dual__icon-bar {
  background: var(--color-bg-container, #2c2c2c);
}

:root:not([data-theme-mode="dark"]) .layout-dual__sider,
.light .layout-dual__sider {
  background: var(--color-bg-container, #f3f3f3);
  border-right-color: var(--color-border-secondary, #e0e0e0);
}

:root:not([data-theme-mode="dark"]) .sider-header,
.light .sider-header {
  color: var(--color-text-secondary, #616161);
}

:root:not([data-theme-mode="dark"]) .layout-dual__header,
.light .layout-dual__header {
  background: var(--color-bg-container, #dddddd);
  border-bottom-color: var(--color-border-secondary, #c8c8c8);
}

:root:not([data-theme-mode="dark"]) .layout-dual__tabs,
.light .layout-dual__tabs {
  background: var(--color-bg-container, #ececec);
  border-bottom-color: var(--color-border-secondary, #d4d4d4);
}

:root:not([data-theme-mode="dark"]) .layout-dual__content,
.light .layout-dual__content {
  background: var(--color-bg-layout, #ffffff);
}
</style>
