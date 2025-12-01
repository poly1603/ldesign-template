<script setup lang="ts">
/**
 * 布局侧边栏组件
 *
 * 支持折叠、固定、移动端抽屉模式等特性
 *
 * @example
 * ```vue
 * <LayoutSider :collapsed="false" :width="240" :collapsed-width="64">
 *   <template #logo>
 *     <Logo />
 *   </template>
 *   <Menu :data="menuData" />
 *   <template #footer>
 *     <UserInfo />
 *   </template>
 * </LayoutSider>
 * ```
 */
import { computed, ref, watch } from 'vue'

interface Props {
  /** 是否折叠 @default false */
  collapsed?: boolean
  /** 侧边栏宽度 @default 240 */
  width?: number
  /** 折叠后宽度 @default 64 */
  collapsedWidth?: number
  /** 是否固定 @default true */
  fixed?: boolean
  /** 是否为抽屉模式（移动端） @default false */
  drawer?: boolean
  /** 抽屉模式下是否显示 @default false */
  visible?: boolean
  /** 是否显示阴影 @default true */
  shadow?: boolean
  /** 是否显示右侧边框 @default false */
  bordered?: boolean
  /** 顶部偏移量 @default 0 */
  topOffset?: number
  /** 自定义类名 */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  width: 240,
  collapsedWidth: 64,
  fixed: true,
  drawer: false,
  visible: false,
  shadow: true,
  bordered: false,
  topOffset: 0,
})

const emit = defineEmits<{
  /** 更新折叠状态 */
  'update:collapsed': [value: boolean]
  /** 更新抽屉显示状态 */
  'update:visible': [value: boolean]
  /** 点击遮罩层 */
  maskClick: []
}>()

/** 实际宽度 */
const actualWidth = computed(() =>
  props.collapsed ? props.collapsedWidth : props.width,
)

/** 侧边栏样式 */
const siderStyle = computed(() => ({
  width: props.drawer ? `${props.width}px` : `${actualWidth.value}px`,
  top: props.fixed ? `${props.topOffset}px` : undefined,
  transform: props.drawer && !props.visible ? `translateX(-100%)` : undefined,
}))

/** 侧边栏类名 */
const siderClass = computed(() => [
  'layout-sider',
  {
    'layout-sider--collapsed': props.collapsed,
    'layout-sider--fixed': props.fixed,
    'layout-sider--drawer': props.drawer,
    'layout-sider--visible': props.drawer && props.visible,
    'layout-sider--shadow': props.shadow,
    'layout-sider--bordered': props.bordered,
  },
  props.class,
])

/** 处理遮罩点击 */
function handleMaskClick() {
  emit('update:visible', false)
  emit('maskClick')
}

/** 处理折叠按钮点击 */
function handleCollapseClick() {
  emit('update:collapsed', !props.collapsed)
}
</script>

<template>
  <div class="layout-sider-wrapper">
    <!-- 遮罩层（移动端抽屉模式） -->
    <Transition name="fade">
      <div
        v-if="drawer && visible"
        class="layout-sider__mask"
        @click="handleMaskClick"
      />
    </Transition>

    <!-- 侧边栏主体 -->
    <aside :class="siderClass" :style="siderStyle">
      <!-- Logo 区域 -->
      <div v-if="$slots.logo" class="layout-sider__logo">
        <slot name="logo" :collapsed="collapsed" />
      </div>

      <!-- 主内容区域 -->
      <div class="layout-sider__content">
        <slot :collapsed="collapsed" />
      </div>

      <!-- 底部区域 -->
      <div v-if="$slots.footer" class="layout-sider__footer">
        <slot name="footer" :collapsed="collapsed" />
      </div>

      <!-- 折叠按钮 -->
      <button
        v-if="!drawer && $slots.collapseButton !== undefined"
        class="layout-sider__collapse-btn"
        type="button"
        :aria-label="collapsed ? '展开侧边栏' : '折叠侧边栏'"
        @click="handleCollapseClick"
      >
        <slot name="collapseButton" :collapsed="collapsed">
          <span class="layout-sider__collapse-icon">
            {{ collapsed ? '»' : '«' }}
          </span>
        </slot>
      </button>
    </aside>
  </div>
</template>

<style scoped>
.layout-sider-wrapper {
  position: relative;
}

.layout-sider {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--layout-sider-bg, #001529);
  color: var(--layout-sider-color, rgba(255, 255, 255, 0.85));
  transition: width 0.3s ease, transform 0.3s ease;
  overflow: hidden;
  z-index: 101;
}

.layout-sider--fixed {
  position: fixed;
  left: 0;
  bottom: 0;
}

.layout-sider--drawer {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

.layout-sider--shadow {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.layout-sider--bordered {
  border-right: 1px solid var(--layout-border-color, #e8e8e8);
}

.layout-sider__mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 100;
}

.layout-sider__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 0 16px;
  overflow: hidden;
}

.layout-sider__content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.layout-sider__footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.layout-sider__collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0;
  background: rgba(255, 255, 255, 0.04);
  border: none;
  color: inherit;
  cursor: pointer;
  transition: background-color 0.2s;
}

.layout-sider__collapse-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.layout-sider__collapse-icon {
  font-size: 16px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

