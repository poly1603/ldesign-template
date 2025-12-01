<script setup lang="ts">
/**
 * 布局标签栏组件
 *
 * 提供多标签页的基础结构，用于展示打开的页面标签
 *
 * @example
 * ```vue
 * <LayoutTabs
 *   :tabs="tabs"
 *   :active-key="activeTab"
 *   @change="handleTabChange"
 *   @close="handleTabClose"
 * />
 * ```
 */
import { computed } from 'vue'
import type { TabItem } from './types'

interface Props {
  /** 标签列表 */
  tabs?: TabItem[]
  /** 当前激活的标签 key */
  activeKey?: string
  /** 标签栏高度 @default 40 */
  height?: number
  /** 是否显示添加按钮 @default false */
  showAdd?: boolean
  /** 是否显示更多操作按钮 @default true */
  showMore?: boolean
  /** 自定义类名 */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  height: 40,
  showAdd: false,
  showMore: true,
})

const emit = defineEmits<{
  /** 标签切换 */
  change: [key: string]
  /** 关闭标签 */
  close: [key: string]
  /** 添加标签 */
  add: []
  /** 右键菜单 */
  contextmenu: [event: MouseEvent, tab: TabItem]
}>()

/** 标签栏样式 */
const tabsStyle = computed(() => ({
  height: `${props.height}px`,
}))

/** 标签栏类名 */
const tabsClass = computed(() => [
  'layout-tabs',
  props.class,
])

/** 判断标签是否激活 */
const isActive = (key: string) => key === props.activeKey

/** 处理标签点击 */
function handleTabClick(tab: TabItem) {
  emit('change', tab.key)
}

/** 处理标签关闭 */
function handleTabClose(event: MouseEvent, tab: TabItem) {
  event.stopPropagation()
  if (tab.closable !== false && !tab.pinned) {
    emit('close', tab.key)
  }
}

/** 处理右键菜单 */
function handleContextMenu(event: MouseEvent, tab: TabItem) {
  event.preventDefault()
  emit('contextmenu', event, tab)
}

/** 处理添加 */
function handleAdd() {
  emit('add')
}
</script>

<template>
  <div :class="tabsClass" :style="tabsStyle">
    <div class="layout-tabs__scroll">
      <div class="layout-tabs__list">
        <!-- 标签项 -->
        <div v-for="tab in tabs" :key="tab.key"
          :class="['layout-tabs__item', { 'layout-tabs__item--active': isActive(tab.key), 'layout-tabs__item--pinned': tab.pinned }]"
          @click="handleTabClick(tab)" @contextmenu="handleContextMenu($event, tab)">
          <!-- 图标 -->
          <span v-if="tab.icon" class="layout-tabs__icon">
            <slot name="icon" :tab="tab">{{ tab.icon }}</slot>
          </span>

          <!-- 标题 -->
          <span class="layout-tabs__title">{{ tab.title }}</span>

          <!-- 关闭按钮 -->
          <button v-if="tab.closable !== false && !tab.pinned" class="layout-tabs__close" type="button"
            aria-label="关闭标签" @click="handleTabClose($event, tab)">
            ×
          </button>

          <!-- 固定图标 -->
          <span v-if="tab.pinned" class="layout-tabs__pin">📌</span>
        </div>
      </div>
    </div>

    <!-- 添加按钮 -->
    <button v-if="showAdd" class="layout-tabs__add" type="button" aria-label="添加标签" @click="handleAdd">
      +
    </button>

    <!-- 更多操作 -->
    <div v-if="showMore" class="layout-tabs__more">
      <slot name="more">
        <button class="layout-tabs__more-btn" type="button" aria-label="更多操作">
          ⋮
        </button>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.layout-tabs {
  display: flex;
  align-items: center;
  background-color: var(--layout-tabs-bg, #fff);
  border-bottom: 1px solid var(--layout-border-color, #e8e8e8);
}

.layout-tabs__scroll {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}

.layout-tabs__scroll::-webkit-scrollbar {
  height: 4px;
}

.layout-tabs__list {
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 4px;
}

.layout-tabs__item {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  font-size: 13px;
  background-color: var(--layout-tabs-item-bg, #fafafa);
  border: 1px solid var(--layout-border-color, #e8e8e8);
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.layout-tabs__item:hover {
  background-color: var(--layout-tabs-item-hover-bg, #f0f0f0);
}

.layout-tabs__item--active {
  background-color: var(--layout-tabs-item-active-bg, #fff);
  border-bottom-color: transparent;
  color: var(--layout-primary-color, #1890ff);
}

.layout-tabs__item--pinned {
  background-color: var(--layout-tabs-item-pinned-bg, #e6f7ff);
}

.layout-tabs__icon {
  font-size: 14px;
}

.layout-tabs__title {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layout-tabs__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  font-size: 14px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
}

.layout-tabs__close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  opacity: 1;
}

.layout-tabs__pin {
  font-size: 10px;
}

.layout-tabs__add,
.layout-tabs__more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  font-size: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.layout-tabs__add:hover,
.layout-tabs__more-btn:hover {
  background-color: var(--layout-hover-bg, rgba(0, 0, 0, 0.04));
}

.layout-tabs__more {
  padding-right: 8px;
}
</style>