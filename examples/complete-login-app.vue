<template>
  <div class="login-app">
    <!-- 开发工具栏 -->
    <div v-if="isDev" class="dev-toolbar">
      <div class="toolbar-section">
        <label>设备类型:</label>
        <select v-model="selectedDevice" @change="handleDeviceChange">
          <option value="auto">自动检测</option>
          <option value="desktop">桌面端</option>
          <option value="tablet">平板端</option>
          <option value="mobile">移动端</option>
        </select>
      </div>
      
      <div class="toolbar-section">
        <label>模板:</label>
        <select v-model="selectedTemplate" @change="handleTemplateChange">
          <option v-for="template in availableTemplates" :key="template.id" :value="template.id">
            {{ template.name }}
          </option>
        </select>
      </div>
      
      <div class="toolbar-section">
        <button @click="togglePreview" class="preview-btn">
          {{ showPreview ? '隐藏预览' : '显示预览' }}
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content" :class="{ 'with-preview': showPreview && isDev }">
      <!-- 登录模板渲染器 -->
      <div class="template-container">
        <TemplateRenderer
          v-if="currentTemplate"
          :template="currentTemplate"
          :props="templateProps"
          @login="handleLogin"
          @quick-login="handleQuickLogin"
          @biometric-login="handleBiometricLogin"
          @register="handleRegister"
          @forgot-password="handleForgotPassword"
          @social-login="handleSocialLogin"
          @switch-login-mode="handleSwitchLoginMode"
        >
          <!-- 自定义头部 -->
          <template #header>
            <div class="custom-header">
              <img src="/logo.png" alt="LDesign" class="app-logo" />
              <h1>{{ appConfig.name }}</h1>
              <p>{{ appConfig.description }}</p>
            </div>
          </template>

          <!-- 自定义底部 -->
          <template #footer>
            <div class="custom-footer">
              <p>&copy; 2024 {{ appConfig.company }}. All rights reserved.</p>
              <div class="footer-links">
                <a href="#privacy">隐私政策</a>
                <a href="#terms">服务条款</a>
                <a href="#help">帮助中心</a>
              </div>
            </div>
          </template>

          <!-- 额外内容 -->
          <template #extra>
            <div class="extra-content">
              <div class="security-notice">
                <i class="fas fa-shield-alt"></i>
                <span>您的信息受到银行级安全保护</span>
              </div>
            </div>
          </template>
        </TemplateRenderer>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>正在加载模板...</p>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-if="error" class="error-overlay">
          <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>模板加载失败</h3>
            <p>{{ error }}</p>
            <button @click="retryLoad" class="retry-btn">重试</button>
          </div>
        </div>
      </div>

      <!-- 预览面板 -->
      <div v-if="showPreview && isDev" class="preview-panel">
        <div class="preview-header">
          <h3>模板预览</h3>
          <button @click="showPreview = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="preview-content">
          <div class="template-info">
            <h4>{{ currentTemplate?.name }}</h4>
            <p>{{ currentTemplate?.description }}</p>
            <div class="template-meta">
              <span class="tag">{{ currentTemplate?.device }}</span>
              <span class="tag">{{ currentTemplate?.category }}</span>
              <span class="version">v{{ currentTemplate?.version }}</span>
            </div>
          </div>

          <div class="template-props">
            <h5>模板属性</h5>
            <div class="props-editor">
              <div v-for="(prop, key) in currentTemplate?.props" :key="key" class="prop-item">
                <label>{{ prop.description || key }}</label>
                <input
                  v-if="prop.type === 'string'"
                  v-model="templateProps[key]"
                  type="text"
                  :placeholder="prop.default"
                />
                <input
                  v-else-if="prop.type === 'boolean'"
                  v-model="templateProps[key]"
                  type="checkbox"
                />
                <input
                  v-else-if="prop.type === 'number'"
                  v-model.number="templateProps[key]"
                  type="number"
                />
              </div>
            </div>
          </div>

          <div class="event-log">
            <h5>事件日志</h5>
            <div class="log-content">
              <div v-for="(log, index) in eventLogs" :key="index" class="log-item">
                <span class="timestamp">{{ log.timestamp }}</span>
                <span class="event-name">{{ log.event }}</span>
                <span class="event-data">{{ JSON.stringify(log.data) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知组件 -->
    <div v-if="notification" class="notification" :class="notification.type">
      <i :class="getNotificationIcon(notification.type)"></i>
      <span>{{ notification.message }}</span>
      <button @click="notification = null" class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useTemplate, useDeviceDetector } from '@ldesign/template'
import TemplateRenderer from '@ldesign/template/src/components/TemplateRenderer.vue'

// 应用配置
const appConfig = reactive({
  name: 'LDesign Demo',
  description: '体验强大的模板管理系统',
  company: 'LDesign Team'
})

// 开发模式
const isDev = import.meta.env.DEV

// 设备检测
const { deviceType } = useDeviceDetector()

// 模板管理
const selectedDevice = ref('auto')
const selectedTemplate = ref('')
const showPreview = ref(false)

const {
  currentTemplate,
  availableTemplates,
  isLoading,
  error,
  loadTemplate,
  switchTemplate,
  refreshTemplates
} = useTemplate({
  category: 'login',
  device: selectedDevice.value === 'auto' ? deviceType.value : selectedDevice.value,
  fallback: 'default'
})

// 模板属性
const templateProps = reactive({
  title: '用户登录',
  logo: '/logo.png',
  showRememberMe: true,
  showForgotPassword: true,
  showRegisterLink: true,
  primaryColor: '#3b82f6',
  backgroundColor: '#f8fafc'
})

// 事件日志
const eventLogs = ref<Array<{
  timestamp: string
  event: string
  data: any
}>>([])

// 通知
const notification = ref<{
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
} | null>(null)

// 计算属性
const filteredTemplates = computed(() => {
  return availableTemplates.value.filter(template => {
    if (selectedDevice.value === 'auto') return true
    return template.device === selectedDevice.value
  })
})

// 方法
const logEvent = (event: string, data: any) => {
  eventLogs.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    event,
    data
  })
  
  // 限制日志数量
  if (eventLogs.value.length > 50) {
    eventLogs.value = eventLogs.value.slice(0, 50)
  }
}

