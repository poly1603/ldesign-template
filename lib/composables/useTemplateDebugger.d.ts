/**
 * 调试日志级别
 */
export declare enum DebugLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
/**
 * 调试日志条目
 */
export interface DebugLog {
    id: string;
    timestamp: number;
    level: DebugLevel;
    message: string;
    data?: any;
    templateId?: string;
    stack?: string;
}
/**
 * 调试器配置
 */
export interface DebuggerConfig {
    enabled?: boolean;
    logLevel?: DebugLevel;
    maxLogs?: number;
    trackLifecycle?: boolean;
    trackProps?: boolean;
    trackState?: boolean;
    showInConsole?: boolean;
}
/**
 * 模板状态快照
 */
export interface TemplateStateSnapshot {
    timestamp: number;
    props?: Record<string, any>;
    state?: Record<string, any>;
    computed?: Record<string, any>;
}
/**
 * 使用模板调试器
 */
export declare function useTemplateDebugger(templateId: string, config?: DebuggerConfig): {
    isEnabled: import("vue").Ref<boolean, boolean>;
    logs: import("vue").ComputedRef<{
        id: string;
        timestamp: number;
        level: DebugLevel;
        message: string;
        data?: any;
        templateId?: string | undefined;
        stack?: string | undefined;
    }[]>;
    stateSnapshots: import("vue").ComputedRef<{
        timestamp: number;
        props?: Record<string, any> | undefined;
        state?: Record<string, any> | undefined;
        computed?: Record<string, any> | undefined;
    }[]>;
    performanceMetrics: {
        readonly mountTime: number;
        readonly updateCount: number;
        readonly lastUpdateTime: number;
        readonly totalUpdateTime: number;
        readonly averageUpdateTime: number;
    };
    debug: (message: string, data?: any) => void;
    info: (message: string, data?: any) => void;
    warn: (message: string, data?: any) => void;
    error: (message: string, data?: any) => void;
    takeSnapshot: (props?: Record<string, any>, state?: Record<string, any>, computed?: Record<string, any>) => void;
    watchProps: (props: Record<string, import("vue").Ref<any>>) => void;
    watchState: (state: Record<string, import("vue").Ref<any>>) => void;
    measurePerformance: (label: string, fn: () => void | Promise<void>) => void | Promise<void>;
    lifecycleHooks: {
        onBeforeMount(): void;
        onMounted(): void;
        onBeforeUpdate(): void;
        onUpdated(): void;
        onBeforeUnmount(): void;
        onUnmounted(): void;
    };
    getLogs: (level?: DebugLevel) => {
        id: string;
        timestamp: number;
        level: DebugLevel;
        message: string;
        data?: any;
        templateId?: string | undefined;
        stack?: string | undefined;
    }[];
    clearLogs: () => void;
    exportLogs: (format?: "json" | "csv") => string;
    enable: () => void;
    disable: () => void;
};
/**
 * 全局调试器管理
 */
