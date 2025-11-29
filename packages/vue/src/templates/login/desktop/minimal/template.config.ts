import type { TemplateConfig } from '@ldesign/template-core'

export default {
  name: 'minimal',
  displayName: '简约分栏',
  description: '左右分栏布局，暗色品牌展示区',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['split', 'dark', 'brand'],
  props: {
    title: { type: String, default: '欢迎登录' },
    logo: { type: String, required: false },
    onSubmit: { type: Function, required: true },
  },
} satisfies TemplateConfig

