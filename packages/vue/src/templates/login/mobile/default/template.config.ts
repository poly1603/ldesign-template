import type { TemplateConfig } from '@ldesign/template-core'

export default {
  name: 'default',
  displayName: '渐变全屏',
  description: '渐变背景，简洁无标签设计',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['gradient', 'simple', 'fullscreen'],
  props: {
    title: { type: String, default: '欢迎登录' },
    logo: { type: String, required: false },
    onSubmit: { type: Function, required: true },
  },
} satisfies TemplateConfig

