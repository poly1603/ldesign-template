/**
 * @ldesign/template - Plugin System
 *
 * Template management plugin for Vue 3 applications
 */
import type { App, Component, ComputedRef, Ref } from 'vue';
import type { TemplateMetadata, TemplateRegistryItem } from '../types';
import { TemplateManager } from '../core/manager';
import { type TemplateLocale } from '../locales';
/**
 * Template plugin configuration options
 */
export interface TemplatePluginOptions {
    /**
     * Template scan pattern
     * @default '**\/*.vue'
     */
    pattern?: string;
    /**
     * Base path for template scanning
     * @default '/src/templates'
     */
    basePath?: string;
    /**
     * Enable auto initialization
     * @default true
     */
    autoInit?: boolean;
    /**
     * Enable template preloading
     * @default false
     */
    preload?: boolean;
    /**
     * Preload strategy
     * @default 'lazy'
     */
    preloadStrategy?: 'lazy' | 'eager' | 'smart';
    /**
     * Cache options
     */
    cache?: {
        enabled?: boolean;
        ttl?: number;
        maxSize?: number;
    };
    /**
     * Performance monitoring
     * @default false
     */
    performance?: boolean;
    /**
     * Default device type
     * @default 'desktop'
     */
    defaultDevice?: 'desktop' | 'tablet' | 'mobile';
    /**
     * Auto detect device
     * @default true
     */
    autoDetect?: boolean;
    /**
     * Custom device detection
     */
    detectDevice?: () => 'desktop' | 'tablet' | 'mobile';
    /**
     * Remember user preferences
     * @default false
     */
    rememberPreferences?: boolean;
    /**
     * Storage key for preferences
     * @default 'ldesign-template-prefs'
     */
    preferencesKey?: string;
    /**
     * 语言设置 - 支持 string 或 Ref<string>
     * 如果传入 Ref，将直接使用（共享模式）
     * 如果传入 string 或不传，将创建新 Ref（独立模式）
     */
    locale?: string | Ref<string>;
    /**
     * Default locale
     * @default 'zh-CN'
     */
    defaultLocale?: string;
    /**
     * Hooks
     */
    hooks?: {
        beforeLoad?: (templatePath: string) => void | Promise<void>;
        afterLoad?: (templatePath: string, component: Component) => void | Promise<void>;
        onError?: (error: Error) => void;
    };
}
/**
 * User preferences structure
 */
export interface TemplatePreferences {
    [category: string]: {
        [device: string]: string;
    };
}
/**
 * Template plugin instance
 */
export interface TemplatePlugin {
    /**
     * Template manager instance
     */
    manager: TemplateManager;
    /**
     * Plugin options
     */
    options: Required<TemplatePluginOptions>;
    /**
     * Initialize the plugin
     */
    initialize: () => Promise<void>;
    /**
     * Load a template
     */
    loadTemplate: (category: string, device: string, name: string) => Promise<Component>;
    /**
     * Get default template
     */
    getDefaultTemplate: (category: string, device: string) => Promise<TemplateMetadata | null>;
    /**
     * Get preferred template (from user preferences or default)
     */
    getPreferredTemplate: (category: string, device: string) => Promise<{
        name: string;
    } | null>;
    /**
     * Save user preference
     */
    savePreference: (category: string, device: string, templateName: string) => void;
    /**
     * Get user preferences
     */
    getPreferences: () => TemplatePreferences;
    /**
     * Clear user preferences
     */
    clearPreferences: () => void;
    /**
     * Scan templates
     */
    scanTemplates: () => Promise<Map<string, TemplateRegistryItem>>;
    /**
     * Clear cache
     */
    clearCache: () => void;
    /**
     * Detect current device
     */
    detectDevice: () => 'desktop' | 'tablet' | 'mobile';
    /**
     * Current locale (reactive)
     */
    currentLocale: Ref<string>;
    /**
     * Current locale messages (computed)
     */
    localeMessages: ComputedRef<TemplateLocale>;
    /**
     * Install the plugin
     */
    install: (app: App) => void;
    /**
     * Dispose the plugin and clean up resources
     */
    dispose: () => void;
}
/**
 * Symbol for plugin injection
 */
export declare const TemplatePluginSymbol: unique symbol;
/**
 * Create template plugin
 */
export declare function createTemplatePlugin(options?: TemplatePluginOptions): TemplatePlugin;
/**
 * Default export
 */
export default createTemplatePlugin;
