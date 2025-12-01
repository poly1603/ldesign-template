<script setup lang="ts">
/**
 * Sidebar 经典侧边栏布局模板
 *
 * 经典的后台管理系统布局：左侧边栏 + 顶栏 + 内容区
 * 适用于大多数后台管理系统，如 Ant Design Pro、Element Plus Admin 等
 *
 * @example
 * ```vue
 * <TemplateRenderer category="layout">
 *   <template #logo>
 *     <Logo />
 *   </template>
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
import { computed, ref, watch } from 'vue'
import { LayoutHeader, LayoutSider, LayoutContent, LayoutFooter, LayoutTabs } from '../../../../components/layout'
import { useAutoDevice } from '../../../../composables/useAutoDevice'

interface Props {
  /** 侧边栏宽度 @default 240 */
  siderWidth?: number
  /** 侧边栏折叠后宽度 @default 64 */
  siderCollapsedWidth?: number
  /** 顶栏高度 @default 64 */
  headerHeight?: number
  /** 标签栏高度 @default 40 */
  tabsHeight?: number
  /** 是否显示标签栏 @default true */
  showTabs?: boolean
  /** 是否显示页脚 @default true */
  showFooter?: boolean
  /** 页脚高度 @default 48 */
  footerHeight?: number
  /** 侧边栏初始折叠状态 @default false */
  defaultCollapsed?: boolean
  /** 是否固定顶栏 @default true */
  fixedHeader?: boolean
  /** 是否固定侧边栏 @default true */
  fixedSider?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  siderWidth: 240,
  siderCollapsedWidth: 64,
  headerHeight: 64,
  tabsHeight: 40,
  showTabs: true,
  showFooter: true,
  footerHeight: 48,
  defaultCollapsed: false,
  fixedHeader: true,
  fixedSider: true,
})

const emit = defineEmits<{
  /** 侧边栏折叠状态变化 */
  siderCollapse: [collapsed: boolean]
}>()

// 设备检测
const { isMobile } = useAutoDevice()

// 侧边栏状态
const siderCollapsed = ref(props.defaultCollapsed)
const siderVisible = ref(false)

// 计算实际侧边栏宽度
const actualSiderWidth = computed(() =>
  siderCollapsed.value ? props.siderCollapsedWidth : props.siderWidth,
)

// 内容区偏移量
const contentOffset = computed(() => {
  if (isMobile.value) return 0
  return props.fixedSider ? actualSiderWidth.value : 0
})

// 顶栏偏移量
const headerOffset = computed(() => {
  if (isMobile.value) return 0
  return props.fixedSider ? actualSiderWidth.value : 0
})

// 内容区顶部偏移
const contentTopOffset = computed(() => {
  let offset = props.fixedHeader ? props.headerHeight : 0
  if (props.showTabs) offset += props.tabsHeight
  return offset
})

// 监听移动端自动折叠
watch(isMobile, (mobile) => {
  if (mobile) {
    siderCollapsed.value = true
    siderVisible.value = false
  }
})

/** 切换侧边栏 */
function handleToggleSider() {
  if (isMobile.value) {
    siderVisible.value = !siderVisible.value
  }
  else {
    siderCollapsed.value = !siderCollapsed.value
    emit('siderCollapse', siderCollapsed.value)
  }
}

/** 关闭移动端侧边栏 */
function handleCloseSider() {
  siderVisible.value = false
}
</script>

<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <LayoutSider v-model:collapsed="siderCollapsed" v-model:visible="siderVisible" :width="siderWidth"
      :collapsed-width="siderCollapsedWidth" :fixed="fixedSider" :drawer="isMobile" :top-offset="0"
      @mask-click="handleCloseSider">
      <template #logo>
        <slot name="logo" :collapsed="siderCollapsed" />
      </template>
      <slot name="sider" :collapsed="siderCollapsed" />
      <template #footer>
        <slot name="sider-footer" :collapsed="siderCollapsed" />
      </template>
    </LayoutSider>

    <!-- 主区域 -->
    <div class="admin-layout__main" :style="{ marginLeft: `${contentOffset}px` }">
      <!-- 顶栏 -->
      <LayoutHeader :height="headerHeight" :fixed="fixedHeader" :left-offset="headerOffset"
        @toggle-sider="handleToggleSider">
        <template #menuButton>
          <slot name="menu-button">
            <span class="admin-layout__menu-icon">☰</span>
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

      <!-- 标签栏 -->
      <div v-if="showTabs" class="admin-layout__tabs"
        :style="{ top: fixedHeader ? `${headerHeight}px` : undefined, left: `${headerOffset}px` }">
        <slot name="tabs">
          <LayoutTabs :height="tabsHeight" />
        </slot>
      </div>

      <!-- 内容区 -->
      <LayoutContent class="admin-layout__content" :style="{ paddingTop: `${contentTopOffset}px` }">
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
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--layout-bg, #f0f2f5);
}

.admin-layout__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

.admin-layout__tabs {
  position: fixed;
  right: 0;
  z-index: 99;
  background-color: var(--layout-tabs-bg, #fff);
}

.admin-layout__content {
  flex: 1;
}

.admin-layout__menu-icon {
  font-size: 20px;
}
</style>