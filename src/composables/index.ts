/**
 * 组合式函数导出
 */

export { useTemplate } from './use-template'
export { useDeviceDetector } from './use-device-detector'
export { useStorage, useReactiveStorage } from './use-storage'
export { useTemplateCache } from './use-template-cache'

// 重新导出类型
export type {
  UseTemplateReturn,
  UseDeviceDetectorReturn,
  UseStorageReturn,
  UseTemplateCacheReturn
} from '../types'