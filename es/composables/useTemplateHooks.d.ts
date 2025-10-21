/**
 * Template Hooks System
 *
 * Advanced composable hooks for template lifecycle management
 */
import type { Component, ComputedRef, Ref } from 'vue';
import type { DeviceType, TemplateLoadOptions, TemplateMetadata } from '../types';
/**
 * Template lifecycle events
 */
export interface TemplateLifecycle {
    onBeforeLoad?: (metadata: TemplateMetadata) => void | Promise<void>;
    onLoaded?: (component: Component, metadata: TemplateMetadata) => void;
    onBeforeUnload?: (component: Component) => void;
    onError?: (error: Error, retry: () => void) => void;
    onRetry?: (attemptNumber: number) => void;
    onTransition?: (from: string | null, to: string) => void;
}
/**
 * Template prefetch options
 */
export interface TemplatePrefetchOptions {
    strategy?: 'eager' | 'lazy' | 'smart' | 'idle';
    delay?: number;
    priority?: 'high' | 'normal' | 'low';
    maxConcurrent?: number;
}
/**
 * Template hook result
 */
export interface TemplateHookResult {
    component: ComputedRef<Component | null>;
    metadata: ComputedRef<TemplateMetadata | null>;
    loading: ComputedRef<boolean>;
    error: ComputedRef<Error | null>;
    retry: () => Promise<void>;
    prefetch: (templates: string[]) => Promise<void>;
    transition: (category: string, device?: string, name?: string) => Promise<void>;
    dispose: () => void;
}
/**
 * Advanced template lifecycle hook
 */
export declare function useTemplateLifecycle(category: Ref<string> | string, device?: Ref<DeviceType | string> | DeviceType | string, name?: Ref<string> | string, lifecycle?: TemplateLifecycle, options?: TemplateLoadOptions): TemplateHookResult;
/**
 * Smart template prefetching hook
 */
export declare function useTemplatePrefetch(options?: TemplatePrefetchOptions): {
    prefetch: (templates: string[]) => Promise<void>;
    prefetchRelated: (category: string, device: string) => Promise<void>;
    cancelPrefetch: () => void;
};
/**
 * Template navigation hook
 */
export declare function useTemplateNavigation(): {
    navigate: (template: string) => void;
    back: () => string | null;
    forward: () => string | null;
    canGoBack: ComputedRef<boolean>;
    canGoForward: ComputedRef<boolean>;
    current: ComputedRef<string | null>;
    history: ComputedRef<string[]>;
    clearHistory: () => void;
};
/**
 * Template performance monitoring hook
 */
export declare function useTemplatePerformance(): {
    markLoadStart: (templateId: string) => void;
    markLoadEnd: (templateId: string) => void;
    getLoadTime: (templateId: string) => number | null;
    getAverageLoadTime: () => number;
    clearMetrics: () => void;
    metrics: ComputedRef<Map<string, {
        readonly duration: DOMHighResTimeStamp;
        readonly entryType: string;
        readonly name: string;
        readonly startTime: DOMHighResTimeStamp;
        toJSON: () => any;
    }>>;
};
