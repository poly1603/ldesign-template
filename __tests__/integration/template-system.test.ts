import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createApp } from 'vue'
import LDesignTemplate from '../../src/index'
import { useTemplate, useDeviceDetector } from '../../src'
import type { TemplateConfig } from '../../src/types'

// 完整的模板配置
const loginTemplates: TemplateConfig[] = [
  {
    id: 'login-desktop-default',
    name: '桌面端默认登录',
    description: '桌面端默认登录模板',
    version: '1.0.0',
    author: 'LDesign Team',
    category: 'login',
    device: 'desktop',
    templateName: 'default',
    preview: 'desktop-default.png',
    tags: ['登录', '桌面端', '默认'],
    props: {
      title: { type: 'string', default: '用户登录', description: '标题' },
      showRememberMe: { type: 'boolean', default: true, description: '显示记住我' }
    },
    slots: {
      header: { description: '头部插槽' },
      footer: { description: '底部插槽' }
    },
    events: {
      login: { description: '登录事件', params: { username: 'string', password: 'string' } }
    }
  },
  {
    id: 'login-mobile-default',
    name: '移动端默认登录',
    description: '移动端默认登录模板',
    version: '1.0.0',
    author: 'LDesign Team',
    category: 'login',
    device: 'mobile',
    templateName: 'default',
    preview: 'mobile-default.png',
    tags: ['登录', '移动端', '默认'],
    props: {
      title: { type: 'string', default: '登录', description: '标题' },
      showQuickLogin: { type: 'boolean', default: true, description: '显示快速登录' }
    },
    slots: {
      header: { description: '头部插槽' }
    },
    events: {
      login: { description: '登录事件', params: { username: 'string', password: 'string' } },
      quickLogin: { description: '快速登录事件', params: { phone: 'string', code: 'string' } }
    }
  }
]

// Mock 模板组件
const MockDesktopLoginTemplate = {
  name: 'DesktopLoginTemplate',
  props: ['title', 'showRememberMe'],
  emits: ['login'],
  template: `
    <div class="desktop-login">
      <h1>{{ title }}</h1>
      <form @submit.prevent="handleLogin">
        <input v-model="username" placeholder="用户名" data-testid="username" />
        <input v-model="password" type="password" placeholder="密码" data-testid="password" />
        <label v-if="showRememberMe">
          <input v-model="rememberMe" type="checkbox" data-testid="remember" />
          记住我
        </label>
        <button type="submit" data-testid="login-btn">登录</button>
      </form>
      <slot name="header"></slot>
      <slot name="footer"></slot>
    </div>
  `,
  data() {
    return { username: '', password: '', rememberMe: false }
  },
  methods: {
    handleLogin() {
      this.$emit('login', {
        username: this.username,
        password: this.password,
        rememberMe: this.rememberMe
      })
    }
  }
}

const MockMobileLoginTemplate = {
  name: 'MobileLoginTemplate',
  props: ['title', 'showQuickLogin'],
  emits: ['login', 'quickLogin'],
  template: `
    <div class="mobile-login">
      <h1>{{ title }}</h1>
      <div class="login-tabs">
        <button @click="mode = 'password'" :class="{ active: mode === 'password' }" data-testid="password-tab">
          密码登录
        </button>
        <button v-if="showQuickLogin" @click="mode = 'quick'" :class="{ active: mode === 'quick' }" data-testid="quick-tab">
          快速登录
        </button>
      </div>
      <form v-if="mode === 'password'" @submit.prevent="handleLogin" data-testid="password-form">
        <input v-model="username" placeholder="用户名" data-testid="username" />
        <input v-model="password" type="password" placeholder="密码" data-testid="password" />
        <button type="submit" data-testid="login-btn">登录</button>
      </form>
      <form v-if="mode === 'quick'" @submit.prevent="handleQuickLogin" data-testid="quick-form">
        <input v-model="phone" placeholder="手机号" data-testid="phone" />
        <input v-model="code" placeholder="验证码" data-testid="code" />
        <button type="submit" data-testid="quick-login-btn">快速登录</button>
      </form>
      <slot name="header"></slot>
    </div>
  `,
  data() {
    return {
      mode: 'password',
      username: '',
      password: '',
      phone: '',
      code: ''
    }
  },
  methods: {
    handleLogin() {
      this.$emit('login', {
        username: this.username,
        password: this.password
      })
    },
    handleQuickLogin() {
      this.$emit('quickLogin', {
        phone: this.phone,
        code: this.code
      })
    }
  }
}

// Mock 模板加载器
vi.mock('../../src/utils/template-loader', () => ({
  loadTemplateComponent: vi.fn((template: TemplateConfig) => {
    if (template.device === 'desktop') {
      return Promise.resolve(MockDesktopLoginTemplate)
    } else if (template.device === 'mobile') {
      return Promise.resolve(MockMobileLoginTemplate)
    }
    return Promise.reject(new Error('Template not found'))
  })
}))

