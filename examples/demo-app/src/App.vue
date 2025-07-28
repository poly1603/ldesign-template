<template>
  <div class="demo-app">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <div class="logo-section">
            <h1>🎨 LDesign Template</h1>
            <span class="version">v1.0.0</span>
          </div>
          
          <nav class="nav-links">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="{ active: activeTab === tab.id }"
              class="nav-btn"
            >
              <i :class="tab.icon"></i>
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="app-main">
      <div class="container">
        <!-- 基础演示 -->
        <BasicDemo v-if="activeTab === 'basic'" />
        
        <!-- 高级功能 -->
        <AdvancedDemo v-if="activeTab === 'advanced'" />
        
        <!-- 模板开发 -->
        <DeveloperDemo v-if="activeTab === 'developer'" />
        
        <!-- 性能监控 -->
        <PerformanceDemo v-if="activeTab === 'performance'" />
      </div>
    </main>

    <!-- 底部信息 -->
    <footer class="app-footer">
      <div class="container">
        <div class="footer-content">
          <div class="device-info">
            <h4>🔍 设备信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">设备类型:</span>
                <span class="value">{{ deviceType }}</span>
              </div>
              <div class="info-item">
                <span class="label">屏幕尺寸:</span>
                <span class="value">{{ screenWidth }}×{{ screenHeight }}</span>
              </div>
              <div class="info-item">
                <span class="label">是否移动端:</span>
                <span class="value">{{ isMobile ? '是' : '否' }}</span>
              </div>
              <div class="info-item">
                <span class="label">屏幕方向:</span>
                <span class="value">{{ orientation }}</span>
              </div>
            </div>
          </div>
          
          <div class="template-info">
            <h4>🎨 当前模板</h4>
            <div class="info-grid" v-if="currentTemplate">
              <div class="info-item">
                <span class="label">模板名称:</span>
                <span class="value">{{ currentTemplate.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">设备类型:</span>
                <span class="value">{{ currentTemplate.device }}</span>
              </div>
              <div class="info-item">
                <span class="label">模板版本:</span>
                <span class="value">{{ currentTemplate.version }}</span>
              </div>
              <div class="info-item">
                <span class="label">作者:</span>
                <span class="value">{{ currentTemplate.author }}</span>
              </div>
            </div>
            <p v-else class="no-template">暂无模板</p>
          </div>
        </div>
        
        <div class="copyright">
          <p>&copy; 2024 LDesign Team. Made with ❤️</p>
        </div>
      </div>
    </footer>

    <!-- 通知组件 -->
    <Notification 
      v-if="notification" 
      :type="notification.type"
      :message="notification.message"
      @close="notification = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { useTemplate, useDeviceDetector } from '@ldesign/template'
import BasicDemo from './components/BasicDemo.vue'
import AdvancedDemo from './components/AdvancedDemo.vue'
import DeveloperDemo from './components/DeveloperDemo.vue'
import PerformanceDemo from './components/PerformanceDemo.vue'
import Notification from './components/Notification.vue'

// 设备检测
const { 
  deviceType, 
  isMobile, 
  screenWidth, 
  screenHeight, 
  orientation 
} = useDeviceDetector()

// 模板管理
const { currentTemplate } = useTemplate({
  category: 'login',
  autoDetectDevice: true
})

// 标签页
const activeTab = ref('basic')
const tabs = [
  { id: 'basic', name: '基础演示', icon: 'fas fa-play' },
  { id: 'advanced', name: '高级功能', icon: 'fas fa-cogs' },
  { id: 'developer', name: '模板开发', icon: 'fas fa-code' },
  { id: 'performance', name: '性能监控', icon: 'fas fa-chart-line' }
]

// 通知系统
const notification = ref<{
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
} | null>(null)

const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
  notification.value = { type, message }
  setTimeout(() => {
    notification.value = null
  }, 5000)
}

// 提供给子组件使用
provide('showNotification', showNotification)
</script>

<style scoped>
.demo-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-section h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.version {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.nav-btn.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
}

.app-main {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  background: #2c3e50;
  color: white;
  padding: 2rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.device-info h4,
.template-info h4 {
  margin: 0 0 1rem 0;
  color: #ecf0f1;
  font-size: 1.1rem;
}

.info-grid {
  display: grid;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.label {
  color: #bdc3c7;
  font-size: 0.9rem;
}

.value {
  color: #ecf0f1;
  font-weight: 500;
  font-size: 0.9rem;
}

.no-template {
  color: #95a5a6;
  font-style: italic;
  margin: 0;
}

.copyright {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright p {
  margin: 0;
  color: #95a5a6;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .nav-links {
    justify-content: center;
  }
  
  .nav-btn {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
