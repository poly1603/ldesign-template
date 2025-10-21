/**
 * @ldesign/template - 多模板管理及动态渲染系统
 *
 * 核心特性：
 * - 自动扫描模板：使用 import.meta.glob 自动扫描所有模板
 * - 懒加载：按需加载模板组件，优化性能
 * - 类型安全：完整的 TypeScript 类型支持
 * - Vue 集成：提供 Vue 组合式函数和组件
 */
export { TemplateDevPanel, TemplateRenderer, TemplateSelector, TemplateSkeleton, TemplateVersion } from './components';
export { default as InheritableTemplate } from './components/InheritableTemplate.vue';
export { createDebugPanelData, createMiddlewareEventBus, createThemeManager, DebugLevel, EASING_FUNCTIONS, globalDebuggerManager, provideTemplateEventBus, provideTemplateTheme, templateEventBus, useAutoMigration, useDefaultTemplate, useGesture, useParallax, useScrollAnimation, useSequenceAnimation, useTemplate, useTemplateAnimation, useTemplateDebugger, useTemplateEvent, useTemplateEventBus, useTemplateEvents, useTemplateForm, useTemplateLifecycle, useTemplateList, useTemplateManager, useTemplateModel, useTemplateNavigation, useTemplatePerformance, useTemplatePrefetch, useTemplateSnapshot, useTemplateTheme, useTemplateVersion, useTimeTravel, useVersionComparison, } from './composables';
export { PRESET_THEMES, TEMPLATE_EVENTS } from './composables';
export type { AnimationConfig, DebuggerConfig, DebugLog, EasingFunction, EventHandler, EventMiddleware, EventSubscribeOptions, FieldError, FieldRules, FormOptions, FormRules, FormState, GestureConfig, ParallaxConfig, SequenceStep, SnapshotOptions, TemplateEventBus, TemplateEventType, TemplateHookResult, TemplateLifecycle, TemplatePrefetchOptions, TemplateSnapshot, TemplateStateSnapshot, TemplateTheme, ThemeContext, TimeTravel, UseTemplateVersionOptions, ValidationRule, VersionState } from './composables';
export { type TemplateInheritanceContext, useTemplateBlocks, useTemplateInheritance, type UseTemplateInheritanceOptions, useTemplateMixins } from './composables/useTemplateInheritance';
export { createTemplateManager, getLoader, getManager, getScanner, loadTemplate, preloadTemplate, scanTemplates, TemplateLoader, TemplateManager, TemplateScanner, } from './core';
export { getManager as default } from './core';
export { blockManager, createInheritableTemplate, createTemplateMixin, inheritanceManager, type MergeStrategy, registerBaseTemplate, type TemplateBlock, TemplateBlockManager, type TemplateInheritanceConfig, TemplateInheritanceManager } from './core/inheritance';
export { installTemplateDirective, vTemplate } from './directives';
export { enUS, getLocale, jaJP, locales, supportedLocales, zhCN } from './locales';
export type { LocaleKey, TemplateLocale } from './locales';
export { createTemplatePlugin, type TemplatePlugin, type TemplatePluginOptions, TemplatePluginSymbol, useTemplatePlugin, } from './plugin';
export type * from './types';
export { createErrorBoundary, ErrorRecoveryManager, globalErrorHandler, GlobalTemplateErrorHandler, TemplateError, TemplateErrorType } from './utils';
export type { ErrorRecoveryStrategy } from './utils';
