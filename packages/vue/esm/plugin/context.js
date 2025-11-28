/*!
 * ***********************************
 * @ldesign/template-vue v1.0.0    *
 * Built with rollup               *
 * Build time: 2024-11-28 22:27:14 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
let globalManager = null;
function setTemplateManager(manager) {
  globalManager = manager;
}
function getTemplateManager() {
  if (!globalManager) {
    throw new Error("\u6A21\u677F\u7BA1\u7406\u5668\u672A\u521D\u59CB\u5316\u3002\u8BF7\u786E\u4FDD\u5DF2\u5B89\u88C5 TemplatePlugin: app.use(createTemplatePlugin())");
  }
  return globalManager;
}
function hasTemplateManager() {
  return globalManager !== null;
}

export { getTemplateManager, hasTemplateManager, setTemplateManager };
/*! End of @ldesign/template-vue | Powered by @ldesign/builder */
//# sourceMappingURL=context.js.map
