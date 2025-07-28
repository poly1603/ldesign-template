# 组合式函数 API

@ldesign/template 提供了一系列组合式函数，让你在 Vue 3 应用中轻松使用模板管理功能。

## useTemplate

模板管理的核心组合式函数。

### 函数签名

```typescript
function useTemplate(options?: UseTemplateOptions): UseTemplateReturn
```

### 参数

**UseTemplateOptions:**

```typescript
interface UseTemplateOptions {
  category?: string                    // 模板分类，默认 'default'
  device?: DeviceType | 'auto'       // 设备类型，'auto' 为自动检测
  autoDetectDevice?: boolean          // 是否启用自动设备检测，默认 true
  fallback?: string                   // 降级模板名称
  preload?: boolean                   // 是否预加载模板，默认 false
  enableCache?: boolean               // 是否启用缓存，默认 true
  onChange?: (template: TemplateConfig) => void  // 模板变化回调
  onError?: (error: Error) => void               // 错误回调
  onLoading?: (loading: boolean) => void         // 加载状态回调
}
```

### 返回值

**UseTemplateReturn:**

```typescript
interface UseTemplateReturn {
  // 响应式状态
  currentTemplate: Ref<TemplateConfig | null>    // 当前模板
  availableTemplates: Ref<TemplateConfig[]>      // 可用模板列表
  isLoading: Ref<boolean>                        // 加载状态
  error: Ref<Error | null>                       // 错误信息
  
  // 方法
  switchTemplate: (templateId: string) => Promise<boolean>  // 切换模板
  refreshTemplates: () => Promise<void>                     // 刷新模板列表
  preloadTemplates: () => Promise<void>                     // 预加载模板
  clearError: () => void                                    // 清除错误
  
  // 工具方法
  getTemplateById: (id: string) => TemplateConfig | null   // 根据ID获取模板
  getTemplatesByDevice: (device: DeviceType) => TemplateConfig[]  // 根据设备获取模板
  searchTemplates: (query: string) => TemplateConfig[]     // 搜索模板
}
```

### 基础用法

```typescript
import { useTemplate } from '@ldesign/template'

const {
  currentTemplate,
  availableTemplates,
  isLoading,
  error,
  switchTemplate,
  refreshTemplates
} = useTemplate({
  category: 'login',
  autoDetectDevice: true
})

// 切换模板
const handleSwitchTemplate = async (templateId: string) => {
  const success = await switchTemplate(templateId)
  if (success) {
    console.log('模板切换成功')
  }
}
```

### 高级用法

```typescript
const {
  currentTemplate,
  availableTemplates,
  switchTemplate
} = useTemplate({
  category: 'login',
  device: 'mobile',
  fallback: 'default',
  preload: true,
  onChange: (template) => {
    console.log('模板已切换:', template.name)
  },
  onError: (error) => {
    console.error('模板错误:', error)
  },
  onLoading: (loading) => {
    console.log('加载状态:', loading)
  }
})
```

## useDeviceDetector

设备检测组合式函数。

### 函数签名

```typescript
function useDeviceDetector(options?: UseDeviceDetectorOptions): UseDeviceDetectorReturn
```

### 参数

**UseDeviceDetectorOptions:**

```typescript
interface UseDeviceDetectorOptions {
  breakpoints?: {
    mobile: number      // 移动端断点，默认 768
    tablet: number      // 平板端断点，默认 1024
    desktop: number     // 桌面端断点，默认 1200
  }
  debounceDelay?: number          // 防抖延迟，默认 100ms
  reactive?: boolean              // 是否响应式更新，默认 true
  enableCache?: boolean           // 是否启用缓存，默认 true
  customDetector?: (width: number, height: number, userAgent: string) => DeviceType
  enableMediaQueries?: boolean    // 是否启用媒体查询，默认 false
  ssrFallback?: DeviceType       // SSR 降级设备类型，默认 'desktop'
}
```

