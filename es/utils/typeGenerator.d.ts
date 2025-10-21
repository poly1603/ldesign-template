import type { Component } from 'vue';
import type { TemplateMetadata } from '../types';
/**
 * 模板类型定义
 */
export interface TemplateTypeDefinition {
    name: string;
    props?: Record<string, PropTypeDefinition>;
    emits?: Record<string, EmitTypeDefinition>;
    slots?: Record<string, SlotTypeDefinition>;
    metadata?: TemplateMetadata;
}
/**
 * 属性类型定义
 */
export interface PropTypeDefinition {
    type: string | string[];
    required?: boolean;
    default?: any;
    validator?: string;
    description?: string;
}
/**
 * 事件类型定义
 */
export interface EmitTypeDefinition {
    payload?: string;
    description?: string;
}
/**
 * 插槽类型定义
 */
export interface SlotTypeDefinition {
    props?: Record<string, string>;
    description?: string;
}
/**
 * 类型生成选项
 */
export interface TypeGeneratorOptions {
    outputPath?: string;
    moduleFormat?: 'es' | 'cjs';
    includeComments?: boolean;
    generateDTS?: boolean;
    strict?: boolean;
}
/**
 * 从组件推断类型
 */
export declare function inferTypeFromComponent(component: Component): TemplateTypeDefinition;
/**
 * 生成 TypeScript 接口
 */
export declare function generateTypeScriptInterface(definition: TemplateTypeDefinition, options?: TypeGeneratorOptions): string;
/**
 * 生成完整的类型声明文件
 */
export declare function generateTypeDeclarationFile(definitions: TemplateTypeDefinition[], options?: TypeGeneratorOptions): string;
/**
 * 验证组件属性类型
 */
export declare function validateComponentProps<T extends Record<string, any>>(props: T, definition: TemplateTypeDefinition, strict?: boolean): {
    valid: boolean;
    errors: string[];
};
/**
 * 生成运行时类型守卫
 */
export declare function generateTypeGuard(definition: TemplateTypeDefinition): string;
/**
 * 从模板定义生成 JSON Schema
 */
export declare function generateJSONSchema(definition: TemplateTypeDefinition): object;
/**
 * 类型生成器类
 */
export declare class TemplateTypeGenerator {
    private definitions;
    private maxDefinitions;
    /**
     * 注册模板定义
     */
    register(definition: TemplateTypeDefinition): void;
    /**
     * 从组件注册
     */
    registerComponent(component: Component): void;
    /**
     * 获取定义
     */
    getDefinition(name: string): TemplateTypeDefinition | undefined;
    /**
     * 获取所有定义
     */
    getAllDefinitions(): TemplateTypeDefinition[];
    /**
     * 生成类型文件
     */
    generateTypes(options?: TypeGeneratorOptions): string;
    /**
     * 生成类型守卫文件
     */
    generateGuards(): string;
    /**
     * 生成 JSON Schema
     */
    generateSchemas(): Record<string, object>;
    /**
     * 清除所有定义
     */
    clear(): void;
}
export declare function getTypeGenerator(): TemplateTypeGenerator;
export declare function destroyTypeGenerator(): void;
export declare const typeGenerator: TemplateTypeGenerator;
