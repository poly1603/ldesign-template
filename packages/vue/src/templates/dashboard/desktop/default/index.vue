<script setup lang="ts">
/**
 * 桌面端 Dashboard 模板 - 现代化数据仪表盘
 * 
 * 特点：
 * - 响应式卡片网格布局
 * - 优雅的数据展示动画
 * - 支持深色/浅色模式
 * - 统计卡片、图表区域、数据表格
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface StatCard {
  id: string
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon?: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

interface Props {
  title?: string
  subtitle?: string
  stats?: StatCard[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '数据概览',
  subtitle: '欢迎回来，这是您的数据概览',
  loading: false,
  stats: () => [
    { id: '1', title: '总用户数', value: '12,846', change: 12.5, changeType: 'increase', color: 'primary' },
    { id: '2', title: '活跃用户', value: '8,234', change: 8.2, changeType: 'increase', color: 'success' },
    { id: '3', title: '订单总额', value: '¥86,420', change: -2.4, changeType: 'decrease', color: 'warning' },
    { id: '4', title: '转化率', value: '24.8%', change: 4.1, changeType: 'increase', color: 'info' },
  ]
})

const mounted = ref(false)
const currentTime = ref('')
let timeInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  setTimeout(() => mounted.value = true, 50)
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
})

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

function getIconForStat(color: string) {
  const icons: Record<string, string> = {
    primary: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    success: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
    warning: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    danger: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
    info: 'M22 12h-4l-3 9L9 3l-3 9H2'
  }
  return icons[color] || icons.primary
}
</script>

<template>
  <div class="dashboard">
    <!-- 页面头部 -->
    <header class="dashboard-header" :class="{ 'is-mounted': mounted }">
      <div class="header-content">
        <div class="header-text">
          <h1 class="header-title">{{ title }}</h1>
          <p class="header-subtitle">{{ subtitle }}</p>
        </div>
        <div class="header-meta">
          <div class="time-display">
            <svg class="time-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span class="time-text">{{ currentTime }}</span>
          </div>
          <slot name="header-actions" />
        </div>
      </div>
    </header>

    <!-- 统计卡片 -->
    <section class="stats-section" :class="{ 'is-mounted': mounted }">
      <div class="stats-grid">
        <div 
          v-for="(stat, index) in stats" 
          :key="stat.id" 
          class="stat-card"
          :class="[`stat-card--${stat.color || 'primary'}`]"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="stat-card__header">
            <div class="stat-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path :d="getIconForStat(stat.color || 'primary')" />
              </svg>
            </div>
            <div class="stat-card__change" :class="stat.changeType">
              <svg v-if="stat.changeType === 'increase'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              <span>{{ Math.abs(stat.change || 0) }}%</span>
            </div>
          </div>
          <div class="stat-card__body">
            <div class="stat-card__value">{{ stat.value }}</div>
            <div class="stat-card__title">{{ stat.title }}</div>
          </div>
          <div class="stat-card__decoration">
            <svg viewBox="0 0 200 80" preserveAspectRatio="none">
              <path d="M0 80 Q 50 20, 100 50 T 200 30 L 200 80 Z" fill="currentColor" opacity="0.1"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- 主内容区 -->
    <section class="content-section" :class="{ 'is-mounted': mounted }">
      <div class="content-grid">
        <!-- 图表区域 -->
        <div class="chart-card chart-card--large">
          <div class="card-header">
            <h3 class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              数据趋势
            </h3>
            <div class="card-actions">
              <slot name="chart-actions">
                <button class="action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                  </svg>
                </button>
              </slot>
            </div>
          </div>
          <div class="card-body">
            <slot name="main-chart">
              <!-- 默认示意图表 -->
              <div class="chart-placeholder">
                <div class="chart-bars">
                  <div class="chart-bar" v-for="i in 12" :key="i" :style="{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.05}s` }"></div>
                </div>
                <div class="chart-line">
                  <svg viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path class="line-path" d="M0 80 Q 40 60, 80 70 T 160 40 T 240 55 T 320 25 T 400 35" fill="none" stroke="currentColor" stroke-width="2"/>
                    <path class="area-path" d="M0 80 Q 40 60, 80 70 T 160 40 T 240 55 T 320 25 T 400 35 L 400 100 L 0 100 Z" fill="currentColor" opacity="0.1"/>
                  </svg>
                </div>
              </div>
            </slot>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              快捷操作
            </h3>
          </div>
          <div class="card-body">
            <slot name="quick-actions">
              <div class="quick-actions">
                <button class="quick-action-btn" v-for="action in ['新建项目', '数据导出', '生成报表', '系统设置']" :key="action">
                  <span class="action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </span>
                  <span class="action-text">{{ action }}</span>
                </button>
              </div>
            </slot>
          </div>
        </div>

        <!-- 活动动态 -->
        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              最近动态
            </h3>
            <a href="#" class="card-link">查看全部</a>
          </div>
          <div class="card-body">
            <slot name="activities">
              <div class="activity-list">
                <div class="activity-item" v-for="i in 5" :key="i">
                  <div class="activity-dot"></div>
                  <div class="activity-content">
                    <div class="activity-title">用户 {{ ['张三', '李四', '王五', '赵六', '钱七'][i-1] }} 完成了新订单</div>
                    <div class="activity-time">{{ i * 5 }} 分钟前</div>
                  </div>
                </div>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据表格区域 -->
    <section class="table-section" :class="{ 'is-mounted': mounted }">
      <div class="table-card">
        <div class="card-header">
          <h3 class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            最新订单
          </h3>
          <div class="card-actions">
            <slot name="table-actions">
              <button class="btn btn--outline">导出数据</button>
              <button class="btn btn--primary">新建订单</button>
            </slot>
          </div>
        </div>
        <div class="card-body">
          <slot name="data-table">
            <div class="data-table">
              <table>
                <thead>
                  <tr>
                    <th>订单编号</th>
                    <th>客户名称</th>
                    <th>订单金额</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="i in 5" :key="i">
                    <td><span class="order-id">#ORD-{{ 10000 + i }}</span></td>
                    <td>
                      <div class="customer-info">
                        <div class="customer-avatar">{{ ['张', '李', '王', '赵', '钱'][i-1] }}</div>
                        <span>{{ ['张三', '李四', '王五', '赵六', '钱七'][i-1] }}</span>
                      </div>
                    </td>
                    <td><span class="amount">¥{{ (Math.random() * 10000).toFixed(2) }}</span></td>
                    <td>
                      <span class="status-badge" :class="['pending', 'completed', 'processing', 'cancelled', 'completed'][i-1]">
                        {{ ['待处理', '已完成', '处理中', '已取消', '已完成'][i-1] }}
                      </span>
                    </td>
                    <td class="time-cell">2024-01-{{ String(i).padStart(2, '0') }} 14:30</td>
                    <td>
                      <div class="table-actions">
                        <button class="table-action-btn" title="查看">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button class="table-action-btn" title="编辑">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </slot>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ========== CSS Variables ========== */
