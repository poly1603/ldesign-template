# 基础示例

本页面展示了 @ldesign/template 的基础用法示例。

## 简单的登录模板

最基础的模板使用示例。

### 1. 基础设置

首先在你的 Vue 应用中设置模板系统：

```typescript
// main.ts
import { createApp } from 'vue'
import LDesignTemplate from '@ldesign/template'
import App from './App.vue'

const app = createApp(App)

// 使用模板插件
app.use(LDesignTemplate, {
  autoScan: true,
  enableDeviceDetection: true,
  enableCache: true
})

app.mount('#app')
```

### 2. 使用模板组合式函数

```vue
<template>
  <div class="login-page">
    <!-- 模板渲染器 -->
    <TemplateRenderer
      v-if="currentTemplate"
      :template="currentTemplate"
      :props="templateProps"
      @login="handleLogin"
      @register="handleRegister"
      @forgot-password="handleForgotPassword"
    >
      <!-- 自定义头部 -->
      <template #header>
        <div class="app-header">
          <img src="/logo.png" alt="Logo" />
          <h1>{{ appName }}</h1>
        </div>
      </template>

      <!-- 自定义底部 -->
      <template #footer>
        <div class="app-footer">
          <p>&copy; 2024 我的应用</p>
        </div>
      </template>
    </TemplateRenderer>

    <!-- 加载状态 -->
    <div v-else-if="isLoading" class="loading">
      <p>正在加载模板...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>模板加载失败: {{ error.message }}</p>
      <button @click="refreshTemplates">重试</button>
    </div>

    <!-- 开发工具（仅开发环境） -->
    <TemplateSelector
      v-if="isDev"
      category="login"
      :current="currentTemplate?.id"
      @change="switchTemplate"
      class="dev-tools"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTemplate } from '@ldesign/template'

// 使用模板组合式函数
const {
  currentTemplate,
  availableTemplates,
  isLoading,
  error,
  switchTemplate,
  refreshTemplates
} = useTemplate({
  category: 'login',
  autoDetectDevice: true,
  fallback: 'default'
})

// 应用配置
const appName = ref('我的应用')
const isDev = import.meta.env.DEV

// 模板属性
const templateProps = ref({
  title: '用户登录',
  logo: '/logo.png',
  showRememberMe: true,
  showForgotPassword: true,
  showRegisterLink: true,
  primaryColor: '#1976d2'
})

// 事件处理
const handleLogin = (loginData: any) => {
  console.log('登录数据:', loginData)

  // 这里处理登录逻辑
  // 例如：调用 API、验证用户、跳转页面等

  // 模拟登录成功
  alert(`欢迎 ${loginData.username}！`)
}

const handleRegister = () => {
  console.log('跳转到注册页面')
  // 处理注册逻辑
}

const handleForgotPassword = () => {
  console.log('跳转到忘记密码页面')
  // 处理忘记密码逻辑
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  text-align: center;
  margin-bottom: 2rem;
}

.app-header img {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
}

.app-header h1 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.app-footer {
  text-align: center;
  margin-top: 2rem;
  color: #666;
  font-size: 0.9rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.error button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dev-tools {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
```

## 设备自适应模板

展示如何根据设备类型自动选择模板。

