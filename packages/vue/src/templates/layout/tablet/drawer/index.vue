<script setup lang="ts">
/**
 * Drawer 平板端抽屉式侧边栏布局模板
 *
 * 抽屉式侧边栏 + 顶栏，点击触发侧边栏滑出
 */
import { computed, ref } from 'vue'
import { LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from '../../../../components/layout'

interface Props {
  /** 侧边栏宽度 @default 280 */
  siderWidth?: number
  /** 顶栏高度 @default 56 */
  headerHeight?: number
  /** 是否固定顶栏 @default true */
  fixedHeader?: boolean
  /** 是否显示页脚 @default false */
  showFooter?: boolean
  /** 页脚高度 @default 48 */
  footerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  siderWidth: 280,
  headerHeight: 56,
  fixedHeader: true,
  showFooter: false,
  footerHeight: 48,
})

const siderVisible = ref(false)

const contentTopOffset = computed(() =>
  props.fixedHeader ? props.headerHeight : 0,
)

function handleToggleSider() {
  siderVisible.value = !siderVisible.value
}

function handleCloseSider() {
  siderVisible.value = false
}
</script>

<template>
  <div class="drawer-layout">
    <LayoutHeader :height="headerHeight" :fixed="fixedHeader" class="drawer-layout__header"
      @toggle-sider="handleToggleSider">
      <template #left>
        <button type="button" class="drawer-layout__menu-btn" @click="handleToggleSider">☰</button>
        <div class="drawer-layout__logo"><slot name="logo" /></div>
      </template>
      <template #center><slot name="header-center" /></template>
      <template #right><slot name="header-right" /></template>
    </LayoutHeader>

    <LayoutSider v-model:visible="siderVisible" :width="siderWidth" :collapsed-width="0" :fixed="true"
      :drawer="true" class="drawer-layout__sider" @mask-click="handleCloseSider">
      <div class="drawer-layout__sider-header">
        <slot name="sider-header">
          <div class="drawer-layout__sider-logo"><slot name="logo" /></div>
        </slot>
        <button type="button" class="drawer-layout__close-btn" @click="handleCloseSider"></button>
      </div>
      <nav class="drawer-layout__sider-menu"><slot name="sider" /></nav>
    </LayoutSider>

    <LayoutContent class="drawer-layout__content" :style="{ paddingTop: contentTopOffset + 'px' }">
      <slot />
    </LayoutContent>

    <LayoutFooter v-if="showFooter" :height="footerHeight"><slot name="footer" /></LayoutFooter>
  </div>
</template>

<style scoped>
.drawer-layout { display: flex; flex-direction: column; min-height: 100vh; background-color: var(--layout-bg, #f0f2f5); }
.drawer-layout__header { background-color: var(--layout-header-bg, #fff); border-bottom: 1px solid var(--color-border, #e5e7eb); }
.drawer-layout__menu-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; font-size: 20px; cursor: pointer; }
.drawer-layout__logo { display: flex; align-items: center; margin-left: 8px; }
.drawer-layout__sider { z-index: 200; }
.drawer-layout__sider-header { height: 56px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--color-border, #e5e7eb); }
.drawer-layout__sider-logo { display: flex; align-items: center; }
.drawer-layout__close-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; font-size: 24px; cursor: pointer; }
.drawer-layout__sider-menu { flex: 1; overflow-y: auto; padding: 8px; }
.drawer-layout__content { flex: 1; padding: 16px; }
</style>
