<script setup lang="ts">
/**
 * Mobile TopMenu 移动端顶部下拉菜单布局
 * 顶栏 + 下拉菜单 + 内容区
 */
import { computed, ref } from 'vue'
import { LayoutHeader, LayoutContent } from '../../../../components/layout'

interface Props {
  headerHeight?: number
  fixedHeader?: boolean
  safeArea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 52,
  fixedHeader: true,
  safeArea: true,
})

const menuExpanded = ref(false)

const contentTopOffset = computed(() =>
  props.fixedHeader ? props.headerHeight : 0,
)

function toggleMenu() {
  menuExpanded.value = !menuExpanded.value
  if (menuExpanded.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMenu() {
  menuExpanded.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <div class="mobile-top-menu" :class="{ 'has-safe-area': safeArea }">
    <!-- 顶栏 -->
    <LayoutHeader :height="headerHeight" :fixed="fixedHeader" class="mobile-top-menu__header">
      <template #left>
        <div class="header-brand">
          <slot name="logo" />
        </div>
      </template>
      <template #center>
        <div class="header-title">
          <slot name="header-center" />
        </div>
      </template>
      <template #right>
        <div class="header-actions">
          <slot name="header-right" />
          <button class="menu-toggle" :class="{ 'is-active': menuExpanded }" @click="toggleMenu">
            <span class="menu-icon">
              <span class="bar"></span>
              <span class="bar"></span>
              <span class="bar"></span>
            </span>
          </button>
        </div>
      </template>
    </LayoutHeader>

    <!-- 下拉菜单 -->
    <Teleport to="body">
      <Transition name="menu-fade">
        <div v-if="menuExpanded" class="menu-overlay" @click="closeMenu" />
      </Transition>
      <Transition name="menu-slide">
        <div v-if="menuExpanded" class="menu-dropdown" :style="{ top: `${headerHeight}px` }">
          <nav class="menu-nav" @click="closeMenu">
            <slot name="menu" />
          </nav>
        </div>
      </Transition>
    </Teleport>

    <!-- 内容区 -->
    <LayoutContent class="mobile-top-menu__content" :style="{
      paddingTop: `${contentTopOffset}px`,
      paddingBottom: safeArea ? 'env(safe-area-inset-bottom)' : undefined,
    }">
      <div class="content-inner">
        <slot />
      </div>
    </LayoutContent>
  </div>
</template>

<style scoped>
.mobile-top-menu {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg-layout, #f5f7fa);
}

.mobile-top-menu.has-safe-area {
  padding-top: env(safe-area-inset-top);
}

/* 顶栏 */
.mobile-top-menu__header {
  background: var(--color-bg-container, #fff);
  border-bottom: 1px solid var(--color-border-secondary, #eef0f3);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.header-brand {
  display: flex;
  align-items: center;
  padding-left: 4px;
}

.header-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary, #1f2937);
  text-align: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 汉堡菜单按钮 */
.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.menu-icon {
  position: relative;
  width: 20px;
  height: 14px;
}

.bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-text-secondary, #595959);
  border-radius: 1px;
  transition: all 0.3s ease;
}

.bar:nth-child(1) {
  top: 0;
}

.bar:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

.bar:nth-child(3) {
  bottom: 0;
}

.menu-toggle.is-active .bar:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  background: var(--color-primary-500, #3b82f6);
}

.menu-toggle.is-active .bar:nth-child(2) {
  opacity: 0;
  transform: translateX(10px);
}

.menu-toggle.is-active .bar:nth-child(3) {
  bottom: 50%;
  transform: translateY(50%) rotate(-45deg);
  background: var(--color-primary-500, #3b82f6);
}

/* 遮罩 */
.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 999;
}

/* 下拉菜单 */
.menu-dropdown {
  position: fixed;
  left: 0;
  right: 0;
  max-height: 70vh;
  background: var(--color-bg-container, #fff);
  border-radius: 0 0 20px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 1000;
}

.menu-nav {
  padding: 12px 16px 24px;
}

/* 内容区 */
.mobile-top-menu__content {
  flex: 1;
  background: var(--color-bg-layout, #f5f7fa);
  -webkit-overflow-scrolling: touch;
}

.content-inner {
  padding: 16px;
  min-height: 100%;
}

/* 动画 */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.3s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s ease;
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateY(-24px);
  opacity: 0;
}

/* 菜单项动画 */
.menu-nav :deep(> *) {
  animation: menuItemFade 0.25s ease both;
}

.menu-nav :deep(> *:nth-child(1)) { animation-delay: 0.05s; }
.menu-nav :deep(> *:nth-child(2)) { animation-delay: 0.1s; }
.menu-nav :deep(> *:nth-child(3)) { animation-delay: 0.15s; }
.menu-nav :deep(> *:nth-child(4)) { animation-delay: 0.2s; }
.menu-nav :deep(> *:nth-child(5)) { animation-delay: 0.25s; }

@keyframes menuItemFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色模式 */
:root[data-theme-mode="dark"] .mobile-top-menu__header,
.dark .mobile-top-menu__header {
  background: var(--color-bg-container, #1f1f1f);
  border-bottom-color: var(--color-border-secondary, #303030);
}

:root[data-theme-mode="dark"] .menu-dropdown,
.dark .menu-dropdown {
  background: var(--color-bg-container, #1f1f1f);
}

:root[data-theme-mode="dark"] .bar,
.dark .bar {
  background: var(--color-text-secondary, #a0a0a0);
}
</style>
