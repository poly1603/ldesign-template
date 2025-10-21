/**
 * 模板管理器 - 统一管理模板扫描、加载和查询
 */
import type { Component } from 'vue';
import type { DeviceType, TemplateFilter, TemplateLoadOptions, TemplateManagerOptions, TemplateMetadata, TemplateRegistryItem, TemplateScanResult } from '../types';
export declare class TemplateManager {
    private initialized;
    private scanResult;
    private options;
    private filterCache;
    private setPool;
    /**
     * 构造函数
     */
    constructor(options?: TemplateManagerOptions);
    /**
     * 初始化（扫描所有模板）
     */
    initialize(): Promise<TemplateScanResult>;
    /**
     * 确保已初始化
     */
    private ensureInitialized;
    /**
     * 加载模板组件
     */
    loadTemplate(category: string, device: string, name: string, options?: TemplateLoadOptions): Promise<Component>;
    /**
     * 获取所有模板元数据
     */
    getAllTemplates(): Promise<TemplateMetadata[]>;
    /**
     * 根据过滤条件查询模板
     */
    queryTemplates(filter: TemplateFilter): Promise<TemplateMetadata[]>;
    /**
     * 获取指定分类的所有模板
     */
    getTemplatesByCategory(category: string): Promise<TemplateMetadata[]>;
    /**
     * 获取指定设备的所有模板
     */
    getTemplatesByDevice(device: DeviceType): Promise<TemplateMetadata[]>;
    /**
     * 获取默认模板
     */
    getDefaultTemplate(category: string, device: DeviceType | string): Promise<TemplateMetadata | null>;
    /**
     * 获取扫描结果
     */
    getScanResult(): TemplateScanResult | null;
    /**
     * 预加载模板
     */
    preloadTemplate(category: string, device: string, name: string): Promise<void>;
    /**
     * 根据过滤条件预加载模板
     */
    preloadByFilter(filter: TemplateFilter): Promise<void>;
    /**
     * 清除缓存
     */
    clearCache(category?: string, device?: string, name?: string): void;
    /**
     * 扫描模板（别名方法）
     */
    scanTemplates(): Promise<Map<string, TemplateRegistryItem>>;
    /**
     * 重新扫描模板
     */
    rescan(): Promise<TemplateScanResult>;
    /**
     * 过滤模板 - 优化性能版本
     */
    private filterTemplates;
    /**
     * 创建过滤用的 Set
     */
    private createFilterSet;
}
/**
 * 获取全局管理器实例
 */
export declare function getManager(): TemplateManager;
/**
 * 创建模板管理器实例
 */
export declare function createTemplateManager(): TemplateManager;
