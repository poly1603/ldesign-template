<script setup lang="ts">
/**
 * 移动端 Dashboard 模板 - 默认样式
 * 
 * 特点：
 * - 针对移动设备优化的布局
 * - 触摸友好的交互设计
 * - 流畅的滑动动画
 * - 紧凑的信息展示
 */
import { ref, onMounted, computed } from 'vue'

interface StatItem {
  id: string
  label: string
  value: string
  change?: string
  isUp?: boolean
  icon?: string
}

interface Props {
  greeting?: string
  stats?: StatItem[]
}

const props = withDefaults(defineProps<Props>(), {
  greeting: '数据概览',
  stats: () => [
    { id: '1', label: '收入', value: '¥86.4K', change: '+12%', isUp: true },
    { id: '2', label: '订单', value: '1,284', change: '+8%', isUp: true },
    { id: '3', label: '用户', value: '5.2K', change: '-3%', isUp: false },
  ]
})

const mounted = ref(false)
const activeTab = ref('home')

const tabs = [
  { id: 'home', icon: 'home', label: '首页' },
  { id: 'chart', icon: 'chart', label: '统计' },
  { id: 'list', icon: 'list', label: '订单' },
  { id: 'user', icon: 'user', label: '我的' },
]

onMounted(() => {
  setTimeout(() => mounted.value = true, 50)
})

function getTabIcon(icon: string) {
  const icons: Record<string, string> = {
    home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
    chart: 'M18 20V10 M12 20V4 M6 20v-6',
    list: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8'
  }
  return icons[icon] || icons.home
}
</script>

<template>
  <div class="mobile-dashboard">
    <!-- 顶部栏 -->
    <header class="header" :class="{ 'is-mounted': mounted }">
      <div class="header-top">
        <h1 class="header-title">{{ greeting }}</h1>
        <button class="notification-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notification-badge">3</span>
        </button>
      </div>
    </header>

    <!-- 统计卡片滑动区域 -->
    <section class="stats-scroll" :class="{ 'is-mounted': mounted }">
      <div class="stats-track">
        <div 
          class="stat-card"
          v-for="(stat, index) in stats"
          :key="stat.id"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="stat-header">
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-change" :class="{ 'is-up': stat.isUp, 'is-down': !stat.isUp }">
              {{ stat.change }}
            </span>
          </div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-sparkline">
            <svg viewBox="0 0 60 20" preserveAspectRatio="none">
              <path 
                :d="stat.isUp ? 'M0 18 Q 15 14, 30 10 T 60 2' : 'M0 2 Q 15 8, 30 12 T 60 18'"
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- 快捷操作 -->
    <section class="quick-actions" :class="{ 'is-mounted': mounted }">
      <h2 class="section-title">快捷操作</h2>
      <div class="actions-grid">
        <button class="action-item" v-for="action in ['扫一扫', '收款', '转账', '更多']" :key="action">
          <div class="action-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <span class="action-text">{{ action }}</span>
        </button>
      </div>
    </section>

    <!-- 图表卡片 -->
    <section class="chart-section" :class="{ 'is-mounted': mounted }">
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">本周趋势</h3>
          <button class="chart-more">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
        <div class="chart-body">
          <slot name="chart">
            <div class="mini-bars">
              <div 
                class="mini-bar" 
                v-for="(h, i) in [40, 65, 45, 80, 55, 70, 50]" 
                :key="i"
                :style="{ height: `${h}%`, animationDelay: `${i * 0.05}s` }"
              >
                <span class="bar-label">{{ ['一', '二', '三', '四', '五', '六', '日'][i] }}</span>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </section>

    <!-- 最近动态 -->
    <section class="activity-section" :class="{ 'is-mounted': mounted }">
      <div class="section-header">
        <h2 class="section-title">最近动态</h2>
        <a href="#" class="view-more">查看全部</a>
      </div>
      <div class="activity-list">
        <slot name="activities">
          <div class="activity-item" v-for="i in 4" :key="i">
            <div class="activity-avatar">
              <span>{{ ['张', '李', '王', '赵'][i-1] }}</span>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ ['订单已完成', '新用户注册', '收到付款', '订单发货'][i-1] }}</div>
              <div class="activity-time">{{ i * 10 }} 分钟前</div>
            </div>
            <div class="activity-amount" v-if="i % 2 === 1">
              +¥{{ (Math.random() * 1000).toFixed(0) }}
            </div>
          </div>
        </slot>
      </div>
    </section>

    <!-- 底部导航 -->
    <nav class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ 'is-active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path :d="getTabIcon(tab.icon)" />
        </svg>
        <span class="tab-label">{{ tab.label }}</span>
        <span class="tab-indicator" v-if="activeTab === tab.id"></span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
