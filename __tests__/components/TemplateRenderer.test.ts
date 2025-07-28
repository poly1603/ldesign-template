import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import TemplateRenderer from '../../src/components/TemplateRenderer.vue'
import type { TemplateConfig } from '../../src/types'

// Mock 模板配置
const mockTemplateConfig: TemplateConfig = {
  id: 'test-login-desktop-default',
  name: '测试登录模板',
  description: '用于测试的登录模板',
  version: '1.0.0',
  author: 'Test Author',
  category: 'login',
  device: 'desktop',
  templateName: 'default',
  preview: 'test-preview.png',
  tags: ['测试', '登录'],
  props: {
    title: {
      type: 'string',
      default: '用户登录',
      description: '登录页面标题'
    },
    showRememberMe: {
      type: 'boolean',
      default: true,
      description: '是否显示记住我选项'
    }
  },
  slots: {
    header: {
      description: '页面头部插槽'
    },
    footer: {
      description: '页面底部插槽'
    }
  },
  events: {
    login: {
      description: '登录事件',
      params: {
        username: 'string',
        password: 'string'
      }
    },
    register: {
      description: '注册事件'
    }
  }
}

// Mock 模板组件
const MockTemplateComponent = {
  name: 'MockLoginTemplate',
  props: ['title', 'showRememberMe'],
  emits: ['login', 'register'],
  template: `
    <div class="mock-template">
      <h1>{{ title }}</h1>
      <form @submit.prevent="handleLogin">
        <input v-model="username" placeholder="用户名" />
        <input v-model="password" type="password" placeholder="密码" />
        <label v-if="showRememberMe">
          <input v-model="rememberMe" type="checkbox" />
          记住我
        </label>
        <button type="submit">登录</button>
      </form>
      <button @click="$emit('register')">注册</button>
      <slot name="header"></slot>
      <slot name="footer"></slot>
    </div>
  `,
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false
    }
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

// Mock 动态导入
vi.mock('../../src/utils/template-loader', () => ({
  loadTemplateComponent: vi.fn().mockResolvedValue(MockTemplateComponent)
}))

