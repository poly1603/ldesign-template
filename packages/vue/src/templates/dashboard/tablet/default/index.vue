<script setup lang="ts">
/**
 * 平板端 Dashboard 模板 - 默认样式
 * 
 * 特点：
 * - 平板设备优化的双栏布局
 * - 侧边导航 + 主内容区
 * - 触摸与键鼠双模式支持
 * - 充分利用屏幕空间
 */
import { ref, onMounted, reactive } from 'vue'

interface StatItem {
  id: string
  label: string
  value: string
  change?: string
  isUp?: boolean
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

interface Props {
  title?: string
  userName?: string
  stats?: StatItem[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '工作台',
  userName: '用户',
  stats: () => [
    { id: '1', label: '总收入', value: '¥248,920', change: '+12.5%', isUp: true, color: 'primary' },
    { id: '2', label: '订单数', value: '3,842', change: '+8.2%', isUp: true, color: 'success' },
    { id: '3', label: '活跃用户', value: '12.4K', change: '+15.3%', isUp: true, color: 'warning' },
    { id: '4', label: '转化率', value: '24.8%', change: '-2.1%', isUp: false, color: 'danger' },
  ]
})

const mounted = ref(false)
const sidebarCollapsed = ref(false)
const activeNav = ref('dashboard')

const navItems = [
  { id: 'dashboard', icon: 'grid', label: '仪表盘' },
  { id: 'analytics', icon: 'chart', label: '数据分析' },
  { id: 'orders', icon: 'list', label: '订单管理' },
  { id: 'users', icon: 'users', label: '用户管理' },
  { id: 'settings', icon: 'settings', label: '系统设置' },
]

const recentOrders = reactive([
  { id: 'ORD-001', customer: '张三', amount: '¥1,280', status: 'completed', time: '10分钟前' },
  { id: 'ORD-002', customer: '李四', amount: '¥860', status: 'pending', time: '25分钟前' },
  { id: 'ORD-003', customer: '王五', amount: '¥2,100', status: 'processing', time: '1小时前' },
  { id: 'ORD-004', customer: '赵六', amount: '¥450', status: 'completed', time: '2小时前' },
])

onMounted(() => {
  setTimeout(() => mounted.value = true, 50)
})

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function getNavIcon(icon: string) {
  const icons: Record<string, string> = {
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    chart: 'M18 20V10M12 20V4M6 20v-6',
    list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'
  }
  return icons[icon] || icons.grid
}
</script>

<template>
  <div class="tablet-dashboard" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'is-mounted': mounted }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <span class="logo-text" v-show="!sidebarCollapsed">LDesign</span>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline :points="sidebarCollapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'"/>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ 'is-active': activeNav === item.id }"
          @click="activeNav = item.id"
          :title="sidebarCollapsed ? item.label : undefined"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path :d="getNavIcon(item.icon)" />
          </svg>
          <span class="nav-label" v-show="!sidebarCollapsed">{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer" v-show="!sidebarCollapsed">
        <div class="user-info">
          <div class="user-avatar">{{ userName.charAt(0) }}</div>
          <div class="user-details">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">管理员</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部栏 -->
      <header class="header" :class="{ 'is-mounted': mounted }">
        <div class="header-left">
          <h1 class="page-title">{{ title }}</h1>
          <div class="breadcrumb">
            <span>首页</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span class="current">仪表盘</span>
          </div>
        </div>
        <div class="header-right">
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="搜索..." class="search-input">
          </div>
          <button class="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="badge">5</span>
          </button>
        </div>
      </header>

      <!-- 统计卡片 -->
      <section class="stats-section" :class="{ 'is-mounted': mounted }">
        <div 
          class="stat-card"
          v-for="(stat, index) in stats"
          :key="stat.id"
          :class="`stat-card--${stat.color}`"
          :style="{ animationDelay: `${index * 0.08}s` }"
        >
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value">{{ stat.value }}</div>
          </div>
          <div class="stat-change" :class="{ 'is-up': stat.isUp, 'is-down': !stat.isUp }">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline v-if="stat.isUp" points="18 15 12 9 6 15"/>
              <polyline v-else points="6 9 12 15 18 9"/>
            </svg>
            {{ stat.change }}
          </div>
        </div>
      </section>

      <!-- 内容网格 -->
      <section class="content-grid" :class="{ 'is-mounted': mounted }">
        <!-- 图表区域 -->
        <div class="card chart-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              收入趋势
            </h3>
            <div class="card-actions">
              <select class="period-select">
                <option>本周</option>
                <option>本月</option>
                <option>本年</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <slot name="chart">
              <div class="chart-area">
                <svg class="chart-svg" viewBox="0 0 500 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <path class="chart-fill" d="M0 160 Q 50 140, 100 130 T 200 90 T 300 100 T 400 50 T 500 60 V 180 H 0 Z"/>
                  <path class="chart-line" d="M0 160 Q 50 140, 100 130 T 200 90 T 300 100 T 400 50 T 500 60"/>
                </svg>
              </div>
            </slot>
          </div>
        </div>

        <!-- 最近订单 -->
        <div class="card orders-card">
          <div class="card-header">
            <h3 class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              最近订单
            </h3>
            <a href="#" class="view-all">查看全部</a>
          </div>
          <div class="card-body">
            <slot name="orders">
              <div class="orders-list">
                <div class="order-item" v-for="order in recentOrders" :key="order.id">
                  <div class="order-info">
                    <span class="order-id">{{ order.id }}</span>
                    <span class="order-customer">{{ order.customer }}</span>
                  </div>
                  <div class="order-amount">{{ order.amount }}</div>
                  <span class="order-status" :class="order.status">
                    {{ order.status === 'completed' ? '已完成' : order.status === 'pending' ? '待处理' : '处理中' }}
                  </span>
                  <span class="order-time">{{ order.time }}</span>
                </div>
              </div>
            </slot>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="card actions-card">
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
            <div class="quick-actions">
              <button class="quick-btn" v-for="action in ['创建订单', '添加用户', '导出报表', '系统设置']" :key="action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>{{ action }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* ========== Variables ========== */
.tablet-dashboard {
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 72px;
  --header-height: 72px;
  
  --color-primary: #3b82f6;
  --color-primary-soft: #dbeafe;
  --color-success: #10b981;
  --color-success-soft: #d1fae5;
  --color-warning: #f59e0b;
  --color-warning-soft: #fef3c7;
  --color-danger: #ef4444;
  --color-danger-soft: #fee2e2;
  
  --color-bg: #f1f5f9;
  --color-surface: #ffffff;
  --color-sidebar: #0f172a;
  
  --color-text: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;
  --color-text-inverse: #f1f5f9;
  
  --color-border: #e2e8f0;
  
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
  
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
  font-family: system-ui, -apple-system, sans-serif;
  color: var(--color-text);
}

/* Dark Mode */
:root[data-theme-mode="dark"] .tablet-dashboard,
.dark .tablet-dashboard {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-sidebar: #020617;
  --color-text: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #64748b;
  --color-border: #334155;
  --color-primary-soft: rgba(59, 130, 246, 0.2);
  --color-success-soft: rgba(16, 185, 129, 0.2);
  --color-warning-soft: rgba(245, 158, 11, 0.2);
  --color-danger-soft: rgba(239, 68, 68, 0.2);
}

/* ========== Sidebar ========== */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--color-sidebar);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.3s var(--ease-smooth);
  opacity: 0;
  transform: translateX(-20px);
}

