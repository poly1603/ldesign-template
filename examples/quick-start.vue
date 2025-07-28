<template>
  <div class="quick-start-example">
    <h1>快速开始示例</h1>
    <p>这是一个最简单的 @ldesign/template 使用示例</p>

    <!-- 最简单的使用方式 -->
    <div class="simple-demo">
      <h2>1. 最简单的使用方式</h2>
      <TemplateRenderer
        :template="currentTemplate"
        :props="{ title: '快速开始', logo: '/logo.png' }"
        @login="handleLogin"
      />
    </div>

    <!-- 当前状态显示 -->
    <div class="status-info">
      <h2>2. 当前状态</h2>
      <div class="info-card">
        <p><strong>设备类型:</strong> {{ deviceType }}</p>
        <p><strong>当前模板:</strong> {{ currentTemplate?.name || '加载中...' }}</p>
        <p><strong>模板ID:</strong> {{ currentTemplate?.id || '无' }}</p>
        <p><strong>加载状态:</strong> {{ isLoading ? '加载中' : '已完成' }}</p>
      </div>
    </div>

    <!-- 简单的模板切换 -->
    <div class="template-switch">
      <h2>3. 切换模板</h2>
      <div class="switch-buttons">
        <button 
          v-for="template in availableTemplates" 
          :key="template.id"
          @click="switchTemplate(template.id)"
          :class="{ active: currentTemplate?.id === template.id }"
          class="template-btn"
        >
          {{ template.name }}
        </button>
      </div>
    </div>

    <!-- 事件日志 -->
    <div class="event-log">
      <h2>4. 事件日志</h2>
      <div class="log-container">
        <div v-if="logs.length === 0" class="no-logs">
          暂无事件，请尝试登录或切换模板
        </div>
        <div v-else class="log-list">
          <div v-for="(log, index) in logs" :key="index" class="log-item">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-event">{{ log.event }}</span>
            <span class="log-data">{{ log.data }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTemplate, useDeviceDetector } from '@ldesign/template'
import TemplateRenderer from '@ldesign/template/src/components/TemplateRenderer.vue'

// 设备检测
const { deviceType } = useDeviceDetector()

// 模板管理 - 最简单的配置
const {
  currentTemplate,
  availableTemplates,
  isLoading,
  switchTemplate
} = useTemplate({
  category: 'login',
  autoDetectDevice: true
})

// 事件日志
const logs = ref<Array<{
  time: string
  event: string
  data: string
}>>([])

// 添加日志
const addLog = (event: string, data: any = {}) => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    event,
    data: typeof data === 'object' ? JSON.stringify(data) : String(data)
  })
  
  // 只保留最近10条
  if (logs.value.length > 10) {
    logs.value = logs.value.slice(0, 10)
  }
}

// 处理登录事件
const handleLogin = (loginData: any) => {
  addLog('用户登录', `用户名: ${loginData.username}`)
  
  // 简单的成功提示
  alert(`登录成功！欢迎 ${loginData.username}`)
}

// 组件挂载时记录
onMounted(() => {
  addLog('组件初始化', `设备类型: ${deviceType.value}`)
})
</script>

<style scoped>
.quick-start-example {
  max-width: 800px;
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
  margin-bottom: 3rem;
}

h2 {
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.simple-demo {
  margin-bottom: 3rem;
}

.status-info {
  margin-bottom: 3rem;
}

.info-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.info-card p {
  margin: 0.5rem 0;
  color: #374151;
}

.info-card strong {
  color: #1f2937;
}

.template-switch {
  margin-bottom: 3rem;
}

.switch-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.template-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.template-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.template-btn.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

.event-log {
  margin-bottom: 2rem;
}

.log-container {
  background: #1f2937;
  border-radius: 8px;
  padding: 1rem;
  min-height: 200px;
}

.no-logs {
  color: #9ca3af;
  text-align: center;
  padding: 2rem;
  font-style: italic;
}

.log-list {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
}

.log-item {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #374151;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #9ca3af;
  min-width: 80px;
}

.log-event {
  color: #60a5fa;
  min-width: 100px;
  font-weight: 500;
}

.log-data {
  color: #d1d5db;
  flex: 1;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quick-start-example {
    padding: 1rem;
  }
  
  .switch-buttons {
    flex-direction: column;
  }
  
  .template-btn {
    width: 100%;
    text-align: center;
  }
  
  .log-item {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .log-time,
  .log-event {
    min-width: auto;
  }
}
</style>