### 返回值

**UseDeviceDetectorReturn:**

```typescript
interface UseDeviceDetectorReturn {
  // 设备信息
  deviceType: Ref<DeviceType>         // 设备类型
  isMobile: Ref<boolean>              // 是否移动端
  isTablet: Ref<boolean>              // 是否平板端
  isDesktop: Ref<boolean>             // 是否桌面端
  
  // 屏幕信息
  screenWidth: Ref<number>            // 屏幕宽度
  screenHeight: Ref<number>           // 屏幕高度
  orientation: Ref<'portrait' | 'landscape'>  // 屏幕方向
  isLandscape: Ref<boolean>           // 是否横屏
  isPortrait: Ref<boolean>            // 是否竖屏
  
  // 功能支持
  supportTouch: Ref<boolean>          // 是否支持触摸
  maxTouchPoints: Ref<number>         // 最大触摸点数
  
  // 详细信息
  deviceInfo: Ref<DeviceInfo>         // 详细设备信息
  
  // 媒体查询（可选）
  matchMedia?: (query: string) => Ref<boolean>  // 媒体查询函数
  
  // 工具方法
  refresh: () => void                 // 刷新检测结果
  getBreakpoint: (width: number) => DeviceType  // 根据宽度获取设备类型
}
```

### 基础用法

```typescript
import { useDeviceDetector } from '@ldesign/template'

const {
  deviceType,
  isMobile,
  isTablet,
  isDesktop,
  screenWidth,
  screenHeight,
  orientation
} = useDeviceDetector()

// 监听设备类型变化
watch(deviceType, (newType) => {
  console.log('设备类型变化:', newType)
})
```

### 自定义断点

```typescript
const { deviceType } = useDeviceDetector({
  breakpoints: {
    mobile: 600,
    tablet: 900,
    desktop: 1200
  }
})
```

### 媒体查询支持

```typescript
const { matchMedia } = useDeviceDetector({
  enableMediaQueries: true
})

if (matchMedia) {
  const isSmallScreen = matchMedia('(max-width: 600px)')
  const isDarkMode = matchMedia('(prefers-color-scheme: dark)')
  
  watch(isSmallScreen, (matches) => {
    console.log('小屏幕模式:', matches)
  })
}
```

## useTemplateCache

模板缓存管理组合式函数。

### 函数签名

```typescript
function useTemplateCache(): UseTemplateCacheReturn
```

### 返回值

```typescript
interface UseTemplateCacheReturn {
  // 缓存统计
  cacheStats: Ref<CacheStats>         // 缓存统计信息
  
  // 缓存操作
  getCache: (key: string) => any      // 获取缓存
  setCache: (key: string, value: any, expiry?: number) => void  // 设置缓存
  removeCache: (key: string) => void  // 移除缓存
  clearCache: () => void              // 清空缓存
  hasCache: (key: string) => boolean  // 检查缓存是否存在
  
  // 批量操作
  getCaches: (keys: string[]) => Record<string, any>  // 批量获取
  setCaches: (entries: Record<string, any>) => void   // 批量设置
  removeCaches: (keys: string[]) => void              // 批量移除
  
  // 工具方法
  refreshStats: () => void            // 刷新统计信息
  exportCache: () => string           // 导出缓存数据
  importCache: (data: string) => void // 导入缓存数据
}
```

### 基础用法

```typescript
import { useTemplateCache } from '@ldesign/template'

const {
  cacheStats,
  getCache,
  setCache,
  clearCache
} = useTemplateCache()

// 设置缓存
setCache('user-preference', { theme: 'dark' }, 3600000) // 1小时过期

// 获取缓存
const preference = getCache('user-preference')

// 监听缓存统计
watch(cacheStats, (stats) => {
  console.log(`缓存命中率: ${stats.hitRate}%`)
})
```

## useStorage

本地存储组合式函数。

### 函数签名

