/**
 * 模板性能监控
 */
export interface PerformanceMetrics {
    renderTime: number;
    loadTime: number;
    updateTime: number;
    componentCount: number;
    domNodes: number;
    memory?: number;
    fps?: number;
}
export interface PerformanceEntry {
    name: string;
    startTime: number;
    duration: number;
    type: 'measure' | 'mark' | 'navigation' | 'resource';
    details?: any;
}
export interface MemoryInfo {
    value: number;
    limit: number;
    used: number;
    available: number;
    usagePercent: number;
}
export declare function useTemplatePerformance(templateId: string): {
    metrics: {
        readonly renderTime: number;
        readonly loadTime: number;
        readonly updateTime: number;
        readonly componentCount: number;
        readonly domNodes: number;
        readonly memory?: number | undefined;
        readonly fps?: number | undefined;
    };
    entries: Readonly<import("vue").Ref<readonly {
        readonly name: string;
        readonly startTime: number;
        readonly duration: number;
        readonly type: "measure" | "mark" | "navigation" | "resource";
        readonly details?: any;
    }[], readonly {
        readonly name: string;
        readonly startTime: number;
        readonly duration: number;
        readonly type: "measure" | "mark" | "navigation" | "resource";
        readonly details?: any;
    }[]>>;
    memory: {
        readonly value: number;
        readonly limit: number;
        readonly used: number;
        readonly available: number;
        readonly usagePercent: number;
    };
    fpsHistory: Readonly<import("vue").Ref<readonly number[], readonly number[]>>;
    startMeasure: (name: string) => void;
    endMeasure: (name: string) => void;
    measure: <T>(name: string, fn: () => T | Promise<T>) => Promise<T>;
    clear: () => void;
    getMetrics: () => {
        navigationTiming: {
            dnsLookup: number;
            tcpConnection: number;
            request: number;
            response: number;
            domProcessing: number;
            domContentLoaded: number;
            pageLoad: number;
        } | null;
        resourceTiming: {
            name: string;
            type: any;
            duration: number;
            size: any;
            startTime: number;
        }[];
        entries: {
            name: string;
            startTime: number;
            duration: number;
            type: "measure" | "mark" | "navigation" | "resource";
            details?: any;
        }[];
        renderTime: number;
        loadTime: number;
        updateTime: number;
        componentCount: number;
        domNodes: number;
        memory?: number | undefined;
        fps?: number | undefined;
    };
    generateReport: () => {
        templateId: string;
        timestamp: number;
        metrics: {
            navigationTiming: {
                dnsLookup: number;
                tcpConnection: number;
                request: number;
                response: number;
                domProcessing: number;
                domContentLoaded: number;
                pageLoad: number;
            } | null;
            resourceTiming: {
                name: string;
                type: any;
                duration: number;
                size: any;
                startTime: number;
            }[];
            entries: {
                name: string;
                startTime: number;
                duration: number;
                type: "measure" | "mark" | "navigation" | "resource";
                details?: any;
            }[];
            renderTime: number;
            loadTime: number;
            updateTime: number;
            componentCount: number;
            domNodes: number;
            memory?: number | undefined;
            fps?: number | undefined;
        };
        memory: {
            value: number;
            limit: number;
            used: number;
            available: number;
            usagePercent: number;
        };
        fps: {
            current: number | undefined;
            history: number[];
            average: number;
        };
    };
    exportData: (format?: "json" | "csv") => string;
    startFPSMonitoring: () => void;
    stopFPSMonitoring: () => void;
    updateMemory: () => void;
    countDOMNodes: () => void;
    getNavigationTiming: () => {
        dnsLookup: number;
        tcpConnection: number;
        request: number;
        response: number;
        domProcessing: number;
        domContentLoaded: number;
        pageLoad: number;
    } | null;
    getResourceTiming: () => {
        name: string;
        type: any;
        duration: number;
        size: any;
        startTime: number;
    }[];
};
