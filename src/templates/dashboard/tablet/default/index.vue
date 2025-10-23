<script setup lang="ts">
import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'

interface Props {
  title?: string
  username?: string
}

// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  title: '平板仪表板',
  username: '用户'
})

// 获取模板选择器
const selector = useTemplateSelector()
</script>

<template>
  <div class="dashboard-tablet-default">
    <!-- Header -->
    <header class="tablet-header">
      <slot name="logo">
        <h1>{{ title }}</h1>
      </slot>
      <div class="header-right">
        <slot name="header-actions">
          <span class="username">{{ username }}</span>
        </slot>

        <!-- 模板选择器 - 放在右上角 -->
        <TemplateSelector v-if="selector && selector.enabled" v-bind="selector.props.value"
          @select="selector.onSelect" />
      </div>
    </header>

    <div class="tablet-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <slot name="sidebar">
          <nav class="nav-menu">
            <a href="#" class="nav-item active">概览</a>
            <a href="#" class="nav-item">数据</a>
            <a href="#" class="nav-item">报表</a>
          </nav>
        </slot>
      </aside>

      <!-- 主内容 -->
      <main class="main-content">
        <slot>
          <p class="subtitle">平板仪表板</p>
        </slot>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-tablet-default {
  min-height: 100vh;
  background: var(--template-dashboard-content-bg);
  display: flex;
  flex-direction: column;
}

.tablet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--template-spacing-xl) var(--template-spacing-2xl);
  background: var(--template-dashboard-header-bg);
  border-bottom: var(--template-border-width-thin) solid var(--template-border-light);
}

.tablet-header h1 {
  margin: 0;
  font-size: var(--template-font-xl);
  color: var(--template-text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--template-spacing-lg);
}

.username {
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
}

.tablet-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: var(--template-tablet-sidebar-width);
  background: var(--template-dashboard-sidebar-bg);
  border-right: var(--template-border-width-thin) solid var(--template-border-light);
}

.nav-menu {
  padding: var(--template-spacing-xl) 0;
}

.nav-item {
  display: block;
  padding: var(--template-spacing-lg) var(--template-spacing-xl);
  color: var(--template-text-secondary);
  text-decoration: none;
  transition: var(--template-transition-all);
}

.nav-item.active {
  color: var(--template-primary);
  background: var(--template-primary-lighter);
}

.main-content {
  flex: 1;
  padding: var(--template-spacing-2xl);
}

.subtitle {
  margin: 0;
  color: var(--template-text-secondary);
}
</style>
