<template>
  <div class="basic-demo">
    <div class="demo-header">
      <h2>🚀 基础演示</h2>
      <p>体验模板的基本功能：自动设备检测、模板切换、事件处理等</p>
    </div>

    <div class="row">
      <!-- 左侧：模板渲染区域 -->
      <div class="col-8 col-sm-12">
        <div class="card template-display">
          <div class="card-header">
            <h3>🎨 模板渲染区域</h3>
            <div class="template-meta" v-if="currentTemplate">
              <span class="badge">{{ currentTemplate.device }}</span>
              <span class="badge">{{ currentTemplate.templateName }}</span>
            </div>
          </div>

          <div class="card-body">
            <!-- 模板渲染器 -->
            <TemplateRenderer
              :template="currentTemplate"
              :props="templateProps"
              @login="handleLogin"
              @register="handleRegister"
              @forgot-password="handleForgotPassword"
              @social-login="handleSocialLogin"
              @quick-login="handleQuickLogin"
              @biometric-login="handleBiometricLogin"
            >
              <!-- 自定义头部 -->
              <template #header>
                <div class="custom-header">
                  <div class="logo">🎨</div>
                  <div class="title-section">
                    <h1>{{ appTitle }}</h1>
                    <p>{{ appSubtitle }}</p>
                  </div>
                </div>
              </template>

              <!-- 自定义底部 -->
              <template #footer>
                <div class="custom-footer">
                  <p>&copy; 2024 LDesign Demo. 演示应用</p>
                  <div class="footer-links">
                    <a href="#" @click.prevent="showNotification('info', '这是演示链接')">帮助中心</a>
                    <a href="#" @click.prevent="showNotification('info', '这是演示链接')">隐私政策</a>
                  </div>
                </div>
              </template>

              <!-- 额外内容 -->
              <template #extra>
                <div class="security-notice">
                  <i class="fas fa-shield-alt"></i>
                  <span>您的信息受到银行级安全保护</span>
                </div>
              </template>
            </TemplateRenderer>
          </div>
        </div>
      </div>

      <!-- 右侧：控制面板 -->
      <div class="col-4 col-sm-12">
        <div class="control-panel">
          <!-- 设备模拟器 -->
          <div class="card mb-3">
            <div class="card-header">
              <h4>📱 设备模拟器</h4>
            </div>
            <div class="card-body">
              <div class="device-buttons">
                <button
                  @click="simulateDevice('mobile')"
                  :class="{ active: deviceType === 'mobile' }"
                  class="btn btn-outline btn-sm"
                >
                  <i class="fas fa-mobile-alt"></i>
                  手机
                </button>
                <button
                  @click="simulateDevice('tablet')"
                  :class="{ active: deviceType === 'tablet' }"
                  class="btn btn-outline btn-sm"
                >
                  <i class="fas fa-tablet-alt"></i>
                  平板
                </button>
                <button
                  @click="simulateDevice('desktop')"
                  :class="{ active: deviceType === 'desktop' }"
                  class="btn btn-outline btn-sm"
                >
                  <i class="fas fa-desktop"></i>
                  桌面
                </button>
              </div>

              <div class="device-info mt-2">
                <small>当前检测: {{ deviceType }} ({{ screenWidth }}×{{ screenHeight }})</small>
              </div>
            </div>
          </div>

          <!-- 模板选择器 -->
          <div class="card mb-3">
            <div class="card-header">
              <h4>🎨 模板选择器</h4>
            </div>
            <div class="card-body">
              <div class="template-list">
                <div
                  v-for="template in availableTemplates"
                  :key="template.id"
                  @click="switchTemplate(template.id)"
                  :class="{ active: currentTemplate?.id === template.id }"
                  class="template-item"
                >
                  <div class="template-info">
                    <div class="template-name">{{ template.name }}</div>
                    <div class="template-meta">
                      <span class="device">{{ template.device }}</span>
                      <span class="style">{{ template.templateName }}</span>
                    </div>
                  </div>
                  <div class="template-preview">
                    <i class="fas fa-eye"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 属性配置 -->
          <div class="card mb-3">
            <div class="card-header">
              <h4>⚙️ 属性配置</h4>
            </div>
            <div class="card-body">
              <div class="prop-editor">
                <div class="form-group">
                  <label>应用标题</label>
                  <input v-model="appTitle" type="text" class="form-control" />
                </div>

                <div class="form-group">
                  <label>副标题</label>
                  <input v-model="appSubtitle" type="text" class="form-control" />
                </div>

                <div class="form-group">
                  <label>主题色</label>
                  <input v-model="templateProps.primaryColor" type="color" class="form-control" />
                </div>

                <div class="form-group">
                  <label>
                    <input v-model="templateProps.showRememberMe" type="checkbox" />
                    显示"记住我"
                  </label>
                </div>

                <div class="form-group">
                  <label>
                    <input v-model="templateProps.showForgotPassword" type="checkbox" />
                    显示"忘记密码"
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 事件日志 -->
          <div class="card">
            <div class="card-header">
              <h4>📋 事件日志</h4>
              <button @click="clearEventLog" class="btn btn-sm btn-outline">
                <i class="fas fa-trash"></i>
                清空
              </button>
            </div>
            <div class="card-body">
              <div class="event-log">
                <div v-if="eventLog.length === 0" class="no-events">
                  暂无事件，请尝试与模板交互
                </div>
                <div
                  v-for="(event, index) in eventLog"
                  :key="index"
                  class="event-item"
                >
                  <div class="event-time">{{ event.time }}</div>
                  <div class="event-name">{{ event.name }}</div>
                  <div class="event-data">{{ formatEventData(event.data) }}</div>
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
import { useDeviceDetector, useTemplate } from '@ldesign/template'
import { inject, reactive, ref } from 'vue'
// import { TemplateRenderer } from '@ldesign/template'

