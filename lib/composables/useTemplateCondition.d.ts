/**
 * 条件渲染与A/B测试系统
 *
 * 根据条件自动选择模板，支持A/B测试
 */
import type { Ref } from 'vue';
import type { DeviceType } from '../types';
/**
 * 条件类型
 */
export interface TemplateCondition {
    /** 条件ID */
    id?: string;
    /** 测试函数 */
    test: (context: TemplateContext) => boolean | Promise<boolean>;
    /** 满足条件时使用的模板 */
    template: string;
    /** 权重（用于A/B测试） */
    weight?: number;
    /** 优先级（数字越大优先级越高） */
    priority?: number;
    /** 条件描述 */
    description?: string;
    /** 是否启用 */
    enabled?: boolean;
}
/**
 * 模板上下文
 */
export interface TemplateContext {
    /** 用户信息 */
    user?: {
        id?: string;
        role?: string;
        isVip?: boolean;
        isNewUser?: boolean;
        [key: string]: any;
    };
    /** 设备信息 */
    device?: {
        type?: DeviceType;
        screen?: {
            width: number;
            height: number;
        };
        userAgent?: string;
    };
    /** 时间信息 */
    time?: {
        hour?: number;
        dayOfWeek?: number;
        date?: Date;
    };
    /** 地理信息 */
    geo?: {
        country?: string;
        region?: string;
        city?: string;
        language?: string;
    };
    /** 功能标记 */
    features?: Record<string, boolean>;
    /** 自定义数据 */
    custom?: Record<string, any>;
}
/**
 * A/B测试配置
 */
export interface ABTestConfig {
    /** 测试ID */
    id: string;
    /** 测试名称 */
    name?: string;
    /** 变体列表 */
    variants: ABTestVariant[];
    /** 是否启用 */
    enabled?: boolean;
    /** 流量分配策略 */
    strategy?: 'random' | 'weighted' | 'hash';
    /** 用于哈希的种子 */
    seed?: string;
    /** 开始时间 */
    startDate?: Date;
    /** 结束时间 */
    endDate?: Date;
    /** 目标指标 */
    metrics?: string[];
}
/**
 * A/B测试变体
 */
export interface ABTestVariant {
    /** 变体ID */
    id: string;
    /** 模板名称 */
    template: string;
    /** 权重 */
    weight: number;
    /** 描述 */
    description?: string;
}
/**
 * A/B测试结果
 */
export interface ABTestResult {
    /** 选中的变体 */
    variant: ABTestVariant;
    /** 测试ID */
    testId: string;
    /** 分配原因 */
    reason: string;
    /** 时间戳 */
    timestamp: number;
}
/**
 * 使用条件渲染
 */
export declare function useTemplateCondition(conditions?: TemplateCondition[], context?: Ref<TemplateContext> | TemplateContext): {
    selectedTemplate: import("vue").ComputedRef<string | null>;
    evaluating: import("vue").ComputedRef<boolean>;
    lastEvaluation: import("vue").ComputedRef<Date | null>;
    context: Ref<TemplateContext | {
        user?: {
            [x: string]: any;
            id?: string | undefined;
            role?: string | undefined;
            isVip?: boolean | undefined;
            isNewUser?: boolean | undefined;
        } | undefined;
        device?: {
            type?: DeviceType | undefined;
            screen?: {
                width: number;
                height: number;
            } | undefined;
            userAgent?: string | undefined;
        } | undefined;
        time?: {
            hour?: number | undefined;
            dayOfWeek?: number | undefined;
            date?: Date | undefined;
        } | undefined;
        geo?: {
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
            language?: string | undefined;
        } | undefined;
        features?: Record<string, boolean>
        /** 自定义数据 */
         | undefined;
        custom?: Record<string, any> | undefined;
    }, TemplateContext | Ref<TemplateContext, TemplateContext> | {
        user?: {
            [x: string]: any;
            id?: string | undefined;
            role?: string | undefined;
            isVip?: boolean | undefined;
            isNewUser?: boolean | undefined;
        } | undefined;
        device?: {
            type?: DeviceType | undefined;
            screen?: {
                width: number;
                height: number;
            } | undefined;
            userAgent?: string | undefined;
        } | undefined;
        time?: {
            hour?: number | undefined;
            dayOfWeek?: number | undefined;
            date?: Date | undefined;
        } | undefined;
        geo?: {
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
            language?: string | undefined;
        } | undefined;
        features?: Record<string, boolean>
        /** 自定义数据 */
         | undefined;
        custom?: Record<string, any> | undefined;
    }>;
    selectTemplate: () => Promise<string | null>;
    reevaluate: () => Promise<string | null>;
};
/**
 * 使用A/B测试
 */
export declare function useTemplateABTest(config: ABTestConfig, userId?: string): {
    variant: import("vue").ComputedRef<{
        id: string;
        template: string;
        weight: number;
        description?: string | undefined;
    } | null>;
    template: import("vue").ComputedRef<string | null>;
    isActive: import("vue").ComputedRef<boolean>;
    result: import("vue").ComputedRef<{
        variant: {
            id: string;
            template: string;
            weight: number;
            description?: string | undefined;
        };
        testId: string;
        reason: string;
        timestamp: number;
    } | null>;
    runTest: () => ABTestResult | null;
    trackMetric: (metric: string, value?: any) => void;
};
/**
 * 预定义条件
 */
export declare const TEMPLATE_CONDITIONS: {
    /** 新用户条件 */
    isNewUser: (template: string) => TemplateCondition;
    /** VIP用户条件 */
    isVipUser: (template: string) => TemplateCondition;
    /** 设备条件 */
    isDevice: (device: DeviceType, template: string) => TemplateCondition;
    /** 时间段条件 */
    timeRange: (startHour: number, endHour: number, template: string) => TemplateCondition;
    /** 功能标记条件 */
    hasFeature: (feature: string, template: string) => TemplateCondition;
    /** 语言条件 */
    isLanguage: (language: string, template: string) => TemplateCondition;
    /** 自定义条件 */
    custom: (test: (ctx: TemplateContext) => boolean, template: string, options?: {
        id?: string;
        description?: string;
        priority?: number;
    }) => TemplateCondition;
};
/**
 * A/B测试预设
 */
export declare function createABTest(id: string, variants: Array<{
    template: string;
    weight?: number;
}>, options?: Partial<ABTestConfig>): ABTestConfig;
