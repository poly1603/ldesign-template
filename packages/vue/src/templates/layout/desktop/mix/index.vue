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
  tabsHeight: 40,
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
            <svg :class="{ 'is-collapsed': siderCollapsed }" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
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
          <div class="footer-inner">© 2024 LDesign</div>
        </slot>
      </LayoutFooter>
    </div>
  </div>
</template>

<style scoped>
/* ========== 主容器 ========== */
.layout-mix {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg-layout, #f5f7fa);
}

/* ========== 顶栏 ========== */
.layout-mix__header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: linear-gradient(135deg, var(--color-primary-700, #1e3a5f) 0%, var(--color-primary-900, #0d1f33) 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.layout-mix__brand {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 100%;
}

.layout-mix__logo {
  display: flex;
  align-items: center;
  padding-left: 16px;
}

.layout-mix__top-menu {
  display: flex;
  align-items: center;
  height: 100%;
}

.layout-mix__header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 16px;
}

/* ========== 侧边栏 ========== */
.layout-mix__sider {
  background: var(--color-bg-container, #fff);
  border-right: 1px solid var(--color-border-secondary, #eef0f3);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.02);
}

.layout-mix__sider-title {
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--color-border-secondary, #eef0f3);
}

.sider-title-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-quaternary, #bfbfbf);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.layout-mix__sider-menu {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
}

.layout-mix__sider-menu::-webkit-scrollbar {
  width: 4px;
}

.layout-mix__sider-menu::-webkit-scrollbar-thumb {
  background: var(--color-border-secondary, #e0e0e0);
  border-radius: 4px;
}

.layout-mix__sider-footer {
  display: flex;
  justify-content: center;
  padding: 12px;
  border-top: 1px solid var(--color-border-secondary, #eef0f3);
}

.sider-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-fill-quaternary, #f5f5f5);
  border: none;
  border-radius: 8px;
  color: var(--color-text-tertiary, #8c8c8c);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sider-collapse-btn:hover {
  background: var(--color-fill-tertiary, #e8e8e8);
  color: var(--color-text-secondary, #595959);
}

.sider-collapse-btn svg {
  transition: transform 0.3s ease;
}

.sider-collapse-btn svg.is-collapsed {
  transform: rotate(180deg);
}

/* ========== 主区域 ========== */
.layout-mix__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========== 标签栏 ========== */
.layout-mix__tabs {
  position: fixed;
  right: 0;
  z-index: 999;
  background: var(--color-bg-container, #fff);
  border-bottom: 1px solid var(--color-border-secondary, #eef0f3);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========== 内容区 ========== */
.layout-mix__content {
  flex: 1;
  background: var(--color-bg-layout, #f5f7fa);
}

.content-inner {
  padding: 20px;
  min-height: calc(100vh - 200px);
  animation: contentFadeIn 0.4s ease;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== 页脚 ========== */
.layout-mix__footer {
  background: var(--color-bg-container, #fff);
  border-top: 1px solid var(--color-border-secondary, #eef0f3);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
  color: var(--color-text-quaternary, #bfbfbf);
}

/* ========== 深色模式 ========== */
:root[data-theme-mode="dark"] .layout-mix__header,
.dark .layout-mix__header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

:root[data-theme-mode="dark"] .layout-mix__sider,
.dark .layout-mix__sider {
  background: var(--color-bg-container, #1f1f1f);
  border-right-color: var(--color-border-secondary, #303030);
}

:root[data-theme-mode="dark"] .layout-mix__tabs,
.dark .layout-mix__tabs {
  background: var(--color-bg-container, #1f1f1f);
  border-bottom-color: var(--color-border-secondary, #303030);
}
</style>
