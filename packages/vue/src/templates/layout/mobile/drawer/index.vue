<script setup lang="ts">
/**
 * Mobile Drawer 移动端抽屉布局
 * 滑出式侧边菜单，支持手势操作
 */
import { ref } from 'vue'
import { LayoutHeader, LayoutContent } from '../../../../components/layout'

interface Props {
  drawerWidth?: number
  headerHeight?: number
  showHeader?: boolean
  fixedHeader?: boolean
  safeArea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  drawerWidth: 280,
  headerHeight: 52,
  showHeader: true,
  fixedHeader: true,
  safeArea: true,
})

const drawerVisible = ref(false)

function openDrawer() {
  drawerVisible.value = true
  document.body.style.overflow = 'hidden'
}

function closeDrawer() {
  drawerVisible.value = false
  document.body.style.overflow = ''
}

function toggleDrawer() {
  if (drawerVisible.value) {
    closeDrawer()
  } else {
    openDrawer()
  }
}

defineExpose({ openDrawer, closeDrawer, toggleDrawer })
</script>

<template>
  <div class="mobile-drawer">
    <!-- 抽屉 -->
    <Teleport to="body">
      <Transition name="overlay-fade">
        <div v-if="drawerVisible" class="drawer-overlay" @click="closeDrawer" />
      </Transition>
      <Transition name="drawer-slide">
        <aside v-if="drawerVisible" class="drawer-panel" :style="{ width: `${drawerWidth}px` }">
          <div class="drawer-header" :style="{ paddingTop: safeArea ? 'env(safe-area-inset-top)' : undefined }">
            <slot name="drawer-header">
              <div class="drawer-brand">
                <slot name="logo" />
              </div>
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
          <div class="drawer-footer" :style="{ paddingBottom: safeArea ? 'env(safe-area-inset-bottom)' : undefined }">
            <slot name="drawer-footer" />
          </div>
        </aside>
      </Transition>
    </Teleport>

    <!-- 顶栏 -->
    <LayoutHeader v-if="showHeader" :height="headerHeight" :fixed="fixedHeader" class="mobile-drawer__header">
      <template #menuButton>
        <button class="menu-btn" @click="openDrawer">
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
        <div class="header-title">
          <slot name="header-center" />
        </div>
      </template>
      <template #right>
        <slot name="header-right" />
      </template>
    </LayoutHeader>

    <!-- 内容区 -->
    <LayoutContent class="mobile-drawer__content" :style="{
      paddingTop: showHeader && fixedHeader ? `${headerHeight}px` : undefined,
      paddingBottom: safeArea ? 'env(safe-area-inset-bottom)' : undefined,
    }">
      <div class="content-inner">
        <slot />
      </div>
    </LayoutContent>
  </div>
</template>

<style scoped>
.mobile-drawer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg-layout, #f5f7fa);
}

/* 抽屉遮罩 */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

/* 抽屉面板 */
.drawer-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-container, #fff);
  box-shadow: 8px 0 32px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  border-radius: 0 24px 24px 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-secondary, #eef0f3);
}

.drawer-brand {
  display: flex;
  align-items: center;
}

.drawer-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-fill-quaternary, #f5f5f5);
  border: none;
  border-radius: 10px;
  color: var(--color-text-tertiary, #8c8c8c);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s ease;
}

.drawer-close:active {
  transform: scale(0.9);
  background: var(--color-fill-tertiary, #e8e8e8);
}

.drawer-body {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.drawer-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border-secondary, #eef0f3);
}

/* 顶栏 */
.mobile-drawer__header {
  background: var(--color-bg-container, #fff);
  border-bottom: 1px solid var(--color-border-secondary, #eef0f3);
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: var(--color-text-secondary, #595959);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.15s ease;
}

.menu-btn:active {
  background: var(--color-fill-secondary, #f0f0f0);
  transform: scale(0.9);
}

.header-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
  text-align: center;
}

/* 内容区 */
.mobile-drawer__content {
  flex: 1;
  background: var(--color-bg-layout, #f5f7fa);
  -webkit-overflow-scrolling: touch;
}

.content-inner {
  padding: 16px;
  min-height: 100%;
}

/* 动画 */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(-100%);
}

/* 抽屉内容动画 */
.drawer-body :deep(> *) {
  animation: drawerContentFade 0.3s ease 0.1s both;
}

@keyframes drawerContentFade {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 深色模式 */
:root[data-theme-mode="dark"] .drawer-panel,
.dark .drawer-panel {
  background: var(--color-bg-container, #1f1f1f);
}

:root[data-theme-mode="dark"] .mobile-drawer__header,
.dark .mobile-drawer__header {
  background: var(--color-bg-container, #141414);
  border-bottom-color: var(--color-border-secondary, #303030);
}

/* ========== 高级动画优化 ========== */

/* 抽屉面板光晕效果 */
.drawer-panel::before {
  content: '';
  position: absolute;
  top: 0;
  right: -100px;
  width: 100px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05));
  pointer-events: none;
}

/* 抽屉关闭按钮动画 */
.drawer-close::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary, #3b82f6), transparent);
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s;
}

.drawer-close {
  position: relative;
}

.drawer-close:active::before {
  opacity: 0.3;
}

.drawer-close svg {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.drawer-close:active svg {
  transform: rotate(90deg) scale(0.9);
}

/* 菜单按钮波纹效果 */
.menu-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  opacity: 0;
  transform: scale(0);
  transition: all 0.4s ease;
}

.menu-btn {
  position: relative;
  overflow: hidden;
}

.menu-btn:active::after {
  opacity: 1;
  transform: scale(2);
}

.menu-btn svg line {
  transition: all 0.3s ease;
  transform-origin: center;
}

.menu-btn:active svg line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.menu-btn:active svg line:nth-child(2) {
  opacity: 0;
}

.menu-btn:active svg line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* 抽屉内容交错动画 */
.drawer-body :deep(> *:nth-child(1)) { animation-delay: 0.05s; }
.drawer-body :deep(> *:nth-child(2)) { animation-delay: 0.1s; }
.drawer-body :deep(> *:nth-child(3)) { animation-delay: 0.15s; }
.drawer-body :deep(> *:nth-child(4)) { animation-delay: 0.2s; }
.drawer-body :deep(> *:nth-child(5)) { animation-delay: 0.25s; }

/* 内容区域加载动画 */
.content-inner {
  animation: contentFadeIn 0.5s ease;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 遮罩层模糊效果增强 */
.drawer-overlay {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 抽屉面板圆角阴影 */
.drawer-panel {
  box-shadow: 
    8px 0 32px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

/* 抽屉头部渐变边框 */
.drawer-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-secondary, #eef0f3), transparent);
}

.drawer-header {
  position: relative;
}

/* 抽屉底部渐变边框 */
.drawer-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-secondary, #eef0f3), transparent);
}

.drawer-footer {
  position: relative;
}

/* 标题渐变效果 */
.header-title {
  background: linear-gradient(135deg, var(--color-text-primary, #1f2937), var(--color-primary, #3b82f6));
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleFlow 4s ease-in-out infinite;
}

@keyframes titleFlow {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 200% center;
  }
}

/* 滚动条美化 */
.drawer-body::-webkit-scrollbar {
  width: 4px;
}

.drawer-body::-webkit-scrollbar-track {
  background: transparent;
}

.drawer-body::-webkit-scrollbar-thumb {
  background: var(--color-border-secondary, #e5e5e5);
  border-radius: 2px;
}
</style>