.dashboard {
  /* Colors */
  --color-primary: var(--color-primary-500, #3b82f6);
  --color-primary-light: var(--color-primary-100, #dbeafe);
  --color-primary-dark: var(--color-primary-700, #1d4ed8);
  
  --color-success: var(--color-success-500, #10b981);
  --color-success-light: var(--color-success-100, #d1fae5);
  
  --color-warning: var(--color-warning-500, #f59e0b);
  --color-warning-light: var(--color-warning-100, #fef3c7);
  
  --color-danger: var(--color-danger-500, #ef4444);
  --color-danger-light: var(--color-danger-100, #fee2e2);
  
  --color-info: var(--color-info-500, #06b6d4);
  --color-info-light: var(--color-info-100, #cffafe);
  
  --color-bg-page: #f8fafc;
  --color-bg-card: #ffffff;
  --color-bg-elevated: #ffffff;
  
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-text-quaternary: #cbd5e1;
  
  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Layout */
  --header-height: 80px;
  --section-gap: 24px;
  
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  min-height: 100vh;
  padding: var(--section-gap);
}

/* Dark Mode */
:root[data-theme-mode="dark"] .dashboard,
.dark .dashboard {
  --color-bg-page: #0f172a;
  --color-bg-card: #1e293b;
  --color-bg-elevated: #334155;
  
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #94a3b8;
  --color-text-quaternary: #64748b;
  
  --color-border: #334155;
  --color-border-light: #1e293b;
}

/* ========== Header ========== */
.dashboard-header {
  margin-bottom: var(--section-gap);
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.dashboard-header.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 4px;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, 
    var(--color-text-primary) 0%,
    var(--color-primary) 50%,
    var(--color-text-primary) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGradient 4s ease-in-out infinite;
}

@keyframes titleGradient {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 200% center;
  }
}

.header-subtitle {
  font-size: 14px;
  color: var(--color-text-tertiary);
  margin: 0;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

.time-icon {
  color: var(--color-text-tertiary);
}

.time-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

/* ========== Stats Section ========== */
.stats-section {
  margin-bottom: var(--section-gap);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.1s;
}

.stats-section.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Stat Card */
.stat-card {
  position: relative;
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  transition: all var(--transition-bounce);
  animation: cardFadeIn 0.5s ease both;
}

.stat-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
  box-shadow: inset 0 0 0 2px transparent;
  transition: box-shadow 0.3s;
  pointer-events: none;
}

.stat-card--primary:hover::after {
  box-shadow: inset 0 0 0 2px var(--color-primary);
}

.stat-card--success:hover::after {
  box-shadow: inset 0 0 0 2px var(--color-success);
}

.stat-card--warning:hover::after {
  box-shadow: inset 0 0 0 2px var(--color-warning);
}

.stat-card--info:hover::after {
  box-shadow: inset 0 0 0 2px var(--color-info);
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stat-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-bounce);
}

.stat-card:hover .stat-card__icon {
  transform: scale(1.1) rotate(-5deg);
}

.stat-card--primary .stat-card__icon {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.stat-card--success .stat-card__icon {
  background: var(--color-success-light);
  color: var(--color-success);
}

.stat-card--warning .stat-card__icon {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.stat-card--danger .stat-card__icon {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.stat-card--info .stat-card__icon {
  background: var(--color-info-light);
  color: var(--color-info);
}

.stat-card__change {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.stat-card__change.increase {
  background: var(--color-success-light);
  color: var(--color-success);
}

.stat-card__change.decrease {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.stat-card__body {
  position: relative;
  z-index: 1;
}

.stat-card__value {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.02em;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.stat-card:hover .stat-card__value {
  animation: valuePopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes valuePopIn {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.stat-card__title {
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.stat-card__decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  pointer-events: none;
}

.stat-card--primary .stat-card__decoration {
  color: var(--color-primary);
}

.stat-card--success .stat-card__decoration {
  color: var(--color-success);
}

.stat-card--warning .stat-card__decoration {
  color: var(--color-warning);
}

.stat-card--danger .stat-card__decoration {
  color: var(--color-danger);
}

.stat-card--info .stat-card__decoration {
  color: var(--color-info);
}

/* ========== Content Section ========== */
.content-section {
  margin-bottom: var(--section-gap);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.2s;
}

.content-section.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .chart-card--large {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card--large {
    grid-column: span 1;
  }
}

/* Chart Card */
.chart-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.chart-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border-light);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.card-title svg {
  color: var(--color-text-tertiary);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-link {
  font-size: 13px;
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.card-link:hover {
  color: var(--color-primary-dark);
}

.card-body {
  padding: 24px;
}

/* Action Button */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-bg-page);
  border-radius: var(--radius-md);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--color-border-light);
  color: var(--color-text-secondary);
}

/* Chart Placeholder */
.chart-placeholder {
  position: relative;
  height: 240px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  padding: 0 10px;
  gap: 12px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, var(--color-primary), var(--color-primary-light));
  border-radius: 6px 6px 0 0;
  animation: barGrow 0.6s ease both;
  opacity: 0.8;
  transition: all var(--transition-fast);
}

.chart-bar:hover {
  opacity: 1;
  transform: scaleY(1.05);
  transform-origin: bottom;
}

@keyframes barGrow {
  from {
    transform: scaleY(0);
    transform-origin: bottom;
  }
  to {
    transform: scaleY(1);
    transform-origin: bottom;
  }
}

.chart-line {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.chart-line svg {
  width: 100%;
  height: 100%;
}

.line-path {
  color: var(--color-primary);
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: lineDraw 1.5s ease forwards 0.5s;
}

.area-path {
  color: var(--color-primary);
}

@keyframes lineDraw {
  to {
    stroke-dashoffset: 0;
  }
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 16px;
  background: var(--color-bg-page);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-bounce);
}

.quick-action-btn:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  border-style: solid;
  transform: scale(1.02);
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  transition: all var(--transition-bounce);
}

.quick-action-btn:hover .action-icon {
  background: var(--color-primary);
  color: white;
  transform: rotate(-10deg) scale(1.15);
  box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.4);
}

.action-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-light);
  transition: all var(--transition-fast);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  padding-left: 8px;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  margin-top: 6px;
  flex-shrink: 0;
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
  }
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: 13px;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-time {
  font-size: 12px;
  color: var(--color-text-quaternary);
  margin-top: 2px;
}

/* ========== Table Section ========== */
.table-section {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.3s;
}

.table-section.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.table-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  overflow: hidden;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-bounce);
  border: none;
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn--outline {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.btn--outline:hover {
  background: var(--color-bg-page);
  border-color: var(--color-text-tertiary);
}

/* Data Table */
.data-table {
  overflow-x: auto;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.data-table th {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--color-bg-page);
}

.data-table tbody tr {
  transition: all var(--transition-fast);
}

.data-table tbody tr:hover {
  background: var(--color-bg-page);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.order-id {
  font-family: 'SF Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.amount {
  font-weight: 600;
  color: var(--color-text-primary);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.status-badge.completed {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-badge.processing {
  background: var(--color-info-light);
  color: var(--color-info);
}

.status-badge.cancelled {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.time-cell {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.table-actions {
  display: flex;
  gap: 4px;
}

.table-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.table-action-btn:hover {
  background: var(--color-bg-page);
  color: var(--color-primary);
  transform: scale(1.1);
}

/* 表格行悬停高亮 */
.data-table tbody tr {
  position: relative;
}

.data-table tbody tr::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-primary);
  transform: scaleY(0);
  transition: transform 0.2s ease;
}

.data-table tbody tr:hover::before {
  transform: scaleY(1);
}

/* 状态徽章动画 */
.status-badge {
  transition: all 0.2s ease;
}

.data-table tbody tr:hover .status-badge {
  transform: scale(1.05);
}

/* 时间显示动画 */
.time-display {
  animation: timeGlow 3s ease-in-out infinite;
}

@keyframes timeGlow {
  0%, 100% {
    box-shadow: var(--shadow-sm);
  }
  50% {
    box-shadow: var(--shadow-sm), 0 0 15px rgba(59, 130, 246, 0.1);
  }
}

/* 活动项动画增强 */
.activity-item {
  position: relative;
}

.activity-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--color-primary), transparent);
  transition: width 0.3s ease;
}

.activity-item:hover::after {
  width: 100%;
}

/* 卡片标题图标动画 */
.card-title svg {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chart-card:hover .card-title svg {
  color: var(--color-primary);
  transform: scale(1.1);
}

/* 底部装饰波浪动画 */
.stat-card__decoration svg {
  animation: waveFloat 3s ease-in-out infinite;
}

@keyframes waveFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* ========== 高级增强动画 ========== */

/* 卡片悬停光效 */
.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 40%,
    rgba(59, 130, 246, 0.08) 50%,
    transparent 60%
  );
  background-size: 250% 250%;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.stat-card:hover::before {
  opacity: 1;
  animation: cardShine 1.5s ease forwards;
}

@keyframes cardShine {
  from {
    background-position: 250% 250%;
  }
  to {
    background-position: -250% -250%;
  }
}

/* 图表卡片呼吸光效 */
.chart-card--large {
  position: relative;
}

.chart-card--large::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: calc(var(--radius-xl) + 1px);
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    transparent 40%,
    transparent 60%,
    var(--color-info) 100%
  );
  opacity: 0;
  z-index: -1;
  transition: opacity 0.4s;
}

.chart-card--large:hover::after {
  opacity: 0.3;
  animation: borderGlow 2s ease-in-out infinite;
}

@keyframes borderGlow {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}

/* 按钮浮动效果 */
.btn--primary {
  position: relative;
  overflow: hidden;
}

.btn--primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.btn--primary:hover::before {
  left: 100%;
}

/* 客户头像环形光效 */
.customer-avatar {
  position: relative;
}

.customer-avatar::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), transparent, var(--color-info));
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.data-table tbody tr:hover .customer-avatar::after {
  opacity: 1;
  animation: avatarRing 1s linear infinite;
}

@keyframes avatarRing {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 快捷操作按钮涟漪效果 */
.quick-action-btn {
  position: relative;
  overflow: hidden;
}

.quick-action-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.15);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.quick-action-btn:hover::after {
  width: 300%;
  height: 300%;
}

/* 时间显示数字滚动效果 */
.time-text {
  position: relative;
  overflow: hidden;
}

/* 活动列表项入场动画 */
.activity-item:nth-child(1) { animation: activitySlide 0.4s ease backwards 0.1s; }
.activity-item:nth-child(2) { animation: activitySlide 0.4s ease backwards 0.15s; }
.activity-item:nth-child(3) { animation: activitySlide 0.4s ease backwards 0.2s; }
.activity-item:nth-child(4) { animation: activitySlide 0.4s ease backwards 0.25s; }
.activity-item:nth-child(5) { animation: activitySlide 0.4s ease backwards 0.3s; }

@keyframes activitySlide {
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 数据表格行渐变背景 */
.data-table tbody tr:hover {
  background: linear-gradient(90deg, var(--color-bg-page) 0%, rgba(59, 130, 246, 0.05) 50%, var(--color-bg-page) 100%);
}

/* 订单金额脉冲效果 */
.data-table tbody tr:hover .amount {
  animation: amountPulse 0.5s ease;
}

@keyframes amountPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
    color: var(--color-primary);
  }
  100% {
    transform: scale(1);
  }
}

/* 统计变化指示器跳动 */
.stat-card__change svg {
  animation: trendJump 2s ease-in-out infinite;
}

.stat-card__change.increase svg {
  animation-delay: 0s;
}

.stat-card__change.decrease svg {
  animation-delay: 0.5s;
}

@keyframes trendJump {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(0);
  }
}

/* 图表柱子悬停发光 */
.chart-bar:hover {
  filter: drop-shadow(0 0 8px var(--color-primary));
}

/* 线条路径光点追踪 */
.line-path {
  filter: drop-shadow(0 0 3px var(--color-primary));
}

/* 卡片标题图标呼吸 */
.card-title svg {
  animation: iconBreath 3s ease-in-out infinite;
}

@keyframes iconBreath {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>
