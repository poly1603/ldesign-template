/*!
 * ***********************************
 * @ldesign/template-vue v1.0.0    *
 * Built with rollup               *
 * Build time: 2024-11-28 22:27:14 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { TemplateRegistry, TemplateManager } from '@ldesign/template-core';
import { createTemplateScanner } from '../scanner/TemplateScanner.js';
import { setTemplateManager } from './context.js';

function createTemplatePlugin(options = {}) {
  const {
    autoScan = true,
    templates = [],
    debug = false
  } = options;
  return {
    install(app) {
      const registry = new TemplateRegistry();
      const manager = new TemplateManager(registry);
      if (autoScan) {
        try {
          const scanner = createTemplateScanner();
          const scannedTemplates = scanner.scan();
          if (debug) {
            console.log("[TemplatePlugin] \u626B\u63CF\u5230\u7684\u6A21\u677F:", scannedTemplates);
            console.log("[TemplatePlugin] \u626B\u63CF\u7EDF\u8BA1:", scanner.getStats());
          }
          registry.registerBatch(scannedTemplates);
        } catch (error) {
          console.error("[TemplatePlugin] \u6A21\u677F\u626B\u63CF\u5931\u8D25:", error);
        }
      }
      if (templates.length > 0) {
        registry.registerBatch(templates);
        if (debug) {
          console.log("[TemplatePlugin] \u6CE8\u518C\u9884\u5B9A\u4E49\u6A21\u677F:", templates.length);
        }
      }
      setTemplateManager(manager);
      app.provide("templateManager", manager);
      app.config.globalProperties.$templates = manager;
      if (debug) {
        console.log("[TemplatePlugin] \u63D2\u4EF6\u5DF2\u5B89\u88C5");
        console.log("[TemplatePlugin] \u603B\u6A21\u677F\u6570:", manager.getTemplateCount());
      }
    }
  };
}

export { createTemplatePlugin };
/*! End of @ldesign/template-vue | Powered by @ldesign/builder */
//# sourceMappingURL=TemplatePlugin.js.map
