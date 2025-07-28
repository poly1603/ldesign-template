/*!
 * @ldesign/template v1.0.0
 * (c) 2025 LDesign Team
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

/**
 * 模板管理系统工具函数
 */
/**
 * 简单的事件发射器
 */
class EventEmitter {
    constructor() {
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    off(event, listener) {
        if (!this.events[event])
            return;
        const index = this.events[event].indexOf(listener);
        if (index > -1) {
            this.events[event].splice(index, 1);
        }
    }
    emit(event, ...args) {
        if (!this.events[event])
            return;
        this.events[event].forEach(listener => listener(...args));
    }
    removeAllListeners(event) {
        if (event) {
            delete this.events[event];
        }
        else {
            this.events = {};
        }
    }
}
/**
 * 设备检测工具类
 */
class DeviceDetector {
    constructor() {
        Object.defineProperty(this, "currentDevice", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'desktop'
        });
        Object.defineProperty(this, "listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                mobileBreakpoint: 768,
                tabletBreakpoint: 1024
            }
        });
        this.detectDevice();
        this.bindEvents();
    }
    static getInstance() {
        if (!DeviceDetector.instance) {
            DeviceDetector.instance = new DeviceDetector();
        }
        return DeviceDetector.instance;
    }
    /**
     * 配置断点
     */
    configure(config) {
        this.config = { ...this.config, ...config };
        this.detectDevice();
    }
    /**
     * 检测当前设备类型
     */
    detectDevice() {
        if (typeof window === 'undefined') {
            return;
        }
        const width = window.innerWidth;
        let newDevice;
        if (width < this.config.mobileBreakpoint) {
            newDevice = 'mobile';
        }
        else if (width < this.config.tabletBreakpoint) {
            newDevice = 'tablet';
        }
        else {
            newDevice = 'desktop';
        }
        if (newDevice !== this.currentDevice) {
            this.currentDevice = newDevice;
            this.notifyListeners();
        }
    }
    /**
     * 绑定窗口变化事件
     */
    bindEvents() {
        if (typeof window === 'undefined') {
            return;
        }
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.detectDevice();
            }, 100);
        });
    }
    /**
     * 通知监听器
     */
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentDevice));
    }
    /**
     * 获取当前设备类型
     */
    getCurrentDevice() {
        return this.currentDevice;
    }
    /**
     * 添加设备变化监听器
     */
    addListener(listener) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
    /**
     * 移除所有监听器
     */
    removeAllListeners() {
        this.listeners = [];
    }
}
/**
 * 存储管理工具类
 */
class StorageManager {
    constructor(storageType = 'localStorage') {
        Object.defineProperty(this, "storageType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.storageType = storageType;
    }
    /**
     * 获取存储实例
     */
    getStorage() {
        if (typeof window === 'undefined') {
            return null;
        }
        return window[this.storageType];
    }
    /**
     * 设置存储值
     */
    set(key, value) {
        try {
            const storage = this.getStorage();
            if (!storage)
                return false;
            storage.setItem(key, JSON.stringify(value));
            return true;
        }
        catch (error) {
            console.warn('Storage set failed:', error);
            return false;
        }
    }
    /**
     * 获取存储值
     */
    get(key, defaultValue) {
        try {
            const storage = this.getStorage();
            if (!storage)
                return defaultValue || null;
            const item = storage.getItem(key);
            if (item === null)
                return defaultValue || null;
            return JSON.parse(item);
        }
        catch (error) {
            console.warn('Storage get failed:', error);
            return defaultValue || null;
        }
    }
    /**
     * 移除存储值
     */
    remove(key) {
        try {
            const storage = this.getStorage();
            if (!storage)
                return false;
            storage.removeItem(key);
            return true;
        }
        catch (error) {
            console.warn('Storage remove failed:', error);
            return false;
        }
    }
    /**
     * 清空存储
     */
    clear() {
        try {
            const storage = this.getStorage();
            if (!storage)
                return false;
            storage.clear();
            return true;
        }
        catch (error) {
            console.warn('Storage clear failed:', error);
            return false;
        }
    }
    /**
     * 检查键是否存在
     */
    has(key) {
        const storage = this.getStorage();
        if (!storage)
            return false;
        return storage.getItem(key) !== null;
    }
}
/**
 * 模板路径工具
 */
class TemplatePathUtils {
    /**
     * 标准化模板路径
     */
    static normalizePath(path) {
        return path.replace(/\\/g, '/').replace(/\/+/g, '/');
    }
    /**
     * 解析模板路径
     */
    static parsePath(path) {
        const normalizedPath = this.normalizePath(path);
        const parts = normalizedPath.split('/').filter(Boolean);
        // 新的三层结构：/src/templates/category/device/templateName/index.ts
        // 需要至少6个部分：['src', 'templates', 'category', 'device', 'templateName', 'index.ts']
        if (parts.length < 6) {
            return null;
        }
        // 从路径中提取分类、设备类型和模板名称
        const templatesIndex = parts.findIndex(part => part === 'templates');
        if (templatesIndex === -1 || templatesIndex + 3 >= parts.length) {
            return null;
        }
        const category = parts[templatesIndex + 1];
        const device = parts[templatesIndex + 2];
        const templateName = parts[templatesIndex + 3];
        if (!['mobile', 'tablet', 'desktop'].includes(device)) {
            return null;
        }
        return { category, device, templateName };
    }
    /**
     * 构建模板路径
     */
    static buildPath(category, device, templateName) {
        return `${category}/${device}/${templateName}`;
    }
    /**
     * 获取模板ID
     */
    static getTemplateId(category, device, templateName) {
        return `${category}-${device}-${templateName}`;
    }
}
/**
 * 模板过滤和排序工具
 */
class TemplateFilterUtils {
    /**
     * 搜索模板
     */
    static searchTemplates(templates, query) {
        if (!query.trim()) {
            return templates;
        }
        const lowerQuery = query.toLowerCase();
        return templates.filter(template => {
            const { name, description, tags, author } = template;
            return (name.toLowerCase().includes(lowerQuery) ||
                (description && description.toLowerCase().includes(lowerQuery)) ||
                (tags && tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
                (author && author.toLowerCase().includes(lowerQuery)));
        });
    }
    /**
     * 按设备类型过滤模板
     */
    static filterByDevice(templates, device) {
        return templates.filter(template => template.device === device);
    }
    /**
     * 按分类过滤模板
     */
    static filterByCategory(templates, category) {
        return templates.filter(template => template.category === category);
    }
}
/**
 * 缓存管理工具
 */
class CacheManager {
    constructor(defaultExpiry = 5 * 60 * 1000) {
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "defaultExpiry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.defaultExpiry = defaultExpiry;
    }
    /**
     * 设置缓存
     */
    set(key, data, expiry) {
        const expiryTime = expiry || this.defaultExpiry;
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiry: expiryTime
        });
    }
    /**
     * 获取缓存
     */
    get(key) {
        const item = this.cache.get(key);
        if (!item) {
            return null;
        }
        const now = Date.now();
        if (now - item.timestamp > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        return item.data;
    }
    /**
     * 删除缓存
     */
    delete(key) {
        return this.cache.delete(key);
    }
    /**
     * 清空缓存
     */
    clear() {
        this.cache.clear();
    }
    /**
     * 检查缓存是否存在且有效
     */
    has(key) {
        const item = this.cache.get(key);
        if (!item) {
            return false;
        }
        const now = Date.now();
        if (now - item.timestamp > item.expiry) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    /**
     * 获取缓存大小
     */
    size() {
        return this.cache.size;
    }
    /**
     * 清理过期缓存
     */
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.expiry) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        return cleaned;
    }
}
/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * 节流函数
 */
