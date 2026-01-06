<script setup lang="ts">
/**
 * 桌面端 Dashboard 模板 - 极简风格
 * 
 * 特点：
 * - 简约清爽的设计风格
 * - 大量留白与呼吸感
 * - 精致的微交互动画
 * - 专注于核心数据展示
 */
import { ref, onMounted, computed } from 'vue'

interface MetricCard {
  id: string
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

interface Props {
  greeting?: string
  userName?: string
  metrics?: MetricCard[]
}

const props = withDefaults(defineProps<Props>(), {
  greeting: '欢迎回来',
  userName: '用户',
  metrics: () => [
    { id: '1', label: '收入', value: '¥128,420', trend: 'up', trendValue: '+12.5%' },
    { id: '2', label: '订单', value: '1,284', trend: 'up', trendValue: '+8.2%' },
    { id: '3', label: '访客', value: '42.5K', trend: 'down', trendValue: '-3.1%' },
    { id: '4', label: '转化', value: '3.24%', trend: 'neutral', trendValue: '0.0%' },
  ]
})

const mounted = ref(false)
const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: '概览' },
  { id: 'analytics', label: '分析' },
  { id: 'reports', label: '报表' },
]

onMounted(() => {
  setTimeout(() => mounted.value = true, 50)
})

const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})
</script>

<template>
  <div class="dashboard-minimal">
    <!-- 顶部区域 -->
    <header class="header" :class="{ 'is-mounted': mounted }">
      <div class="header-left">
        <div class="greeting">
          <h1 class="greeting-text">{{ greeting }}，<span class="user-name">{{ userName }}</span></h1>
          <p class="date-text">{{ currentDate }}</p>
        </div>
      </div>
      <div class="header-right">
        <slot name="header-actions">
          <button class="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="notification-dot"></span>
          </button>
          <button class="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </slot>
      </div>
    </header>

    <!-- 标签导航 -->
    <nav class="tab-nav" :class="{ 'is-mounted': mounted }">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ 'is-active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
        <span class="tab-indicator" v-if="activeTab === tab.id"></span>
      </button>
    </nav>

    <!-- 指标卡片 -->
    <section class="metrics-section" :class="{ 'is-mounted': mounted }">
      <div 
        class="metric-card" 
        v-for="(metric, index) in metrics" 
        :key="metric.id"
        :style="{ animationDelay: `${index * 0.08}s` }"
      >
        <div class="metric-header">
          <span class="metric-label">{{ metric.label }}</span>
          <span class="metric-trend" :class="metric.trend">
            <svg v-if="metric.trend === 'up'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
            </svg>
            <svg v-else-if="metric.trend === 'down'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {{ metric.trendValue }}
          </span>
        </div>
        <div class="metric-value">{{ metric.value }}</div>
        <div class="metric-sparkline">
          <svg viewBox="0 0 100 30" preserveAspectRatio="none">
            <path 
              class="sparkline-path"
              :d="metric.trend === 'up' 
                ? 'M0 25 Q 20 20, 40 18 T 70 10 T 100 5' 
                : metric.trend === 'down' 
                  ? 'M0 5 Q 20 10, 40 12 T 70 20 T 100 25'
                  : 'M0 15 Q 25 12, 50 15 T 100 15'"
            />
          </svg>
        </div>
      </div>
    </section>

    <!-- 主内容区 -->
    <section class="main-content" :class="{ 'is-mounted': mounted }">
      <div class="content-row">
        <!-- 主图表 -->
        <div class="panel panel--chart">
          <div class="panel-header">
            <h2 class="panel-title">数据趋势</h2>
            <div class="panel-actions">
              <slot name="chart-controls">
                <div class="period-selector">
                  <button class="period-btn is-active">周</button>
                  <button class="period-btn">月</button>
                  <button class="period-btn">年</button>
                </div>
              </slot>
            </div>
          </div>
          <div class="panel-body">
            <slot name="main-chart">
              <div class="chart-area">
                <!-- 坐标轴 -->
                <div class="chart-y-axis">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                <!-- 图表主体 -->
                <div class="chart-main">
                  <div class="chart-grid">
                    <div class="grid-line" v-for="i in 5" :key="i"></div>
                  </div>
                  <svg class="chart-svg" viewBox="0 0 700 200" preserveAspectRatio="none">
                    <!-- Area fill -->
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="currentColor" stop-opacity="0.2"/>
                        <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                    <path 
                      class="area-fill"
                      d="M0 180 Q 50 160, 100 150 T 200 100 T 300 120 T 400 60 T 500 80 T 600 40 T 700 50 L 700 200 L 0 200 Z"
                    />
                    <path 
                      class="line-stroke"
                      d="M0 180 Q 50 160, 100 150 T 200 100 T 300 120 T 400 60 T 500 80 T 600 40 T 700 50"
                    />
                    <!-- Data points -->
                    <circle class="data-point" cx="0" cy="180" r="4"/>
                    <circle class="data-point" cx="100" cy="150" r="4"/>
                    <circle class="data-point" cx="200" cy="100" r="4"/>
                    <circle class="data-point" cx="300" cy="120" r="4"/>
                    <circle class="data-point" cx="400" cy="60" r="4"/>
                    <circle class="data-point" cx="500" cy="80" r="4"/>
                    <circle class="data-point" cx="600" cy="40" r="4"/>
                    <circle class="data-point" cx="700" cy="50" r="4"/>
                  </svg>
                  <div class="chart-x-axis">
                    <span v-for="day in ['周一', '周二', '周三', '周四', '周五', '周六', '周日']" :key="day">{{ day }}</span>
                  </div>
                </div>
              </div>
            </slot>
          </div>
        </div>

        <!-- 侧边栏 -->
        <aside class="sidebar">
          <!-- 待办事项 -->
          <div class="panel panel--tasks">
            <div class="panel-header">
              <h2 class="panel-title">待办事项</h2>
              <button class="add-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
            <div class="panel-body">
              <slot name="tasks">
                <div class="task-list">
                  <label class="task-item" v-for="i in 4" :key="i">
                    <input type="checkbox" class="task-checkbox" :checked="i === 1">
                    <span class="task-checkmark"></span>
                    <span class="task-text" :class="{ 'is-done': i === 1 }">
                      {{ ['完成季度报表', '审核新功能设计', '与团队同步进度', '更新产品文档'][i-1] }}
                    </span>
                  </label>
                </div>
              </slot>
            </div>
          </div>

          <!-- 最近活动 -->
          <div class="panel panel--activity">
            <div class="panel-header">
              <h2 class="panel-title">最近活动</h2>
            </div>
            <div class="panel-body">
              <slot name="activities">
                <div class="activity-timeline">
                  <div class="timeline-item" v-for="i in 4" :key="i">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <p class="timeline-text">{{ ['系统更新完成', '新用户注册', '订单已发货', '收到新反馈'][i-1] }}</p>
                      <span class="timeline-time">{{ ['刚刚', '5分钟前', '1小时前', '3小时前'][i-1] }}</span>
                    </div>
                  </div>
                </div>
              </slot>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ========== Variables ========== */
