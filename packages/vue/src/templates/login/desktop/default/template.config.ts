import type { TemplateConfig } from '@ldesign/template-core'

export default {
  name: 'default',
  displayName: '经典卡片',
  description: '居中卡片式布局，紫色渐变背景',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['card', 'gradient', 'center'],
  props: {
    title: { type: String, default: '欢迎登录' },
    logo: { type: String, required: false },
    onSubmit: { type: Function, required: true },
  },
} satisfies TemplateConfig