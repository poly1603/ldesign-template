import type { TemplateConfig } from '@ldesign/template-core'

export default {
  name: 'minimal',
  displayName: '暗夜极简',
  description: '暗色主题，极简设计风格',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['dark', 'minimal', 'night'],
  props: {
    title: { type: String, default: '登录' },
    logo: { type: String, required: false },
    onSubmit: { type: Function, required: true },
  },
} satisfies TemplateConfig

