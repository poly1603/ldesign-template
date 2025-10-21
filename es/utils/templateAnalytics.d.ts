/**
 * 模板使用统计
 */
export interface TemplateUsage {
    templateId: string;
    templateName: string;
    loadCount: number;
    renderCount: number;
    errorCount: number;
    totalLoadTime: number;
    averageLoadTime: number;
    totalRenderTime: number;
    averageRenderTime: number;
    lastUsedAt: number;
    firstUsedAt: number;
}
/**
 * 性能指标
 */
export interface PerformanceMetrics {
    templateId: string;
    metric: 'load' | 'render' | 'interaction';
    duration: number;
    timestamp: number;
    metadata?: Record<string, any>;
}
/**
 * 用户交互事件
 */
export interface InteractionEvent {
    templateId: string;
    eventType: string;
    timestamp: number;
    data?: any;
}
/**
 * 分析报告
 */
export interface AnalyticsReport {
    totalTemplates: number;
    totalUsage: number;
    mostUsedTemplates: TemplateUsage[];
    leastUsedTemplates: TemplateUsage[];
    slowestTemplates: TemplateUsage[];
    errorProneTemplates: TemplateUsage[];
    performanceScore: number;
    recommendations: string[];
}
/**
 * 模板分析器配置
 */
export interface AnalyticsConfig {
    enabled?: boolean;
    sampleRate?: number;
    maxEvents?: number;
    enablePerformanceTracking?: boolean;
    enableErrorTracking?: boolean;
    enableInteractionTracking?: boolean;
}
/**
 * 模板分析器类
 */
export declare class TemplateAnalytics {
    private config;
    private usageMap;
    private performanceMetrics;
    private interactionEvents;
    private sessionStartTime;
    private disposed;
    private cleanupTimer;
    constructor(config?: AnalyticsConfig);
    /**
     * 判断是否应该记录事件（基于采样率）
     */
    private shouldRecord;
    /**
     * 记录模板加载
     */
    trackLoad(templateId: string, templateName: string, duration: number): void;
    /**
     * 记录模板渲染
     */
    trackRender(templateId: string, templateName: string, duration: number): void;
    /**
     * 记录模板错误
     */
    trackError(templateId: string, templateName: string, error: Error): void;
    /**
     * 记录用户交互
     */
    trackInteraction(templateId: string, eventType: string, data?: any): void;
    /**
     * 记录性能指标
     */
    private recordPerformanceMetric;
    /**
     * 获取或创建模板使用统计
     */
    private getOrCreateUsage;
    /**
     * 获取所有使用统计
     */
    getAllUsage(): TemplateUsage[];
    /**
     * 获取特定模板的统计
     */
    getUsage(templateId: string): TemplateUsage | undefined;
    /**
     * 获取性能指标
     */
    getPerformanceMetrics(templateId?: string): PerformanceMetrics[];
    /**
     * 获取交互事件
     */
    getInteractionEvents(templateId?: string): InteractionEvent[];
    /**
     * 生成分析报告
     */
    generateReport(): AnalyticsReport;
    /**
     * 导出数据
     */
    exportData(): {
        usage: TemplateUsage[];
        metrics: PerformanceMetrics[];
        interactions: InteractionEvent[];
        sessionDuration: number;
    };
    /**
     * 清除所有数据
     */
    clear(): void;
    /**
     * 销毁分析器实例
     */
    dispose(): void;
    /**
     * 定期清理老旧数据
     */
    private scheduleCleanup;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<AnalyticsConfig>): void;
    /**
     * 启用分析
     */
    enable(): void;
    /**
     * 禁用分析
     */
    disable(): void;
    /**
     * 获取配置
     */
    getConfig(): Readonly<Required<AnalyticsConfig>>;
}
export declare function getGlobalAnalytics(): TemplateAnalytics;
export declare function destroyGlobalAnalytics(): void;
export declare const globalAnalytics: TemplateAnalytics;
/**
 * 使用模板分析 (组合式函数)
 */
export declare function useTemplateAnalytics(config?: AnalyticsConfig): {
    allUsage: import("vue").ComputedRef<TemplateUsage[]>;
    report: import("vue").ComputedRef<AnalyticsReport>;
    trackLoad: (templateId: string, templateName: string, duration: number) => void;
    trackRender: (templateId: string, templateName: string, duration: number) => void;
    trackError: (templateId: string, templateName: string, error: Error) => void;
    trackInteraction: (templateId: string, eventType: string, data?: any) => void;
    getUsage: (templateId: string) => TemplateUsage | undefined;
    getPerformanceMetrics: (templateId?: string) => PerformanceMetrics[];
    exportData: () => {
        usage: TemplateUsage[];
        metrics: PerformanceMetrics[];
        interactions: InteractionEvent[];
        sessionDuration: number;
    };
    clear: () => void;
};
/**
 * 性能监控装饰器
 */
export declare function withPerformanceTracking<T extends (...args: any[]) => any>(fn: T, templateId: string, metric: 'load' | 'render' | 'interaction'): T;
