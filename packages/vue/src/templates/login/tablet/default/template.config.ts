import type { TemplateConfig } from '@ldesign/template-core'

/**
 * 平板端默认登录模板配置
 */
export default {
  name: 'default',
  displayName: '平板端默认登录模板',
  description: '适合平板设备的居中卡片式登录页面',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['login', 'tablet', 'card', 'center'],
  props: {
    title: {
      type: String,
      default: '欢迎登录',
    },
    logo: {
      type: String,
      required: false,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
} satisfies TemplateConfig