```vue
<template>
  <div class="responsive-demo">
    <h2>设备自适应演示</h2>

    <!-- 设备信息显示 -->
    <div class="device-info">
      <p>当前设备: {{ deviceType }}</p>
      <p>屏幕尺寸: {{ screenWidth }}×{{ screenHeight }}</p>
      <p>是否移动端: {{ isMobile ? '是' : '否' }}</p>
    </div>

    <!-- 模板渲染器 -->
    <TemplateRenderer
      v-if="currentTemplate"
      :template="currentTemplate"
      :props="templateProps"
      @login="handleLogin"
    >
      <template #header>
        <div class="responsive-header">
          <h3>{{ deviceType }} 端登录</h3>
          <p>当前使用: {{ currentTemplate.name }}</p>
        </div>
      </template>
    </TemplateRenderer>

    <!-- 模板选择器 -->
    <div class="template-controls">
      <h4>可用模板:</h4>
      <div class="template-list">
        <button
          v-for="template in availableTemplates"
          :key="template.id"
          @click="switchTemplate(template.id)"
          :class="{ active: currentTemplate?.id === template.id }"
          class="template-btn"
        >
          {{ template.name }}
          <span class="device-tag">{{ template.device }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTemplate, useDeviceDetector } from '@ldesign/template'

// 设备检测
const {
  deviceType,
  isMobile,
  screenWidth,
  screenHeight
} = useDeviceDetector()

// 模板管理
const {
  currentTemplate,
  availableTemplates,
  switchTemplate
} = useTemplate({
  category: 'login',
  autoDetectDevice: true
})

// 模板属性
const templateProps = ref({
  title: '响应式登录',
  showRememberMe: true,
  showForgotPassword: true
})

// 事件处理
const handleLogin = (data: any) => {
  console.log('登录数据:', data)
  alert(`在 ${deviceType.value} 端登录成功！`)
}
</script>

<style scoped>
.responsive-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.device-info {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.device-info p {
  margin: 0.5rem 0;
  font-weight: 500;
}

.responsive-header {
  text-align: center;
  margin-bottom: 1rem;
}

.responsive-header h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.responsive-header p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.template-controls {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.template-controls h4 {
  margin: 0 0 1rem 0;
}

.template-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.template-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.template-btn:hover {
  border-color: #1976d2;
}

.template-btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.device-tag {
  font-size: 0.75rem;
  padding: 0.125rem 0.25rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.template-btn.active .device-tag {
  background: rgba(255, 255, 255, 0.2);
}
</style>
```

## 模板缓存示例

展示如何使用模板缓存功能。

```vue
<template>
  <div class="cache-demo">
    <h2>模板缓存演示</h2>

    <!-- 缓存统计 -->
    <div class="cache-stats">
      <h3>缓存统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">缓存大小:</span>
          <span class="stat-value">{{ cacheStats.size }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">命中率:</span>
          <span class="stat-value">{{ cacheStats.hitRate }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总请求:</span>
          <span class="stat-value">{{ cacheStats.totalRequests }}</span>
        </div>
      </div>
    </div>

    <!-- 缓存操作 -->
    <div class="cache-controls">
      <h3>缓存操作</h3>
      <div class="control-buttons">
        <button @click="preloadTemplates" :disabled="isPreloading">
          {{ isPreloading ? '预加载中...' : '预加载模板' }}
        </button>
        <button @click="clearCache">
          清空缓存
        </button>
        <button @click="refreshStats">
          刷新统计
        </button>
      </div>
    </div>

    <!-- 模板列表 -->
    <div class="template-list">
      <h3>模板列表</h3>
      <div class="templates">
        <div
          v-for="template in availableTemplates"
          :key="template.id"
          class="template-item"
          :class="{ cached: isCached(template.id) }"
        >
          <div class="template-info">
            <h4>{{ template.name }}</h4>
            <p>{{ template.device }} - {{ template.templateName }}</p>
          </div>
          <div class="template-actions">
            <span v-if="isCached(template.id)" class="cached-badge">已缓存</span>
            <button @click="loadTemplate(template.id)">
              {{ currentTemplate?.id === template.id ? '当前' : '加载' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前模板 -->
    <div v-if="currentTemplate" class="current-template">
      <h3>当前模板</h3>
      <TemplateRenderer
        :template="currentTemplate"
        :props="templateProps"
        @login="handleLogin"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTemplate, useTemplateCache, useTemplatePreloader } from '@ldesign/template'

// 模板管理
const {
  currentTemplate,
  availableTemplates,
  switchTemplate
} = useTemplate({
  category: 'login'
})

// 缓存管理
const {
  cacheStats,
  hasCache,
  clearCache: clearAllCache,
  refreshStats
} = useTemplateCache()

// 预加载
const {
  isPreloading,
  preloadCategory
} = useTemplatePreloader()

// 模板属性
const templateProps = ref({
  title: '缓存演示',
  showRememberMe: true
})

// 方法
const preloadTemplates = async () => {
  await preloadCategory('login')
  refreshStats()
}

const clearCache = () => {
  clearAllCache()
  refreshStats()
}

const isCached = (templateId: string) => {
  return hasCache(`template:${templateId}`)
}

const loadTemplate = async (templateId: string) => {
  await switchTemplate(templateId)
  refreshStats()
}

const handleLogin = (data: any) => {
  console.log('登录数据:', data)
}
</script>

<style scoped>
.cache-demo {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.cache-stats {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.cache-stats h3 {
  margin: 0 0 1rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: bold;
  color: #333;
}

.cache-controls {
  margin-bottom: 2rem;
}

.cache-controls h3 {
  margin: 0 0 1rem 0;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.control-buttons button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-buttons button:hover:not(:disabled) {
  background: #f0f0f0;
}

.control-buttons button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.template-list h3 {
  margin: 0 0 1rem 0;
}

.templates {
  display: grid;
  gap: 1rem;
}

.template-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.template-item.cached {
  border-color: #28a745;
  background: #f8fff9;
}

.template-info h4 {
  margin: 0 0 0.25rem 0;
}

.template-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.template-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cached-badge {
  background: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.template-actions button {
  padding: 0.5rem 1rem;
  border: 1px solid #1976d2;
  border-radius: 4px;
  background: white;
  color: #1976d2;
  cursor: pointer;
}

.template-actions button:hover {
  background: #1976d2;
  color: white;
}

.current-template {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 2px solid #1976d2;
  border-radius: 8px;
}

.current-template h3 {
  margin: 0 0 1rem 0;
  color: #1976d2;
}
</style>
```

