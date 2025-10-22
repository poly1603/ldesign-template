/**
 * 列表模板 - 桌面端卡片布局
 */
import type { TemplateConfig } from '../../../../types'

export default {
  name: 'card',
  displayName: '卡片列表',
  description: '卡片式布局列表，支持响应式网格和虚拟滚动',
  version: '1.0.0',
  author: 'LDesign Team',
  tags: ['list', 'card', 'grid', 'responsive'],
  isDefault: true,
  responsive: true,
  minWidth: 768,
  preview: '/previews/list-card.png',
} as TemplateConfig



