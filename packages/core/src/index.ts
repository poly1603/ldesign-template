/**
 * @ldesign/template-core
 * 
 * 框架无关的模板管理核心库
 */

// Types
export * from './types'

// Registry
export * from './registry/TemplateRegistry'

// State Management
export * from './manager/TemplateStateManager'
export * from './manager/TemplateOrchestrator'

// Loader
export * from './loader/TemplateLoadCoordinator'

// Device
export * from './device/DeviceDetector'

// Selector
export * from './selector/TemplateSelectorLogic'

// Scanner (abstract)
export * from './scanner/TemplateScanner'
