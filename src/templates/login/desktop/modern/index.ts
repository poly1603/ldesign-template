import type { TemplateConfig } from '../../../../types'

export const config: TemplateConfig = {
  id: 'login-desktop-modern',
  name: '现代登录模板',
  description: '采用现代化设计语言的桌面端登录模板，支持渐变背景和流畅动画',
  version: '1.0.0',
  author: 'LDesign Team',
  category: 'login',
  device: 'desktop',
  templateName: 'modern',
  preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20gradient%20login%20form%20desktop%20purple%20blue%20glass%20morphism&image_size=landscape_16_9',
  tags: ['登录', '现代', '渐变', '玻璃态', '动画'],
  props: {
    title: {
      type: 'string',
      default: '欢迎回来',
      description: '登录页面标题'
    },
    subtitle: {
      type: 'string',
      default: '请登录您的账户',
      description: '登录页面副标题'
    },
    logo: {
      type: 'string',
      default: '',
      description: '网站Logo URL'
    },
    backgroundColor: {
      type: 'string',
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: '背景渐变色'
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
    socialLogins: {
      type: 'array',
      default: [
        { name: 'google', label: 'Google', icon: 'fab fa-google' },
        { name: 'github', label: 'GitHub', icon: 'fab fa-github' }
      ],
      description: '社交登录选项'
    },
    enableGlassMorphism: {
      type: 'boolean',
      default: true,
      description: '是否启用玻璃态效果'
    },
    enableAnimations: {
      type: 'boolean',
      default: true,
      description: '是否启用动画效果'
    }
  },
  slots: {
    header: {
      description: '页面头部插槽，可以放置Logo或自定义标题'
    },
    footer: {
      description: '页面底部插槽，可以放置版权信息或其他链接'
    },
    extra: {
      description: '额外内容插槽，可以放置广告、公告或其他信息'
    },
    'social-login': {
      description: '社交登录插槽，可以自定义社交登录按钮'
    },
    'form-extra': {
      description: '表单额外字段插槽'
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
    inputFocus: {
      description: '输入框获得焦点时触发',
      params: {
        field: 'string'
      }
    },
    inputBlur: {
      description: '输入框失去焦点时触发',
      params: {
        field: 'string',
        value: 'string'
      }
    }
  }
}

export default config