declare class GlobalDebuggerManager {
    private debuggers;
    register(templateId: string, templateDebugger: ReturnType<typeof useTemplateDebugger>): void;
    unregister(templateId: string): void;
    get(templateId: string): {
        isEnabled: import("vue").Ref<boolean, boolean>;
        logs: import("vue").ComputedRef<{
            id: string;
            timestamp: number;
            level: DebugLevel;
            message: string;
            data?: any;
            templateId?: string | undefined;
            stack?: string | undefined;
        }[]>;
        stateSnapshots: import("vue").ComputedRef<{
            timestamp: number;
            props?: Record<string, any> | undefined;
            state?: Record<string, any> | undefined;
            computed?: Record<string, any> | undefined;
        }[]>;
        performanceMetrics: {
            readonly mountTime: number;
            readonly updateCount: number;
            readonly lastUpdateTime: number;
            readonly totalUpdateTime: number;
            readonly averageUpdateTime: number;
        };
        debug: (message: string, data?: any) => void;
        info: (message: string, data?: any) => void;
        warn: (message: string, data?: any) => void;
        error: (message: string, data?: any) => void;
        takeSnapshot: (props?: Record<string, any>, state?: Record<string, any>, computed?: Record<string, any>) => void;
        watchProps: (props: Record<string, import("vue").Ref<any>>) => void;
        watchState: (state: Record<string, import("vue").Ref<any>>) => void;
        measurePerformance: (label: string, fn: () => void | Promise<void>) => void | Promise<void>;
        lifecycleHooks: {
            onBeforeMount(): void;
            onMounted(): void;
            onBeforeUpdate(): void;
            onUpdated(): void;
            onBeforeUnmount(): void;
            onUnmounted(): void;
        };
        getLogs: (level?: DebugLevel) => {
            id: string;
            timestamp: number;
            level: DebugLevel;
            message: string;
            data?: any;
            templateId?: string | undefined;
            stack?: string | undefined;
        }[];
        clearLogs: () => void;
        exportLogs: (format?: "json" | "csv") => string;
        enable: () => void;
        disable: () => void;
    } | undefined;
    getAll(): [string, {
        isEnabled: import("vue").Ref<boolean, boolean>;
        logs: import("vue").ComputedRef<{
            id: string;
            timestamp: number;
            level: DebugLevel;
            message: string;
            data?: any;
            templateId?: string | undefined;
            stack?: string | undefined;
        }[]>;
        stateSnapshots: import("vue").ComputedRef<{
            timestamp: number;
            props?: Record<string, any> | undefined;
            state?: Record<string, any> | undefined;
            computed?: Record<string, any> | undefined;
        }[]>;
        performanceMetrics: {
            readonly mountTime: number;
            readonly updateCount: number;
            readonly lastUpdateTime: number;
            readonly totalUpdateTime: number;
            readonly averageUpdateTime: number;
        };
        debug: (message: string, data?: any) => void;
        info: (message: string, data?: any) => void;
        warn: (message: string, data?: any) => void;
        error: (message: string, data?: any) => void;
        takeSnapshot: (props?: Record<string, any>, state?: Record<string, any>, computed?: Record<string, any>) => void;
        watchProps: (props: Record<string, import("vue").Ref<any>>) => void;
        watchState: (state: Record<string, import("vue").Ref<any>>) => void;
        measurePerformance: (label: string, fn: () => void | Promise<void>) => void | Promise<void>;
        lifecycleHooks: {
            onBeforeMount(): void;
            onMounted(): void;
            onBeforeUpdate(): void;
            onUpdated(): void;
            onBeforeUnmount(): void;
            onUnmounted(): void;
        };
        getLogs: (level?: DebugLevel) => {
            id: string;
            timestamp: number;
            level: DebugLevel;
            message: string;
            data?: any;
            templateId?: string | undefined;
            stack?: string | undefined;
        }[];
        clearLogs: () => void;
        exportLogs: (format?: "json" | "csv") => string;
        enable: () => void;
        disable: () => void;
    }][];
    clearAll(): void;
    disableAll(): void;
    enableAll(): void;
    exportAll(): string;
}
export declare const globalDebuggerManager: GlobalDebuggerManager;
/**
 * 创建调试面板数据
 */
export declare function createDebugPanelData(): {
    templates: import("vue").ComputedRef<[string, {
        isEnabled: import("vue").Ref<boolean, boolean>;
        logs: import("vue").ComputedRef<{
            id: string;
            timestamp: number;
            level: DebugLevel;
            message: string;
            data?: any;
            templateId?: string | undefined;
            stack?: string | undefined;
        }[]>;
        stateSnapshots: import("vue").ComputedRef<{
            timestamp: number;
            props?: Record<string, any> | undefined;
            state?: Record<string, any> | undefined;
            computed?: Record<string, any> | undefined;
        }[]>;
        performanceMetrics: {
            readonly mountTime: number;
            readonly updateCount: number;
            readonly lastUpdateTime: number;
            readonly totalUpdateTime: number;
            readonly averageUpdateTime: number;
        };
        debug: (message: string, data?: any) => void;
        info: (message: string, data?: any) => void;
        warn: (message: string, data?: any) => void;
        error: (message: string, data?: any) => void;
        takeSnapshot: (props?: Record<string, any>, state?: Record<string, any>, computed?: Record<string, any>) => void;
        watchProps: (props: Record<string, import("vue").Ref<any>>) => void;
        watchState: (state: Record<string, import("vue").Ref<any>>) => void;
        measurePerformance: (label: string, fn: () => void | Promise<void>) => void | Promise<void>;
        lifecycleHooks: {
            onBeforeMount(): void;
            onMounted(): void;
            onBeforeUpdate(): void;
            onUpdated(): void;
            onBeforeUnmount(): void;
            onUnmounted(): void;
        };
        getLogs: (level?: DebugLevel) => {
            id: string;
            timestamp: number;
            level: DebugLevel;
            message: string;
            data?: any;
            templateId?: string | undefined;
            stack?: string | undefined;
        }[];
        clearLogs: () => void;
        exportLogs: (format?: "json" | "csv") => string;
        enable: () => void;
        disable: () => void;
    }][]>;
    totalLogs: import("vue").ComputedRef<number>;
    clearAll: () => void;
    exportAll: () => string;
};
export {};
