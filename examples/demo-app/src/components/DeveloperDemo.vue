<template>
  <div class="developer-demo">
    <div class="demo-header">
      <h2>👨‍💻 模板开发演示</h2>
      <p>学习如何创建和自定义模板，掌握模板开发的最佳实践</p>
    </div>

    <div class="row">
      <!-- 左侧：代码编辑器 -->
      <div class="col-8 col-sm-12">
        <div class="card">
          <div class="card-header">
            <h3>📝 代码编辑器</h3>
            <div class="file-tabs">
              <button 
                v-for="file in codeFiles" 
                :key="file.name"
                @click="activeFile = file.name"
                :class="{ active: activeFile === file.name }"
                class="file-tab"
              >
                <i :class="file.icon"></i>
                {{ file.name }}
              </button>
            </div>
          </div>
          
          <div class="card-body">
            <div class="code-editor">
              <div class="editor-toolbar">
                <button @click="formatCode" class="btn btn-sm btn-outline">
                  <i class="fas fa-magic"></i>
                  格式化
                </button>
                <button @click="copyCode" class="btn btn-sm btn-outline">
                  <i class="fas fa-copy"></i>
                  复制
                </button>
                <button @click="downloadCode" class="btn btn-sm btn-outline">
                  <i class="fas fa-download"></i>
                  下载
                </button>
              </div>
              
              <div class="code-content">
                <pre><code :class="getCurrentFileLanguage()">{{ getCurrentFileContent() }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：预览和工具 -->
      <div class="col-4 col-sm-12">
        <div class="tools-panel">
          <!-- 模板生成器 -->
          <div class="card mb-3">
            <div class="card-header">
              <h4>🛠️ 模板生成器</h4>
            </div>
            <div class="card-body">
              <div class="generator-form">
                <div class="form-group">
                  <label>模板名称</label>
                  <input v-model="templateGenerator.name" type="text" class="form-control" placeholder="我的模板" />
                </div>
                
                <div class="form-group">
                  <label>设备类型</label>
                  <select v-model="templateGenerator.device" class="form-control">
                    <option value="desktop">桌面端</option>
                    <option value="tablet">平板端</option>
                    <option value="mobile">移动端</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label>模板风格</label>
                  <select v-model="templateGenerator.style" class="form-control">
                    <option value="default">默认</option>
                    <option value="modern">现代</option>
                    <option value="minimal">极简</option>
                    <option value="card">卡片</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label>主题色</label>
                  <input v-model="templateGenerator.primaryColor" type="color" class="form-control" />
                </div>
                
                <button @click="generateTemplate" class="btn btn-primary btn-sm">
                  <i class="fas fa-magic"></i>
                  生成模板
                </button>
              </div>
            </div>
          </div>

          <!-- 属性编辑器 -->
          <div class="card mb-3">
            <div class="card-header">
              <h4>⚙️ 属性编辑器</h4>
            </div>
            <div class="card-body">
              <div class="props-editor">
                <div 
                  v-for="(prop, key) in templateProps" 
                  :key="key"
                  class="prop-item"
                >
                  <div class="prop-header">
                    <span class="prop-name">{{ key }}</span>
                    <button @click="removeProp(key)" class="btn-remove">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <div class="prop-config">
                    <select v-model="prop.type" class="form-control form-control-sm">
                      <option value="string">String</option>
                      <option value="boolean">Boolean</option>
                      <option value="number">Number</option>
                      <option value="array">Array</option>
                      <option value="object">Object</option>
                    </select>
                    
                    <input 
                      v-model="prop.default" 
                      :type="getInputType(prop.type)"
                      class="form-control form-control-sm" 
                      placeholder="默认值"
                    />
                    
                    <input 
                      v-model="prop.description" 
                      type="text" 
                      class="form-control form-control-sm" 
                      placeholder="描述"
                    />
                  </div>
                </div>
                
                <button @click="addProp" class="btn btn-outline btn-sm">
                  <i class="fas fa-plus"></i>
                  添加属性
                </button>
              </div>
            </div>
          </div>

          <!-- 事件编辑器 -->
          <div class="card mb-3">
            <div class="card-header">
              <h4>📡 事件编辑器</h4>
            </div>
            <div class="card-body">
              <div class="events-editor">
                <div 
                  v-for="(event, key) in templateEvents" 
                  :key="key"
                  class="event-item"
                >
                  <div class="event-header">
                    <span class="event-name">{{ key }}</span>
                    <button @click="removeEvent(key)" class="btn-remove">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <input 
                    v-model="event.description" 
                    type="text" 
                    class="form-control form-control-sm" 
                    placeholder="事件描述"
                  />
                  
                  <textarea 
                    v-model="event.params" 
                    class="form-control form-control-sm" 
                    placeholder="参数 (JSON格式)"
                    rows="2"
                  ></textarea>
                </div>
                
                <button @click="addEvent" class="btn btn-outline btn-sm">
                  <i class="fas fa-plus"></i>
                  添加事件
                </button>
              </div>
            </div>
          </div>

          <!-- 预览控制 -->
          <div class="card">
            <div class="card-header">
              <h4>👀 预览控制</h4>
            </div>
            <div class="card-body">
              <div class="preview-controls">
                <button @click="previewTemplate" class="btn btn-primary btn-sm">
                  <i class="fas fa-eye"></i>
                  预览模板
                </button>
                
                <button @click="validateTemplate" class="btn btn-secondary btn-sm">
                  <i class="fas fa-check"></i>
                  验证模板
                </button>
                
                <button @click="exportTemplate" class="btn btn-success btn-sm">
                  <i class="fas fa-download"></i>
                  导出模板
                </button>
              </div>
              
              <div class="validation-result mt-2" v-if="validationResult">
                <div :class="validationResult.valid ? 'text-success' : 'text-danger'">
                  <i :class="validationResult.valid ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                  {{ validationResult.message }}
                </div>
                
                <ul v-if="validationResult.errors && validationResult.errors.length > 0" class="error-list">
                  <li v-for="error in validationResult.errors" :key="error">{{ error }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模板预览模态框 -->
    <div v-if="showPreview" class="preview-modal" @click="closePreview">
      <div class="preview-content" @click.stop>
        <div class="preview-header">
          <h3>模板预览</h3>
          <button @click="closePreview" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="preview-body">
          <div class="preview-template">
            <!-- 这里会渲染预览的模板 -->
            <div class="template-placeholder">
              <h2>{{ templateGenerator.name || '模板预览' }}</h2>
              <p>设备类型: {{ templateGenerator.device }}</p>
              <p>风格: {{ templateGenerator.style }}</p>
              <div class="preview-form" :style="{ '--primary-color': templateGenerator.primaryColor }">
                <input type="text" placeholder="用户名" />
                <input type="password" placeholder="密码" />
                <button class="preview-btn">登录</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue'

// 注入通知函数
const showNotification = inject('showNotification') as Function

// 代码文件
const activeFile = ref('config.ts')
const codeFiles = [
  { name: 'config.ts', icon: 'fab fa-js-square', language: 'typescript' },
  { name: 'template.vue', icon: 'fab fa-vuejs', language: 'html' },
  { name: 'styles.less', icon: 'fab fa-css3-alt', language: 'css' }
]

// 模板生成器
const templateGenerator = reactive({
  name: '我的登录模板',
  device: 'desktop',
  style: 'default',
  primaryColor: '#667eea'
})

// 模板属性
const templateProps = reactive({
  title: {
    type: 'string',
    default: '用户登录',
    description: '页面标题'
  },
  showRememberMe: {
    type: 'boolean',
    default: true,
    description: '是否显示记住我选项'
  }
})

// 模板事件
const templateEvents = reactive({
  login: {
    description: '用户登录事件',
    params: '{ username: string, password: string }'
  }
})

// 预览相关
const showPreview = ref(false)
const validationResult = ref<{
  valid: boolean
  message: string
  errors?: string[]
} | null>(null)

// 代码内容
const codeContents = {
  'config.ts': `import type { TemplateConfig } from '@ldesign/template'

export const config: TemplateConfig = {
  id: 'login-${templateGenerator.device}-${templateGenerator.style}',
  name: '${templateGenerator.name}',
  description: '自定义登录模板',
  version: '1.0.0',
  author: '开发者',
  category: 'login',
  device: '${templateGenerator.device}',
  templateName: '${templateGenerator.style}',
  preview: '/preview.png',
  tags: ['登录', '${templateGenerator.device}', '自定义'],
  props: ${JSON.stringify(templateProps, null, 2)},
  events: ${JSON.stringify(templateEvents, null, 2)}
}

export default config`,

  'template.vue': `<template>
  <div class="custom-login-template">
    <div class="login-header">
      <h1>{{ title }}</h1>
    </div>
    
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <input 
          v-model="username" 
          type="text" 
          placeholder="用户名"
          class="form-input"
        />
      </div>
      
      <div class="form-group">
        <input 
          v-model="password" 
          type="password" 
          placeholder="密码"
          class="form-input"
        />
      </div>
      
      <div v-if="showRememberMe" class="form-group">
        <label class="checkbox-label">
          <input v-model="rememberMe" type="checkbox" />
          记住我
        </label>
      </div>
      
      <button type="submit" class="login-button">
        登录
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  showRememberMe?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '用户登录',
  showRememberMe: true
})

const emit = defineEmits<{
  login: [data: { username: string; password: string; rememberMe: boolean }]
}>()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)

const handleLogin = () => {
  emit('login', {
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value
  })
}
</script>`,

  'styles.less': `.custom-login-template {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  .login-header {
    text-align: center;
    margin-bottom: 2rem;

    h1 {
      margin: 0;
      color: ${templateGenerator.primaryColor};
      font-size: 1.75rem;
      font-weight: 600;
    }
  }

  .login-form {
    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: ${templateGenerator.primaryColor};
      }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #6b7280;
      cursor: pointer;
    }

    .login-button {
      width: 100%;
      padding: 0.875rem;
      background: ${templateGenerator.primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: darken(${templateGenerator.primaryColor}, 10%);
        transform: translateY(-1px);
      }
    }
  }
}`
}

// 方法
const getCurrentFileContent = () => {
  return codeContents[activeFile.value as keyof typeof codeContents] || ''
}

const getCurrentFileLanguage = () => {
  const file = codeFiles.find(f => f.name === activeFile.value)
  return file ? `language-${file.language}` : 'language-text'
}

const formatCode = () => {
  showNotification('success', '代码已格式化')
}

const copyCode = () => {
  navigator.clipboard.writeText(getCurrentFileContent())
  showNotification('success', '代码已复制到剪贴板')
}

const downloadCode = () => {
  const content = getCurrentFileContent()
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = activeFile.value
  a.click()
  URL.revokeObjectURL(url)
  showNotification('success', '文件已下载')
}

const generateTemplate = () => {
  // 更新代码内容
  showNotification('success', '模板已生成')
}

const addProp = () => {
  const propName = prompt('请输入属性名称:')
  if (propName && !templateProps[propName]) {
    templateProps[propName] = {
      type: 'string',
      default: '',
      description: ''
    }
  }
}

const removeProp = (key: string) => {
  delete templateProps[key]
}

const addEvent = () => {
  const eventName = prompt('请输入事件名称:')
  if (eventName && !templateEvents[eventName]) {
    templateEvents[eventName] = {
      description: '',
      params: '{}'
    }
  }
}

const removeEvent = (key: string) => {
  delete templateEvents[key]
}

const getInputType = (type: string) => {
  switch (type) {
    case 'number': return 'number'
    case 'boolean': return 'checkbox'
    default: return 'text'
  }
}

const previewTemplate = () => {
  showPreview.value = true
}

const closePreview = () => {
  showPreview.value = false
}

const validateTemplate = () => {
  const errors: string[] = []
  
  if (!templateGenerator.name.trim()) {
    errors.push('模板名称不能为空')
  }
  
  if (Object.keys(templateProps).length === 0) {
    errors.push('至少需要定义一个属性')
  }
  
  if (Object.keys(templateEvents).length === 0) {
    errors.push('至少需要定义一个事件')
  }
  
  validationResult.value = {
    valid: errors.length === 0,
    message: errors.length === 0 ? '模板验证通过' : '模板验证失败',
    errors: errors.length > 0 ? errors : undefined
  }
  
  showNotification(
    errors.length === 0 ? 'success' : 'error',
    errors.length === 0 ? '模板验证通过' : '模板验证失败'
  )
}

const exportTemplate = () => {
  const templateData = {
    config: templateGenerator,
    props: templateProps,
    events: templateEvents,
    files: codeContents
  }
  
  const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${templateGenerator.name.replace(/\s+/g, '-').toLowerCase()}-template.json`
  a.click()
  URL.revokeObjectURL(url)
  
  showNotification('success', '模板已导出')
}
</script>

<style scoped>
.developer-demo {
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

.file-tabs {
  display: flex;
  gap: 0.25rem;
}

.file-tab {
  padding: 0.5rem 1rem;
  border: none;
  background: #f8f9fa;
  color: #495057;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.file-tab.active {
  background: #667eea;
  color: white;
}

.code-editor {
  background: #1e1e1e;
  border-radius: 0 6px 6px 6px;
  overflow: hidden;
}

.editor-toolbar {
  background: #2d2d2d;
  padding: 0.5rem 1rem;
  display: flex;
  gap: 0.5rem;
}

.editor-toolbar .btn {
  background: #404040;
  color: #ccc;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.code-content {
  padding: 1rem;
  max-height: 500px;
  overflow: auto;
}

.code-content pre {
  margin: 0;
  color: #d4d4d4;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.tools-panel .card {
  margin-bottom: 1rem;
}

.generator-form .form-group {
  margin-bottom: 1rem;
}

.prop-item,
.event-item {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

.prop-header,
.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.prop-name,
.event-name {
  font-weight: 500;
  color: #495057;
}

.btn-remove {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.btn-remove:hover {
  background: #f8d7da;
}

.prop-config {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 0.5rem;
}

.form-control-sm {
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
}

.preview-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.validation-result {
  padding: 0.75rem;
  border-radius: 6px;
  background: #f8f9fa;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.error-list {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
  font-size: 0.8rem;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  max-height: 80vh;
  overflow: auto;
  margin: 2rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.preview-header h3 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
}

.preview-body {
  padding: 2rem;
}

.template-placeholder {
  text-align: center;
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
}

.preview-form {
  max-width: 300px;
  margin: 2rem auto 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-form input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
}

.preview-btn {
  padding: 0.75rem;
  background: var(--primary-color, #667eea);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 768px) {
  .file-tabs {
    flex-wrap: wrap;
  }
  
  .prop-config {
    grid-template-columns: 1fr;
  }
  
  .preview-content {
    margin: 1rem;
    max-height: 90vh;
  }
}
</style>
