// Template Integration Example for LDesign Template
// This file demonstrates how to integrate templates with different frameworks and libraries

import { 
  createTemplateManager, 
  useTemplate, 
  useDeviceDetector,
  useTemplateCache,
  useStorage
} from '../src'
import type { TemplateConfig, TemplateManagerConfig } from '../src/types'

// Example 1: Vue 3 Integration with Composition API
export const useVue3TemplateIntegration = () => {
  const { deviceType, isMobile, isTablet, isDesktop } = useDeviceDetector()
  
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

  // 响应式模板属性
  const templateProps = ref({
    title: '用户登录',
    logo: '/logo.png',
    showRememberMe: true,
    showForgotPassword: true,
    primaryColor: '#3b82f6'
  })

  // 事件处理
  const handleTemplateEvent = (eventName: string, data: any) => {
    console.log(`Template event: ${eventName}`, data)
    
    switch (eventName) {
      case 'login':
        handleLogin(data)
        break
      case 'register':
        handleRegister()
        break
      case 'forgotPassword':
        handleForgotPassword()
        break
      case 'socialLogin':
        handleSocialLogin(data)
        break
    }
  }

  const handleLogin = async (loginData: any) => {
    try {
      // 模拟登录API调用
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('登录成功:', result)
        // 处理登录成功逻辑
      }
    } catch (error) {
      console.error('登录失败:', error)
    }
  }

  const handleRegister = () => {
    // 跳转到注册页面
    console.log('跳转到注册页面')
  }

  const handleForgotPassword = () => {
    // 跳转到密码重置页面
    console.log('跳转到密码重置页面')
  }

  const handleSocialLogin = (data: any) => {
    console.log('社交登录:', data)
  }

  return {
    // 设备信息
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    
    // 模板状态
    currentTemplate,
    availableTemplates,
    isLoading,
    error,
    
    // 模板属性
    templateProps,
    
    // 方法
    switchTemplate,
    refreshTemplates,
    handleTemplateEvent
  }
}

// Example 2: React Integration (TypeScript)
export class ReactTemplateIntegration {
  private templateManager: any
  private currentTemplate: TemplateConfig | null = null
  private listeners: Map<string, Function[]> = new Map()

  constructor(config?: Partial<TemplateManagerConfig>) {
    this.templateManager = createTemplateManager(config)
    this.initialize()
  }

  private async initialize() {
    await this.templateManager.initialize()
    this.currentTemplate = await this.templateManager.getCurrentTemplate('login')
  }

  // React Hook 风格的方法
  useTemplate(category: string) {
    const [template, setTemplate] = useState<TemplateConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
      this.loadTemplate(category)
        .then(setTemplate)
        .catch(setError)
        .finally(() => setLoading(false))
    }, [category])

    return { template, loading, error }
  }

  async loadTemplate(category: string): Promise<TemplateConfig | null> {
    try {
      return await this.templateManager.getTemplate(category)
    } catch (error) {
      console.error('Failed to load template:', error)
      return null
    }
  }

  switchTemplate(templateId: string): Promise<boolean> {
    return this.templateManager.switchTemplate(templateId)
  }

  // 事件系统
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }
}

// Example 3: Angular Service Integration
export class AngularTemplateService {
  private templateManager: any
  private templateSubject = new BehaviorSubject<TemplateConfig | null>(null)
  private loadingSubject = new BehaviorSubject<boolean>(false)
  private errorSubject = new BehaviorSubject<Error | null>(null)

  public template$ = this.templateSubject.asObservable()
  public loading$ = this.loadingSubject.asObservable()
  public error$ = this.errorSubject.asObservable()

  constructor() {
    this.templateManager = createTemplateManager({
      autoScan: true,
      enableDeviceDetection: true,
      enableCache: true
    })
    
    this.initialize()
  }

  private async initialize() {
    try {
      await this.templateManager.initialize()
    } catch (error) {
      this.errorSubject.next(error as Error)
    }
  }

  async loadTemplate(category: string, device?: string): Promise<void> {
    this.loadingSubject.next(true)
    this.errorSubject.next(null)

    try {
      const template = await this.templateManager.getTemplate(category, device)
      this.templateSubject.next(template)
    } catch (error) {
      this.errorSubject.next(error as Error)
    } finally {
      this.loadingSubject.next(false)
    }
  }

  async switchTemplate(templateId: string): Promise<boolean> {
    try {
      const success = await this.templateManager.switchTemplate(templateId)
      if (success) {
        const template = await this.templateManager.getCurrentTemplate()
        this.templateSubject.next(template)
      }
      return success
    } catch (error) {
      this.errorSubject.next(error as Error)
      return false
    }
  }

  getAvailableTemplates(category: string): Promise<TemplateConfig[]> {
    return this.templateManager.getAvailableTemplates(category)
  }
}

// Example 4: Vanilla JavaScript Integration
export class VanillaTemplateIntegration {
  private templateManager: any
  private container: HTMLElement
  private currentTemplate: TemplateConfig | null = null

  constructor(containerId: string, config?: Partial<TemplateManagerConfig>) {
    this.container = document.getElementById(containerId)!
    if (!this.container) {
      throw new Error(`Container element with id "${containerId}" not found`)
    }

    this.templateManager = createTemplateManager(config)
    this.initialize()
  }

  private async initialize() {
    try {
      await this.templateManager.initialize()
      await this.loadDefaultTemplate()
    } catch (error) {
      this.renderError(error as Error)
    }
  }