```typescript
function useStorage(
  key: string,
  defaultValue?: any,
  options?: UseStorageOptions
): UseStorageReturn
```

### 参数

```typescript
interface UseStorageOptions {
  storage?: 'localStorage' | 'sessionStorage'  // 存储类型，默认 'localStorage'
  serializer?: {
    read: (value: string) => any
    write: (value: any) => string
  }
  enableSync?: boolean        // 是否启用跨标签页同步，默认 true
  enableSSR?: boolean         // 是否支持 SSR，默认 true
}
```

### 返回值

```typescript
interface UseStorageReturn<T> {
  value: Ref<T>               // 存储值
  isSupported: Ref<boolean>   // 是否支持存储
  
  // 操作方法
  remove: () => void          // 移除存储
  clear: () => void           // 清空所有存储
  
  // 工具方法
  refresh: () => void         // 刷新存储值
  getSize: () => number       // 获取存储大小
}
```

### 基础用法

```typescript
import { useStorage } from '@ldesign/template'

// 存储用户偏好
const userPreference = useStorage('user-preference', {
  theme: 'light',
  language: 'zh-CN'
})

// 修改值会自动保存到本地存储
userPreference.value.theme = 'dark'

// 移除存储
userPreference.remove()
```

### 自定义序列化

```typescript
const complexData = useStorage('complex-data', [], {
  serializer: {
    read: (value) => JSON.parse(value),
    write: (value) => JSON.stringify(value)
  }
})
```

## useTemplatePreloader

模板预加载组合式函数。

### 函数签名

```typescript
function useTemplatePreloader(options?: UseTemplatePreloaderOptions): UseTemplatePreloaderReturn
```

### 参数

```typescript
interface UseTemplatePreloaderOptions {
  strategy?: 'eager' | 'lazy' | 'smart'  // 预加载策略
  categories?: string[]                   // 预加载分类
  devices?: DeviceType[]                 // 预加载设备
  maxConcurrent?: number                 // 最大并发数
  priority?: string[]                    // 优先级列表
}
```

### 返回值

```typescript
interface UseTemplatePreloaderReturn {
  // 状态
  isPreloading: Ref<boolean>             // 是否正在预加载
  preloadProgress: Ref<number>           // 预加载进度 (0-100)
  preloadedTemplates: Ref<string[]>      // 已预加载的模板
  
  // 方法
  preload: (templateIds?: string[]) => Promise<void>     // 预加载
  preloadCategory: (category: string) => Promise<void>   // 预加载分类
  preloadDevice: (device: DeviceType) => Promise<void>   // 预加载设备
  cancelPreload: () => void                              // 取消预加载
  
  // 工具方法
  isPreloaded: (templateId: string) => boolean          // 检查是否已预加载
  getPreloadStats: () => PreloadStats                   // 获取预加载统计
}
```

### 基础用法

```typescript
import { useTemplatePreloader } from '@ldesign/template'

const {
  isPreloading,
  preloadProgress,
  preload,
  preloadCategory
} = useTemplatePreloader({
  strategy: 'smart',
  maxConcurrent: 3
})

// 预加载登录分类的所有模板
await preloadCategory('login')

// 监听预加载进度
watch(preloadProgress, (progress) => {
  console.log(`预加载进度: ${progress}%`)
})
```

## useTemplateValidator

模板验证组合式函数。

### 函数签名

```typescript
function useTemplateValidator(): UseTemplateValidatorReturn
```

### 返回值

```typescript
interface UseTemplateValidatorReturn {
  // 验证方法
  validateConfig: (config: TemplateConfig) => ValidationResult
  validateComponent: (component: any) => ValidationResult
  validateProps: (props: any, schema: PropsSchema) => ValidationResult
  
  // 批量验证
  validateConfigs: (configs: TemplateConfig[]) => ValidationResult[]
  
  // 工具方法
  getValidationRules: () => ValidationRules
  setValidationRules: (rules: ValidationRules) => void
}
```

