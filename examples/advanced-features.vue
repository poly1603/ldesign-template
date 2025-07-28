<template>
  <div class="advanced-example">
    <h1>高级功能示例</h1>
    <p>展示 @ldesign/template 的高级功能和最佳实践</p>

    <!-- 功能导航 -->
    <div class="feature-nav">
      <button 
        v-for="feature in features" 
        :key="feature.id"
        @click="activeFeature = feature.id"
        :class="{ active: activeFeature === feature.id }"
        class="nav-btn"
      >
        <i :class="feature.icon"></i>
        {{ feature.name }}
      </button>
    </div>

    <!-- 模板缓存管理 -->
    <div v-if="activeFeature === 'cache'" class="feature-section">
      <h2><i class="fas fa-database"></i> 模板缓存管理</h2>
      
      <div class="cache-controls">
        <button @click="clearCache" class="action-btn danger">
          <i class="fas fa-trash"></i>
          清空缓存
        </button>
        <button @click="preloadTemplates" class="action-btn primary">
          <i class="fas fa-download"></i>
          预加载模板
        </button>
        <button @click="getCacheStats" class="action-btn secondary">
          <i class="fas fa-chart-bar"></i>
          缓存统计
        </button>
      </div>

      <div class="cache-info">
        <h3>缓存信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>缓存大小:</label>
            <span>{{ cacheStats.size || 0 }} 个模板</span>
          </div>
          <div class="info-item">
            <label>命中率:</label>
            <span>{{ cacheStats.hitRate || 0 }}%</span>
          </div>
          <div class="info-item">
            <label>最后更新:</label>
            <span>{{ cacheStats.lastUpdate || '未知' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义模板加载器 -->
    <div v-if="activeFeature === 'loader'" class="feature-section">
      <h2><i class="fas fa-cogs"></i> 自定义模板加载器</h2>
      
      <div class="loader-demo">
        <h3>远程模板加载</h3>
        <div class="loader-controls">
          <input 
            v-model="remoteUrl" 
            type="url" 
            placeholder="输入远程模板URL"
            class="url-input"
          />
          <button @click="loadRemoteTemplate" class="action-btn primary">
            <i class="fas fa-cloud-download-alt"></i>
            加载远程模板
          </button>
        </div>
        
        <div v-if="remoteTemplate" class="remote-template-info">
          <h4>远程模板信息</h4>
          <pre>{{ JSON.stringify(remoteTemplate, null, 2) }}</pre>
        </div>
      </div>

      <div class="loader-demo">
        <h3>动态模板生成</h3>
        <div class="generator-controls">
          <select v-model="generatorConfig.style" class="style-select">
            <option value="minimal">极简风格</option>
            <option value="modern">现代风格</option>
            <option value="classic">经典风格</option>
          </select>
          <select v-model="generatorConfig.color" class="color-select">
            <option value="blue">蓝色主题</option>
            <option value="green">绿色主题</option>
            <option value="purple">紫色主题</option>
          </select>
          <button @click="generateTemplate" class="action-btn primary">
            <i class="fas fa-magic"></i>
            生成模板
          </button>
        </div>
      </div>
    </div>

    <!-- 性能监控 -->
    <div v-if="activeFeature === 'performance'" class="feature-section">
      <h2><i class="fas fa-tachometer-alt"></i> 性能监控</h2>
      
      <div class="performance-metrics">
        <div class="metric-card">
          <h3>模板加载时间</h3>
          <div class="metric-value">{{ performanceMetrics.loadTime }}ms</div>
          <div class="metric-trend" :class="getLoadTimeTrend()">
            <i :class="getLoadTimeTrendIcon()"></i>
            {{ performanceMetrics.loadTimeTrend }}
          </div>
        </div>

        <div class="metric-card">
          <h3>渲染时间</h3>
          <div class="metric-value">{{ performanceMetrics.renderTime }}ms</div>
          <div class="metric-trend" :class="getRenderTimeTrend()">
            <i :class="getRenderTimeTrendIcon()"></i>
            {{ performanceMetrics.renderTimeTrend }}
          </div>
        </div>

        <div class="metric-card">
          <h3>内存使用</h3>
          <div class="metric-value">{{ performanceMetrics.memoryUsage }}MB</div>
          <div class="metric-trend" :class="getMemoryTrend()">
            <i :class="getMemoryTrendIcon()"></i>
            {{ performanceMetrics.memoryTrend }}
          </div>
        </div>
      </div>

      <div class="performance-chart">
        <h3>性能趋势图</h3>
        <canvas ref="performanceChart" width="600" height="300"></canvas>
      </div>
    </div>

    <!-- 错误处理和降级 -->
    <div v-if="activeFeature === 'error'" class="feature-section">
      <h2><i class="fas fa-exclamation-triangle"></i> 错误处理和降级</h2>
      
      <div class="error-demo">
        <h3>错误模拟</h3>
        <div class="error-controls">
          <button @click="simulateNetworkError" class="action-btn warning">
            <i class="fas fa-wifi"></i>
            模拟网络错误
          </button>
          <button @click="simulateTemplateError" class="action-btn warning">
            <i class="fas fa-file-excel"></i>
            模拟模板错误
          </button>
          <button @click="simulateRenderError" class="action-btn warning">
            <i class="fas fa-bug"></i>
            模拟渲染错误
          </button>
        </div>

        <div class="error-log">
          <h4>错误日志</h4>
          <div class="log-container">
            <div v-for="(error, index) in errorLog" :key="index" class="error-item">
              <span class="error-time">{{ error.time }}</span>
              <span class="error-type">{{ error.type }}</span>
              <span class="error-message">{{ error.message }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="fallback-demo">
        <h3>降级策略</h3>
        <div class="fallback-config">
          <label>
            <input v-model="fallbackConfig.enableFallback" type="checkbox" />
            启用自动降级
          </label>
          <label>
            <input v-model="fallbackConfig.retryCount" type="number" min="0" max="5" />
            重试次数
          </label>
          <label>
            <input v-model="fallbackConfig.retryDelay" type="number" min="100" max="5000" step="100" />
            重试延迟(ms)
          </label>
        </div>
      </div>
    </div>

    <!-- 国际化支持 -->
    <div v-if="activeFeature === 'i18n'" class="feature-section">
      <h2><i class="fas fa-globe"></i> 国际化支持</h2>
      
      <div class="i18n-controls">
        <label>选择语言:</label>
        <select v-model="currentLocale" @change="changeLocale" class="locale-select">
          <option value="zh-CN">简体中文</option>
          <option value="zh-TW">繁體中文</option>
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
          <option value="ko-KR">한국어</option>
        </select>
      </div>

      <div class="i18n-demo">
        <h3>{{ t('demo.title') }}</h3>
        <p>{{ t('demo.description') }}</p>
        
        <div class="translated-template">
          <TemplateRenderer
            :template="currentTemplate"
            :props="getLocalizedProps()"
            @login="handleLogin"
          />
        </div>
      </div>
    </div>

    <!-- 主题定制 -->
    <div v-if="activeFeature === 'theme'" class="feature-section">
      <h2><i class="fas fa-palette"></i> 主题定制</h2>
      
      <div class="theme-editor">
        <h3>主题编辑器</h3>
        <div class="theme-controls">
          <div class="color-group">
            <label>主色调:</label>
            <input v-model="customTheme.primaryColor" type="color" />
          </div>
          <div class="color-group">
            <label>背景色:</label>
            <input v-model="customTheme.backgroundColor" type="color" />
          </div>
          <div class="color-group">
            <label>文字色:</label>
            <input v-model="customTheme.textColor" type="color" />
          </div>
          <div class="size-group">
            <label>字体大小:</label>
            <input v-model="customTheme.fontSize" type="range" min="12" max="20" />
            <span>{{ customTheme.fontSize }}px</span>
          </div>
          <div class="size-group">
            <label>圆角大小:</label>
            <input v-model="customTheme.borderRadius" type="range" min="0" max="20" />
            <span>{{ customTheme.borderRadius }}px</span>
          </div>
        </div>

        <div class="theme-actions">
          <button @click="applyTheme" class="action-btn primary">
            <i class="fas fa-check"></i>
            应用主题
          </button>
          <button @click="resetTheme" class="action-btn secondary">
            <i class="fas fa-undo"></i>
            重置主题
          </button>
          <button @click="exportTheme" class="action-btn secondary">
            <i class="fas fa-download"></i>
            导出主题
          </button>
        </div>
      </div>

      <div class="theme-preview">
        <h3>主题预览</h3>
        <div class="preview-container" :style="getThemeStyles()">
          <TemplateRenderer
            :template="currentTemplate"
            :props="getThemedProps()"
            @login="handleLogin"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useTemplate, useTemplateCache, useStorage } from '@ldesign/template'
import TemplateRenderer from '@ldesign/template/src/components/TemplateRenderer.vue'

// 功能列表
const features = [
  { id: 'cache', name: '缓存管理', icon: 'fas fa-database' },
  { id: 'loader', name: '自定义加载器', icon: 'fas fa-cogs' },
  { id: 'performance', name: '性能监控', icon: 'fas fa-tachometer-alt' },
  { id: 'error', name: '错误处理', icon: 'fas fa-exclamation-triangle' },
  { id: 'i18n', name: '国际化', icon: 'fas fa-globe' },
  { id: 'theme', name: '主题定制', icon: 'fas fa-palette' }
]

const activeFeature = ref('cache')

// 模板管理
const { currentTemplate } = useTemplate({
  category: 'login',
  autoDetectDevice: true
})

// 缓存管理
const { clearTemplateCache, preloadDefaultTemplates, getTemplateStats } = useTemplateCache()
const cacheStats = reactive({
  size: 0,
  hitRate: 0,
  lastUpdate: ''
})

// 远程模板加载
const remoteUrl = ref('')
const remoteTemplate = ref(null)

// 动态模板生成
const generatorConfig = reactive({
  style: 'modern',
  color: 'blue'
})

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

// 国际化
const currentLocale = ref('zh-CN')
const translations = {
  'zh-CN': {
    'demo.title': '国际化演示',
    'demo.description': '这是一个支持多语言的模板示例'
  },
  'en-US': {
    'demo.title': 'Internationalization Demo',
    'demo.description': 'This is a multilingual template example'
  }
}

// 主题定制
const customTheme = reactive({
  primaryColor: '#3b82f6',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  fontSize: 16,
  borderRadius: 8
})

// 方法
const clearCache = async () => {
  await clearTemplateCache()
  await getCacheStats()
}

const preloadTemplates = async () => {
  await preloadDefaultTemplates()
  await getCacheStats()
}

const getCacheStats = async () => {
  const stats = await getTemplateStats()
  Object.assign(cacheStats, stats)
}

const loadRemoteTemplate = async () => {
  try {
    const response = await fetch(remoteUrl.value)
    remoteTemplate.value = await response.json()
  } catch (error) {
    addError('网络错误', error.message)
  }
}

const generateTemplate = () => {
  // 模拟动态生成模板
  console.log('生成模板:', generatorConfig)
}

const simulateNetworkError = () => {
  addError('网络错误', '模拟网络连接失败')
}

const simulateTemplateError = () => {
  addError('模板错误', '模拟模板解析失败')
}

const simulateRenderError = () => {
  addError('渲染错误', '模拟组件渲染失败')
}

const addError = (type: string, message: string) => {
  errorLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    type,
    message
  })
}