const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
  notification.value = { type, message }
  
  // 自动隐藏通知
  setTimeout(() => {
    notification.value = null
  }, 5000)
}

const getNotificationIcon = (type: string) => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return icons[type as keyof typeof icons]
}

// 事件处理
const handleLogin = (data: any) => {
  logEvent('login', data)
  showNotification('success', `登录成功！欢迎 ${data.username}`)
  
  // 模拟登录逻辑
  console.log('登录数据:', data)
}

const handleQuickLogin = (data: any) => {
  logEvent('quickLogin', data)
  showNotification('success', `快速登录成功！手机号: ${data.phone}`)
  
  console.log('快速登录数据:', data)
}

const handleBiometricLogin = () => {
  logEvent('biometricLogin', {})
  showNotification('success', '生物识别登录成功！')
  
  console.log('生物识别登录')
}

const handleRegister = () => {
  logEvent('register', {})
  showNotification('info', '跳转到注册页面')
  
  console.log('跳转注册')
}

const handleForgotPassword = () => {
  logEvent('forgotPassword', {})
  showNotification('info', '跳转到密码重置页面')
  
  console.log('忘记密码')
}

const handleSocialLogin = (data: any) => {
  logEvent('socialLogin', data)
  showNotification('success', `${data.provider} 登录成功！`)
  
  console.log('社交登录:', data)
}

const handleSwitchLoginMode = (data: any) => {
  logEvent('switchLoginMode', data)
  showNotification('info', `切换到 ${data.mode} 登录模式`)
  
  console.log('切换登录模式:', data)
}

const handleDeviceChange = () => {
  const device = selectedDevice.value === 'auto' ? deviceType.value : selectedDevice.value
  refreshTemplates()
  logEvent('deviceChange', { device })
}

const handleTemplateChange = () => {
  if (selectedTemplate.value) {
    switchTemplate(selectedTemplate.value)
    logEvent('templateChange', { templateId: selectedTemplate.value })
  }
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
  logEvent('togglePreview', { show: showPreview.value })
}

const retryLoad = () => {
  refreshTemplates()
  logEvent('retryLoad', {})
}

// 监听器
watch(currentTemplate, (newTemplate) => {
  if (newTemplate) {
    selectedTemplate.value = newTemplate.id
  }
})

watch(availableTemplates, (templates) => {
  if (templates.length > 0 && !selectedTemplate.value) {
    selectedTemplate.value = templates[0].id
  }
})

// 生命周期
onMounted(() => {
  logEvent('appMounted', { deviceType: deviceType.value })
  
  // 初始化模板属性
  if (currentTemplate.value?.props) {
    Object.keys(currentTemplate.value.props).forEach(key => {
      const prop = currentTemplate.value!.props[key]
      if (!(key in templateProps)) {
        templateProps[key] = prop.default
      }
    })
  }
})
</script>

