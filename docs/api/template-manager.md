# 模板管理器 API

模板管理器是 @ldesign/template 的核心类，提供完整的模板管理功能。

## 类定义

```typescript
class TemplateManager extends EventEmitter {
  constructor(config?: TemplateManagerConfig)
  
  // 初始化
  initialize(): Promise<void>
  destroy(): void
  isInitialized(): boolean
  
  // 模板注册
  registerTemplate(config: TemplateConfig): boolean
  registerTemplates(configs: TemplateConfig[]): boolean[]
  unregisterTemplate(templateId: string): boolean
  
  // 模板查询
  getAvailableTemplates(): TemplateConfig[]
  getTemplateById(templateId: string): TemplateConfig | null
  getTemplatesByCategory(category: string): TemplateConfig[]
  getTemplatesByDevice(device: DeviceType): TemplateConfig[]
  getDefaultTemplate(category: string, device?: DeviceType): TemplateConfig | null
  getCurrentTemplate(): TemplateConfig | null
  
  // 模板搜索
  searchTemplates(query: string | SearchOptions): TemplateConfig[]
  
  // 模板切换
  switchTemplate(templateId: string): Promise<boolean>
  autoSelectTemplate(category: string): Promise<boolean>
  switchToPreferred(category: string): Promise<boolean>
  
  // 缓存管理
  getCacheStats(): CacheStats
  clearCache(): void
  clearTemplateCache(templateId: string): void
  setCacheExpiry(expiry: number): void
  
  // 预加载
  preloadTemplate(templateId: string): Promise<boolean>
  preloadTemplates(templateIds: string[]): Promise<boolean[]>
  preloadDefaultTemplates(): Promise<void>
  preloadTemplatesByCategory(category: string): Promise<void>
  
  // 性能监控
  getPerformanceMetrics(): PerformanceMetrics
  enablePerformanceMonitoring(options?: PerformanceOptions): void
  generatePerformanceReport(): PerformanceReport
  
  // 错误处理
  setErrorHandler(handler: ErrorHandler): void
  setFallbackStrategy(strategy: FallbackStrategy): void
  
  // 事件系统
  on(event: string, listener: Function): this
  off(event: string, listener: Function): this
  emit(event: string, ...args: any[]): boolean
}
```

## 构造函数

### TemplateManager(config?)

创建模板管理器实例。

**参数:**
- `config` (可选): `TemplateManagerConfig` - 配置选项

**示例:**

```typescript
import { TemplateManager } from '@ldesign/template'

// 使用默认配置
const manager = new TemplateManager()

// 使用自定义配置
const manager = new TemplateManager({
  autoScan: true,
  enableDeviceDetection: true,
  enableCache: true,
  scanDirectories: ['./templates'],
  cacheExpiry: 3600000
})
```

## 初始化方法

### initialize()

初始化模板管理器。

**返回值:** `Promise<void>`

**示例:**

```typescript
const manager = new TemplateManager()
await manager.initialize()
console.log('模板管理器初始化完成')
```

### destroy()

销毁模板管理器，清理所有资源。

**返回值:** `void`

**示例:**

```typescript
manager.destroy()
```

### isInitialized()

检查模板管理器是否已初始化。

**返回值:** `boolean`

**示例:**

```typescript
if (manager.isInitialized()) {
  console.log('管理器已初始化')
}
```

## 模板注册方法

### registerTemplate(config)

注册单个模板。

**参数:**
- `config`: `TemplateConfig` - 模板配置

**返回值:** `boolean` - 注册是否成功

**示例:**

```typescript
const success = manager.registerTemplate({
  id: 'login-desktop-custom',
  name: '自定义登录模板',
  category: 'login',
  device: 'desktop',
  templateName: 'custom',
  props: {
    title: { type: 'string', default: '登录' }
  },
  events: {
    login: { description: '登录事件' }
  }
})

if (success) {
  console.log('模板注册成功')
}
```

### registerTemplates(configs)

批量注册模板。

**参数:**
- `configs`: `TemplateConfig[]` - 模板配置数组

**返回值:** `boolean[]` - 每个模板的注册结果

**示例:**

```typescript
const results = manager.registerTemplates([
  template1Config,
  template2Config,
  template3Config
])

results.forEach((success, index) => {
  console.log(`模板 ${index + 1} 注册${success ? '成功' : '失败'}`)
})
```

### unregisterTemplate(templateId)

注销模板。

**参数:**
- `templateId`: `string` - 模板ID

**返回值:** `boolean` - 注销是否成功

**示例:**

```typescript
const success = manager.unregisterTemplate('login-desktop-custom')
if (success) {
  console.log('模板注销成功')
}
```

## 模板查询方法

### getAvailableTemplates()

获取所有可用模板。

**返回值:** `TemplateConfig[]`

**示例:**

```typescript
const templates = manager.getAvailableTemplates()
console.log(`共有 ${templates.length} 个模板`)
```