/* ========== Variables ========== */
.mobile-dashboard {
  --color-primary: #3b82f6;
  --color-primary-soft: #dbeafe;
  --color-success: #10b981;
  --color-danger: #ef4444;
  
  --color-bg: #f5f5f7;
  --color-surface: #ffffff;
  
  --color-text: #1c1c1e;
  --color-text-secondary: #636366;
  --color-text-muted: #aeaeb2;
  
  --color-border: #e5e5ea;
  
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --tab-bar-height: calc(60px + var(--safe-bottom));
  
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
  
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
  padding-bottom: var(--tab-bar-height);
  -webkit-font-smoothing: antialiased;
}

/* Dark Mode */
:root[data-theme-mode="dark"] .mobile-dashboard,
.dark .mobile-dashboard {
  --color-bg: #000000;
  --color-surface: #1c1c1e;
  --color-text: #ffffff;
  --color-text-secondary: #98989d;
  --color-text-muted: #636366;
  --color-border: #38383a;
  --color-primary-soft: rgba(59, 130, 246, 0.2);
}

/* ========== Header ========== */
.header {
  background: var(--color-surface);
  padding: 16px 20px;
  padding-top: calc(16px + env(safe-area-inset-top, 0px));
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.5s var(--ease-smooth);
}

.header.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
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

.notification-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-bg);
  border: none;
  border-radius: 50%;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-btn:active {
  transform: scale(0.95);
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
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
  50% { transform: scale(1.1); }
}

/* ========== Stats Scroll ========== */
.stats-scroll {
  padding: 16px 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s var(--ease-smooth);
  transition-delay: 0.1s;
}

.stats-scroll::-webkit-scrollbar {
  display: none;
}

.stats-scroll.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.stats-track {
  display: flex;
  gap: 12px;
  padding: 0 20px;
}

.stat-card {
  flex-shrink: 0;
  width: 140px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 16px;
  animation: cardPop 0.5s var(--ease-spring) both;
}

@keyframes cardPop {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.stat-change {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.stat-change.is-up {
  color: var(--color-success);
  background: rgba(16, 185, 129, 0.1);
}

.stat-change.is-down {
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  font-variant-numeric: tabular-nums;
}

.stat-sparkline {
  height: 20px;
  color: var(--color-primary);
}

.stat-sparkline svg {
  width: 100%;
  height: 100%;
}

.stat-sparkline path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: sparklineDraw 1s ease forwards 0.3s;
}

@keyframes sparklineDraw {
  to { stroke-dashoffset: 0; }
}

/* ========== Quick Actions ========== */
.quick-actions {
  padding: 0 20px 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s var(--ease-smooth);
  transition-delay: 0.15s;
}

.quick-actions.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 12px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-item:active {
  transform: scale(0.95);
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: all 0.3s var(--ease-spring);
}

.action-item:active .action-icon {
  transform: scale(0.9);
}

/* 波纹效果 */
.action-icon {
  position: relative;
  overflow: hidden;
}

.action-icon::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.action-item:active .action-icon::after {
  opacity: 1;
}

.action-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* ========== Chart Section ========== */
.chart-section {
  padding: 0 20px 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s var(--ease-smooth);
  transition-delay: 0.2s;
}

.chart-section.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.chart-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.chart-more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  border-radius: 50%;
  cursor: pointer;
}

.chart-more:active {
  background: var(--color-bg);
}

.chart-body {
  padding: 20px 16px;
}

.mini-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
  gap: 8px;
}

.mini-bar {
  flex: 1;
  background: linear-gradient(to top, var(--color-primary), var(--color-primary-soft));
  border-radius: 6px 6px 0 0;
  position: relative;
  animation: barGrow 0.5s var(--ease-spring) both;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.mini-bar:active {
  transform: scaleY(1.05);
  transform-origin: bottom;
  filter: brightness(1.1);
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

.bar-label {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: var(--color-text-muted);
}

/* ========== Activity Section ========== */
.activity-section {
  padding: 0 20px 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s var(--ease-smooth);
  transition-delay: 0.25s;
}

.activity-section.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.view-more {
  font-size: 13px;
  color: var(--color-primary);
  text-decoration: none;
}

.activity-list {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.2s ease;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:active {
  background: var(--color-bg);
}

.activity-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-soft), var(--color-primary));
  color: white;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 13px;
  color: var(--color-text-muted);
}

.activity-amount {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-success);
}

/* ========== Tab Bar ========== */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  height: var(--tab-bar-height);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding-bottom: var(--safe-bottom);
}

