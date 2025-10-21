/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { reactive, ref, onMounted, onUnmounted, readonly } from 'vue';
import { ObjectPool } from '../utils/objectPool.js';

const entryPool = new ObjectPool({
  maxSize: 50,
  factory: () => ({
    name: "",
    startTime: 0,
    duration: 0,
    type: "measure"
  }),
  reset: (entry) => {
    entry.name = "";
    entry.startTime = 0;
    entry.duration = 0;
    entry.type = "measure";
    entry.details = void 0;
  }
});
function useTemplatePerformance(templateId) {
  const metrics = reactive({
    renderTime: 0,
    loadTime: 0,
    updateTime: 0,
    componentCount: 0,
    domNodes: 0,
    memory: 0,
    fps: 0
  });
  const entries = ref([]);
  const MAX_ENTRIES = 100;
  const memory = reactive({
    value: 0,
    limit: 0,
    used: 0,
    available: 0,
    usagePercent: 0
  });
  const FPS_HISTORY_SIZE = 60;
  const fpsHistory = ref(Array.from({
    length: FPS_HISTORY_SIZE
  }, () => 0));
  let fpsIndex = 0;
  let rafId = null;
  let lastTime = 0;
  let intervalId = null;
  const startMeasure = (name) => {
    if (window.performance && window.performance.mark) {
      window.performance.mark(`${name}-start`);
    }
  };
  const endMeasure = (name) => {
    if (window.performance && window.performance.mark && window.performance.measure) {
      const endMark = `${name}-end`;
      const startMark = `${name}-start`;
      window.performance.mark(endMark);
      try {
        window.performance.measure(name, startMark, endMark);
        const measures = window.performance.getEntriesByName(name, "measure");
        if (measures.length > 0) {
          const measure2 = measures[measures.length - 1];
          const entry = entryPool.acquire();
          entry.name = name;
          entry.startTime = measure2.startTime;
          entry.duration = measure2.duration;
          entry.type = "measure";
          if (entries.value.length >= MAX_ENTRIES) {
            const removed = entries.value.shift();
            if (removed) entryPool.release(removed);
          }
          entries.value.push(entry);
          if (name.includes("render")) {
            metrics.renderTime = Math.round(measure2.duration);
          } else if (name.includes("load")) {
            metrics.loadTime = Math.round(measure2.duration);
          } else if (name.includes("update")) {
            metrics.updateTime = Math.round(measure2.duration);
          }
        }
        window.performance.clearMarks(startMark);
        window.performance.clearMarks(endMark);
        window.performance.clearMeasures(name);
      } catch (err) {
        console.warn("Performance measure failed:", err);
      }
    }
  };
  const measure = async (name, fn) => {
    startMeasure(name);
    try {
      const result = await fn();
      return result;
    } finally {
      endMeasure(name);
    }
  };
  const updateMemory = () => {
    if ("memory" in performance) {
      const memoryInfo = performance.memory;
      memory.used = memoryInfo.usedJSHeapSize;
      memory.limit = memoryInfo.jsHeapSizeLimit;
      memory.available = memory.limit - memory.used;
      memory.usagePercent = memory.used / memory.limit * 100;
      memory.value = memory.used;
      metrics.memory = Math.round(memory.used / 1024 / 1024);
    }
  };
  const calculateFPS = (timestamp) => {
    if (!lastTime) {
      lastTime = timestamp;
      rafId = requestAnimationFrame(calculateFPS);
      return;
    }
    const delta = timestamp - lastTime;
    const fps = Math.round(1e3 / delta);
    fpsHistory.value[fpsIndex] = fps;
    fpsIndex = (fpsIndex + 1) % FPS_HISTORY_SIZE;
    let sum = 0;
    let count = 0;
    for (let i = 0; i < FPS_HISTORY_SIZE; i++) {
      if (fpsHistory.value[i] > 0) {
        sum += fpsHistory.value[i];
        count++;
      }
    }
    metrics.fps = count > 0 ? Math.round(sum / count) : 0;
    lastTime = timestamp;
    rafId = requestAnimationFrame(calculateFPS);
  };
  const startFPSMonitoring = () => {
    if (!rafId) {
      rafId = requestAnimationFrame(calculateFPS);
    }
  };
  const stopFPSMonitoring = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
      lastTime = 0;
    }
  };
  const countDOMNodes = () => {
    metrics.domNodes = document.getElementsByTagName("*").length;
  };
  const getNavigationTiming = () => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      return {
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcpConnection: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        domProcessing: timing.domComplete - timing.domLoading,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        pageLoad: timing.loadEventEnd - timing.navigationStart
      };
    }
    return null;
  };
  const getResourceTiming = () => {
    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType("resource");
      return resources.map((resource) => ({
        name: resource.name,
        type: resource.initiatorType,
        duration: Math.round(resource.duration),
        size: resource.transferSize || 0,
        startTime: Math.round(resource.startTime)
      }));
    }
    return [];
  };
  const clear = () => {
    entries.value.forEach((entry) => entryPool.release(entry));
    entries.value = [];
    fpsHistory.value.fill(0);
    fpsIndex = 0;
    metrics.renderTime = 0;
    metrics.loadTime = 0;
    metrics.updateTime = 0;
    metrics.componentCount = 0;
    metrics.domNodes = 0;
    metrics.memory = 0;
    metrics.fps = 0;
  };
  const getMetrics = () => {
    countDOMNodes();
    updateMemory();
    return {
      ...metrics,
      navigationTiming: getNavigationTiming(),
      resourceTiming: getResourceTiming(),
      entries: entries.value
    };
  };
  const generateReport = () => {
    const report = {
      templateId,
      timestamp: Date.now(),
      metrics: getMetrics(),
      memory: {
        ...memory
      },
      fps: {
        current: metrics.fps,
        history: [...fpsHistory.value],
        average: Math.round(fpsHistory.value.reduce((a, b) => a + b, 0) / fpsHistory.value.length)
      }
    };
    return report;
  };
  const exportData = (format = "json") => {
    const report = generateReport();
    if (format === "json") {
      return JSON.stringify(report, null, 2);
    }
    const rows = [["Metric", "Value"], ["Render Time", `${metrics.renderTime}ms`], ["Load Time", `${metrics.loadTime}ms`], ["Update Time", `${metrics.updateTime}ms`], ["Component Count", String(metrics.componentCount)], ["DOM Nodes", String(metrics.domNodes)], ["Memory Usage", `${metrics.memory}MB`], ["FPS", String(metrics.fps)]];
    return rows.map((row) => row.join(",")).join("\n");
  };
  onMounted(() => {
    startFPSMonitoring();
    updateMemory();
    countDOMNodes();
    intervalId = window.setInterval(() => {
      updateMemory();
      countDOMNodes();
    }, 1e3);
  });
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    stopFPSMonitoring();
    entries.value.forEach((entry) => entryPool.release(entry));
    entries.value = [];
  });
  return {
    // 状态
    metrics: readonly(metrics),
    entries: readonly(entries),
    memory: readonly(memory),
    fpsHistory: readonly(fpsHistory),
    // 方法
    startMeasure,
    endMeasure,
    measure,
    clear,
    getMetrics,
    generateReport,
    exportData,
    // FPS 监控
    startFPSMonitoring,
    stopFPSMonitoring,
    // 工具
    updateMemory,
    countDOMNodes,
    getNavigationTiming,
    getResourceTiming
  };
}

export { useTemplatePerformance };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplatePerformance.js.map
