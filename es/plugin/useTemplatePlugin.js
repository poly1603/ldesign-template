/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { inject } from 'vue';
import { TemplatePluginSymbol } from './createPlugin.js';

function useTemplatePlugin() {
  const plugin = inject(TemplatePluginSymbol, null);
  if (!plugin && import.meta.env.DEV) {
    console.warn("[Template Plugin] useTemplatePlugin() called without plugin installed.\nMake sure you have called app.use(templatePlugin) before using this composable.");
  }
  return plugin;
}

export { useTemplatePlugin as default, useTemplatePlugin };
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=useTemplatePlugin.js.map
