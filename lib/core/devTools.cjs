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

class TemplateDebugger {
  constructor() {
    this.logs = vue.reactive([]);
    this.breakpoints = /* @__PURE__ */ new Map();
    this.watchedTemplates = /* @__PURE__ */ new Set();
    this.paused = vue.ref(false);
    this.currentContext = null;
  }
  /**
   * 添加日志
   */
  log(info) {
    const debugInfo = {
      ...info,
      id: this.generateId(),
      timestamp: Date.now()
    };
    this.logs.push(debugInfo);
    if (this.logs.length > 1e3) {
      this.logs.shift();
    }
    if (this.shouldBreak(info.category)) {
      this.pause(debugInfo);
    }
  }
  /**
   * 设置断点
   */
  setBreakpoint(templateId, point) {
    if (!this.breakpoints.has(templateId)) {
      this.breakpoints.set(templateId, /* @__PURE__ */ new Set());
    }
    this.breakpoints.get(templateId).add(point);
  }
  /**
   * 移除断点
   */
  removeBreakpoint(templateId, point) {
    const points = this.breakpoints.get(templateId);
    if (points) {
      points.delete(point);
      if (points.size === 0) {
        this.breakpoints.delete(templateId);
      }
    }
  }
  /**
   * 监视模板
   */
  watchTemplate(templateId) {
    this.watchedTemplates.add(templateId);
  }
  /**
   * 取消监视
   */
  unwatchTemplate(templateId) {
    this.watchedTemplates.delete(templateId);
  }
  /**
   * 暂停执行
   */
  pause(info) {
    this.paused.value = true;
    this.currentContext = info;
    console.log("\u{1F534} Breakpoint hit:", info);
    return new Promise((resolve) => {
      const checkResume = () => {
        if (!this.paused.value) {
          resolve(void 0);
        } else {
          setTimeout(checkResume, 100);
        }
      };
      checkResume();
    });
  }
  /**
   * 继续执行
   */
  resume() {
    this.paused.value = false;
    this.currentContext = null;
  }
  /**
   * 步进执行
   */
  stepOver() {
    this.resume();
  }
  /**
   * 步入执行
   */
  stepInto() {
    this.resume();
  }
  /**
   * 步出执行
   */
  stepOut() {
    this.resume();
  }
  /**
   * 清空日志
   */
  clearLogs() {
    this.logs.splice(0, this.logs.length);
  }
  /**
   * 获取日志
   */
  getLogs(filter) {
    let result = [...this.logs];
    if (filter) {
      if (filter.type) {
        result = result.filter((log) => log.type === filter.type);
      }
      if (filter.category) {
        result = result.filter((log) => log.category === filter.category);
      }
      if (filter.startTime) {
        result = result.filter((log) => log.timestamp >= filter.startTime);
      }
      if (filter.endTime) {
        result = result.filter((log) => log.timestamp <= filter.endTime);
      }
    }
    return result;
  }
  /**
   * 导出日志
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
  /**
   * 是否应该中断
   */
  shouldBreak(category) {
    for (const points of this.breakpoints.values()) {
      if (points.has(category) || points.has("*")) {
        return true;
      }
    }
    return false;
  }
  /**
   * 生成唯一ID
   */
  generateId() {
    return `debug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
class TemplateProfiler {
  constructor() {
    this.metrics = /* @__PURE__ */ new Map();
    this.timers = /* @__PURE__ */ new Map();
    this.enabled = vue.ref(true);
  }
  /**
   * 开始计时
   */
  startTimer(id) {
    if (!this.enabled.value) return;
    this.timers.set(id, performance.now());
  }
  /**
   * 结束计时
   */
  endTimer(id) {
    if (!this.enabled.value) return 0;
    const startTime = this.timers.get(id);
    if (!startTime) return 0;
    const duration = performance.now() - startTime;
    this.timers.delete(id);
    return duration;
  }
  /**
   * 记录性能指标
   */
  recordMetrics(templateId, metrics) {
    if (!this.metrics.has(templateId)) {
      this.metrics.set(templateId, []);
    }
    const templateMetrics = this.metrics.get(templateId);
    templateMetrics.push(metrics);
    if (templateMetrics.length > 100) {
      templateMetrics.shift();
    }
  }
  /**
   * 获取性能指标
   */
  getMetrics(templateId) {
    if (templateId) {
      return this.metrics.get(templateId);
    }
    return this.metrics;
  }
  /**
   * 获取平均性能
   */
  getAverageMetrics(templateId) {
    const metrics = this.metrics.get(templateId);
    if (!metrics || metrics.length === 0) return void 0;
    const sum = metrics.reduce((acc, m) => ({
      renderTime: acc.renderTime + m.renderTime,
      updateTime: acc.updateTime + m.updateTime,
      mountTime: acc.mountTime + m.mountTime,
      unmountTime: acc.unmountTime + m.unmountTime,
      memoryUsage: (acc.memoryUsage || 0) + (m.memoryUsage || 0),
      componentCount: (acc.componentCount || 0) + (m.componentCount || 0),
      propUpdateCount: (acc.propUpdateCount || 0) + (m.propUpdateCount || 0)
    }), {
      renderTime: 0,
      updateTime: 0,
      mountTime: 0,
      unmountTime: 0,
      memoryUsage: 0,
      componentCount: 0,
      propUpdateCount: 0
    });
    const count = metrics.length;
    return {
      renderTime: sum.renderTime / count,
      updateTime: sum.updateTime / count,
      mountTime: sum.mountTime / count,
      unmountTime: sum.unmountTime / count,
      memoryUsage: sum.memoryUsage ? sum.memoryUsage / count : void 0,
      componentCount: sum.componentCount ? Math.round(sum.componentCount / count) : void 0,
      propUpdateCount: sum.propUpdateCount ? Math.round(sum.propUpdateCount / count) : void 0
    };
  }
  /**
   * 清空性能数据
   */
  clearMetrics(templateId) {
    if (templateId) {
      this.metrics.delete(templateId);
    } else {
      this.metrics.clear();
    }
  }
  /**
   * 导出性能数据
   */
  exportMetrics() {
    const data = {};
    for (const [id, metrics] of this.metrics) {
      data[id] = {
        metrics,
        average: this.getAverageMetrics(id)
      };
    }
    return JSON.stringify(data, null, 2);
  }
  /**
   * 启用/禁用性能分析
   */
  setEnabled(enabled) {
    this.enabled.value = enabled;
  }
}
class TemplateInspector {
  constructor() {
    this.selectedTemplate = vue.ref(null);
    this.selectedComponent = vue.ref(null);
    this.highlightEnabled = vue.ref(false);
  }
  /**
   * 选择模板
   */
  selectTemplate(template) {
    this.selectedTemplate.value = template;
  }
  /**
   * 选择组件
   */
  selectComponent(component) {
    this.selectedComponent.value = component;
  }
  /**
   * 获取模板信息
   */
  getTemplateInfo(template) {
    return {
      id: template.id,
      name: template.name,
      category: template.category,
      metadata: template.metadata,
      config: template.config,
      component: template.component,
      content: template.content,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt
    };
  }
  /**
   * 获取组件信息
   */
  getComponentInfo(component) {
    return {
      name: component.$options.name || "Anonymous",
      props: component.$props,
      data: component.$data,
      computed: this.getComputedProperties(component),
      methods: this.getMethods(component),
      refs: component.$refs,
      parent: component.$parent?.$options.name || null,
      children: []
      // $children is not available in Vue 3
    };
  }
  /**
   * 获取计算属性
   */
  getComputedProperties(component) {
    const computed = {};
    const options = component.$options.computed;
    if (options) {
      for (const key of Object.keys(options)) {
        try {
          computed[key] = component[key];
        } catch {
          computed[key] = "<Error>";
        }
      }
    }
    return computed;
  }
  /**
   * 获取方法
   */
  getMethods(component) {
    const methods = [];
    const options = component.$options.methods;
    if (options) {
      methods.push(...Object.keys(options));
    }
    return methods;
  }
  /**
   * 高亮元素
   */
  highlightElement(element) {
    if (!this.highlightEnabled.value) return;
    const originalOutline = element.style.outline;
    element.style.outline = "2px solid #FF6B6B";
    setTimeout(() => {
      element.style.outline = originalOutline;
    }, 3e3);
  }
  /**
   * 启用/禁用高亮
   */
  setHighlightEnabled(enabled) {
    this.highlightEnabled.value = enabled;
  }
}
class NetworkMonitor {
  constructor() {
    this.requests = vue.reactive([]);
    this.enabled = vue.ref(true);
  }
  /**
   * 拦截请求
   */
  interceptRequest(config) {
    if (!this.enabled.value) return config;
    const request = {
      id: this.generateId(),
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      timestamp: Date.now(),
      status: "pending"
    };
    this.requests.push(request);
    if (this.requests.length > 500) {
      this.requests.shift();
    }
    config._requestId = request.id;
    return config;
  }
  /**
   * 处理响应
   */
  handleResponse(response) {
    if (!this.enabled.value) return response;
    const requestId = response.config?._requestId;
    if (requestId) {
      const request = this.requests.find((r) => r.id === requestId);
      if (request) {
        request.status = "success";
        request.response = {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data
        };
        request.duration = Date.now() - request.timestamp;
      }
    }
    return response;
  }
  /**
   * 处理错误
   */
  handleError(error) {
    if (!this.enabled.value) return Promise.reject(error);
    const requestId = error.config?._requestId;
    if (requestId) {
      const request = this.requests.find((r) => r.id === requestId);
      if (request) {
        request.status = "error";
        request.error = error.message;
        request.duration = Date.now() - request.timestamp;
      }
    }
    return Promise.reject(error);
  }
  /**
   * 获取请求列表
   */
  getRequests(filter) {
    let result = [...this.requests];
    if (filter) {
      if (filter.status) {
        result = result.filter((r) => r.status === filter.status);
      }
      if (filter.method) {
        result = result.filter((r) => r.method === filter.method);
      }
      if (filter.url) {
        result = result.filter((r) => r.url.includes(filter.url));
      }
    }
    return result;
  }
  /**
   * 清空请求记录
   */
  clearRequests() {
    this.requests.splice(0, this.requests.length);
  }
  /**
   * 生成唯一ID
   */
  generateId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * 启用/禁用网络监控
   */
  setEnabled(enabled) {
    this.enabled.value = enabled;
  }
}
class ConsoleEnhancer {
  constructor() {
    this.originalConsole = {};
    this.logs = vue.reactive([]);
    this.filters = /* @__PURE__ */ new Set(["log", "info", "warn", "error", "debug"]);
  }
  /**
   * 增强控制台
   */
  enhance() {
    this.originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };
    const methods = ["log", "info", "warn", "error", "debug"];
    for (const method of methods) {
      console[method] = (...args) => {
        this.addLog(method, args);
        this.originalConsole[method](...args);
      };
    }
  }
  /**
   * 恢复控制台
   */
  restore() {
    Object.assign(console, this.originalConsole);
  }
  /**
   * 添加日志
   */
  addLog(type, args) {
    const log = {
      id: this.generateId(),
      type,
      timestamp: Date.now(),
      args,
      stack: new Error("Stack").stack
    };
    this.logs.push(log);
    if (this.logs.length > 1e3) {
      this.logs.shift();
    }
  }
  /**
   * 获取日志
   */
  getLogs(filter) {
    if (!filter || filter.length === 0) {
      return [...this.logs];
    }
    return this.logs.filter((log) => filter.includes(log.type));
  }
  /**
   * 清空日志
   */
  clearLogs() {
    this.logs.splice(0, this.logs.length);
  }
  /**
   * 设置过滤器
   */
  setFilters(filters) {
    this.filters = new Set(filters);
  }
  /**
   * 生成唯一ID
   */
  generateId() {
    return `console_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
class DevToolsManager {
  constructor(config) {
    this.templateDebugger = null;
    this.profiler = null;
    this.inspector = null;
    this.networkMonitor = null;
    this.consoleEnhancer = null;
    this.app = null;
    this.disposed = false;
    this.config = vue.reactive(config);
    if (undefined.DEV && config.enabled) {
      this.templateDebugger = new TemplateDebugger();
      this.profiler = new TemplateProfiler();
      this.inspector = new TemplateInspector();
      this.networkMonitor = new NetworkMonitor();
      this.consoleEnhancer = new ConsoleEnhancer();
    }
  }
  /**
   * 获取实例
   */
  static getInstance(config) {
    if (!this.instance) {
      this.instance = new DevToolsManager(config || {
        enabled: true,
        position: "bottom-right",
        theme: "dark",
        collapsed: true,
        features: {
          inspector: true,
          debugger: true,
          profiler: true,
          analyzer: true,
          network: true,
          console: true
        }
      });
    }
    return this.instance;
  }
  /**
   * 安装到Vue应用
   */
  install(app) {
    this.app = app;
    app.config.globalProperties.$devTools = this;
    if (this.config.features?.console && this.consoleEnhancer) {
      this.consoleEnhancer.enhance();
    }
    app.config.errorHandler = (err, instance, info) => {
      if (this.templateDebugger) {
        const error = err;
        this.templateDebugger.log({
          type: "error",
          category: "global",
          message: error.message || String(err),
          data: {
            error: err,
            instance,
            info
          },
          stack: error.stack
        });
      }
    };
    app.config.warnHandler = (msg, instance, trace) => {
      if (this.templateDebugger) {
        this.templateDebugger.log({
          type: "warning",
          category: "global",
          message: msg,
          data: {
            instance,
            trace
          }
        });
      }
    };
  }
  /**
   * 卸载
   */
  uninstall() {
    if (this.disposed) return;
    if (this.config.features?.console && this.consoleEnhancer) {
      this.consoleEnhancer.restore();
    }
    if (this.app) {
      delete this.app.config.globalProperties.$devTools;
      this.app.config.errorHandler = void 0;
      this.app.config.warnHandler = void 0;
      this.app = null;
    }
    this.dispose();
  }
  /**
   * 销毁实例
   */
  dispose() {
    this.disposed = true;
    if (this.templateDebugger) {
      this.templateDebugger.clearLogs();
      this.templateDebugger = null;
    }
    if (this.profiler) {
      this.profiler.clearMetrics();
      this.profiler = null;
    }
    if (this.inspector) {
      this.inspector = null;
    }
    if (this.networkMonitor) {
      this.networkMonitor.clearRequests();
      this.networkMonitor = null;
    }
    if (this.consoleEnhancer) {
      this.consoleEnhancer.clearLogs();
      this.consoleEnhancer = null;
    }
    if (DevToolsManager.instance === this) {
      DevToolsManager.instance = null;
    }
  }
  /**
   * 获取调试器
   */
  getDebugger() {
    return this.templateDebugger;
  }
  /**
   * 获取性能分析器
   */
  getProfiler() {
    return this.profiler;
  }
  /**
   * 获取检查器
   */
  getInspector() {
    return this.inspector;
  }
  /**
   * 获取网络监控器
   */
  getNetworkMonitor() {
    return this.networkMonitor;
  }
  /**
   * 获取控制台增强器
   */
  getConsoleEnhancer() {
    return this.consoleEnhancer;
  }
  /**
   * 更新配置
   */
  updateConfig(config) {
    Object.assign(this.config, config);
  }
  /**
   * 获取配置
   */
  getConfig() {
    return this.config;
  }
  /**
   * 启用/禁用
   */
  setEnabled(enabled) {
    this.config.enabled = enabled;
    if (!enabled) {
      this.consoleEnhancer?.restore();
    } else if (this.config.features?.console) {
      this.consoleEnhancer?.enhance();
    }
  }
}
DevToolsManager.instance = null;
const devTools = DevToolsManager.getInstance();

exports.ConsoleEnhancer = ConsoleEnhancer;
exports.DevToolsManager = DevToolsManager;
exports.NetworkMonitor = NetworkMonitor;
exports.TemplateDebugger = TemplateDebugger;
exports.TemplateInspector = TemplateInspector;
exports.TemplateProfiler = TemplateProfiler;
exports.devTools = devTools;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=devTools.cjs.map