## 存储和偏好设置

展示如何使用本地存储保存用户偏好。

```vue
<template>
  <div class="storage-demo">
    <h2>存储和偏好设置</h2>

    <!-- 用户偏好设置 -->
    <div class="preferences">
      <h3>用户偏好</h3>
      <div class="preference-group">
        <label>
          主题:
          <select v-model="userPreference.theme">
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="auto">自动</option>
          </select>
        </label>

        <label>
          语言:
          <select v-model="userPreference.language">
            <option value="zh-CN">中文</option>
            <option value="en-US">English</option>
            <option value="ja-JP">日本語</option>
          </select>
        </label>

        <label>
          默认模板:
          <select v-model="userPreference.defaultTemplate">
            <option value="">自动选择</option>
            <option
              v-for="template in availableTemplates"
              :key="template.id"
              :value="template.id"
            >
              {{ template.name }}
            </option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            v-model="userPreference.rememberLogin"
          />
          记住登录状态
        </label>

        <label>
          <input
            type="checkbox"
            v-model="userPreference.enableAnimations"
          />
          启用动画效果
        </label>
      </div>
    </div>

    <!-- 存储信息 -->
    <div class="storage-info">
      <h3>存储信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span>存储类型:</span>
          <span>{{ storageType }}</span>
        </div>
        <div class="info-item">
          <span>存储大小:</span>
          <span>{{ storageSize }} bytes</span>
        </div>
        <div class="info-item">
          <span>是否支持存储:</span>
          <span>{{ isStorageSupported ? '是' : '否' }}</span>
        </div>
      </div>

      <div class="storage-actions">
        <button @click="exportPreferences">导出设置</button>
        <button @click="importPreferences">导入设置</button>
        <button @click="resetPreferences">重置设置</button>
      </div>
    </div>

    <!-- 当前模板预览 -->
    <div class="template-preview">
      <h3>模板预览</h3>
      <TemplateRenderer
        v-if="currentTemplate"
        :template="currentTemplate"
        :props="templateProps"
        @login="handleLogin"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useTemplate, useStorage } from '@ldesign/template'

// 模板管理
const {
  currentTemplate,
  availableTemplates,
  switchTemplate
} = useTemplate({
  category: 'login'
})

// 用户偏好存储
const userPreference = useStorage('user-preference', {
  theme: 'light',
  language: 'zh-CN',
  defaultTemplate: '',
  rememberLogin: false,
  enableAnimations: true
})

// 存储信息
const storageType = 'localStorage'
const isStorageSupported = computed(() => {
  try {
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    return true
  } catch {
    return false
  }
})

const storageSize = computed(() => {
  return JSON.stringify(userPreference.value).length
})

// 模板属性
const templateProps = computed(() => ({
  title: '偏好设置演示',
  theme: userPreference.value.theme,
  language: userPreference.value.language,
  enableAnimations: userPreference.value.enableAnimations
}))

// 监听偏好变化
watch(() => userPreference.value.defaultTemplate, async (templateId) => {
  if (templateId && templateId !== currentTemplate.value?.id) {
    await switchTemplate(templateId)
  }
})

// 方法
const exportPreferences = () => {
  const data = JSON.stringify(userPreference.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'preferences.json'
  a.click()
  URL.revokeObjectURL(url)
}

const importPreferences = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          userPreference.value = { ...userPreference.value, ...data }
        } catch (error) {
          alert('导入失败：文件格式错误')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const resetPreferences = () => {
  if (confirm('确定要重置所有设置吗？')) {
    userPreference.value = {
      theme: 'light',
      language: 'zh-CN',
      defaultTemplate: '',
      rememberLogin: false,
      enableAnimations: true
    }
  }
}

const handleLogin = (data: any) => {
  console.log('登录数据:', data)
  if (userPreference.value.rememberLogin) {
    console.log('保存登录状态')
  }
}
</script>

<style scoped>
.storage-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.preferences {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.preferences h3 {
  margin: 0 0 1rem 0;
}

.preference-group {
  display: grid;
  gap: 1rem;
}

.preference-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.preference-group select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: auto;
}

.storage-info {
  background: #fff;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.storage-info h3 {
  margin: 0 0 1rem 0;
}

.info-grid {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.storage-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.storage-actions button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.storage-actions button:hover {
  background: #f0f0f0;
}

.template-preview {
  border: 2px solid #1976d2;
  border-radius: 8px;
  padding: 1.5rem;
}

.template-preview h3 {
  margin: 0 0 1rem 0;
  color: #1976d2;
}
</style>
```

