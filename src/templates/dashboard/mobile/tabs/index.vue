<script setup lang="ts">
interface Props {
  title?: string
  username?: string
}

// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  title: '标签移动仪表板',
  username: '用户'
})
</script>

<template>
  <div class="dashboard-mobile-tabs">
    <!-- Header -->
    <header class="mobile-header">
      <slot name="logo">
        <h1>{{ title }}</h1>
      </slot>
      <slot name="header-actions">
        <span class="username">{{ username }}</span>
      </slot>
    </header>

    <!-- 标签导航 -->
    <nav class="tabs-nav">
      <slot name="sidebar">
        <a href="#" class="tab-item active">首页</a>
        <a href="#" class="tab-item">数据</a>
        <a href="#" class="tab-item">报表</a>
        <a href="#" class="tab-item">我的</a>
      </slot>
    </nav>

    <!-- 主内容 -->
    <div class="container">
      <slot>
        <p class="subtitle">标签移动仪表板</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.dashboard-mobile-tabs {
  min-height: 100vh;
  background: var(--template-dashboard-content-bg);
  display: flex;
  flex-direction: column;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--template-spacing-xl) var(--template-spacing-xl);
  background: var(--template-dashboard-header-bg);
  border-bottom: var(--template-border-width-thin) solid var(--template-border-light);
}

.mobile-header h1 {
  margin: 0;
  font-size: var(--template-font-lg);
  color: var(--template-text-primary);
}

.username {
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
}

.tabs-nav {
  background: var(--template-bg-container);
  border-bottom: var(--template-border-width-medium) solid var(--template-border-light);
  display: flex;
  overflow-x: auto;
}

.tab-item {
  flex-shrink: 0;
  padding: var(--template-spacing-lg) var(--template-spacing-xl);
  color: var(--template-text-secondary);
  text-decoration: none;
  border-bottom: var(--template-border-width-medium) solid transparent;
  transition: var(--template-transition-all);
}

.tab-item.active {
  color: var(--template-primary);
  border-bottom-color: var(--template-primary);
  font-weight: var(--template-font-weight-semibold);
}

.container {
  flex: 1;
  padding: var(--template-spacing-xl);
}

.subtitle {
  margin: 0;
  color: var(--template-text-secondary);
}
</style>