function throttle(func, wait) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), wait);
        }
    };
}
/**
 * 深度克隆
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    return obj;
}
/**
 * 生成唯一ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
/**
 * 验证模板配置
 */
function validateTemplateConfig(config) {
    if (!config || typeof config !== 'object') {
        return false;
    }
    const required = ['id', 'name', 'version'];
    return required.every(field => config[field] && typeof config[field] === 'string');
}

/**
 * 模板管理器核心类
 */
/**
 * 模板管理器
 */
let TemplateManager$1 = class TemplateManager extends EventEmitter {
    constructor(config) {
        super();
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "templates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "categories", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "scanTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isScanning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.config = {
            templateRoot: config.templateRoot || '/src/templates',
            enableCache: config.enableCache ?? true,
            cacheExpiry: config.cacheExpiry ?? 1000 * 60 * 30, // 30分钟
            autoScan: config.autoScan ?? true,
            scanInterval: config.scanInterval ?? 1000 * 60 * 5, // 5分钟
            defaultDeviceType: config.defaultDeviceType ?? 'desktop',
            onError: config.onError,
            onTemplateLoaded: config.onTemplateLoaded
        };
        if (this.config.autoScan) {
            this.startAutoScan();
        }
    }
    /**
     * 初始化模板管理器
     */
    async initialize() {
        await this.scanTemplates();
    }
    /**
     * 扫描模板目录
     */
    async scanTemplates() {
        if (this.isScanning) {
            return;
        }
        this.isScanning = true;
        try {
            // 使用 import.meta.glob 扫描模板文件
            const templateModules = undefined(`${this.config.templateRoot}/**/index.ts`, { eager: false });
            const categories = new Map();
            for (const [path, moduleLoader] of Object.entries(templateModules)) {
                try {
                    const module = await moduleLoader();
                    const templateConfig = module.default || module.config;
                    if (this.validateTemplateConfig(templateConfig)) {
                        this.processTemplateConfig(templateConfig, path, categories);
                    }
                }
                catch (error) {
                    console.warn(`Failed to load template config from ${path}:`, error);
                }
            }
            this.categories = categories;
            this.emit('scan:complete', Array.from(categories.values()));
        }
        catch (error) {
            console.error('Failed to scan templates:', error);
        }
        finally {
            this.isScanning = false;
        }
    }
    /**
     * 处理模板配置
     */
    processTemplateConfig(config, configPath, categories) {
        const { category, deviceType } = config;
        // 计算组件和样式文件路径
        const basePath = configPath.replace('/index.ts', '');
        config.componentPath = `${basePath}/component.tsx`;
        config.stylePath = `${basePath}/style.less`;
        // 获取或创建分类
        let categoryData = categories.get(category);
        if (!categoryData) {
            categoryData = {
                name: category,
                deviceTypes: [],
                templates: {
                    desktop: [],
                    mobile: [],
                    tablet: []
                }
            };
            categories.set(category, categoryData);
        }
        // 添加设备类型
        if (!categoryData.deviceTypes.includes(deviceType)) {
            categoryData.deviceTypes.push(deviceType);
        }
        // 添加模板到对应的设备类型
        categoryData.templates[deviceType].push(config);
    }
    /**
     * 验证模板配置
     */
    validateTemplateConfig(config) {
        return (config &&
            typeof config.id === 'string' &&
            typeof config.name === 'string' &&
            typeof config.category === 'string' &&
            typeof config.deviceType === 'string' &&
            ['desktop', 'mobile', 'tablet'].includes(config.deviceType));
    }
    /**
     * 加载模板
     */
    async loadTemplate(templateId) {
        // 检查缓存
        const cached = this.getCachedTemplate(templateId);
        if (cached) {
            return cached;
        }
        const config = this.getTemplateConfig(templateId);
        if (!config) {
            throw new Error(`Template not found: ${templateId}`);
        }
        this.emit('template:loading', config);
        const instance = {
            config,
            status: 'loading'
        };
        try {
            // 动态加载组件
            const componentModule = await import(/* @vite-ignore */ config.componentPath);
            instance.component = componentModule.default || componentModule;
            // 动态加载样式（如果存在）
            if (config.stylePath) {
                try {
                    const styleModule = await import(/* @vite-ignore */ config.stylePath);
                    instance.styles = styleModule.default || styleModule;
                }
                catch (error) {
                    console.warn(`Failed to load styles for template ${templateId}:`, error);
                }
            }
            instance.status = 'loaded';
            instance.cachedAt = Date.now();
            // 缓存模板
            if (this.config.enableCache) {
                this.templates.set(templateId, instance);
            }
            this.emit('template:loaded', instance);
            return instance;
        }
        catch (error) {
            instance.status = 'error';
            instance.error = error;
            this.emit('template:error', config, error);
            throw error;
        }
    }
    /**
     * 获取缓存的模板
     */
    getCachedTemplate(templateId) {
        if (!this.config.enableCache) {
            return null;
        }
        const cached = this.templates.get(templateId);
        if (!cached) {
            return null;
        }
        // 检查缓存是否过期
        if (cached.cachedAt && Date.now() - cached.cachedAt > this.config.cacheExpiry) {
            this.templates.delete(templateId);
            return null;
        }
        return cached;
    }
    /**
     * 获取模板配置
     */
    getTemplateConfig(templateId) {
        for (const category of this.categories.values()) {
            for (const deviceTemplates of Object.values(category.templates)) {
                const template = deviceTemplates.find(t => t.id === templateId);
                if (template) {
                    return template;
                }
            }
        }
        return null;
    }
    /**
     * 获取分类下的模板列表
     */
    getTemplatesByCategory(category, deviceType) {
        const categoryData = this.categories.get(category);
        if (!categoryData) {
            return [];
        }
        if (deviceType) {
            return categoryData.templates[deviceType] || [];
        }
        // 返回所有设备类型的模板
        return Object.values(categoryData.templates).flat();
    }
    /**
     * 获取默认模板
     */
    getDefaultTemplate(category, deviceType) {
        const templates = this.getTemplatesByCategory(category, deviceType);
        return templates.find(t => t.isDefault) || templates[0] || null;
    }
    /**
     * 获取所有分类
     */
    getCategories() {
        return Array.from(this.categories.values());
    }
    /**
     * 预加载模板
     */
    async preloadTemplates(templateIds) {
        const loadPromises = templateIds.map(id => this.loadTemplate(id).catch(error => {
            console.warn(`Failed to preload template ${id}:`, error);
        }));
        await Promise.allSettled(loadPromises);
    }
    /**
     * 清除缓存
     */
    clearCache() {
        this.templates.clear();
    }
    /**
     * 获取缓存统计
     */
    getCacheStats() {
        const keys = Array.from(this.templates.keys());
        const totalMemory = keys.reduce((total, key) => {
            const template = this.templates.get(key);
            if (template) {
                // 简单估算内存占用
                return total + JSON.stringify(template.config).length;
            }
            return total;
        }, 0);
        return {
            size: this.templates.size,
            keys,
            totalMemory
        };
    }
    /**
     * 开始自动扫描
     */
    startAutoScan() {
        if (this.scanTimer) {
            clearInterval(this.scanTimer);
        }
        this.scanTimer = setInterval(() => {
            this.scanTemplates();
        }, this.config.scanInterval);
    }
    /**
     * 停止自动扫描
     */
    stopAutoScan() {
        if (this.scanTimer) {
            clearInterval(this.scanTimer);
            this.scanTimer = null;
        }
    }
    /**
     * 销毁管理器
     */
    destroy() {
        this.stopAutoScan();
        this.clearCache();
        this.clear();
    }
};
// 创建全局单例
let globalTemplateManager = null;
/**
 * 获取全局模板管理器实例
 */
