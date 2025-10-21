/**
 * 模板加载器 - 动态加载模板组件
 */
import type { Component } from 'vue';
import type { TemplateFilter, TemplateLoadOptions } from '../types';
/**
 * 模板加载器类 - 内存优化版本
 */
export declare class TemplateLoader {
    private loadedComponents;
    private loadingPromises;
    private componentRegistry;
    private static createKey;
    /**
     * 加载模板组件
     */
    load(category: string, device: string, name: string, options?: TemplateLoadOptions): Promise<Component>;
    /**
     * 带选项的加载
     */
    private _loadWithOptions;
    /**
     * 预加载模板
     */
    preload(category: string, device: string, name: string): Promise<void>;
    /**
     * 批量预加载模板
     */
    preloadBatch(templates: Array<{
        category: string;
        device: string;
        name: string;
    }>): Promise<void>;
    /**
     * 根据过滤条件预加载模板
     */
    preloadByFilter(filter: TemplateFilter): Promise<void>;
    /**
     * 过滤模板 - 内存优化版本
     */
    private filterTemplates;
    /**
     * 清除缓存 - 优化版本
     */
    clearCache(category?: string, device?: string, name?: string): void;
    /**
     * 获取已加载的组件数量
     */
    getLoadedCount(): number;
    /**
     * 获取正在加载的组件数量
     */
    getLoadingCount(): number;
}
/**
 * 获取全局加载器实例
 */
export declare function getLoader(): TemplateLoader;
/**
 * 加载模板（便捷方法）
 */
export declare function loadTemplate(category: string, device: string, name: string, options?: TemplateLoadOptions): Promise<Component>;
/**
 * 预加载模板（便捷方法）
 */
export declare function preloadTemplate(category: string, device: string, name: string): Promise<void>;
