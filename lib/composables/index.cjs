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

var useTemplate = require('./useTemplate.cjs');
var useTemplateAnimation = require('./useTemplateAnimation.cjs');
var useTemplateCondition = require('./useTemplateCondition.cjs');
var useTemplateDebugger = require('./useTemplateDebugger.cjs');
var useTemplateEventBus = require('./useTemplateEventBus.cjs');
var useTemplateForm = require('./useTemplateForm.cjs');
var useTemplateHooks = require('./useTemplateHooks.cjs');
var useTemplateSnapshot = require('./useTemplateSnapshot.cjs');
var useTemplateTheme = require('./useTemplateTheme.cjs');
var useTemplateVersion = require('./useTemplateVersion.cjs');



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
exports.TEMPLATE_CONDITIONS = useTemplateCondition.TEMPLATE_CONDITIONS;
exports.createABTest = useTemplateCondition.createABTest;
exports.useTemplateABTest = useTemplateCondition.useTemplateABTest;
exports.useTemplateCondition = useTemplateCondition.useTemplateCondition;
Object.defineProperty(exports, "DebugLevel", {
	enumerable: true,
	get: function () { return useTemplateDebugger.DebugLevel; }
});
exports.createDebugPanelData = useTemplateDebugger.createDebugPanelData;
exports.globalDebuggerManager = useTemplateDebugger.globalDebuggerManager;
exports.useTemplateDebugger = useTemplateDebugger.useTemplateDebugger;
exports.MiddlewareEventBus = useTemplateEventBus.MiddlewareEventBus;
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
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
