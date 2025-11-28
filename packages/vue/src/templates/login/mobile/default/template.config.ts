import type { TemplateConfig } from '@ldesign/template-core'

/**
 * 移动端默认登录模板配置
 */
export default {
  name: 'default',
  displayName: '移动端默认登录模板',
  description: '适合移动设备的全屏登录页面，简洁易用',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['login', 'mobile', 'simple', 'fullscreen'],
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