function getGlobalTemplateManager() {
    return globalTemplateManager;
}
/**
 * 设置全局模板管理器实例
 */
function setGlobalTemplateManager$1(manager) {
    globalTemplateManager = manager;
}

/**
 * 设备检测组合式函数
 */
/**
 * 设备检测组合式函数
 */
function useDeviceDetector() {
    // 响应式状态
    const deviceType = vue.ref('desktop');
    const screenWidth = vue.ref(0);
    const screenHeight = vue.ref(0);
    // 计算属性
    const isMobile = vue.computed(() => deviceType.value === 'mobile');
    const isTablet = vue.computed(() => deviceType.value === 'tablet');
    const isDesktop = vue.computed(() => deviceType.value === 'desktop');
    // 更新设备信息
    const updateDeviceInfo = () => {
        if (typeof window !== 'undefined') {
            screenWidth.value = window.innerWidth;
            screenHeight.value = window.innerHeight;
            const detector = DeviceDetector.getInstance();
            deviceType.value = detector.getCurrentDevice();
        }
    };
    // 设备变化监听器
    let unsubscribe = null;
    vue.onMounted(() => {
        // 初始化设备信息
        updateDeviceInfo();
        // 监听设备变化
        const detector = DeviceDetector.getInstance();
        unsubscribe = detector.addListener((newDeviceType) => {
            deviceType.value = newDeviceType;
            updateDeviceInfo();
        });
    });
    vue.onUnmounted(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });
    // 计算屏幕方向
    const orientation = vue.computed(() => screenWidth.value > screenHeight.value ? 'landscape' : 'portrait');
    const isLandscape = vue.computed(() => orientation.value === 'landscape');
    const isPortrait = vue.computed(() => orientation.value === 'portrait');
    // 触摸支持检测
    const supportTouch = vue.ref(false);
    const maxTouchPoints = vue.ref(0);
    // 设备信息
    const deviceInfo = vue.ref({
        type: deviceType.value,
        os: 'unknown',
        browser: 'unknown',
        version: 'unknown',
        screen: {
            width: screenWidth.value,
            height: screenHeight.value,
            pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
            colorDepth: typeof window !== 'undefined' ? window.screen.colorDepth : 24
        },
        features: {
            touch: supportTouch.value,
            webgl: false,
            canvas: false,
            localStorage: typeof localStorage !== 'undefined',
            sessionStorage: typeof sessionStorage !== 'undefined',
            indexedDB: typeof indexedDB !== 'undefined'
        },
        userAgent: {
            raw: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            browser: 'unknown',
            browserVersion: 'unknown',
            engine: 'unknown',
            engineVersion: 'unknown',
            os: 'unknown',
            osVersion: 'unknown',
            device: 'unknown',
            vendor: 'unknown',
            model: 'unknown'
        }
    });
    // 刷新设备信息
    const refresh = () => {
        updateDeviceInfo();
        if (typeof window !== 'undefined') {
            supportTouch.value = 'ontouchstart' in window;
            maxTouchPoints.value = navigator.maxTouchPoints || 0;
        }
    };
    // 获取断点
    const getBreakpoint = (width) => {
        if (width < 768)
            return 'mobile';
        if (width < 1024)
            return 'tablet';
        return 'desktop';
    };
    return {
        deviceType,
        isMobile,
        isTablet,
        isDesktop,
        screenWidth,
        screenHeight,
        orientation,
        isLandscape,
        isPortrait,
        supportTouch,
        maxTouchPoints,
        deviceInfo,
        refresh,
        getBreakpoint
    };
}

/**
 * 本地存储组合式函数
 */
/**
 * 本地存储组合式函数
 */
function useStorage(key, defaultValue, storageType = 'localStorage') {
    const storage = new StorageManager(storageType);
    // 从存储中读取初始值
    const storedValue = storage.get(key, defaultValue);
    const value = vue.ref(storedValue);
    // 监听值的变化并同步到存储
    vue.watch(value, (newValue) => {
        if (newValue === null || newValue === undefined) {
            storage.remove(key);
        }
        else {
            storage.set(key, newValue);
        }
    }, { deep: true });
    // 设置值
    const setValue = (newValue) => {
        value.value = newValue;
    };
    // 检查存储支持
    const isSupported = vue.ref(storage.isSupported());
    // 移除值
    const remove = () => {
        storage.remove(key);
        value.value = defaultValue;
    };
    // 清空存储
    const clear = () => {
        storage.clear();
        value.value = defaultValue;
    };
    // 刷新值
    const refresh = () => {
        const storedValue = storage.get(key);
        value.value = storedValue !== null ? storedValue : defaultValue;
    };
    // 获取存储大小
    const getSize = () => {
        return storage.size();
    };
    return {
        value,
        isSupported,
        setValue,
        remove,
        clear,
        refresh,
        getSize
    };
}
/**
 * 响应式本地存储（支持跨标签页同步）
 */