.dashboard-minimal {
  --color-accent: #18181b;
  --color-accent-soft: #3f3f46;
  --color-success: #22c55e;
  --color-danger: #ef4444;
  --color-neutral: #a1a1aa;
  
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  
  --color-text: #18181b;
  --color-text-secondary: #71717a;
  --color-text-muted: #a1a1aa;
  
  --color-border: #e4e4e7;
  --color-border-subtle: #f4f4f5;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);
  
  --radius: 12px;
  --radius-sm: 8px;
  
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-elastic: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
  padding: 32px 40px;
}

/* Dark Mode */
:root[data-theme-mode="dark"] .dashboard-minimal,
.dark .dashboard-minimal {
  --color-accent: #ffffff;
  --color-accent-soft: #a1a1aa;
  --color-bg: #09090b;
  --color-surface: #18181b;
  --color-text: #fafafa;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  --color-border: #27272a;
  --color-border-subtle: #18181b;
}

/* ========== Header ========== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(-16px);
  transition: all 0.6s var(--ease-out-expo);
}

.header.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.greeting-text {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}

.user-name {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-soft), var(--color-accent));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: nameShimmer 4s ease-in-out infinite;
}

@keyframes nameShimmer {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 200% center;
  }
}

.date-text {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

.header-right {
  display: flex;
  gap: 8px;
}

.icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: var(--color-danger);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

/* ========== Tab Navigation ========== */
.tab-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.6s var(--ease-out-expo);
  transition-delay: 0.1s;
}

.tab-nav.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.tab-btn {
  position: relative;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--color-text-secondary);
  background: var(--color-border-subtle);
}

.tab-btn.is-active {
  color: var(--color-text);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.tab-btn:active {
  transform: scale(0.97);
}

.tab-indicator {
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 16px;
  height: 2px;
  background: var(--color-accent);
  border-radius: 1px;
  transform: translateX(-50%);
  animation: indicatorIn 0.35s var(--ease-elastic);
}

@keyframes indicatorIn {
  from { transform: translateX(-50%) scaleX(0); }
  to { transform: translateX(-50%) scaleX(1); }
}

/* ========== Metrics Section ========== */
.metrics-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.6s var(--ease-out-expo);
  transition-delay: 0.15s;
}

.metrics-section.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1200px) {
  .metrics-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .metrics-section {
    grid-template-columns: 1fr;
  }
}

.metric-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius);
  padding: 24px;
  overflow: hidden;
  animation: cardReveal 0.5s var(--ease-out-expo) both;
  transition: all 0.3s var(--ease-elastic);
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border);
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.metric-trend.up {
  color: var(--color-success);
}

.metric-trend.down {
  color: var(--color-danger);
}

.metric-trend.neutral {
  color: var(--color-neutral);
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  font-variant-numeric: tabular-nums;
}

.metric-card:hover .metric-value {
  animation: valueBounceTiny 0.3s var(--ease-elastic);
}

@keyframes valueBounceTiny {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

.metric-sparkline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  opacity: 0.5;
}

.metric-sparkline svg {
  width: 100%;
  height: 100%;
}

