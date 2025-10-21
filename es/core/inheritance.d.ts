/**
 * 模板继承与组合系统
 */
import type { Component, VNode } from 'vue';
import type { Template } from '../types';
/**
 * 模板继承配置
 */
export interface TemplateInheritanceConfig {
    /**
     * 父模板
     */
    extends?: Template | string;
    /**
     * 混入模板列表
     */
    mixins?: (Template | string)[];
    /**
     * 合并策略
     */
    mergeStrategy?: MergeStrategy;
    /**
     * 是否允许覆盖
     */
    allowOverride?: boolean;
    /**
     * 继承深度限制
     */
    maxDepth?: number;
}
/**
 * 合并策略
 */
export interface MergeStrategy {
    /**
     * 数据合并策略
     */
    data?: 'merge' | 'replace' | 'concat' | ((parent: any, child: any) => any);
    /**
     * 样式合并策略
     */
    styles?: 'merge' | 'replace' | 'append' | ((parent: any, child: any) => any);
    /**
     * 组件合并策略
     */
    components?: 'merge' | 'replace' | ((parent: any, child: any) => any);
    /**
     * 插槽合并策略
     */
    slots?: 'merge' | 'replace' | 'prepend' | 'append' | ((parent: any, child: any) => any);
    /**
     * 事件合并策略
     */
    events?: 'merge' | 'replace' | 'chain' | ((parent: any, child: any) => any);
    /**
     * 属性合并策略
     */
    props?: 'merge' | 'replace' | ((parent: any, child: any) => any);
}
/**
 * 模板块定义
 */
export interface TemplateBlock {
    /**
     * 块名称
     */
    name: string;
    /**
     * 块内容
     */
    content: VNode | Component | string;
    /**
     * 是否可覆盖
     */
    overridable?: boolean;
    /**
     * 优先级
     */
    priority?: number;
}
/**
 * 模板继承管理器
 */
export declare class TemplateInheritanceManager {
    private templates;
    private inheritanceCache;
    private mixinCache;
    private cacheKeyMap;
    private readonly MAX_TEMPLATES;
    private readonly MAX_MIXINS;
    private readonly MAX_CACHE_KEYS;
    private cleanupTimer;
    /**
     * 注册模板
     */
    registerTemplate(id: string, template: Template): void;
    /**
     * 获取模板
     */
    getTemplate(id: string): Template | undefined;
    /**
     * 扩展模板
     */
    extendTemplate(child: Template, config: TemplateInheritanceConfig): Template;
    /**
     * 创建混入
     */
    createMixin(id: string, mixin: Partial<Template>): void;
    /**
     * 获取混入
     */
    getMixin(id: string): Partial<Template> | undefined;
    /**
     * 合并模板
     */
    private mergeTemplates;
    /**
     * 合并配置
     */
    private mergeConfig;
    /**
     * 合并组件
     */
    private mergeComponents;
    /**
     * 合并样式
     */
    private mergeStyles;
    /**
     * 合并数据
     */
    private mergeData;
    /**
     * 解析模板
     */
    private resolveTemplate;
    /**
     * 获取缓存键
     */
    private getCacheKey;
    /**
     * 清除缓存
     */
    private clearCache;
    /**
     * 清理所有数据
     */
    dispose(): void;
}
/**
 * 模板块管理器
 */
export declare class TemplateBlockManager {
    private blocks;
    /**
     * 定义块
     */
    defineBlock(templateId: string, block: TemplateBlock): void;
    /**
     * 获取块
     */
    getBlock(templateId: string, blockName: string): TemplateBlock | undefined;
    /**
     * 覆盖块
     */
    overrideBlock(templateId: string, blockName: string, content: VNode | Component | string): boolean;
    /**
     * 渲染块
     */
    renderBlock(templateId: string, blockName: string): VNode | null;
    /**
     * 获取所有块
     */
    getBlocks(templateId: string): TemplateBlock[];
    /**
     * 清除块
     */
    clearBlocks(templateId?: string): void;
}
export declare const inheritanceManager: TemplateInheritanceManager;
export declare const blockManager: TemplateBlockManager;
/**
 * 创建可继承模板
 */
export declare function createInheritableTemplate(template: Template, config?: TemplateInheritanceConfig): Template;
/**
 * 创建模板混入
 */
export declare function createTemplateMixin(id: string, mixin: Partial<Template>): void;
/**
 * 注册基础模板
 */
export declare function registerBaseTemplate(id: string, template: Template): void;
