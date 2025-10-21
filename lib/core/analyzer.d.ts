/**
 * 模板分析工具
 */
import type { Template } from '../types';
/**
 * 模板使用统计
 */
export interface TemplateUsageStats {
    templateId: string;
    templateName: string;
    usageCount: number;
    lastUsed: number;
    firstUsed: number;
    averageRenderTime: number;
    errorCount: number;
    successRate: number;
    userPreference: number;
}
/**
 * 模板依赖关系
 */
export interface TemplateDependency {
    templateId: string;
    dependencies: string[];
    dependents: string[];
    depth: number;
    circular: boolean;
}
/**
 * 性能报告
 */
export interface PerformanceReport {
    timestamp: number;
    duration: number;
    templates: {
        id: string;
        name: string;
        renderTime: number;
        updateTime: number;
        memoryUsage: number;
        domNodes: number;
        componentCount: number;
    }[];
    summary: {
        totalRenderTime: number;
        averageRenderTime: number;
        slowestTemplate: string;
        fastestTemplate: string;
        totalMemoryUsage: number;
        totalDomNodes: number;
    };
}
/**
 * 复杂度指标
 */
export interface ComplexityMetrics {
    templateId: string;
    cyclomaticComplexity: number;
    cognitiveComplexity: number;
    nestingDepth: number;
    parameterCount: number;
    lineCount: number;
    maintainabilityIndex: number;
}
export declare class TemplateStatisticsAnalyzer {
    private usageStats;
    private performanceData;
    private errorLogs;
    private readonly MAX_PERFORMANCE_ENTRIES;
    private readonly MAX_ERROR_LOGS;
    private readonly MAX_STATS_ENTRIES;
    private cleanupTimer;
    /**
     * 记录模板使用
     */
    recordUsage(templateId: string, templateName: string): void;
    /**
     * 记录渲染时间
     */
    recordRenderTime(templateId: string, time: number): void;
    /**
     * 记录错误
     */
    recordError(templateId: string, error: any): void;
    /**
     * 获取使用统计
     */
    getUsageStats(templateId?: string): TemplateUsageStats[] | TemplateUsageStats | undefined;
    /**
     * 获取热门模板
     */
    getPopularTemplates(limit?: number): TemplateUsageStats[];
    /**
     * 获取性能差的模板
     */
    getSlowTemplates(limit?: number): TemplateUsageStats[];
    /**
     * 获取错误率高的模板
     */
    getErrorProneTemplates(limit?: number): TemplateUsageStats[];
    /**
     * 生成使用报告
     */
    generateUsageReport(): any;
    /**
     * 清空统计数据
     */
    clearStats(templateId?: string): void;
    /**
     * 定期清理调度
     */
    private scheduleCleanup;
}
/**
 * 模板依赖分析器
 */
export declare class TemplateDependencyAnalyzer {
    private dependencies;
    private dependents;
    private readonly MAX_DEPENDENCIES;
    private cleanupTimer;
    /**
     * 添加依赖关系
     */
    addDependency(templateId: string, dependsOn: string): void;
    /**
     * 移除依赖关系
     */
    removeDependency(templateId: string, dependsOn: string): void;
    /**
     * 获取模板依赖
     */
    getDependencies(templateId: string): string[];
    /**
     * 获取依赖此模板的模板
     */
    getDependents(templateId: string): string[];
    /**
     * 检测循环依赖
     */
    detectCircularDependencies(templateId: string): boolean;
    /**
     * 计算依赖深度
     */
    calculateDepth(templateId: string): number;
    /**
     * 生成依赖图
     */
    generateDependencyGraph(): Map<string, TemplateDependency>;
    /**
     * 获取依赖链
     */
    getDependencyChain(templateId: string): string[];
    /**
     * 清空依赖数据
     */
    clearDependencies(templateId?: string): void;
    /**
     * 定期清理旧依赖
     */
    private scheduleCleanup;
}
/**
 * 模板性能分析器
 */
export declare class TemplatePerformanceAnalyzer {
    private performanceReports;
    private metricsCollector;
    private recording;
    private startTime;
    private readonly MAX_REPORTS;
    private readonly MAX_METRICS_PER_TEMPLATE;
    /**
     * 开始记录
     */
    startRecording(): void;
    /**
     * 停止记录
     */
    stopRecording(): PerformanceReport;
    /**
     * 收集指标
     */
    collectMetrics(templateId: string, metrics: any): void;
    /**
     * 获取性能报告
     */
    getReports(filter?: {
        startTime?: number;
        endTime?: number;
        templateId?: string;
    }): PerformanceReport[];
    /**
     * 分析性能趋势
     */
    analyzeTrends(templateId: string, metricType: 'renderTime' | 'memoryUsage' | 'domNodes'): {
        trend: 'improving' | 'degrading' | 'stable';
        percentage: number;
        data: number[];
    };
    /**
     * 生成性能建议
     */
    generateRecommendations(report: PerformanceReport): string[];
}
/**
 * 模板复杂度分析器
 */
export declare class TemplateComplexityAnalyzer {
    /**
     * 计算圈复杂度
     */
    calculateCyclomaticComplexity(template: Template): number;
    /**
     * 计算认知复杂度
     */
    calculateCognitiveComplexity(template: Template): number;
    /**
     * 计算嵌套深度
     */
    calculateNestingDepth(template: Template): number;
    /**
     * 计算参数数量
     */
    calculateParameterCount(template: Template): number;
    /**
     * 计算代码行数
     */
    calculateLineCount(template: Template): number;
    /**
     * 计算可维护性指数
     */
    calculateMaintainabilityIndex(metrics: ComplexityMetrics): number;
    /**
     * 分析模板复杂度
     */
    analyzeTemplate(template: Template): ComplexityMetrics;
    /**
     * 生成复杂度报告
     */
    generateComplexityReport(templates: Template[]): any;
}
/**
 * 模板分析管理器
 */
export declare class TemplateAnalyzer {
    private static instance;
    private statisticsAnalyzer;
    private dependencyAnalyzer;
    private performanceAnalyzer;
    private complexityAnalyzer;
    private constructor();
    static getInstance(): TemplateAnalyzer;
    /**
     * 获取统计分析器
     */
    getStatisticsAnalyzer(): TemplateStatisticsAnalyzer;
    /**
     * 获取依赖分析器
     */
    getDependencyAnalyzer(): TemplateDependencyAnalyzer;
    /**
     * 获取性能分析器
     */
    getPerformanceAnalyzer(): TemplatePerformanceAnalyzer;
    /**
     * 获取复杂度分析器
     */
    getComplexityAnalyzer(): TemplateComplexityAnalyzer;
    /**
     * 生成综合报告
     */
    generateComprehensiveReport(templates: Template[]): any;
}
export declare const templateAnalyzer: TemplateAnalyzer;
