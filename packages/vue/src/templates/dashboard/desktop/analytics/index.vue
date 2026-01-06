<script setup lang="ts">
/**
 * 桌面端 Dashboard 模板 - 分析型仪表盘
 * 
 * 特点：
 * - 专注于数据可视化
 * - 多维度数据展示
 * - 丰富的图表类型
 * - 适合数据分析场景
 */
import { ref, onMounted, computed, reactive } from 'vue'

interface ChartData {
  label: string
  value: number
  color?: string
}

interface Props {
  title?: string
  dateRange?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '数据分析',
  dateRange: '过去 30 天'
})

const mounted = ref(false)
const selectedPeriod = ref('month')

const periods = [
  { id: 'day', label: '今日' },
  { id: 'week', label: '本周' },
  { id: 'month', label: '本月' },
  { id: 'year', label: '全年' },
]

const kpiData = reactive([
  { id: '1', label: '总收入', value: '¥2,458,920', change: '+18.2%', isUp: true, icon: 'revenue' },
  { id: '2', label: '新增用户', value: '12,846', change: '+24.5%', isUp: true, icon: 'users' },
  { id: '3', label: '活跃度', value: '78.4%', change: '+5.2%', isUp: true, icon: 'activity' },
  { id: '4', label: '跳出率', value: '32.1%', change: '-8.6%', isUp: false, icon: 'bounce' },
])

const pieData = reactive([
  { label: '直接访问', value: 35, color: '#3b82f6' },
  { label: '搜索引擎', value: 28, color: '#10b981' },
  { label: '社交媒体', value: 22, color: '#f59e0b' },
  { label: '外链引用', value: 15, color: '#6366f1' },
])

const barData = reactive([
  { label: '周一', value: 120 },
  { label: '周二', value: 180 },
  { label: '周三', value: 150 },
  { label: '周四', value: 220 },
  { label: '周五', value: 280 },
  { label: '周六', value: 190 },
  { label: '周日', value: 140 },
])

const topProducts = reactive([
  { name: '产品 A', sales: 2840, growth: 12.5 },
  { name: '产品 B', sales: 2120, growth: 8.2 },
  { name: '产品 C', sales: 1680, growth: -3.4 },
  { name: '产品 D', sales: 1420, growth: 15.8 },
  { name: '产品 E', sales: 980, growth: 6.1 },
])

onMounted(() => {
  setTimeout(() => mounted.value = true, 50)
})

const maxBarValue = computed(() => Math.max(...barData.map(d => d.value)))

function getBarHeight(value: number) {
  return (value / maxBarValue.value) * 100
}

function getIconPath(icon: string) {
  const icons: Record<string, string> = {
    revenue: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    bounce: 'M9 10h.01M15 10h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 15s1.5 2 4 2 4-2 4-2'
  }
  return icons[icon] || icons.revenue
}
</script>

