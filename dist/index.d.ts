import { Component, Ref } from 'vue';

/**
 * 设备检测相关类型定义
 */
type DeviceType$1 = 'mobile' | 'tablet' | 'desktop';
type NetworkType = 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'wifi' | 'ethernet' | 'unknown';
interface NetworkInfo {
    type: NetworkType;
    effectiveType: NetworkType;
    downlink: number;
    rtt: number;
    saveData: boolean;
}
interface BatteryInfo {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
}
interface MemoryInfo {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
}
interface FeatureSupport {
    touch: boolean;
    webgl: boolean;
    webgl2: boolean;
    canvas: boolean;
    svg: boolean;
    webp: boolean;
    avif: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webWorkers: boolean;
    serviceWorkers: boolean;
    webAssembly: boolean;
    webRTC: boolean;
    geolocation: boolean;
    notifications: boolean;
    vibration: boolean;
    deviceMotion: boolean;
    deviceOrientation: boolean;
    camera: boolean;
    microphone: boolean;
    bluetooth: boolean;
    nfc: boolean;
    usb: boolean;
}
interface DetectionContext {
    width: number;
    height: number;
    userAgent: string;
    features: FeatureSupport;
    network?: NetworkInfo;
    battery?: BatteryInfo;
    memory?: MemoryInfo;
}
interface DeviceDetectionResult {
    device: DeviceType$1;
    confidence: number;
    reasons: string[];
    timestamp: Date;
    cached: boolean;
}
interface DeviceDetector$1 {
    detect(context: DetectionContext): DeviceDetectionResult;
    isSupported(): boolean;
    getName(): string;
    getVersion(): string;
    getDescription(): string;
}

interface StorageAdapter {
    get(key: string): Promise<any> | any;
    set(key: string, value: any): Promise<void> | void;
    remove(key: string): Promise<void> | void;
    clear(): Promise<void> | void;
    keys(): Promise<string[]> | string[];
    size(): Promise<number> | number;
    isSupported(): boolean;
    getName(): string;
}

/**
 * 类型定义
 */

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type TemplateStatus = 'registered' | 'loading' | 'loaded' | 'error' | 'unloaded' | 'cached';
interface TemplateConfig {
    id: string;
    name: string;
    description?: string;
    version?: string;
    author?: string;
    category: string;
    device: DeviceType;
    templateName: string;
    preview?: string;
    tags?: string[];
    props?: Record<string, PropConfig>;
    slots?: Record<string, SlotConfig>;
    events?: Record<string, EventConfig>;
    component?: Component;
    componentPath?: string;
    stylePath?: string;
    isDefault?: boolean;
}
interface PropConfig {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    default?: any;
    required?: boolean;
    description?: string;
    validator?: (value: any) => boolean;
}
interface SlotConfig {
    description?: string;
    props?: Record<string, PropConfig>;
}
interface EventConfig {
    description?: string;
    params?: Record<string, string>;
}
interface TemplateInstance {
    config: TemplateConfig;
    component: Component;
    isLoaded: boolean;
    loadTime?: number;
    lastUsed?: number;
    useCount: number;
    cachedAt?: number;
    status?: TemplateStatus;
    error?: Error;
    styles?: any;
}
interface DeviceInfo {
    type: DeviceType;
    os: string;
    browser: string;
    version: string;
    screen: {
        width: number;
        height: number;
        pixelRatio: number;
        colorDepth: number;
    };
    features: {
        touch: boolean;
        webgl: boolean;
        canvas: boolean;
        localStorage: boolean;
        sessionStorage: boolean;
        indexedDB: boolean;
    };
    network?: {
        type: string;
        effectiveType: string;
        downlink: number;
        rtt: number;
    };
    userAgent: {
        raw: string;
        browser: string;
        browserVersion: string;
        engine: string;
        engineVersion: string;
        os: string;
        osVersion: string;
        device: string;
        vendor: string;
        model: string;
    };
}
interface CacheStats {
    size: number;
    hitRate: number;
    missRate: number;
    totalRequests: number;
    totalHits: number;
    totalMisses: number;
    lastUpdate: Date;
}
interface TemplateProviderProps {
    config?: Partial<TemplateManagerConfig>;
    category?: string;
    device?: DeviceType;
}
interface TemplateProviderSlots {
    default?: any;
    loading?: any;
    error?: any;
}
interface TemplateRendererProps {
    templateId?: string;
    category?: string;
    device?: DeviceType;
    props?: Record<string, any>;
    fallback?: string;
}
interface TemplateSelectorProps {
    category?: string;
    device?: DeviceType;
    multiple?: boolean;
    showPreview?: boolean;
}
interface TemplateSelectorEmits {
    'update:modelValue': [value: string | string[]];
    'change': [template: TemplateConfig];
    'select': [template: TemplateConfig];
}
interface TemplateSelectorConfig {
    showPreview: boolean;
    showDescription: boolean;
    groupByCategory: boolean;
    sortBy: 'name' | 'date' | 'popularity';
}
interface TemplateManagerConfig {
    autoScan?: boolean;
    scanDirectories?: string[];
    enableDeviceDetection?: boolean;
    enableCache?: boolean;
    cacheExpiry?: number;
    preloadDefault?: boolean;
    deviceBreakpoints?: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
    enableStorage?: boolean;
    storageKey?: string;
    storageAdapter?: 'localStorage' | 'sessionStorage';
    errorRetryCount?: number;
    errorRetryDelay?: number;
    enableFallback?: boolean;
    fallbackTemplate?: string;
    enableLazyLoading?: boolean;
    enablePreloading?: boolean;
    maxConcurrentLoads?: number;
    enableDevTools?: boolean;
    enableHotReload?: boolean;
    logLevel?: 'error' | 'warn' | 'info' | 'debug';
    templateRoot?: string;
    templatePath?: string;
    scanInterval?: number;
    defaultDeviceType?: DeviceType;
    defaultDevice?: DeviceType;
    onError?: (error: Error) => void;
    onTemplateLoaded?: (template: any) => void;
}
interface TemplateCategory {
    id: string;
    name: string;
    description?: string;
    templates: Record<DeviceType, TemplateConfig[]>;
}
interface TemplateContext {
    category: string;
    device: DeviceType;
    config: TemplateConfig;
    props: Record<string, any>;
}
interface TemplateInfo {
    id: string;
    name: string;
    description?: string;
    version: string;
    author: string;
    category: string;
    device: DeviceType;
    templateName: string;
    isDefault?: boolean;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}
