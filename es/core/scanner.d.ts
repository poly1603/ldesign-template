/**
 * 模板扫描器 - 使用 import.meta.glob 动态扫描模板
 */
import type { TemplateMetadata, TemplateRegistryItem, TemplateScanResult } from '../types';
/**
 * 模板扫描器类 - 内存优化版本
 */
export declare class TemplateScanner {
    private configModules;
    private componentModules;
    private registry;
    private scanCache;
    static readonly PATH_REGEX: RegExp;
    static readonly CONFIG_REPLACE_REGEX: RegExp;
    /**
     * 扫描所有模板
     *
     * 关键点：
     * 1. 使用 import.meta.glob 的 eager 模式同步加载所有配置
     * 2. 使用普通模式（懒加载）加载组件
     * 3. 支持 .ts 和 .js 配置文件（开发和生产环境）
     * 4. 支持 .vue 文件（开发环境）和 .vue.js 文件（打包后）
     */
    scan(): Promise<TemplateScanResult>;
    /**
     * 获取注册表
     */
    getRegistry(): Map<string, TemplateRegistryItem>;
    /**
     * 根据键获取模板
     */
    getTemplate(category: string, device: string, name: string): TemplateRegistryItem | undefined;
    /**
     * 获取所有模板元数据
     */
    getAllMetadata(): TemplateMetadata[];
}
/**
 * 获取全局扫描器实例
 */
export declare function getScanner(): TemplateScanner;
/**
 * 扫描所有模板（便捷方法）
 */
export declare function scanTemplates(): Promise<TemplateScanResult>;
