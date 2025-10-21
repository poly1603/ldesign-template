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

class MemoryLeakDetector {
  constructor(options = {}) {
    this.options = options;
    this.listeners = /* @__PURE__ */ new WeakMap();
    this.timers = /* @__PURE__ */ new Set();
    this.intervals = /* @__PURE__ */ new Set();
    this.animationFrames = /* @__PURE__ */ new Set();
    this.observers = /* @__PURE__ */ new Set();
    this.memorySnapshots = [];
    this.checkInterval = null;
    this.startMonitoring();
  }
  /**
   * 开始监控
   */
  startMonitoring() {
    const interval = this.options.interval || 5e3;
    this.checkInterval = window.setInterval(() => {
      this.checkMemoryGrowth();
      this.checkDOMLeaks();
    }, interval);
  }
  /**
   * 检查内存增长
   */
  checkMemoryGrowth() {
    if (!("memory" in performance)) return;
    const memory = performance.memory;
    const currentMemory = memory.usedJSHeapSize / 1024 / 1024;
    this.memorySnapshots.push(currentMemory);
    if (this.memorySnapshots.length > 10) {
      this.memorySnapshots.shift();
    }
    if (this.memorySnapshots.length >= 5) {
      const recent = this.memorySnapshots.slice(-5);
      const avgGrowth = recent.reduce((sum, val, i) => {
        if (i === 0) return sum;
        return sum + (val - recent[i - 1]);
      }, 0) / (recent.length - 1);
      const threshold = this.options.threshold || 10;
      if (avgGrowth > threshold) {
        this.options.onLeak?.({
          type: "memory",
          description: `\u5185\u5B58\u6301\u7EED\u589E\u957F\uFF0C\u5E73\u5747\u6BCF\u6B21\u589E\u957F ${avgGrowth.toFixed(2)} MB`,
          value: currentMemory
        });
      }
    }
  }
  /**
   * 检查 DOM 泄漏
   */
  checkDOMLeaks() {
    const allNodes = document.querySelectorAll("*");
    let detachedCount = 0;
    allNodes.forEach((node) => {
      if (!document.body.contains(node) && node.isConnected) {
        detachedCount++;
      }
    });
    if (detachedCount > 100) {
      this.options.onLeak?.({
        type: "dom",
        description: `\u53D1\u73B0 ${detachedCount} \u4E2A\u5206\u79BB\u7684 DOM \u8282\u70B9`,
        value: detachedCount
      });
    }
  }
  /**
   * 追踪事件监听器
   */
  trackEventListener(element, type, handler, component) {
    const key = component || element;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, /* @__PURE__ */ new Set());
    }
    const set = this.listeners.get(key);
    set.add({
      element,
      type,
      handler
    });
    return () => {
      element.removeEventListener(type, handler);
      set.delete({
        element,
        type,
        handler
      });
      if (set.size === 0) {
        this.listeners.delete(key);
      }
    };
  }
  /**
   * 追踪定时器
   */
  trackTimer(id, type) {
    if (type === "timeout") {
      this.timers.add(id);
    } else {
      this.intervals.add(id);
    }
  }
  /**
   * 清理定时器
   */
  clearTimer(id, type) {
    if (type === "timeout") {
      clearTimeout(id);
      this.timers.delete(id);
    } else {
      clearInterval(id);
      this.intervals.delete(id);
    }
  }
  /**
   * 追踪动画帧
   */
  trackAnimationFrame(id) {
    this.animationFrames.add(id);
  }
  /**
   * 清理动画帧
   */
  clearAnimationFrame(id) {
    cancelAnimationFrame(id);
    this.animationFrames.delete(id);
  }
  /**
   * 追踪观察者
   */
  trackObserver(observer) {
    this.observers.add(observer);
  }
  /**
   * 清理观察者
   */
  clearObserver(observer) {
    observer.disconnect();
    this.observers.delete(observer);
  }
  /**
   * 清理所有追踪的资源
   */
  cleanup() {
    this.timers.forEach((id) => clearTimeout(id));
    this.intervals.forEach((id) => clearInterval(id));
    this.animationFrames.forEach((id) => cancelAnimationFrame(id));
    this.observers.forEach((observer) => observer.disconnect());
    this.listeners = /* @__PURE__ */ new WeakMap();
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.timers.clear();
    this.intervals.clear();
    this.animationFrames.clear();
    this.observers.clear();
    this.memorySnapshots = [];
  }
  /**
   * 生成泄漏报告
   */
  generateReport() {
    return {
      timers: this.timers.size,
      intervals: this.intervals.size,
      animationFrames: this.animationFrames.size,
      observers: this.observers.size,
      memory: this.memorySnapshots[this.memorySnapshots.length - 1] || 0,
      memoryTrend: this.memorySnapshots
    };
  }
}
let globalDetector = null;
function getLeakDetector() {
  if (!globalDetector) {
    globalDetector = new MemoryLeakDetector({
      onLeak: (info) => {
        console.warn(`[MemoryLeak] ${info.description}`, info);
      }
    });
  }
  return globalDetector;
}
function useMemoryLeakDetection(options = {}) {
  const detector = new MemoryLeakDetector(options);
  vue.onBeforeUnmount(() => {
    detector.cleanup();
  });
  return {
    trackEventListener: detector.trackEventListener.bind(detector),
    trackTimer: detector.trackTimer.bind(detector),
    clearTimer: detector.clearTimer.bind(detector),
    trackAnimationFrame: detector.trackAnimationFrame.bind(detector),
    clearAnimationFrame: detector.clearAnimationFrame.bind(detector),
    trackObserver: detector.trackObserver.bind(detector),
    clearObserver: detector.clearObserver.bind(detector),
    generateReport: detector.generateReport.bind(detector),
    cleanup: detector.cleanup.bind(detector)
  };
}
function safeSetTimeout(handler, timeout, ...args) {
  const id = setTimeout(handler, timeout, ...args);
  getLeakDetector().trackTimer(id, "timeout");
  return id;
}
function safeSetInterval(handler, timeout, ...args) {
  const id = setInterval(handler, timeout, ...args);
  getLeakDetector().trackTimer(id, "interval");
  return id;
}
function safeRequestAnimationFrame(callback) {
  const id = requestAnimationFrame(callback);
  getLeakDetector().trackAnimationFrame(id);
  return id;
}
function useAutoCleanupListener(target, event, handler, options) {
  const cleanup = [];
  const addEventListener = () => {
    const element = "value" in target ? target.value : target;
    if (!element) return;
    element.addEventListener(event, handler, options);
    cleanup.push(() => element.removeEventListener(event, handler));
  };
  addEventListener();
  vue.onUnmounted(() => {
    cleanup.forEach((fn) => fn());
  });
  return {
    cleanup: () => cleanup.forEach((fn) => fn())
  };
}

exports.MemoryLeakDetector = MemoryLeakDetector;
exports.getLeakDetector = getLeakDetector;
exports.safeRequestAnimationFrame = safeRequestAnimationFrame;
exports.safeSetInterval = safeSetInterval;
exports.safeSetTimeout = safeSetTimeout;
exports.useAutoCleanupListener = useAutoCleanupListener;
exports.useMemoryLeakDetection = useMemoryLeakDetection;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=memoryLeakDetector.cjs.map
