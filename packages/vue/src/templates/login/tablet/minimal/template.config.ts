import type { TemplateConfig } from '@ldesign/template-core'

export default {
  name: 'minimal',
  displayName: '清新蓝调',
  description: '蓝色渐变背景，图标输入框',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['blue', 'icon', 'gradient'],
  props: {
    title: { type: String, default: '欢迎登录' },
    logo: { type: String, required: false },
    onSubmit: { type: Function, required: true },
  },
} satisfies TemplateConfig

