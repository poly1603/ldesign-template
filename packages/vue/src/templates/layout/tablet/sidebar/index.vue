<script setup lang="ts">
/**
 * Tablet Sidebar 平板端侧边栏布局
 * 可折叠侧边栏 + 顶栏，优化触摸交互
 */
import { computed, ref } from 'vue'
import { LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from '../../../../components/layout'

interface Props {
  siderWidth?: number
  siderCollapsedWidth?: number
  headerHeight?: number
  fixedHeader?: boolean
  fixedSider?: boolean
  defaultCollapsed?: boolean
  showFooter?: boolean
  footerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  siderWidth: 240,
  siderCollapsedWidth: 72,
  headerHeight: 56,
  fixedHeader: true,
  fixedSider: true,
  defaultCollapsed: true,
  showFooter: false,
  footerHeight: 48,
})

const emit = defineEmits<{
  siderCollapse: [collapsed: boolean]
}>()

const siderCollapsed = ref(props.defaultCollapsed)

const actualSiderWidth = computed(() =>
  siderCollapsed.value ? props.siderCollapsedWidth : props.siderWidth,
)

const contentOffset = computed(() =>
  props.fixedSider ? actualSiderWidth.value : 0,
)

const headerOffset = computed(() =>
  props.fixedSider ? actualSiderWidth.value : 0,
)

function handleToggleSider() {
  siderCollapsed.value = !siderCollapsed.value
  emit('siderCollapse', siderCollapsed.value)
}
</script>

<template>
  <div class="tablet-sidebar" :class="{ 'is-collapsed': siderCollapsed }">
    <!-- 侧边栏 -->
    <LayoutSider v-model:collapsed="siderCollapsed" :width="siderWidth" :collapsed-width="siderCollapsedWidth"
      :fixed="fixedSider" :top-offset="0" class="tablet-sidebar__sider">
      <template #logo>
        <div class="sider-logo" :class="{ 'is-collapsed': siderCollapsed }">
          <slot name="logo" :collapsed="siderCollapsed" />
        </div>
      </template>

      <div class="sider-menu">
        <slot name="sider" :collapsed="siderCollapsed" />
      </div>

      <template #footer>
        <div class="sider-footer">
          <slot name="sider-footer" :collapsed="siderCollapsed">
            <button class="collapse-toggle" @click="handleToggleSider">
              <svg :class="{ 'is-collapsed': siderCollapsed }" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
            </button>
          </slot>
        </div>
      </template>
    </LayoutSider>

    <!-- 主区域 -->
    <div class="tablet-sidebar__main" :style="{ marginLeft: `${contentOffset}px` }">
      <!-- 顶栏 -->
      <LayoutHeader :height="headerHeight" :fixed="fixedHeader" :left-offset="headerOffset"
        class="tablet-sidebar__header" @toggle-sider="handleToggleSider">
        <template #menuButton>
          <slot name="menu-button">
            <button class="menu-btn" @click="handleToggleSider">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
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

      <!-- 内容区 -->
      <LayoutContent class="tablet-sidebar__content"
        :style="{ paddingTop: fixedHeader ? `${headerHeight}px` : undefined }">
        <div class="content-inner">
          <slot />
        </div>
      </LayoutContent>

      <!-- 页脚 -->
      <LayoutFooter v-if="showFooter" :height="footerHeight" class="tablet-sidebar__footer">
        <slot name="footer" />
      </LayoutFooter>
    </div>
  </div>
</template>

<style scoped>
.tablet-sidebar {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-layout, #f5f7fa);
}

