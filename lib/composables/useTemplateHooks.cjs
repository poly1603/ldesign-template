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
var manager = require('../core/manager.cjs');

function useTemplateLifecycle(category, device, name, lifecycle, options) {
  const manager$1 = manager.getManager();
  const categoryRef = vue.ref(category);
  const deviceRef = vue.ref(device || detectDevice());
  const nameRef = vue.ref(name || "default");
  const component = vue.shallowRef(null);
  const metadata = vue.shallowRef(null);
  const loading = vue.ref(false);
  const error = vue.ref(null);
  const retryCount = vue.ref(0);
  const watchers = [];
  async function loadTemplate() {
    try {
      loading.value = true;
      error.value = null;
      const templates = await manager$1.queryTemplates({
        category: categoryRef.value,
        device: deviceRef.value,
        name: nameRef.value
      });
      const meta = templates[0];
      if (!meta) {
        throw new Error(`Template not found: ${categoryRef.value}/${deviceRef.value}/${nameRef.value}`);
      }
      metadata.value = meta;
      await lifecycle?.onBeforeLoad?.(meta);
      const loadedComponent = await manager$1.loadTemplate(categoryRef.value, deviceRef.value, nameRef.value, options);
      component.value = loadedComponent;
      lifecycle?.onLoaded?.(loadedComponent, meta);
      retryCount.value = 0;
    } catch (e) {
      error.value = e;
      lifecycle?.onError?.(e, retry);
    } finally {
      loading.value = false;
    }
  }
  async function retry() {
    retryCount.value++;
    lifecycle?.onRetry?.(retryCount.value);
    const delay = Math.min(1e3 * 2 ** (retryCount.value - 1), 8e3);
    await new Promise((resolve) => setTimeout(resolve, delay));
    await loadTemplate();
  }
  const prefetch = async (templates) => {
    const tasks = templates.map((template) => {
      const [cat, dev, nm] = template.split("/");
      return manager$1.preloadTemplate(cat, dev, nm);
    });
    await Promise.allSettled(tasks);
  };
  const transition = async (category2, device2, name2) => {
    const oldTemplate = `${categoryRef.value}/${deviceRef.value}/${nameRef.value}`;
    const newTemplate = `${category2}/${device2 || deviceRef.value}/${name2 || nameRef.value}`;
    lifecycle?.onTransition?.(oldTemplate, newTemplate);
    if (component.value) {
      lifecycle?.onBeforeUnload?.(component.value);
    }
    categoryRef.value = category2;
    if (device2) deviceRef.value = device2;
    if (name2) nameRef.value = name2;
    await loadTemplate();
  };
  const dispose = () => {
    watchers.forEach((stop) => stop());
    watchers.length = 0;
    if (component.value) {
      lifecycle?.onBeforeUnload?.(component.value);
    }
    component.value = null;
    metadata.value = null;
    error.value = null;
    retryCount.value = 0;
  };
  const stopWatcher = vue.watch([categoryRef, deviceRef, nameRef], () => loadTemplate(), {
    immediate: false
  });
  watchers.push(stopWatcher);
  vue.onMounted(() => {
    loadTemplate();
  });
  vue.onUnmounted(() => {
    dispose();
  });
  return {
    component: vue.computed(() => component.value),
    metadata: vue.computed(() => metadata.value),
    loading: vue.computed(() => loading.value),
    error: vue.computed(() => error.value),
    retry,
    prefetch,
    transition,
    dispose
  };
}
function useTemplatePrefetch(options = {}) {
  const manager$1 = manager.getManager();
  const prefetchQueue = vue.ref([]);
  const isPrefetching = vue.ref(false);
  const abortController = vue.ref(null);
  const {
    strategy = "smart",
    delay = 0,
    // priority = 'normal', // Not used currently
    maxConcurrent = 3
  } = options;
  const prefetch = async (templates) => {
    if (abortController.value) {
      abortController.value.abort();
    }
    abortController.value = new AbortController();
    prefetchQueue.value = templates;
    isPrefetching.value = true;
    try {
      switch (strategy) {
        case "eager":
          await Promise.all(templates.map((t) => {
            const [cat, dev, nm] = t.split("/");
            return manager$1.preloadTemplate(cat, dev, nm);
          }));
          break;
        case "lazy":
          for (const template of templates) {
            if (abortController.value.signal.aborted) break;
            const [cat, dev, nm] = template.split("/");
            await manager$1.preloadTemplate(cat, dev, nm);
            if (delay > 0) {
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
          break;
        case "smart": {
          const batches = [];
          for (let i = 0; i < templates.length; i += maxConcurrent) {
            batches.push(templates.slice(i, i + maxConcurrent));
          }
          for (const batch of batches) {
            if (abortController.value.signal.aborted) break;
            await Promise.all(batch.map((t) => {
              const [cat, dev, nm] = t.split("/");
              return manager$1.preloadTemplate(cat, dev, nm);
            }));
            if (delay > 0) {
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
          break;
        }
        case "idle":
          if ("requestIdleCallback" in window) {
            for (const template of templates) {
              if (abortController.value.signal.aborted) break;
              await new Promise((resolve) => {
                window.requestIdleCallback(() => {
                  const [cat, dev, nm] = template.split("/");
                  manager$1.preloadTemplate(cat, dev, nm).then(() => resolve());
                });
              });
            }
          } else {
            await prefetch(templates);
          }
          break;
      }
    } finally {
      isPrefetching.value = false;
      prefetchQueue.value = [];
    }
  };
  const prefetchRelated = async (category, device) => {
    const templates = await manager$1.getTemplatesByCategory(category);
    const prefetchList = templates.filter((t) => t.device === device).map((t) => `${t.category}/${t.device}/${t.name}`);
    await prefetch(prefetchList);
  };
  const cancelPrefetch = () => {
    if (abortController.value) {
      abortController.value.abort();
      abortController.value = null;
    }
    isPrefetching.value = false;
    prefetchQueue.value = [];
  };
  vue.onUnmounted(() => {
    cancelPrefetch();
  });
  return {
    prefetch,
    prefetchRelated,
    cancelPrefetch
  };
}
function useTemplateNavigation() {
  const history = vue.ref([]);
  const currentIndex = vue.ref(-1);
  const navigate = (template) => {
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1);
    }
    history.value.push(template);
    currentIndex.value = history.value.length - 1;
  };
  const back = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
      return history.value[currentIndex.value];
    }
    return null;
  };
  const forward = () => {
    if (currentIndex.value < history.value.length - 1) {
      currentIndex.value++;
      return history.value[currentIndex.value];
    }
    return null;
  };
  const canGoBack = vue.computed(() => currentIndex.value > 0);
  const canGoForward = vue.computed(() => currentIndex.value < history.value.length - 1);
  const current = vue.computed(() => currentIndex.value >= 0 ? history.value[currentIndex.value] : null);
  const clearHistory = () => {
    history.value = [];
    currentIndex.value = -1;
  };
  return {
    navigate,
    back,
    forward,
    canGoBack,
    canGoForward,
    current,
    history: vue.computed(() => [...history.value]),
    clearHistory
  };
}
function useTemplatePerformance() {
  const metrics = vue.ref(/* @__PURE__ */ new Map());
  const observer = vue.ref(null);
  const startMonitoring = () => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }
    observer.value = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes("template-load")) {
          metrics.value.set(entry.name, entry);
        }
      }
    });
    observer.value.observe({
      entryTypes: ["measure", "navigation"]
    });
  };
  const stopMonitoring = () => {
    observer.value?.disconnect();
    observer.value = null;
  };
  const markLoadStart = (templateId) => {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`template-load-start-${templateId}`);
    }
  };
  const markLoadEnd = (templateId) => {
    if (typeof window !== "undefined" && "performance" in window) {
      const endMark = `template-load-end-${templateId}`;
      const startMark = `template-load-start-${templateId}`;
      performance.mark(endMark);
      performance.measure(`template-load-${templateId}`, startMark, endMark);
    }
  };
  const getLoadTime = (templateId) => {
    const entry = metrics.value.get(`template-load-${templateId}`);
    return entry ? entry.duration : null;
  };
  const getAverageLoadTime = () => {
    const times = Array.from(metrics.value.values()).map((e) => e.duration).filter((d) => d > 0);
    if (times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  };
  const clearMetrics = () => {
    metrics.value.clear();
    if (typeof window !== "undefined" && "performance" in window) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  };
  vue.onMounted(() => {
    startMonitoring();
  });
  vue.onUnmounted(() => {
    stopMonitoring();
    clearMetrics();
  });
  return {
    markLoadStart,
    markLoadEnd,
    getLoadTime,
    getAverageLoadTime,
    clearMetrics,
    metrics: vue.computed(() => new Map(metrics.value))
  };
}
function detectDevice() {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

exports.useTemplateLifecycle = useTemplateLifecycle;
exports.useTemplateNavigation = useTemplateNavigation;
exports.useTemplatePerformance = useTemplatePerformance;
exports.useTemplatePrefetch = useTemplatePrefetch;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplateHooks.cjs.map
