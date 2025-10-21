/**
 * 内存泄漏检测工具
 */
import { type Ref } from 'vue';
export interface LeakDetectorOptions {
    threshold?: number;
    interval?: number;
    onLeak?: (info: LeakInfo) => void;
}
export interface LeakInfo {
    type: 'memory' | 'dom' | 'listener' | 'timer';
    description: string;
    value?: number;
    details?: any;
}
/**
 * 内存泄漏检测器
 */
export declare class MemoryLeakDetector {
    private options;
    private listeners;
    private timers;
    private intervals;
    private animationFrames;
    private observers;
    private memorySnapshots;
    private checkInterval;
    constructor(options?: LeakDetectorOptions);
    /**
     * 开始监控
     */
    private startMonitoring;
    /**
     * 检查内存增长
     */
    private checkMemoryGrowth;
    /**
     * 检查 DOM 泄漏
     */
    private checkDOMLeaks;
    /**
     * 追踪事件监听器
     */
    trackEventListener(element: EventTarget, type: string, handler: EventListener, component?: object): () => void;
    /**
     * 追踪定时器
     */
    trackTimer(id: number, type: 'timeout' | 'interval'): void;
    /**
     * 清理定时器
     */
    clearTimer(id: number, type: 'timeout' | 'interval'): void;
    /**
     * 追踪动画帧
     */
    trackAnimationFrame(id: number): void;
    /**
     * 清理动画帧
     */
    clearAnimationFrame(id: number): void;
    /**
     * 追踪观察者
     */
    trackObserver(observer: MutationObserver | IntersectionObserver | ResizeObserver): void;
    /**
     * 清理观察者
     */
    clearObserver(observer: MutationObserver | IntersectionObserver | ResizeObserver): void;
    /**
     * 清理所有追踪的资源
     */
    cleanup(): void;
    /**
     * 生成泄漏报告
     */
    generateReport(): {
        timers: number;
        intervals: number;
        animationFrames: number;
        observers: number;
        memory: number;
        memoryTrend: number[];
    };
}
/**
 * 获取全局检测器
 */
export declare function getLeakDetector(): MemoryLeakDetector;
/**
 * 使用内存泄漏检测
 */
export declare function useMemoryLeakDetection(options?: LeakDetectorOptions): {
    trackEventListener: any;
    trackTimer: any;
    clearTimer: any;
    trackAnimationFrame: any;
    clearAnimationFrame: any;
    trackObserver: any;
    clearObserver: any;
    generateReport: any;
    cleanup: any;
};
/**
 * 安全的 setTimeout 包装
 */
export declare function safeSetTimeout(handler: TimerHandler, timeout?: number, ...args: any[]): number;
/**
 * 安全的 setInterval 包装
 */
export declare function safeSetInterval(handler: TimerHandler, timeout?: number, ...args: any[]): number;
/**
 * 安全的 requestAnimationFrame 包装
 */
export declare function safeRequestAnimationFrame(callback: FrameRequestCallback): number;
/**
 * 自动清理的事件监听器
 */
export declare function useAutoCleanupListener(target: Ref<EventTarget | null> | EventTarget, event: string, handler: EventListener, options?: AddEventListenerOptions): {
    cleanup: () => void;
};