### 基础用法

```typescript
import { useTemplateValidator } from '@ldesign/template'

const { validateConfig, validateComponent } = useTemplateValidator()

// 验证模板配置
const configResult = validateConfig(templateConfig)
if (!configResult.valid) {
  console.error('配置验证失败:', configResult.errors)
}

// 验证模板组件
const componentResult = validateComponent(templateComponent)
if (!componentResult.valid) {
  console.error('组件验证失败:', componentResult.errors)
}
```

## 工具函数

### createTemplateComposable

创建自定义模板组合式函数。

```typescript
function createTemplateComposable<T>(
  factory: (manager: TemplateManager) => T
): () => T
```

**示例:**

```typescript
import { createTemplateComposable } from '@ldesign/template'

const useCustomTemplate = createTemplateComposable((manager) => {
  const customMethod = () => {
    // 自定义逻辑
  }
  
  return {
    customMethod,
    manager
  }
})

// 使用自定义组合式函数
const { customMethod, manager } = useCustomTemplate()
```

### withTemplateManager

高阶函数，为组合式函数提供模板管理器实例。

```typescript
function withTemplateManager<T extends any[], R>(
  fn: (manager: TemplateManager, ...args: T) => R
): (...args: T) => R
```

**示例:**

```typescript
import { withTemplateManager } from '@ldesign/template'

const getTemplateCount = withTemplateManager((manager, category: string) => {
  return manager.getTemplatesByCategory(category).length
})

// 使用
const loginTemplateCount = getTemplateCount('login')
```

## 类型定义

### 通用类型

```typescript
type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface ValidationResult {
  valid: boolean
  errors?: string[]
  warnings?: string[]
}

interface CacheStats {
  size: number
  hitRate: number
  missRate: number
  totalRequests: number
  totalHits: number
  totalMisses: number
  lastUpdate: Date
}

interface DeviceInfo {
  type: DeviceType
  os: string
  browser: string
  version: string
  screen: {
    width: number
    height: number
    pixelRatio: number
    colorDepth: number
  }
  features: {
    touch: boolean
    webgl: boolean
    canvas: boolean
    localStorage: boolean
    sessionStorage: boolean
    indexedDB: boolean
  }
  network?: {
    type: string
    effectiveType: string
    downlink: number
    rtt: number
  }
}
```

## 最佳实践

### 1. 组合使用

```typescript
// 组合多个组合式函数
const {
  currentTemplate,
  switchTemplate
} = useTemplate({ category: 'login' })

const { deviceType } = useDeviceDetector()

const { setCache } = useTemplateCache()

// 根据设备类型自动切换模板
watch(deviceType, async (newType) => {
  const templates = availableTemplates.value.filter(t => t.device === newType)
  if (templates.length > 0) {
    await switchTemplate(templates[0].id)
    setCache('last-device-template', templates[0].id)
  }
})
```

### 2. 错误处理

```typescript
const {
  currentTemplate,
  error,
  clearError
} = useTemplate({
  category: 'login',
  onError: (err) => {
    console.error('模板错误:', err)
    // 显示用户友好的错误信息
    showNotification('error', '模板加载失败，请稍后重试')
  }
})

// 监听错误状态
watch(error, (err) => {
  if (err) {
    // 处理错误
    handleTemplateError(err)
    // 清除错误状态
    clearError()
  }
})
```

### 3. 性能优化

```typescript
// 使用预加载提升性能
const { preloadCategory } = useTemplatePreloader({
  strategy: 'smart',
  maxConcurrent: 2
})

// 在应用启动时预加载常用模板
onMounted(async () => {
  await preloadCategory('login')
})

// 使用缓存减少重复请求
const { setCache, getCache } = useTemplateCache()

const cachedPreference = getCache('user-template-preference')
if (cachedPreference) {
  await switchTemplate(cachedPreference.templateId)
}
```
