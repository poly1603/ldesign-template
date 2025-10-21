/**
 * 性能优化工具函数
 */
export declare function debounce<T extends (...args: any[]) => any>(fn: T, delay?: number): (...args: Parameters<T>) => void;
/**
 * 创建节流函数 - 优化版
 * 支持前缘触发和后缘触发
 */
interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}
export declare function throttle<T extends (...args: any[]) => any>(fn: T, limit?: number, options?: ThrottleOptions): (...args: Parameters<T>) => void;
/**
 * 批量处理 - 将多次调用合并为一次
 */
export declare function batch<T>(fn: (items: T[]) => void, delay?: number): (item: T) => void;
/**
 * 惰性初始化 - 延迟创建开销大的对象
 */
export declare function lazy<T>(factory: () => T): () => T;
/**
 * Memoization - 缓存函数结果
 */
export declare function memoize<T extends (...args: any[]) => any>(fn: T, options?: {
    maxSize?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
}): T;
/**
 * 使用 requestIdleCallback 优化非关键任务
 */
export declare function runWhenIdle(callback: () => void, options?: IdleRequestOptions): void;
/**
 * 使用 requestAnimationFrame 优化动画
 */
export declare function runInNextFrame(callback: () => void): number;
/**
 * 分批处理大数组 - 避免阻塞主线程
 */
export declare function processBatch<T, R>(items: T[], processor: (item: T) => R, batchSize?: number): Promise<R[]>;
/**
 * 虚拟滚动辅助函数
 */
export declare function calculateVisibleRange(scrollTop: number, containerHeight: number, itemHeight: number, totalItems: number, overscan?: number): {
    start: number;
    end: number;
};
/**
 * 对象池 - 重用对象减少 GC 压力
 */
export declare class ObjectPool<T> {
    private pool;
    private factory;
    private reset?;
    constructor(factory: () => T, reset?: (obj: T) => void, initialSize?: number);
    acquire(): T;
    release(obj: T): void;
    clear(): void;
}
export {};
