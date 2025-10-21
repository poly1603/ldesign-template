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
var memoryLeakDetector = require('./memoryLeakDetector.cjs');
var objectPool = require('./objectPool.cjs');

exports.TemplateErrorType = void 0;
(function(TemplateErrorType2) {
  TemplateErrorType2["LOAD_ERROR"] = "LOAD_ERROR";
  TemplateErrorType2["NOT_FOUND"] = "NOT_FOUND";
  TemplateErrorType2["NETWORK_ERROR"] = "NETWORK_ERROR";
  TemplateErrorType2["PARSE_ERROR"] = "PARSE_ERROR";
  TemplateErrorType2["TIMEOUT"] = "TIMEOUT";
  TemplateErrorType2["PERMISSION_DENIED"] = "PERMISSION_DENIED";
  TemplateErrorType2["UNKNOWN"] = "UNKNOWN";
})(exports.TemplateErrorType || (exports.TemplateErrorType = {}));
class TemplateError extends Error {
  constructor(message, type = exports.TemplateErrorType.UNKNOWN, options) {
    super(message);
    this.name = "TemplateError";
    this.type = type;
    this.code = options?.code || type;
    this.details = options?.details;
    this.retryable = options?.retryable ?? true;
    this.timestamp = /* @__PURE__ */ new Date();
    this.context = options?.context;
    if (options?.cause) {
      this.cause = options.cause;
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TemplateError);
    }
  }
  /**
   * Get user-friendly error message
   */
  getUserMessage() {
    switch (this.type) {
      case exports.TemplateErrorType.LOAD_ERROR:
        return "\u6A21\u677F\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
      case exports.TemplateErrorType.NOT_FOUND:
        return "\u627E\u4E0D\u5230\u8BF7\u6C42\u7684\u6A21\u677F";
      case exports.TemplateErrorType.NETWORK_ERROR:
        return "\u7F51\u7EDC\u8FDE\u63A5\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8BBE\u7F6E";
      case exports.TemplateErrorType.PARSE_ERROR:
        return "\u6A21\u677F\u89E3\u6790\u9519\u8BEF\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458";
      case exports.TemplateErrorType.TIMEOUT:
        return "\u52A0\u8F7D\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5";
      case exports.TemplateErrorType.PERMISSION_DENIED:
        return "\u6CA1\u6709\u8BBF\u95EE\u8BE5\u6A21\u677F\u7684\u6743\u9650";
      default:
        return "\u53D1\u751F\u672A\u77E5\u9519\u8BEF";
    }
  }
  /**
   * Get recovery suggestions
   */
  getRecoverySuggestions() {
    const suggestions = [];
    switch (this.type) {
      case exports.TemplateErrorType.NETWORK_ERROR:
        suggestions.push("\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5");
        suggestions.push("\u5C1D\u8BD5\u5237\u65B0\u9875\u9762");
        suggestions.push("\u7A0D\u540E\u91CD\u8BD5");
        break;
      case exports.TemplateErrorType.NOT_FOUND:
        suggestions.push("\u68C0\u67E5\u6A21\u677F\u540D\u79F0\u662F\u5426\u6B63\u786E");
        suggestions.push("\u4F7F\u7528\u9ED8\u8BA4\u6A21\u677F");
        suggestions.push("\u8054\u7CFB\u6280\u672F\u652F\u6301");
        break;
      case exports.TemplateErrorType.TIMEOUT:
        suggestions.push("\u68C0\u67E5\u7F51\u7EDC\u901F\u5EA6");
        suggestions.push("\u51CF\u5C11\u5E76\u53D1\u8BF7\u6C42");
        suggestions.push("\u7A0D\u540E\u91CD\u8BD5");
        break;
      case exports.TemplateErrorType.PERMISSION_DENIED:
        suggestions.push("\u68C0\u67E5\u7528\u6237\u6743\u9650");
        suggestions.push("\u8054\u7CFB\u7BA1\u7406\u5458");
        break;
      default:
        suggestions.push("\u5237\u65B0\u9875\u9762\u91CD\u8BD5");
        suggestions.push("\u6E05\u9664\u6D4F\u89C8\u5668\u7F13\u5B58");
        suggestions.push("\u8054\u7CFB\u6280\u672F\u652F\u6301");
    }
    return suggestions;
  }
  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      code: this.code,
      details: this.details,
      retryable: this.retryable,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack
    };
  }
}
const defaultRecoveryStrategies = [{
  // Retry strategy for network errors
  canRecover: (templateError) => templateError.type === exports.TemplateErrorType.NETWORK_ERROR && templateError.retryable,
  recover: async (_templateError) => {
    await new Promise((resolve) => setTimeout(resolve, 2e3));
  },
  priority: 1
}, {
  // Fallback to default template
  canRecover: (templateError) => templateError.type === exports.TemplateErrorType.NOT_FOUND,
  recover: async (_templateError) => {
    if (_templateError.context?.category) ;
  },
  priority: 2
}, {
  // Clear cache and retry
  canRecover: (templateError) => templateError.type === exports.TemplateErrorType.PARSE_ERROR,
  recover: async (_templateError) => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("template-cache");
    }
  },
  priority: 3
}];
class ErrorRecoveryManager {
  constructor(strategies = defaultRecoveryStrategies) {
    this.strategies = [];
    this.retryCount = /* @__PURE__ */ new Map();
    this.maxRetries = 3;
    this.retryCleanupTimer = null;
    this.strategies = [...strategies].sort((a, b) => a.priority - b.priority);
  }
  /**
   * Add recovery strategy
   */
  addStrategy(strategy) {
    this.strategies.push(strategy);
    this.strategies.sort((a, b) => a.priority - b.priority);
  }
  /**
   * Attempt to recover from error
   */
  async recover(error) {
    const errorKey = `${error.type}-${error.code}`;
    const retries = this.retryCount.get(errorKey) || 0;
    if (retries >= this.maxRetries) {
      return false;
    }
    for (const strategy of this.strategies) {
      if (strategy.canRecover(error)) {
        try {
          await strategy.recover(error);
          this.retryCount.set(errorKey, retries + 1);
          return true;
        } catch (recoveryError) {
          console.error("Recovery strategy failed:", recoveryError);
        }
      }
    }
    return false;
  }
  /**
   * Reset retry count
   */
  resetRetryCount(error) {
    if (error) {
      const errorKey = `${error.type}-${error.code}`;
      this.retryCount.delete(errorKey);
    } else {
      this.retryCount.clear();
    }
    this.scheduleRetryCleanup();
  }
  /**
   * Schedule cleanup of old retry counts
   */
  scheduleRetryCleanup() {
    if (this.retryCleanupTimer) {
      clearTimeout(this.retryCleanupTimer);
    }
    this.retryCleanupTimer = setTimeout(() => {
      if (this.retryCount.size > 100) {
        const entries = Array.from(this.retryCount.entries());
        this.retryCount.clear();
        entries.slice(-50).forEach(([key, value]) => {
          this.retryCount.set(key, value);
        });
      }
      this.retryCleanupTimer = null;
    }, 5 * 60 * 1e3);
  }
  /**
   * Dispose the recovery manager
   */
  dispose() {
    if (this.retryCleanupTimer) {
      clearTimeout(this.retryCleanupTimer);
      this.retryCleanupTimer = null;
    }
    this.retryCount.clear();
    this.strategies.length = 0;
  }
}
function createErrorBoundary(options) {
  return vue.defineComponent({
    name: "TemplateErrorBoundary",
    props: {
      tag: {
        type: String,
        default: "div"
      }
    },
    setup(props, {
      slots
    }) {
      const error = vue.ref(null);
      const recovering = vue.ref(false);
      const hasError = vue.computed(() => error.value !== null);
      const handleError = async (err) => {
        const templateError = err instanceof TemplateError ? err : new TemplateError(err.message, exports.TemplateErrorType.UNKNOWN, {
          cause: err
        });
        error.value = templateError;
        options?.onError?.(templateError);
        if (options?.recovery && !recovering.value) {
          recovering.value = true;
          const recovered = await options.recovery.recover(templateError);
          if (recovered) {
            error.value = null;
          }
          recovering.value = false;
        }
      };
      const retry = () => {
        error.value = null;
      };
      const renderError = () => {
        if (options?.fallback) {
          return vue.h(options.fallback, {
            error: error.value,
            retry,
            recovering: recovering.value
          });
        }
        return vue.h("div", {
          class: "template-error-boundary"
        }, [vue.h("div", {
          class: "error-icon"
        }, "\u26A0\uFE0F"), vue.h("h3", error.value?.getUserMessage()), vue.h("p", {
          class: "error-details"
        }, error.value?.message), error.value?.retryable && vue.h("button", {
          class: "error-retry-btn",
          onClick: retry
        }, recovering.value ? "\u6062\u590D\u4E2D..." : "\u91CD\u8BD5"), vue.h("details", {
          class: "error-suggestions"
        }, [vue.h("summary", "\u89E3\u51B3\u5EFA\u8BAE"), vue.h("ul", error.value?.getRecoverySuggestions().map((suggestion) => vue.h("li", suggestion)))])]);
      };
      vue.provide("handleError", handleError);
      return () => {
        if (hasError.value) {
          return renderError();
        }
        try {
          return vue.h(props.tag, slots.default?.());
        } catch (err) {
          handleError(err);
          return renderError();
        }
      };
    }
  });
}
class GlobalTemplateErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.listeners = /* @__PURE__ */ new WeakMap();
    this.listenerRefs = /* @__PURE__ */ new Set();
    this.disposed = false;
  }
  static getInstance() {
    if (!GlobalTemplateErrorHandler.instance) {
      GlobalTemplateErrorHandler.instance = new GlobalTemplateErrorHandler();
    }
    return GlobalTemplateErrorHandler.instance;
  }
  /**
   * Log error
   */
  logError(error) {
    if (this.disposed) return;
    this.errorLog.push(error);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
    this.notifyListeners(error);
    if (undefined.PROD) {
      this.sendToRemote(error);
    }
  }
  /**
   * Get error log
   */
  getErrorLog() {
    return [...this.errorLog];
  }
  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
  }
  /**
   * Subscribe to errors
   */
  subscribe(listener) {
    const listenerObj = {};
    const ref2 = new WeakRef(listenerObj);
    this.listeners.set(listenerObj, listener);
    this.listenerRefs.add(ref2);
    return () => {
      this.listeners.delete(listenerObj);
      this.listenerRefs.delete(ref2);
    };
  }
  /**
   * Notify all active listeners
   */
  notifyListeners(error) {
    const deadRefs = /* @__PURE__ */ new Set();
    this.listenerRefs.forEach((ref2) => {
      const obj = ref2.deref();
      if (obj) {
        const listener = this.listeners.get(obj);
        if (listener) {
          listener(error);
        }
      } else {
        deadRefs.add(ref2);
      }
    });
    deadRefs.forEach((ref2) => this.listenerRefs.delete(ref2));
  }
  /**
   * Send error to remote logging service
   */
  async sendToRemote(_error) {
  }
  /**
   * Get error statistics
   */
  getStatistics() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      retryable: 0,
      recent: this.errorLog.slice(-10)
    };
    for (const error of this.errorLog) {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      if (error.retryable) stats.retryable++;
    }
    return stats;
  }
  /**
   * Destroy the singleton instance
   */
  static destroy() {
    if (GlobalTemplateErrorHandler.instance) {
      GlobalTemplateErrorHandler.instance.disposed = true;
      GlobalTemplateErrorHandler.instance.clearErrorLog();
      GlobalTemplateErrorHandler.instance.listeners = /* @__PURE__ */ new WeakMap();
      GlobalTemplateErrorHandler.instance.listenerRefs.clear();
      GlobalTemplateErrorHandler.instance = null;
    }
  }
}
GlobalTemplateErrorHandler.instance = null;
const globalErrorHandler = GlobalTemplateErrorHandler.getInstance();

