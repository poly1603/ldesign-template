/**
 * 动画系统类型定义
 */

import type { CSSProperties } from 'vue'

/**
 * 动画类型
 */
export type AnimationType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'rotate'
  | 'flip'
  | 'bounce'
  | 'shake'
  | 'pulse'
  | 'parallax'
  | 'morph'
  | 'reveal'
  | 'typewriter'
  | 'gradient'
  | 'blur'
  | 'custom'

/**
 * 动画方向
 */
export type AnimationDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'in'
  | 'out'

/**
 * 缓动函数
 */
export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier'
  | 'spring'
  | 'elastic'
  | 'bounce'

/**
 * 动画配置
 */
export interface AnimationConfig {
  /** 动画类型 */
  type: AnimationType
  /** 动画时长（毫秒） */
  duration?: number
  /** 延迟时间（毫秒） */
  delay?: number
  /** 缓动函数 */
  easing?: EasingFunction | string
  /** 动画方向 */
  direction?: AnimationDirection
  /** 迭代次数 */
  iterations?: number | 'infinite'
  /** 是否自动播放 */
  autoPlay?: boolean
  /** 填充模式 */
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  /** 自定义属性 */
  properties?: Record<string, any>
}

/**
 * 动画状态
 */
export interface AnimationState {
  /** 是否正在播放 */
  playing: boolean
  /** 是否暂停 */
  paused: boolean
  /** 当前进度 (0-1) */
  progress: number
  /** 当前迭代次数 */
  iteration: number
  /** 是否完成 */
  finished: boolean
}

/**
 * 手势配置
 */
export interface GestureConfig {
  /** 是否启用拖拽 */
  drag?: boolean
  /** 是否启用旋转 */
  rotate?: boolean
  /** 是否启用缩放 */
  scale?: boolean
  /** 是否启用滑动 */
  swipe?: boolean
  /** 拖拽约束 */
  dragConstraints?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  /** 弹性系数 */
  dragElastic?: number
  /** 动量 */
  dragMomentum?: boolean
  /** 滑动阈值 */
  swipeThreshold?: number
  /** 滑动速度 */
  swipeVelocity?: number
}

/**
 * 视差配置
 */
export interface ParallaxConfig {
  /** 速度系数 */
  speed?: number
  /** 偏移量 */
  offset?: number
  /** 是否启用水平视差 */
  horizontal?: boolean
  /** 是否启用垂直视差 */
  vertical?: boolean
  /** 是否启用旋转 */
  rotate?: boolean
  /** 是否启用缩放 */
  scale?: boolean
  /** 最大偏移量 */
  maxOffset?: number
  /** 触发元素 */
  trigger?: string | HTMLElement
  /** 是否平滑过渡 */
  smooth?: boolean
}

/**
 * 滚动动画配置
 */
export interface ScrollAnimationConfig {
  /** 触发位置 */
  trigger?: 'top' | 'center' | 'bottom'
  /** 触发偏移 */
  offset?: number
  /** 是否只触发一次 */
  once?: boolean
  /** 滚动方向 */
  direction?: 'up' | 'down' | 'both'
  /** 进入动画 */
  enter?: AnimationConfig
  /** 离开动画 */
  leave?: AnimationConfig
  /** 进度回调 */
  onProgress?: (progress: number) => void
}