<template>
  <div class="analytics-dashboard">
    <!-- 顶部导航 -->
    <header class="header" :class="{ 'is-mounted': mounted }">
      <div class="header-left">
        <h1 class="page-title">{{ title }}</h1>
        <div class="breadcrumb">
          <span class="breadcrumb-item">首页</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span class="breadcrumb-item is-current">数据分析</span>
        </div>
      </div>
      <div class="header-right">
        <div class="period-tabs">
          <button
            v-for="period in periods"
            :key="period.id"
            class="period-tab"
            :class="{ 'is-active': selectedPeriod === period.id }"
            @click="selectedPeriod = period.id"
          >
            {{ period.label }}
          </button>
        </div>
        <button class="export-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          导出报表
        </button>
      </div>
    </header>

    <!-- KPI 卡片 -->
    <section class="kpi-section" :class="{ 'is-mounted': mounted }">
      <div 
        class="kpi-card" 
        v-for="(kpi, index) in kpiData" 
        :key="kpi.id"
        :style="{ animationDelay: `${index * 0.08}s` }"
      >
        <div class="kpi-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path :d="getIconPath(kpi.icon)" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-change" :class="{ 'is-up': kpi.isUp, 'is-down': !kpi.isUp }">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline v-if="kpi.isUp" points="18 15 12 9 6 15"/>
              <polyline v-else points="6 9 12 15 18 9"/>
            </svg>
            {{ kpi.change }}
          </div>
        </div>
        <div class="kpi-sparkline">
          <svg viewBox="0 0 80 30" preserveAspectRatio="none">
            <path 
              :d="kpi.isUp 
                ? 'M0 25 Q 10 22, 20 20 T 40 12 T 60 8 T 80 3' 
                : 'M0 5 Q 10 8, 20 10 T 40 18 T 60 22 T 80 27'"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="sparkline"
            />
          </svg>
        </div>
      </div>
    </section>

    <!-- 图表区域 -->
    <section class="charts-section" :class="{ 'is-mounted': mounted }">
      <div class="charts-grid">
        <!-- 趋势图 -->
        <div class="chart-card chart-card--main">
          <div class="card-header">
            <div class="card-header-left">
              <h3 class="card-title">流量趋势</h3>
              <span class="card-subtitle">{{ dateRange }}</span>
            </div>
            <div class="card-header-right">
              <div class="legend">
                <span class="legend-item"><i class="legend-dot primary"></i>访问量</span>
                <span class="legend-item"><i class="legend-dot success"></i>独立访客</span>
              </div>
            </div>
          </div>
          <div class="card-body">
            <slot name="trend-chart">
              <div class="trend-chart">
                <div class="chart-y-labels">
                  <span>800</span>
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                  <span>0</span>
                </div>
                <div class="chart-canvas">
                  <div class="chart-grid-lines">
                    <div class="grid-line" v-for="i in 5" :key="i"></div>
                  </div>
                  <svg class="chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
                      </linearGradient>
                      <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                    <!-- Primary line area -->
                    <path class="area primary" d="M0 180 C 50 160, 100 150, 150 120 S 250 100, 300 80 S 400 90, 450 50 S 550 60, 600 40 V 200 H 0 Z"/>
                    <path class="line primary" d="M0 180 C 50 160, 100 150, 150 120 S 250 100, 300 80 S 400 90, 450 50 S 550 60, 600 40"/>
                    <!-- Secondary line area -->
                    <path class="area success" d="M0 190 C 50 180, 100 170, 150 150 S 250 140, 300 120 S 400 130, 450 100 S 550 110, 600 90 V 200 H 0 Z"/>
                    <path class="line success" d="M0 190 C 50 180, 100 170, 150 150 S 250 140, 300 120 S 400 130, 450 100 S 550 110, 600 90"/>
                  </svg>
                  <div class="chart-x-labels">
                    <span v-for="day in ['1日', '5日', '10日', '15日', '20日', '25日', '30日']" :key="day">{{ day }}</span>
                  </div>
                </div>
              </div>
            </slot>
          </div>
        </div>

        <!-- 饼图 -->
        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">流量来源</h3>
          </div>
          <div class="card-body">
            <slot name="pie-chart">
              <div class="pie-chart">
                <div class="pie-visual">
                  <svg viewBox="0 0 100 100" class="pie-svg">
                    <circle 
                      v-for="(item, index) in pieData" 
                      :key="item.label"
                      class="pie-segment"
                      cx="50" cy="50" r="40"
                      :stroke="item.color"
                      :stroke-dasharray="`${item.value * 2.51} 251.2`"
                      :stroke-dashoffset="-pieData.slice(0, index).reduce((acc, d) => acc + d.value * 2.51, 0)"
                      :style="{ animationDelay: `${index * 0.1}s` }"
                    />
                    <circle class="pie-center" cx="50" cy="50" r="28"/>
                  </svg>
                  <div class="pie-center-text">
                    <span class="pie-total">100%</span>
                    <span class="pie-label">总计</span>
                  </div>
                </div>
                <div class="pie-legend">
                  <div class="legend-row" v-for="item in pieData" :key="item.label">
                    <span class="legend-color" :style="{ background: item.color }"></span>
                    <span class="legend-label">{{ item.label }}</span>
                    <span class="legend-value">{{ item.value }}%</span>
                  </div>
                </div>
              </div>
            </slot>
          </div>
        </div>

        <!-- 柱状图 -->
        <div class="chart-card">
          <div class="card-header">
            <h3 class="card-title">周访问量</h3>
            <button class="more-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
              </svg>
            </button>
          </div>
          <div class="card-body">
            <slot name="bar-chart">
              <div class="bar-chart">
                <div class="bar-container">
                  <div 
                    class="bar-wrapper" 
                    v-for="(item, index) in barData" 
                    :key="item.label"
                  >
                    <div class="bar-value">{{ item.value }}</div>
                    <div 
                      class="bar" 
                      :style="{ height: `${getBarHeight(item.value)}%`, animationDelay: `${index * 0.08}s` }"
                    >
                      <div class="bar-inner"></div>
                    </div>
                    <div class="bar-label">{{ item.label }}</div>
                  </div>
                </div>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据表格 -->
    <section class="table-section" :class="{ 'is-mounted': mounted }">
      <div class="table-card">
        <div class="card-header">
          <h3 class="card-title">热门产品</h3>
          <a href="#" class="view-all">查看全部 →</a>
        </div>
        <div class="card-body">
          <slot name="products-table">
            <table class="data-table">
              <thead>
                <tr>
                  <th>排名</th>
                  <th>产品名称</th>
                  <th>销售额</th>
                  <th>增长率</th>
                  <th>趋势</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in topProducts" :key="product.name">
                  <td>
                    <span class="rank-badge" :class="{ 'is-top': index < 3 }">{{ index + 1 }}</span>
                  </td>
                  <td>
                    <span class="product-name">{{ product.name }}</span>
                  </td>
                  <td>
                    <span class="sales-value">¥{{ product.sales.toLocaleString() }}</span>
                  </td>
                  <td>
                    <span class="growth-value" :class="{ 'is-positive': product.growth > 0, 'is-negative': product.growth < 0 }">
                      {{ product.growth > 0 ? '+' : '' }}{{ product.growth }}%
                    </span>
                  </td>
                  <td>
                    <div class="mini-chart">
                      <svg viewBox="0 0 60 20" preserveAspectRatio="none">
                        <path 
                          :d="product.growth > 0 
                            ? 'M0 18 Q 15 16, 30 10 T 60 2' 
                            : 'M0 2 Q 15 6, 30 12 T 60 18'"
                          fill="none"
                          :stroke="product.growth > 0 ? '#10b981' : '#ef4444'"
                          stroke-width="2"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </slot>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ========== Variables ========== */