function useReactiveStorage(key, defaultValue, storageType = 'localStorage') {
    const storage = new StorageManager(storageType);
    const storedValue = storage.get(key, defaultValue);
    const value = vue.ref(storedValue);
    // 监听存储变化（跨标签页同步）
    const handleStorageChange = (e) => {
        if (e.key === key && e.newValue !== null) {
            try {
                const newValue = JSON.parse(e.newValue);
                value.value = newValue;
            }
            catch (error) {
                console.warn(`Failed to parse storage value for key ${key}:`, error);
            }
        }
        else if (e.key === key && e.newValue === null) {
            value.value = defaultValue;
        }
    };
    // 只在浏览器环境中监听存储事件
    if (typeof window !== 'undefined' && storageType === 'localStorage') {
        window.addEventListener('storage', handleStorageChange);
    }
    // 监听值的变化并同步到存储
    vue.watch(value, (newValue) => {
        if (newValue === null || newValue === undefined) {
            storage.remove(key);
        }
        else {
            storage.set(key, newValue);
        }
    }, { deep: true });
    const setValue = (newValue) => {
        value.value = newValue;
    };
    // 检查存储支持
    const isSupported = vue.ref(storage.isSupported());
    // 移除值
    const remove = () => {
        storage.remove(key);
        value.value = defaultValue;
    };
    // 清空存储
    const clear = () => {
        storage.clear();
        value.value = defaultValue;
    };
    // 刷新值
    const refresh = () => {
        const storedValue = storage.get(key);
        value.value = storedValue !== null ? storedValue : defaultValue;
    };
    // 获取存储大小
    const getSize = () => {
        return storage.size();
    };
    return {
        value,
        isSupported,
        setValue,
        remove,
        clear,
        refresh,
        getSize
    };
}

/**
 * 模板管理 Vue 组合式函数
 */
/**
 * 模板管理组合式函数
 */
function useTemplate(category, config = {}) {
    const templateManager = getGlobalTemplateManager();
    if (!templateManager) {
        throw new Error('Template manager not initialized. Please call createTemplateManager first.');
    }
    // 响应式状态
    const currentTemplate = vue.ref(null);
    const isLoading = vue.ref(false);
    const error = vue.ref(null);
    // 设备检测
    const { deviceType: currentDevice } = useDeviceDetector();
    // 用户偏好存储
    const storageKey = config.storageKey || `template_preference_${category}`;
    const { value: userPreference, setValue: setUserPreference } = useStorage(storageKey, null, config.storageType);
    // 计算可用模板列表
    const availableTemplates = vue.computed(() => {
        return templateManager.getTemplatesByCategory(category, currentDevice.value);
    });
    // 获取默认模板ID
    const getDefaultTemplateId = (device) => {
        // 优先使用配置的默认模板
        if (config.defaultTemplates?.[device]) {
            return config.defaultTemplates[device];
        }
        // 使用系统默认模板
        const defaultTemplate = templateManager.getDefaultTemplate(category, device);
        return defaultTemplate?.id || null;
    };
    // 加载模板
    const loadTemplate = async (templateId) => {
        if (isLoading.value) {
            return;
        }
        isLoading.value = true;
        error.value = null;
        try {
            const template = await templateManager.loadTemplate(templateId);
            currentTemplate.value = template;
            // 保存用户选择
            setUserPreference({
                templateId,
                deviceType: currentDevice.value
            });
        }
        catch (err) {
            error.value = err;
            console.error(`Failed to load template ${templateId}:`, err);
        }
        finally {
            isLoading.value = false;
        }
    };
    // 切换模板
    const switchTemplate = async (templateId) => {
        const templateConfig = templateManager.getTemplateConfig(templateId);
        if (!templateConfig) {
            throw new Error(`Template not found: ${templateId}`);
        }
        // 检查模板是否属于当前分类和设备类型
        if (templateConfig.category !== category || templateConfig.device !== currentDevice.value) {
            throw new Error(`Template ${templateId} is not compatible with current category/device`);
        }
        await loadTemplate(templateId);
        return true;
    };
    // 刷新模板列表
    const refresh = async () => {
        await templateManager.scanTemplates();
    };
    // 预加载模板
    const preload = async (templateIds) => {
        await templateManager.preloadTemplates(templateIds);
    };
    // 初始化模板
    const initializeTemplate = async () => {
        const templates = availableTemplates.value;
        if (templates.length === 0) {
            return;
        }
        let templateId = null;
        // 1. 优先使用用户保存的偏好（如果设备类型匹配）
        if (userPreference.value?.deviceType === currentDevice.value) {
            const preferredTemplate = templates.find(t => t.id === userPreference.value.templateId);
            if (preferredTemplate) {
                templateId = preferredTemplate.id;
            }
        }
        // 2. 使用默认模板
        if (!templateId) {
            templateId = getDefaultTemplateId(currentDevice.value);
        }
        // 3. 使用第一个可用模板
        if (!templateId && templates.length > 0) {
            templateId = templates[0].id;
        }
        if (templateId) {
            await loadTemplate(templateId);
        }
    };
    // 监听设备类型变化
    vue.watch(currentDevice, async (newDevice, oldDevice) => {
        if (config.autoSwitchByDevice && newDevice !== oldDevice) {
            await initializeTemplate();
        }
    });
    // 监听可用模板变化
    vue.watch(availableTemplates, async (newTemplates) => {
        // 如果当前没有模板或当前模板不在新的模板列表中，重新初始化
        if (!currentTemplate.value ||
            !newTemplates.find(t => t.id === currentTemplate.value.config.id)) {
            await initializeTemplate();
        }
    });
    // 组件挂载时初始化
    vue.onMounted(async () => {
        await initializeTemplate();
        // 预加载（如果启用）
        if (config.preload) {
            const templateIds = availableTemplates.value.map(t => t.id);
            preload(templateIds).catch(err => {
                console.warn('Failed to preload templates:', err);
            });
        }
    });
    // 计算当前模板配置
    const currentTemplateConfig = vue.computed(() => currentTemplate.value ? currentTemplate.value.config : null);
    return {
        currentTemplate: currentTemplateConfig,
        availableTemplates,
        isLoading,
        error,
        switchTemplate,
        refreshTemplates: refresh,
        preloadTemplates: preload,
        clearError: () => { error.value = null; },
        getTemplateById: (id) => templateManager.getTemplateConfig(id),
        getTemplatesByDevice: (device) => templateManager.getTemplatesByDevice(device),
        searchTemplates: (query) => templateManager.searchTemplates(query)
    };
}

/**
 * 模板缓存管理组合式函数
 */
/**
 * 模板缓存管理组合式函数
 */
