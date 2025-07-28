# 模板管理

模板管理是 @ldesign/template 的核心功能，提供了完整的模板生命周期管理能力。

## 模板管理器

模板管理器是整个系统的核心，负责模板的注册、加载、缓存和切换。

### 创建模板管理器

```typescript
import { createTemplateManager } from '@ldesign/template'

const templateManager = createTemplateManager({
  autoScan: true,              // 自动扫描模板
  enableDeviceDetection: true, // 启用设备检测
  enableCache: true           // 启用缓存
})

// 初始化管理器
await templateManager.initialize()
```

### 获取全局模板管理器

```typescript
import { getGlobalTemplateManager } from '@ldesign/template'

// 获取全局实例
const templateManager = getGlobalTemplateManager()
```

## 模板注册

### 自动注册

系统会自动扫描指定目录中的模板：

```
templates/
├── login/
│   ├── desktop/
│   │   ├── default/
│   │   │   ├── index.ts        # 模板配置
│   │   │   ├── LoginTemplate.vue  # Vue 组件
│   │   │   └── styles.less     # 样式文件
│   │   └── modern/
│   ├── mobile/
│   └── tablet/
└── register/
```

### 手动注册

```typescript
// 注册单个模板
templateManager.registerTemplate({
  id: 'login-desktop-custom',
  name: '自定义桌面登录',
  description: '自定义的桌面端登录模板',
  version: '1.0.0',
  author: '开发者',
  category: 'login',
  device: 'desktop',
  templateName: 'custom',
  preview: '/previews/login-desktop-custom.png',
  tags: ['登录', '桌面端', '自定义'],
  props: {
    title: {
      type: 'string',
      default: '用户登录',
      description: '页面标题'
    },
    showLogo: {
      type: 'boolean',
      default: true,
      description: '是否显示Logo'
    }
  },
  slots: {
    header: {
      description: '页面头部插槽'
    },
    footer: {
      description: '页面底部插槽'
    }
  },
  events: {
    login: {
      description: '登录事件',
      params: {
        username: 'string',
        password: 'string'
      }
    }
  }
})

// 批量注册模板
templateManager.registerTemplates([
  template1Config,
  template2Config,
  template3Config
])
```

### 动态导入注册

```typescript
// 动态导入模板配置
const templateConfig = await import('./templates/login/desktop/modern/index.ts')
templateManager.registerTemplate(templateConfig.config)

// 动态导入模板组件
const templateComponent = await import('./templates/login/desktop/modern/LoginTemplate.vue')
templateManager.registerTemplateComponent('login-desktop-modern', templateComponent.default)
```

## 模板查询

### 获取模板列表

```typescript
// 获取所有模板
const allTemplates = templateManager.getAvailableTemplates()

// 根据分类获取模板
const loginTemplates = templateManager.getTemplatesByCategory('login')

// 根据设备类型获取模板
const mobileTemplates = templateManager.getTemplatesByDevice('mobile')

// 根据分类和设备类型获取模板
const mobileLoginTemplates = templateManager.getTemplates({
  category: 'login',
  device: 'mobile'
})
```

### 获取单个模板

```typescript
// 根据ID获取模板
const template = templateManager.getTemplateById('login-desktop-default')

// 获取默认模板
const defaultTemplate = templateManager.getDefaultTemplate('login', 'desktop')

// 获取当前模板
const currentTemplate = templateManager.getCurrentTemplate()
```

### 搜索模板

```typescript
// 文本搜索
const searchResults = templateManager.searchTemplates('现代')

// 高级搜索
const advancedResults = templateManager.searchTemplates({
  query: '登录',
  category: 'login',
  device: 'mobile',
  tags: ['现代', '简洁']
})
```

## 模板切换

### 基础切换

```typescript
// 切换到指定模板
const success = await templateManager.switchTemplate('login-mobile-default')

if (success) {
  console.log('模板切换成功')
} else {
  console.log('模板切换失败')
}
```

### 智能切换

```typescript
// 根据设备类型自动选择最佳模板
const success = await templateManager.autoSelectTemplate('login')

// 根据用户偏好切换
const success = await templateManager.switchToPreferred('login')
```

### 切换事件

```typescript
// 监听模板切换事件
templateManager.on('templateChanged', (event) => {
  console.log('模板已切换:', {
    oldTemplate: event.oldTemplate,
    newTemplate: event.newTemplate,
    reason: event.reason
  })
})

// 监听切换开始事件
templateManager.on('templateSwitching', (event) => {
  console.log('正在切换模板:', event.templateId)
})

// 监听切换失败事件
templateManager.on('templateSwitchFailed', (event) => {
  console.error('模板切换失败:', event.error)
})
```

## 模板预加载

### 预加载策略

```typescript
// 预加载默认模板
await templateManager.preloadDefaultTemplates()

// 预加载指定分类的模板
await templateManager.preloadTemplatesByCategory('login')

// 预加载指定设备的模板
await templateManager.preloadTemplatesByDevice('mobile')

// 智能预加载（根据使用频率）
await templateManager.smartPreload()
```

### 预加载配置

```typescript
const templateManager = createTemplateManager({
  preloadStrategy: 'smart',    // 'none' | 'default' | 'category' | 'smart'
  preloadCategories: ['login', 'register'], // 预加载的分类
  preloadDevices: ['mobile', 'desktop'],    // 预加载的设备
  maxPreloadCount: 10,         // 最大预加载数量
  preloadPriority: [           // 预加载优先级
    'login-mobile-default',
    'login-desktop-default'
  ]
})
```

