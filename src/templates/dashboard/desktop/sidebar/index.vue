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
  title: '侧边栏仪表板',
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
  <div class="dashboard-desktop-sidebar">
    <header class="dashboard-header">
      <!-- Header 左侧：Logo和标题 -->
      <div class="header-left">
        <slot name="logo">
          <h1>{{ title }}</h1>
        </slot>
      </div>

      <!-- Header 右侧：功能区 -->
      <div class="header-right">
        <slot name="header-actions">
          <div class="user-info">
            <span>{{ username }}</span>
          </div>
        </slot>

        <!-- 模板选择器 - 放在右上角 -->
        <TemplateSelector v-if="selector && selector.enabled" v-bind="selector.props.value"
          @select="selector.onSelect" />
      </div>
    </header>

    <div class="dashboard-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <slot name="sidebar">
          <nav class="nav-menu">
            <a href="#" class="nav-item active">概览</a>
            <a href="#" class="nav-item">数据分析</a>
            <a href="#" class="nav-item">报表</a>
            <a href="#" class="nav-item">设置</a>
          </nav>
        </slot>
      </aside>

      <!-- 主内容 -->
      <main class="main-content">
        <!-- 统计卡片 -->
        <slot name="stats">
          <div class="stats-grid">
            <div class="stat-card">
              <h3>总访问量</h3>
              <p class="stat-value">{{ stats.visits }}</p>
            </div>
            <div class="stat-card">
              <h3>活跃用户</h3>
              <p class="stat-value">{{ stats.users }}</p>
            </div>
            <div class="stat-card">
              <h3>订单数</h3>
              <p class="stat-value">{{ stats.orders }}</p>
            </div>
            <div class="stat-card">
              <h3>收入</h3>
              <p class="stat-value">¥{{ stats.revenue }}</p>
            </div>
          </div>
        </slot>

        <!-- 主内容区域 -->
        <div class="content-area">
          <slot>
            <p>这里是仪表板的主要内容区域</p>
          </slot>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-desktop-sidebar {
  min-height: 100vh;
  background: var(--template-dashboard-content-bg);
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--template-spacing-2xl);
  height: var(--template-dashboard-header-height);
  background: var(--template-dashboard-header-bg);
  border-bottom: var(--template-border-width-thin) solid var(--template-border-light);
  position: sticky;
  top: 0;
  z-index: var(--template-z-sticky);
}

.header-left {
  display: flex;
  align-items: center;
}

.dashboard-header h1 {
  margin: 0;
  font-size: var(--template-font-xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--template-spacing-lg);
}

.user-info {
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
}

.dashboard-content {
  display: flex;
  flex: 1;
  min-height: calc(100vh - var(--template-dashboard-header-height));
}

.sidebar {
  width: var(--template-dashboard-sidebar-width);
  background: var(--template-dashboard-sidebar-bg);
  border-right: var(--template-border-width-thin) solid var(--template-border-light);
  flex-shrink: 0;
}

.nav-menu {
  padding: var(--template-spacing-xl) 0;
}

.nav-item {
  display: block;
  padding: var(--template-spacing-lg) var(--template-spacing-2xl);
  color: var(--template-text-secondary);
  text-decoration: none;
  transition: var(--template-transition-all);
}

.nav-item:hover,
.nav-item.active {
  color: var(--template-primary);
  background: var(--template-primary-lighter);
}

.main-content {
  flex: 1;
  padding: var(--template-spacing-2xl);
  overflow-y: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--template-spacing-2xl);
  margin-bottom: var(--template-spacing-2xl);
}

.stat-card {
  padding: var(--template-dashboard-card-padding);
  background: var(--template-dashboard-card-bg);
  border-radius: var(--template-dashboard-card-radius);
  box-shadow: var(--template-dashboard-card-shadow);
}

.stat-card h3 {
  margin: 0 0 var(--template-spacing-lg);
  font-size: var(--template-font-base);
  font-weight: var(--template-font-weight-medium);
  color: var(--template-text-secondary);
}

.stat-value {
  margin: 0;
  font-size: var(--template-font-h1);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
}

.content-area {
  background: var(--template-dashboard-card-bg);
  border-radius: var(--template-dashboard-card-radius);
  box-shadow: var(--template-dashboard-card-shadow);
  min-height: 400px;
}
</style>