function useTemplateCache() {
    const templateManager = getGlobalTemplateManager();
    if (!templateManager) {
        throw new Error('Template manager not initialized. Please call createTemplateManager first.');
    }
    // 本地缓存映射
    const localCache = vue.ref(new Map());
    /**
     * 获取缓存的模板
     */
    const getCachedTemplate = (templateId) => {
        // 优先从本地缓存获取
        const localCached = localCache.value.get(templateId);
        if (localCached) {
            return localCached;
        }
        // 从全局管理器获取
        return templateManager.getCacheStats().keys.includes(templateId)
            ? templateManager['templates']?.get(templateId) || null
            : null;
    };
    /**
     * 设置模板缓存
     */
    const setCachedTemplate = (templateId, template) => {
        // 设置到本地缓存
        localCache.value.set(templateId, {
            ...template,
            cachedAt: Date.now()
        });
    };
    /**
     * 移除模板缓存
     */
    const removeCachedTemplate = (templateId) => {
        localCache.value.delete(templateId);
    };
    /**
     * 清空所有缓存
     */
    const clearCache = () => {
        localCache.value.clear();
        templateManager.clearCache();
    };
    /**
     * 获取缓存统计
     */
    const getCacheStats = () => {
        const localKeys = Array.from(localCache.value.keys());
        const globalStats = templateManager.getCacheStats();
        // 合并本地和全局缓存统计
        [...new Set([...localKeys, ...globalStats.keys])];
        const localMemory = localKeys.reduce((total, key) => {
            const template = localCache.value.get(key);
            if (template) {
                return total + JSON.stringify(template.config).length;
            }
            return total;
        }, 0);
        // 模拟统计数据
        const totalRequests = 100;
        const totalHits = Math.floor(totalRequests * 0.8);
        const totalMisses = totalRequests - totalHits;
        return {
            size: localMemory + globalStats.totalMemory,
            hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
            missRate: totalRequests > 0 ? totalMisses / totalRequests : 0,
            totalRequests,
            totalHits,
            totalMisses,
            lastUpdate: new Date()
        };
    };
    /**
     * 清理过期缓存
     */
    const cleanupExpiredCache = (maxAge = 30 * 60 * 1000) => {
        const now = Date.now();
        const expiredKeys = [];
        localCache.value.forEach((template, key) => {
            if (template.cachedAt && now - template.cachedAt > maxAge) {
                expiredKeys.push(key);
            }
        });
        expiredKeys.forEach(key => {
            localCache.value.delete(key);
        });
        console.log(`Cleaned up ${expiredKeys.length} expired templates from cache`);
    };
    // 定期清理过期缓存
    const cleanupInterval = setInterval(() => {
        cleanupExpiredCache();
    }, 5 * 60 * 1000); // 每5分钟清理一次
    // 组件卸载时清理
    vue.onUnmounted(() => {
        clearInterval(cleanupInterval);
        localCache.value.clear();
    });
    return {
        cacheStats: vue.ref(getCacheStats()),
        getCache: getCachedTemplate,
        setCache: setCachedTemplate,
        removeCache: removeCachedTemplate,
        clearCache,
        hasCache: (key) => localCache.value.has(key),
        getCaches: (keys) => {
            const result = {};
            keys.forEach(key => {
                const cached = getCachedTemplate(key);
                if (cached)
                    result[key] = cached;
            });
            return result;
        },
        setCaches: (entries) => {
            Object.entries(entries).forEach(([key, value]) => {
                setCachedTemplate(key, value);
            });
        },
        removeCaches: (keys) => {
            keys.forEach(key => removeCachedTemplate(key));
        },
        refreshStats: () => getCacheStats(),
        exportCache: () => JSON.stringify(Array.from(localCache.value.entries())),
        importCache: (data) => {
            try {
                const entries = JSON.parse(data);
                localCache.value = new Map(entries);
            }
            catch (error) {
                console.error('Failed to import cache:', error);
            }
        }
    };
}

const config$5 = {
    id: 'login-desktop-default',
    name: '默认登录模板',
    description: '简洁的桌面端登录模板',
    version: '1.0.0',
    author: 'LDesign Team',
    category: 'login',
    device: 'desktop',
    templateName: 'default',
    preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20clean%20login%20form%20desktop%20interface%20blue%20gradient&image_size=landscape_16_9',
    tags: ['登录', '表单', '简洁'],
    props: {
        title: {
            type: 'string',
            default: '用户登录',
            description: '登录页面标题'
        },
        logo: {
            type: 'string',
            default: '',
            description: '网站Logo'
        },
        showRememberMe: {
            type: 'boolean',
            default: true,
            description: '是否显示记住我选项'
        },
        showForgotPassword: {
            type: 'boolean',
            default: true,
            description: '是否显示忘记密码链接'
        }
    },
    slots: {
        header: {
            description: '页面头部插槽'
        },
        footer: {
            description: '页面底部插槽'
        },
        extra: {
            description: '额外内容插槽'
        }
    },
    events: {
        login: {
            description: '登录事件',
            params: {
                username: 'string',
                password: 'string',
                rememberMe: 'boolean'
            }
        },
        forgotPassword: {
            description: '忘记密码事件'
        }
    }
};

var index$6 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    config: config$5,
    default: config$5
});

const config$4 = {
    id: 'login-desktop-modern',
    name: '现代登录模板',
    description: '采用现代化设计语言的桌面端登录模板，支持渐变背景和流畅动画',
    version: '1.0.0',
    author: 'LDesign Team',
    category: 'login',
    device: 'desktop',
    templateName: 'modern',
    preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20gradient%20login%20form%20desktop%20purple%20blue%20glass%20morphism&image_size=landscape_16_9',
    tags: ['登录', '现代', '渐变', '玻璃态', '动画'],
    props: {
        title: {
            type: 'string',
            default: '欢迎回来',
            description: '登录页面标题'
        },
        subtitle: {
            type: 'string',
            default: '请登录您的账户',
            description: '登录页面副标题'
        },
        logo: {
            type: 'string',
            default: '',
            description: '网站Logo URL'
        },
        backgroundColor: {
            type: 'string',
            default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            description: '背景渐变色'
        },
        showRememberMe: {
            type: 'boolean',
            default: true,
            description: '是否显示记住我选项'
        },
        showForgotPassword: {
            type: 'boolean',
            default: true,
            description: '是否显示忘记密码链接'
        },
        showRegisterLink: {
            type: 'boolean',
            default: true,
            description: '是否显示注册链接'
        },
        socialLogins: {
            type: 'array',
            default: [
                { name: 'google', label: 'Google', icon: 'fab fa-google' },
                { name: 'github', label: 'GitHub', icon: 'fab fa-github' }
            ],
            description: '社交登录选项'
        },
        enableGlassMorphism: {
            type: 'boolean',
            default: true,
            description: '是否启用玻璃态效果'
        },
        enableAnimations: {
            type: 'boolean',
            default: true,
            description: '是否启用动画效果'
        }
    },
    slots: {
        header: {
            description: '页面头部插槽，可以放置Logo或自定义标题'
        },
        footer: {
            description: '页面底部插槽，可以放置版权信息或其他链接'
        },
        extra: {
            description: '额外内容插槽，可以放置广告、公告或其他信息'
        },
        'social-login': {
            description: '社交登录插槽，可以自定义社交登录按钮'
        },
        'form-extra': {
            description: '表单额外字段插槽'
        }
    },
    events: {
        login: {
            description: '用户点击登录按钮时触发',
            params: {
                username: 'string',
                password: 'string',
                rememberMe: 'boolean'
            }
        },
        register: {
            description: '用户点击注册链接时触发'
        },
        forgotPassword: {
            description: '用户点击忘记密码时触发'
        },
        socialLogin: {
            description: '社交登录时触发',
            params: {
                provider: 'string',
                data: 'object'
            }
        },
        inputFocus: {
            description: '输入框获得焦点时触发',
            params: {
                field: 'string'
            }
        },
        inputBlur: {
            description: '输入框失去焦点时触发',
            params: {
                field: 'string',
                value: 'string'
            }
        }
    }
};

