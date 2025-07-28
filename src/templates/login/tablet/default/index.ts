import type { TemplateConfig } from '../../../../types'

export const config: TemplateConfig = {
  id: 'login-tablet-default',
  name: '平板端默认登录模板',
  description: '专为平板设备优化的登录模板，平衡了桌面端和移动端的设计特点',
  version: '1.0.0',
  author: 'LDesign Team',
  category: 'login',
  device: 'tablet',
  templateName: 'default',
  preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=tablet%20login%20form%20horizontal%20layout%20clean%20modern%20blue%20white&image_size=landscape_16_9',
  tags: ['登录', '平板', '横屏', '简洁', '现代'],
  props: {
    title: {
      type: 'string',
      default: '用户登录',
      description: '登录页面标题'
    },
    subtitle: {
      type: 'string',
      default: '请输入您的账户信息',
      description: '登录页面副标题'
    },
    logo: {
      type: 'string',
      default: '',
      description: '网站Logo URL'
    },
    backgroundColor: {
      type: 'string',
      default: '#f8fafc',
      description: '背景颜色'
    },
    primaryColor: {
      type: 'string',
      default: '#3b82f6',
      description: '主题色'
    },
    layoutMode: {
      type: 'string',
      default: 'horizontal',
      description: '布局模式：horizontal（横向）或 vertical（纵向）'
    },
    showRememberMe: {
      type: 'boolean',
      default: true,
      description: '是否显示记住我选项'
    },
    showForgotPassword: {
      type: 'boolean',
      default: true,
      description: '是否显示忘记密码链接'
    },
    showRegisterLink: {
      type: 'boolean',
      default: true,
      description: '是否显示注册链接'
    },
    enableSplitView: {
      type: 'boolean',
      default: true,
      description: '是否启用分屏视图（左侧信息，右侧表单）'
    },
    leftPanelContent: {
      type: 'object',
      default: {
        title: '欢迎使用我们的服务',
        description: '安全、便捷、高效的数字化解决方案',
        features: ['数据安全保护', '多端同步', '7x24小时服务']
      },
      description: '左侧面板内容'
    },
    socialLogins: {
      type: 'array',
      default: [
        { name: 'google', label: 'Google', icon: 'fab fa-google' },
        { name: 'microsoft', label: 'Microsoft', icon: 'fab fa-microsoft' },
        { name: 'apple', label: 'Apple', icon: 'fab fa-apple' }
      ],
      description: '社交登录选项'
    },
    enableQuickLogin: {
      type: 'boolean',
      default: true,
      description: '是否启用快速登录'
    }
  },
  slots: {
    header: {
      description: '页面头部插槽'
    },
    'left-panel': {
      description: '左侧面板插槽（分屏模式下）'
    },
    'right-panel': {
      description: '右侧面板插槽（分屏模式下）'
    },
    footer: {
      description: '页面底部插槽'
    },
    extra: {
      description: '额外内容插槽'
    },
    'form-header': {
      description: '表单头部插槽'
    },
    'form-footer': {
      description: '表单底部插槽'
    }
  },
  events: {
    login: {
      description: '用户点击登录按钮时触发',
      params: {
        username: 'string',
        password: 'string',
        rememberMe: 'boolean'
      }
    },
    quickLogin: {
      description: '快速登录时触发',
      params: {
        phone: 'string',
        code: 'string'
      }
    },
    register: {
      description: '用户点击注册链接时触发'
    },
    forgotPassword: {
      description: '用户点击忘记密码时触发'
    },
    socialLogin: {
      description: '社交登录时触发',
      params: {
        provider: 'string',
        data: 'object'
      }
    },
    switchLoginMode: {
      description: '切换登录模式时触发',
      params: {
        mode: 'string'
      }
    },
    layoutChange: {
      description: '布局模式改变时触发',
      params: {
        mode: 'string'
      }
    }
  }
}

export default config