### getTemplateById(templateId)

根据ID获取模板。

**参数:**
- `templateId`: `string` - 模板ID

**返回值:** `TemplateConfig | null`

**示例:**

```typescript
const template = manager.getTemplateById('login-desktop-default')
if (template) {
  console.log('找到模板:', template.name)
} else {
  console.log('模板不存在')
}
```

### getTemplatesByCategory(category)

根据分类获取模板。

**参数:**
- `category`: `string` - 模板分类

**返回值:** `TemplateConfig[]`

**示例:**

```typescript
const loginTemplates = manager.getTemplatesByCategory('login')
console.log(`登录模板数量: ${loginTemplates.length}`)
```

### getTemplatesByDevice(device)

根据设备类型获取模板。

**参数:**
- `device`: `DeviceType` - 设备类型 ('mobile' | 'tablet' | 'desktop')

**返回值:** `TemplateConfig[]`

**示例:**

```typescript
const mobileTemplates = manager.getTemplatesByDevice('mobile')
console.log(`移动端模板数量: ${mobileTemplates.length}`)
```

### getDefaultTemplate(category, device?)

获取默认模板。

**参数:**
- `category`: `string` - 模板分类
- `device` (可选): `DeviceType` - 设备类型

**返回值:** `TemplateConfig | null`

**示例:**

```typescript
// 获取登录分类的默认模板
const defaultTemplate = manager.getDefaultTemplate('login')

// 获取移动端登录的默认模板
const mobileLoginTemplate = manager.getDefaultTemplate('login', 'mobile')
```

### getCurrentTemplate()

获取当前激活的模板。

**返回值:** `TemplateConfig | null`

**示例:**

```typescript
const currentTemplate = manager.getCurrentTemplate()
if (currentTemplate) {
  console.log('当前模板:', currentTemplate.name)
}
```

## 模板搜索方法

### searchTemplates(query)

搜索模板。

**参数:**
- `query`: `string | SearchOptions` - 搜索查询

**返回值:** `TemplateConfig[]`

**SearchOptions 接口:**

```typescript
interface SearchOptions {
  query?: string          // 搜索关键词
  category?: string       // 分类过滤
  device?: DeviceType     // 设备过滤
  tags?: string[]         // 标签过滤
  author?: string         // 作者过滤
  version?: string        // 版本过滤
  sortBy?: 'name' | 'date' | 'popularity' // 排序方式
  sortOrder?: 'asc' | 'desc' // 排序顺序
  limit?: number          // 结果数量限制
}
```

**示例:**

```typescript
// 简单搜索
const results1 = manager.searchTemplates('现代')

// 高级搜索
const results2 = manager.searchTemplates({
  query: '登录',
  category: 'login',
  device: 'mobile',
  tags: ['现代', '简洁'],
  sortBy: 'popularity',
  limit: 10
})
```

## 模板切换方法

### switchTemplate(templateId)

切换到指定模板。

**参数:**
- `templateId`: `string` - 目标模板ID

**返回值:** `Promise<boolean>` - 切换是否成功

**示例:**

```typescript
const success = await manager.switchTemplate('login-mobile-default')
if (success) {
  console.log('模板切换成功')
} else {
  console.log('模板切换失败')
}
```

### autoSelectTemplate(category)

根据当前设备自动选择最佳模板。

**参数:**
- `category`: `string` - 模板分类

**返回值:** `Promise<boolean>` - 选择是否成功

**示例:**

```typescript
const success = await manager.autoSelectTemplate('login')
if (success) {
  console.log('自动选择模板成功')
}
```

### switchToPreferred(category)

切换到用户偏好的模板。

**参数:**
- `category`: `string` - 模板分类

**返回值:** `Promise<boolean>` - 切换是否成功

**示例:**

```typescript
const success = await manager.switchToPreferred('login')
if (success) {
  console.log('切换到偏好模板成功')
}
```

## 缓存管理方法

### getCacheStats()

获取缓存统计信息。

**返回值:** `CacheStats`

**CacheStats 接口:**

```typescript
interface CacheStats {
  size: number          // 缓存大小
  hitRate: number       // 命中率 (0-100)
  missRate: number      // 未命中率 (0-100)
  totalRequests: number // 总请求数
  totalHits: number     // 总命中数
  totalMisses: number   // 总未命中数
  lastUpdate: Date      // 最后更新时间
}
```

**示例:**

```typescript
const stats = manager.getCacheStats()
console.log(`缓存命中率: ${stats.hitRate}%`)
console.log(`缓存大小: ${stats.size}`)
```

### clearCache()

清空所有缓存。

**返回值:** `void`

**示例:**

```typescript
manager.clearCache()
console.log('缓存已清空')
```

### clearTemplateCache(templateId)

清空指定模板的缓存。

**参数:**
- `templateId`: `string` - 模板ID

**返回值:** `void`