var index$5 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    config: config$4,
    default: config$4
});

const config$3 = {
    id: 'login-mobile-card',
    name: '移动端卡片登录模板',
    description: '采用卡片设计的移动端登录模板，具有现代感和层次感',
    version: '1.0.0',
    author: 'LDesign Team',
    category: 'login',
    device: 'mobile',
    templateName: 'card',
    preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20login%20card%20design%20gradient%20background%20floating%20card%20shadow&image_size=portrait_9_16',
    tags: ['登录', '移动端', '卡片', '渐变', '现代'],
    props: {
        title: {
            type: 'string',
            default: '欢迎回来',
            description: '登录页面标题'
        },
        subtitle: {
            type: 'string',
            default: '请登录您的账户继续使用',
            description: '登录页面副标题'
        },
        logo: {
            type: 'string',
            default: '',
            description: '网站Logo URL'
        },
        backgroundGradient: {
            type: 'string',
            default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            description: '背景渐变色'
        },
        cardBackground: {
            type: 'string',
            default: 'rgba(255, 255, 255, 0.95)',
            description: '卡片背景色'
        },
        primaryColor: {
            type: 'string',
            default: '#667eea',
            description: '主题色'
        },
        showRememberMe: {
            type: 'boolean',
            default: false,
            description: '是否显示记住我选项'
        },
        showForgotPassword: {
            type: 'boolean',
            default: true,
            description: '是否显示忘记密码链接'
        },
        showRegisterLink: {
            type: 'boolean',
            default: true,
            description: '是否显示注册链接'
        },
        enableGlassEffect: {
            type: 'boolean',
            default: true,
            description: '是否启用玻璃态效果'
        },
        socialLogins: {
            type: 'array',
            default: [
                { name: 'apple', label: 'Apple ID', icon: 'fab fa-apple', color: '#000000' },
                { name: 'google', label: 'Google', icon: 'fab fa-google', color: '#ea4335' }
            ],
            description: '社交登录选项'
        },
        enableQuickLogin: {
            type: 'boolean',
            default: true,
            description: '是否启用快速登录'
        },
        showWelcomeMessage: {
            type: 'boolean',
            default: true,
            description: '是否显示欢迎信息'
        }
    },
    slots: {
        header: {
            description: '页面头部插槽'
        },
        welcome: {
            description: '欢迎信息插槽'
        },
        footer: {
            description: '页面底部插槽'
        },
        extra: {
            description: '额外内容插槽'
        },
        'card-header': {
            description: '卡片头部插槽'
        },
        'card-footer': {
            description: '卡片底部插槽'
        }
    },
    events: {
        login: {
            description: '用户点击登录按钮时触发',
            params: {
                username: 'string',
                password: 'string',
                rememberMe: 'boolean'
            }
        },
        quickLogin: {
            description: '快速登录时触发',
            params: {
                phone: 'string',
                code: 'string'
            }
        },
        register: {
            description: '用户点击注册链接时触发'
        },
        forgotPassword: {
            description: '用户点击忘记密码时触发'
        },
        socialLogin: {
            description: '社交登录时触发',
            params: {
                provider: 'string',
                data: 'object'
            }
        },
        switchLoginMode: {
            description: '切换登录模式时触发',
            params: {
                mode: 'string'
            }
        },
        cardSwipe: {
            description: '卡片滑动时触发',
            params: {
                direction: 'string'
            }
        }
    }
};

var index$4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    config: config$3,
    default: config$3
});

const config$2 = {
    id: 'login-mobile-default',
    name: '移动端默认登录模板',
    description: '简洁清爽的移动端登录模板，专为手机屏幕优化',
    version: '1.0.0',
    author: 'LDesign Team',
    category: 'login',
    device: 'mobile',
    templateName: 'default',
    preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20login%20form%20clean%20simple%20white%20blue%20vertical%20layout&image_size=portrait_9_16',
    tags: ['登录', '移动端', '简洁', '响应式'],
    props: {
        title: {
            type: 'string',
            default: '登录',
            description: '登录页面标题'
        },
        logo: {
            type: 'string',
            default: '',
            description: '网站Logo URL'
        },
        backgroundColor: {
            type: 'string',
            default: '#f8fafc',
            description: '背景颜色'
        },
        primaryColor: {
            type: 'string',
            default: '#3b82f6',
            description: '主题色'
        },
        showRememberMe: {
            type: 'boolean',
            default: false,
            description: '是否显示记住我选项（移动端通常不需要）'
        },
        showForgotPassword: {
            type: 'boolean',
            default: true,
            description: '是否显示忘记密码链接'
        },
        showRegisterLink: {
            type: 'boolean',
            default: true,
            description: '是否显示注册链接'
        },
        enableBiometric: {
            type: 'boolean',
            default: true,
            description: '是否启用生物识别登录（指纹/面容）'
        },
        socialLogins: {
            type: 'array',
            default: [
                { name: 'wechat', label: '微信登录', icon: 'fab fa-weixin', color: '#07c160' },
                { name: 'qq', label: 'QQ登录', icon: 'fab fa-qq', color: '#12b7f5' }
            ],
            description: '社交登录选项'
        },
        enableQuickLogin: {
            type: 'boolean',
            default: true,
            description: '是否启用快速登录（短信验证码）'
        }
    },
    slots: {
        header: {
            description: '页面头部插槽，可以放置Logo或自定义标题'
        },
        footer: {
            description: '页面底部插槽，可以放置版权信息'
        },
        extra: {
            description: '额外内容插槽'
        },
        'quick-actions': {
            description: '快速操作插槽，可以放置快速登录按钮'
        }
    },
    events: {
        login: {
            description: '用户点击登录按钮时触发',
            params: {
                username: 'string',
                password: 'string',
                rememberMe: 'boolean'
            }
        },
        quickLogin: {
            description: '快速登录（短信验证码）时触发',
            params: {
                phone: 'string',
                code: 'string'
            }
        },
        biometricLogin: {
            description: '生物识别登录时触发'
        },
        register: {
            description: '用户点击注册链接时触发'
        },
        forgotPassword: {
            description: '用户点击忘记密码时触发'
        },
        socialLogin: {
            description: '社交登录时触发',
            params: {
                provider: 'string',
                data: 'object'
            }
        },
        switchLoginMode: {
            description: '切换登录模式时触发',
            params: {
                mode: 'string' // 'password' | 'sms' | 'biometric'
            }
        }
    }
};