.sidebar.is-mounted {
  opacity: 1;
  transform: translateX(0);
  transition: width 0.3s var(--ease-smooth), opacity 0.5s ease, transform 0.5s ease;
}

.sidebar-collapsed .sidebar {
  width: var(--sidebar-collapsed-width);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-sm);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-inverse);
  white-space: nowrap;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--color-text-inverse);
}

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-inverse);
}

.nav-item.is-active {
  background: var(--color-primary);
  color: white;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-inverse);
}

.user-role {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* ========== Main Content ========== */
.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: 24px;
  transition: margin-left 0.3s var(--ease-smooth);
}

.sidebar-collapsed .main-content {
  margin-left: var(--sidebar-collapsed-width);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(-16px);
  transition: all 0.5s var(--ease-smooth);
}

.header.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-primary) 50%, var(--color-text) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleShimmer 4s ease-in-out infinite;
}

@keyframes titleShimmer {
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

.breadcrumb .current {
  color: var(--color-text-secondary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  transition: all 0.3s var(--ease-spring);
}

.search-box:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.search-box:focus-within svg {
  color: var(--color-primary);
}

.search-input {
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  width: 200px;
  transition: width 0.3s var(--ease-smooth);
}

.search-input:focus {
  width: 260px;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.icon-btn .badge {
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: 600;
  color: white;
  background: var(--color-danger);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.icon-btn:hover .badge {
  animation: badgeShake 0.5s ease-in-out;
}

@keyframes badgeShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px) rotate(-5deg); }
  75% { transform: translateX(2px) rotate(5deg); }
}

/* ========== Stats Section ========== */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s var(--ease-smooth);
  transition-delay: 0.1s;
}

.stats-section.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1100px) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 20px;
  animation: cardFadeIn 0.5s var(--ease-smooth) both;
  transition: all 0.3s var(--ease-spring);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  transition: all 0.3s var(--ease-spring);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(-5deg);
}

