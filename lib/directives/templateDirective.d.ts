/**
 * Vue Directive for Template Rendering
 *
 * Provides v-template directive as an alternative way to use templates
 *
 * Usage:
 * ```vue
 * <div v-template="{ category: 'login', device: 'desktop', name: 'default' }"></div>
 * <div v-template:login.desktop.default></div>
 * <div v-template:login="{ device: 'mobile', name: 'card' }"></div>
 * ```
 */
import type { App, DirectiveBinding, VNode } from 'vue';
/**
 * Template directive definition
 */
export declare const vTemplate: {
    mounted(el: Element, binding: DirectiveBinding, _vnode: VNode): void;
    updated(el: Element, binding: DirectiveBinding): void;
    unmounted(el: Element): void;
};
/**
 * Install directive plugin
 */
export declare function installTemplateDirective(app: App): void;
/**
 * Export for manual use
 */
export default vTemplate;
