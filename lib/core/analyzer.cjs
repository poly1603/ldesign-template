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

const createStatsEntry = () => ({
  templateId: "",
  templateName: "",
  usageCount: 0,
  lastUsed: 0,
  firstUsed: 0,
  averageRenderTime: 0,
  errorCount: 0,
  successRate: 100,
  userPreference: 0
});
const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum / numbers.length;
};
const limitArraySize = (arr, maxSize) => {
  while (arr.length > maxSize) {
    arr.shift();
  }
  return arr;
};
class TemplateStatisticsAnalyzer {
  constructor() {
    this.usageStats = /* @__PURE__ */ new Map();
    this.performanceData = /* @__PURE__ */ new Map();
    this.errorLogs = /* @__PURE__ */ new Map();
    this.MAX_PERFORMANCE_ENTRIES = 1e3;
    this.MAX_ERROR_LOGS = 100;
    this.MAX_STATS_ENTRIES = 500;
    this.cleanupTimer = null;
  }
  /**
   * 记录模板使用
   */
  recordUsage(templateId, templateName) {
    const now = Date.now();
    let stats = this.usageStats.get(templateId);
    if (!stats) {
      stats = createStatsEntry();
      stats.templateId = templateId;
      stats.templateName = templateName;
      stats.firstUsed = now;
      this.usageStats.set(templateId, stats);
    }
    stats.usageCount++;
    stats.lastUsed = now;
    this.scheduleCleanup();
  }
  /**
   * 记录渲染时间
   */
  recordRenderTime(templateId, time) {
    let times = this.performanceData.get(templateId);
    if (!times) {
      times = [];
      this.performanceData.set(templateId, times);
    }
    times.push(time);
    limitArraySize(times, this.MAX_PERFORMANCE_ENTRIES);
    const stats = this.usageStats.get(templateId);
    if (stats) {
      stats.averageRenderTime = calculateAverage(times);
    }
  }
  /**
   * 记录错误
   */
  recordError(templateId, error) {
    if (!this.errorLogs.has(templateId)) {
      this.errorLogs.set(templateId, []);
    }
    const errors = this.errorLogs.get(templateId);
    errors.push({
      timestamp: Date.now(),
      error: error.message || String(error),
      stack: error.stack
    });
    limitArraySize(errors, this.MAX_ERROR_LOGS);
    const stats = this.usageStats.get(templateId);
    if (stats) {
      stats.errorCount++;
      stats.successRate = (stats.usageCount - stats.errorCount) / stats.usageCount * 100;
    }
  }
  /**
   * 获取使用统计
   */
  getUsageStats(templateId) {
    if (templateId) {
      return this.usageStats.get(templateId);
    }
    return Array.from(this.usageStats.values());
  }
  /**
   * 获取热门模板
   */
  getPopularTemplates(limit = 10) {
    return Array.from(this.usageStats.values()).sort((a, b) => b.usageCount - a.usageCount).slice(0, limit);
  }
  /**
   * 获取性能差的模板
   */
  getSlowTemplates(limit = 10) {
    return Array.from(this.usageStats.values()).filter((s) => s.averageRenderTime > 0).sort((a, b) => b.averageRenderTime - a.averageRenderTime).slice(0, limit);
  }
  /**
   * 获取错误率高的模板
   */
  getErrorProneTemplates(limit = 10) {
    return Array.from(this.usageStats.values()).filter((s) => s.errorCount > 0).sort((a, b) => b.errorCount - a.errorCount).slice(0, limit);
  }
  /**
   * 生成使用报告
   */
  generateUsageReport() {
    const templates = Array.from(this.usageStats.values());
    const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
    const totalErrors = templates.reduce((sum, t) => sum + t.errorCount, 0);
    const avgRenderTime = templates.reduce((sum, t) => sum + t.averageRenderTime, 0) / templates.length;
    return {
      timestamp: Date.now(),
      totalTemplates: templates.length,
      totalUsage,
      totalErrors,
      overallSuccessRate: (totalUsage - totalErrors) / totalUsage * 100,
      averageRenderTime: avgRenderTime,
      popularTemplates: this.getPopularTemplates(5),
      slowTemplates: this.getSlowTemplates(5),
      errorProneTemplates: this.getErrorProneTemplates(5)
    };
  }
  /**
   * 清空统计数据
   */
  clearStats(templateId) {
    if (templateId) {
      this.usageStats.delete(templateId);
      this.performanceData.delete(templateId);
      this.errorLogs.delete(templateId);
    } else {
      this.usageStats.clear();
      this.performanceData.clear();
      this.errorLogs.clear();
    }
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
  /**
   * 定期清理调度
   */
  scheduleCleanup() {
    if (this.cleanupTimer) return;
    this.cleanupTimer = setTimeout(() => {
      if (this.usageStats.size > this.MAX_STATS_ENTRIES) {
        const sortedStats = Array.from(this.usageStats.entries()).sort((a, b) => b[1].lastUsed - a[1].lastUsed);
        const toKeep = sortedStats.slice(0, this.MAX_STATS_ENTRIES);
        this.usageStats.clear();
        toKeep.forEach(([id, stats]) => this.usageStats.set(id, stats));
      }
      this.cleanupTimer = null;
    }, 6e4);
  }
}
class TemplateDependencyAnalyzer {
  constructor() {
    this.dependencies = /* @__PURE__ */ new Map();
    this.dependents = /* @__PURE__ */ new Map();
    this.MAX_DEPENDENCIES = 1e3;
    this.cleanupTimer = null;
  }
  /**
   * 添加依赖关系
   */
  addDependency(templateId, dependsOn) {
    if (!this.dependencies.has(templateId)) {
      this.dependencies.set(templateId, /* @__PURE__ */ new Set());
    }
    this.dependencies.get(templateId).add(dependsOn);
    if (!this.dependents.has(dependsOn)) {
      this.dependents.set(dependsOn, /* @__PURE__ */ new Set());
    }
    this.dependents.get(dependsOn).add(templateId);
    this.scheduleCleanup();
  }
  /**
   * 移除依赖关系
   */
  removeDependency(templateId, dependsOn) {
    const deps = this.dependencies.get(templateId);
    if (deps) {
      deps.delete(dependsOn);
      if (deps.size === 0) {
        this.dependencies.delete(templateId);
      }
    }
    const depts = this.dependents.get(dependsOn);
    if (depts) {
      depts.delete(templateId);
      if (depts.size === 0) {
        this.dependents.delete(dependsOn);
      }
    }
  }
  /**
   * 获取模板依赖
   */
  getDependencies(templateId) {
    const deps = this.dependencies.get(templateId);
    return deps ? Array.from(deps) : [];
  }
  /**
   * 获取依赖此模板的模板
   */
  getDependents(templateId) {
    const depts = this.dependents.get(templateId);
    return depts ? Array.from(depts) : [];
  }
  /**
   * 检测循环依赖
   */
  detectCircularDependencies(templateId) {
    const visited = /* @__PURE__ */ new Set();
    const stack = /* @__PURE__ */ new Set();
    const hasCircular = (id) => {
      if (stack.has(id)) return true;
      if (visited.has(id)) return false;
      visited.add(id);
      stack.add(id);
      const deps = this.dependencies.get(id);
      if (deps) {
        for (const dep of deps) {
          if (hasCircular(dep)) return true;
        }
      }
      stack.delete(id);
      return false;
    };
    return hasCircular(templateId);
  }
  /**
   * 计算依赖深度
   */
  calculateDepth(templateId) {
    const visited = /* @__PURE__ */ new Set();
    const getDepth = (id) => {
      if (visited.has(id)) return 0;
      visited.add(id);
      const deps = this.dependencies.get(id);
      if (!deps || deps.size === 0) return 0;
      let maxDepth = 0;
      for (const dep of deps) {
        maxDepth = Math.max(maxDepth, getDepth(dep));
      }
      return maxDepth + 1;
    };
    return getDepth(templateId);
  }
  /**
   * 生成依赖图
   */
  generateDependencyGraph() {
    const graph = /* @__PURE__ */ new Map();
    const allTemplates = /* @__PURE__ */ new Set([...this.dependencies.keys(), ...this.dependents.keys()]);
    for (const templateId of allTemplates) {
      graph.set(templateId, {
        templateId,
        dependencies: this.getDependencies(templateId),
        dependents: this.getDependents(templateId),
        depth: this.calculateDepth(templateId),
        circular: this.detectCircularDependencies(templateId)
      });
    }
    return graph;
  }
  /**
   * 获取依赖链
   */
  getDependencyChain(templateId) {
    const chain = [];
    const visited = /* @__PURE__ */ new Set();
    const buildChain = (id) => {
      if (visited.has(id)) return;
      visited.add(id);
      chain.push(id);
      const deps = this.dependencies.get(id);
      if (deps) {
        for (const dep of deps) {
          buildChain(dep);
        }
      }
    };
    buildChain(templateId);
    return chain;
  }
  /**
   * 清空依赖数据
   */
  clearDependencies(templateId) {
    if (templateId) {
      this.dependencies.delete(templateId);
      this.dependents.forEach((depts) => depts.delete(templateId));
      Array.from(this.dependents.entries()).forEach(([id, depts]) => {
        if (depts.size === 0) this.dependents.delete(id);
      });
    } else {
      this.dependencies.clear();
      this.dependents.clear();
    }
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
  /**
   * 定期清理旧依赖
   */
  scheduleCleanup() {
    if (this.cleanupTimer) return;
    this.cleanupTimer = setTimeout(() => {
      if (this.dependencies.size > this.MAX_DEPENDENCIES) {
        const entries = Array.from(this.dependencies.entries());
        const toRemove = entries.slice(this.MAX_DEPENDENCIES);
        toRemove.forEach(([id]) => {
          this.clearDependencies(id);
        });
      }
      this.cleanupTimer = null;
    }, 9e4);
  }
}
class TemplatePerformanceAnalyzer {
  constructor() {
    this.performanceReports = vue.reactive([]);
    this.metricsCollector = /* @__PURE__ */ new Map();
    this.recording = vue.ref(false);
    this.startTime = 0;
    this.MAX_REPORTS = 50;
    this.MAX_METRICS_PER_TEMPLATE = 100;
  }
  /**
   * 开始记录
   */
  startRecording() {
    this.recording.value = true;
    this.startTime = performance.now();
    this.metricsCollector.clear();
  }
  /**
   * 停止记录
   */
  stopRecording() {
    this.recording.value = false;
    const duration = performance.now() - this.startTime;
    const templates = Array.from(this.metricsCollector.entries()).map(([id, metrics]) => {
      const latestMetric = metrics[metrics.length - 1];
      return {
        id,
        name: latestMetric.name || id,
        renderTime: latestMetric.renderTime || 0,
        updateTime: latestMetric.updateTime || 0,
        memoryUsage: latestMetric.memoryUsage || 0,
        domNodes: latestMetric.domNodes || 0,
        componentCount: latestMetric.componentCount || 0
      };
    });
    const report = {
      timestamp: Date.now(),
      duration,
      templates,
      summary: {
        totalRenderTime: templates.reduce((sum, t) => sum + t.renderTime, 0),
        averageRenderTime: templates.length > 0 ? templates.reduce((sum, t) => sum + t.renderTime, 0) / templates.length : 0,
        slowestTemplate: templates.length > 0 ? templates.reduce((slowest, t) => t.renderTime > (slowest?.renderTime || 0) ? t : slowest, templates[0]).id : "",
        fastestTemplate: templates.length > 0 ? templates.reduce((fastest, t) => t.renderTime < (fastest?.renderTime || Infinity) ? t : fastest, templates[0]).id : "",
        totalMemoryUsage: templates.reduce((sum, t) => sum + t.memoryUsage, 0),
        totalDomNodes: templates.reduce((sum, t) => sum + t.domNodes, 0)
      }
    };
    this.performanceReports.push(report);
    if (this.performanceReports.length > this.MAX_REPORTS) {
      this.performanceReports.splice(0, this.performanceReports.length - this.MAX_REPORTS);
    }
    return report;
  }
  /**
   * 收集指标
   */
  collectMetrics(templateId, metrics) {
    if (!this.metricsCollector.has(templateId)) {
      this.metricsCollector.set(templateId, []);
    }
    const templateMetrics = this.metricsCollector.get(templateId);
    templateMetrics.push({
      timestamp: Date.now(),
      ...metrics
    });
    if (templateMetrics.length > this.MAX_METRICS_PER_TEMPLATE) {
      templateMetrics.splice(0, templateMetrics.length - this.MAX_METRICS_PER_TEMPLATE);
    }
  }
  /**
   * 获取性能报告
   */
  getReports(filter) {
    let reports = [...this.performanceReports];
    if (filter) {
      if (filter.startTime) {
        reports = reports.filter((r) => r.timestamp >= filter.startTime);
      }
      if (filter.endTime) {
        reports = reports.filter((r) => r.timestamp <= filter.endTime);
      }
      if (filter.templateId) {
        reports = reports.map((r) => ({
          ...r,
          templates: r.templates.filter((t) => t.id === filter.templateId)
        }));
      }
    }
    return reports;
  }
  /**
   * 分析性能趋势
   */
  analyzeTrends(templateId, metricType) {
    const data = [];
    for (const report of this.performanceReports) {
      const template = report.templates.find((t) => t.id === templateId);
      if (template) {
        data.push(template[metricType]);
      }
    }
    if (data.length < 2) {
      return {
        trend: "stable",
        percentage: 0,
        data
      };
    }
    const recentAvg = data.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, data.slice(-5).length);
    const previousAvg = data.slice(-10, -5).reduce((a, b) => a + b, 0) / Math.min(5, data.slice(-10, -5).length);
    const change = (recentAvg - previousAvg) / previousAvg * 100;
    let trend;
    if (change < -5) {
      trend = "improving";
    } else if (change > 5) {
      trend = "degrading";
    } else {
      trend = "stable";
    }
    return {
      trend,
      percentage: Math.abs(change),
      data
    };
  }
  /**
   * 生成性能建议
   */
  generateRecommendations(report) {
    const recommendations = [];
    const slowTemplates = report.templates.filter((t) => t.renderTime > 100);
    if (slowTemplates.length > 0) {
      recommendations.push(`\u4F18\u5316\u6162\u901F\u6A21\u677F: ${slowTemplates.map((t) => t.name).join(", ")} \u7684\u6E32\u67D3\u65F6\u95F4\u8D85\u8FC7100ms`);
    }
    const highMemoryTemplates = report.templates.filter((t) => t.memoryUsage > 10 * 1024 * 1024);
    if (highMemoryTemplates.length > 0) {
      recommendations.push(`\u964D\u4F4E\u5185\u5B58\u4F7F\u7528: ${highMemoryTemplates.map((t) => t.name).join(", ")} \u7684\u5185\u5B58\u4F7F\u7528\u8D85\u8FC710MB`);
    }
    const highDomTemplates = report.templates.filter((t) => t.domNodes > 1e3);
    if (highDomTemplates.length > 0) {
      recommendations.push(`\u51CF\u5C11DOM\u8282\u70B9: ${highDomTemplates.map((t) => t.name).join(", ")} \u7684DOM\u8282\u70B9\u6570\u8D85\u8FC71000`);
    }
    const highComponentTemplates = report.templates.filter((t) => t.componentCount > 50);
    if (highComponentTemplates.length > 0) {
      recommendations.push(`\u4F18\u5316\u7EC4\u4EF6\u7ED3\u6784: ${highComponentTemplates.map((t) => t.name).join(", ")} \u7684\u7EC4\u4EF6\u6570\u8D85\u8FC750`);
    }
    return recommendations;
  }
}
class TemplateComplexityAnalyzer {
  /**
   * 计算圈复杂度
   */
  calculateCyclomaticComplexity(template) {
    let complexity = 1;
    const code = template.component?.toString() || "";
    complexity += (code.match(/if\s*\(/g) || []).length;
    complexity += (code.match(/else\s+if\s*\(/g) || []).length;
    complexity += (code.match(/\?[^:]+:/g) || []).length;
    complexity += (code.match(/case\s+/g) || []).length;
    complexity += (code.match(/for\s*\(/g) || []).length;
    complexity += (code.match(/while\s*\(/g) || []).length;
    complexity += (code.match(/catch\s*\(/g) || []).length;
    return complexity;
  }
  /**
   * 计算认知复杂度
   */
  calculateCognitiveComplexity(template) {
    let complexity = 0;
    const code = template.component?.toString() || "";
    let nestingLevel = 0;
    const lines = code.split("\n");
    for (const line of lines) {
      if (line.includes("{")) nestingLevel++;
      if (line.includes("}")) nestingLevel--;
      if (line.match(/if\s*\(/) || line.match(/for\s*\(/) || line.match(/while\s*\(/)) {
        complexity += 1 + nestingLevel;
      }
    }
    return complexity;
  }
  /**
   * 计算嵌套深度
   */
  calculateNestingDepth(template) {
    const code = template.component?.toString() || "";
    let maxDepth = 0;
    let currentDepth = 0;
    for (const char of code) {
      if (char === "{") {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === "}") {
        currentDepth--;
      }
    }
    return maxDepth;
  }
  /**
   * 计算参数数量
   */
  calculateParameterCount(template) {
    return Object.keys(template.config || {}).length;
  }
  /**
   * 计算代码行数
   */
  calculateLineCount(template) {
    const code = template.component?.toString() || "";
    return code.split("\n").length;
  }
  /**
   * 计算可维护性指数
   */
  calculateMaintainabilityIndex(metrics) {
    const {
      cyclomaticComplexity,
      lineCount
    } = metrics;
    const volume = lineCount * Math.log2(lineCount + 1);
    const index = Math.max(0, (171 - 5.2 * Math.log(volume) - 0.23 * cyclomaticComplexity) * 100 / 171);
    return Math.round(index);
  }
  /**
   * 分析模板复杂度
   */
  analyzeTemplate(template) {
    const metrics = {
      templateId: template.id,
      cyclomaticComplexity: this.calculateCyclomaticComplexity(template),
      cognitiveComplexity: this.calculateCognitiveComplexity(template),
      nestingDepth: this.calculateNestingDepth(template),
      parameterCount: this.calculateParameterCount(template),
      lineCount: this.calculateLineCount(template),
      maintainabilityIndex: 0
    };
    metrics.maintainabilityIndex = this.calculateMaintainabilityIndex(metrics);
    return metrics;
  }
  /**
   * 生成复杂度报告
   */
  generateComplexityReport(templates) {
    const metrics = templates.map((t) => this.analyzeTemplate(t));
    return {
      timestamp: Date.now(),
      totalTemplates: templates.length,
      metrics,
      summary: {
        averageCyclomaticComplexity: metrics.reduce((sum, m) => sum + m.cyclomaticComplexity, 0) / metrics.length,
        averageCognitiveComplexity: metrics.reduce((sum, m) => sum + m.cognitiveComplexity, 0) / metrics.length,
        averageMaintainabilityIndex: metrics.reduce((sum, m) => sum + m.maintainabilityIndex, 0) / metrics.length,
        highComplexityTemplates: metrics.filter((m) => m.cyclomaticComplexity > 10).map((m) => m.templateId),
        lowMaintainabilityTemplates: metrics.filter((m) => m.maintainabilityIndex < 50).map((m) => m.templateId)
      }
    };
  }
}
class TemplateAnalyzer {
  constructor() {
    this.statisticsAnalyzer = new TemplateStatisticsAnalyzer();
    this.dependencyAnalyzer = new TemplateDependencyAnalyzer();
    this.performanceAnalyzer = new TemplatePerformanceAnalyzer();
    this.complexityAnalyzer = new TemplateComplexityAnalyzer();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new TemplateAnalyzer();
    }
    return this.instance;
  }
  /**
   * 获取统计分析器
   */
  getStatisticsAnalyzer() {
    return this.statisticsAnalyzer;
  }
  /**
   * 获取依赖分析器
   */
  getDependencyAnalyzer() {
    return this.dependencyAnalyzer;
  }
  /**
   * 获取性能分析器
   */
  getPerformanceAnalyzer() {
    return this.performanceAnalyzer;
  }
  /**
   * 获取复杂度分析器
   */
  getComplexityAnalyzer() {
    return this.complexityAnalyzer;
  }
  /**
   * 生成综合报告
   */
  generateComprehensiveReport(templates) {
    return {
      timestamp: Date.now(),
      usage: this.statisticsAnalyzer.generateUsageReport(),
      dependencies: Array.from(this.dependencyAnalyzer.generateDependencyGraph().values()),
      performance: this.performanceAnalyzer.getReports(),
      complexity: this.complexityAnalyzer.generateComplexityReport(templates)
    };
  }
}
const templateAnalyzer = TemplateAnalyzer.getInstance();

exports.TemplateAnalyzer = TemplateAnalyzer;
exports.TemplateComplexityAnalyzer = TemplateComplexityAnalyzer;
exports.TemplateDependencyAnalyzer = TemplateDependencyAnalyzer;
exports.TemplatePerformanceAnalyzer = TemplatePerformanceAnalyzer;
exports.TemplateStatisticsAnalyzer = TemplateStatisticsAnalyzer;
exports.templateAnalyzer = templateAnalyzer;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=analyzer.cjs.map