const changeLocale = () => {
  // 切换语言逻辑
  console.log('切换语言到:', currentLocale.value)
}

const t = (key: string) => {
  return translations[currentLocale.value]?.[key] || key
}

const getLocalizedProps = () => {
  return {
    title: t('demo.title'),
    subtitle: t('demo.description')
  }
}

const applyTheme = () => {
  // 应用主题逻辑
  console.log('应用主题:', customTheme)
}

const resetTheme = () => {
  Object.assign(customTheme, {
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontSize: 16,
    borderRadius: 8
  })
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
}

const getThemeStyles = () => {
  return {
    '--primary-color': customTheme.primaryColor,
    '--background-color': customTheme.backgroundColor,
    '--text-color': customTheme.textColor,
    '--font-size': `${customTheme.fontSize}px`,
    '--border-radius': `${customTheme.borderRadius}px`
  }
}

const getThemedProps = () => {
  return {
    title: '主题预览',
    primaryColor: customTheme.primaryColor,
    backgroundColor: customTheme.backgroundColor
  }
}

// 性能趋势相关方法
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

const handleLogin = (data: any) => {
  console.log('登录:', data)
}

// 初始化
onMounted(async () => {
  await getCacheStats()
  
  // 模拟性能数据
  performanceMetrics.loadTime = Math.floor(Math.random() * 100) + 50
  performanceMetrics.renderTime = Math.floor(Math.random() * 50) + 10
  performanceMetrics.memoryUsage = Math.floor(Math.random() * 10) + 5
})
</script>

