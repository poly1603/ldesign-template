<script setup lang="ts">
/**
 * TopMenu 平板端顶部菜单布局模板
 *
 * 顶部导航栏 + 内容区，适合菜单项较少的平板应用
 */
import { computed } from 'vue'
import { LayoutHeader, LayoutContent, LayoutFooter } from '../../../../components/layout'

interface Props {
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
  headerHeight: 56,
  fixedHeader: true,
  showFooter: false,
  footerHeight: 48,
})

const contentTopOffset = computed(() =>
  props.fixedHeader ? props.headerHeight : 0,
)
</script>

<template>
  <div class="top-menu-layout">
    <LayoutHeader :height="headerHeight" :fixed="fixedHeader" class="top-menu-layout__header">
      <template #left>
        <div class="top-menu-layout__logo"><slot name="logo" /></div>
        <nav class="top-menu-layout__menu"><slot name="menu" /></nav>
      </template>
      <template #center><slot name="header-center" /></template>
      <template #right><slot name="header-right" /></template>
    </LayoutHeader>

    <LayoutContent class="top-menu-layout__content" :style="{ paddingTop: contentTopOffset + 'px' }">
      <slot />
    </LayoutContent>

    <LayoutFooter v-if="showFooter" :height="footerHeight"><slot name="footer" /></LayoutFooter>
  </div>
</template>

<style scoped>
.top-menu-layout { display: flex; flex-direction: column; min-height: 100vh; background-color: var(--layout-bg, #f0f2f5); }
.top-menu-layout__header { background-color: var(--layout-header-bg, #001529); color: var(--layout-header-color, rgba(255, 255, 255, 0.85)); }
.top-menu-layout__logo { display: flex; align-items: center; margin-right: 16px; }
.top-menu-layout__menu { display: flex; align-items: center; flex: 1; overflow-x: auto; }
.top-menu-layout__content { flex: 1; padding: 16px; }
</style>