describe('Template System Integration', () => {
  let app: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // 创建 Vue 应用实例
    app = createApp({})
    
    // 安装插件
    app.use(LDesignTemplate, {
      autoScan: false, // 禁用自动扫描
      enableDeviceDetection: true,
      enableCache: true
    })
  })

  afterEach(() => {
    if (app) {
      app.unmount()
    }
  })

  describe('插件安装和初始化', () => {
    it('应该正确安装插件', () => {
      expect(app.config.globalProperties.$templateManager).toBeDefined()
    })

    it('应该注册全局组件', () => {
      const components = app._context.components
      expect(components.TemplateRenderer).toBeDefined()
      expect(components.TemplateSelector).toBeDefined()
    })

    it('应该提供全局配置', () => {
      const provides = app._context.provides
      expect(provides.templateManagerConfig).toBeDefined()
    })
  })

  describe('完整的模板使用流程', () => {
    it('应该支持完整的模板使用流程', async () => {
      // 创建测试组件
      const TestComponent = {
        template: `
          <div>
            <TemplateRenderer
              :template="currentTemplate"
              :props="templateProps"
              @login="handleLogin"
              @quick-login="handleQuickLogin"
            >
              <template #header>
                <div class="custom-header">自定义头部</div>
              </template>
            </TemplateRenderer>
            <div class="debug-info">
              <p>设备类型: {{ deviceType }}</p>
              <p>当前模板: {{ currentTemplate?.name || '无' }}</p>
              <p>可用模板数量: {{ availableTemplates.length }}</p>
            </div>
          </div>
        `,
        setup() {
          // 手动注册模板
          const templateManager = app.config.globalProperties.$templateManager
          loginTemplates.forEach(template => {
            templateManager.registerTemplate(template)
          })

          const { deviceType } = useDeviceDetector()
          const {
            currentTemplate,
            availableTemplates,
            switchTemplate
          } = useTemplate({
            category: 'login',
            autoDetectDevice: true
          })

          const templateProps = {
            title: '集成测试登录',
            showRememberMe: true,
            showQuickLogin: true
          }

          const handleLogin = (data: any) => {
            console.log('登录:', data)
          }

          const handleQuickLogin = (data: any) => {
            console.log('快速登录:', data)
          }

          return {
            deviceType,
            currentTemplate,
            availableTemplates,
            templateProps,
            switchTemplate,
            handleLogin,
            handleQuickLogin
          }
        }
      }

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [app]
        }
      })

      await nextTick()

      // 验证基础渲染
      expect(wrapper.find('.debug-info').exists()).toBe(true)
      expect(wrapper.text()).toContain('可用模板数量: 2')

      // 验证模板渲染
      const hasDesktopTemplate = wrapper.find('.desktop-login').exists()
      const hasMobileTemplate = wrapper.find('.mobile-login').exists()
      expect(hasDesktopTemplate || hasMobileTemplate).toBe(true)

      // 验证自定义插槽
      expect(wrapper.find('.custom-header').exists()).toBe(true)
      expect(wrapper.find('.custom-header').text()).toBe('自定义头部')
    })
  })

  describe('设备自适应', () => {
    it('应该根据设备类型自动选择模板', async () => {
      // Mock 桌面设备
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200
      })

      const TestComponent = {
        template: `
          <div>
            <TemplateRenderer :template="currentTemplate" />
            <p data-testid="device-type">{{ deviceType }}</p>
            <p data-testid="template-device">{{ currentTemplate?.device || '无' }}</p>
          </div>
        `,
        setup() {
          const templateManager = app.config.globalProperties.$templateManager
          loginTemplates.forEach(template => {
            templateManager.registerTemplate(template)
          })

          const { deviceType } = useDeviceDetector()
          const { currentTemplate } = useTemplate({
            category: 'login',
            autoDetectDevice: true
          })

          return {
            deviceType,
            currentTemplate
          }
        }
      }

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [app]
        }
      })

      await nextTick()

      expect(wrapper.find('[data-testid="device-type"]').text()).toBe('desktop')
      expect(wrapper.find('[data-testid="template-device"]').text()).toBe('desktop')
      expect(wrapper.find('.desktop-login').exists()).toBe(true)
    })

    it('应该在设备类型变化时切换模板', async () => {
      const TestComponent = {
        template: `
          <div>
            <TemplateRenderer :template="currentTemplate" />
            <button @click="simulateMobile" data-testid="simulate-mobile">模拟移动设备</button>
          </div>
        `,
        setup() {
          const templateManager = app.config.globalProperties.$templateManager
          loginTemplates.forEach(template => {
            templateManager.registerTemplate(template)
          })

          const { currentTemplate, switchTemplate } = useTemplate({
            category: 'login',
            autoDetectDevice: false // 禁用自动检测以便手动控制
          })

          const simulateMobile = async () => {
            await switchTemplate('login-mobile-default')
          }

          return {
            currentTemplate,
            simulateMobile
          }
        }
      }

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [app]
        }
      })

      await nextTick()

      // 初始应该是桌面模板
      expect(wrapper.find('.desktop-login').exists()).toBe(true)

      // 切换到移动模板
      await wrapper.find('[data-testid="simulate-mobile"]').trigger('click')
      await nextTick()

      expect(wrapper.find('.mobile-login').exists()).toBe(true)
    })
  })

  describe('事件处理和交互', () => {
    it('应该正确处理模板事件', async () => {
      const loginHandler = vi.fn()
      const quickLoginHandler = vi.fn()

      const TestComponent = {
        template: `
          <TemplateRenderer
            :template="currentTemplate"
            :props="templateProps"
            @login="loginHandler"
            @quick-login="quickLoginHandler"
          />
        `,
        setup() {
          const templateManager = app.config.globalProperties.$templateManager
          loginTemplates.forEach(template => {
            templateManager.registerTemplate(template)
          })

          const { currentTemplate, switchTemplate } = useTemplate({
            category: 'login',
            autoDetectDevice: false
          })

          // 切换到移动模板以测试快速登录
          switchTemplate('login-mobile-default')

          const templateProps = {
            title: '测试登录',
            showQuickLogin: true
          }

          return {
            currentTemplate,
            templateProps,
            loginHandler,
            quickLoginHandler
          }
        }
      }

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [app]
        }
      })

      await nextTick()

      // 测试密码登录
      const usernameInput = wrapper.find('[data-testid="username"]')
      const passwordInput = wrapper.find('[data-testid="password"]')
      const loginBtn = wrapper.find('[data-testid="login-btn"]')

      await usernameInput.setValue('testuser')
      await passwordInput.setValue('testpass')
      await loginBtn.trigger('click')

      expect(loginHandler).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass'
      })

      // 测试快速登录
      const quickTab = wrapper.find('[data-testid="quick-tab"]')
      await quickTab.trigger('click')
      await nextTick()

      const phoneInput = wrapper.find('[data-testid="phone"]')
      const codeInput = wrapper.find('[data-testid="code"]')
      const quickLoginBtn = wrapper.find('[data-testid="quick-login-btn"]')

      await phoneInput.setValue('13800138000')
      await codeInput.setValue('123456')
      await quickLoginBtn.trigger('click')

      expect(quickLoginHandler).toHaveBeenCalledWith({
        phone: '13800138000',
        code: '123456'
      })
    })
  })

  describe('错误处理和降级', () => {
    it('应该处理模板加载失败', async () => {
      const { loadTemplateComponent } = await import('../../src/utils/template-loader')
      ;(loadTemplateComponent as any).mockRejectedValueOnce(new Error('网络错误'))

      const TestComponent = {
        template: `
          <div>
            <TemplateRenderer :template="currentTemplate" />
          </div>
        `,
        setup() {
          const templateManager = app.config.globalProperties.$templateManager
          templateManager.registerTemplate(loginTemplates[0])

          const { currentTemplate } = useTemplate({
            category: 'login'
          })

          return {
            currentTemplate
          }
        }
      }

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [app]
        }
      })

      await nextTick()
      await nextTick() // 等待异步加载完成

      // 应该显示错误状态
      expect(wrapper.find('.template-error').exists()).toBe(true)
    })

    it('应该支持降级到默认模板', async () => {
      const TestComponent = {
        template: `
          <div>
            <TemplateRenderer :template="currentTemplate" />
            <p data-testid="template-name">{{ currentTemplate?.name || '无模板' }}</p>
          </div>
        `,
        setup() {
          const templateManager = app.config.globalProperties.$templateManager
          loginTemplates.forEach(template => {
            templateManager.registerTemplate(template)
          })

          const { currentTemplate, switchTemplate } = useTemplate({
            category: 'login',
            fallback: 'default'
          })

          // 尝试切换到不存在的模板
          switchTemplate('non-existent-template')

          return {
            currentTemplate
          }
        }
      }

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [app]
        }
      })

      await nextTick()

      // 应该降级到默认模板
      const templateName = wrapper.find('[data-testid="template-name"]').text()
      expect(templateName).toContain('默认')
    })
  })

  describe('性能和缓存', () => {
    it('应该缓存已加载的模板', async () => {
      const { loadTemplateComponent } = await import('../../src/utils/template-loader')

      const TestComponent = {
        template: `
          <div>
            <TemplateRenderer :template="currentTemplate" />
            <button @click="reloadTemplate" data-testid="reload">重新加载</button>
          </div>
        `,
        setup() {
          const templateManager = app.config.globalProperties.$templateManager
          templateManager.registerTemplate(loginTemplates[0])

          const { currentTemplate, switchTemplate } = useTemplate({
            category: 'login'
          })

          const reloadTemplate = async () => {
            await switchTemplate(loginTemplates[0].id)
          }

          return {
            currentTemplate,
            reloadTemplate
          }
        }
      }

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [app]
        }
      })

      await nextTick()

      // 重新加载相同模板
      await wrapper.find('[data-testid="reload"]').trigger('click')
      await nextTick()

      // 由于缓存，应该只调用一次加载函数
      expect(loadTemplateComponent).toHaveBeenCalledTimes(1)
    })
  })
})