.analytics-dashboard {
  --color-primary: #3b82f6;
  --color-primary-light: #dbeafe;
  --color-success: #10b981;
  --color-success-light: #d1fae5;
  --color-warning: #f59e0b;
  --color-warning-light: #fef3c7;
  --color-danger: #ef4444;
  --color-danger-light: #fee2e2;
  
  --color-bg: #f1f5f9;
  --color-surface: #ffffff;
  
  --color-text: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;
  
  --color-border: #e2e8f0;
  
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-hover: 0 10px 20px rgba(0, 0, 0, 0.08);
  
  --radius: 16px;
  --radius-sm: 10px;
  
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
  
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
  padding: 28px 32px;
}

/* Dark Mode */
:root[data-theme-mode="dark"] .analytics-dashboard,
.dark .analytics-dashboard {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #64748b;
  --color-border: #334155;Player
  --color-primary-light: rgba(59, 130, 246, 0.2);
  --color-success-light: rgba(16, 185, 129, 0.2);
}

/* ========== Header ========== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  opacity: 0;
  transform: translateY(-16px);
  transition: all 0.5s var(--ease-smooth);
}

.header.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-primary) 50%, var(--color-text) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleFlow 4s ease-in-out infinite;
}

@keyframes titleFlow {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.breadcrumb-item.is-current {
  color: var(--color-text-secondary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.period-tabs {
  display: flex;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  padding: 4px;
  box-shadow: var(--shadow-card);
}

.period-tab {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-tab:hover {
  color: var(--color-text-secondary);
}

.period-tab.is-active {
  color: var(--color-primary);
  background: var(--color-primary-light);
  animation: tabActive 0.3s var(--ease-spring);
}

@keyframes tabActive {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* ========== KPI Section ========== */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s var(--ease-smooth);
  transition-delay: 0.1s;
}