/* 侧边栏 */
.tablet-sidebar__sider {
  background: linear-gradient(180deg, var(--color-bg-elevated, #fff) 0%, var(--color-bg-container, #fafafa) 100%);
  border-right: 1px solid var(--color-border-secondary, #eef0f3);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.03);
}

.sider-logo {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  border-bottom: 1px solid var(--color-border-secondary, #eef0f3);
  transition: all 0.3s ease;
}

.sider-logo.is-collapsed {
  justify-content: center;
  padding: 0;
}

.sider-menu {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.sider-footer {
  display: flex;
  justify-content: center;
  padding: 12px;
  border-top: 1px solid var(--color-border-secondary, #eef0f3);
}

.collapse-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-fill-quaternary, #f5f5f5);
  border: none;
  border-radius: 12px;
  color: var(--color-text-tertiary, #8c8c8c);
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.collapse-toggle:active {
  transform: scale(0.9);
  background: var(--color-fill-tertiary, #e8e8e8);
}

.collapse-toggle svg {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.collapse-toggle svg.is-collapsed {
  transform: rotate(180deg);
}

/* 主区域 */
.tablet-sidebar__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 顶栏 */
.tablet-sidebar__header {
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
  transform: scale(0.9);
}

/* 内容区 */
.tablet-sidebar__content {
  flex: 1;
  background: var(--color-bg-layout, #f5f7fa);
}

.content-inner {
  padding: 20px;
  min-height: calc(100vh - 120px);
}

/* 页脚 */
.tablet-sidebar__footer {
  background: var(--color-bg-container, #fff);
  border-top: 1px solid var(--color-border-secondary, #eef0f3);
}

/* 深色模式 */
:root[data-theme-mode="dark"] .tablet-sidebar__sider,
.dark .tablet-sidebar__sider {
  background: linear-gradient(180deg, var(--color-bg-elevated, #1f1f1f) 0%, var(--color-bg-container, #141414) 100%);
  border-right-color: var(--color-border-secondary, #303030);
}

:root[data-theme-mode="dark"] .tablet-sidebar__header,
.dark .tablet-sidebar__header {
  background: var(--color-bg-container, #141414);
  border-bottom-color: var(--color-border-secondary, #303030);
}

/* ========== 高级动画优化 ========== */

/* 侧边栏光晕效果 */
.tablet-sidebar__sider::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.03) 0%,
    transparent 50%,
    rgba(59, 130, 246, 0.02) 100%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.tablet-sidebar__sider:hover::before {
  opacity: 1;
}

/* Logo 悬停动画 */
.sider-logo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.sider-logo {
  position: relative;
  overflow: hidden;
}

.sider-logo:hover::after {
  transform: translateX(100%);
}

/* 折叠按钮光环 */
.collapse-toggle::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 15px;
  background: linear-gradient(135deg, var(--color-primary-500, #3b82f6), transparent);
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s, transform 0.3s;
}

.collapse-toggle {
  position: relative;
}

.collapse-toggle:hover::before {
  opacity: 0.2;
  animation: toggleGlow 1.5s ease-in-out infinite;
}

@keyframes toggleGlow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.25;
  }
}

/* 菜单按钮旋转动画 */
.menu-btn svg {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.menu-btn:active svg {
  transform: rotate(90deg);
}

/* 菜单按钮波纹 */
.menu-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: radial-gradient(circle, var(--color-primary-500, #3b82f6) 0%, transparent 70%);
  opacity: 0;
  transform: scale(0);
  transition: all 0.4s ease;
}

.menu-btn {
  position: relative;
  overflow: hidden;
}

.menu-btn:active::after {
  opacity: 0.15;
  transform: scale(2);
}

/* 内容区域动画 */
.content-inner {
  animation: contentFadeIn 0.5s ease;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 头部边框渐变线 */
.tablet-sidebar__header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary-500, #3b82f6), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.tablet-sidebar__header {
  position: relative;
}

.tablet-sidebar__header:hover::after {
  opacity: 0.3;
}

/* 侧边栏边框渐变线 */
.tablet-sidebar__sider::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--color-primary-500, #3b82f6), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.tablet-sidebar__sider:hover::after {
  opacity: 0.2;
}

/* 菜单项悬停效果 */
.sider-menu :deep(.menu-item),
.sider-menu :deep(.l-menu-item) {
  transition: all 0.25s ease;
}

.sider-menu :deep(.menu-item:hover),
.sider-menu :deep(.l-menu-item:hover) {
  transform: translateX(4px);
}

/* 滚动条美化 */
.sider-menu::-webkit-scrollbar {
  width: 4px;
}

.sider-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sider-menu::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  transition: background 0.3s;
}

.sider-menu:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}

:root[data-theme-mode="dark"] .sider-menu::-webkit-scrollbar-thumb,
.dark .sider-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

:root[data-theme-mode="dark"] .sider-menu:hover::-webkit-scrollbar-thumb,
.dark .sider-menu:hover::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

/* 侧边栏展开/收起动画 */
.tablet-sidebar__sider {
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Logo 文字渐隐动画 */
.sider-logo :deep(.logo-text) {
  transition: opacity 0.2s ease, width 0.25s ease;
  white-space: nowrap;
  overflow: hidden;
}

.sider-logo.is-collapsed :deep(.logo-text) {
  opacity: 0;
  width: 0;
}
</style>
