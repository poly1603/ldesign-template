<script setup lang="ts">
import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'

interface Props {
  title?: string
  username?: string
}

// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  title: '移动仪表板',
  username: '用户'
})

// 获取模板选择器
const selector = useTemplateSelector()
</script>

<template>
  <div class="dashboard-mobile-default">
    <!-- Header -->
    <header class="mobile-header">
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

    <!-- 底部导航 -->
    <nav class="bottom-nav">
      <slot name="sidebar">
        <a href="#" class="nav-item active">首页</a>
        <a href="#" class="nav-item">数据</a>
        <a href="#" class="nav-item">报表</a>
        <a href="#" class="nav-item">我的</a>
      </slot>
    </nav>

    <!-- 主内容 -->
    <div class="container">
      <slot>
        <p class="subtitle">移动仪表板</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.dashboard-mobile-default {
  min-height: 100vh;
  background: var(--template-dashboard-content-bg);
  display: flex;
  flex-direction: column;
  padding-bottom: var(--template-mobile-bottom-nav-height);
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--template-spacing-xl) var(--template-spacing-xl);
  background: var(--template-dashboard-header-bg);
  border-bottom: var(--template-border-width-thin) solid var(--template-border-light);
  position: sticky;
  top: 0;
  z-index: var(--template-z-sticky);
}

.mobile-header h1 {
  margin: 0;
  font-size: var(--template-font-lg);
  color: var(--template-text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--template-spacing-md);
}

.username {
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
}

.container {
  flex: 1;
  padding: var(--template-spacing-xl);
}

.subtitle {
  margin: 0;
  color: var(--template-text-secondary);
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--template-mobile-bottom-nav-height);
  background: var(--template-bg-container);
  border-top: var(--template-border-width-thin) solid var(--template-border-light);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: var(--template-spacing-md);
  color: var(--template-text-secondary);
  text-decoration: none;
  font-size: var(--template-font-sm);
  transition: var(--template-transition-all);
}

.nav-item.active {
  color: var(--template-primary);
  font-weight: var(--template-font-weight-semibold);
}
</style>
