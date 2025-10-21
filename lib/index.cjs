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

require('./components/TemplateDevPanel.vue.cjs');
require('./components/TemplateRenderer.vue.cjs');
require('./components/TemplateSelector.vue.cjs');
require('./components/TemplateSkeleton.vue.cjs');
require('./components/TemplateVersion.vue.cjs');
require('./components/InheritableTemplate.vue.cjs');
var useTemplate = require('./composables/useTemplate.cjs');
var useTemplateAnimation = require('./composables/useTemplateAnimation.cjs');
require('vue');
var useTemplateDebugger = require('./composables/useTemplateDebugger.cjs');
var useTemplateEventBus = require('./composables/useTemplateEventBus.cjs');
var useTemplateForm = require('./composables/useTemplateForm.cjs');
var useTemplateHooks = require('./composables/useTemplateHooks.cjs');
var useTemplateSnapshot = require('./composables/useTemplateSnapshot.cjs');
var useTemplateTheme = require('./composables/useTemplateTheme.cjs');
var useTemplateVersion = require('./composables/useTemplateVersion.cjs');
var useTemplateInheritance = require('./composables/useTemplateInheritance.cjs');
var loader = require('./core/loader.cjs');
var manager = require('./core/manager.cjs');
var scanner = require('./core/scanner.cjs');
var inheritance = require('./core/inheritance.cjs');
var templateDirective = require('./directives/templateDirective.cjs');
var index = require('./locales/index.cjs');
var createPlugin = require('./plugin/createPlugin.cjs');
var useTemplatePlugin = require('./plugin/useTemplatePlugin.cjs');
var errorHandler = require('./utils/errorHandler.cjs');
require('./utils/templateAnalytics.cjs');
require('./utils/typeGenerator.cjs');
var TemplateDevPanel_vue_vue_type_script_setup_true_lang = require('./components/TemplateDevPanel.vue2.cjs');
var TemplateRenderer_vue_vue_type_script_setup_true_lang = require('./components/TemplateRenderer.vue2.cjs');
var TemplateSelector_vue_vue_type_script_setup_true_lang = require('./components/TemplateSelector.vue2.cjs');
var TemplateSkeleton_vue_vue_type_script_setup_true_lang = require('./components/TemplateSkeleton.vue2.cjs');
var TemplateVersion_vue_vue_type_script_setup_true_lang = require('./components/TemplateVersion.vue2.cjs');
var InheritableTemplate_vue_vue_type_script_setup_true_lang = require('./components/InheritableTemplate.vue2.cjs');



