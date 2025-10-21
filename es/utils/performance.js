/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
const debounceTimers = /* @__PURE__ */ new WeakMap();
function debounce(fn, delay = 300) {
  return function(...args) {
    const existingTimer = debounceTimers.get(fn);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    const timer = setTimeout(() => {
      fn.apply(this, args);
      debounceTimers.delete(fn);
    }, delay);
    debounceTimers.set(fn, timer);
  };
}
function throttle(fn, limit = 300, options = {
  leading: true,
  trailing: true
}) {
  let inThrottle = false;
  let lastArgs = null;
  return function(...args) {
    if (!inThrottle) {
      if (options.leading !== false) {
        fn.apply(this, args);
      }
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (options.trailing !== false && lastArgs) {
          fn.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}
function batch(fn, delay = 16) {
  let items = [];
  let timeoutId = null;
  return function(item) {
    items.push(item);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(items);
      items = [];
      timeoutId = null;
    }, delay);
  };
}
function lazy(factory) {
  let instance = null;
  return function() {
    if (instance === null) {
      instance = factory();
    }
    return instance;
  };
}
function memoize(fn, options = {}) {
  const cache = /* @__PURE__ */ new Map();
  const {
    maxSize = 100,
    keyGenerator = (...args) => JSON.stringify(args)
  } = options;
  return function(...args) {
    const key = keyGenerator(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(key, result);
    return result;
  };
}
function runWhenIdle(callback, options) {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(callback, options);
  } else {
    setTimeout(callback, 1);
  }
}
function runInNextFrame(callback) {
  return requestAnimationFrame(callback);
}
async function processBatch(items, processor, batchSize = 100) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch2 = items.slice(i, i + batchSize);
    const batchResults = batch2.map(processor);
    results.push(...batchResults);
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  return results;
}
function calculateVisibleRange(scrollTop, containerHeight, itemHeight, totalItems, overscan = 3) {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + overscan * 2);
  return {
    start,
    end
  };
}
class ObjectPool {
  constructor(factory, reset, initialSize = 10) {
    this.pool = [];
    this.factory = factory;
    this.reset = reset;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }
  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.factory();
  }
  release(obj) {
    if (this.reset) {
      this.reset(obj);
    }
    this.pool.push(obj);
  }
  clear() {
    this.pool = [];
  }
}

export { ObjectPool, batch, calculateVisibleRange, debounce, lazy, memoize, processBatch, runInNextFrame, runWhenIdle, throttle };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=performance.js.map