interface TemplateEvents {
    'template:loading': [config: TemplateConfig];
    'template:loaded': [instance: TemplateInstance];
    'template:error': [config: TemplateConfig, error: Error];
    'scan:complete': [categories: TemplateCategory[]];
}
interface TemplateLoader {
    load: (config: TemplateConfig) => Promise<TemplateInstance>;
    unload: (templateId: string) => Promise<void>;
    isLoaded: (templateId: string) => boolean;
}
interface UseTemplateConfig extends UseTemplateOptions$1 {
}
interface UseTemplateReturn {
    currentTemplate: Ref<TemplateConfig | null>;
    availableTemplates: Ref<TemplateConfig[]>;
    isLoading: Ref<boolean>;
    error: Ref<Error | null>;
    switchTemplate: (templateId: string) => Promise<boolean>;
    refreshTemplates: () => Promise<void>;
    preloadTemplates: () => Promise<void>;
    clearError: () => void;
    getTemplateById: (id: string) => TemplateConfig | null;
    getTemplatesByDevice: (device: DeviceType) => TemplateConfig[];
    searchTemplates: (query: string) => TemplateConfig[];
}
interface UseDeviceDetectorReturn {
    deviceType: Ref<DeviceType>;
    isMobile: Ref<boolean>;
    isTablet: Ref<boolean>;
    isDesktop: Ref<boolean>;
    screenWidth: Ref<number>;
    screenHeight: Ref<number>;
    orientation: Ref<'portrait' | 'landscape'>;
    isLandscape: Ref<boolean>;
    isPortrait: Ref<boolean>;
    supportTouch: Ref<boolean>;
    maxTouchPoints: Ref<number>;
    deviceInfo: Ref<DeviceInfo>;
    matchMedia?: (query: string) => Ref<boolean>;
    refresh: () => void;
    getBreakpoint: (width: number) => DeviceType;
}
interface UseTemplateCacheReturn {
    cacheStats: Ref<CacheStats>;
    getCache: (key: string) => any;
    setCache: (key: string, value: any, expiry?: number) => void;
    removeCache: (key: string) => void;
    clearCache: () => void;
    hasCache: (key: string) => boolean;
    getCaches: (keys: string[]) => Record<string, any>;
    setCaches: (entries: Record<string, any>) => void;
    removeCaches: (keys: string[]) => void;
    refreshStats: () => void;
    exportCache: () => string;
    importCache: (data: string) => void;
}
interface UseStorageReturn<T> {
    value: Ref<T>;
    isSupported: Ref<boolean>;
    setValue: (newValue: T) => void;
    remove: () => void;
    clear: () => void;
    refresh: () => void;
    getSize: () => number;
}
interface UseTemplateOptions$1 {
    category?: string;
    device?: DeviceType | 'auto';
    autoDetectDevice?: boolean;
    fallback?: string;
    preload?: boolean;
    enableCache?: boolean;
    onChange?: (template: TemplateConfig) => void;
    onError?: (error: Error) => void;
    onLoading?: (loading: boolean) => void;
}

