/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var createPlugin = require('./createPlugin.cjs');

function useTemplatePlugin() {
  const plugin = vue.inject(createPlugin.TemplatePluginSymbol, null);
  if (!plugin && undefined.DEV) {
    console.warn("[Template Plugin] useTemplatePlugin() called without plugin installed.\nMake sure you have called app.use(templatePlugin) before using this composable.");
  }
  return plugin;
}

exports.default = useTemplatePlugin;
exports.useTemplatePlugin = useTemplatePlugin;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplatePlugin.cjs.map
