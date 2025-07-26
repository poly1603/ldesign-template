import type { TemplateConfig } from '../../../../types'

export const config: TemplateConfig = {
  id: 'login-desktop-default',
  name: '默认登录模板',
  description: '简洁的桌面端登录模板',
  version: '1.0.0',
  author: 'LDesign Team',
  category: 'login',
  device: 'desktop',
  templateName: 'default',
  preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20clean%20login%20form%20desktop%20interface%20blue%20gradient&image_size=landscape_16_9',
  tags: ['登录', '表单', '简洁'],
  props: {
    title: {
      type: 'string',
      default: '用户登录',
      description: '登录页面标题'
    },
    logo: {
      type: 'string',
      default: '',
      description: '网站Logo'
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
    }
  },
  slots: {
    header: {
      description: '页面头部插槽'
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
      description: '登录事件',
      params: {
        username: 'string',
        password: 'string',
        rememberMe: 'boolean'
      }
    },
    forgotPassword: {
      description: '忘记密码事件'
    }
  }
}

export default config