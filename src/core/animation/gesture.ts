/**
 * 手势控制模块 - 按需加载
 * 包含拖拽、滑动、缩放、旋转等手势操作
 */

import type { GestureConfig } from './types'

/**
 * 手势控制器
 */
export class GestureController {
  private element: HTMLElement
  private config: GestureConfig
  private isDragging: boolean = false
  private startX: number = 0
  private startY: number = 0
  private currentX: number = 0
  private currentY: number = 0
  private velocityX: number = 0
  private velocityY: number = 0
  private rafId: number | null = null
  private cleanupHandlers: Array<() => void> = []

  constructor(element: HTMLElement, config: GestureConfig = {}) {
    this.element = element
    this.config = {
      drag: true,
      rotate: false,
      scale: false,
      swipe: false,
      dragElastic: 0.2,
      dragMomentum: true,
      swipeThreshold: 50,
      swipeVelocity: 0.5,
      ...config
    }

    this.init()
  }

  private init() {
    if (this.config.drag) {
      this.initDrag()
    }

    if (this.config.swipe) {
      this.initSwipe()
    }

    if (this.config.scale || this.config.rotate) {
      this.initTouch()
    }
  }

  private initDrag() {
    this.element.style.cursor = 'grab'

    const onMouseDown = (e: MouseEvent) => {
      this.isDragging = true
      this.element.style.cursor = 'grabbing'
      this.startX = e.clientX - this.currentX
      this.startY = e.clientY - this.currentY
      e.preventDefault()
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return

      const newX = e.clientX - this.startX
      const newY = e.clientY - this.startY

      if (this.config.dragConstraints) {
        const { top, bottom, left, right } = this.config.dragConstraints
        this.currentX = Math.min(Math.max(left || -Infinity, newX), right || Infinity)
        this.currentY = Math.min(Math.max(top || -Infinity, newY), bottom || Infinity)
      } else {
        this.currentX = newX
        this.currentY = newY
      }

      this.velocityX = this.currentX - (this.velocityX || this.currentX)
      this.velocityY = this.currentY - (this.velocityY || this.currentY)

      this.updateTransform()
    }

    const onMouseUp = () => {
      this.isDragging = false
      this.element.style.cursor = 'grab'

      if (this.config.dragMomentum) {
        this.applyMomentum()
      }
    }

    this.element.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    this.cleanupHandlers.push(() => {
      this.element.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    })
  }

  private initSwipe() {
    let touchStartX = 0
    let touchStartY = 0
    let touchStartTime = 0

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      touchStartTime = Date.now()
    }

    const onTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartX
      const deltaY = touch.clientY - touchStartY
      const deltaTime = Date.now() - touchStartTime

      const velocityX = deltaX / deltaTime
      const velocityY = deltaY / deltaTime

      if (Math.abs(deltaX) > this.config.swipeThreshold! ||
        Math.abs(velocityX) > this.config.swipeVelocity!) {
        this.onSwipe(deltaX > 0 ? 'right' : 'left')
      }

      if (Math.abs(deltaY) > this.config.swipeThreshold! ||
        Math.abs(velocityY) > this.config.swipeVelocity!) {
        this.onSwipe(deltaY > 0 ? 'down' : 'up')
      }
    }

    this.element.addEventListener('touchstart', onTouchStart, { passive: true })
    this.element.addEventListener('touchend', onTouchEnd, { passive: true })

    this.cleanupHandlers.push(() => {
      this.element.removeEventListener('touchstart', onTouchStart)
      this.element.removeEventListener('touchend', onTouchEnd)
    })
  }

  private initTouch() {
    let initialDistance = 0
    let initialAngle = 0

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]

        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )

        initialAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        )
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]

        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )

        const currentAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        )

        let transform = ''

        if (this.config.scale) {
          const scale = currentDistance / initialDistance
          transform += ` scale(${scale})`
        }

        if (this.config.rotate) {
          const rotation = (currentAngle - initialAngle) * (180 / Math.PI)
          transform += ` rotate(${rotation}deg)`
        }

        if (transform) {
          this.element.style.transform = transform
        }
      }
    }

    this.element.addEventListener('touchstart', onTouchStart, { passive: true })
    this.element.addEventListener('touchmove', onTouchMove, { passive: true })

    this.cleanupHandlers.push(() => {
      this.element.removeEventListener('touchstart', onTouchStart)
      this.element.removeEventListener('touchmove', onTouchMove)
    })
  }

  private updateTransform() {
    const elastic = this.config.dragElastic || 0
    const x = this.currentX * (1 - elastic)
    const y = this.currentY * (1 - elastic)

    this.element.style.transform = `translate(${x}px, ${y}px)`
  }

  private applyMomentum() {
    const friction = 0.95

    const animate = () => {
      this.velocityX *= friction
      this.velocityY *= friction

      this.currentX += this.velocityX
      this.currentY += this.velocityY

      this.updateTransform()

      if (Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1) {
        this.rafId = requestAnimationFrame(animate)
      }
    }

    animate()
  }

  private onSwipe(direction: 'up' | 'down' | 'left' | 'right') {
    this.element.dispatchEvent(new CustomEvent('swipe', {
      detail: { direction }
    }))
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    this.cleanupHandlers.forEach(cleanup => cleanup())
    this.cleanupHandlers = []
  }
}



