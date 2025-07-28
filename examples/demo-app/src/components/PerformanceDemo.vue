<template>
  <div class="performance-demo">
    <div class="demo-header">
      <h2>📊 性能监控演示</h2>
      <p>实时监控模板系统的性能指标，优化用户体验</p>
    </div>

    <div class="row">
      <!-- 性能指标卡片 -->
      <div class="col-3 col-sm-6">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ metrics.loadTime }}ms</div>
            <div class="metric-label">加载时间</div>
            <div class="metric-trend" :class="getTrendClass(metrics.loadTimeTrend)">
              <i :class="getTrendIcon(metrics.loadTimeTrend)"></i>
              {{ metrics.loadTimeTrend }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-3 col-sm-6">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-paint-brush"></i>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ metrics.renderTime }}ms</div>
            <div class="metric-label">渲染时间</div>
            <div class="metric-trend" :class="getTrendClass(metrics.renderTimeTrend)">
              <i :class="getTrendIcon(metrics.renderTimeTrend)"></i>
              {{ metrics.renderTimeTrend }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-3 col-sm-6">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-memory"></i>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ metrics.memoryUsage }}MB</div>
            <div class="metric-label">内存使用</div>
            <div class="metric-trend" :class="getTrendClass(metrics.memoryTrend)">
              <i :class="getTrendIcon(metrics.memoryTrend)"></i>
              {{ metrics.memoryTrend }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-3 col-sm-6">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-tachometer-alt"></i>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ metrics.fps }}</div>
            <div class="metric-label">FPS</div>
            <div class="metric-trend" :class="getTrendClass(metrics.fpsTrend)">
              <i :class="getTrendIcon(metrics.fpsTrend)"></i>
              {{ metrics.fpsTrend }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <!-- 性能图表 -->
      <div class="col-8 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h3>📈 性能趋势图</h3>
            <div class="chart-controls">
              <select v-model="selectedMetric" class="form-control form-control-sm">
                <option value="loadTime">加载时间</option>
                <option value="renderTime">渲染时间</option>
                <option value="memoryUsage">内存使用</option>
                <option value="fps">FPS</option>
              </select>
              <button @click="clearChart" class="btn btn-sm btn-outline">
                <i class="fas fa-trash"></i>
                清空
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas ref="performanceChart" width="600" height="300"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- 性能分析 -->
      <div class="col-4 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h3>🔍 性能分析</h3>
          </div>
          <div class="card-body">
            <div class="analysis-section">
              <h4>瓶颈分析</h4>
              <div class="bottleneck-list">
                <div 
                  v-for="bottleneck in bottlenecks" 
                  :key="bottleneck.id"
                  class="bottleneck-item"
                  :class="bottleneck.severity"
                >
                  <div class="bottleneck-icon">
                    <i :class="bottleneck.icon"></i>
                  </div>
                  <div class="bottleneck-content">
                    <div class="bottleneck-title">{{ bottleneck.title }}</div>
                    <div class="bottleneck-desc">{{ bottleneck.description }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="analysis-section">
              <h4>优化建议</h4>
              <div class="suggestions-list">
                <div 
                  v-for="suggestion in suggestions" 
                  :key="suggestion.id"
                  class="suggestion-item"
                >
                  <div class="suggestion-icon">
                    <i class="fas fa-lightbulb"></i>
                  </div>
                  <div class="suggestion-content">
                    <div class="suggestion-title">{{ suggestion.title }}</div>
                    <div class="suggestion-desc">{{ suggestion.description }}</div>
                    <div class="suggestion-impact">
                      预期提升: {{ suggestion.impact }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <!-- 实时监控 -->
      <div class="col-6 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h3>⚡ 实时监控</h3>
            <div class="monitoring-controls">
              <button 
                @click="toggleMonitoring" 
                :class="isMonitoring ? 'btn-danger' : 'btn-success'"
                class="btn btn-sm"
              >
                <i :class="isMonitoring ? 'fas fa-stop' : 'fas fa-play'"></i>
                {{ isMonitoring ? '停止' : '开始' }}
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="monitoring-status">
              <div class="status-indicator" :class="{ active: isMonitoring }">
                <div class="pulse"></div>
              </div>
              <div class="status-text">
                {{ isMonitoring ? '正在监控...' : '监控已停止' }}
              </div>
            </div>

            <div class="real-time-metrics">
              <div class="real-time-item">
                <span class="metric-name">CPU 使用率:</span>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: `${realTimeMetrics.cpu}%` }"></div>
                </div>
                <span class="metric-value">{{ realTimeMetrics.cpu }}%</span>
              </div>

              <div class="real-time-item">
                <span class="metric-name">内存使用率:</span>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: `${realTimeMetrics.memory}%` }"></div>
                </div>
                <span class="metric-value">{{ realTimeMetrics.memory }}%</span>
              </div>

              <div class="real-time-item">
                <span class="metric-name">网络延迟:</span>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: `${realTimeMetrics.network}%` }"></div>
                </div>
                <span class="metric-value">{{ realTimeMetrics.networkLatency }}ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 性能报告 -->
      <div class="col-6 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h3>📋 性能报告</h3>
            <button @click="generateReport" class="btn btn-sm btn-primary">
              <i class="fas fa-file-alt"></i>
              生成报告
            </button>
          </div>
          <div class="card-body">
            <div class="report-summary">
              <div class="summary-item">
                <div class="summary-label">总体评分</div>
                <div class="summary-score" :class="getScoreClass(performanceScore)">
                  {{ performanceScore }}/100
                </div>
              </div>

              <div class="summary-item">
                <div class="summary-label">测试时长</div>
                <div class="summary-value">{{ formatDuration(testDuration) }}</div>
              </div>

              <div class="summary-item">
                <div class="summary-label">样本数量</div>
                <div class="summary-value">{{ sampleCount }}</div>
              </div>
            </div>

            <div class="report-details">
              <h4>详细指标</h4>
              <div class="detail-list">
                <div class="detail-item">
                  <span class="detail-name">平均加载时间:</span>
                  <span class="detail-value">{{ averageMetrics.loadTime }}ms</span>
                </div>
                <div class="detail-item">
                  <span class="detail-name">平均渲染时间:</span>
                  <span class="detail-value">{{ averageMetrics.renderTime }}ms</span>
                </div>
                <div class="detail-item">
                  <span class="detail-name">平均内存使用:</span>
                  <span class="detail-value">{{ averageMetrics.memoryUsage }}MB</span>
                </div>
                <div class="detail-item">
                  <span class="detail-name">平均FPS:</span>
                  <span class="detail-value">{{ averageMetrics.fps }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, inject } from 'vue'