<style scoped>
.advanced-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

h1 + p {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
}

.feature-nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.nav-btn.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

.feature-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.feature-section h2 {
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #6b7280;
  color: white;
}

.action-btn.secondary:hover {
  background: #4b5563;
}

.action-btn.warning {
  background: #f59e0b;
  color: white;
}

.action-btn.warning:hover {
  background: #d97706;
}

.action-btn.danger {
  background: #ef4444;
  color: white;
}

.action-btn.danger:hover {
  background: #dc2626;
}

.cache-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  text-align: center;
}

.metric-card h3 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.metric-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.trend-up {
  color: #ef4444;
}

.trend-down {
  color: #10b981;
}

.error-log {
  margin-top: 1rem;
}

.log-container {
  background: #1f2937;
  border-radius: 6px;
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;
}

.error-item {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #374151;
  font-family: monospace;
  font-size: 0.875rem;
}

.error-item:last-child {
  border-bottom: none;
}

.error-time {
  color: #9ca3af;
  min-width: 80px;
}

.error-type {
  color: #f59e0b;
  min-width: 80px;
}

.error-message {
  color: #ef4444;
  flex: 1;
}

.theme-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.color-group,
.size-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-group input[type="color"] {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.size-group input[type="range"] {
  flex: 1;
}

.theme-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.preview-container {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  background: var(--background-color, white);
  color: var(--text-color, #1f2937);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .advanced-example {
    padding: 1rem;
  }
  
  .feature-nav {
    flex-direction: column;
  }
  
  .nav-btn {
    width: 100%;
    justify-content: center;
  }
  
  .cache-controls,
  .theme-actions {
    flex-direction: column;
  }
  
  .performance-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