  private async loadDefaultTemplate() {
    try {
      this.renderLoading()
      const template = await this.templateManager.getTemplate('login')
      this.currentTemplate = template
      await this.renderTemplate(template)
    } catch (error) {
      this.renderError(error as Error)
    }
  }

  private renderLoading() {
    this.container.innerHTML = `
      <div class="template-loading">
        <div class="spinner"></div>
        <p>正在加载模板...</p>
      </div>
    `
  }

  private renderError(error: Error) {
    this.container.innerHTML = `
      <div class="template-error">
        <h3>模板加载失败</h3>
        <p>${error.message}</p>
        <button onclick="location.reload()">重试</button>
      </div>
    `
  }

  private async renderTemplate(template: TemplateConfig) {
    if (!template) return

    // 动态加载模板组件
    try {
      const templateModule = await import(`../src/templates/${template.category}/${template.device}/${template.templateName}/LoginTemplate.vue`)
      
      // 这里需要根据实际的模板渲染逻辑来实现
      // 由于是 Vanilla JS，可能需要使用模板引擎或直接操作 DOM
      
      this.container.innerHTML = `
        <div class="template-container" data-template-id="${template.id}">
          <!-- 模板内容将在这里渲染 -->
          <div class="template-placeholder">
            <h2>${template.name}</h2>
            <p>${template.description}</p>
            <p>设备类型: ${template.device}</p>
            <p>模板版本: ${template.version}</p>
          </div>
        </div>
      `

      // 绑定事件
      this.bindEvents()
    } catch (error) {
      this.renderError(error as Error)
    }
  }

  private bindEvents() {
    // 绑定模板事件
    const container = this.container.querySelector('.template-container')
    if (container) {
      container.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        
        if (target.matches('[data-action="login"]')) {
          this.handleLogin()
        } else if (target.matches('[data-action="register"]')) {
          this.handleRegister()
        }
      })
    }
  }

  private handleLogin() {
    console.log('处理登录')
    // 触发自定义事件
    this.container.dispatchEvent(new CustomEvent('template:login', {
      detail: { templateId: this.currentTemplate?.id }
    }))
  }

  private handleRegister() {
    console.log('处理注册')
    this.container.dispatchEvent(new CustomEvent('template:register', {
      detail: { templateId: this.currentTemplate?.id }
    }))
  }

  async switchTemplate(templateId: string): Promise<boolean> {
    try {
      const success = await this.templateManager.switchTemplate(templateId)
      if (success) {
        const template = await this.templateManager.getCurrentTemplate()
        await this.renderTemplate(template)
      }
      return success
    } catch (error) {
      this.renderError(error as Error)
      return false
    }
  }

  destroy() {
    // 清理资源
    this.container.innerHTML = ''
    this.templateManager = null
    this.currentTemplate = null
  }
}

// Example 5: Express.js Server-Side Integration
export class ServerSideTemplateIntegration {
  private templateManager: any

  constructor() {
    this.templateManager = createTemplateManager({
      autoScan: true,
      enableCache: true,
      // 服务端不需要设备检测
      enableDeviceDetection: false
    })
  }

  async initialize() {
    await this.templateManager.initialize()
  }

  // Express 中间件
  middleware() {
    return async (req: any, res: any, next: any) => {
      // 从请求头检测设备类型
      const userAgent = req.headers['user-agent'] || ''
      const deviceType = this.detectDeviceFromUserAgent(userAgent)
      
      // 将模板管理器和设备类型添加到请求对象
      req.templateManager = this.templateManager
      req.deviceType = deviceType
      
      next()
    }
  }

  private detectDeviceFromUserAgent(userAgent: string): string {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      if (/iPad/.test(userAgent)) {
        return 'tablet'
      }
      return 'mobile'
    }
    return 'desktop'
  }

  // 渲染模板的路由处理器
  async renderTemplate(req: any, res: any) {
    try {
      const { category = 'login' } = req.params
      const deviceType = req.deviceType || 'desktop'
      
      const template = await this.templateManager.getTemplate(category, deviceType)
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found' })
      }

      // 返回模板配置和渲染数据
      res.json({
        template,
        deviceType,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // 获取可用模板列表
  async getAvailableTemplates(req: any, res: any) {
    try {
      const { category } = req.query
      const deviceType = req.deviceType || 'desktop'
      
      const templates = await this.templateManager.getAvailableTemplates(category, deviceType)
      
      res.json({
        templates,
        deviceType,
        count: templates.length
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

// 导出所有集成类
export {
  ReactTemplateIntegration,
  AngularTemplateService,
  VanillaTemplateIntegration,
  ServerSideTemplateIntegration
}

// 使用示例
/*
// Vue 3 使用示例
const { currentTemplate, templateProps, handleTemplateEvent } = useVue3TemplateIntegration()

// React 使用示例
const reactIntegration = new ReactTemplateIntegration()
const { template, loading, error } = reactIntegration.useTemplate('login')

// Angular 使用示例
const angularService = new AngularTemplateService()
angularService.template$.subscribe(template => {
  console.log('当前模板:', template)
})

// Vanilla JS 使用示例
const vanillaIntegration = new VanillaTemplateIntegration('app-container')

// Express.js 使用示例
const serverIntegration = new ServerSideTemplateIntegration()
app.use('/templates', serverIntegration.middleware())
app.get('/templates/:category', serverIntegration.renderTemplate.bind(serverIntegration))
*/