var index$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    config: config$2,
    default: config$2
});

const config$1 = {
    id: 'login-tablet-default',
    name: '平板端默认登录模板',
    description: '专为平板设备优化的登录模板，平衡了桌面端和移动端的设计特点',
    version: '1.0.0',
    author: 'LDesign Team',
    category: 'login',
    device: 'tablet',
    templateName: 'default',
    preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=tablet%20login%20form%20horizontal%20layout%20clean%20modern%20blue%20white&image_size=landscape_16_9',
    tags: ['登录', '平板', '横屏', '简洁', '现代'],
    props: {
        title: {
            type: 'string',
            default: '用户登录',
            description: '登录页面标题'
        },
        subtitle: {
            type: 'string',
            default: '请输入您的账户信息',
            description: '登录页面副标题'
        },
        logo: {
            type: 'string',
            default: '',
            description: '网站Logo URL'
        },
        backgroundColor: {
            type: 'string',
            default: '#f8fafc',
            description: '背景颜色'
        },
        primaryColor: {
            type: 'string',
            default: '#3b82f6',
            description: '主题色'
        },
        layoutMode: {
            type: 'string',
            default: 'horizontal',
            description: '布局模式：horizontal（横向）或 vertical（纵向）'
        },
        showRememberMe: {
            type: 'boolean',
            default: true,
            description: '是否显示记住我选项'
        },
        showForgotPassword: {
            type: 'boolean',
            default: true,
            description: '是否显示忘记密码链接'
        },
        showRegisterLink: {
            type: 'boolean',
            default: true,
            description: '是否显示注册链接'
        },
        enableSplitView: {
            type: 'boolean',
            default: true,
            description: '是否启用分屏视图（左侧信息，右侧表单）'
        },
        leftPanelContent: {
            type: 'object',
            default: {
                title: '欢迎使用我们的服务',
                description: '安全、便捷、高效的数字化解决方案',
                features: ['数据安全保护', '多端同步', '7x24小时服务']
            },
            description: '左侧面板内容'
        },
        socialLogins: {
            type: 'array',
            default: [
                { name: 'google', label: 'Google', icon: 'fab fa-google' },
                { name: 'microsoft', label: 'Microsoft', icon: 'fab fa-microsoft' },
                { name: 'apple', label: 'Apple', icon: 'fab fa-apple' }
            ],
            description: '社交登录选项'
        },
        enableQuickLogin: {
            type: 'boolean',
            default: true,
            description: '是否启用快速登录'
        }
    },
    slots: {
        header: {
            description: '页面头部插槽'
        },
        'left-panel': {
            description: '左侧面板插槽（分屏模式下）'
        },
        'right-panel': {
            description: '右侧面板插槽（分屏模式下）'
        },
        footer: {
            description: '页面底部插槽'
        },
        extra: {
            description: '额外内容插槽'
        },
        'form-header': {
            description: '表单头部插槽'
        },
        'form-footer': {
            description: '表单底部插槽'
        }
    },
    events: {
        login: {
            description: '用户点击登录按钮时触发',
            params: {
                username: 'string',
                password: 'string',
                rememberMe: 'boolean'
            }
        },
        quickLogin: {
            description: '快速登录时触发',
            params: {
                phone: 'string',
                code: 'string'
            }
        },
        register: {
            description: '用户点击注册链接时触发'
        },
        forgotPassword: {
            description: '用户点击忘记密码时触发'
        },
        socialLogin: {
            description: '社交登录时触发',
            params: {
                provider: 'string',
                data: 'object'
            }
        },
        switchLoginMode: {
            description: '切换登录模式时触发',
            params: {
                mode: 'string'
            }
        },
        layoutChange: {
            description: '布局模式改变时触发',
            params: {
                mode: 'string'
            }
        }
    }
};

var index$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    config: config$1,
    default: config$1
});

const config = {
    id: 'login-tablet-split',
    name: '平板端分屏登录模板',
    description: '采用分屏设计的平板端登录模板，左侧展示品牌信息，右侧为登录表单',
    version: '1.0.0',
    author: 'LDesign Team',
    category: 'login',
    device: 'tablet',
    templateName: 'split',
    preview: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=tablet%20split%20screen%20login%20left%20brand%20right%20form%20modern%20design&image_size=landscape_16_9',
    tags: ['登录', '平板', '分屏', '品牌', '现代'],
    props: {
        title: {
            type: 'string',
            default: '登录您的账户',
            description: '登录表单标题'
        },
        brandTitle: {
            type: 'string',
            default: '欢迎来到未来',
            description: '品牌区域标题'
        },
        brandSubtitle: {
            type: 'string',
            default: '体验下一代数字化解决方案',
            description: '品牌区域副标题'
        },
        logo: {
            type: 'string',
            default: '',
            description: '网站Logo URL'
        },
        brandImage: {
            type: 'string',
            default: '',
            description: '品牌展示图片URL'
        },
        brandGradient: {
            type: 'string',
            default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            description: '品牌区域背景渐变'
        },
        formBackground: {
            type: 'string',
            default: '#ffffff',
            description: '表单区域背景色'
        },
        primaryColor: {
            type: 'string',
            default: '#667eea',
            description: '主题色'
        },
        splitRatio: {
            type: 'string',
            default: '60:40',
            description: '分屏比例（品牌区:表单区）'
        },
        showRememberMe: {
            type: 'boolean',
            default: true,
            description: '是否显示记住我选项'
        },
        showForgotPassword: {
            type: 'boolean',
            default: true,
            description: '是否显示忘记密码链接'
        },
        showRegisterLink: {
            type: 'boolean',
            default: true,
            description: '是否显示注册链接'
        },
        brandFeatures: {
            type: 'array',
            default: [
                { icon: 'fas fa-shield-alt', title: '安全可靠', description: '企业级安全保护' },
                { icon: 'fas fa-sync-alt', title: '实时同步', description: '多设备数据同步' },
                { icon: 'fas fa-headset', title: '专业支持', description: '7x24小时客服' }
            ],
            description: '品牌特性列表'
        },
        socialLogins: {
            type: 'array',
            default: [
                { name: 'google', label: 'Google', icon: 'fab fa-google' },
                { name: 'microsoft', label: 'Microsoft', icon: 'fab fa-microsoft' },
                { name: 'github', label: 'GitHub', icon: 'fab fa-github' }
            ],
            description: '社交登录选项'
        },
        enableAnimations: {
            type: 'boolean',
            default: true,
            description: '是否启用动画效果'
        },
        enableParallax: {
            type: 'boolean',
            default: true,
            description: '是否启用视差效果'
        }
    },
    slots: {
        header: {
            description: '页面头部插槽'
        },
        'brand-header': {
            description: '品牌区域头部插槽'
        },
        'brand-content': {
            description: '品牌区域内容插槽'
        },
        'brand-footer': {
            description: '品牌区域底部插槽'
        },
        'form-header': {
            description: '表单区域头部插槽'
        },
        'form-content': {
            description: '表单区域内容插槽'
        },
        'form-footer': {
            description: '表单区域底部插槽'
        },
        footer: {
            description: '页面底部插槽'
        },
        extra: {
            description: '额外内容插槽'
        }
    },
    events: {
        login: {
            description: '用户点击登录按钮时触发',
            params: {
                username: 'string',
                password: 'string',
                rememberMe: 'boolean'
            }
        },
        register: {
            description: '用户点击注册链接时触发'
        },
        forgotPassword: {
            description: '用户点击忘记密码时触发'
        },
        socialLogin: {
            description: '社交登录时触发',
            params: {
                provider: 'string',
                data: 'object'
            }
        },
        brandFeatureClick: {
            description: '点击品牌特性时触发',
            params: {
                feature: 'object'
            }
        },
        splitResize: {
            description: '分屏比例调整时触发',
            params: {
                ratio: 'string'
            }
        }
    }
};

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    config: config,
    default: config
});