.kpi-section.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1200px) {
  .kpi-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .kpi-section {
    grid-template-columns: 1fr;
  }
}

.kpi-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  animation: kpiFadeIn 0.5s var(--ease-smooth) both;
  transition: all 0.3s var(--ease-spring);
}

.kpi-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: var(--shadow-hover);
}

@keyframes kpiFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.kpi-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 14px;
  transition: all 0.3s var(--ease-spring);
}

.kpi-card:hover .kpi-icon {
  transform: scale(1.1) rotate(-5deg);
}

.kpi-content {
  flex: 1;
  min-width: 0;
}

.kpi-label {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
  font-variant-numeric: tabular-nums;
}

.kpi-card:hover .kpi-value {
  animation: valuePop 0.3s var(--ease-spring);
}

@keyframes valuePop {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

.kpi-change {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.kpi-change.is-up {
  color: var(--color-success);
}

.kpi-change.is-down {
  color: var(--color-danger);
}

.kpi-sparkline {
  position: absolute;
  right: 24px;
  bottom: 16px;
  width: 80px;
  height: 30px;
  opacity: 0.3;
}

.kpi-sparkline .sparkline {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: sparklineReveal 1s ease forwards 0.5s;
}

@keyframes sparklineReveal {
  to { stroke-dashoffset: 0; }
}

.kpi-card:hover .kpi-sparkline {
  opacity: 0.6;
}

/* ========== Charts Section ========== */
.charts-section {
  margin-bottom: 28px;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s var(--ease-smooth);
  transition-delay: 0.2s;
}

.charts-section.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.charts-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 20px;
}

@media (max-width: 1400px) {
  .charts-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .chart-card--main {
    grid-column: span 2;
  }
}

@media (max-width: 900px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card--main {
    grid-column: span 1;
  }
}

.chart-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-3px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.card-header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.card-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
}

.legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.primary {
  background: var(--color-primary);
}

.legend-dot.success {
  background: var(--color-success);
}

.card-body {
  padding: 24px;
}

.more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.more-btn:hover {
  background: var(--color-bg);
  color: var(--color-text-secondary);
}

/* Trend Chart */
.trend-chart {
  display: flex;
  gap: 16px;
  height: 220px;
}

.chart-y-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-text-muted);
  padding-bottom: 24px;
}

.chart-canvas {
  flex: 1;
  position: relative;
}