## 总结

这些示例展示了 @ldesign/template 在不同场景下的使用方法，包括：

### 🎯 核心功能演示

1. **基础模板渲染** - 展示如何使用 `useTemplate` 组合式函数
2. **设备自适应** - 演示自动设备检测和模板切换
3. **缓存管理** - 展示模板缓存的使用和管理
4. **存储和偏好** - 演示用户偏好的保存和恢复

### 🔧 技术特性

- **响应式设计** - 所有示例都支持多设备适配
- **组合式 API** - 使用 Vue 3 组合式函数
- **TypeScript 支持** - 完整的类型定义和智能提示
- **错误处理** - 完善的错误处理和降级策略
- **性能优化** - 缓存、预加载等性能优化功能

### 🚀 最佳实践

1. **使用组合式函数** - 推荐使用 `useTemplate`、`useDeviceDetector` 等组合式函数
2. **启用缓存** - 在生产环境中启用模板缓存以提升性能
3. **设备检测** - 利用自动设备检测功能提供最佳用户体验
4. **错误处理** - 设置合适的降级策略和错误处理
5. **用户偏好** - 保存用户的模板偏好设置

### 📚 下一步

- [模板切换示例](/examples/template-switching) - 学习高级模板切换技巧
- [自定义模板](/examples/custom-template) - 了解如何创建自定义模板
- [性能优化](/examples/performance-monitoring) - 掌握性能监控和优化技巧
- [API 参考](/api/composables) - 查看完整的 API 文档

每个示例都包含完整的代码和详细的说明，可以直接在项目中使用。建议从基础示例开始，逐步学习更高级的功能。