.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item.is-active {
  color: var(--color-primary);
}

.tab-item.is-active svg {
  animation: tabIconBounce 0.3s var(--ease-spring);
}

@keyframes tabIconBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.tab-item:active {
  transform: scale(0.95);
}

.tab-label {
  font-size: 10px;
  font-weight: 500;
}

.tab-indicator {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: var(--color-primary);
  border-radius: 0 0 3px 3px;
  animation: indicatorPop 0.3s var(--ease-spring);
}

@keyframes indicatorPop {
  from {
    transform: translateX(-50%) scaleX(0);
  }
  to {
    transform: translateX(-50%) scaleX(1);
  }
}

/* 卡片触摸反馈 */
.stat-card {
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.stat-card:active {
  transform: scale(0.97);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 活动项动画 */
.activity-avatar {
  transition: all 0.3s var(--ease-spring);
}

.activity-item:active .activity-avatar {
  transform: scale(1.1);
}

/* 金额数字动画 */
.activity-amount {
  font-variant-numeric: tabular-nums;
}

/* 图表卡片悬停 */
.chart-card {
  transition: all 0.3s ease;
}

.chart-card:active {
  transform: scale(0.99);
}

/* 标题下划线 */
.section-title {
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 24px;
  height: 3px;
  background: var(--color-primary);
  border-radius: 2px;
}

/* ========== 高级增强动画 ========== */

/* 统计卡片光效 */
.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 30%,
    rgba(59, 130, 246, 0.1) 50%,
    transparent 70%
  );
  background-size: 200% 200%;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-card:active::before {
  opacity: 1;
  animation: cardFlash 0.4s ease;
}

@keyframes cardFlash {
  from {
    background-position: 100% 100%;
  }
  to {
    background-position: -100% -100%;
  }
}

/* 通知按钮光环 */
.notification-btn::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-danger));
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s;
}

.notification-btn:active::before {
  opacity: 0.3;
  animation: notifyPulse 0.5s ease;
}

@keyframes notifyPulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* 柱状图发光效果 */
.mini-bar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, transparent 0%, rgba(255, 255, 255, 0.3) 100%);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s;
}

.mini-bar:active::before {
  opacity: 1;
}

/* 柱状图顶部光点 */
.mini-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  opacity: 0;
  box-shadow: 0 0 8px var(--color-primary), 0 0 16px var(--color-primary);
}

.mini-bar:active::after {
  opacity: 1;
  animation: dotPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes dotPop {
  from {
    transform: translateX(-50%) scale(0);
  }
  to {
    transform: translateX(-50%) scale(1);
  }
}

/* 活动列表项滑入动画 */
.activity-item:nth-child(1) { animation: activityIn 0.35s ease backwards 0.05s; }
.activity-item:nth-child(2) { animation: activityIn 0.35s ease backwards 0.1s; }
.activity-item:nth-child(3) { animation: activityIn 0.35s ease backwards 0.15s; }
.activity-item:nth-child(4) { animation: activityIn 0.35s ease backwards 0.2s; }

@keyframes activityIn {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 快捷操作按钮涟漪 */
.action-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  opacity: 0;
  transform: scale(0);
  transition: all 0.4s ease;
}

.action-item {
  position: relative;
}

.action-item:active::before {
  opacity: 1;
  transform: scale(2);
}

/* 底部导航指示器光晕 */
.tab-indicator {
  box-shadow: 0 0 8px var(--color-primary), 0 0 16px rgba(59, 130, 246, 0.3);
}

/* 金额数字渐变 */
.activity-amount {
  background: linear-gradient(135deg, var(--color-success), #22c55e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 滑动卡片抖动提示 */
.stats-scroll {
  animation: scrollHint 2s ease-in-out 1s;
}

@keyframes scrollHint {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-3px);
  }
}

/* 图表卡片边框光效 */
.chart-card {
  position: relative;
}

.chart-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: calc(var(--radius-lg) + 1px);
  background: linear-gradient(135deg, var(--color-primary), transparent, var(--color-success));
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s;
}

.chart-card:active::before {
  opacity: 0.3;
}

/* 头像呼吸动画 */
.activity-avatar {
  animation: avatarBreath 3s ease-in-out infinite;
}

@keyframes avatarBreath {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0);
  }
}

/* 柱状图颜色渐变增强 */
.mini-bar {
  position: relative;
  background: linear-gradient(
    to top,
    var(--color-primary) 0%,
    rgba(59, 130, 246, 0.8) 40%,
    rgba(59, 130, 246, 0.5) 70%,
    var(--color-primary-soft) 100%
  );
}
</style>
