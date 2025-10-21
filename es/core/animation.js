/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { reactive } from 'vue';

class AnimationController {
  constructor() {
    this.rafId = null;
    this.startTime = 0;
    this.disposed = false;
    this.animations = /* @__PURE__ */ new Map();
  }
  /**
   * 创建动画
   */
  create(id, element, config) {
    const animation = new Animation(element, config);
    this.animations.set(id, animation);
    return animation;
  }
  /**
   * 播放动画
   */
  play(id) {
    const animation = this.animations.get(id);
    if (animation) {
      animation.play();
    }
  }
  /**
   * 暂停动画
   */
  pause(id) {
    const animation = this.animations.get(id);
    if (animation) {
      animation.pause();
    }
  }
  /**
   * 停止动画
   */
  stop(id) {
    const animation = this.animations.get(id);
    if (animation) {
      animation.stop();
    }
  }
  /**
   * 重置动画
   */
  reset(id) {
    const animation = this.animations.get(id);
    if (animation) {
      animation.reset();
    }
  }
  /**
   * 销毁动画
   */
  destroy(id) {
    const animation = this.animations.get(id);
    if (animation) {
      animation.destroy();
      this.animations.delete(id);
    }
  }
  /**
   * 销毁所有动画
   */
  destroyAll() {
    if (this.disposed) return;
    this.animations.forEach((animation) => animation.destroy());
    this.animations.clear();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.disposed = true;
  }
}
class Animation {
  constructor(element, config) {
    this.animation = null;
    this.initialStyles = {};
    this.element = element;
    this.config = config;
    this.state = reactive({
      playing: false,
      paused: false,
      progress: 0,
      iteration: 0,
      finished: false
    });
    this.saveInitialStyles();
    if (config.autoPlay) {
      this.play();
    }
  }
  /**
   * 保存初始样式
   */
  saveInitialStyles() {
    const computedStyles = window.getComputedStyle(this.element);
    this.initialStyles = {
      transform: computedStyles.transform,
      opacity: computedStyles.opacity,
      filter: computedStyles.filter
    };
  }
  /**
   * 获取关键帧
   */
  getKeyframes() {
    const {
      type,
      direction,
      properties
    } = this.config;
    switch (type) {
      case "fade":
        return [{
          opacity: direction === "out" ? 1 : 0
        }, {
          opacity: direction === "out" ? 0 : 1
        }];
      case "slide": {
        const distance = properties?.distance || 100;
        const translateMap = {
          up: `translateY(${distance}px)`,
          down: `translateY(-${distance}px)`,
          left: `translateX(${distance}px)`,
          right: `translateX(-${distance}px)`
        };
        return [{
          transform: translateMap[direction || "up"] || "none"
        }, {
          transform: "translateX(0) translateY(0)"
        }];
      }
      case "scale":
        return [{
          transform: direction === "out" ? "scale(1)" : "scale(0)"
        }, {
          transform: direction === "out" ? "scale(0)" : "scale(1)"
        }];
      case "rotate": {
        const degrees = properties?.degrees || 360;
        return [{
          transform: "rotate(0deg)"
        }, {
          transform: `rotate(${degrees}deg)`
        }];
      }
      case "flip": {
        const axis = properties?.axis || "Y";
        return [{
          transform: `rotate${axis}(0deg)`
        }, {
          transform: `rotate${axis}(180deg)`
        }];
      }
      case "custom":
        return properties?.keyframes || [];
      default:
        return [];
    }
  }
  /**
   * 获取动画选项
   */
  getAnimationOptions() {
    const {
      duration,
      delay,
      easing,
      iterations,
      fillMode
    } = this.config;
    return {
      duration: duration || 300,
      delay: delay || 0,
      easing: this.getEasing(easing),
      iterations: iterations === "infinite" ? Infinity : iterations || 1,
      fill: fillMode || "both"
    };
  }
  /**
   * 获取缓动函数
   */
  getEasing(easing) {
    if (!easing) return "ease";
    const easingMap = {
      linear: "linear",
      ease: "ease",
      "ease-in": "ease-in",
      "ease-out": "ease-out",
      "ease-in-out": "ease-in-out",
      "cubic-bezier": "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: "cubic-bezier(0.5, 1.5, 0.5, 1)",
      elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      bounce: "cubic-bezier(0.87, -0.41, 0.19, 1.44)"
    };
    return easingMap[easing] || easing;
  }
  /**
   * 播放动画
   */
  play() {
    if (this.state.playing && !this.state.paused) return;
    const keyframes = this.getKeyframes();
    const options = this.getAnimationOptions();
    if (this.state.paused && this.animation) {
      this.animation.play();
      this.state.paused = false;
    } else {
      this.animation = this.element.animate(keyframes, options);
      this.state.playing = true;
      this.state.finished = false;
      this.animation.onfinish = () => {
        this.state.finished = true;
        this.state.playing = false;
      };
    }
  }
  /**
   * 暂停动画
   */
  pause() {
    if (this.animation && this.state.playing) {
      this.animation.pause();
      this.state.paused = true;
    }
  }
  /**
   * 停止动画
   */
  stop() {
    if (this.animation) {
      this.animation.cancel();
      this.state.playing = false;
      this.state.paused = false;
      this.state.finished = true;
    }
  }
  /**
   * 重置动画
   */
  reset() {
    this.stop();
    this.state.progress = 0;
    this.state.iteration = 0;
    Object.assign(this.element.style, this.initialStyles);
  }
  /**
   * 反转动画
   */
  reverse() {
    if (this.animation) {
      this.animation.reverse();
    }
  }
  /**
   * 设置播放速率
   */
  setPlaybackRate(rate) {
    if (this.animation) {
      this.animation.playbackRate = rate;
    }
  }
  /**
   * 跳转到指定时间
   */
  seek(time) {
    if (this.animation) {
      this.animation.currentTime = time;
    }
  }
  /**
   * 销毁动画
   */
  destroy() {
    this.stop();
    this.animation = null;
  }
  /**
   * 获取状态
   */
  getState() {
    return this.state;
  }
}
class ParallaxController {
  constructor() {
    this.observer = null;
    this.rafId = null;
    this.scrollY = 0;
    this.scrollX = 0;
    this.elements = /* @__PURE__ */ new Map();
    this.init();
  }
  init() {
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener("scroll", this.handleScroll, {
      passive: true
    });
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.startParallax(entry.target);
        } else {
          this.stopParallax(entry.target);
        }
      });
    });
  }
  /**
   * 添加视差元素
   */
  add(element, config = {}) {
    this.elements.set(element, {
      speed: 0.5,
      offset: 0,
      horizontal: false,
      vertical: true,
      rotate: false,
      scale: false,
      maxOffset: 1e3,
      smooth: true,
      ...config
    });
    this.observer?.observe(element);
  }
  /**
   * 移除视差元素
   */
  remove(element) {
    this.elements.delete(element);
    this.observer?.unobserve(element);
  }
  /**
   * 处理滚动
   */
  handleScroll() {
    this.scrollY = window.scrollY;
    this.scrollX = window.scrollX;
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.updateParallax();
        this.rafId = null;
      });
    }
  }
  /**
   * 开始视差效果
   */
  startParallax(element) {
    element.setAttribute("data-parallax-active", "true");
  }
  /**
   * 停止视差效果
   */
  stopParallax(element) {
    element.removeAttribute("data-parallax-active");
  }
  /**
   * 更新视差效果
   */
  updateParallax() {
    this.elements.forEach((config, element) => {
      if (element.getAttribute("data-parallax-active") !== "true") return;
      const rect = element.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const centerX = rect.left + rect.width / 2;
      const screenCenterY = window.innerHeight / 2;
      const screenCenterX = window.innerWidth / 2;
      const offsetY = (centerY - screenCenterY) * (config.speed || 0.5);
      const offsetX = (centerX - screenCenterX) * (config.speed || 0.5);
      let transform = "";
      if (config.vertical) {
        transform += `translateY(${Math.min(Math.max(-config.maxOffset, offsetY), config.maxOffset)}px) `;
      }
      if (config.horizontal) {
        transform += `translateX(${Math.min(Math.max(-config.maxOffset, offsetX), config.maxOffset)}px) `;
      }
      if (config.rotate) {
        const rotation = offsetY * 0.1;
        transform += `rotate(${rotation}deg) `;
      }
      if (config.scale) {
        const scale = 1 + offsetY / 1e3;
        transform += `scale(${Math.min(Math.max(0.5, scale), 1.5)}) `;
      }
      if (config.smooth) {
        element.style.transition = "transform 0.1s ease-out";
      }
      element.style.transform = transform;
    });
  }
  /**
   * 销毁
   */
  destroy() {
    window.removeEventListener("scroll", this.handleScroll);
    this.observer?.disconnect();
    this.elements.clear();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
class GestureController {
  constructor(element, config = {}) {
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.rafId = null;
    this.element = element;
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
    };
    this.init();
  }
  init() {
    if (this.config.drag) {
      this.initDrag();
    }
    if (this.config.swipe) {
      this.initSwipe();
    }
    if (this.config.scale || this.config.rotate) {
      this.initTouch();
    }
  }
  /**
   * 初始化拖拽
   */
  initDrag() {
    this.element.style.cursor = "grab";
    const onMouseDown = (e) => {
      this.isDragging = true;
      this.element.style.cursor = "grabbing";
      this.startX = e.clientX - this.currentX;
      this.startY = e.clientY - this.currentY;
      e.preventDefault();
    };
    const onMouseMove = (e) => {
      if (!this.isDragging) return;
      const newX = e.clientX - this.startX;
      const newY = e.clientY - this.startY;
      if (this.config.dragConstraints) {
        const {
          top,
          bottom,
          left,
          right
        } = this.config.dragConstraints;
        this.currentX = Math.min(Math.max(left || -Infinity, newX), right || Infinity);
        this.currentY = Math.min(Math.max(top || -Infinity, newY), bottom || Infinity);
      } else {
        this.currentX = newX;
        this.currentY = newY;
      }
      this.velocityX = this.currentX - (this.velocityX || this.currentX);
      this.velocityY = this.currentY - (this.velocityY || this.currentY);
      this.updateTransform();
    };
    const onMouseUp = () => {
      this.isDragging = false;
      this.element.style.cursor = "grab";
      if (this.config.dragMomentum) {
        this.applyMomentum();
      }
    };
    this.element.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }
  /**
   * 初始化滑动
   */
  initSwipe() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    const onTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
    };
    const onTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;
      const velocityX = deltaX / deltaTime;
      const velocityY = deltaY / deltaTime;
      if (Math.abs(deltaX) > this.config.swipeThreshold || Math.abs(velocityX) > this.config.swipeVelocity) {
        if (deltaX > 0) {
          this.onSwipe("right");
        } else {
          this.onSwipe("left");
        }
      }
      if (Math.abs(deltaY) > this.config.swipeThreshold || Math.abs(velocityY) > this.config.swipeVelocity) {
        if (deltaY > 0) {
          this.onSwipe("down");
        } else {
          this.onSwipe("up");
        }
      }
    };
    this.element.addEventListener("touchstart", onTouchStart, {
      passive: true
    });
    this.element.addEventListener("touchend", onTouchEnd, {
      passive: true
    });
  }
  /**
   * 初始化触摸手势
   */
  initTouch() {
    let initialDistance = 0;
    let initialAngle = 0;
    let currentScale = 1;
    let currentRotation = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        initialAngle = Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        const currentAngle = Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
        if (this.config.scale) {
          currentScale = currentDistance / initialDistance;
          this.element.style.transform += ` scale(${currentScale})`;
        }
        if (this.config.rotate) {
          currentRotation = (currentAngle - initialAngle) * (180 / Math.PI);
          this.element.style.transform += ` rotate(${currentRotation}deg)`;
        }
      }
    };
    this.element.addEventListener("touchstart", onTouchStart, {
      passive: true
    });
    this.element.addEventListener("touchmove", onTouchMove, {
      passive: true
    });
  }
  /**
   * 更新变换
   */
  updateTransform() {
    const elastic = this.config.dragElastic || 0;
    const x = this.currentX * (1 - elastic);
    const y = this.currentY * (1 - elastic);
    this.element.style.transform = `translate(${x}px, ${y}px)`;
  }
  /**
   * 应用动量
   */
  applyMomentum() {
    const friction = 0.95;
    const animate = () => {
      this.velocityX *= friction;
      this.velocityY *= friction;
      this.currentX += this.velocityX;
      this.currentY += this.velocityY;
      this.updateTransform();
      if (Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1) {
        this.rafId = requestAnimationFrame(animate);
      }
    };
    animate();
  }
  /**
   * 滑动回调
   */
  onSwipe(direction) {
    this.element.dispatchEvent(new CustomEvent("swipe", {
      detail: {
        direction
      }
    }));
  }
  /**
   * 销毁
   */
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
const animationController = new AnimationController();
const parallaxController = new ParallaxController();

export { Animation, AnimationController, GestureController, ParallaxController, animationController, parallaxController };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=animation.js.map
