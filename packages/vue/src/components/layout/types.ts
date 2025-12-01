/**
 * 布局组件类型定义
 *
 * @module components/layout/types
 */

/** 标签项类型 */
export interface TabItem {
  /** 唯一标识 */
  key: string
  /** 显示标题 */
  title: string
  /** 图标 */
  icon?: string
  /** 是否可关闭 @default true */
  closable?: boolean
  /** 是否固定 @default false */
  pinned?: boolean
  /** 路由路径 */
  path?: string
}

