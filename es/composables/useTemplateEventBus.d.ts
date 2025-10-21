/**
 * 模板事件总线系统
 *
 * 提供模板间的通信机制
 */
/**
 * 事件处理器类型
 */
export type EventHandler<T = any> = (payload: T) => void | Promise<void>;
/**
 * 事件订阅选项
 */
export interface EventSubscribeOptions {
    once?: boolean;
    priority?: number;
    filter?: (payload: any) => boolean;
}
/**
 * 事件总线接口
 */
export interface TemplateEventBus {
    emit: <T = any>(event: string, payload?: T) => Promise<void>;
    on: <T = any>(event: string, handler: EventHandler<T>, options?: EventSubscribeOptions) => () => void;
    off: (event: string, handler?: EventHandler) => void;
    once: <T = any>(event: string, handler: EventHandler<T>) => () => void;
    clear: (event?: string) => void;
    hasListeners: (event: string) => boolean;
    getEvents: () => string[];
}
/**
 * 全局事件总线
 */
declare class GlobalEventBus implements TemplateEventBus {
    private events;
    private eventHistory;
    private maxHistorySize;
    private idCounter;
    private componentSubscriptions;
    /**
     * 发送事件
     */
    emit<T = any>(event: string, payload?: T): Promise<void>;
    /**
     * 监听事件
     */
    on<T = any>(event: string, handler: EventHandler<T>, options?: EventSubscribeOptions): () => void;
    /**
     * 取消监听
     */
    off(event: string, handler?: EventHandler): void;
    /**
     * 监听一次
     */
    once<T = any>(event: string, handler: EventHandler<T>): () => void;
    /**
     * 清空事件
     */
    clear(event?: string): void;
    /**
     * 检查是否有监听器
     */
    hasListeners(event: string): boolean;
    /**
     * 获取所有事件名
     */
    getEvents(): string[];
    /**
     * 记录事件历史
     */
    private recordHistory;
    /**
     * 获取事件历史
     */
    getHistory(event: string): any[];
}
/**
 * 使用模板事件总线
 */
export declare function useTemplateEventBus(isolated?: boolean): TemplateEventBus;
/**
 * 提供事件总线
 */
export declare function provideTemplateEventBus(): TemplateEventBus;
/**
 * 预定义的事件类型
 */
export declare const TEMPLATE_EVENTS: {
    readonly TEMPLATE_LOAD: "template:load";
    readonly TEMPLATE_LOADED: "template:loaded";
    readonly TEMPLATE_ERROR: "template:error";
    readonly TEMPLATE_UNLOAD: "template:unload";
    readonly TEMPLATE_CHANGE: "template:change";
    readonly TEMPLATE_SWITCH: "template:switch";
    readonly DEVICE_CHANGE: "device:change";
    readonly THEME_CHANGE: "theme:change";
    readonly FORM_SUBMIT: "form:submit";
    readonly FORM_RESET: "form:reset";
    readonly FORM_VALIDATE: "form:validate";
    readonly FORM_SAVE: "form:save";
    readonly NAVIGATE_TO: "navigate:to";
    readonly NAVIGATE_BACK: "navigate:back";
    readonly NAVIGATE_FORWARD: "navigate:forward";
    readonly USER_LOGIN: "user:login";
    readonly USER_LOGOUT: "user:logout";
    readonly USER_ACTION: "user:action";
    readonly DATA_UPDATE: "data:update";
    readonly DATA_DELETE: "data:delete";
    readonly DATA_CREATE: "data:create";
};
/**
 * 事件类型
 */
export type TemplateEventType = typeof TEMPLATE_EVENTS[keyof typeof TEMPLATE_EVENTS];
/**
 * 使用特定事件
 */
export declare function useTemplateEvent<T = any>(event: string | TemplateEventType, handler?: EventHandler<T>, options?: EventSubscribeOptions): {
    emit: (payload?: T) => Promise<void>;
    on: (h: EventHandler<T>, opts?: EventSubscribeOptions) => () => void;
    once: (h: EventHandler<T>) => () => void;
    off: (h?: EventHandler) => void;
    hasListeners: () => boolean;
};
/**
 * 批量事件处理
 */
export declare function useTemplateEvents(events: Record<string, EventHandler>): TemplateEventBus;
/**
 * 事件中间件
 */
export type EventMiddleware = (event: string, payload: any, next: () => Promise<void>) => void | Promise<void>;
/**
 * 带中间件的事件总线
 */
export declare class MiddlewareEventBus extends GlobalEventBus {
    private middlewares;
    /**
     * 添加中间件
     */
    use(middleware: EventMiddleware): void;
    /**
     * 发送事件（通过中间件）
     */
    emit<T = any>(event: string, payload?: T): Promise<void>;
}
/**
 * 创建带中间件的事件总线
 */
export declare function createMiddlewareEventBus(): MiddlewareEventBus;
export declare const templateEventBus: GlobalEventBus;
export {};