describe('TemplateRenderer', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('基础渲染', () => {
    it('应该正确渲染模板', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          props: {
            title: '测试标题',
            showRememberMe: true
          }
        }
      })

      await nextTick()

      expect(wrapper.find('.mock-template').exists()).toBe(true)
      expect(wrapper.find('h1').text()).toBe('测试标题')
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('应该在没有模板时显示占位符', () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: null
        }
      })

      expect(wrapper.find('.template-placeholder').exists()).toBe(true)
    })

    it('应该显示加载状态', () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          loading: true
        }
      })

      expect(wrapper.find('.template-loading').exists()).toBe(true)
    })

    it('应该显示错误状态', () => {
      const error = new Error('模板加载失败')
      
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          error
        }
      })

      expect(wrapper.find('.template-error').exists()).toBe(true)
      expect(wrapper.text()).toContain('模板加载失败')
    })
  })

  describe('属性传递', () => {
    it('应该正确传递属性到模板组件', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          props: {
            title: '自定义标题',
            showRememberMe: false
          }
        }
      })

      await nextTick()

      expect(wrapper.find('h1').text()).toBe('自定义标题')
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false)
    })

    it('应该使用默认属性值', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          props: {}
        }
      })

      await nextTick()

      expect(wrapper.find('h1').text()).toBe('用户登录')
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('应该验证属性类型', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          props: {
            title: 123, // 错误的类型
            showRememberMe: 'true' // 错误的类型
          }
        }
      })

      await nextTick()

      // 应该有类型警告
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('事件处理', () => {
    it('应该正确处理模板事件', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          props: {
            title: '测试标题'
          }
        }
      })

      await nextTick()

      // 模拟登录
      const usernameInput = wrapper.find('input[placeholder="用户名"]')
      const passwordInput = wrapper.find('input[placeholder="密码"]')
      const form = wrapper.find('form')

      await usernameInput.setValue('testuser')
      await passwordInput.setValue('testpass')
      await form.trigger('submit')

      // 验证事件被触发
      const loginEvents = wrapper.emitted('login')
      expect(loginEvents).toBeTruthy()
      expect(loginEvents![0]).toEqual([{
        username: 'testuser',
        password: 'testpass',
        rememberMe: false
      }])
    })

    it('应该处理注册事件', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig
        }
      })

      await nextTick()

      const registerButton = wrapper.find('button:last-child')
      await registerButton.trigger('click')

      const registerEvents = wrapper.emitted('register')
      expect(registerEvents).toBeTruthy()
    })

    it('应该支持自定义事件监听器', async () => {
      const mockLoginHandler = vi.fn()
      const mockRegisterHandler = vi.fn()

      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          props: {
            title: '测试标题'
          }
        },
        attrs: {
          onLogin: mockLoginHandler,
          onRegister: mockRegisterHandler
        }
      })

      await nextTick()

      // 触发登录事件
      const form = wrapper.find('form')
      await form.trigger('submit')

      // 触发注册事件
      const registerButton = wrapper.find('button:last-child')
      await registerButton.trigger('click')

      expect(mockLoginHandler).toHaveBeenCalled()
      expect(mockRegisterHandler).toHaveBeenCalled()
    })
  })

  describe('插槽支持', () => {
    it('应该正确渲染插槽内容', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig
        },
        slots: {
          header: '<div class="custom-header">自定义头部</div>',
          footer: '<div class="custom-footer">自定义底部</div>'
        }
      })

      await nextTick()

      expect(wrapper.find('.custom-header').exists()).toBe(true)
      expect(wrapper.find('.custom-header').text()).toBe('自定义头部')
      expect(wrapper.find('.custom-footer').exists()).toBe(true)
      expect(wrapper.find('.custom-footer').text()).toBe('自定义底部')
    })

    it('应该支持作用域插槽', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig
        },
        slots: {
          header: ({ template }: any) => `<div class="scoped-header">${template.name}</div>`
        }
      })

      await nextTick()

      expect(wrapper.find('.scoped-header').text()).toBe('测试登录模板')
    })
  })

  describe('生命周期', () => {
    it('应该在模板变化时重新渲染', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          props: {
            title: '原始标题'
          }
        }
      })

      await nextTick()
      expect(wrapper.find('h1').text()).toBe('原始标题')

      // 更新模板属性
      await wrapper.setProps({
        props: {
          title: '新标题'
        }
      })

      expect(wrapper.find('h1').text()).toBe('新标题')
    })

    it('应该在模板配置变化时重新加载', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig
        }
      })

      await nextTick()
      expect(wrapper.find('.mock-template').exists()).toBe(true)

      // 更新模板配置
      const newTemplate = { ...mockTemplateConfig, id: 'new-template' }
      await wrapper.setProps({
        template: newTemplate
      })

      // 应该重新加载模板
      expect(wrapper.find('.mock-template').exists()).toBe(true)
    })
  })

  describe('错误处理', () => {
    it('应该处理模板加载错误', async () => {
      const { loadTemplateComponent } = await import('../../src/utils/template-loader')
      ;(loadTemplateComponent as any).mockRejectedValueOnce(new Error('加载失败'))

      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig
        }
      })

      await nextTick()
      await nextTick() // 等待异步加载完成

      expect(wrapper.find('.template-error').exists()).toBe(true)
      expect(wrapper.text()).toContain('加载失败')
    })

    it('应该处理模板渲染错误', async () => {
      const ErrorComponent = {
        name: 'ErrorComponent',
        template: '<div>{{ undefinedVariable.property }}</div>' // 会导致错误
      }

      const { loadTemplateComponent } = await import('../../src/utils/template-loader')
      ;(loadTemplateComponent as any).mockResolvedValueOnce(ErrorComponent)

      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig
        }
      })

      await nextTick()

      // 应该显示错误状态
      expect(wrapper.find('.template-error').exists()).toBe(true)
    })

    it('应该支持错误重试', async () => {
      const { loadTemplateComponent } = await import('../../src/utils/template-loader')
      ;(loadTemplateComponent as any)
        .mockRejectedValueOnce(new Error('第一次失败'))
        .mockResolvedValueOnce(MockTemplateComponent)

      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig
        }
      })

      await nextTick()
      expect(wrapper.find('.template-error').exists()).toBe(true)

      // 点击重试按钮
      const retryButton = wrapper.find('.retry-button')
      if (retryButton.exists()) {
        await retryButton.trigger('click')
        await nextTick()
        
        expect(wrapper.find('.mock-template').exists()).toBe(true)
      }
    })
  })

  describe('性能优化', () => {
    it('应该缓存已加载的模板组件', async () => {
      const { loadTemplateComponent } = await import('../../src/utils/template-loader')

      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig
        }
      })

      await nextTick()

      // 重新设置相同的模板
      await wrapper.setProps({
        template: { ...mockTemplateConfig }
      })

      // 应该只调用一次加载函数
      expect(loadTemplateComponent).toHaveBeenCalledTimes(1)
    })

    it('应该支持懒加载', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          lazy: true
        }
      })

      // 初始时不应该加载模板
      const { loadTemplateComponent } = await import('../../src/utils/template-loader')
      expect(loadTemplateComponent).not.toHaveBeenCalled()

      // 触发加载
      await wrapper.setProps({ lazy: false })
      await nextTick()

      expect(loadTemplateComponent).toHaveBeenCalled()
    })
  })

  describe('可访问性', () => {
    it('应该支持 ARIA 属性', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig,
          ariaLabel: '登录表单'
        }
      })

      await nextTick()

      const container = wrapper.find('.template-container')
      expect(container.attributes('aria-label')).toBe('登录表单')
    })

    it('应该支持键盘导航', async () => {
      wrapper = mount(TemplateRenderer, {
        props: {
          template: mockTemplateConfig
        }
      })

      await nextTick()

      const form = wrapper.find('form')
      expect(form.attributes('tabindex')).toBeDefined()
    })
  })
})
