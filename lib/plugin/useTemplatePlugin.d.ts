/**
 * @ldesign/template - Use Template Plugin
 *
 * Composable for using template plugin in Vue components
 */
import { type TemplatePlugin } from './createPlugin';
/**
 * Use template plugin
 *
 * @example
 * ```vue
 * <script setup>
 * import { useTemplatePlugin } from '@ldesign/template/plugin'
 *
 * const template = useTemplatePlugin()
 *
 * // Load template
 * const component = await template.loadTemplate('login', 'desktop', 'default')
 *
 * // Get default template
 * const defaultTemplate = await template.getDefaultTemplate('login', 'desktop')
 *
 * // Detect device
 * const device = template.detectDevice()
 * </script>
 * ```
 */
export declare function useTemplatePlugin(): TemplatePlugin | null;
/**
 * Default export
 */
export default useTemplatePlugin;