// 注入通知函数
const showNotification = inject('showNotification') as Function

// 设备检测
const { deviceType, screenWidth, screenHeight } = useDeviceDetector()

// 模板管理
const {
  currentTemplate,
  availableTemplates,
  switchTemplate,
  isLoading,
  error
} = useTemplate({
  category: 'login',
  autoDetectDevice: true,
  fallback: 'default'
})

// 应用配置
const appTitle = ref('LDesign 演示')
const appSubtitle = ref('体验强大的模板管理系统')

// 模板属性
const templateProps = reactive({
  title: '用户登录',
  logo: '',
  primaryColor: '#667eea',
  backgroundColor: '#ffffff',
  showRememberMe: true,
  showForgotPassword: true,
  showRegisterLink: true,
  socialLogins: [
    { name: 'wechat', label: '微信登录', icon: 'fab fa-weixin', color: '#07c160' },
    { name: 'qq', label: 'QQ登录', icon: 'fab fa-qq', color: '#12b7f5' },
    { name: 'google', label: 'Google', icon: 'fab fa-google', color: '#ea4335' }
  ]
})

// 事件日志
const eventLog = ref<Array<{
  time: string
  name: string
  data: any
}>>([])

// 记录事件
const logEvent = (name: string, data: any = {}) => {
  eventLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    name,
    data
  })

  // 限制日志数量
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(0, 20)
  }
}

// 事件处理
const handleLogin = (data: any) => {
  logEvent('登录', data)
  showNotification('success', `登录成功！欢迎 ${data.username}`)
}

const handleRegister = () => {
  logEvent('注册')
  showNotification('info', '跳转到注册页面')
}

const handleForgotPassword = () => {
  logEvent('忘记密码')
  showNotification('info', '跳转到密码重置页面')
}

const handleSocialLogin = (data: any) => {
  logEvent('社交登录', data)
  showNotification('success', `${data.provider} 登录成功！`)
}

const handleQuickLogin = (data: any) => {
  logEvent('快速登录', data)
  showNotification('success', `快速登录成功！手机号: ${data.phone}`)
}

const handleBiometricLogin = () => {
  logEvent('生物识别登录')
  showNotification('success', '生物识别登录成功！')
}

// 设备模拟
const simulateDevice = async (device: string) => {
  // 这里可以通过切换模板来模拟不同设备
  const deviceTemplates = availableTemplates.value.filter(t => t.device === device)
  if (deviceTemplates.length > 0) {
    await switchTemplate(deviceTemplates[0].id)
    logEvent('设备切换', { device, template: deviceTemplates[0].name })
    showNotification('info', `已切换到${device}端模板`)
  }
}

// 工具函数
const formatEventData = (data: any) => {
  if (typeof data === 'object') {
    return JSON.stringify(data, null, 2)
  }
  return String(data)
}

const clearEventLog = () => {
  eventLog.value = []
  showNotification('info', '事件日志已清空')
}
</script>

<style scoped>
.basic-demo {
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

.template-display {
  min-height: 600px;
}

.template-meta {
  display: flex;
  gap: 0.5rem;
}

.badge {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.custom-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  text-align: left;
}

.logo {
  font-size: 3rem;
}

.title-section h1 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.title-section p {
  margin: 0;
  color: #7f8c8d;
}

.custom-footer {
  text-align: center;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.footer-links {
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.footer-links a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.security-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #e8f5e8;
  border: 1px solid #c3e6c3;
  border-radius: 6px;
  color: #2d5a2d;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.control-panel .card {
  margin-bottom: 1rem;
}

.device-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.device-buttons .btn {
  flex: 1;
  min-width: 80px;
}

.device-buttons .btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.template-list {
  max-height: 300px;
  overflow-y: auto;
}

.template-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-item:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.template-item.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.template-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.template-meta {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 0.25rem;
}

.template-meta .device,
.template-meta .style {
  margin-right: 0.5rem;
}

.prop-editor .form-group {
  margin-bottom: 1rem;
}

.prop-editor label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.25);
}

.event-log {
  max-height: 300px;
  overflow-y: auto;
}

.no-events {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 2rem;
}

.event-item {
  padding: 0.5rem;
  border-bottom: 1px solid #f1f3f4;
  font-size: 0.8rem;
}

.event-time {
  color: #6c757d;
  font-size: 0.75rem;
}

.event-name {
  font-weight: 500;
  color: #667eea;
  margin: 0.25rem 0;
}

.event-data {
  color: #495057;
  font-family: 'Monaco', 'Menlo', monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

@media (max-width: 768px) {
  .demo-header h2 {
    font-size: 1.5rem;
  }

  .custom-header {
    flex-direction: column;
    text-align: center;
  }

  .device-buttons {
    flex-direction: column;
  }

  .device-buttons .btn {
    min-width: auto;
  }
}
</style>
