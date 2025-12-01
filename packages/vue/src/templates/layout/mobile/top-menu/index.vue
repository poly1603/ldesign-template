<script setup lang="ts">
/**
 * TopMenu 移动端顶部导航布局模板
 *
 * 顶栏（下拉菜单）+ 内容区
 */
import { computed, ref } from 'vue'
import { LayoutHeader, LayoutContent } from '../../../../components/layout'

interface Props {
  /** 顶栏高度 @default 48 */
  headerHeight?: number
  /** 是否固定顶栏 @default true */
  fixedHeader?: boolean
  /** 是否启用安全区域 @default true */
  safeArea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 48,
  fixedHeader: true,
  safeArea: true,
})

const menuExpanded = ref(false)

const contentTopOffset = computed(() =>
  props.fixedHeader ? props.headerHeight : 0,
)

function handleToggleMenu() {
  menuExpanded.value = !menuExpanded.value
}

function handleCloseMenu() {
  menuExpanded.value = false
}
</script>

<template>
  <div class="top-menu-layout" :class="{ 'top-menu-layout--safe-area': safeArea }">
    <LayoutHeader :height="headerHeight" :fixed="fixedHeader" class="top-menu-layout__header">
      <template #left>
        <div class="top-menu-layout__logo"><slot name="logo" /></div>
      </template>
      <template #center><slot name="header-center" /></template>
      <template #right>
        <slot name="header-right" />
        <button type="button" class="top-menu-layout__menu-btn" @click="handleToggleMenu">
          {{ menuExpanded ? '' : '☰' }}
        </button>
      </template>
    </LayoutHeader>

    <Transition name="slide-down">
      <div v-if="menuExpanded" class="top-menu-layout__dropdown" :style="{ top: headerHeight + 'px' }">
        <nav class="top-menu-layout__menu" @click="handleCloseMenu">
          <slot name="menu" />
        </nav>
      </div>
    </Transition>

    <div v-if="menuExpanded" class="top-menu-layout__mask" @click="handleCloseMenu" />

    <LayoutContent class="top-menu-layout__content" :style="{ paddingTop: contentTopOffset + 'px' }">
      <slot />
    </LayoutContent>
  </div>
</template>

<style scoped>
.top-menu-layout { display: flex; flex-direction: column; min-height: 100vh; background-color: var(--layout-bg, #f5f5f5); }
.top-menu-layout--safe-area { padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); }
.top-menu-layout__header { background-color: var(--layout-header-bg, #fff); border-bottom: 1px solid var(--color-border, #e5e7eb); z-index: 101; }
.top-menu-layout__logo { display: flex; align-items: center; }
.top-menu-layout__menu-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; font-size: 20px; cursor: pointer; }
.top-menu-layout__dropdown { position: fixed; left: 0; right: 0; background-color: var(--layout-dropdown-bg, #fff); border-bottom: 1px solid var(--color-border, #e5e7eb); z-index: 100; max-height: 60vh; overflow-y: auto; }
.top-menu-layout__menu { padding: 8px 0; }
.top-menu-layout__mask { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.3); z-index: 99; }
.top-menu-layout__content { flex: 1; padding: 12px; }
.slide-down-enter-active, .slide-down-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-100%); opacity: 0; }
</style>
