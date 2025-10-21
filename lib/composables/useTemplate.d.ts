/**
 * Vue 组合式函数 - 模板管理
 */
import type { DeviceType, TemplateFilter, TemplateLoadOptions, TemplateMetadata } from '../types';
import { type Component, type Ref } from 'vue';
/**
 * 使用模板 - 内存优化版本
 */
export declare function useTemplate(category: Ref<string> | string, device: Ref<string | DeviceType> | string | DeviceType, name: Ref<string> | string, options?: TemplateLoadOptions): {
    component: Readonly<Ref<Component | null>>;
    loading: Readonly<Ref<boolean>>;
    error: Readonly<Ref<Error | null>>;
    metadata: Readonly<Ref<TemplateMetadata | null>>;
    load: () => Promise<void>;
    reload: () => Promise<void>;
};
/**
 * 使用模板列表 - 内存优化版本
 */
export declare function useTemplateList(filter?: Ref<TemplateFilter> | TemplateFilter): {
    templates: Readonly<Ref<TemplateMetadata[]>>;
    loading: Readonly<Ref<boolean>>;
    error: Readonly<Ref<Error | null>>;
    query: () => Promise<void>;
    refresh: () => Promise<void>;
};
/**
 * 使用默认模板
 */
export declare function useDefaultTemplate(category: Ref<string> | string, device: Ref<string> | string): {
    template: import("vue").ComputedRef<{
        name: string;
        displayName: string;
        description?: string | undefined;
        category: import("../types").TemplateCategory;
        device: DeviceType;
        version?: string | undefined;
        author?: string | undefined;
        tags?: string[] | undefined;
        isDefault?: boolean | undefined;
        preview?: string | undefined;
        lastModified?: number | undefined;
    } | null>;
    loading: import("vue").ComputedRef<boolean>;
    error: import("vue").ComputedRef<Error | null>;
    getDefault: () => Promise<void>;
};
/**
 * 使用模板管理器
 */
export declare function useTemplateManager(): {
    manager: import("../core/manager").TemplateManager;
    initialized: import("vue").ComputedRef<boolean>;
    scanResult: import("vue").ComputedRef<{
        total: number;
        byCategory: Record<import("../types").TemplateCategory, number>;
        byDevice: {
            desktop: number;
            mobile: number;
            tablet: number;
        };
        scanTime: number;
        templates: {
            name: string;
            displayName: string;
            description?: string | undefined;
            category: import("../types").TemplateCategory;
            device: DeviceType;
            version?: string | undefined;
            author?: string | undefined;
            tags?: string[] | undefined;
            isDefault?: boolean | undefined;
            preview?: string | undefined;
            lastModified?: number | undefined;
        }[];
    } | null>;
    initialize: () => Promise<import("../types").TemplateScanResult>;
    rescan: () => Promise<import("../types").TemplateScanResult>;
    loadTemplate: any;
    preloadTemplate: any;
    clearCache: any;
    getAllTemplates: any;
    queryTemplates: any;
    getTemplatesByCategory: any;
    getTemplatesByDevice: any;
    getDefaultTemplate: any;
};
