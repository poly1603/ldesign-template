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

const EASING_FUNCTIONS = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInElastic: (t) => {
    const c4 = 2 * Math.PI / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t) => {
    const c4 = 2 * Math.PI / 3;
    return t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeInBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
  },
  easeInBounce: (t) => 1 - EASING_FUNCTIONS.easeOutBounce(1 - t),
  easeOutBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};
function useTemplateAnimation(options = {}) {
  const isPlaying = vue.ref(false);
  const isPaused = vue.ref(false);
  const progress = vue.ref(0);
  const currentLoop = vue.ref(0);
  let animationId = null;
  let startTime = null;
  let pauseTime = null;
  const {
    duration = 1e3,
    delay = 0,
    easing = "easeInOutQuad",
    loop = false,
    yoyo = false,
    onStart,
    onUpdate,
    onComplete
  } = options;
  const easingFn = typeof easing === "string" ? EASING_FUNCTIONS[easing] || EASING_FUNCTIONS.linear : easing;
  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp + delay;
    if (timestamp < startTime) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    const elapsed = pauseTime || timestamp - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    let adjustedProgress = easingFn(rawProgress);
    if (yoyo && currentLoop.value % 2 === 1) {
      adjustedProgress = 1 - adjustedProgress;
    }
    progress.value = adjustedProgress;
    onUpdate?.(adjustedProgress);
    if (rawProgress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      if (loop) {
        const maxLoops = typeof loop === "number" ? loop : Infinity;
        currentLoop.value++;
        if (currentLoop.value < maxLoops) {
          startTime = timestamp;
          animationId = requestAnimationFrame(animate);
        } else {
          isPlaying.value = false;
          onComplete?.();
        }
      } else {
        isPlaying.value = false;
        onComplete?.();
      }
    }
  };
  const play = () => {
    if (isPlaying.value) return;
    isPlaying.value = true;
    isPaused.value = false;
    startTime = null;
    pauseTime = null;
    currentLoop.value = 0;
    onStart?.();
    animationId = requestAnimationFrame(animate);
  };
  const pause = () => {
    if (!isPlaying.value || isPaused.value) return;
    isPaused.value = true;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    pauseTime = progress.value * duration;
  };
  const resume = () => {
    if (!isPaused.value) return;
    isPaused.value = false;
    isPlaying.value = true;
    animationId = requestAnimationFrame(animate);
  };
  const stop = () => {
    isPlaying.value = false;
    isPaused.value = false;
    progress.value = 0;
    currentLoop.value = 0;
    startTime = null;
    pauseTime = null;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };
  const reset = () => {
    stop();
    progress.value = 0;
  };
  vue.onBeforeUnmount(() => {
    stop();
  });
  return {
    isPlaying,
    isPaused,
    progress,
    currentLoop,
    play,
    pause,
    resume,
    stop,
    reset
  };
}
function useParallax(elementRef, config = {}) {
  const {
    speed = 0.5,
    direction = "vertical",
    reverse = false,
    offset = 0,
    threshold = [0, 1]
  } = config;
  const scrollY = vue.ref(0);
  const scrollX = vue.ref(0);
  const transform = vue.computed(() => {
    const element = elementRef.value;
    if (!element) return "";
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const elementProgress = 1 - (rect.top + rect.height / 2) / viewportHeight;
    if (elementProgress < threshold[0] || elementProgress > threshold[1]) {
      return "";
    }
    const multiplier = reverse ? -1 : 1;
    const movement = (elementProgress - 0.5) * 100 * speed * multiplier;
    if (direction === "vertical") {
      return `translateY(${movement + offset}px)`;
    } else if (direction === "horizontal") {
      return `translateX(${movement + offset}px)`;
    } else {
      return `translate(${movement + offset}px, ${movement + offset}px)`;
    }
  });
  const handleScroll = () => {
    scrollY.value = window.scrollY;
    scrollX.value = window.scrollX;
  };
  vue.onMounted(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    handleScroll();
  });
  vue.onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });
  vue.watch(transform, (newTransform) => {
    if (elementRef.value && newTransform) {
      elementRef.value.style.transform = newTransform;
    }
  });
  return {
    scrollY,
    scrollX,
    transform
  };
}
function useGesture(elementRef, config = {}) {
  const {
    // type = 'drag', // Not used currently
    threshold = 10,
    onGestureStart,
    onGestureMove,
    onGestureEnd
  } = config;
  const isGesturing = vue.ref(false);
  const startPos = vue.ref({
    x: 0,
    y: 0
  });
  const currentPos = vue.ref({
    x: 0,
    y: 0
  });
  const delta = vue.computed(() => ({
    x: currentPos.value.x - startPos.value.x,
    y: currentPos.value.y - startPos.value.y
  }));
  let startTime = 0;
  let lastPos = {
    x: 0,
    y: 0
  };
  let lastTime = 0;
  let handlers = [];
  const getEventPos = (event) => {
    if ("touches" in event) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }
    return {
      x: event.clientX,
      y: event.clientY
    };
  };
  const handleStart = (event) => {
    const pos = getEventPos(event);
    startPos.value = pos;
    currentPos.value = pos;
    lastPos = pos;
    startTime = Date.now();
    lastTime = startTime;
    isGesturing.value = true;
    onGestureStart?.(event);
  };
  const handleMove = (event) => {
    if (!isGesturing.value) return;
    const pos = getEventPos(event);
    currentPos.value = pos;
    const currentDelta = {
      x: pos.x - startPos.value.x,
      y: pos.y - startPos.value.y
    };
    if (Math.abs(currentDelta.x) > threshold || Math.abs(currentDelta.y) > threshold) {
      onGestureMove?.(currentDelta, event);
      lastPos = pos;
      lastTime = Date.now();
    }
  };
  const handleEnd = (event) => {
    if (!isGesturing.value) return;
    isGesturing.value = false;
    const timeDiff = Date.now() - lastTime;
    const velocity = {
      x: timeDiff > 0 ? (currentPos.value.x - lastPos.x) / timeDiff : 0,
      y: timeDiff > 0 ? (currentPos.value.y - lastPos.y) / timeDiff : 0
    };
    onGestureEnd?.(velocity, event);
  };
  const addEventHandler = (element, event, handler, options) => {
    element.addEventListener(event, handler, options);
    handlers.push({
      element,
      event,
      handler,
      options
    });
  };
  const removeAllHandlers = () => {
    for (const {
      element,
      event,
      handler
    } of handlers) {
      element.removeEventListener(event, handler);
    }
    handlers = [];
  };
  vue.onMounted(() => {
    const element = elementRef.value;
    if (!element) return;
    addEventHandler(element, "touchstart", handleStart, {
      passive: true
    });
    addEventHandler(element, "touchmove", handleMove, {
      passive: true
    });
    addEventHandler(element, "touchend", handleEnd, {
      passive: true
    });
    addEventHandler(element, "mousedown", handleStart);
    addEventHandler(window, "mousemove", handleMove);
    addEventHandler(window, "mouseup", handleEnd);
  });
  vue.onBeforeUnmount(() => {
    removeAllHandlers();
  });
  return {
    isGesturing,
    delta,
    startPos,
    currentPos
  };
}
function useSequenceAnimation(steps) {
  const currentStep = vue.ref(0);
  const isPlaying = vue.ref(false);
  const completedSteps = vue.ref([]);
  const playStep = (stepIndex) => {
    return new Promise((resolve) => {
      if (stepIndex >= steps.length) {
        resolve();
        return;
      }
      const step = steps[stepIndex];
      const element = typeof step.target === "string" ? document.querySelector(step.target) : step.target;
      if (!element) {
        console.warn(`Element not found for step ${stepIndex}`);
        resolve();
        return;
      }
      const animation = useTemplateAnimation({
        ...step.config,
        onUpdate: (progress) => {
          Object.entries(step.properties).forEach(([prop, value]) => {
            if (typeof value === "number") {
              const startValue = Number.parseFloat(getComputedStyle(element)[prop] || "0");
              const currentValue = startValue + (value - startValue) * progress;
              element.style[prop] = `${currentValue}px`;
            } else {
              element.style[prop] = value;
            }
          });
          step.config?.onUpdate?.(progress);
        },
        onComplete: () => {
          completedSteps.value.push(stepIndex);
          step.config?.onComplete?.();
          resolve();
        }
      });
      animation.play();
    });
  };
  const play = async () => {
    if (isPlaying.value) return;
    isPlaying.value = true;
    completedSteps.value = [];
    for (let i = 0; i < steps.length; i++) {
      currentStep.value = i;
      await playStep(i);
    }
    isPlaying.value = false;
  };
  const playFrom = async (stepIndex) => {
    if (isPlaying.value || stepIndex >= steps.length) return;
    isPlaying.value = true;
    for (let i = stepIndex; i < steps.length; i++) {
      currentStep.value = i;
      await playStep(i);
    }
    isPlaying.value = false;
  };
  const stop = () => {
    isPlaying.value = false;
    currentStep.value = 0;
    completedSteps.value = [];
  };
  return {
    currentStep,
    isPlaying,
    completedSteps,
    play,
    playFrom,
    stop
  };
}
function useScrollAnimation(elementRef, animationConfig = {}) {
  const {
    triggerOffset = 0.8,
    once = true,
    ...config
  } = animationConfig;
  const hasTriggered = vue.ref(false);
  const animation = useTemplateAnimation(config);
  let scrollHandler = null;
  const checkVisibility = () => {
    const element = elementRef.value;
    if (!element || hasTriggered.value && once) return;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const triggerPoint = viewportHeight * triggerOffset;
    if (rect.top < triggerPoint && rect.bottom > 0) {
      if (!hasTriggered.value) {
        hasTriggered.value = true;
        animation.play();
      }
    } else if (!once && hasTriggered.value) {
      hasTriggered.value = false;
      animation.reset();
    }
  };
  const throttledCheckVisibility = () => {
    if (!scrollHandler) {
      scrollHandler = () => {
        checkVisibility();
        scrollHandler = null;
      };
      requestAnimationFrame(scrollHandler);
    }
  };
  vue.onMounted(() => {
    window.addEventListener("scroll", throttledCheckVisibility, {
      passive: true
    });
    checkVisibility();
  });
  vue.onBeforeUnmount(() => {
    window.removeEventListener("scroll", throttledCheckVisibility);
    animation.stop();
  });
  return {
    ...animation,
    hasTriggered
  };
}

exports.EASING_FUNCTIONS = EASING_FUNCTIONS;
exports.useGesture = useGesture;
exports.useParallax = useParallax;
exports.useScrollAnimation = useScrollAnimation;
exports.useSequenceAnimation = useSequenceAnimation;
exports.useTemplateAnimation = useTemplateAnimation;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateAnimation.cjs.map
