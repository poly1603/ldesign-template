/**
 * 视差效果模块 - 按需加载
 * 提供平滑的视差滚动效果
 */

import type { ParallaxConfig } from './types'

/**
 * 视差控制器
 */
export class ParallaxController {
  private elements: Map<HTMLElement, ParallaxConfig>
  private observer: IntersectionObserver | null = null
  private rafId: number | null = null
  private scrollY: number = 0
  private cleanupHandlers: Array<() => void> = []

  constructor() {
    this.elements = new Map()
    this.init()
  }

  private init() {
    const handleScroll = () => {
      this.scrollY = window.scrollY

      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => {
          this.updateParallax()
          this.rafId = null
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    this.cleanupHandlers.push(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startParallax(entry.target as HTMLElement)
        } else {
          this.stopParallax(entry.target as HTMLElement)
        }
      })
    })
  }

  add(element: HTMLElement, config: ParallaxConfig = {}) {
    this.elements.set(element, {
      speed: 0.5,
      offset: 0,
      horizontal: false,
      vertical: true,
      rotate: false,
      scale: false,
      maxOffset: 1000,
      smooth: true,
      ...config
    })

    this.observer?.observe(element)
  }

  remove(element: HTMLElement) {
    this.elements.delete(element)
    this.observer?.unobserve(element)
  }

  private startParallax(element: HTMLElement) {
    element.setAttribute('data-parallax-active', 'true')
  }

  private stopParallax(element: HTMLElement) {
    element.removeAttribute('data-parallax-active')
  }

  private updateParallax() {
    this.elements.forEach((config, element) => {
      if (element.getAttribute('data-parallax-active') !== 'true') return

      const rect = element.getBoundingClientRect()
      const centerY = rect.top + rect.height / 2
      const screenCenterY = window.innerHeight / 2

      const offsetY = (centerY - screenCenterY) * (config.speed || 0.5)

      let transform = ''

      if (config.vertical) {
        const clampedY = Math.min(Math.max(-config.maxOffset!, offsetY), config.maxOffset!)
        transform += `translateY(${clampedY}px) `
      }

      if (config.rotate) {
        const rotation = offsetY * 0.1
        transform += `rotate(${rotation}deg) `
      }

      if (config.scale) {
        const scale = 1 + (offsetY / 1000)
        const clampedScale = Math.min(Math.max(0.5, scale), 1.5)
        transform += `scale(${clampedScale}) `
      }

      if (config.smooth) {
        element.style.transition = 'transform 0.1s ease-out'
      }

      element.style.transform = transform
    })
  }

  destroy() {
    this.observer?.disconnect()
    this.elements.clear()

    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    this.cleanupHandlers.forEach(cleanup => cleanup())
    this.cleanupHandlers = []
  }
}