exports.useDefaultTemplate = useTemplate.useDefaultTemplate;
exports.useTemplate = useTemplate.useTemplate;
exports.useTemplateList = useTemplate.useTemplateList;
exports.useTemplateManager = useTemplate.useTemplateManager;
exports.EASING_FUNCTIONS = useTemplateAnimation.EASING_FUNCTIONS;
exports.useGesture = useTemplateAnimation.useGesture;
exports.useParallax = useTemplateAnimation.useParallax;
exports.useScrollAnimation = useTemplateAnimation.useScrollAnimation;
exports.useSequenceAnimation = useTemplateAnimation.useSequenceAnimation;
exports.useTemplateAnimation = useTemplateAnimation.useTemplateAnimation;
Object.defineProperty(exports, "DebugLevel", {
	enumerable: true,
	get: function () { return useTemplateDebugger.DebugLevel; }
});
exports.createDebugPanelData = useTemplateDebugger.createDebugPanelData;
exports.globalDebuggerManager = useTemplateDebugger.globalDebuggerManager;
exports.useTemplateDebugger = useTemplateDebugger.useTemplateDebugger;
exports.TEMPLATE_EVENTS = useTemplateEventBus.TEMPLATE_EVENTS;
exports.createMiddlewareEventBus = useTemplateEventBus.createMiddlewareEventBus;
exports.provideTemplateEventBus = useTemplateEventBus.provideTemplateEventBus;
exports.templateEventBus = useTemplateEventBus.templateEventBus;
exports.useTemplateEvent = useTemplateEventBus.useTemplateEvent;
exports.useTemplateEventBus = useTemplateEventBus.useTemplateEventBus;
exports.useTemplateEvents = useTemplateEventBus.useTemplateEvents;
exports.useTemplateForm = useTemplateForm.useTemplateForm;
exports.useTemplateModel = useTemplateForm.useTemplateModel;
exports.useTemplateLifecycle = useTemplateHooks.useTemplateLifecycle;
exports.useTemplateNavigation = useTemplateHooks.useTemplateNavigation;
exports.useTemplatePerformance = useTemplateHooks.useTemplatePerformance;
exports.useTemplatePrefetch = useTemplateHooks.useTemplatePrefetch;
exports.useTemplateSnapshot = useTemplateSnapshot.useTemplateSnapshot;
exports.useTimeTravel = useTemplateSnapshot.useTimeTravel;
exports.PRESET_THEMES = useTemplateTheme.PRESET_THEMES;
exports.createThemeManager = useTemplateTheme.createThemeManager;
exports.provideTemplateTheme = useTemplateTheme.provideTemplateTheme;
exports.useTemplateTheme = useTemplateTheme.useTemplateTheme;
exports.useAutoMigration = useTemplateVersion.useAutoMigration;
exports.useTemplateVersion = useTemplateVersion.useTemplateVersion;
exports.useVersionComparison = useTemplateVersion.useVersionComparison;
exports.useTemplateBlocks = useTemplateInheritance.useTemplateBlocks;
exports.useTemplateInheritance = useTemplateInheritance.useTemplateInheritance;
exports.useTemplateMixins = useTemplateInheritance.useTemplateMixins;
exports.TemplateLoader = loader.TemplateLoader;
exports.getLoader = loader.getLoader;
exports.loadTemplate = loader.loadTemplate;
exports.preloadTemplate = loader.preloadTemplate;
exports.TemplateManager = manager.TemplateManager;
exports.createTemplateManager = manager.createTemplateManager;
exports.default = manager.getManager;
exports.getManager = manager.getManager;
exports.TemplateScanner = scanner.TemplateScanner;
exports.getScanner = scanner.getScanner;
exports.scanTemplates = scanner.scanTemplates;
exports.TemplateBlockManager = inheritance.TemplateBlockManager;
exports.TemplateInheritanceManager = inheritance.TemplateInheritanceManager;
exports.blockManager = inheritance.blockManager;
exports.createInheritableTemplate = inheritance.createInheritableTemplate;
exports.createTemplateMixin = inheritance.createTemplateMixin;
exports.inheritanceManager = inheritance.inheritanceManager;
exports.registerBaseTemplate = inheritance.registerBaseTemplate;
exports.installTemplateDirective = templateDirective.installTemplateDirective;
exports.vTemplate = templateDirective.vTemplate;
exports.enUS = index.enUS;
exports.getLocale = index.getLocale;
exports.jaJP = index.jaJP;
exports.locales = index.locales;
exports.supportedLocales = index.supportedLocales;
exports.zhCN = index.zhCN;
exports.TemplatePluginSymbol = createPlugin.TemplatePluginSymbol;
exports.createTemplatePlugin = createPlugin.createTemplatePlugin;
exports.useTemplatePlugin = useTemplatePlugin.useTemplatePlugin;
exports.ErrorRecoveryManager = errorHandler.ErrorRecoveryManager;
exports.GlobalTemplateErrorHandler = errorHandler.GlobalTemplateErrorHandler;
exports.TemplateError = errorHandler.TemplateError;
Object.defineProperty(exports, "TemplateErrorType", {
	enumerable: true,
	get: function () { return errorHandler.TemplateErrorType; }
});
exports.createErrorBoundary = errorHandler.createErrorBoundary;
exports.globalErrorHandler = errorHandler.globalErrorHandler;
exports.TemplateDevPanel = TemplateDevPanel_vue_vue_type_script_setup_true_lang.default;
exports.TemplateRenderer = TemplateRenderer_vue_vue_type_script_setup_true_lang.default;
exports.TemplateSelector = TemplateSelector_vue_vue_type_script_setup_true_lang.default;
exports.TemplateSkeleton = TemplateSkeleton_vue_vue_type_script_setup_true_lang.default;
exports.TemplateVersion = TemplateVersion_vue_vue_type_script_setup_true_lang.default;
exports.InheritableTemplate = InheritableTemplate_vue_vue_type_script_setup_true_lang.default;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
