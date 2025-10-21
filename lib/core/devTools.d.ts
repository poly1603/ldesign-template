/**
 * 模板开发工具系统
 */
import type { App, ComponentPublicInstance } from 'vue';
import type { Template } from '../types';
/**
 * 开发工具配置
 */
export interface DevToolsConfig {
    enabled: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    theme?: 'light' | 'dark';
    collapsed?: boolean;
    features?: {
        inspector?: boolean;
        debugger?: boolean;
        profiler?: boolean;
        analyzer?: boolean;
        network?: boolean;
        console?: boolean;
    };
}
/**
 * 调试信息
 */
export interface DebugInfo {
    id: string;
    timestamp: number;
    type: 'log' | 'error' | 'warning' | 'info';
    category: string;
    message: string;
    data?: any;
    stack?: string;
}
/**
 * 性能指标
 */
export interface PerformanceMetrics {
    renderTime: number;
    updateTime: number;
    mountTime: number;
    unmountTime: number;
    memoryUsage?: number;
    componentCount?: number;
    propUpdateCount?: number;
}
/**
 * 模板调试器
 */
export declare class TemplateDebugger {
    private logs;
    private breakpoints;
    private watchedTemplates;
    private paused;
    private currentContext;
    /**
     * 添加日志
     */
    log(info: Omit<DebugInfo, 'id' | 'timestamp'>): void;
    /**
     * 设置断点
     */
    setBreakpoint(templateId: string, point: string): void;
    /**
     * 移除断点
     */
    removeBreakpoint(templateId: string, point: string): void;
    /**
     * 监视模板
     */
    watchTemplate(templateId: string): void;
    /**
     * 取消监视
     */
    unwatchTemplate(templateId: string): void;
    /**
     * 暂停执行
     */
    private pause;
    /**
     * 继续执行
     */
    resume(): void;
    /**
     * 步进执行
     */
    stepOver(): void;
    /**
     * 步入执行
     */
    stepInto(): void;
    /**
     * 步出执行
     */
    stepOut(): void;
    /**
     * 清空日志
     */
    clearLogs(): void;
    /**
     * 获取日志
     */
    getLogs(filter?: {
        type?: DebugInfo['type'];
        category?: string;
        startTime?: number;
        endTime?: number;
    }): DebugInfo[];
    /**
     * 导出日志
     */
    exportLogs(): string;
    /**
     * 是否应该中断
     */
    private shouldBreak;
    /**
     * 生成唯一ID
     */
    private generateId;
}
/**
 * 性能分析器
 */
export declare class TemplateProfiler {
    private metrics;
    private timers;
    private enabled;
    /**
     * 开始计时
     */
    startTimer(id: string): void;
    /**
     * 结束计时
     */
    endTimer(id: string): number;
    /**
     * 记录性能指标
     */
    recordMetrics(templateId: string, metrics: PerformanceMetrics): void;
    /**
     * 获取性能指标
     */
    getMetrics(templateId?: string): Map<string, PerformanceMetrics[]> | PerformanceMetrics[] | undefined;
    /**
     * 获取平均性能
     */
    getAverageMetrics(templateId: string): PerformanceMetrics | undefined;
    /**
     * 清空性能数据
     */
    clearMetrics(templateId?: string): void;
    /**
     * 导出性能数据
     */
    exportMetrics(): string;
    /**
     * 启用/禁用性能分析
     */
    setEnabled(enabled: boolean): void;
}
/**
 * 模板检查器
 */
export declare class TemplateInspector {
    private selectedTemplate;
    private selectedComponent;
    private highlightEnabled;
    /**
     * 选择模板
     */
    selectTemplate(template: Template): void;
    /**
     * 选择组件
     */
    selectComponent(component: ComponentPublicInstance): void;
    /**
     * 获取模板信息
     */
    getTemplateInfo(template: Template): Record<string, any>;
    /**
     * 获取组件信息
     */
    getComponentInfo(component: ComponentPublicInstance): Record<string, any>;
    /**
     * 获取计算属性
     */
    private getComputedProperties;
    /**
     * 获取方法
     */
    private getMethods;
    /**
     * 高亮元素
     */
    highlightElement(element: HTMLElement): void;
    /**
     * 启用/禁用高亮
     */
    setHighlightEnabled(enabled: boolean): void;
}
/**
 * 网络监控器
 */
export declare class NetworkMonitor {
    private requests;
    private enabled;
    /**
     * 拦截请求
     */
    interceptRequest(config: any): any;
    /**
     * 处理响应
     */
    handleResponse(response: any): any;
    /**
     * 处理错误
     */
    handleError(error: any): Promise<never>;
    /**
     * 获取请求列表
     */
    getRequests(filter?: {
        status?: string;
        method?: string;
        url?: string;
    }): any[];
    /**
     * 清空请求记录
     */
    clearRequests(): void;
    /**
     * 生成唯一ID
     */
    private generateId;
    /**
     * 启用/禁用网络监控
     */
    setEnabled(enabled: boolean): void;
}
/**
 * 控制台增强
 */
export declare class ConsoleEnhancer {
    private originalConsole;
    private logs;
    private filters;
    /**
     * 增强控制台
     */
    enhance(): void;
    /**
     * 恢复控制台
     */
    restore(): void;
    /**
     * 添加日志
     */
    private addLog;
    /**
     * 获取日志
     */
    getLogs(filter?: string[]): any[];
    /**
     * 清空日志
     */
    clearLogs(): void;
    /**
     * 设置过滤器
     */
    setFilters(filters: string[]): void;
    /**
     * 生成唯一ID
     */
    private generateId;
}
/**
 * 开发工具管理器
 */
export declare class DevToolsManager {
    private static instance;
    private config;
    private templateDebugger;
    private profiler;
    private inspector;
    private networkMonitor;
    private consoleEnhancer;
    private app;
    private disposed;
    private constructor();
    /**
     * 获取实例
     */
    static getInstance(config?: DevToolsConfig): DevToolsManager;
    /**
     * 安装到Vue应用
     */
    install(app: App): void;
    /**
     * 卸载
     */
    uninstall(): void;
    /**
     * 销毁实例
     */
    private dispose;
    /**
     * 获取调试器
     */
    getDebugger(): TemplateDebugger | null;
    /**
     * 获取性能分析器
     */
    getProfiler(): TemplateProfiler | null;
    /**
     * 获取检查器
     */
    getInspector(): TemplateInspector | null;
    /**
     * 获取网络监控器
     */
    getNetworkMonitor(): NetworkMonitor | null;
    /**
     * 获取控制台增强器
     */
    getConsoleEnhancer(): ConsoleEnhancer | null;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<DevToolsConfig>): void;
    /**
     * 获取配置
     */
    getConfig(): DevToolsConfig;
    /**
     * 启用/禁用
     */
    setEnabled(enabled: boolean): void;
}
export declare const devTools: DevToolsManager;
