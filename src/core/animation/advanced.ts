/**
 * 高级动画模块 - 按需加载
 * 包含rotate, flip, bounce, shake, pulse等高级动画
 */

import type { CSSProperties } from 'vue'
import { reactive } from 'vue'
import type { AnimationConfig, AnimationState } from './types'

/**
 * 高级动画类
 */
export class AdvancedAnimation {
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
      filter: computedStyles.filter
    }
  }

  /**
   * 获取高级动画关键帧
   */
  private getKeyframes(): Keyframe[] {
    const { type, direction, properties } = this.config

    switch (type) {
      case 'rotate': {
        const degrees = properties?.degrees || 360
        return [
          { transform: 'rotate(0deg)' },
          { transform: `rotate(${degrees}deg)` }
        ]
      }

      case 'flip': {
        const axis = properties?.axis || 'Y'
        return [
          { transform: `rotate${axis}(0deg)` },
          { transform: `rotate${axis}(180deg)` }
        ]
      }

      case 'bounce':
        return [
          { transform: 'translateY(0)', offset: 0 },
          { transform: 'translateY(-30px)', offset: 0.4 },
          { transform: 'translateY(0)', offset: 0.6 },
          { transform: 'translateY(-15px)', offset: 0.8 },
          { transform: 'translateY(0)', offset: 1 }
        ]

      case 'shake':
        return [
          { transform: 'translateX(0)', offset: 0 },
          { transform: 'translateX(-10px)', offset: 0.1 },
          { transform: 'translateX(10px)', offset: 0.2 },
          { transform: 'translateX(-10px)', offset: 0.3 },
          { transform: 'translateX(10px)', offset: 0.4 },
          { transform: 'translateX(-10px)', offset: 0.5 },
          { transform: 'translateX(10px)', offset: 0.6 },
          { transform: 'translateX(-10px)', offset: 0.7 },
          { transform: 'translateX(10px)', offset: 0.8 },
          { transform: 'translateX(0)', offset: 1 }
        ]

      case 'pulse':
        return [
          { transform: 'scale(1)', offset: 0 },
          { transform: 'scale(1.05)', offset: 0.5 },
          { transform: 'scale(1)', offset: 1 }
        ]

      case 'blur':
        return [
          { filter: 'blur(0px)' },
          { filter: `blur(${properties?.amount || 10}px)` }
        ]

      default:
        return []
    }
  }

  private getAnimationOptions(): KeyframeAnimationOptions {
    const { duration, delay, easing, iterations, fillMode } = this.config

    return {
      duration: duration || 300,
      delay: delay || 0,
      easing: easing || 'ease',
      iterations: iterations === 'infinite' ? Infinity : (iterations || 1),
      fill: fillMode || 'both'
    }
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

export const createAdvancedAnimation = (element: HTMLElement, config: AnimationConfig) => {
  return new AdvancedAnimation(element, config)
}