.stat-card--primary .stat-icon {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.stat-card--success .stat-icon {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.stat-card--warning .stat-icon {
  background: var(--color-warning-soft);
  color: var(--color-warning);
}

.stat-card--danger .stat-icon {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
}

.stat-change.is-up {
  color: var(--color-success);
}

.stat-change.is-down {
  color: var(--color-danger);
}

.stat-change svg {
  animation: trendBounce 1s var(--ease-spring) infinite;
  animation-delay: 0.5s;
}

@keyframes trendBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* ========== Content Grid ========== */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s var(--ease-smooth);
  transition-delay: 0.2s;
}

.content-grid.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1100px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s var(--ease-spring);
  border: 1px solid transparent;
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.card-title svg {
  color: var(--color-text-muted);
}

.card-body {
  padding: 20px;
}

.view-all {
  font-size: 13px;
  color: var(--color-primary);
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

/* Period Select */
.period-select {
  padding: 8px 12px;
  font-size: 13px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  cursor: pointer;
}

/* Chart */
.chart-card {
  grid-row: span 2;
}

.chart-area {
  height: 280px;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.chart-fill {
  fill: url(#chartGradient);
  opacity: 0;
  animation: areaFadeIn 0.8s ease forwards 0.3s;
}

@keyframes areaFadeIn {
  to { opacity: 1; }
}

.chart-line {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: lineDraw 1.5s ease forwards;
}

@keyframes lineDraw {
  to { stroke-dashoffset: 0; }
}

/* Orders */
.orders-list {
  display: flex;
  flex-direction: column;
}

.order-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.2s ease;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item:hover {
  background: var(--color-bg);
  margin: 0 -20px;
  padding-left: 20px;
  padding-right: 20px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-id {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
}

.order-customer {
  font-size: 12px;
  color: var(--color-text-muted);
}

.order-amount {
  font-weight: 600;
}

.order-status {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
  text-align: center;
}

.order-status.completed {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.order-status.pending {
  background: var(--color-warning-soft);
  color: var(--color-warning);
}

.order-status.processing {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.order-status {
  transition: all 0.3s var(--ease-spring);
}

.order-item:hover .order-status {
  transform: scale(1.05);
}

.order-time {
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: right;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
}

.quick-btn:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  border-style: solid;
  color: var(--color-primary);
  transform: scale(1.02);
}

.quick-btn svg {
  transition: transform 0.3s var(--ease-spring);
}

.quick-btn:hover svg {
  transform: rotate(-90deg);
}

/* Logo 动画 */
.logo-icon {
  transition: all 0.3s var(--ease-spring);
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.logo-icon:hover {
  transform: scale(1.1) rotate(-5deg);
}

/* 导航项动画 */
.nav-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: white;
  border-radius: 0 3px 3px 0;
  animation: indicatorSlide 0.3s var(--ease-spring);
}

.nav-item {
  position: relative;
}

@keyframes indicatorSlide {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: 24px;
    opacity: 1;
  }
}

.nav-item.is-active svg {
  animation: navIconPop 0.3s var(--ease-spring);
}

@keyframes navIconPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* 用户头像动画 */
.user-avatar {
  transition: all 0.3s var(--ease-spring);
}

.user-info:hover .user-avatar {
  transform: scale(1.1);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

/* 数据卡片光晕 */
.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, transparent 40%, rgba(59, 130, 246, 0.05) 50%, transparent 60%);
  background-size: 200% 200%;
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-card {
  position: relative;
}

.stat-card:hover::before {
  opacity: 1;
  animation: cardShine 1.5s ease forwards;
}

@keyframes cardShine {
  from { background-position: 200% 200%; }
  to { background-position: -200% -200%; }
}

/* 订单项滑入 */
.order-item {
  animation: orderSlideIn 0.4s var(--ease-smooth) both;
}

.order-item:nth-child(1) { animation-delay: 0.1s; }
.order-item:nth-child(2) { animation-delay: 0.15s; }
.order-item:nth-child(3) { animation-delay: 0.2s; }
.order-item:nth-child(4) { animation-delay: 0.25s; }

@keyframes orderSlideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 侧边栏展开/收起动画 */
.collapse-btn svg {
  transition: transform 0.3s var(--ease-spring);
}

.sidebar-collapsed .collapse-btn svg {
  transform: rotate(180deg);
}

/* 折叠按钮悬停 */
.collapse-btn:active {
  transform: scale(0.9);
}

/* 快捷按钮交错动画 */
.quick-btn:nth-child(1) { animation-delay: 0.1s; }
.quick-btn:nth-child(2) { animation-delay: 0.15s; }
.quick-btn:nth-child(3) { animation-delay: 0.2s; }
.quick-btn:nth-child(4) { animation-delay: 0.25s; }

.quick-btn {
  animation: btnFadeIn 0.4s var(--ease-smooth) both;
}

@keyframes btnFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 图表线条光晕 */
.chart-line {
  filter: drop-shadow(0 0 3px var(--color-primary));
}

/* 面包屑动画 */
.breadcrumb span {
  transition: color 0.2s ease;
}

.breadcrumb span:hover {
  color: var(--color-primary);
}

.breadcrumb svg {
  transition: transform 0.2s ease;
}

.breadcrumb:hover svg {
  transform: translateX(2px);
}
</style>
