<script setup lang="ts">
/**
 * Tablet TopMenu 平板端顶部导航布局
 * 水平导航栏 + 内容区
 */
import { computed } from 'vue'
import { LayoutHeader, LayoutContent, LayoutFooter } from '../../../../components/layout'

interface Props {
  headerHeight?: number
  fixedHeader?: boolean
  showFooter?: boolean
  footerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 56,
  fixedHeader: true,
  showFooter: false,
  footerHeight: 48,
})

const contentTopOffset = computed(() =>
  props.fixedHeader ? props.headerHeight : 0,
)
</script>

<template>
  <div class="tablet-top-menu">
    <!-- 顶栏 -->
    <LayoutHeader :height="headerHeight" :fixed="fixedHeader" class="tablet-top-menu__header">
      <template #left>
        <div class="header-brand">
          <slot name="logo" />
        </div>
      </template>
      <template #center>
        <nav class="header-nav">
          <slot name="menu" />
        </nav>
      </template>
      <template #right>
        <div class="header-actions">
          <slot name="header-right" />
        </div>
      </template>
    </LayoutHeader>

    <!-- 内容区 -->
    <LayoutContent class="tablet-top-menu__content" :style="{ paddingTop: `${contentTopOffset}px` }">
      <div class="content-inner">
        <slot />
      </div>
    </LayoutContent>

    <!-- 页脚 -->
    <LayoutFooter v-if="showFooter" :height="footerHeight" class="tablet-top-menu__footer">
      <slot name="footer" />
    </LayoutFooter>
  </div>
</template>

<style scoped>
.tablet-top-menu {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg-layout, #f5f7fa);
}

/* 顶栏 */
.tablet-top-menu__header {
  background: linear-gradient(135deg, var(--color-primary-700, #1e3a5f) 0%, var(--color-primary-900, #0d1f33) 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-brand {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.header-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 20px;
}

/* 内容区 */
.tablet-top-menu__content {
  flex: 1;
  background: var(--color-bg-layout, #f5f7fa);
}

.content-inner {
  padding: 20px;
  min-height: calc(100vh - 120px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 导航栏悬停效果 */
.header-nav :deep(a),
.header-nav :deep(button) {
  transition: all 0.2s ease;
}

.header-nav :deep(a:hover),
.header-nav :deep(button:hover) {
  transform: translateY(-2px);
}

/* 页脚 */
.tablet-top-menu__footer {
  background: var(--color-bg-container, #fff);
  border-top: 1px solid var(--color-border-secondary, #eef0f3);
}

/* 深色模式 */
:root[data-theme-mode="dark"] .tablet-top-menu__header,
.dark .tablet-top-menu__header {
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
}
</style>