## 模板缓存

### 缓存管理

```typescript
// 获取缓存统计
const cacheStats = templateManager.getCacheStats()
console.log('缓存统计:', {
  size: cacheStats.size,        // 缓存大小
  hitRate: cacheStats.hitRate,  // 命中率
  missRate: cacheStats.missRate // 未命中率
})

// 清空缓存
templateManager.clearCache()

// 清空指定模板的缓存
templateManager.clearTemplateCache('login-desktop-default')

// 设置缓存过期时间
templateManager.setCacheExpiry(7200000) // 2小时
```

### 缓存策略

```typescript
const templateManager = createTemplateManager({
  cacheStrategy: 'lru',        // 'lru' | 'fifo' | 'lfu'
  maxCacheSize: 50,           // 最大缓存数量
  cacheExpiry: 3600000,       // 缓存过期时间（1小时）
  enablePersistentCache: true, // 启用持久化缓存
  cacheStorageKey: 'template-cache'
})
```

## 模板验证

### 配置验证

```typescript
// 验证模板配置
const isValid = templateManager.validateTemplateConfig(templateConfig)

if (!isValid) {
  const errors = templateManager.getValidationErrors(templateConfig)
  console.error('模板配置错误:', errors)
}
```

### 组件验证

```typescript
// 验证模板组件
const isComponentValid = await templateManager.validateTemplateComponent(
  'login-desktop-default'
)

if (!isComponentValid) {
  console.error('模板组件验证失败')
}
```

## 模板生命周期

### 生命周期钩子

```typescript
templateManager.on('templateRegistered', (template) => {
  console.log('模板已注册:', template.id)
})

templateManager.on('templateLoaded', (template) => {
  console.log('模板已加载:', template.id)
})

templateManager.on('templateUnloaded', (template) => {
  console.log('模板已卸载:', template.id)
})

templateManager.on('templateError', (error) => {
  console.error('模板错误:', error)
})
```

### 模板状态

```typescript
// 获取模板状态
const status = templateManager.getTemplateStatus('login-desktop-default')

console.log('模板状态:', {
  isRegistered: status.isRegistered,
  isLoaded: status.isLoaded,
  isCached: status.isCached,
  lastUsed: status.lastUsed,
  useCount: status.useCount
})
```

## 错误处理

### 错误类型

```typescript
import { TemplateError, TemplateNotFoundError, TemplateLoadError } from '@ldesign/template'

try {
  await templateManager.switchTemplate('non-existent-template')
} catch (error) {
  if (error instanceof TemplateNotFoundError) {
    console.error('模板不存在:', error.templateId)
  } else if (error instanceof TemplateLoadError) {
    console.error('模板加载失败:', error.message)
  } else if (error instanceof TemplateError) {
    console.error('模板错误:', error.message)
  }
}
```

### 错误恢复

```typescript
// 设置错误处理器
templateManager.setErrorHandler((error, context) => {
  console.error('模板错误:', error)
  
  // 自动降级到默认模板
  if (error instanceof TemplateLoadError) {
    return templateManager.switchTemplate('default-template')
  }
  
  return false // 不处理错误
})

// 设置降级策略
templateManager.setFallbackStrategy({
  enableFallback: true,
  fallbackTemplate: 'default',
  maxRetries: 3,
  retryDelay: 1000
})
```

## 性能监控

### 性能指标

```typescript
// 获取性能指标
const metrics = templateManager.getPerformanceMetrics()

console.log('性能指标:', {
  loadTime: metrics.averageLoadTime,      // 平均加载时间
  switchTime: metrics.averageSwitchTime,  // 平均切换时间
  cacheHitRate: metrics.cacheHitRate,     // 缓存命中率
  memoryUsage: metrics.memoryUsage        // 内存使用量
})
```

### 性能优化

```typescript
// 启用性能监控
templateManager.enablePerformanceMonitoring({
  enableMetrics: true,
  enableProfiling: true,
  sampleRate: 0.1 // 10% 采样率
})

// 获取性能报告
const report = templateManager.generatePerformanceReport()
console.log('性能报告:', report)
```

## 最佳实践

### 1. 模板组织

```
templates/
├── login/           # 按功能分类
│   ├── desktop/     # 按设备分类
│   ├── mobile/
│   └── tablet/
├── register/
└── dashboard/
```

### 2. 命名规范

```typescript
// 模板ID命名规范：{category}-{device}-{templateName}
'login-desktop-default'
'login-mobile-modern'
'register-tablet-card'
```

### 3. 预加载策略

```typescript
// 根据使用频率预加载
const templateManager = createTemplateManager({
  preloadStrategy: 'smart',
  preloadCategories: ['login'], // 优先预加载登录模板
  maxPreloadCount: 5
})
```

### 4. 错误处理

```typescript
// 设置完善的错误处理和降级策略
templateManager.setFallbackStrategy({
  enableFallback: true,
  fallbackTemplate: 'login-desktop-default',
  maxRetries: 3
})
```

## 下一步

- [设备检测](/guide/device-detection) - 了解设备检测功能
- [缓存系统](/guide/caching) - 深入了解缓存机制
- [模板开发](/guide/template-development) - 学习如何开发自定义模板