exports.MemoryLeakDetector = memoryLeakDetector.MemoryLeakDetector;
exports.getLeakDetector = memoryLeakDetector.getLeakDetector;
exports.safeRequestAnimationFrame = memoryLeakDetector.safeRequestAnimationFrame;
exports.safeSetInterval = memoryLeakDetector.safeSetInterval;
exports.safeSetTimeout = memoryLeakDetector.safeSetTimeout;
exports.useAutoCleanupListener = memoryLeakDetector.useAutoCleanupListener;
exports.useMemoryLeakDetection = memoryLeakDetector.useMemoryLeakDetection;
exports.ObjectPool = objectPool.ObjectPool;
exports.createArrayPool = objectPool.createArrayPool;
exports.createMapPool = objectPool.createMapPool;
exports.createObjectPool = objectPool.createObjectPool;
exports.createSetPool = objectPool.createSetPool;
exports.poolManager = objectPool.poolManager;
exports.ErrorRecoveryManager = ErrorRecoveryManager;
exports.GlobalTemplateErrorHandler = GlobalTemplateErrorHandler;
exports.TemplateError = TemplateError;
exports.createErrorBoundary = createErrorBoundary;
exports.defaultRecoveryStrategies = defaultRecoveryStrategies;
exports.globalErrorHandler = globalErrorHandler;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=errorHandler.cjs.map