// 注入通知函数
const showNotification = inject('showNotification') as Function

// 性能指标
const metrics = reactive({
  loadTime: 0,
  renderTime: 0,
  memoryUsage: 0,
  fps: 60,
  loadTimeTrend: '+5%',
  renderTimeTrend: '-2%',
  memoryTrend: '+1%',
  fpsTrend: '+3%'
})

// 实时监控
const isMonitoring = ref(false)
const realTimeMetrics = reactive({
  cpu: 0,
  memory: 0,
  network: 0,
  networkLatency: 0
})

// 图表相关
const selectedMetric = ref('loadTime')
const performanceChart = ref<HTMLCanvasElement>()

// 性能分析
const bottlenecks = ref([
  {
    id: 1,
    title: '模板加载缓慢',
    description: '某些模板加载时间超过200ms',
    severity: 'warning',
    icon: 'fas fa-exclamation-triangle'
  },
  {
    id: 2,
    title: '内存使用偏高',
    description: '缓存占用内存较多，建议清理',
    severity: 'info',
    icon: 'fas fa-info-circle'
  }
])

const suggestions = ref([
  {
    id: 1,
    title: '启用模板预加载',
    description: '预加载常用模板可以显著提升加载速度',
    impact: '30-50%'
  },
  {
    id: 2,
    title: '优化图片资源',
    description: '压缩模板中的图片资源，减少加载时间',
    impact: '20-30%'
  },
  {
    id: 3,
    title: '使用CDN加速',
    description: '将静态资源部署到CDN，提升全球访问速度',
    impact: '40-60%'
  }
])

// 性能报告
const performanceScore = ref(85)
const testDuration = ref(0)
const sampleCount = ref(0)
const averageMetrics = reactive({
  loadTime: 0,
  renderTime: 0,
  memoryUsage: 0,
  fps: 0
})

// 监控定时器
let monitoringInterval: number | null = null
let testStartTime = 0

// 方法
const getTrendClass = (trend: string) => {
  return trend.startsWith('+') ? 'trend-up' : 'trend-down'
}

const getTrendIcon = (trend: string) => {
  return trend.startsWith('+') ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
}

const getScoreClass = (score: number) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 70) return 'score-good'
  if (score >= 50) return 'score-fair'
  return 'score-poor'
}

const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)
  return `${minutes}分${seconds}秒`
}

const toggleMonitoring = () => {
  if (isMonitoring.value) {
    stopMonitoring()
  } else {
    startMonitoring()
  }
}

const startMonitoring = () => {
  isMonitoring.value = true
  testStartTime = Date.now()
  sampleCount.value = 0
  
  monitoringInterval = setInterval(() => {
    updateMetrics()
    updateRealTimeMetrics()
    sampleCount.value++
    testDuration.value = Date.now() - testStartTime
  }, 1000)
  
  showNotification('success', '性能监控已开始')
}

const stopMonitoring = () => {
  isMonitoring.value = false
  
  if (monitoringInterval) {
    clearInterval(monitoringInterval)
    monitoringInterval = null
  }
  
  calculateAverages()
  showNotification('info', '性能监控已停止')
}