<style lang="less" scoped>
.login-app {
  min-height: 100vh;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dev-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #1f2937;
  color: white;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .toolbar-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    select, .preview-btn {
      padding: 0.375rem 0.75rem;
      border: 1px solid #374151;
      border-radius: 6px;
      background: #374151;
      color: white;
      font-size: 0.875rem;
      cursor: pointer;

      &:hover {
        background: #4b5563;
      }
    }

    .preview-btn {
      background: #3b82f6;
      border-color: #3b82f6;

      &:hover {
        background: #2563eb;
      }
    }
  }
}

.main-content {
  display: flex;
  min-height: 100vh;
  padding-top: 60px; // 为开发工具栏留空间

  &.with-preview {
    .template-container {
      flex: 1;
    }
  }

  .template-container {
    flex: 1;
    position: relative;
  }

  .preview-panel {
    width: 400px;
    background: #f9fafb;
    border-left: 1px solid #e5e7eb;
    padding: 1rem;
    overflow-y: auto;

    .preview-header {
      display: flex;
      justify-content: between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;

      h3 {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
      }

      .close-btn {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 0.25rem;

        &:hover {
          color: #374151;
        }
      }
    }

    .template-info {
      margin-bottom: 1.5rem;

      h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
      }

      p {
        margin: 0 0 0.75rem 0;
        color: #6b7280;
        font-size: 0.875rem;
      }

      .template-meta {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;

        .tag {
          background: #e5e7eb;
          color: #374151;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .version {
          background: #3b82f6;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }
      }
    }

    .template-props, .event-log {
      margin-bottom: 1.5rem;

      h5 {
        margin: 0 0 0.75rem 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
      }
    }

    .props-editor {
      .prop-item {
        margin-bottom: 0.75rem;

        label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 0.875rem;

          &[type="checkbox"] {
            width: auto;
          }
        }
      }
    }

    .log-content {
      max-height: 200px;
      overflow-y: auto;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 0.5rem;

      .log-item {
        display: flex;
        gap: 0.5rem;
        padding: 0.25rem 0;
        border-bottom: 1px solid #f3f4f6;
        font-size: 0.75rem;

        &:last-child {
          border-bottom: none;
        }

        .timestamp {
          color: #6b7280;
          min-width: 60px;
        }

        .event-name {
          color: #3b82f6;
          font-weight: 500;
          min-width: 80px;
        }

        .event-data {
          color: #374151;
          flex: 1;
          word-break: break-all;
        }
      }
    }
  }
}

.loading-overlay, .error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-spinner, .error-content {
  text-align: center;
  padding: 2rem;

  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #3b82f6;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #374151;
  }

  p {
    margin: 0 0 1rem 0;
    color: #6b7280;
  }

  .retry-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background: #2563eb;
    }
  }
}

.notification {
  position: fixed;
  top: 80px;
  right: 1rem;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1001;
  min-width: 300px;

  &.success {
    border-left: 4px solid #10b981;
    i { color: #10b981; }
  }

  &.error {
    border-left: 4px solid #ef4444;
    i { color: #ef4444; }
  }

  &.warning {
    border-left: 4px solid #f59e0b;
    i { color: #f59e0b; }
  }

  &.info {
    border-left: 4px solid #3b82f6;
    i { color: #3b82f6; }
  }

  .notification-close {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    margin-left: auto;

    &:hover {
      color: #374151;
    }
  }
}

.custom-header {
  text-align: center;
  padding: 1rem;

  .app-logo {
    max-height: 60px;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #6b7280;
  }
}

.custom-footer {
  text-align: center;
  padding: 1rem;

  p {
    margin: 0 0 0.5rem 0;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 1rem;

    a {
      color: #3b82f6;
      text-decoration: none;
      font-size: 0.875rem;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.extra-content {
  .security-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    color: #0369a1;
    font-size: 0.875rem;

    i {
      color: #0284c7;
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .main-content.with-preview {
    flex-direction: column;

    .preview-panel {
      width: 100%;
      border-left: none;
      border-top: 1px solid #e5e7eb;
    }
  }
}

@media (max-width: 768px) {
  .dev-toolbar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;

    .toolbar-section {
      width: 100%;
      justify-content: space-between;
    }
  }

  .main-content {
    padding-top: 120px;
  }

  .notification {
    left: 1rem;
    right: 1rem;
    min-width: auto;
  }
}
</style>
