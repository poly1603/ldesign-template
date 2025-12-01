<script setup lang="ts">
/**
 * Tablet 平板端布局模板
 *
 * 平板端布局，可折叠侧边栏 + 顶栏
 *
 * @example
 * ```vue
 * <TemplateRenderer category="layout">
 *   <template #sider>
 *     <Menu :data="menuData" />
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
import { computed, ref } from 'vue'
import { LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from '../../../../components/layout'

interface Props {
  /** 侧边栏宽度 @default 200 */
  siderWidth?: number
  /** 侧边栏折叠后宽度 @default 64 */
  siderCollapsedWidth?: number
  /** 顶栏高度 @default 56 */
  headerHeight?: number
  /** 是否固定顶栏 @default true */
  fixedHeader?: boolean
  /** 是否固定侧边栏 @default true */
  fixedSider?: boolean
  /** 侧边栏初始折叠状态 @default true */
  defaultCollapsed?: boolean
  /** 是否显示页脚 @default false */
  showFooter?: boolean
  /** 页脚高度 @default 48 */
  footerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  siderWidth: 200,
  siderCollapsedWidth: 64,
  headerHeight: 56,
  fixedHeader: true,
  fixedSider: true,
  defaultCollapsed: true,
  showFooter: false,
  footerHeight: 48,
})

const emit = defineEmits<{
  /** 侧边栏折叠状态变化 */
  siderCollapse: [collapsed: boolean]
}>()

// 侧边栏状态
const siderCollapsed = ref(props.defaultCollapsed)

// 计算实际侧边栏宽度
const actualSiderWidth = computed(() =>
  siderCollapsed.value ? props.siderCollapsedWidth : props.siderWidth,
)

// 内容区偏移量
const contentOffset = computed(() =>
  props.fixedSider ? actualSiderWidth.value : 0,
)

// 顶栏偏移量
const headerOffset = computed(() =>
  props.fixedSider ? actualSiderWidth.value : 0,
)

/** 切换侧边栏 */
function handleToggleSider() {
  siderCollapsed.value = !siderCollapsed.value
  emit('siderCollapse', siderCollapsed.value)
}
</script>

<template>
  <div class="tablet-layout">
    <!-- 侧边栏 -->
    <LayoutSider
      v-model:collapsed="siderCollapsed"
      :width="siderWidth"
      :collapsed-width="siderCollapsedWidth"
      :fixed="fixedSider"
      :top-offset="0"
    >
      <template #logo>
        <slot name="logo" :collapsed="siderCollapsed" />
      </template>
      <slot name="sider" :collapsed="siderCollapsed" />
      <template #footer>
        <slot name="sider-footer" :collapsed="siderCollapsed" />
      </template>
      <template #collapseButton>
        <span>{{ siderCollapsed ? '»' : '«' }}</span>
      </template>
    </LayoutSider>

    <!-- 主区域 -->
    <div
      class="tablet-layout__main"
      :style="{ marginLeft: `${contentOffset}px` }"
    >
      <!-- 顶栏 -->
      <LayoutHeader
        :height="headerHeight"
        :fixed="fixedHeader"
        :left-offset="headerOffset"
        @toggle-sider="handleToggleSider"
      >
        <template #menuButton>
          <slot name="menu-button">
            <span class="tablet-layout__menu-icon">☰</span>
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
      <LayoutContent
        class="tablet-layout__content"
        :style="{ paddingTop: fixedHeader ? `${headerHeight}px` : undefined }"
      >
        <slot />
      </LayoutContent>

      <!-- 页脚 -->
      <LayoutFooter v-if="showFooter" :height="footerHeight">
        <slot name="footer" />
      </LayoutFooter>
    </div>
  </div>
</template>

<style scoped>
.tablet-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--layout-bg, #f0f2f5);
}

.tablet-layout__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

.tablet-layout__content {
  flex: 1;
}

.tablet-layout__menu-icon {
  font-size: 18px;
}
</style>

