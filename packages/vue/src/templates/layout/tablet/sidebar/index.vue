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
  transform: scale(0.95);
  background: var(--color-fill-tertiary, #e8e8e8);
}

.collapse-toggle svg {
  transition: transform 0.3s ease;
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
  transform: scale(0.95);
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
</style>
