/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { ref, onMounted, onUnmounted, computed, watchEffect } from 'vue';
import { animationController, parallaxController, GestureController, Animation } from '../core/animation.js';

function useAnimation(elementRef, config) {
  const animation = ref(null);
  const state = ref({
    playing: false,
    paused: false,
    progress: 0,
    iteration: 0,
    finished: false
  });
  const animationId = `animation-${Date.now()}-${Math.random()}`;
  const getConfig = () => {
    return "value" in config ? config.value : config;
  };
  const init = () => {
    if (!elementRef.value) return;
    const currentConfig = getConfig();
    animation.value = animationController.create(animationId, elementRef.value, currentConfig);
    watchEffect(() => {
      if (animation.value) {
        Object.assign(state.value, animation.value.getState());
      }
    });
  };
  const play = () => {
    animationController.play(animationId);
  };
  const pause = () => {
    animationController.pause(animationId);
  };
  const stop = () => {
    animationController.stop(animationId);
  };
  const reset = () => {
    animationController.reset(animationId);
  };
  const reverse = () => {
    animation.value?.reverse();
  };
  const setSpeed = (rate) => {
    animation.value?.setPlaybackRate(rate);
  };
  const seek = (time) => {
    animation.value?.seek(time);
  };
  onMounted(() => {
    init();
  });
  onUnmounted(() => {
    animationController.destroy(animationId);
  });
  return {
    animation,
    state,
    play,
    pause,
    stop,
    reset,
    reverse,
    setSpeed,
    seek
  };
}
function useParallax(elementRef, config = {}) {
  const isActive = ref(false);
  const enable = () => {
    if (!elementRef.value) return;
    parallaxController.add(elementRef.value, config);
    isActive.value = true;
  };
  const disable = () => {
    if (!elementRef.value) return;
    parallaxController.remove(elementRef.value);
    isActive.value = false;
  };
  const updateConfig = (newConfig) => {
    if (!elementRef.value) return;
    disable();
    Object.assign(config, newConfig);
    enable();
  };
  onMounted(() => {
    enable();
  });
  onUnmounted(() => {
    disable();
  });
  return {
    isActive,
    enable,
    disable,
    updateConfig
  };
}
function useGesture(elementRef, config = {}) {
  const controller = ref(null);
  const isDragging = ref(false);
  const position = ref({
    x: 0,
    y: 0
  });
  const velocity = ref({
    x: 0,
    y: 0
  });
  const swipeDirection = ref(null);
  const init = () => {
    if (!elementRef.value) return;
    controller.value = new GestureController(elementRef.value, config);
    elementRef.value.addEventListener("swipe", (e) => {
      const customEvent = e;
      swipeDirection.value = customEvent.detail.direction;
      const timer = setTimeout(() => {
        swipeDirection.value = null;
      }, 500);
      onUnmounted(() => clearTimeout(timer));
    });
  };
  const destroy = () => {
    controller.value?.destroy();
    controller.value = null;
  };
  onMounted(() => {
    init();
  });
  onUnmounted(() => {
    destroy();
  });
  return {
    controller,
    isDragging,
    position,
    velocity,
    swipeDirection
  };
}
function useScrollAnimation(elementRef, config = {}) {
  const isInView = ref(false);
  const progress = ref(0);
  const hasEntered = ref(false);
  const observer = ref(null);
  const getTriggerPosition = () => {
    switch (config.trigger) {
      case "top":
        return 0;
      case "bottom":
        return 1;
      case "center":
      default:
        return 0.5;
    }
  };
  const init = () => {
    if (!elementRef.value) return;
    const threshold = getTriggerPosition();
    const rootMargin = `${config.offset || 0}px`;
    observer.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const wasInView = isInView.value;
        isInView.value = entry.isIntersecting;
        if (entry.isIntersecting) {
          const {
            top,
            height
          } = entry.boundingClientRect;
          const windowHeight = window.innerHeight;
          const elementProgress = 1 - top / (windowHeight - height);
          progress.value = Math.min(Math.max(0, elementProgress), 1);
          if (config.onProgress) {
            config.onProgress(progress.value);
          }
        }
        if (!wasInView && isInView.value) {
          if (!hasEntered.value || !config.once) {
            hasEntered.value = true;
            if (config.enter && elementRef.value) {
              const animation = new Animation(elementRef.value, config.enter);
              animation.play();
            }
          }
        } else if (wasInView && !isInView.value) {
          if (config.leave && elementRef.value) {
            const animation = new Animation(elementRef.value, config.leave);
            animation.play();
          }
        }
      });
    }, {
      threshold,
      rootMargin
    });
    observer.value.observe(elementRef.value);
  };
  const reset = () => {
    hasEntered.value = false;
    progress.value = 0;
  };
  const destroy = () => {
    observer.value?.disconnect();
    observer.value = null;
  };
  onMounted(() => {
    init();
  });
  onUnmounted(() => {
    destroy();
  });
  return {
    isInView,
    progress,
    hasEntered,
    reset
  };
}
function useAnimationGroup(animations) {
  const animationInstances = ref([]);
  const isPlaying = ref(false);
  const isPaused = ref(false);
  const staggerTimers = [];
  const init = () => {
    animations.forEach(({
      element,
      config
    }, index) => {
      if (element.value) {
        const id = `group-animation-${index}-${Date.now()}`;
        const animation = animationController.create(id, element.value, config);
        animationInstances.value.push(animation);
      }
    });
  };
  const playAll = (stagger = 0) => {
    staggerTimers.forEach((timer) => clearTimeout(timer));
    staggerTimers.length = 0;
    animationInstances.value.forEach((animation, index) => {
      const timer = setTimeout(() => {
        animation.play();
      }, index * stagger);
      staggerTimers.push(timer);
    });
    isPlaying.value = true;
    isPaused.value = false;
  };
  const pauseAll = () => {
    animationInstances.value.forEach((animation) => {
      animation.pause();
    });
    isPaused.value = true;
  };
  const stopAll = () => {
    animationInstances.value.forEach((animation) => {
      animation.stop();
    });
    isPlaying.value = false;
    isPaused.value = false;
  };
  const resetAll = () => {
    animationInstances.value.forEach((animation) => {
      animation.reset();
    });
    isPlaying.value = false;
    isPaused.value = false;
  };
  const destroyAll = () => {
    staggerTimers.forEach((timer) => clearTimeout(timer));
    staggerTimers.length = 0;
    animationInstances.value.forEach((animation) => {
      animation.destroy();
    });
    animationInstances.value = [];
  };
  onMounted(() => {
    init();
  });
  onUnmounted(() => {
    destroyAll();
  });
  return {
    animationInstances,
    isPlaying,
    isPaused,
    playAll,
    pauseAll,
    stopAll,
    resetAll
  };
}
function useTimeline() {
  const timeline = ref([]);
  const currentTime = ref(0);
  const duration = ref(0);
  const isPlaying = ref(false);
  const rafId = ref(null);
  const startTimestamp = ref(0);
  const MAX_TIMELINE_ITEMS = 100;
  const add = (element, config, startTime = 0) => {
    const id = `timeline-${Date.now()}-${Math.random()}`;
    const animation = animationController.create(id, element, {
      ...config,
      autoPlay: false
    });
    const item = {
      element,
      animation,
      startTime,
      duration: config.duration || 300
    };
    timeline.value.push(item);
    if (timeline.value.length > MAX_TIMELINE_ITEMS) {
      const removed = timeline.value.shift();
      if (removed) {
        removed.animation.destroy();
      }
    }
    duration.value = Math.max(duration.value, startTime + item.duration);
    return animation;
  };
  const play = () => {
    if (isPlaying.value) return;
    isPlaying.value = true;
    startTimestamp.value = performance.now() - currentTime.value;
    const animate = (timestamp) => {
      if (!isPlaying.value) return;
      currentTime.value = timestamp - startTimestamp.value;
      timeline.value.forEach((item) => {
        const localTime = currentTime.value - item.startTime;
        if (localTime >= 0 && localTime <= item.duration) {
          item.animation.seek(localTime);
        } else if (localTime > item.duration) {
          item.animation.seek(item.duration);
        } else {
          item.animation.seek(0);
        }
      });
      if (currentTime.value < duration.value) {
        rafId.value = requestAnimationFrame(animate);
      } else {
        isPlaying.value = false;
        currentTime.value = duration.value;
      }
    };
    rafId.value = requestAnimationFrame(animate);
  };
  const pause = () => {
    isPlaying.value = false;
    if (rafId.value) {
      cancelAnimationFrame(rafId.value);
      rafId.value = null;
    }
  };
  const stop = () => {
    pause();
    currentTime.value = 0;
    timeline.value.forEach((item) => {
      item.animation.reset();
    });
  };
  const seek = (time) => {
    currentTime.value = Math.min(Math.max(0, time), duration.value);
    timeline.value.forEach((item) => {
      const localTime = currentTime.value - item.startTime;
      if (localTime >= 0 && localTime <= item.duration) {
        item.animation.seek(localTime);
      } else if (localTime > item.duration) {
        item.animation.seek(item.duration);
      } else {
        item.animation.seek(0);
      }
    });
  };
  const clear = () => {
    stop();
    timeline.value.forEach((item) => {
      item.animation.destroy();
    });
    timeline.value = [];
    duration.value = 0;
  };
  const progress = computed(() => {
    return duration.value > 0 ? currentTime.value / duration.value : 0;
  });
  onUnmounted(() => {
    clear();
  });
  return {
    timeline,
    currentTime,
    duration,
    progress,
    isPlaying,
    add,
    play,
    pause,
    stop,
    seek,
    clear
  };
}

export { useAnimation, useAnimationGroup, useGesture, useParallax, useScrollAnimation, useTimeline };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useAnimation.js.map
