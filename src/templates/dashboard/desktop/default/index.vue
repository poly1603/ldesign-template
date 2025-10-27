<script setup lang="ts">
import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'

interface Props {
  title?: string
  username?: string
  stats?: {
    visits: string
    users: string
    orders: string
    revenue: string
  }
}

// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  title: '仪表板',
  username: '用户',
  stats: () => ({
    visits: '12,345',
    users: '1,234',
    orders: '567',
    revenue: '89,012',
  }),
})

// 获取模板选择器
const selector = useTemplateSelector()
</script>

<template>
  <div class="ldesign-dashboard ldesign-dashboard--desktop-default">
    <div class="ldesign-dashboard__header">
      <div class="ldesign-dashboard__header-left">
        <slot name="logo"></slot>
        <slot name="title"></slot>
        <slot name="subtitle"></slot>
      </div>
      <div class="ldesign-dashboard__header-center"></div>
      <div class="ldesign-dashboard__header-right">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="ldesign-dashboard__aside">
      <slot name="aside"></slot>
    </div>
    <div class="ldesign-dashboard__main">
      <div class="ldesign-dashboard__main-tabs">
        <slot name="tabs"></slot>
      </div>
      <div class="ldesign-dashboard__main-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.ldesign-dashboard {
  &--desktop-default {
    display: grid;
    grid-template-columns: var(--dashboard-desktop-default-aside-width, calc(var(--size-5) * 20)) 1fr;
    grid-template-rows: var(--dashboard-desktop-default-header-height, calc(var(--size-5) * 5)) 1fr;
    background: var(--dashboard-desktop-default-bg, var(--color-bg-page));
    height: 100%;
    overflow: hidden;
  }

  &__header {
    grid-area: 1 / 1 / 2 / 3;
    background-color: var(--dashboard-desktop-header-bg, var(--color-bg-container));
    display: grid;
    grid-template-columns: auto 1fr auto;
    padding: 0 var(--dashboard-desktop-header-padding, var(--size-spacing-lg));
    align-items: center;
  }

  &__aside {
    grid-area: 2 / 1 / 3 / 2;
    background-color: var(--dashboard-desktop-aside-bg, var(--color-bg-container));
  }

  &__main {
    grid-area: 2 / 2 / 3 / 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    align-items: center;

    &-tabs {
      height: var(--dashboard-desktop-main-tabs-height, calc(var(--size-5) * 4));
      overflow: hidden;
      background-color: var(--dashboard-desktop-tabs-bg, var(--color-bg-component));
      width: 100%;
    }

    &-content {
      padding: var(--dashboard-desktop-main-padding, var(--size-spacing-lg));
      width: 100%;
      flex: 1;
      overflow: auto;
      box-sizing: border-box;
    }
  }
}
</style>
