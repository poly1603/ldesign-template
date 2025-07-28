import type { TemplateConfig } from '../../../../types'

export const config: TemplateConfig = {
  id: 'login-mobile-card',
  name: '移动端卡片登录模板',
  description: '采用卡片设计的移动端登录模板，具有现代感和层次感',
  version: '1.0.0',
  author: 'LDesign Team',
  category: 'login',
  device: 'mobile',
  templateName: 'card',
  preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20login%20card%20design%20gradient%20background%20floating%20card%20shadow&image_size=portrait_9_16',
  tags: ['登录', '移动端', '卡片', '渐变', '现代'],
  props: {
    title: {
      type: 'string',
      default: '欢迎回来',
      description: '登录页面标题'
    },
    subtitle: {
      type: 'string',
      default: '请登录您的账户继续使用',
      description: '登录页面副标题'
    },
    logo: {
      type: 'string',
      default: '',
      description: '网站Logo URL'
    },
    backgroundGradient: {
      type: 'string',
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: '背景渐变色'
    },
    cardBackground: {
      type: 'string',
      default: 'rgba(255, 255, 255, 0.95)',
      description: '卡片背景色'
    },
    primaryColor: {
      type: 'string',
      default: '#667eea',
      description: '主题色'
    },
    showRememberMe: {
      type: 'boolean',
      default: false,
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
    enableGlassEffect: {
      type: 'boolean',
      default: true,
      description: '是否启用玻璃态效果'
    },
    socialLogins: {
      type: 'array',
      default: [
        { name: 'apple', label: 'Apple ID', icon: 'fab fa-apple', color: '#000000' },
        { name: 'google', label: 'Google', icon: 'fab fa-google', color: '#ea4335' }
      ],
      description: '社交登录选项'
    },
    enableQuickLogin: {
      type: 'boolean',
      default: true,
      description: '是否启用快速登录'
    },
    showWelcomeMessage: {
      type: 'boolean',
      default: true,
      description: '是否显示欢迎信息'
    }
  },
  slots: {
    header: {
      description: '页面头部插槽'
    },
    welcome: {
      description: '欢迎信息插槽'
    },
    footer: {
      description: '页面底部插槽'
    },
    extra: {
      description: '额外内容插槽'
    },
    'card-header': {
      description: '卡片头部插槽'
    },
    'card-footer': {
      description: '卡片底部插槽'
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
    cardSwipe: {
      description: '卡片滑动时触发',
      params: {
        direction: 'string'
      }
    }
  }
}

export default config
