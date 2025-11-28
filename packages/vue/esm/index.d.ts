/**
 * @ldesign/template-vue
 * Vue 3 模板管理系统
 */
export type { DeviceType, TemplateMetadata, TemplateConfig, } from '@ldesign/template-core';
export { TemplateScanner, createTemplateScanner } from './scanner';
export { createTemplatePlugin, type TemplatePluginOptions } from './plugin';
export { useTemplate, useTemplateList, type UseTemplateReturn, type UseTemplateListReturn, } from './composables';
export { TemplateRenderer, TemplateSelector } from './components';
export { createTemplatePlugin as default } from './plugin';
//# sourceMappingURL=index.d.ts.map