**示例:**

```typescript
manager.clearTemplateCache('login-desktop-default')
console.log('模板缓存已清空')
```

### setCacheExpiry(expiry)

设置缓存过期时间。

**参数:**
- `expiry`: `number` - 过期时间（毫秒）

**返回值:** `void`

**示例:**

```typescript
// 设置缓存过期时间为2小时
manager.setCacheExpiry(7200000)
```

## 预加载方法

### preloadTemplate(templateId)

预加载指定模板。

**参数:**
- `templateId`: `string` - 模板ID

**返回值:** `Promise<boolean>` - 预加载是否成功

**示例:**

```typescript
const success = await manager.preloadTemplate('login-mobile-default')
if (success) {
  console.log('模板预加载成功')
}
```

### preloadTemplates(templateIds)

批量预加载模板。

**参数:**
- `templateIds`: `string[]` - 模板ID数组

**返回值:** `Promise<boolean[]>` - 每个模板的预加载结果

**示例:**

```typescript
const results = await manager.preloadTemplates([
  'login-desktop-default',
  'login-mobile-default',
  'register-desktop-default'
])

results.forEach((success, index) => {
  console.log(`模板 ${index + 1} 预加载${success ? '成功' : '失败'}`)
})
```

### preloadDefaultTemplates()

预加载所有默认模板。

**返回值:** `Promise<void>`

**示例:**

```typescript
await manager.preloadDefaultTemplates()
console.log('默认模板预加载完成')
```

### preloadTemplatesByCategory(category)

预加载指定分类的所有模板。

**参数:**
- `category`: `string` - 模板分类

**返回值:** `Promise<void>`

**示例:**

```typescript
await manager.preloadTemplatesByCategory('login')
console.log('登录模板预加载完成')
```

## 性能监控方法

### getPerformanceMetrics()

获取性能指标。

**返回值:** `PerformanceMetrics`

**PerformanceMetrics 接口:**

```typescript
interface PerformanceMetrics {
  averageLoadTime: number      // 平均加载时间
  averageSwitchTime: number    // 平均切换时间
  cacheHitRate: number         // 缓存命中率
  memoryUsage: number          // 内存使用量
  totalSwitches: number        // 总切换次数
  errorRate: number            // 错误率
  lastMeasurement: Date        // 最后测量时间
}
```

**示例:**

```typescript
const metrics = manager.getPerformanceMetrics()
console.log(`平均加载时间: ${metrics.averageLoadTime}ms`)
console.log(`缓存命中率: ${metrics.cacheHitRate}%`)
```

### enablePerformanceMonitoring(options?)

启用性能监控。

**参数:**
- `options` (可选): `PerformanceOptions` - 监控选项

**返回值:** `void`

**示例:**

```typescript
manager.enablePerformanceMonitoring({
  enableMetrics: true,
  enableProfiling: true,
  sampleRate: 0.1 // 10% 采样率
})
```

## 事件系统

### 事件类型

```typescript
// 模板相关事件
'templateRegistered'    // 模板注册
'templateUnregistered'  // 模板注销
'templateLoaded'        // 模板加载
'templateUnloaded'      // 模板卸载
'templateChanged'       // 模板切换
'templateSwitching'     // 模板切换中
'templateSwitchFailed'  // 模板切换失败

// 缓存相关事件
'cacheHit'             // 缓存命中
'cacheMiss'            // 缓存未命中
'cacheCleared'         // 缓存清空

// 错误相关事件
'error'                // 错误
'warning'              // 警告

// 性能相关事件
'performanceUpdate'    // 性能更新
```

### 事件监听示例

```typescript
// 监听模板切换事件
manager.on('templateChanged', (event) => {
  console.log('模板已切换:', {
    oldTemplate: event.oldTemplate?.name,
    newTemplate: event.newTemplate?.name,
    reason: event.reason
  })
})

// 监听错误事件
manager.on('error', (error) => {
  console.error('模板管理器错误:', error)
})

// 监听性能更新事件
manager.on('performanceUpdate', (metrics) => {
  console.log('性能指标更新:', metrics)
})
```

## 工厂函数

### createTemplateManager(config?)

创建模板管理器实例的工厂函数。

**参数:**
- `config` (可选): `TemplateManagerConfig` - 配置选项

**返回值:** `TemplateManager`

**示例:**

```typescript
import { createTemplateManager } from '@ldesign/template'

const manager = createTemplateManager({
  autoScan: true,
  enableDeviceDetection: true
})
```

### getGlobalTemplateManager()

获取全局模板管理器实例。

**返回值:** `TemplateManager`

**示例:**

```typescript
import { getGlobalTemplateManager } from '@ldesign/template'

const manager = getGlobalTemplateManager()
```

## 类型定义

相关类型定义请参考：
- [模板配置](/api/template-config)
- [管理器配置](/api/manager-config)
- [类型定义](/api/types)
