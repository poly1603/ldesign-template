<script setup lang="ts">
/**
 * Drawer 移动端抽屉式布局模板
 *
 * 顶栏（汉堡菜单）+ 抽屉式侧边栏 + 内容区
 */
import { computed, ref } from 'vue'
import { LayoutHeader, LayoutSider, LayoutContent } from '../../../../components/layout'

interface Props {
  /** 顶栏高度 @default 48 */
  headerHeight?: number
  /** 是否固定顶栏 @default true */
  fixedHeader?: boolean
  /** 侧边栏宽度 @default 280 */
  siderWidth?: number
  /** 是否启用安全区域 @default true */
  safeArea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 48,
  fixedHeader: true,
  siderWidth: 280,
  safeArea: true,
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
  <div class="drawer-layout" :class="{ 'drawer-layout--safe-area': safeArea }">
    <LayoutHeader :height="headerHeight" :fixed="fixedHeader" class="drawer-layout__header">
      <template #left>
        <button type="button" class="drawer-layout__menu-btn" @click="handleToggleSider">☰</button>
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
  </div>
</template>

<style scoped>
.drawer-layout { display: flex; flex-direction: column; min-height: 100vh; background-color: var(--layout-bg, #f5f5f5); }
.drawer-layout--safe-area { padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); }
.drawer-layout__header { background-color: var(--layout-header-bg, #fff); border-bottom: 1px solid var(--color-border, #e5e7eb); }
.drawer-layout__menu-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; font-size: 20px; cursor: pointer; }
.drawer-layout__sider { z-index: 200; }
.drawer-layout__sider-header { height: 48px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--color-border, #e5e7eb); }
.drawer-layout__sider-logo { display: flex; align-items: center; }
.drawer-layout__close-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; font-size: 24px; cursor: pointer; }
.drawer-layout__sider-menu { flex: 1; overflow-y: auto; padding: 8px; }
.drawer-layout__content { flex: 1; padding: 12px; }
</style>