/**
 * 模板管理系统工具函数
 */

/**
 * 简单的事件发射器
 */
declare class EventEmitter {
    private events;
    on(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
    emit(event: string, ...args: any[]): void;
    removeAllListeners(event?: string): void;
}
/**
 * 设备检测工具类
 */
declare class DeviceDetector {
    private static instance;
    private currentDevice;
    private listeners;
    private config;
    private constructor();
    static getInstance(): DeviceDetector;
    /**
     * 配置断点
     */
    configure(config: {
        mobileBreakpoint?: number;
        tabletBreakpoint?: number;
    }): void;
    /**
     * 检测当前设备类型
     */
    private detectDevice;
    /**
     * 绑定窗口变化事件
     */
    private bindEvents;
    /**
     * 通知监听器
     */
    private notifyListeners;
    /**
     * 获取当前设备类型
     */
    getCurrentDevice(): DeviceType;
    /**
     * 添加设备变化监听器
     */
    addListener(listener: (device: DeviceType) => void): () => void;
    /**
     * 移除所有监听器
     */
    removeAllListeners(): void;
}
/**
 * 存储管理工具类
 */
declare class StorageManager {
    private storageType;
    constructor(storageType?: 'localStorage' | 'sessionStorage');
    /**
     * 获取存储实例
     */
    private getStorage;
    /**
     * 设置存储值
     */
    set<T>(key: string, value: T): boolean;
    /**
     * 获取存储值
     */
    get<T>(key: string, defaultValue?: T): T | null;
    /**
     * 移除存储值
     */
    remove(key: string): boolean;
    /**
     * 清空存储
     */
    clear(): boolean;
    /**
     * 检查键是否存在
     */
    has(key: string): boolean;
}
/**
 * 模板路径工具
 */
declare class TemplatePathUtils {
    /**
     * 标准化模板路径
     */
    static normalizePath(path: string): string;
    /**
     * 解析模板路径
     */
    static parsePath(path: string): {
        category: string;
        device: DeviceType;
        templateName: string;
    } | null;
    /**
     * 构建模板路径
     */
    static buildPath(category: string, device: DeviceType, templateName: string): string;
    /**
     * 获取模板ID
     */
    static getTemplateId(category: string, device: DeviceType, templateName: string): string;
}
/**
 * 模板过滤和排序工具
 */
declare class TemplateFilterUtils {
    /**
     * 搜索模板
     */
    static searchTemplates(templates: TemplateConfig[], query: string): TemplateConfig[];
    /**
     * 按设备类型过滤模板
     */
    static filterByDevice(templates: TemplateConfig[], device: DeviceType): TemplateConfig[];
    /**
     * 按分类过滤模板
     */
    static filterByCategory(templates: TemplateConfig[], category: string): TemplateConfig[];
}
/**
 * 缓存管理工具
 */
declare class CacheManager {
    private cache;
    private defaultExpiry;
    constructor(defaultExpiry?: number);
    /**
     * 设置缓存
     */
    set<T>(key: string, data: T, expiry?: number): void;
    /**
     * 获取缓存
     */
    get<T>(key: string): T | null;
    /**
     * 删除缓存
     */
    delete(key: string): boolean;
    /**
     * 清空缓存
     */
    clear(): void;
    /**
     * 检查缓存是否存在且有效
     */
    has(key: string): boolean;
    /**
     * 获取缓存大小
     */
    size(): number;
    /**
     * 清理过期缓存
     */
    cleanup(): number;
}
/**
 * 防抖函数
 */
declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * 节流函数
 */
declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * 深度克隆
 */
declare function deepClone<T>(obj: T): T;
/**
 * 生成唯一ID
 */
declare function generateId(): string;
/**
 * 格式化文件大小
 */
declare function formatFileSize(bytes: number): string;
/**
 * 验证模板配置
 */
declare function validateTemplateConfig(config: any): boolean;

/**
 * 模板管理器核心类
 */

/**
 * 模板管理器
 */
declare class TemplateManager extends EventEmitter {
    private config;
    private templates;
    private categories;
    private scanTimer;
    private isScanning;
    constructor(config: TemplateManagerConfig);
    /**
     * 初始化模板管理器
     */
    initialize(): Promise<void>;
    /**
     * 扫描模板目录
     */
    scanTemplates(): Promise<void>;
    /**
     * 处理模板配置
     */
    private processTemplateConfig;
    /**
     * 验证模板配置
     */
    private validateTemplateConfig;
    /**
     * 加载模板
     */
    loadTemplate(templateId: string): Promise<TemplateInstance>;
    /**
     * 获取缓存的模板
     */
    private getCachedTemplate;
    /**
     * 获取模板配置
     */
    getTemplateConfig(templateId: string): TemplateConfig | null;
    /**
     * 获取分类下的模板列表
     */
    getTemplatesByCategory(category: string, deviceType?: DeviceType): TemplateConfig[];
    /**
     * 获取默认模板
     */
    getDefaultTemplate(category: string, deviceType: DeviceType): TemplateConfig | null;
    /**
     * 获取所有分类
     */
    getCategories(): TemplateCategory[];
    /**
     * 预加载模板
     */
    preloadTemplates(templateIds: string[]): Promise<void>;
    /**
     * 清除缓存
     */
    clearCache(): void;
    /**
     * 获取缓存统计
     */
    getCacheStats(): {
        size: number;
        keys: string[];
        totalMemory: number;
    };
    /**
     * 开始自动扫描
     */
    private startAutoScan;
    /**
     * 停止自动扫描
     */
    stopAutoScan(): void;
    /**
     * 销毁管理器
     */
    destroy(): void;
}
/**
 * 获取全局模板管理器实例
 */
declare function getGlobalTemplateManager(): TemplateManager | null;
/**
 * 设置全局模板管理器实例
 */
declare function setGlobalTemplateManager(manager: TemplateManager): void;

/**
 * 模板管理 Vue 组合式函数
 */

/**
 * 模板管理组合式函数
 */
declare function useTemplate(category: string, config?: UseTemplateOptions): UseTemplateReturn;

/**
 * 设备检测组合式函数
 */

/**
 * 设备检测组合式函数
 */
declare function useDeviceDetector(): UseDeviceDetectorReturn;

/**
 * 本地存储组合式函数
 */

/**
 * 本地存储组合式函数
 */
declare function useStorage<T>(key: string, defaultValue: T, storageType?: 'localStorage' | 'sessionStorage'): UseStorageReturn<T>;
/**
 * 响应式本地存储（支持跨标签页同步）
 */
declare function useReactiveStorage<T>(key: string, defaultValue: T, storageType?: 'localStorage' | 'sessionStorage'): UseStorageReturn<T>;

/**
 * 模板缓存管理组合式函数
 */

/**
 * 模板缓存管理组合式函数
 */
declare function useTemplateCache(): UseTemplateCacheReturn;

declare const templateConfigs: (() => Promise<TemplateConfig>)[];
declare const templateCategories: {
    login: {
        name: string;
        description: string;
        icon: string;
    };
    register: {
        name: string;
        description: string;
        icon: string;
    };
    dashboard: {
        name: string;
        description: string;
        icon: string;
    };
};
declare const defaultConfig: {
    autoDetectDevice: boolean;
    fallbackTemplate: string;
    enableCache: boolean;
    cacheExpiry: number;
    preloadTemplates: boolean;
};
declare const getTemplatesByDevice: (device: string) => (() => Promise<TemplateConfig>)[];
declare const getTemplatesByCategory: (category: string) => (() => Promise<TemplateConfig>)[];
declare const getDefaultTemplate: (category: string, device: string) => (() => Promise<TemplateConfig>) | undefined;

declare const VERSION = "1.0.0";
declare const createTemplateManager: (config?: Partial<TemplateManagerConfig>) => any;
declare const initTemplateSystem: (config?: Partial<TemplateManagerConfig>) => Promise<any>;
declare const install: (app: any, options?: Partial<TemplateManagerConfig>) => void;
declare const _default: {
    install: (app: any, options?: Partial<TemplateManagerConfig>) => void;
    TemplateManager: any;
    createTemplateManager: (config?: Partial<TemplateManagerConfig>) => any;
    initTemplateSystem: (config?: Partial<TemplateManagerConfig>) => Promise<any>;
    VERSION: string;
};

export { CacheManager, DeviceDetector, EventEmitter, StorageManager, TemplateFilterUtils, TemplateManager, TemplatePathUtils, VERSION, createTemplateManager, debounce, deepClone, _default as default, defaultConfig, formatFileSize, generateId, getDefaultTemplate, getGlobalTemplateManager, getTemplatesByCategory, getTemplatesByDevice, initTemplateSystem, install, setGlobalTemplateManager, templateCategories, templateConfigs, throttle, useDeviceDetector, useReactiveStorage, useStorage, useTemplate, useTemplateCache, validateTemplateConfig };
export type { DeviceDetector$1 as DeviceDetectorType, DeviceType, StorageAdapter as StorageAdapterType, TemplateCategory, TemplateConfig, TemplateContext, TemplateEvents, TemplateInfo, TemplateInstance, TemplateLoader, TemplateManagerConfig, TemplateProviderProps, TemplateProviderSlots, TemplateRendererProps, TemplateSelectorConfig, TemplateSelectorEmits, TemplateSelectorProps, TemplateStatus, UseDeviceDetectorReturn, UseStorageReturn, UseTemplateCacheReturn, UseTemplateConfig, UseTemplateReturn };
