<script setup lang="ts">
/**
 * Tablet Drawer 平板端抽屉布局
 * 滑出式抽屉菜单，触摸优化
 */
import { ref } from 'vue'
import { LayoutHeader, LayoutContent, LayoutFooter } from '../../../../components/layout'

interface Props {
  drawerWidth?: number
  headerHeight?: number
  fixedHeader?: boolean
  showFooter?: boolean
  footerHeight?: number
  drawerPosition?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  drawerWidth: 280,
  headerHeight: 56,
  fixedHeader: true,
  showFooter: false,
  footerHeight: 48,
  drawerPosition: 'left',
})

const drawerVisible = ref(false)

function openDrawer() {
  drawerVisible.value = true
}

function closeDrawer() {
  drawerVisible.value = false
}

function toggleDrawer() {
  drawerVisible.value = !drawerVisible.value
}

defineExpose({ openDrawer, closeDrawer, toggleDrawer })
</script>

<template>
  <div class="tablet-drawer">
    <!-- 抽屉 -->
    <Teleport to="body">
      <Transition name="drawer-fade">
        <div v-if="drawerVisible" class="drawer-overlay" @click="closeDrawer" />
      </Transition>
      <Transition :name="drawerPosition === 'left' ? 'drawer-slide-left' : 'drawer-slide-right'">
        <aside v-if="drawerVisible" class="drawer-panel" :class="`drawer-panel--${drawerPosition}`"
          :style="{ width: `${drawerWidth}px` }">
          <div class="drawer-header">
            <slot name="drawer-header">
              <span class="drawer-title">菜单</span>
            </slot>
            <button class="drawer-close" @click="closeDrawer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="drawer-body">
            <slot name="drawer" />
          </div>
          <div class="drawer-footer" v-if="$slots['drawer-footer']">
            <slot name="drawer-footer" />
          </div>
        </aside>
      </Transition>
    </Teleport>

    <!-- 顶栏 -->
    <LayoutHeader :height="headerHeight" :fixed="fixedHeader" class="tablet-drawer__header">
      <template #menuButton>
        <button class="menu-btn" @click="toggleDrawer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
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

    <!-- 内容区 -->
    <LayoutContent class="tablet-drawer__content"
      :style="{ paddingTop: fixedHeader ? `${headerHeight}px` : undefined }">
      <div class="content-inner">
        <slot />
      </div>
    </LayoutContent>

    <!-- 页脚 -->
    <LayoutFooter v-if="showFooter" :height="footerHeight" class="tablet-drawer__footer">
      <slot name="footer" />
    </LayoutFooter>
  </div>
</template>

<style scoped>
.tablet-drawer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg-layout, #f5f7fa);
}

/* 抽屉遮罩 */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

/* 抽屉面板 */
.drawer-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-container, #fff);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 1001;
}

.drawer-panel--left {
  left: 0;
  border-radius: 0 20px 20px 0;
}

.drawer-panel--right {
  right: 0;
  border-radius: 20px 0 0 20px;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border-secondary, #eef0f3);
}

.drawer-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
}

.drawer-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-fill-quaternary, #f5f5f5);
  border: none;
  border-radius: 10px;
  color: var(--color-text-tertiary, #8c8c8c);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s ease;
}

.drawer-close:active {
  transform: scale(0.95);
  background: var(--color-fill-tertiary, #e8e8e8);
}

.drawer-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.drawer-footer {
  padding: 16px;
  border-top: 1px solid var(--color-border-secondary, #eef0f3);
}

/* 顶栏 */
.tablet-drawer__header {
  background: var(--color-bg-container, #fff);
  border-bottom: 1px solid var(--color-border-secondary, #eef0f3);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  border-radius: 12px;
  color: var(--color-text-secondary, #595959);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s ease;
}

.menu-btn:active {
  background: var(--color-fill-secondary, #f0f0f0);
  transform: scale(0.95);
}

/* 内容区 */
.tablet-drawer__content {
  flex: 1;
  background: var(--color-bg-layout, #f5f7fa);
}

.content-inner {
  padding: 20px;
  min-height: calc(100vh - 120px);
}

/* 页脚 */
.tablet-drawer__footer {
  background: var(--color-bg-container, #fff);
  border-top: 1px solid var(--color-border-secondary, #eef0f3);
}

/* 动画 */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-left-enter-active,
.drawer-slide-left-leave-active,
.drawer-slide-right-enter-active,
.drawer-slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-left-enter-from,
.drawer-slide-left-leave-to {
  transform: translateX(-100%);
}

.drawer-slide-right-enter-from,
.drawer-slide-right-leave-to {
  transform: translateX(100%);
}

/* 深色模式 */
:root[data-theme-mode="dark"] .drawer-panel,
.dark .drawer-panel {
  background: var(--color-bg-container, #1f1f1f);
}

:root[data-theme-mode="dark"] .tablet-drawer__header,
.dark .tablet-drawer__header {
  background: var(--color-bg-container, #141414);
  border-bottom-color: var(--color-border-secondary, #303030);
}
</style>
