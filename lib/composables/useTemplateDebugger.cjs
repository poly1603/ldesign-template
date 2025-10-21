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
var templateAnalytics = require('../utils/templateAnalytics.cjs');

exports.DebugLevel = void 0;
(function(DebugLevel2) {
  DebugLevel2["DEBUG"] = "debug";
  DebugLevel2["INFO"] = "info";
  DebugLevel2["WARN"] = "warn";
  DebugLevel2["ERROR"] = "error";
})(exports.DebugLevel || (exports.DebugLevel = {}));
function useTemplateDebugger(templateId, config = {}) {
  const {
    enabled = undefined.DEV,
    // logLevel = DebugLevel.DEBUG, // Not used currently
    maxLogs = 100,
    trackLifecycle = true,
    trackProps = true,
    trackState = true,
    showInConsole = true
  } = config;
  const logs = vue.ref([]);
  const stateSnapshots = vue.ref([]);
  const performanceMetrics = vue.reactive({
    mountTime: 0,
    updateCount: 0,
    lastUpdateTime: 0,
    totalUpdateTime: 0,
    averageUpdateTime: 0
  });
  const isEnabled = vue.ref(enabled);
  const addLog = (level, message, data, stack) => {
    if (!isEnabled.value) return;
    const log = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      level,
      message,
      data,
      templateId,
      stack
    };
    logs.value.push(log);
    if (logs.value.length > maxLogs) {
      logs.value.shift();
    }
    if (showInConsole) {
      const consoleMethod = level === exports.DebugLevel.ERROR ? "error" : level === exports.DebugLevel.WARN ? "warn" : level === exports.DebugLevel.INFO ? "info" : "debug";
      console[consoleMethod](`[${templateId}] ${message}`, data);
    }
  };
  const debug = (message, data) => {
    addLog(exports.DebugLevel.DEBUG, message, data);
  };
  const info = (message, data) => {
    addLog(exports.DebugLevel.INFO, message, data);
  };
  const warn = (message, data) => {
    addLog(exports.DebugLevel.WARN, message, data);
  };
  const error = (message, data) => {
    const stack = new Error("Stack trace").stack;
    addLog(exports.DebugLevel.ERROR, message, data, stack);
  };
  const takeSnapshot = (props, state, computed2) => {
    if (!isEnabled.value) return;
    stateSnapshots.value.push({
      timestamp: Date.now(),
      props,
      state,
      computed: computed2
    });
    if (stateSnapshots.value.length > maxLogs) {
      stateSnapshots.value.shift();
    }
    debug("State snapshot taken", {
      props,
      state,
      computed: computed2
    });
  };
  const watchProps = (props) => {
    if (!trackProps || !isEnabled.value) return;
    Object.entries(props).forEach(([key, value]) => {
      vue.watch(value, (newVal, oldVal) => {
        debug(`Prop "${key}" changed`, {
          oldVal,
          newVal
        });
      }, {
        deep: true
      });
    });
  };
  const watchState = (state) => {
    if (!trackState || !isEnabled.value) return;
    Object.entries(state).forEach(([key, value]) => {
      vue.watch(value, (newVal, oldVal) => {
        debug(`State "${key}" changed`, {
          oldVal,
          newVal
        });
      }, {
        deep: true
      });
    });
  };
  const measurePerformance = (label, fn) => {
    if (!isEnabled.value) {
      return fn();
    }
    const startTime = performance.now();
    const result = fn();
    if (result instanceof Promise) {
      return result.then(() => {
        const duration = performance.now() - startTime;
        debug(`${label} took ${duration.toFixed(2)}ms`);
        templateAnalytics.globalAnalytics.trackRender(templateId, templateId, duration);
      });
    } else {
      const duration = performance.now() - startTime;
      debug(`${label} took ${duration.toFixed(2)}ms`);
      templateAnalytics.globalAnalytics.trackRender(templateId, templateId, duration);
    }
  };
  const lifecycleHooks = {
    onBeforeMount() {
      if (trackLifecycle) info("Component before mount");
    },
    onMounted() {
      if (trackLifecycle) {
        const mountTime = performance.now();
        performanceMetrics.mountTime = mountTime;
        info("Component mounted", {
          mountTime
        });
      }
    },
    onBeforeUpdate() {
      if (trackLifecycle) {
        performanceMetrics.lastUpdateTime = performance.now();
        debug("Component before update");
      }
    },
    onUpdated() {
      if (trackLifecycle) {
        const updateTime = performance.now() - performanceMetrics.lastUpdateTime;
        performanceMetrics.updateCount++;
        performanceMetrics.totalUpdateTime += updateTime;
        performanceMetrics.averageUpdateTime = performanceMetrics.totalUpdateTime / performanceMetrics.updateCount;
        debug("Component updated", {
          updateTime: `${updateTime.toFixed(2)}ms`,
          updateCount: performanceMetrics.updateCount
        });
      }
    },
    onBeforeUnmount() {
      if (trackLifecycle) info("Component before unmount");
    },
    onUnmounted() {
      if (trackLifecycle) info("Component unmounted");
    }
  };
  const getLogs = (level) => {
    if (level) {
      return logs.value.filter((log) => log.level === level);
    }
    return logs.value;
  };
  const clearLogs = () => {
    logs.value = [];
  };
  const exportLogs = (format = "json") => {
    if (format === "json") {
      return JSON.stringify({
        templateId,
        logs: logs.value,
        snapshots: stateSnapshots.value,
        performance: performanceMetrics,
        exportedAt: (/* @__PURE__ */ new Date()).toISOString()
      }, null, 2);
    }
    const headers = ["Timestamp", "Level", "Message", "Data"];
    const rows = logs.value.map((log) => [new Date(log.timestamp).toISOString(), log.level, log.message, JSON.stringify(log.data || {})]);
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };
  const enable = () => {
    isEnabled.value = true;
    info("Debugger enabled");
  };
  const disable = () => {
    isEnabled.value = false;
  };
  vue.onMounted(() => {
    if (isEnabled.value) {
      lifecycleHooks.onMounted();
    }
  });
  vue.onUnmounted(() => {
    if (isEnabled.value) {
      lifecycleHooks.onUnmounted();
    }
  });
  return {
    // 状态
    isEnabled,
    logs: vue.computed(() => logs.value),
    stateSnapshots: vue.computed(() => stateSnapshots.value),
    performanceMetrics: vue.readonly(performanceMetrics),
    // 日志方法
    debug,
    info,
    warn,
    error,
    // 功能方法
    takeSnapshot,
    watchProps,
    watchState,
    measurePerformance,
    // 生命周期
    lifecycleHooks,
    // 工具方法
    getLogs,
    clearLogs,
    exportLogs,
    enable,
    disable
  };
}
class GlobalDebuggerManager {
  constructor() {
    this.debuggers = /* @__PURE__ */ new Map();
  }
  register(templateId, templateDebugger) {
    this.debuggers.set(templateId, templateDebugger);
  }
  unregister(templateId) {
    this.debuggers.delete(templateId);
  }
  get(templateId) {
    return this.debuggers.get(templateId);
  }
  getAll() {
    return Array.from(this.debuggers.entries());
  }
  clearAll() {
    this.debuggers.forEach((templateDebugger) => templateDebugger.clearLogs());
  }
  disableAll() {
    this.debuggers.forEach((templateDebugger) => templateDebugger.disable());
  }
  enableAll() {
    this.debuggers.forEach((templateDebugger) => templateDebugger.enable());
  }
  exportAll() {
    const data = {};
    this.debuggers.forEach((templateDebugger, id) => {
      data[id] = JSON.parse(templateDebugger.exportLogs());
    });
    return JSON.stringify(data, null, 2);
  }
}
const globalDebuggerManager = new GlobalDebuggerManager();
function createDebugPanelData() {
  const templates = vue.computed(() => globalDebuggerManager.getAll());
  const totalLogs = vue.computed(() => {
    return templates.value.reduce((sum, [_, templateDebugger]) => sum + templateDebugger.logs.value.length, 0);
  });
  return {
    templates,
    totalLogs,
    clearAll: () => globalDebuggerManager.clearAll(),
    exportAll: () => globalDebuggerManager.exportAll()
  };
}

exports.createDebugPanelData = createDebugPanelData;
exports.globalDebuggerManager = globalDebuggerManager;
exports.useTemplateDebugger = useTemplateDebugger;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateDebugger.cjs.map
