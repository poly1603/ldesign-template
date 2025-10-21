/**
 * Enhanced Error Handling System
 *
 * Comprehensive error boundaries and recovery mechanisms
 */
import type { Component } from 'vue';
/**
 * Template error types
 */
export declare enum TemplateErrorType {
    LOAD_ERROR = "LOAD_ERROR",
    NOT_FOUND = "NOT_FOUND",
    NETWORK_ERROR = "NETWORK_ERROR",
    PARSE_ERROR = "PARSE_ERROR",
    TIMEOUT = "TIMEOUT",
    PERMISSION_DENIED = "PERMISSION_DENIED",
    UNKNOWN = "UNKNOWN"
}
/**
 * Template error class with enhanced details
 */
export declare class TemplateError extends Error {
    readonly type: TemplateErrorType;
    readonly code: string;
    readonly details?: Record<string, any>;
    readonly retryable: boolean;
    readonly timestamp: Date;
    readonly context?: {
        category?: string;
        device?: string;
        template?: string;
        [key: string]: any;
    };
    constructor(message: string, type?: TemplateErrorType, options?: {
        code?: string;
        details?: Record<string, any>;
        retryable?: boolean;
        context?: Record<string, any>;
        cause?: Error;
    });
    /**
     * Get user-friendly error message
     */
    getUserMessage(): string;
    /**
     * Get recovery suggestions
     */
    getRecoverySuggestions(): string[];
    /**
     * Convert to plain object for serialization
     */
    toJSON(): Record<string, any>;
}
/**
 * Error recovery strategies
 */
export interface ErrorRecoveryStrategy {
    canRecover: (error: TemplateError) => boolean;
    recover: (error: TemplateError) => Promise<void>;
    priority: number;
}
/**
 * Default recovery strategies
 */
export declare const defaultRecoveryStrategies: ErrorRecoveryStrategy[];
/**
 * Error recovery manager
 */
export declare class ErrorRecoveryManager {
    private strategies;
    private retryCount;
    private readonly maxRetries;
    private retryCleanupTimer;
    constructor(strategies?: ErrorRecoveryStrategy[]);
    /**
     * Add recovery strategy
     */
    addStrategy(strategy: ErrorRecoveryStrategy): void;
    /**
     * Attempt to recover from error
     */
    recover(error: TemplateError): Promise<boolean>;
    /**
     * Reset retry count
     */
    resetRetryCount(error?: TemplateError): void;
    /**
     * Schedule cleanup of old retry counts
     */
    private scheduleRetryCleanup;
    /**
     * Dispose the recovery manager
     */
    dispose(): void;
}
/**
 * Create error boundary component
 */
export declare function createErrorBoundary(options?: {
    onError?: (error: TemplateError) => void;
    fallback?: Component;
    recovery?: ErrorRecoveryManager;
}): import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    tag: {
        type: StringConstructor;
        default: string;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    tag: {
        type: StringConstructor;
        default: string;
    };
}>> & Readonly<{}>, {
    tag: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
/**
 * Global error handler
 */
export declare class GlobalTemplateErrorHandler {
    private static instance;
    private errorLog;
    private readonly maxLogSize;
    private listeners;
    private listenerRefs;
    private disposed;
    private constructor();
    static getInstance(): GlobalTemplateErrorHandler;
    /**
     * Log error
     */
    logError(error: TemplateError): void;
    /**
     * Get error log
     */
    getErrorLog(): TemplateError[];
    /**
     * Clear error log
     */
    clearErrorLog(): void;
    /**
     * Subscribe to errors
     */
    subscribe(listener: (error: TemplateError) => void): () => void;
    /**
     * Notify all active listeners
     */
    private notifyListeners;
    /**
     * Send error to remote logging service
     */
    private sendToRemote;
    /**
     * Get error statistics
     */
    getStatistics(): {
        total: number;
        byType: Record<TemplateErrorType, number>;
        retryable: number;
        recent: TemplateError[];
    };
    /**
     * Destroy the singleton instance
     */
    static destroy(): void;
}
export declare const globalErrorHandler: GlobalTemplateErrorHandler;
export * from './memoryLeakDetector';
export * from './objectPool';
