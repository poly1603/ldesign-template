<template>
  <div class="example-app">
    <h1>LDesign Template 基础使用示例</h1>
    
    <!-- 使用 TemplateProvider 组件 -->
    <TemplateProvider
      category="default"
      :auto-detect-device="true"
      :enable-selector="true"
    >
      <!-- 自定义加载状态 -->
      <template #loading>
        <div class="loading-state">
          <div class="spinner"></div>
          <p>正在加载模板...</p>
        </div>
      </template>
      
      <!-- 自定义错误状态 -->
      <template #error="{ error, retry }">
        <div class="error-state">
          <h3>模板加载失败</h3>
          <p>{{ error.message }}</p>
          <button @click="retry">重试</button>
        </div>
      </template>
      
      <!-- 自定义空状态 -->
      <template #empty>
        <div class="empty-state">
          <p>没有找到可用的模板</p>
        </div>
      </template>
    </TemplateProvider>
    
    <!-- 手动使用 useTemplate Hook -->
    <div class="manual-control">
      <h2>手动控制示例</h2>
      <div class="controls">
        <button @click="switchToMobile">切换到移动端</button>
        <button @click="switchToTablet">切换到平板端</button>
        <button @click="switchToDesktop">切换到桌面端</button>
        <button @click="showSelector">显示模板选择器</button>
      </div>
      
      <div class="status">
        <p>当前设备类型: {{ deviceType }}</p>
        <p>当前模板: {{ currentTemplate?.name || '无' }}</p>
        <p>加载状态: {{ status }}</p>
      </div>
      
      <!-- 手动渲染模板 -->
      <TemplateRenderer
        v-if="currentTemplate"
        :template="currentTemplate"
        :props="templateProps"
        @render-complete="onRenderComplete"
        @render-error="onRenderError"
      />
    </div>
    
    <!-- 模板选择器 -->
    <TemplateSelector
      v-model:visible="selectorVisible"
      :templates="availableTemplates"
      :current-template="currentTemplate?.id"
      :category="'default'"
      :config="selectorConfig"
      @select="onTemplateSelect"
      @cancel="onSelectorCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  TemplateProvider,
  TemplateRenderer,
  TemplateSelector,
  useTemplate,
  useDeviceDetector
} from '../src'

// 使用设备检测
const { deviceType } = useDeviceDetector()

// 使用模板管理
const {
  currentTemplate,
  availableTemplates,
  status,
  error,
  switchTemplate,
  switchDevice,
  refreshTemplates
} = useTemplate({
  category: 'default',
  autoDetectDevice: true,
  enableStorage: true
})

// 模板选择器状态
const selectorVisible = ref(false)

// 模板选择器配置
const selectorConfig = {
  showSearch: true,
  showFilter: true,
  showPreview: false,
  itemsPerRow: 3,
  title: '选择模板',
  confirmText: '确认',
  cancelText: '取消'
}

// 模板属性
const templateProps = computed(() => ({
  title: '示例应用',
  subtitle: '这是一个使用 LDesign Template 的示例应用'
}))

// 切换设备类型
const switchToMobile = () => switchDevice('mobile')
const switchToTablet = () => switchDevice('tablet')
const switchToDesktop = () => switchDevice('desktop')

// 显示模板选择器
const showSelector = () => {
  selectorVisible.value = true
}

// 模板选择事件
const onTemplateSelect = (templateId: string) => {
  switchTemplate(templateId)
  selectorVisible.value = false
}

// 取消选择事件
const onSelectorCancel = () => {
  selectorVisible.value = false
}

// 渲染完成事件
const onRenderComplete = (template: any) => {
  console.log('模板渲染完成:', template)
}

// 渲染错误事件
const onRenderError = (error: Error) => {
  console.error('模板渲染错误:', error)
}
</script>

<style scoped>
.example-app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.example-app h1 {
  color: #333;
  text-align: center;
  margin-bottom: 40px;
}

.manual-control {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.manual-control h2 {
  margin-top: 0;
  color: #333;
}

.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.controls button {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.controls button:hover {
  background: #40a9ff;
}

.status {
  background: white;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  margin-bottom: 20px;
}

.status p {
  margin: 4px 0;
  color: #666;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.error-state {
  text-align: center;
  padding: 40px;
  color: #ff4d4f;
}

.error-state h3 {
  margin-top: 0;
  color: #ff4d4f;
}

.error-state button {
  padding: 8px 16px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
}

.error-state button:hover {
  background: #ff7875;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .example-app {
    padding: 16px;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .controls button {
    width: 100%;
  }
}
</style>