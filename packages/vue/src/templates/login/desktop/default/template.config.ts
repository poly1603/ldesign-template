import type { TemplateConfig } from '@ldesign/template-core'

export default {
  name: 'default',
  displayName: '默认登录模板',
  description: '简洁的居中式登录页面,适合大多数场景',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['login', 'simple', 'center'],
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