const updateMetrics = () => {
  // 模拟性能数据更新
  metrics.loadTime = Math.floor(Math.random() * 100) + 50
  metrics.renderTime = Math.floor(Math.random() * 50) + 10
  metrics.memoryUsage = Math.floor(Math.random() * 20) + 10
  metrics.fps = Math.floor(Math.random() * 20) + 50
  
  // 更新趋势
  const trends = ['+5%', '-2%', '+3%', '-1%', '+7%', '-4%']
  metrics.loadTimeTrend = trends[Math.floor(Math.random() * trends.length)]
  metrics.renderTimeTrend = trends[Math.floor(Math.random() * trends.length)]
  metrics.memoryTrend = trends[Math.floor(Math.random() * trends.length)]
  metrics.fpsTrend = trends[Math.floor(Math.random() * trends.length)]
}

const updateRealTimeMetrics = () => {
  realTimeMetrics.cpu = Math.floor(Math.random() * 30) + 20
  realTimeMetrics.memory = Math.floor(Math.random() * 40) + 30
  realTimeMetrics.network = Math.floor(Math.random() * 50) + 10
  realTimeMetrics.networkLatency = Math.floor(Math.random() * 100) + 20
}

const calculateAverages = () => {
  // 模拟计算平均值
  averageMetrics.loadTime = Math.floor(Math.random() * 80) + 60
  averageMetrics.renderTime = Math.floor(Math.random() * 40) + 15
  averageMetrics.memoryUsage = Math.floor(Math.random() * 15) + 12
  averageMetrics.fps = Math.floor(Math.random() * 10) + 55
}

const clearChart = () => {
  showNotification('info', '图表数据已清空')
}

const generateReport = () => {
  // 模拟生成报告
  performanceScore.value = Math.floor(Math.random() * 30) + 70
  
  const reportData = {
    score: performanceScore.value,
    duration: testDuration.value,
    samples: sampleCount.value,
    metrics: averageMetrics,
    bottlenecks: bottlenecks.value,
    suggestions: suggestions.value
  }
  
  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  showNotification('success', '性能报告已生成并下载')
}

// 生命周期
onMounted(() => {
  updateMetrics()
  
  // 模拟初始化图表
  if (performanceChart.value) {
    const ctx = performanceChart.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f8f9fa'
      ctx.fillRect(0, 0, 600, 300)
      ctx.fillStyle = '#6c757d'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('性能趋势图', 300, 150)
      ctx.font = '12px Arial'
      ctx.fillText('(模拟数据)', 300, 170)
    }
  }
})

onUnmounted(() => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval)
  }
})
</script>

<style scoped>
.performance-demo {
  animation: fadeIn 0.5s ease-out;
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.demo-header h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 2rem;
}

.demo-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.metric-trend {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend-up {
  color: #dc3545;
}

.trend-down {
  color: #28a745;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
}

.analysis-section {
  margin-bottom: 2rem;
}

.analysis-section h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1rem;
}

.bottleneck-item,
.suggestion-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.bottleneck-item {
  border-left: 4px solid #ffc107;
  background: #fff3cd;
}

.bottleneck-item.warning {
  border-color: #ffc107;
  background: #fff3cd;
}

.bottleneck-item.info {
  border-color: #17a2b8;
  background: #d1ecf1;
}

.suggestion-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.bottleneck-icon,
.suggestion-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
}

.bottleneck-title,
.suggestion-title {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.25rem;
}

.bottleneck-desc,
.suggestion-desc {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.suggestion-impact {
  font-size: 0.75rem;
  color: #28a745;
  font-weight: 500;
}

.monitoring-controls {
  display: flex;
  gap: 0.5rem;
}

.monitoring-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.status-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6c757d;
  position: relative;
}

.status-indicator.active {
  background: #28a745;
}

.status-indicator.active .pulse {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  background: #28a745;
  opacity: 0.3;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}

.status-text {
  font-weight: 500;
  color: #495057;
}

.real-time-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.metric-name {
  min-width: 80px;
  font-size: 0.9rem;
  color: #495057;
}

.metric-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  transition: width 0.3s ease;
}

.metric-value {
  min-width: 60px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
}

.report-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.summary-score {
  font-size: 1.5rem;
  font-weight: bold;
}

.score-excellent {
  color: #28a745;
}

.score-good {
  color: #20c997;
}

.score-fair {
  color: #ffc107;
}

.score-poor {
  color: #dc3545;
}

.summary-value {
  font-size: 1.2rem;
  font-weight: 500;
  color: #495057;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f3f4;
}

.detail-name {
  color: #6c757d;
  font-size: 0.9rem;
}

.detail-value {
  color: #495057;
  font-weight: 500;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .metric-card {
    flex-direction: column;
    text-align: center;
  }
  
  .chart-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .monitoring-status {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .real-time-item {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .metric-name {
    min-width: auto;
  }
  
  .report-summary {
    grid-template-columns: 1fr;
  }
}
</style>