// 模板入口文件
// 自动导出所有模板配置
// Desktop 登录模板
// 模板配置汇总
const templateConfigs = [
    // Desktop
    () => Promise.resolve().then(function () { return index$6; }).then(m => m.config),
    () => Promise.resolve().then(function () { return index$5; }).then(m => m.config),
    // Mobile
    () => Promise.resolve().then(function () { return index$3; }).then(m => m.config),
    () => Promise.resolve().then(function () { return index$4; }).then(m => m.config),
    // Tablet
    () => Promise.resolve().then(function () { return index$2; }).then(m => m.config),
    () => Promise.resolve().then(function () { return index$1; }).then(m => m.config),
];
// 模板分类
const templateCategories = {
    login: {
        name: '登录模板',
        description: '用户登录相关的模板',
        icon: 'fas fa-sign-in-alt'
    },
    register: {
        name: '注册模板',
        description: '用户注册相关的模板',
        icon: 'fas fa-user-plus'
    },
    dashboard: {
        name: '仪表板模板',
        description: '数据展示和管理界面模板',
        icon: 'fas fa-tachometer-alt'
    }
};
// 默认配置
const defaultConfig = {
    autoDetectDevice: true,
    fallbackTemplate: 'default',
    enableCache: true,
    cacheExpiry: 3600000, // 1小时
    preloadTemplates: true
};
// 工具函数
const getTemplatesByDevice = (device) => {
    return templateConfigs.filter(async (configLoader) => {
        const config = await configLoader();
        return config.device === device;
    });
};
const getTemplatesByCategory = (category) => {
    return templateConfigs.filter(async (configLoader) => {
        const config = await configLoader();
        return config.category === category;
    });
};
const getDefaultTemplate = (category, device) => {
    return templateConfigs.find(async (configLoader) => {
        const config = await configLoader();
        return config.category === category &&
            config.device === device &&
            config.templateName === 'default';
    });
};

// LDesign Template - 模板管理系统主入口文件
// 核心类和管理器
// 移除重复的导出声明
// 版本信息
const VERSION = '1.0.0';
// 默认配置
const DEFAULT_TEMPLATE_CONFIG = {
    autoScan: true,
    enableCache: true,
    enableDeviceDetection: true,
    templateRoot: '/src/templates'
};
// 创建模板管理器实例的便捷函数
const createTemplateManager = (config) => {
    return new TemplateManager({
        ...DEFAULT_TEMPLATE_CONFIG,
        ...config
    });
};
// 初始化函数
const initTemplateSystem = async (config) => {
    const manager = createTemplateManager(config);
    // 设置为全局管理器
    setGlobalTemplateManager(manager);
    // 初始化管理器
    await manager.initialize();
    return manager;
};
// 快速安装函数（用于 Vue 插件）
const install = (app, options) => {
    // 创建全局模板管理器
    const manager = createTemplateManager(options);
    // 提供给整个应用
    app.provide('templateManager', manager);
    // 添加全局属性
    app.config.globalProperties.$templateManager = manager;
    // 初始化管理器
    manager.initialize().catch(error => {
        console.error('Failed to initialize template manager:', error);
    });
};
// 默认导出
var index = {
    install,
    TemplateManager,
    createTemplateManager,
    initTemplateSystem,
    VERSION
};

exports.CacheManager = CacheManager;
exports.DeviceDetector = DeviceDetector;
exports.EventEmitter = EventEmitter;
exports.StorageManager = StorageManager;
exports.TemplateFilterUtils = TemplateFilterUtils;
exports.TemplateManager = TemplateManager$1;
exports.TemplatePathUtils = TemplatePathUtils;
exports.VERSION = VERSION;
exports.createTemplateManager = createTemplateManager;
exports.debounce = debounce;
exports.deepClone = deepClone;
exports.default = index;
exports.defaultConfig = defaultConfig;
exports.formatFileSize = formatFileSize;
exports.generateId = generateId;
exports.getDefaultTemplate = getDefaultTemplate;
exports.getGlobalTemplateManager = getGlobalTemplateManager;
exports.getTemplatesByCategory = getTemplatesByCategory;
exports.getTemplatesByDevice = getTemplatesByDevice;
exports.initTemplateSystem = initTemplateSystem;
exports.install = install;
exports.setGlobalTemplateManager = setGlobalTemplateManager$1;
exports.templateCategories = templateCategories;
exports.templateConfigs = templateConfigs;
exports.throttle = throttle;
exports.useDeviceDetector = useDeviceDetector;
exports.useReactiveStorage = useReactiveStorage;
exports.useStorage = useStorage;
exports.useTemplate = useTemplate;
exports.useTemplateCache = useTemplateCache;
exports.validateTemplateConfig = validateTemplateConfig;
//# sourceMappingURL=index.cjs.map
