<script setup lang="ts">
/**
 * Dashboard 仪表盘布局模板
 *
 * 全屏仪表盘布局，适合数据可视化大屏
 *
 * @example
 * ```vue
 * <TemplateRenderer category="layout" template-name="dashboard">
 *   <template #header-left>
 *     <h1>数据监控中心</h1>
 *   </template>
 *   <template #default>
 *     <DashboardGrid />
 *   </template>
 * </TemplateRenderer>
 * ```
 */
import { computed, ref } from 'vue'
import { LayoutHeader, LayoutContent } from '../../../../components/layout'

interface Props {
  /** 顶栏高度 @default 56 */
  headerHeight?: number
  /** 是否显示顶栏 @default true */
  showHeader?: boolean
  /** 背景色 @default '#0d1117' */
  background?: string
  /** 内边距 @default 16 */
  padding?: number
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 56,
  showHeader: true,
  background: '#0d1117',
  padding: 16,
})

/** 是否全屏 */
const isFullscreen = ref(false)

/** 切换全屏 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  }
  else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

/** 内容区样式 */
const contentStyle = computed(() => ({
  padding: `${props.padding}px`,
  paddingTop: props.showHeader ? `${props.headerHeight + props.padding}px` : `${props.padding}px`,
}))
</script>

<template>
  <div
    class="dashboard-layout"
    :style="{ background }"
  >
    <!-- 顶栏 -->
    <LayoutHeader
      v-if="showHeader"
      :height="headerHeight"
      :fixed="true"
      :shadow="false"
      class="dashboard-layout__header"
    >
      <template #left>
        <slot name="header-left" />
      </template>
      <template #center>
        <slot name="header-center" />
      </template>
      <template #right>
        <slot name="header-right">
          <button
            class="dashboard-layout__fullscreen-btn"
            type="button"
            :aria-label="isFullscreen ? '退出全屏' : '全屏'"
            @click="toggleFullscreen"
          >
            {{ isFullscreen ? '⛶' : '⛶' }}
          </button>
        </slot>
      </template>
    </LayoutHeader>

    <!-- 内容区 -->
    <LayoutContent
      class="dashboard-layout__content"
      :style="contentStyle"
      :scroll="false"
    >
      <slot />
    </LayoutContent>
  </div>
</template>

<style scoped>
.dashboard-layout {
  position: relative;
  min-height: 100vh;
  color: var(--dashboard-color, #e6edf3);
}

.dashboard-layout__header {
  background-color: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dashboard-layout__content {
  background-color: transparent !important;
  height: 100vh;
  overflow: hidden;
}

.dashboard-layout__fullscreen-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: 18px;
  color: inherit;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dashboard-layout__fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>

