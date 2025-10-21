/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { readonly, computed, onUnmounted } from 'vue';

class TemplateAnalytics {
  constructor(config = {}) {
    this.usageMap = /* @__PURE__ */ new Map();
    this.performanceMetrics = [];
    this.interactionEvents = [];
    this.sessionStartTime = Date.now();
    this.disposed = false;
    this.cleanupTimer = null;
    this.config = {
      enabled: config.enabled ?? true,
      sampleRate: config.sampleRate ?? 1,
      maxEvents: config.maxEvents ?? 1e3,
      enablePerformanceTracking: config.enablePerformanceTracking ?? true,
      enableErrorTracking: config.enableErrorTracking ?? true,
      enableInteractionTracking: config.enableInteractionTracking ?? true
    };
    this.scheduleCleanup();
  }
  /**
   * 判断是否应该记录事件（基于采样率）
   */
  shouldRecord() {
    if (this.disposed || !this.config.enabled) return false;
    return Math.random() < this.config.sampleRate;
  }
  /**
   * 记录模板加载
   */
  trackLoad(templateId, templateName, duration) {
    if (!this.shouldRecord()) return;
    const usage = this.getOrCreateUsage(templateId, templateName);
    usage.loadCount++;
    usage.totalLoadTime += duration;
    usage.averageLoadTime = usage.totalLoadTime / usage.loadCount;
    usage.lastUsedAt = Date.now();
    if (this.config.enablePerformanceTracking) {
      this.recordPerformanceMetric({
        templateId,
        metric: "load",
        duration,
        timestamp: Date.now()
      });
    }
  }
  /**
   * 记录模板渲染
   */
  trackRender(templateId, templateName, duration) {
    if (!this.shouldRecord()) return;
    const usage = this.getOrCreateUsage(templateId, templateName);
    usage.renderCount++;
    usage.totalRenderTime += duration;
    usage.averageRenderTime = usage.totalRenderTime / usage.renderCount;
    usage.lastUsedAt = Date.now();
    if (this.config.enablePerformanceTracking) {
      this.recordPerformanceMetric({
        templateId,
        metric: "render",
        duration,
        timestamp: Date.now()
      });
    }
  }
  /**
   * 记录模板错误
   */
  trackError(templateId, templateName, error) {
    if (this.disposed || !this.config.enableErrorTracking) return;
    const usage = this.getOrCreateUsage(templateId, templateName);
    usage.errorCount++;
    usage.lastUsedAt = Date.now();
    if (import.meta.env.DEV) {
      console.warn(`Template error tracked: ${templateId}`, error);
    }
  }
  /**
   * 记录用户交互
   */
  trackInteraction(templateId, eventType, data) {
    if (this.disposed || !this.config.enableInteractionTracking || !this.shouldRecord()) return;
    const event = {
      templateId,
      eventType,
      timestamp: Date.now(),
      data
    };
    this.interactionEvents.push(event);
    if (this.interactionEvents.length > this.config.maxEvents) {
      this.interactionEvents.shift();
    }
  }
  /**
   * 记录性能指标
   */
  recordPerformanceMetric(metric) {
    this.performanceMetrics.push(metric);
    if (this.performanceMetrics.length > this.config.maxEvents) {
      this.performanceMetrics.shift();
    }
  }
  /**
   * 获取或创建模板使用统计
   */
  getOrCreateUsage(templateId, templateName) {
    let usage = this.usageMap.get(templateId);
    if (!usage) {
      usage = {
        templateId,
        templateName,
        loadCount: 0,
        renderCount: 0,
        errorCount: 0,
        totalLoadTime: 0,
        averageLoadTime: 0,
        totalRenderTime: 0,
        averageRenderTime: 0,
        lastUsedAt: Date.now(),
        firstUsedAt: Date.now()
      };
      this.usageMap.set(templateId, usage);
    }
    return usage;
  }
  /**
   * 获取所有使用统计
   */
  getAllUsage() {
    return Array.from(this.usageMap.values());
  }
  /**
   * 获取特定模板的统计
   */
  getUsage(templateId) {
    return this.usageMap.get(templateId);
  }
  /**
   * 获取性能指标
   */
  getPerformanceMetrics(templateId) {
    if (templateId) {
      return this.performanceMetrics.filter((m) => m.templateId === templateId);
    }
    return this.performanceMetrics;
  }
  /**
   * 获取交互事件
   */
  getInteractionEvents(templateId) {
    if (templateId) {
      return this.interactionEvents.filter((e) => e.templateId === templateId);
    }
    return this.interactionEvents;
  }
  /**
   * 生成分析报告
   */
  generateReport() {
    const allUsage = this.getAllUsage();
    const totalUsage = allUsage.reduce((sum, u) => sum + u.renderCount, 0);
    const partialSort = (arr, compareFn, k) => {
      if (arr.length <= k) return [...arr].sort(compareFn);
      const result = arr.slice(0, k);
      result.sort(compareFn);
      for (let i = k; i < arr.length; i++) {
        const item = arr[i];
        if (compareFn(item, result[k - 1]) < 0) {
          result[k - 1] = item;
          result.sort(compareFn);
        }
      }
      return result;
    };
    const mostUsed = partialSort(allUsage, (a, b) => b.renderCount - a.renderCount, 5);
    const leastUsed = partialSort(allUsage, (a, b) => a.renderCount - b.renderCount, 5);
    const slowest = partialSort(allUsage, (a, b) => b.averageRenderTime - a.averageRenderTime, 5);
    const errorProne = partialSort(allUsage.filter((u) => u.errorCount > 0), (a, b) => b.errorCount - a.errorCount, 5);
    const averageLoadTime = allUsage.reduce((sum, u) => sum + u.averageLoadTime, 0) / allUsage.length || 0;
    const averageRenderTime = allUsage.reduce((sum, u) => sum + u.averageRenderTime, 0) / allUsage.length || 0;
    const errorRate = allUsage.reduce((sum, u) => sum + u.errorCount, 0) / totalUsage || 0;
    let performanceScore = 100;
    if (averageLoadTime > 1e3) performanceScore -= 20;
    if (averageLoadTime > 2e3) performanceScore -= 20;
    if (averageRenderTime > 100) performanceScore -= 15;
    if (averageRenderTime > 200) performanceScore -= 15;
    if (errorRate > 0.01) performanceScore -= 15;
    if (errorRate > 0.05) performanceScore -= 15;
    performanceScore = Math.max(0, performanceScore);
    const recommendations = [];
    if (averageLoadTime > 1e3) {
      recommendations.push("Consider implementing lazy loading for templates");
    }
    if (averageRenderTime > 100) {
      recommendations.push("Optimize template rendering performance");
    }
    if (errorRate > 0.01) {
      recommendations.push("Investigate and fix templates with high error rates");
    }
    if (leastUsed.length > 0 && leastUsed[0].renderCount === 0) {
      recommendations.push("Remove unused templates to reduce bundle size");
    }
    slowest.forEach((template) => {
      if (template.averageRenderTime > 200) {
        recommendations.push(`Optimize ${template.templateName} - slow rendering detected`);
      }
    });
    return {
      totalTemplates: allUsage.length,
      totalUsage,
      mostUsedTemplates: mostUsed,
      leastUsedTemplates: leastUsed,
      slowestTemplates: slowest,
      errorProneTemplates: errorProne,
      performanceScore,
      recommendations
    };
  }
  /**
   * 导出数据
   */
  exportData() {
    return {
      usage: this.getAllUsage(),
      metrics: this.getPerformanceMetrics(),
      interactions: this.getInteractionEvents(),
      sessionDuration: Date.now() - this.sessionStartTime
    };
  }
  /**
   * 清除所有数据
   */
  clear() {
    this.usageMap.clear();
    this.performanceMetrics.length = 0;
    this.interactionEvents.length = 0;
    this.sessionStartTime = Date.now();
  }
  /**
   * 销毁分析器实例
   */
  dispose() {
    this.disposed = true;
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
    this.usageMap.clear();
  }
  /**
   * 定期清理老旧数据
   */
  scheduleCleanup() {
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
    }
    this.cleanupTimer = setTimeout(() => {
      if (!this.disposed) {
        const now = Date.now();
        const maxAge = 30 * 60 * 1e3;
        this.performanceMetrics = this.performanceMetrics.filter((m) => now - m.timestamp < maxAge);
        this.interactionEvents = this.interactionEvents.filter((e) => now - e.timestamp < maxAge);
        this.scheduleCleanup();
      }
    }, 10 * 60 * 1e3);
  }
  /**
   * 更新配置
   */
  updateConfig(config) {
    Object.assign(this.config, config);
  }
  /**
   * 启用分析
   */
  enable() {
    this.config.enabled = true;
  }
  /**
   * 禁用分析
   */
  disable() {
    this.config.enabled = false;
  }
  /**
   * 获取配置
   */
  getConfig() {
    return readonly(this.config);
  }
}
let _globalAnalytics = null;
function getGlobalAnalytics() {
  if (!_globalAnalytics) {
    _globalAnalytics = new TemplateAnalytics();
  }
  return _globalAnalytics;
}
function destroyGlobalAnalytics() {
  if (_globalAnalytics) {
    _globalAnalytics.dispose();
    _globalAnalytics = null;
  }
}
let _globalAnalyticsProxy = null;
const globalAnalytics = new Proxy({}, {
  get(target, prop) {
    if (!_globalAnalyticsProxy) {
      _globalAnalyticsProxy = getGlobalAnalytics();
    }
    return _globalAnalyticsProxy[prop];
  }
});
function useTemplateAnalytics(config) {
  const analytics = config ? new TemplateAnalytics(config) : getGlobalAnalytics();
  const isCustomInstance = !!config;
  const allUsage = computed(() => analytics.getAllUsage());
  const report = computed(() => analytics.generateReport());
  const trackLoad = (templateId, templateName, duration) => {
    analytics.trackLoad(templateId, templateName, duration);
  };
  const trackRender = (templateId, templateName, duration) => {
    analytics.trackRender(templateId, templateName, duration);
  };
  const trackError = (templateId, templateName, error) => {
    analytics.trackError(templateId, templateName, error);
  };
  const trackInteraction = (templateId, eventType, data) => {
    analytics.trackInteraction(templateId, eventType, data);
  };
  const getUsage = (templateId) => {
    return analytics.getUsage(templateId);
  };
  const getPerformanceMetrics = (templateId) => {
    return analytics.getPerformanceMetrics(templateId);
  };
  const exportData = () => {
    return analytics.exportData();
  };
  const clear = () => {
    analytics.clear();
  };
  if (isCustomInstance) {
    onUnmounted(() => {
      analytics.dispose();
    });
  }
  return {
    allUsage,
    report,
    trackLoad,
    trackRender,
    trackError,
    trackInteraction,
    getUsage,
    getPerformanceMetrics,
    exportData,
    clear
  };
}
function withPerformanceTracking(fn, templateId, metric) {
  return (...args) => {
    const startTime = performance.now();
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration2 = performance.now() - startTime;
          globalAnalytics.recordPerformanceMetric({
            templateId,
            metric,
            duration: duration2,
            timestamp: Date.now()
          });
        });
      }
      const duration = performance.now() - startTime;
      globalAnalytics.recordPerformanceMetric({
        templateId,
        metric,
        duration,
        timestamp: Date.now()
      });
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      globalAnalytics.recordPerformanceMetric({
        templateId,
        metric,
        duration,
        timestamp: Date.now(),
        metadata: {
          error: true
        }
      });
      throw error;
    }
  };
}

export { TemplateAnalytics, destroyGlobalAnalytics, getGlobalAnalytics, globalAnalytics, useTemplateAnalytics, withPerformanceTracking };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=templateAnalytics.js.map
