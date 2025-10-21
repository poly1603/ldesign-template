/**
 * 模板类型安全系统
 */
import type { ComputedRef, Ref } from 'vue';
import type { Template, TemplateEvents, TemplateProps } from '../types';
/**
 * 类型定义模板
 */
export interface TypedTemplate<P extends Record<string, any> = TemplateProps, E extends Record<string, any> = TemplateEvents, S extends Record<string, any> = Record<string, any>> extends Template {
    props?: P;
    events?: E;
    slots?: S;
}
/**
 * 严格类型的模板属性
 */
export interface StrictTemplateProps {
    [key: string]: {
        type: PropType<any>;
        required?: boolean;
        default?: any;
        validator?: (value: any) => boolean;
    };
}
/**
 * 属性类型
 */
export type PropType<T> = StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor | DateConstructor | FunctionConstructor | SymbolConstructor | {
    new (...args: any[]): T;
} | T[];
/**
 * 推断属性类型
 */
export type InferPropType<T> = T extends PropType<infer U> ? U : any;
/**
 * 推断模板属性类型
 */
export type InferTemplateProps<T extends StrictTemplateProps> = {
    [K in keyof T]: InferPropType<T[K]['type']>;
};
/**
 * 类型验证器
 */
export declare class TypeValidator {
    private validators;
    /**
     * 注册验证器
     */
    register(type: string, validator: (value: any) => boolean): void;
    /**
     * 验证值
     */
    validate(value: any, type: string | PropType<any>): boolean;
    /**
     * 验证构造函数类型
     */
    private validateConstructor;
}
/**
 * 类型生成器
 */
export declare class TypeGenerator {
    /**
     * 从模板生成类型定义
     */
    generateFromTemplate(template: Template): string;
    /**
     * 批量生成类型定义
     */
    generateTypes(templates: Template[]): string;
    /**
     * 推断类型
     */
    private inferType;
    /**
     * 推断函数类型
     */
    private inferFunctionType;
    /**
     * 推断数组类型
     */
    private inferArrayType;
    /**
     * 推断对象类型
     */
    private inferObjectType;
    /**
     * 推断事件类型
     */
    private inferEventType;
    /**
     * 转换为帕斯卡命名
     */
    private toPascalCase;
}
/**
 * 类型守卫
 */
export declare class TypeGuard {
    /**
     * 是否为特定模板类型
     */
    static isTemplate<T extends Template>(template: any, type: {
        new (...args: any[]): T;
    }): template is T;
    /**
     * 是否有必需属性
     */
    static hasRequiredProps<T extends Record<string, any>>(obj: any, props: (keyof T)[]): obj is T;
    /**
     * 是否为有效的模板属性
     */
    static isValidTemplateProps<T extends TemplateProps>(props: any, schema: StrictTemplateProps): props is T;
}
/**
 * 创建类型安全的模板
 */
export declare function createTypedTemplate<P extends StrictTemplateProps, E extends Record<string, (...args: any[]) => void> = Record<string, never>, S extends Record<string, any> = Record<string, never>>(config: {
    name: string;
    props?: P;
    events?: E;
    slots?: S;
    setup?: (props: InferTemplateProps<P>) => any;
    render?: (ctx: any) => any;
}): TypedTemplate<InferTemplateProps<P>, E, S>;
/**
 * 使用类型安全的模板
 */
export declare function useTypedTemplate<T extends TypedTemplate>(template: T | Ref<T>): {
    template: ComputedRef<T>;
    props: ComputedRef<T['props']>;
    events: ComputedRef<T['events']>;
    slots: ComputedRef<T['slots']>;
    validate: (props: any) => boolean;
};
/**
 * 类型映射工具
 */
export declare class TypeMapper {
    private mappings;
    /**
     * 添加自定义映射
     */
    addMapping(from: string, to: string): void;
    /**
     * 映射类型
     */
    map(type: string): string;
    /**
     * 批量映射
     */
    mapBatch(types: Record<string, string>): Record<string, string>;
}
/**
 * 模板类型注册表
 */
export declare class TemplateTypeRegistry {
    private static instance;
    private registry;
    private schemas;
    private constructor();
    static getInstance(): TemplateTypeRegistry;
    /**
     * 注册模板类型
     */
    register<T extends TypedTemplate>(template: T, schema?: StrictTemplateProps): void;
    /**
     * 获取模板类型
     */
    get<T extends TypedTemplate>(name: string): T | undefined;
    /**
     * 获取模板schema
     */
    getSchema(name: string): StrictTemplateProps | undefined;
    /**
     * 获取所有模板类型
     */
    getAll(): TypedTemplate[];
    /**
     * 生成类型定义文件
     */
    generateTypeDefinitions(): string;
}
export declare const typeValidator: TypeValidator;
export declare const typeGenerator: TypeGenerator;
export declare const typeMapper: TypeMapper;
export declare const typeRegistry: TemplateTypeRegistry;