.chart-grid-lines {
  position: absolute;
  inset: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-line {
  height: 1px;
  background: var(--color-border);
  opacity: 0.5;
}

.chart-svg {
  position: absolute;
  inset: 0 0 24px 0;
}

.chart-svg .area {
  opacity: 0;
  animation: areaFadeIn 0.8s ease forwards 0.3s;
}

.chart-svg .area.primary {
  fill: url(#primaryGradient);
}

.chart-svg .area.success {
  fill: url(#successGradient);
}

@keyframes areaFadeIn {
  to { opacity: 1; }
}

.chart-svg .line {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: lineDraw 1.5s ease forwards;
}

.chart-svg .line.primary {
  stroke: var(--color-primary);
}

.chart-svg .line.success {
  stroke: var(--color-success);
}

@keyframes lineDraw {
  to { stroke-dashoffset: 0; }
}

.chart-x-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-text-muted);
}

/* Pie Chart */
.pie-chart {
  display: flex;
  align-items: center;
  gap: 24px;
}

.pie-visual {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.pie-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.pie-segment {
  fill: none;
  stroke-width: 20;
  stroke-linecap: round;
  opacity: 0;
  animation: segmentReveal 0.5s ease forwards;
  transition: all 0.3s var(--ease-spring);
}

.pie-segment:hover {
  stroke-width: 24;
  filter: brightness(1.1);
}

@keyframes segmentReveal {
  to { opacity: 1; }
}

.pie-center {
  fill: var(--color-surface);
}

.pie-center-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-total {
  font-size: 20px;
  font-weight: 700;
}

.pie-label {
  font-size: 11px;
  color: var(--color-text-muted);
}

.pie-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.legend-label {
  flex: 1;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.legend-value {
  font-size: 13px;
  font-weight: 600;
}

/* Bar Chart */
.bar-chart {
  height: 200px;
}

.bar-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 100%;
  gap: 12px;
  padding-bottom: 28px;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-value {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
}

.bar-wrapper:hover .bar-value {
  opacity: 1;
  transform: translateY(0);
}

.bar {
  width: 100%;
  max-width: 40px;
  background: var(--color-primary-light);
  border-radius: 6px 6px 0 0;
  animation: barGrow 0.5s var(--ease-spring) both;
  overflow: hidden;
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

.bar-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, var(--color-primary), transparent);
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.bar-wrapper:hover .bar-inner {
  opacity: 1;
}

.bar-label {
  position: absolute;
  bottom: 0;
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 8px;
}

/* ========== Table Section ========== */
.table-section {
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s var(--ease-smooth);
  transition-delay: 0.3s;
}

.table-section.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.table-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
}

.view-all {
  font-size: 13px;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.view-all:hover {
  color: var(--color-text);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 16px;
  text-align: left;
}

.data-table th {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-border);
}

.data-table tbody tr {
  transition: background 0.2s ease;
}

.data-table tbody tr:hover {
  background: var(--color-bg);
}

.data-table tbody tr:not(:last-child) td {
  border-bottom: 1px solid var(--color-border);
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 12px;
  font-weight: 600;
  background: var(--color-bg);
  border-radius: 6px;
}

.rank-badge.is-top {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.product-name {
  font-weight: 500;
}

.sales-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.growth-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.growth-value.is-positive {
  color: var(--color-success);
}

.growth-value.is-negative {
  color: var(--color-danger);
}

.mini-chart {
  width: 60px;
  height: 20px;
}

.mini-chart svg {
  width: 100%;
  height: 100%;
}

.mini-chart path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: miniChartDraw 1s ease forwards;
}

@keyframes miniChartDraw {
  to { stroke-dashoffset: 0; }
}

/* 表格行动画 */
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

/* 排名徽章动画 */
.rank-badge {
  transition: all 0.3s var(--ease-spring);
}

.data-table tbody tr:hover .rank-badge {
  transform: scale(1.1);
}

.rank-badge.is-top {
  animation: topBadge 2s ease-in-out infinite;
}

@keyframes topBadge {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
  50% { box-shadow: 0 0 0 4px rgba(245, 158, 11, 0); }
}

/* KPI卡片边框 */
.kpi-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  box-shadow: inset 0 0 0 2px transparent;
  transition: box-shadow 0.3s;
  pointer-events: none;
}

.kpi-card:hover::after {
  box-shadow: inset 0 0 0 2px var(--color-primary-light);
}

/* 图例项动画 */
.legend-row {
  transition: all 0.2s ease;
  padding: 4px 8px;
  margin: -4px -8px;
  border-radius: 6px;
}

.legend-row:hover {
  background: var(--color-bg);
  transform: translateX(4px);
}

/* 柱状图悬停效果 */
.bar {
  transition: all 0.3s var(--ease-spring);
}

.bar-wrapper:hover .bar {
  transform: scaleY(1.05);
  transform-origin: bottom;
}
</style>
