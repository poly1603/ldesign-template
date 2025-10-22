/**
 * 核心动画功能 - 轻量级
 * 仅包含最常用的动画：fade, slide, scale
 */

import type { CSSProperties } from 'vue'
import { reactive } from 'vue'
import type { AnimationConfig, AnimationDirection, AnimationState, AnimationType, EasingFunction } from './types'

/**
 * 单个动画实例
 */
export class Animation {
  private element: HTMLElement
  private config: AnimationConfig
  private state: AnimationState
  private animation: globalThis.Animation | null = null
  private initialStyles: CSSProperties = {}

  constructor(element: HTMLElement, config: AnimationConfig) {
    this.element = element
    this.config = config
    this.state = reactive({
      playing: false,
      paused: false,
      progress: 0,
      iteration: 0,
      finished: false
    })

    this.saveInitialStyles()
    if (config.autoPlay) {
      this.play()
    }
  }

  private saveInitialStyles() {
    const computedStyles = window.getComputedStyle(this.element)
    this.initialStyles = {
      transform: computedStyles.transform,
      opacity: computedStyles.opacity,
    }
  }

  /**
   * 获取关键帧 - 仅核心动画类型
   */
  private getKeyframes(): Keyframe[] {
    const { type, direction, properties } = this.config

    switch (type) {
      case 'fade':
        return [
          { opacity: direction === 'out' ? 1 : 0 },
          { opacity: direction === 'out' ? 0 : 1 }
        ]

      case 'slide': {
        const distance = properties?.distance || 100
        const translateMap: Record<string, string> = {
          up: `translateY(${distance}px)`,
          down: `translateY(-${distance}px)`,
          left: `translateX(${distance}px)`,
          right: `translateX(-${distance}px)`
        }
        return [
          { transform: translateMap[direction || 'up'] || 'none' },
          { transform: 'translateX(0) translateY(0)' }
        ]
      }

      case 'scale':
        return [
          { transform: direction === 'out' ? 'scale(1)' : 'scale(0)' },
          { transform: direction === 'out' ? 'scale(0)' : 'scale(1)' }
        ]

      case 'custom':
        return properties?.keyframes || []

      default:
        console.warn(`[Animation] Type "${type}" not supported in core. Use advanced module.`)
        return []
    }
  }

  private getAnimationOptions(): KeyframeAnimationOptions {
    const { duration, delay, easing, iterations, fillMode } = this.config

    return {
      duration: duration || 300,
      delay: delay || 0,
      easing: this.getEasing(easing),
      iterations: iterations === 'infinite' ? Infinity : (iterations || 1),
      fill: fillMode || 'both'
    }
  }

  private getEasing(easing?: EasingFunction | string): string {
    if (!easing) return 'ease'

    const easingMap: Record<EasingFunction, string> = {
      linear: 'linear',
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
      'cubic-bezier': 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.5, 1.5, 0.5, 1)',
      elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      bounce: 'cubic-bezier(0.87, -0.41, 0.19, 1.44)'
    }

    return easingMap[easing as EasingFunction] || easing
  }

  play() {
    if (this.state.playing && !this.state.paused) return

    const keyframes = this.getKeyframes()
    const options = this.getAnimationOptions()

    if (this.state.paused && this.animation) {
      this.animation.play()
      this.state.paused = false
    } else {
      this.animation = this.element.animate(keyframes, options)
      this.state.playing = true
      this.state.finished = false

      this.animation.onfinish = () => {
        this.state.finished = true
        this.state.playing = false
      }
    }
  }

  pause() {
    if (this.animation && this.state.playing) {
      this.animation.pause()
      this.state.paused = true
    }
  }

  stop() {
    if (this.animation) {
      this.animation.cancel()
      this.state.playing = false
      this.state.paused = false
      this.state.finished = true
    }
  }

  reset() {
    this.stop()
    this.state.progress = 0
    this.state.iteration = 0
    Object.assign(this.element.style, this.initialStyles)
  }

  destroy() {
    this.stop()
    this.animation = null
  }

  getState(): AnimationState {
    return this.state
  }
}

/**
 * 动画控制器 - 轻量级
 */
export class AnimationController {
  private animations: Map<string, Animation>
  private disposed = false

  constructor() {
    this.animations = new Map()
  }

  create(id: string, element: HTMLElement, config: AnimationConfig): Animation {
    const animation = new Animation(element, config)
    this.animations.set(id, animation)
    return animation
  }

  play(id: string) {
    this.animations.get(id)?.play()
  }

  pause(id: string) {
    this.animations.get(id)?.pause()
  }

  stop(id: string) {
    this.animations.get(id)?.stop()
  }

  reset(id: string) {
    this.animations.get(id)?.reset()
  }

  destroy(id: string) {
    const animation = this.animations.get(id)
    if (animation) {
      animation.destroy()
      this.animations.delete(id)
    }
  }

  destroyAll() {
    if (this.disposed) return

    this.animations.forEach(animation => animation.destroy())
    this.animations.clear()
    this.disposed = true
  }
}

// 导出单例
export const animationController = new AnimationController()