.sparkline-path {
  fill: none;
  stroke: var(--color-border);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 150;
  stroke-dashoffset: 150;
  animation: sparklineDraw 1s ease forwards 0.5s;
}

@keyframes sparklineDraw {
  to {
    stroke-dashoffset: 0;
  }
}

.metric-card:hover .sparkline-path {
  stroke: var(--color-accent-soft);
}

/* ========== Main Content ========== */
.main-content {
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.6s var(--ease-out-expo);
  transition-delay: 0.2s;
}

.main-content.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.content-row {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

@media (max-width: 1200px) {
  .content-row {
    grid-template-columns: 1fr;
  }
}

/* Panel */
.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border-subtle);
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.panel-body {
  padding: 24px;
}

/* Period Selector */
.period-selector {
  display: flex;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  padding: 4px;
}

.period-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn:hover {
  color: var(--color-text-secondary);
}

.period-btn.is-active {
  color: var(--color-text);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

/* Chart Area */
.chart-area {
  display: flex;
  gap: 16px;
  height: 280px;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-text-muted);
  padding: 0 8px 24px 0;
}

.chart-main {
  flex: 1;
  position: relative;
}

.chart-grid {
  position: absolute;
  inset: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-line {
  height: 1px;
  background: var(--color-border-subtle);
}

.chart-svg {
  position: absolute;
  inset: 0 0 24px 0;
  color: var(--color-accent);
}

.area-fill {
  fill: url(#areaGradient);
  animation: areaReveal 1s ease forwards;
}

@keyframes areaReveal {
  from { opacity: 0; }
  to { opacity: 1; }
}

.line-stroke {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: lineReveal 1.5s ease forwards;
}

@keyframes lineReveal {
  to { stroke-dashoffset: 0; }
}

.data-point {
  fill: var(--color-surface);
  stroke: currentColor;
  stroke-width: 2;
  opacity: 0;
  animation: pointReveal 0.3s ease forwards;
  animation-delay: 1s;
}

@keyframes pointReveal {
  to { opacity: 1; }
}

.chart-x-axis {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-text-muted);
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Add Button */
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px dashed var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  border-style: solid;
  border-color: var(--color-accent);
  color: var(--color-text);
  transform: rotate(90deg) scale(1.1);
  box-shadow: var(--shadow-sm);
}

/* Task List */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin: 0 -12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: var(--color-bg);
}

.task-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.task-checkmark {
  position: relative;
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.task-checkbox:checked + .task-checkmark {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.task-checkmark::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 5px;
  width: 4px;
  height: 7px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform 0.2s var(--ease-elastic);
}

.task-checkbox:checked + .task-checkmark::after {
  transform: rotate(45deg) scale(1);
}

.task-text {
  font-size: 14px;
  color: var(--color-text);
  transition: all 0.2s ease;
}

.task-text.is-done {
  color: var(--color-text-muted);
  text-decoration: line-through;
}

/* 任务勾选动画 */
.task-item:hover .task-checkmark {
  border-color: var(--color-accent-soft);
  transform: scale(1.1);
}

.task-checkbox:checked ~ .task-text {
  animation: taskComplete 0.3s ease;
}

@keyframes taskComplete {
  0% { opacity: 1; }
  50% { opacity: 0.5; transform: translateX(5px); }
  100% { opacity: 1; transform: translateX(0); }
}

/* Activity Timeline */
.activity-timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 32px;
  bottom: 0;
  width: 1px;
  background: var(--color-border-subtle);
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
  flex-shrink: 0;
  margin-top: 4px;
  transition: all 0.2s ease;
}

.timeline-item:hover .timeline-dot {
  background: var(--color-accent);
  transform: scale(1.2);
}

.timeline-content {
  flex: 1;
  min-width: 0;
}

.timeline-text {
  font-size: 14px;
  color: var(--color-text);
  margin: 0 0 4px;
}

.timeline-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* 时间线项悬停效果 */
.timeline-item {
  transition: all 0.2s ease;
}

.timeline-item:hover {
  padding-left: 8px;
}

.timeline-item:hover .timeline-content {
  transform: translateX(4px);
}

.timeline-content {
  transition: transform 0.2s ease;
}

/* 面板悬停效果 */
.panel {
  transition: all 0.3s ease;
}

.panel:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* 图表数据点悬停 */
.data-point {
  transition: all 0.2s var(--ease-elastic);
}

.chart-svg:hover .data-point {
  r: 6;
}

.data-point:hover {
  r: 8 !important;
  filter: drop-shadow(0 0 6px currentColor);
}

/* 周期按钮动画 */
.period-btn {
  transition: all 0.2s var(--ease-elastic);
}

.period-btn.is-active {
  animation: periodActive 0.3s var(--ease-elastic);
}

@keyframes periodActive {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* 指标卡片边框发光 */
.metric-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  box-shadow: inset 0 0 0 1px transparent;
  transition: box-shadow 0.3s;
  pointer-events: none;
}

.metric-card:hover::after {
  box-shadow: inset 0 0 0 1px var(--color-accent-soft);
}
</style>
