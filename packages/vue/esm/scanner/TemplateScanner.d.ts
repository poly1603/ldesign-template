import type { TemplateMetadata } from '@ldesign/template-core';
/**
 * 模板扫描器
 * 使用 import.meta.glob 自动发现和加载模板
 */
export declare class TemplateScanner {
    /**
     * 懒加载组件模块
     * eager: false 表示返回加载函数,不立即执行
     */
    private lazyComponents;
    /**
     * 即时加载配置模块
     * eager: true 表示构建时就加载
     */
    private eagerConfigs;
    constructor();
    /**
     * 扫描并生成模板元数据列表
     */
    scan(): TemplateMetadata[];
    /**
     * 获取所有组件路径
     */
    getComponentPaths(): string[];
    /**
     * 获取所有配置路径
     */
    getConfigPaths(): string[];
    /**
     * 获取扫描统计信息
     */
    getStats(): {
        componentCount: number;
        configCount: number;
        matchRate: number;
    };
}
/**
 * 创建模板扫描器实例
 */
export declare function createTemplateScanner(): TemplateScanner;
//# sourceMappingURL=TemplateScanner.d.ts.map