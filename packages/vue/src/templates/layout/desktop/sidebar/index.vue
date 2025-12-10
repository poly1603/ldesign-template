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
  siderCollapsedWidth: 68,
  headerHeight: 60,
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
            <button class="collapse-btn" @click="handleToggleSider">
              <svg :class="{ 'is-collapsed': siderCollapsed }" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
              <span v-if="!siderCollapsed" class="collapse-text">收起菜单</span>
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
            <span>© 2024 LDesign. All rights reserved.</span>
          </div>
        </slot>
      </LayoutFooter>
    </div>
  </div>
</template>

<style scoped>
/* ========== 主布局容器 ========== */
.layout-sidebar {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-layout, #f0f2f5);
}

/* ========== 侧边栏 ========== */
.layout-sidebar__sider {
  background: linear-gradient(180deg, var(--color-bg-elevated, #fff) 0%, var(--color-bg-container, #fafafa) 100%);
  border-right: 1px solid var(--color-border-secondary, #f0f0f0);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.layout-sidebar__sider:hover {
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.04);
}

/* Logo区域 */
.layout-sidebar__logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border-secondary, #f0f0f0);
  background: var(--color-bg-container, #fff);
  transition: all 0.3s ease;
  overflow: hidden;
}

.layout-sidebar__logo.is-collapsed {
  justify-content: center;
  padding: 0 12px;
}

/* 菜单区域 */
.layout-sidebar__menu {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
  overflow-x: hidden;
}

.layout-sidebar__menu::-webkit-scrollbar {
  width: 4px;
}

.layout-sidebar__menu::-webkit-scrollbar-thumb {
  background: var(--color-border-secondary, #e0e0e0);
  border-radius: 4px;
}

.layout-sidebar__menu::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-default, #d0d0d0);
}

/* 侧边栏底部 */
.layout-sidebar__sider-footer {
  padding: 12px;
  border-top: 1px solid var(--color-border-secondary, #f0f0f0);
}

/* 折叠按钮 */
.collapse-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: var(--color-fill-quaternary, #f5f5f5);
  border: none;
  border-radius: 8px;
  color: var(--color-text-tertiary, #8c8c8c);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  background: var(--color-fill-tertiary, #e8e8e8);
  color: var(--color-text-secondary, #595959);
}

.collapse-btn svg {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.collapse-btn svg.is-collapsed {
  transform: rotate(180deg);
}

.collapse-text {
  white-space: nowrap;
  overflow: hidden;
}

/* ========== 主内容区域 ========== */
.layout-sidebar__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========== 顶栏 ========== */
.layout-sidebar__header {
  background: var(--color-bg-container, #fff);
  border-bottom: 1px solid var(--color-border-secondary, #f0f0f0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.menu-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--color-text-secondary, #595959);
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-toggle-btn:hover {
  background: var(--color-fill-secondary, #f0f0f0);
  color: var(--color-text-primary, #262626);
}

.menu-toggle-btn:active {
  transform: scale(0.95);
}

/* ========== 标签栏 ========== */
.layout-sidebar__tabs {
  position: fixed;
  right: 0;
  z-index: var(--z-index-sticky, 99);
  background: var(--color-bg-container, #fff);
  border-bottom: 1px solid var(--color-border-secondary, #f0f0f0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========== 内容区 ========== */
.layout-sidebar__content {
  flex: 1;
  background: var(--color-bg-layout, #f0f2f5);
  transition: padding-top 0.3s ease;
}

.content-wrapper {
  padding: var(--size-space-lg, 24px);
  min-height: calc(100vh - 200px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 页脚 ========== */
.layout-sidebar__footer {
  background: var(--color-bg-container, #fff);
  border-top: 1px solid var(--color-border-secondary, #f0f0f0);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
  color: var(--color-text-quaternary, #bfbfbf);
}

/* ========== 响应式适配 ========== */
@media (max-width: 768px) {
  .content-wrapper {
    padding: var(--size-space-md, 16px);
  }
}

/* ========== 深色模式优化 ========== */
:root[data-theme-mode="dark"] .layout-sidebar__sider,
.dark .layout-sidebar__sider {
  background: linear-gradient(180deg, var(--color-bg-elevated, #1f1f1f) 0%, var(--color-bg-container, #141414) 100%);
  border-right-color: var(--color-border-secondary, #303030);
}

:root[data-theme-mode="dark"] .layout-sidebar__header,
.dark .layout-sidebar__header {
  background: var(--color-bg-container, #141414);
  border-bottom-color: var(--color-border-secondary, #303030);
}

:root[data-theme-mode="dark"] .layout-sidebar__tabs,
.dark .layout-sidebar__tabs {
  background: var(--color-bg-container, #141414);
  border-bottom-color: var(--color-border-secondary, #303030);
}
</style>
