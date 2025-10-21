/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

var vue = require('vue');
var animation = require('../core/animation.cjs');

function useAnimation(elementRef, config) {
  const animation$1 = vue.ref(null);
  const state = vue.ref({
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
    animation$1.value = animation.animationController.create(animationId, elementRef.value, currentConfig);
    vue.watchEffect(() => {
      if (animation$1.value) {
        Object.assign(state.value, animation$1.value.getState());
      }
    });
  };
  const play = () => {
    animation.animationController.play(animationId);
  };
  const pause = () => {
    animation.animationController.pause(animationId);
  };
  const stop = () => {
    animation.animationController.stop(animationId);
  };
  const reset = () => {
    animation.animationController.reset(animationId);
  };
  const reverse = () => {
    animation$1.value?.reverse();
  };
  const setSpeed = (rate) => {
    animation$1.value?.setPlaybackRate(rate);
  };
  const seek = (time) => {
    animation$1.value?.seek(time);
  };
  vue.onMounted(() => {
    init();
  });
  vue.onUnmounted(() => {
    animation.animationController.destroy(animationId);
  });
  return {
    animation: animation$1,
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
  const isActive = vue.ref(false);
  const enable = () => {
    if (!elementRef.value) return;
    animation.parallaxController.add(elementRef.value, config);
    isActive.value = true;
  };
  const disable = () => {
    if (!elementRef.value) return;
    animation.parallaxController.remove(elementRef.value);
    isActive.value = false;
  };
  const updateConfig = (newConfig) => {
    if (!elementRef.value) return;
    disable();
    Object.assign(config, newConfig);
    enable();
  };
  vue.onMounted(() => {
    enable();
  });
  vue.onUnmounted(() => {
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
  const controller = vue.ref(null);
  const isDragging = vue.ref(false);
  const position = vue.ref({
    x: 0,
    y: 0
  });
  const velocity = vue.ref({
    x: 0,
    y: 0
  });
  const swipeDirection = vue.ref(null);
  const init = () => {
    if (!elementRef.value) return;
    controller.value = new animation.GestureController(elementRef.value, config);
    elementRef.value.addEventListener("swipe", (e) => {
      const customEvent = e;
      swipeDirection.value = customEvent.detail.direction;
      const timer = setTimeout(() => {
        swipeDirection.value = null;
      }, 500);
      vue.onUnmounted(() => clearTimeout(timer));
    });
  };
  const destroy = () => {
    controller.value?.destroy();
    controller.value = null;
  };
  vue.onMounted(() => {
    init();
  });
  vue.onUnmounted(() => {
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
  const isInView = vue.ref(false);
  const progress = vue.ref(0);
  const hasEntered = vue.ref(false);
  const observer = vue.ref(null);
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
              const animation$1 = new animation.Animation(elementRef.value, config.enter);
              animation$1.play();
            }
          }
        } else if (wasInView && !isInView.value) {
          if (config.leave && elementRef.value) {
            const animation$1 = new animation.Animation(elementRef.value, config.leave);
            animation$1.play();
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
  vue.onMounted(() => {
    init();
  });
  vue.onUnmounted(() => {
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
  const animationInstances = vue.ref([]);
  const isPlaying = vue.ref(false);
  const isPaused = vue.ref(false);
  const staggerTimers = [];
  const init = () => {
    animations.forEach(({
      element,
      config
    }, index) => {
      if (element.value) {
        const id = `group-animation-${index}-${Date.now()}`;
        const animation$1 = animation.animationController.create(id, element.value, config);
        animationInstances.value.push(animation$1);
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
  vue.onMounted(() => {
    init();
  });
  vue.onUnmounted(() => {
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
  const timeline = vue.ref([]);
  const currentTime = vue.ref(0);
  const duration = vue.ref(0);
  const isPlaying = vue.ref(false);
  const rafId = vue.ref(null);
  const startTimestamp = vue.ref(0);
  const MAX_TIMELINE_ITEMS = 100;
  const add = (element, config, startTime = 0) => {
    const id = `timeline-${Date.now()}-${Math.random()}`;
    const animation$1 = animation.animationController.create(id, element, {
      ...config,
      autoPlay: false
    });
    const item = {
      element,
      animation: animation$1,
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
    return animation$1;
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
  const progress = vue.computed(() => {
    return duration.value > 0 ? currentTime.value / duration.value : 0;
  });
  vue.onUnmounted(() => {
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

exports.useAnimation = useAnimation;
exports.useAnimationGroup = useAnimationGroup;
exports.useGesture = useGesture;
exports.useParallax = useParallax;
exports.useScrollAnimation = useScrollAnimation;
exports.useTimeline = useTimeline;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useAnimation.cjs.map
