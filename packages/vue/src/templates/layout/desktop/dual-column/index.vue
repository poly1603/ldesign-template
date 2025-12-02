<script setup lang="ts">
/**
 * DualColumn 双栏布局模板
 *
 * 左侧窄图标栏 + 次级菜单栏 + 顶栏 + 内容区
 * 类似 VS Code 风格，适用于功能模块多、需要快速切换的系统
 */
import { computed, ref, watch } from 'vue'
import { LayoutHeader, LayoutContent, LayoutFooter } from '../../../../components/layout'
import { ChromeTabs } from '@ldesign/bookmark-vue'
import { useAutoDevice } from '../../../../composables/useAutoDevice'

interface Props {
  /** 图标栏宽度 @default 64 */
  iconBarWidth?: number
  /** 次级菜单栏宽度 @default 200 */
  siderWidth?: number
  /** 次级菜单栏折叠后宽度 @default 0 */
  siderCollapsedWidth?: number
  /** 顶栏高度 @default 56 */
  headerHeight?: number
  /** 标签栏高度 @default 40 */
  tabsHeight?: number
  /** 是否显示标签栏 @default true */
  showTabs?: boolean
  /** 是否固定顶栏 @default true */
  fixedHeader?: boolean
  /** 次级菜单栏初始折叠状态 @default false */
  defaultCollapsed?: boolean
  /** 是否显示页脚 @default false */
  showFooter?: boolean
  /** 页脚高度 @default 48 */
  footerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  iconBarWidth: 64,
  siderWidth: 200,
  siderCollapsedWidth: 0,
  headerHeight: 56,
  tabsHeight: 40,
  showTabs: true,
  fixedHeader: true,
  defaultCollapsed: false,
  showFooter: false,
  footerHeight: 48,
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
  if (isMobile.value) {
    siderVisible.value = !siderVisible.value
  }
  else {
    siderCollapsed.value = !siderCollapsed.value
  }
}

function handleCloseSider() {
  siderVisible.value = false
}
</script>

<template>
  <div class="dual-column-layout">
    <aside class="dual-column-layout__icon-bar" :style="{ width: iconBarWidth + 'px' }">
      <div class="dual-column-layout__logo">
        <slot name="logo" />
      </div>
      <nav class="dual-column-layout__icons">
        <slot name="icon-bar" />
      </nav>
      <div class="dual-column-layout__icon-bar-footer">
        <slot name="icon-bar-footer" />
      </div>
    </aside>

    <aside v-show="!siderCollapsed || isMobile" class="dual-column-layout__sider"
      :class="{ 'dual-column-layout__sider--drawer': isMobile, 'dual-column-layout__sider--visible': siderVisible }"
      :style="{ left: iconBarWidth + 'px', width: siderWidth + 'px' }">
      <div class="dual-column-layout__sider-header">
        <slot name="sider-header" />
      </div>
      <nav class="dual-column-layout__sider-menu">
        <slot name="sider" :collapsed="siderCollapsed" />
      </nav>
    </aside>

    <div v-if="isMobile && siderVisible" class="dual-column-layout__mask" @click="handleCloseSider" />

    <div class="dual-column-layout__main" :style="{ marginLeft: totalLeftWidth + 'px' }">
      <LayoutHeader :height="headerHeight" :fixed="fixedHeader" :left-offset="totalLeftWidth"
        class="dual-column-layout__header" @toggle-sider="handleToggleSider">
        <template #menuButton><span class="dual-column-layout__menu-icon"></span></template>
        <template #left>
          <slot name="header-left" />
        </template>
        <template #right>
          <slot name="header-right" />
        </template>
      </LayoutHeader>

      <!-- 标签栏 -->
      <div v-if="showTabs" class="dual-column-layout__tabs"
        :style="{ top: fixedHeader ? `${headerHeight}px` : undefined, left: `${totalLeftWidth}px` }">
        <slot name="tabs">
          <ChromeTabs :height="tabsHeight" />
        </slot>
      </div>

      <LayoutContent class="dual-column-layout__content" :style="{ paddingTop: contentTopOffset + 'px' }">
        <slot />
      </LayoutContent>

      <LayoutFooter v-if="showFooter" :height="footerHeight">
        <slot name="footer" />
      </LayoutFooter>
    </div>
  </div>
</template>

<style scoped>
.dual-column-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--layout-bg, #f0f2f5);
}

.dual-column-layout__icon-bar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--layout-icon-bar-bg, #1f1f1f);
  color: var(--layout-icon-bar-color, rgba(255, 255, 255, 0.85));
  z-index: 102;
}

.dual-column-layout__logo {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dual-column-layout__icons {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
}

.dual-column-layout__icon-bar-footer {
  padding: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.dual-column-layout__sider {
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: var(--layout-sider-bg, #fff);
  border-right: 1px solid var(--color-border, #e5e7eb);
  z-index: 101;
  transition: transform 0.3s ease;
}

.dual-column-layout__sider--drawer {
  transform: translateX(-100%);
}

.dual-column-layout__sider--drawer.dual-column-layout__sider--visible {
  transform: translateX(0);
}

.dual-column-layout__sider-header {
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.dual-column-layout__sider-menu {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.dual-column-layout__mask {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 100;
}

.dual-column-layout__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

.dual-column-layout__header {
  background-color: var(--layout-header-bg, #fff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.dual-column-layout__tabs {
  position: fixed;
  right: 0;
  z-index: 99;
  background-color: var(--layout-tabs-bg, #fff);
}

.dual-column-layout__menu-icon {
  font-size: 20px;
  cursor: pointer;
}

.dual-column-layout__content {
  flex: 1;
  padding: 16px;
}
</style>
