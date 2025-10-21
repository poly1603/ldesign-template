/**
 * 对象池工具类 - 用于复用对象，减少内存分配和垃圾回收
 */
export interface PoolOptions<T> {
    maxSize?: number;
    preAllocate?: number;
    factory: () => T;
    reset?: (obj: T) => void;
    validate?: (obj: T) => boolean;
}
/**
 * 通用对象池
 */
export declare class ObjectPool<T> {
    private pool;
    private readonly maxSize;
    private readonly factory;
    private readonly reset?;
    private readonly validate?;
    private totalCreated;
    private totalAcquired;
    private totalReleased;
    constructor(options: PoolOptions<T>);
    /**
     * 获取对象
     */
    acquire(): T;
    /**
     * 释放对象
     */
    release(obj: T): void;
    /**
     * 批量释放对象
     */
    releaseMany(objects: T[]): void;
    /**
     * 清空池
     */
    clear(): void;
    /**
     * 获取统计信息
     */
    getStats(): {
        poolSize: number;
        maxSize: number;
        totalCreated: number;
        totalAcquired: number;
        totalReleased: number;
        reuseRate: string;
    };
    /**
     * 缩减池大小
     */
    shrink(targetSize?: number): void;
}
/**
 * 创建数组池
 */
export declare function createArrayPool<T>(maxSize?: number): ObjectPool<T[]>;
/**
 * 创建对象池
 */
export declare function createObjectPool<T extends Record<string, any>>(factory: () => T, maxSize?: number): ObjectPool<T>;
/**
 * 创建 Map 池
 */
export declare function createMapPool<K, V>(maxSize?: number): ObjectPool<Map<K, V>>;
/**
 * 创建 Set 池
 */
export declare function createSetPool<T>(maxSize?: number): ObjectPool<Set<T>>;
/**
 * 全局池管理器
 */
declare class PoolManager {
    private pools;
    register<T>(name: string, pool: ObjectPool<T>): void;
    get<T>(name: string): ObjectPool<T> | undefined;
    clearAll(): void;
    getStats(): Record<string, any>;
}
export declare const poolManager: PoolManager;
export {};
