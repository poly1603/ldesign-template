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

function deepClone(obj, cache = /* @__PURE__ */ new WeakMap(), depth = 0, maxDepth = 100) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (depth > maxDepth) {
    console.warn("deepClone: Maximum depth exceeded");
    return obj;
  }
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  let cloned;
  if (obj instanceof Date) {
    cloned = new Date(obj.getTime());
  } else if (obj instanceof RegExp) {
    cloned = new RegExp(obj.source, obj.flags);
  } else if (obj instanceof Set) {
    cloned = /* @__PURE__ */ new Set();
    cache.set(obj, cloned);
    obj.forEach((value) => cloned.add(deepClone(value, cache, depth + 1, maxDepth)));
  } else if (obj instanceof Map) {
    cloned = /* @__PURE__ */ new Map();
    cache.set(obj, cloned);
    obj.forEach((value, key) => cloned.set(deepClone(key, cache, depth + 1, maxDepth), deepClone(value, cache, depth + 1, maxDepth)));
  } else if (Array.isArray(obj)) {
    cloned = [];
    cache.set(obj, cloned);
    for (let i = 0; i < obj.length; i++) {
      cloned[i] = deepClone(obj[i], cache, depth + 1, maxDepth);
    }
  } else {
    cloned = Object.create(Object.getPrototypeOf(obj));
    cache.set(obj, cloned);
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      cloned[key] = deepClone(obj[key], cache, depth + 1, maxDepth);
    }
  }
  return cloned;
}
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (!source) return target;
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];
    if (isObject(sourceValue) && isObject(targetValue)) {
      target[key] = deepMerge(targetValue, sourceValue);
    } else if (Array.isArray(sourceValue)) {
      target[key] = [...sourceValue];
    } else if (sourceValue !== void 0) {
      target[key] = sourceValue;
    }
  }
  return deepMerge(target, ...sources);
}
function isObject(obj) {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}
function isEmpty(obj) {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === "string") return obj.length === 0;
  if (obj instanceof Set || obj instanceof Map) return obj.size === 0;
  if (isObject(obj)) return Object.keys(obj).length === 0;
  return false;
}
function debounce(fn, delay, options) {
  let timeoutId = null;
  let lastArgs = null;
  let lastCallTime = null;
  const {
    leading = false,
    trailing = true
  } = options || {};
  const invokeFunc = () => {
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  };
  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastCallTime = null;
  };
  const flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      invokeFunc();
    }
  };
  const debounced = function(...args) {
    const now = Date.now();
    const isFirstCall = !lastCallTime;
    lastCallTime = now;
    lastArgs = args;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (isFirstCall && leading) {
      invokeFunc();
    } else if (trailing) {
      timeoutId = setTimeout(() => {
        invokeFunc();
        timeoutId = null;
        lastCallTime = null;
      }, delay);
    }
  };
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function throttle(fn, limit) {
  let inThrottle = false;
  let lastArgs = null;
  let timeoutId = null;
  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    inThrottle = false;
    lastArgs = null;
  };
  const throttled = function(...args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      timeoutId = setTimeout(() => {
        inThrottle = false;
        timeoutId = null;
        if (lastArgs !== null) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
  throttled.cancel = cancel;
  return throttled;
}
function generateId(prefix = "id") {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${randomStr}`;
}
const LOG_1024 = Math.log(1024);
const SIZE_UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  if (bytes < 0) return "Invalid size";
  const dm = Math.max(0, decimals);
  const i = Math.min(Math.floor(Math.log(bytes) / LOG_1024), SIZE_UNITS.length - 1);
  return `${Number.parseFloat((bytes / 1024 ** i).toFixed(dm))} ${SIZE_UNITS[i]}`;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function retry(fn, options = {}) {
  const {
    maxAttempts = 3,
    delay = 1e3,
    backoff = 2,
    onError
  } = options;
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (onError) {
        onError(lastError, attempt);
      }
      if (attempt < maxAttempts) {
        const waitTime = delay * backoff ** (attempt - 1);
        await sleep(waitTime);
      }
    }
  }
  if (lastError) throw lastError;
  throw new Error("Unknown error");
}
const pathCache = /* @__PURE__ */ new Map();
const MAX_PATH_CACHE = 500;
function get(obj, path, defaultValue) {
  if (!obj || typeof obj !== "object") return defaultValue;
  let keys = pathCache.get(path);
  if (!keys) {
    keys = path.split(".");
    if (pathCache.size >= MAX_PATH_CACHE) {
      const firstKey = pathCache.keys().next().value;
      if (firstKey) {
        pathCache.delete(firstKey);
      }
    }
    pathCache.set(path, keys);
  }
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === void 0) {
      return defaultValue;
    }
  }
  return result;
}
function set(obj, path, value) {
  if (!obj || typeof obj !== "object") return;
  let keys = pathCache.get(path);
  if (!keys) {
    keys = path.split(".");
    if (pathCache.size >= MAX_PATH_CACHE) {
      const firstKey = pathCache.keys().next().value;
      if (firstKey) {
        pathCache.delete(firstKey);
      }
    }
    pathCache.set(path, keys);
  }
  if (keys.length === 0) return;
  const lastKey = keys[keys.length - 1];
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }
  current[lastKey] = value;
}
function unset(obj, path) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  let current = obj;
  for (const key of keys) {
    if (!(key in current)) {
      return;
    }
    current = current[key];
  }
  delete current[lastKey];
}
function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
function omit(obj, keys) {
  const result = {
    ...obj
  };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
function arrayToObject(array, keyFn) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const item of array) {
    const key = keyFn(item);
    result[key] = item;
  }
  return result;
}
function groupBy(array, keyFn) {
  const map = /* @__PURE__ */ new Map();
  for (const item of array) {
    const key = keyFn(item);
    const group = map.get(key);
    if (group) {
      group.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  const result = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of map) {
    result[key] = value;
  }
  return result;
}

exports.arrayToObject = arrayToObject;
exports.debounce = debounce;
exports.deepClone = deepClone;
exports.deepMerge = deepMerge;
exports.formatBytes = formatBytes;
exports.generateId = generateId;
exports.get = get;
exports.groupBy = groupBy;
exports.isEmpty = isEmpty;
exports.isObject = isObject;
exports.omit = omit;
exports.pick = pick;
exports.retry = retry;
exports.set = set;
exports.sleep = sleep;
exports.throttle = throttle;
exports.unset = unset;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=helpers.cjs.map
