<template>
  <div class="advanced-demo">
    <div class="demo-header">
      <h2>🔥 高级功能演示</h2>
      <p>探索模板系统的高级特性：缓存管理、性能监控、主题定制等</p>
    </div>

    <!-- 功能选项卡 -->
    <div class="feature-tabs">
      <button 
        v-for="tab in featureTabs" 
        :key="tab.id"
        @click="activeFeature = tab.id"
        :class="{ active: activeFeature === tab.id }"
        class="feature-tab"
      >
        <i :class="tab.icon"></i>
        {{ tab.name }}
      </button>
    </div>

    <!-- 缓存管理 -->
    <div v-if="activeFeature === 'cache'" class="feature-section">
      <div class="row">
        <div class="col-6 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h3>💾 缓存管理</h3>
            </div>
            <div class="card-body">
              <div class="cache-controls">
                <button @click="clearCache" class="btn btn-danger btn-sm">
                  <i class="fas fa-trash"></i>
                  清空缓存
                </button>
                <button @click="preloadTemplates" class="btn btn-primary btn-sm">
                  <i class="fas fa-download"></i>
                  预加载模板
                </button>
                <button @click="getCacheStats" class="btn btn-secondary btn-sm">
                  <i class="fas fa-chart-bar"></i>
                  缓存统计
                </button>
              </div>

              <div class="cache-stats mt-3">
                <h4>缓存统计</h4>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-label">缓存大小</div>
                    <div class="stat-value">{{ cacheStats.size || 0 }} 个</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">命中率</div>
                    <div class="stat-value">{{ cacheStats.hitRate || 0 }}%</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">最后更新</div>
                    <div class="stat-value">{{ cacheStats.lastUpdate || '未知' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h3>📊 缓存详情</h3>
            </div>
            <div class="card-body">
              <div class="cache-list">
                <div v-if="cacheItems.length === 0" class="no-cache">
                  暂无缓存数据
                </div>
                <div 
                  v-for="item in cacheItems" 
                  :key="item.key"
                  class="cache-item"
                >
                  <div class="cache-key">{{ item.key }}</div>
                  <div class="cache-meta">
                    <span class="cache-size">{{ item.size }}</span>
                    <span class="cache-time">{{ item.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 性能监控 -->
    <div v-if="activeFeature === 'performance'" class="feature-section">
      <div class="row">
        <div class="col-4 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h3>⚡ 性能指标</h3>
            </div>
            <div class="card-body">
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-icon">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div class="metric-info">
                    <div class="metric-label">加载时间</div>
                    <div class="metric-value">{{ performanceMetrics.loadTime }}ms</div>
                    <div class="metric-trend" :class="getLoadTimeTrend()">
                      <i :class="getLoadTimeTrendIcon()"></i>
                      {{ performanceMetrics.loadTimeTrend }}
                    </div>
                  </div>
                </div>

                <div class="metric-card">
                  <div class="metric-icon">
                    <i class="fas fa-paint-brush"></i>
                  </div>
                  <div class="metric-info">
                    <div class="metric-label">渲染时间</div>
                    <div class="metric-value">{{ performanceMetrics.renderTime }}ms</div>
                    <div class="metric-trend" :class="getRenderTimeTrend()">
                      <i :class="getRenderTimeTrendIcon()"></i>
                      {{ performanceMetrics.renderTimeTrend }}
                    </div>
                  </div>
                </div>

                <div class="metric-card">
                  <div class="metric-icon">
                    <i class="fas fa-memory"></i>
                  </div>
                  <div class="metric-info">
                    <div class="metric-label">内存使用</div>
                    <div class="metric-value">{{ performanceMetrics.memoryUsage }}MB</div>
                    <div class="metric-trend" :class="getMemoryTrend()">
                      <i :class="getMemoryTrendIcon()"></i>
                      {{ performanceMetrics.memoryTrend }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-8 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h3>📈 性能趋势</h3>
            </div>
            <div class="card-body">
              <div class="chart-container">
                <canvas ref="performanceChart" width="600" height="300"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主题定制 -->
    <div v-if="activeFeature === 'theme'" class="feature-section">
      <div class="row">
        <div class="col-6 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h3>🎨 主题编辑器</h3>
            </div>
            <div class="card-body">
              <div class="theme-editor">
                <div class="form-group">
                  <label>主色调</label>
                  <div class="color-input-group">
                    <input v-model="customTheme.primaryColor" type="color" class="color-input" />
                    <input v-model="customTheme.primaryColor" type="text" class="form-control" />
                  </div>
                </div>

                <div class="form-group">
                  <label>背景色</label>
                  <div class="color-input-group">
                    <input v-model="customTheme.backgroundColor" type="color" class="color-input" />
                    <input v-model="customTheme.backgroundColor" type="text" class="form-control" />
                  </div>
                </div>

                <div class="form-group">
                  <label>文字色</label>
                  <div class="color-input-group">
                    <input v-model="customTheme.textColor" type="color" class="color-input" />
                    <input v-model="customTheme.textColor" type="text" class="form-control" />
                  </div>
                </div>

                <div class="form-group">
                  <label>字体大小: {{ customTheme.fontSize }}px</label>
                  <input 
                    v-model="customTheme.fontSize" 
                    type="range" 
                    min="12" 
                    max="20" 
                    class="range-input"
                  />
                </div>

                <div class="form-group">
                  <label>圆角大小: {{ customTheme.borderRadius }}px</label>
                  <input 
                    v-model="customTheme.borderRadius" 
                    type="range" 
                    min="0" 
                    max="20" 
                    class="range-input"
                  />
                </div>

                <div class="theme-actions">
                  <button @click="applyTheme" class="btn btn-primary">
                    <i class="fas fa-check"></i>
                    应用主题
                  </button>
                  <button @click="resetTheme" class="btn btn-secondary">
                    <i class="fas fa-undo"></i>
                    重置
                  </button>
                  <button @click="exportTheme" class="btn btn-success">
                    <i class="fas fa-download"></i>
                    导出
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h3>👀 主题预览</h3>
            </div>
            <div class="card-body">
              <div class="theme-preview" :style="getThemeStyles()">
                <div class="preview-content">
                  <h3>预览标题</h3>
                  <p>这是一段预览文字，用来展示主题效果。</p>
                  <button class="preview-button">预览按钮</button>
                  <div class="preview-card">
                    <h4>卡片标题</h4>
                    <p>卡片内容预览</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误处理 -->
    <div v-if="activeFeature === 'error'" class="feature-section">
      <div class="row">
        <div class="col-6 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h3>⚠️ 错误模拟</h3>
            </div>
            <div class="card-body">
              <div class="error-controls">
                <button @click="simulateNetworkError" class="btn btn-warning">
                  <i class="fas fa-wifi"></i>
                  网络错误
                </button>
                <button @click="simulateTemplateError" class="btn btn-warning">
                  <i class="fas fa-file-excel"></i>
                  模板错误
                </button>
                <button @click="simulateRenderError" class="btn btn-warning">
                  <i class="fas fa-bug"></i>
                  渲染错误
                </button>
              </div>

              <div class="fallback-config mt-3">
                <h4>降级配置</h4>
                <div class="form-group">
                  <label>
                    <input v-model="fallbackConfig.enableFallback" type="checkbox" />
                    启用自动降级
                  </label>
                </div>
                <div class="form-group">
                  <label>重试次数</label>
                  <input 
                    v-model.number="fallbackConfig.retryCount" 
                    type="number" 
                    min="0" 
                    max="5" 
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label>重试延迟(ms)</label>
                  <input 
                    v-model.number="fallbackConfig.retryDelay" 
                    type="number" 
                    min="100" 
                    max="5000" 
                    step="100" 
                    class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6 col-sm-12">
          <div class="card">
            <div class="card-header">
              <h3>📋 错误日志</h3>
              <button @click="clearErrorLog" class="btn btn-sm btn-outline">
                <i class="fas fa-trash"></i>
                清空
              </button>
            </div>
            <div class="card-body">
              <div class="error-log">
                <div v-if="errorLog.length === 0" class="no-errors">
                  暂无错误记录
                </div>
                <div 
                  v-for="(error, index) in errorLog" 
                  :key="index"
                  class="error-item"
                >
                  <div class="error-time">{{ error.time }}</div>
                  <div class="error-type">{{ error.type }}</div>
                  <div class="error-message">{{ error.message }}</div>
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
import { ref, reactive, inject, onMounted } from 'vue'

// 注入通知函数
const showNotification = inject('showNotification') as Function

// 功能选项卡
const activeFeature = ref('cache')
const featureTabs = [
  { id: 'cache', name: '缓存管理', icon: 'fas fa-database' },
  { id: 'performance', name: '性能监控', icon: 'fas fa-tachometer-alt' },
  { id: 'theme', name: '主题定制', icon: 'fas fa-palette' },
  { id: 'error', name: '错误处理', icon: 'fas fa-exclamation-triangle' }
]

// 缓存管理
const cacheStats = reactive({
  size: 0,
  hitRate: 0,
  lastUpdate: ''
})

const cacheItems = ref<Array<{
  key: string
  size: string
  time: string
}>>([])

// 性能监控
const performanceMetrics = reactive({
  loadTime: 0,
  renderTime: 0,
  memoryUsage: 0,
  loadTimeTrend: '+5%',
  renderTimeTrend: '-2%',
  memoryTrend: '+1%'
})

const performanceChart = ref<HTMLCanvasElement>()

// 主题定制
const customTheme = reactive({
  primaryColor: '#667eea',
  backgroundColor: '#ffffff',
  textColor: '#2c3e50',
  fontSize: 16,
  borderRadius: 8
})

// 错误处理
const errorLog = ref<Array<{
  time: string
  type: string
  message: string
}>>([])

const fallbackConfig = reactive({
  enableFallback: true,
  retryCount: 3,
  retryDelay: 1000
})

// 方法
const clearCache = () => {
  cacheStats.size = 0
  cacheStats.hitRate = 0
  cacheItems.value = []
  showNotification('success', '缓存已清空')
}

const preloadTemplates = () => {
  // 模拟预加载
  setTimeout(() => {
    cacheStats.size = 6
    cacheStats.hitRate = 95
    cacheStats.lastUpdate = new Date().toLocaleTimeString()
    
    cacheItems.value = [
      { key: 'login-desktop-default', size: '2.3KB', time: '刚刚' },
      { key: 'login-mobile-default', size: '1.8KB', time: '1分钟前' },
      { key: 'login-tablet-default', size: '2.1KB', time: '2分钟前' }
    ]
    
    showNotification('success', '模板预加载完成')
  }, 1000)
}

const getCacheStats = () => {
  // 模拟获取统计
  cacheStats.size = Math.floor(Math.random() * 10) + 1
  cacheStats.hitRate = Math.floor(Math.random() * 30) + 70
  cacheStats.lastUpdate = new Date().toLocaleTimeString()
  showNotification('info', '缓存统计已更新')
}

// 性能监控相关方法
const getLoadTimeTrend = () => {
  return performanceMetrics.loadTimeTrend.startsWith('+') ? 'trend-up' : 'trend-down'
}

const getLoadTimeTrendIcon = () => {
  return performanceMetrics.loadTimeTrend.startsWith('+') ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
}

const getRenderTimeTrend = () => {
  return performanceMetrics.renderTimeTrend.startsWith('+') ? 'trend-up' : 'trend-down'
}

const getRenderTimeTrendIcon = () => {
  return performanceMetrics.renderTimeTrend.startsWith('+') ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
}

const getMemoryTrend = () => {
  return performanceMetrics.memoryTrend.startsWith('+') ? 'trend-up' : 'trend-down'
}

const getMemoryTrendIcon = () => {
  return performanceMetrics.memoryTrend.startsWith('+') ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
}

// 主题相关方法
const getThemeStyles = () => {
  return {
    '--primary-color': customTheme.primaryColor,
    '--background-color': customTheme.backgroundColor,
    '--text-color': customTheme.textColor,
    '--font-size': `${customTheme.fontSize}px`,
    '--border-radius': `${customTheme.borderRadius}px`
  }
}

const applyTheme = () => {
  showNotification('success', '主题已应用')
}

const resetTheme = () => {
  Object.assign(customTheme, {
    primaryColor: '#667eea',
    backgroundColor: '#ffffff',
    textColor: '#2c3e50',
    fontSize: 16,
    borderRadius: 8
  })
  showNotification('info', '主题已重置')
}

const exportTheme = () => {
  const themeData = JSON.stringify(customTheme, null, 2)
  const blob = new Blob([themeData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'custom-theme.json'
  a.click()
  URL.revokeObjectURL(url)
  showNotification('success', '主题已导出')
}

// 错误处理相关方法
const simulateNetworkError = () => {
  addError('网络错误', '模拟网络连接失败')
  showNotification('error', '网络连接失败')
}

const simulateTemplateError = () => {
  addError('模板错误', '模拟模板解析失败')
  showNotification('error', '模板解析失败')
}

const simulateRenderError = () => {
  addError('渲染错误', '模拟组件渲染失败')
  showNotification('error', '组件渲染失败')
}

const addError = (type: string, message: string) => {
  errorLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    type,
    message
  })
  
  if (errorLog.value.length > 20) {
    errorLog.value = errorLog.value.slice(0, 20)
  }
}

const clearErrorLog = () => {
  errorLog.value = []
  showNotification('info', '错误日志已清空')
}

// 初始化
onMounted(() => {
  // 模拟性能数据
  performanceMetrics.loadTime = Math.floor(Math.random() * 100) + 50
  performanceMetrics.renderTime = Math.floor(Math.random() * 50) + 10
  performanceMetrics.memoryUsage = Math.floor(Math.random() * 10) + 5
})
</script>

<style scoped>
.advanced-demo {
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

.feature-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.feature-tab:hover {
  border-color: #667eea;
  color: #667eea;
}

.feature-tab.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.feature-section {
  animation: slideIn 0.3s ease-out;
}

.cache-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.cache-list {
  max-height: 300px;
  overflow-y: auto;
}

.cache-item {
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cache-key {
  font-weight: 500;
  color: #495057;
}

.cache-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #6c757d;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.metric-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #667eea;
  color: white;
  border-radius: 50%;
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
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

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
}

.theme-editor .form-group {
  margin-bottom: 1.5rem;
}

.color-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-input {
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.range-input {
  width: 100%;
  margin-top: 0.5rem;
}

.theme-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.theme-preview {
  padding: 1.5rem;
  border-radius: var(--border-radius, 8px);
  background: var(--background-color, #ffffff);
  color: var(--text-color, #2c3e50);
  font-size: var(--font-size, 16px);
  border: 2px dashed #d1d5db;
}

.preview-content h3 {
  margin: 0 0 1rem 0;
  color: var(--primary-color, #667eea);
}

.preview-button {
  background: var(--primary-color, #667eea);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  margin: 1rem 0;
}

.preview-card {
  background: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: var(--border-radius, 8px);
  margin-top: 1rem;
}

.error-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.error-log {
  max-height: 300px;
  overflow-y: auto;
  background: #1a1a1a;
  border-radius: 6px;
  padding: 1rem;
}

.no-errors {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 2rem;
}

.error-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #333;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.8rem;
}

.error-time {
  color: #6c757d;
  font-size: 0.75rem;
}

.error-type {
  color: #ffc107;
  font-weight: 500;
  margin: 0.25rem 0;
}

.error-message {
  color: #dc3545;
}

@media (max-width: 768px) {
  .feature-tabs {
    flex-direction: column;
  }
  
  .cache-controls,
  .error-controls,
  .theme-actions {
    flex-direction: column;
  }
  
  .cache-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .color-input-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
