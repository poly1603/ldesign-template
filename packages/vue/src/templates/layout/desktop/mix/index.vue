<script setup lang="ts">
/**
 * Mix 混合布局模板
 *
 * 顶部一级导航 + 左侧二级导航 + 内容区
 * 适用于模块较多、需要两级导航的大型后台系统
 *
 * @example
 * ```vue
 * <TemplateRenderer category="layout" template-name="mix">
 *   <template #logo>
 *     <Logo />
 *   </template>
 *   <template #top-menu>
 *     <TopMenu :data="topMenuData" @select="onTopMenuSelect" />
 *   </template>
 *   <template #sider>
 *     <SiderMenu :data="siderMenuData" />
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
import { computed, ref, watch } from 'vue'
import { LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from '../../../../components/layout'
import { useAutoDevice } from '../../../../composables/useAutoDevice'

interface Props {
  /** 侧边栏宽度 @default 200 */
  siderWidth?: number
  /** 侧边栏折叠后宽度 @default 48 */
  siderCollapsedWidth?: number
  /** 顶栏高度 @default 64 */
  headerHeight?: number
  /** 是否固定顶栏 @default true */
  fixedHeader?: boolean
  /** 是否固定侧边栏 @default true */
  fixedSider?: boolean
  /** 侧边栏初始折叠状态 @default false */
  defaultCollapsed?: boolean
  /** 是否显示页脚 @default true */
  showFooter?: boolean
  /** 页脚高度 @default 48 */
  footerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  siderWidth: 200,
  siderCollapsedWidth: 48,
  headerHeight: 64,
  fixedHeader: true,
  fixedSider: true,
  defaultCollapsed: false,
  showFooter: true,
  footerHeight: 48,
})

const emit = defineEmits<{
  siderCollapse: [collapsed: boolean]
}>()

const { isMobile } = useAutoDevice()
const siderCollapsed = ref(props.defaultCollapsed)
const siderVisible = ref(false)

const actualSiderWidth = computed(() =>
  siderCollapsed.value ? props.siderCollapsedWidth : props.siderWidth,
)

const contentOffset = computed(() => {
  if (isMobile.value) return 0
  return props.fixedSider ? actualSiderWidth.value : 0
})

const contentTopOffset = computed(() =>
  props.fixedHeader ? props.headerHeight : 0,
)

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
    emit('siderCollapse', siderCollapsed.value)
  }
}

function handleCloseSider() {
  siderVisible.value = false
}
</script>

<template>
  <div class="mix-layout">
    <!-- 顶栏（包含一级导航） -->
    <LayoutHeader :height="headerHeight" :fixed="fixedHeader" class="mix-layout__header">
      <template #left>
        <div class="mix-layout__logo">
          <slot name="logo" />
        </div>
        <nav class="mix-layout__top-menu">
          <slot name="top-menu" />
        </nav>
      </template>
      <template #right>
        <slot name="header-right" />
      </template>
    </LayoutHeader>

    <!-- 侧边栏（二级导航） -->
    <LayoutSider v-model:collapsed="siderCollapsed" v-model:visible="siderVisible" :width="siderWidth"
      :collapsed-width="siderCollapsedWidth" :fixed="fixedSider" :drawer="isMobile" :top-offset="headerHeight"
      class="mix-layout__sider" @mask-click="handleCloseSider">
      <slot name="sider" :collapsed="siderCollapsed" />
    </LayoutSider>

    <!-- 主区域 -->
    <div class="mix-layout__main" :style="{ marginLeft: `${contentOffset}px`, paddingTop: `${contentTopOffset}px` }">
      <button class="mix-layout__toggle" type="button" @click="handleToggleSider">
        {{ siderCollapsed ? '»' : '«' }}
      </button>

      <LayoutContent class="mix-layout__content">
        <slot />
      </LayoutContent>

      <LayoutFooter v-if="showFooter" :height="footerHeight">
        <slot name="footer" />
      </LayoutFooter>
    </div>
  </div>
</template>

<style scoped>
.mix-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--layout-bg, #f0f2f5);
}

.mix-layout__header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;
  background-color: var(--layout-header-bg, #001529);
  color: var(--layout-header-color, rgba(255, 255, 255, 0.85));
}

.mix-layout__logo {
  display: flex;
  align-items: center;
  margin-right: 24px;
}

.mix-layout__top-menu {
  display: flex;
  align-items: center;
}

.mix-layout__sider {
  margin-top: 0;
}

.mix-layout__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

.mix-layout__toggle {
  position: fixed;
  bottom: 60px;
  left: 8px;
  z-index: 100;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-container, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: left 0.3s ease;
}

.mix-layout__content {
  flex: 1;
  padding: 16px;
}
</style>