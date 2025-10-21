/**
 * 通用工具函数
 */
/**
 * 深拷贝对象 - 优化版，避免循环引用，限制深度防止堆栈溢出
 */
export declare function deepClone<T>(obj: T, cache?: WeakMap<object, any>, depth?: number, maxDepth?: number): T;
/**
 * 深合并对象
 */
export declare function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T;
/**
 * 判断是否为对象
 */
export declare function isObject(obj: unknown): obj is Record<string, unknown>;
/**
 * 判断是否为空对象
 */
export declare function isEmpty(obj: unknown): boolean;
/**
 * 防抖函数 - 增强版，支持取消和立即执行
 */
export declare function debounce<T extends (...args: any[]) => any>(fn: T, delay: number, options?: {
    leading?: boolean;
    trailing?: boolean;
}): (...args: Parameters<T>) => void & {
    cancel: () => void;
    flush: () => void;
};
/**
 * 节流函数 - 增强版，支持取消
 */
export declare function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void & {
    cancel: () => void;
};
/**
 * 生成唯一ID
 */
export declare function generateId(prefix?: string): string;
export declare function formatBytes(bytes: number, decimals?: number): string;
/**
 * 睡眠函数
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * 重试函数
 */
export declare function retry<T>(fn: () => Promise<T>, options?: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
    onError?: (error: Error, attempt: number) => void;
}): Promise<T>;
export declare function get<T = unknown>(obj: unknown, path: string, defaultValue?: T): T | undefined;
/**
 * 设置对象路径值 - 优化版，复用路径缓存
 */
export declare function set(obj: unknown, path: string, value: unknown): void;
/**
 * 删除对象路径值
 */
export declare function unset(obj: Record<string, unknown>, path: string): void;
/**
 * 选择对象的指定字段
 */
export declare function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * 排除对象的指定字段
 */
export declare function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * 将数组转换为对象 - 优化版，使用Object.create(null)避免原型污染
 */
export declare function arrayToObject<T>(array: T[], keyFn: (item: T) => string): Record<string, T>;
/**
 * 分组数组元素 - 优化版，使用Map提升性能
 */
export declare function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]>;
