<script setup lang="ts">
/**
 * TopMenu 顶部菜单布局模板
 *
 * 顶部水平导航布局：顶栏包含 Logo 和水平菜单 + 内容区
 * 适用于菜单项较少、需要更宽内容区的后台系统
 *
 * @example
 * ```vue
 * <TemplateRenderer category="layout" template-name="top-menu">
 *   <template #logo>
 *     <Logo />
 *   </template>
 *   <template #menu>
 *     <HorizontalMenu :data="menuData" />
 *   </template>
 *   <template #header-right>
 *     <UserMenu />
 *   </template>
 *   <template #default>
 *     <router-view />
 *   </template>
 * </TemplateRenderer>
 * ```
 */
import { computed } from 'vue'
import { LayoutHeader, LayoutContent, LayoutFooter } from '../../../../components/layout'

interface Props {
  /** 顶栏高度 @default 64 */
  headerHeight?: number
  /** 是否固定顶栏 @default true */
  fixedHeader?: boolean
  /** 是否显示页脚 @default true */
  showFooter?: boolean
  /** 页脚高度 @default 48 */
  footerHeight?: number
  /** 内容区最大宽度，0 表示不限制 @default 0 */
  maxContentWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 64,
  fixedHeader: true,
  showFooter: true,
  footerHeight: 48,
  maxContentWidth: 0,
})

/** 内容区顶部偏移 */
const contentTopOffset = computed(() =>
  props.fixedHeader ? props.headerHeight : 0,
)

/** 内容区样式 */
const contentStyle = computed(() => ({
  paddingTop: `${contentTopOffset.value}px`,
  maxWidth: props.maxContentWidth > 0 ? `${props.maxContentWidth}px` : undefined,
  margin: props.maxContentWidth > 0 ? '0 auto' : undefined,
}))
</script>

<template>
  <div class="top-menu-layout">
    <!-- 顶栏 -->
    <LayoutHeader
      :height="headerHeight"
      :fixed="fixedHeader"
      class="top-menu-layout__header"
    >
      <template #left>
        <div class="top-menu-layout__logo">
          <slot name="logo" />
        </div>
        <nav class="top-menu-layout__menu">
          <slot name="menu" />
        </nav>
      </template>
      <template #center>
        <slot name="header-center" />
      </template>
      <template #right>
        <slot name="header-right" />
      </template>
    </LayoutHeader>

    <!-- 内容区 -->
    <LayoutContent class="top-menu-layout__content" :style="contentStyle">
      <slot />
    </LayoutContent>

    <!-- 页脚 -->
    <LayoutFooter v-if="showFooter" :height="footerHeight">
      <slot name="footer" />
    </LayoutFooter>
  </div>
</template>

<style scoped>
.top-menu-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--layout-bg, #f0f2f5);
}

.top-menu-layout__header {
  background-color: var(--layout-header-bg, #001529);
  color: var(--layout-header-color, rgba(255, 255, 255, 0.85));
}

.top-menu-layout__logo {
  display: flex;
  align-items: center;
  margin-right: 24px;
}

.top-menu-layout__menu {
  display: flex;
  align-items: center;
  flex: 1;
}

.top-menu-layout__content {
  flex: 1;
  padding: 24px;
}
</style>

