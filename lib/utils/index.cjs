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

var errorHandler = require('./errorHandler.cjs');
var helpers = require('./helpers.cjs');
var templateAnalytics = require('./templateAnalytics.cjs');
var typeGenerator = require('./typeGenerator.cjs');



exports.ErrorRecoveryManager = errorHandler.ErrorRecoveryManager;
exports.GlobalTemplateErrorHandler = errorHandler.GlobalTemplateErrorHandler;
exports.TemplateError = errorHandler.TemplateError;
Object.defineProperty(exports, "TemplateErrorType", {
	enumerable: true,
	get: function () { return errorHandler.TemplateErrorType; }
});
exports.createErrorBoundary = errorHandler.createErrorBoundary;
exports.defaultRecoveryStrategies = errorHandler.defaultRecoveryStrategies;
exports.globalErrorHandler = errorHandler.globalErrorHandler;
exports.arrayToObject = helpers.arrayToObject;
exports.debounce = helpers.debounce;
exports.deepClone = helpers.deepClone;
exports.deepMerge = helpers.deepMerge;
exports.formatBytes = helpers.formatBytes;
exports.generateId = helpers.generateId;
exports.get = helpers.get;
exports.groupBy = helpers.groupBy;
exports.isEmpty = helpers.isEmpty;
exports.isObject = helpers.isObject;
exports.omit = helpers.omit;
exports.pick = helpers.pick;
exports.retry = helpers.retry;
exports.set = helpers.set;
exports.sleep = helpers.sleep;
exports.throttle = helpers.throttle;
exports.unset = helpers.unset;
exports.TemplateAnalytics = templateAnalytics.TemplateAnalytics;
exports.globalAnalytics = templateAnalytics.globalAnalytics;
exports.useTemplateAnalytics = templateAnalytics.useTemplateAnalytics;
exports.withPerformanceTracking = templateAnalytics.withPerformanceTracking;
exports.TemplateTypeGenerator = typeGenerator.TemplateTypeGenerator;
exports.generateJSONSchema = typeGenerator.generateJSONSchema;
exports.generateTypeDeclarationFile = typeGenerator.generateTypeDeclarationFile;
exports.generateTypeGuard = typeGenerator.generateTypeGuard;
exports.generateTypeScriptInterface = typeGenerator.generateTypeScriptInterface;
exports.inferTypeFromComponent = typeGenerator.inferTypeFromComponent;
exports.typeGenerator = typeGenerator.typeGenerator;
exports.validateComponentProps = typeGenerator.validateComponentProps;
/*! End of @ldesign/template | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
