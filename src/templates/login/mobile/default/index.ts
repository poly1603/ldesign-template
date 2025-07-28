import type { TemplateConfig } from '../../../../types'

export const config: TemplateConfig = {
  id: 'login-mobile-default',
  name: '移动端默认登录模板',
  description: '简洁清爽的移动端登录模板，专为手机屏幕优化',
  version: '1.0.0',
  author: 'LDesign Team',
  category: 'login',
  device: 'mobile',
  templateName: 'default',
  preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20login%20form%20clean%20simple%20white%20blue%20vertical%20layout&image_size=portrait_9_16',
  tags: ['登录', '移动端', '简洁', '响应式'],
  props: {
    title: {
      type: 'string',
      default: '登录',
      description: '登录页面标题'
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
    showRememberMe: {
      type: 'boolean',
      default: false,
      description: '是否显示记住我选项（移动端通常不需要）'
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
    enableBiometric: {
      type: 'boolean',
      default: true,
      description: '是否启用生物识别登录（指纹/面容）'
    },
    socialLogins: {
      type: 'array',
      default: [
        { name: 'wechat', label: '微信登录', icon: 'fab fa-weixin', color: '#07c160' },
        { name: 'qq', label: 'QQ登录', icon: 'fab fa-qq', color: '#12b7f5' }
      ],
      description: '社交登录选项'
    },
    enableQuickLogin: {
      type: 'boolean',
      default: true,
      description: '是否启用快速登录（短信验证码）'
    }
  },
  slots: {
    header: {
      description: '页面头部插槽，可以放置Logo或自定义标题'
    },
    footer: {
      description: '页面底部插槽，可以放置版权信息'
    },
    extra: {
      description: '额外内容插槽'
    },
    'quick-actions': {
      description: '快速操作插槽，可以放置快速登录按钮'
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
      description: '快速登录（短信验证码）时触发',
      params: {
        phone: 'string',
        code: 'string'
      }
    },
    biometricLogin: {
      description: '生物识别登录时触发'
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
        mode: 'string' // 'password' | 'sms' | 'biometric'
      }
    }
  }
}

export default config
