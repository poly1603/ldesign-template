/*!
 * ***********************************
 * @ldesign/template v0.1.0        *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:53 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import './components/TemplateDevPanel.vue.js';
import './components/TemplateRenderer.vue.js';
import './components/TemplateSelector.vue.js';
import './components/TemplateSkeleton.vue.js';
import './components/TemplateVersion.vue.js';
import './components/InheritableTemplate.vue.js';
export { useDefaultTemplate, useTemplate, useTemplateList, useTemplateManager } from './composables/useTemplate.js';
export { EASING_FUNCTIONS, useGesture, useParallax, useScrollAnimation, useSequenceAnimation, useTemplateAnimation } from './composables/useTemplateAnimation.js';
import 'vue';
export { DebugLevel, createDebugPanelData, globalDebuggerManager, useTemplateDebugger } from './composables/useTemplateDebugger.js';
export { TEMPLATE_EVENTS, createMiddlewareEventBus, provideTemplateEventBus, templateEventBus, useTemplateEvent, useTemplateEventBus, useTemplateEvents } from './composables/useTemplateEventBus.js';
export { useTemplateForm, useTemplateModel } from './composables/useTemplateForm.js';
export { useTemplateLifecycle, useTemplateNavigation, useTemplatePerformance, useTemplatePrefetch } from './composables/useTemplateHooks.js';
export { useTemplateSnapshot, useTimeTravel } from './composables/useTemplateSnapshot.js';
export { PRESET_THEMES, createThemeManager, provideTemplateTheme, useTemplateTheme } from './composables/useTemplateTheme.js';
export { useAutoMigration, useTemplateVersion, useVersionComparison } from './composables/useTemplateVersion.js';
export { useTemplateBlocks, useTemplateInheritance, useTemplateMixins } from './composables/useTemplateInheritance.js';
export { TemplateLoader, getLoader, loadTemplate, preloadTemplate } from './core/loader.js';
export { TemplateManager, createTemplateManager, getManager as default, getManager } from './core/manager.js';
export { TemplateScanner, getScanner, scanTemplates } from './core/scanner.js';
export { TemplateBlockManager, TemplateInheritanceManager, blockManager, createInheritableTemplate, createTemplateMixin, inheritanceManager, registerBaseTemplate } from './core/inheritance.js';
export { installTemplateDirective, vTemplate } from './directives/templateDirective.js';
export { enUS, getLocale, jaJP, locales, supportedLocales, zhCN } from './locales/index.js';
export { TemplatePluginSymbol, createTemplatePlugin } from './plugin/createPlugin.js';
export { useTemplatePlugin } from './plugin/useTemplatePlugin.js';
export { ErrorRecoveryManager, GlobalTemplateErrorHandler, TemplateError, TemplateErrorType, createErrorBoundary, globalErrorHandler } from './utils/errorHandler.js';
import './utils/templateAnalytics.js';
import './utils/typeGenerator.js';
export { default as TemplateDevPanel } from './components/TemplateDevPanel.vue2.js';
export { default as TemplateRenderer } from './components/TemplateRenderer.vue2.js';
export { default as TemplateSelector } from './components/TemplateSelector.vue2.js';
export { default as TemplateSkeleton } from './components/TemplateSkeleton.vue2.js';
export { default as TemplateVersion } from './components/TemplateVersion.vue2.js';
export { default as InheritableTemplate } from './components/InheritableTemplate.vue2.js';
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
