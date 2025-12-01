<script setup lang="ts">
/**
 * Portal 门户网站布局模板
 *
 * 顶部导航式布局，适合门户网站、官网等
 *
 * @example
 * ```vue
 * <TemplateRenderer category="layout" template-name="portal">
 *   <template #header-left>
 *     <Logo />
 *   </template>
 *   <template #header-center>
 *     <NavMenu />
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
  /** 页脚高度 @default 64 */
  footerHeight?: number
  /** 内容区最大宽度 @default 1200 */
  maxWidth?: number
  /** 是否居中内容 @default true */
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 64,
  fixedHeader: true,
  showFooter: true,
  footerHeight: 64,
  maxWidth: 1200,
  centered: true,
})

/** 内容区样式 */
const contentStyle = computed(() => ({
  maxWidth: props.centered ? `${props.maxWidth}px` : undefined,
  margin: props.centered ? '0 auto' : undefined,
  paddingTop: props.fixedHeader ? `${props.headerHeight}px` : undefined,
}))
</script>

<template>
  <div class="portal-layout">
    <!-- 顶栏 -->
    <LayoutHeader
      :height="headerHeight"
      :fixed="fixedHeader"
      class="portal-layout__header"
    >
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
    <LayoutContent class="portal-layout__content" :style="contentStyle">
      <slot />
    </LayoutContent>

    <!-- 页脚 -->
    <LayoutFooter v-if="showFooter" :height="footerHeight" class="portal-layout__footer">
      <template #left>
        <slot name="footer-left" />
      </template>
      <slot name="footer" />
      <template #right>
        <slot name="footer-right" />
      </template>
    </LayoutFooter>
  </div>
</template>

<style scoped>
.portal-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--layout-bg, #fff);
}

.portal-layout__header {
  background-color: var(--layout-header-bg, #fff);
}

.portal-layout__content {
  flex: 1;
  width: 100%;
  padding: 24px;
  background-color: var(--layout-content-bg, #fff);
}

.portal-layout__footer {
  background-color: var(--layout-footer-bg, #001529);
  color: var(--layout-footer-color, rgba(255, 255, 255, 0.65));
}
</style>

