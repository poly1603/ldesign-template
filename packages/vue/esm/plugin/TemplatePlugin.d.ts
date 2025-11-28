import type { Plugin } from 'vue';
import type { TemplateMetadata } from '@ldesign/template-core';
/**
 * 模板插件选项
 */
export interface TemplatePluginOptions {
    /**
     * 是否自动扫描模板
     * @default true
     */
    autoScan?: boolean;
    /**
     * 初始模板列表
     */
    templates?: TemplateMetadata[];
    /**
     * 是否启用调试模式
     * @default false
     */
    debug?: boolean;
}
/**
 * 创建模板插件
 */
export declare function createTemplatePlugin(options?: TemplatePluginOptions): Plugin;
//# sourceMappingURL=TemplatePlugin.d.ts.map