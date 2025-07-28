import type { TemplateConfig } from '../../../../types'

export const config: TemplateConfig = {
  id: 'login-tablet-split',
  name: '平板端分屏登录模板',
  description: '采用分屏设计的平板端登录模板，左侧展示品牌信息，右侧为登录表单',
  version: '1.0.0',
  author: 'LDesign Team',
  category: 'login',
  device: 'tablet',
  templateName: 'split',
  preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=tablet%20split%20screen%20login%20left%20brand%20right%20form%20modern%20design&image_size=landscape_16_9',
  tags: ['登录', '平板', '分屏', '品牌', '现代'],
  props: {
    title: {
      type: 'string',
      default: '登录您的账户',
      description: '登录表单标题'
    },
    brandTitle: {
      type: 'string',
      default: '欢迎来到未来',
      description: '品牌区域标题'
    },
    brandSubtitle: {
      type: 'string',
      default: '体验下一代数字化解决方案',
      description: '品牌区域副标题'
    },
    logo: {
      type: 'string',
      default: '',
      description: '网站Logo URL'
    },
    brandImage: {
      type: 'string',
      default: '',
      description: '品牌展示图片URL'
    },
    brandGradient: {
      type: 'string',
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: '品牌区域背景渐变'
    },
    formBackground: {
      type: 'string',
      default: '#ffffff',
      description: '表单区域背景色'
    },
    primaryColor: {
      type: 'string',
      default: '#667eea',
      description: '主题色'
    },
    splitRatio: {
      type: 'string',
      default: '60:40',
      description: '分屏比例（品牌区:表单区）'
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
    brandFeatures: {
      type: 'array',
      default: [
        { icon: 'fas fa-shield-alt', title: '安全可靠', description: '企业级安全保护' },
        { icon: 'fas fa-sync-alt', title: '实时同步', description: '多设备数据同步' },
        { icon: 'fas fa-headset', title: '专业支持', description: '7x24小时客服' }
      ],
      description: '品牌特性列表'
    },
    socialLogins: {
      type: 'array',
      default: [
        { name: 'google', label: 'Google', icon: 'fab fa-google' },
        { name: 'microsoft', label: 'Microsoft', icon: 'fab fa-microsoft' },
        { name: 'github', label: 'GitHub', icon: 'fab fa-github' }
      ],
      description: '社交登录选项'
    },
    enableAnimations: {
      type: 'boolean',
      default: true,
      description: '是否启用动画效果'
    },
    enableParallax: {
      type: 'boolean',
      default: true,
      description: '是否启用视差效果'
    }
  },
  slots: {
    header: {
      description: '页面头部插槽'
    },
    'brand-header': {
      description: '品牌区域头部插槽'
    },
    'brand-content': {
      description: '品牌区域内容插槽'
    },
    'brand-footer': {
      description: '品牌区域底部插槽'
    },
    'form-header': {
      description: '表单区域头部插槽'
    },
    'form-content': {
      description: '表单区域内容插槽'
    },
    'form-footer': {
      description: '表单区域底部插槽'
    },
    footer: {
      description: '页面底部插槽'
    },
    extra: {
      description: '额外内容插槽'
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
    brandFeatureClick: {
      description: '点击品牌特性时触发',
      params: {
        feature: 'object'
      }
    },
    splitResize: {
      description: '分屏比例调整时触发',
      params: {
        ratio: 'string'
      }
    }
  }
}

export default config
