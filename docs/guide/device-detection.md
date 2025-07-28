# 设备检测

设备检测是 @ldesign/template 的核心功能之一，能够自动识别用户设备类型并选择最适合的模板。

## 基础用法

### 使用组合式函数

```typescript
import { useDeviceDetector } from '@ldesign/template'

const {
  deviceType,      // 设备类型: 'mobile' | 'tablet' | 'desktop'
  isMobile,        // 是否移动端
  isTablet,        // 是否平板端
  isDesktop,       // 是否桌面端
  screenWidth,     // 屏幕宽度
  screenHeight,    // 屏幕高度
  orientation,     // 屏幕方向: 'portrait' | 'landscape'
  isLandscape,     // 是否横屏
  isPortrait,      // 是否竖屏
  supportTouch,    // 是否支持触摸
  deviceInfo       // 详细设备信息
} = useDeviceDetector()

// 响应式数据，会自动更新
console.log(`当前设备: ${deviceType.value}`)
console.log(`屏幕尺寸: ${screenWidth.value}×${screenHeight.value}`)
```

### 自定义断点

```typescript
const { deviceType } = useDeviceDetector({
  breakpoints: {
    mobile: 600,    // 小于600px为移动端
    tablet: 900,    // 600px-900px为平板端
    desktop: 1200   // 大于900px为桌面端
  }
})
```

## 高级配置

### 完整配置选项

```typescript
const deviceDetector = useDeviceDetector({
  // 断点配置
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },
  
  // 防抖配置
  debounceDelay: 100,           // 窗口大小变化防抖延迟
  
  // 响应式配置
  reactive: true,               // 是否响应式更新
  
  // 自定义检测函数
  customDetector: (width, height, userAgent) => {
    // 自定义设备检测逻辑
    if (userAgent.includes('iPad')) return 'tablet'
    if (width < 768) return 'mobile'
    return 'desktop'
  },
  
  // 缓存配置
  enableCache: true,            // 启用检测结果缓存
  cacheExpiry: 300000,         // 缓存过期时间（5分钟）
  
  // 服务端渲染配置
  ssrFallback: 'desktop',      // SSR 降级设备类型
  
  // 调试配置
  enableDebug: false           // 启用调试日志
})
```

## 设备信息详解

### 基础设备信息

```typescript
const { deviceInfo } = useDeviceDetector()

console.log('设备信息:', {
  // 基础信息
  type: deviceInfo.value.type,           // 设备类型
  os: deviceInfo.value.os,               // 操作系统
  browser: deviceInfo.value.browser,     // 浏览器
  version: deviceInfo.value.version,     // 浏览器版本
  
  // 屏幕信息
  screen: {
    width: deviceInfo.value.screen.width,
    height: deviceInfo.value.screen.height,
    pixelRatio: deviceInfo.value.screen.pixelRatio,
    colorDepth: deviceInfo.value.screen.colorDepth
  },
  
  // 功能支持
  features: {
    touch: deviceInfo.value.features.touch,
    webgl: deviceInfo.value.features.webgl,
    canvas: deviceInfo.value.features.canvas,
    localStorage: deviceInfo.value.features.localStorage,
    sessionStorage: deviceInfo.value.features.sessionStorage,
    indexedDB: deviceInfo.value.features.indexedDB
  },
  
  // 网络信息
  network: {
    type: deviceInfo.value.network.type,           // 网络类型
    effectiveType: deviceInfo.value.network.effectiveType, // 有效网络类型
    downlink: deviceInfo.value.network.downlink,   // 下行速度
    rtt: deviceInfo.value.network.rtt             // 往返时间
  }
})
```

### User Agent 解析

```typescript
const { deviceInfo } = useDeviceDetector()

// 解析 User Agent 字符串
const userAgentInfo = deviceInfo.value.userAgent

console.log('User Agent 信息:', {
  raw: userAgentInfo.raw,                    // 原始 UA 字符串
  browser: userAgentInfo.browser,            // 浏览器名称
  browserVersion: userAgentInfo.browserVersion, // 浏览器版本
  engine: userAgentInfo.engine,              // 渲染引擎
  engineVersion: userAgentInfo.engineVersion, // 引擎版本
  os: userAgentInfo.os,                      // 操作系统
  osVersion: userAgentInfo.osVersion,        // 系统版本
  device: userAgentInfo.device,              // 设备名称
  vendor: userAgentInfo.vendor,              // 设备厂商
  model: userAgentInfo.model                 // 设备型号
})
```

## 媒体查询支持

### 使用媒体查询

```typescript
const { matchMedia } = useDeviceDetector()

// 检测媒体查询
const isSmallScreen = matchMedia('(max-width: 600px)')
const isDarkMode = matchMedia('(prefers-color-scheme: dark)')
const isHighDPI = matchMedia('(min-resolution: 2dppx)')

// 响应式更新
watch(isSmallScreen, (matches) => {
  console.log('小屏幕模式:', matches)
})

watch(isDarkMode, (matches) => {
  console.log('深色模式:', matches)
})
```

### 预定义媒体查询

```typescript
const {
  isSmallScreen,    // (max-width: 600px)
  isMediumScreen,   // (min-width: 601px) and (max-width: 1024px)
  isLargeScreen,    // (min-width: 1025px)
  isRetina,         // (min-resolution: 2dppx)
  isPrintMode,      // print
  isReducedMotion,  // (prefers-reduced-motion: reduce)
  isDarkMode,       // (prefers-color-scheme: dark)
  isLightMode       // (prefers-color-scheme: light)
} = useDeviceDetector({
  enableMediaQueries: true
})
```

## 方向检测

### 屏幕方向

```typescript
const { 
  orientation,     // 'portrait' | 'landscape'
  isPortrait,      // 是否竖屏
  isLandscape,     // 是否横屏
  orientationAngle // 方向角度
} = useDeviceDetector()

// 监听方向变化
watch(orientation, (newOrientation) => {
  console.log('屏幕方向变化:', newOrientation)
  
  if (newOrientation === 'landscape') {
    // 横屏处理逻辑
  } else {
    // 竖屏处理逻辑
  }
})
```

### 方向锁定

```typescript
import { lockOrientation, unlockOrientation } from '@ldesign/template'

// 锁定为横屏
await lockOrientation('landscape')

// 锁定为竖屏
await lockOrientation('portrait')

// 解除锁定
await unlockOrientation()
```

## 触摸支持检测

### 触摸能力检测

```typescript
const { 
  supportTouch,      // 是否支持触摸
  maxTouchPoints,    // 最大触摸点数
  touchCapabilities  // 详细触摸能力
} = useDeviceDetector()

console.log('触摸支持:', {
  hasTouch: supportTouch.value,
  maxPoints: maxTouchPoints.value,
  capabilities: touchCapabilities.value
})

// 根据触摸支持调整交互
if (supportTouch.value) {
  // 启用触摸交互
  enableTouchGestures()
} else {
  // 启用鼠标交互
  enableMouseInteractions()
}
```

### 手势检测

```typescript
import { useGestureDetector } from '@ldesign/template'

const { 
  onSwipe,
  onPinch,
  onRotate,
  onTap,
  onLongPress
} = useGestureDetector()

// 滑动手势
onSwipe((direction, distance) => {
  console.log(`滑动方向: ${direction}, 距离: ${distance}`)
})

// 缩放手势
onPinch((scale, center) => {
  console.log(`缩放比例: ${scale}, 中心点:`, center)
})
```

## 性能优化

### 防抖和节流

```typescript
const { deviceType } = useDeviceDetector({
  // 防抖配置
  debounceDelay: 150,        // 防抖延迟
  
  // 节流配置
  throttleDelay: 100,        // 节流延迟
  
  // 优化选项
  enableOptimization: true,   // 启用性能优化
  lazyUpdate: true,          // 懒更新
  updateOnlyOnChange: true   // 仅在变化时更新
})
```

### 缓存策略

```typescript
const deviceDetector = useDeviceDetector({
  // 缓存配置
  enableCache: true,
  cacheStrategy: 'memory',    // 'memory' | 'localStorage' | 'sessionStorage'
  cacheExpiry: 300000,       // 5分钟缓存
  
  // 预计算
  enablePrecompute: true,     // 启用预计算
  precomputeBreakpoints: true // 预计算断点
})
```

## 服务端渲染支持

### SSR 配置

```typescript
// 服务端
import { createDeviceDetector } from '@ldesign/template/server'

const deviceDetector = createDeviceDetector({
  userAgent: req.headers['user-agent'],
  acceptLanguage: req.headers['accept-language'],
  clientHints: req.headers['sec-ch-ua'],
  fallbackDevice: 'desktop'
})

const deviceType = deviceDetector.getDeviceType()

// 客户端水合
const { deviceType: clientDeviceType } = useDeviceDetector({
  ssrDeviceType: deviceType,  // 服务端检测结果
  enableHydration: true       // 启用水合
})
```

### 同构检测

```typescript
import { isServer, isClient } from '@ldesign/template'

const { deviceType } = useDeviceDetector({
  // 同构配置
  enableSSR: true,
  ssrFallback: 'desktop',
  
  // 水合配置
  enableHydration: isClient,
  hydrateOnMount: true,
  
  // 服务端配置
  serverUserAgent: isServer ? req.headers['user-agent'] : undefined
})
```

## 自定义检测器

### 创建自定义检测器

```typescript
import { createCustomDetector } from '@ldesign/template'

const customDetector = createCustomDetector({
  name: 'MyCustomDetector',
  
  // 自定义检测逻辑
  detect: (context) => {
    const { width, height, userAgent, features } = context
    
    // 自定义设备分类逻辑
    if (userAgent.includes('MyApp')) {
      return 'app'
    }
    
    if (features.touch && width < 768) {
      return 'mobile'
    }
    
    return 'desktop'
  },
  
  // 自定义断点
  breakpoints: {
    mobile: 600,
    tablet: 900,
    desktop: 1200,
    app: 0  // 自定义设备类型
  }
})

// 使用自定义检测器
const { deviceType } = useDeviceDetector({
  customDetector
})
```

### 扩展检测能力

```typescript
import { extendDeviceDetector } from '@ldesign/template'

const extendedDetector = extendDeviceDetector({
  // 添加新的检测维度
  detectors: {
    // 网络类型检测
    networkType: (context) => {
      const connection = navigator.connection
      return connection ? connection.effectiveType : 'unknown'
    },
    
    // 电池状态检测
    batteryLevel: async (context) => {
      if ('getBattery' in navigator) {
        const battery = await navigator.getBattery()
        return battery.level
      }
      return null
    },
    
    // 内存信息检测
    memoryInfo: (context) => {
      return (performance as any).memory || null
    }
  }
})
```

## 事件监听

### 设备变化事件

```typescript
const deviceDetector = useDeviceDetector()

// 监听设备类型变化
deviceDetector.on('deviceTypeChanged', (newType, oldType) => {
  console.log(`设备类型从 ${oldType} 变为 ${newType}`)
})

// 监听屏幕尺寸变化
deviceDetector.on('screenSizeChanged', (newSize, oldSize) => {
  console.log('屏幕尺寸变化:', { newSize, oldSize })
})

// 监听方向变化
deviceDetector.on('orientationChanged', (newOrientation, oldOrientation) => {
  console.log(`屏幕方向从 ${oldOrientation} 变为 ${newOrientation}`)
})
```

### 自定义事件

```typescript
// 注册自定义事件
deviceDetector.on('customEvent', (data) => {
  console.log('自定义事件:', data)
})

// 触发自定义事件
deviceDetector.emit('customEvent', { message: 'Hello' })
```

## 调试和诊断

### 调试模式

```typescript
const { deviceType, debug } = useDeviceDetector({
  enableDebug: true,
  debugLevel: 'verbose'  // 'error' | 'warn' | 'info' | 'debug' | 'verbose'
})

// 获取调试信息
const debugInfo = debug.getDebugInfo()
console.log('调试信息:', debugInfo)

// 导出诊断报告
const diagnostics = debug.generateDiagnostics()
console.log('诊断报告:', diagnostics)
```

### 性能监控

```typescript
const { performance } = useDeviceDetector({
  enablePerformanceMonitoring: true
})

// 获取性能指标
const metrics = performance.getMetrics()
console.log('性能指标:', {
  detectionTime: metrics.detectionTime,
  updateFrequency: metrics.updateFrequency,
  memoryUsage: metrics.memoryUsage
})
```

## 最佳实践

### 1. 合理设置断点

```typescript
// 根据实际需求设置断点
const { deviceType } = useDeviceDetector({
  breakpoints: {
    mobile: 768,    // 移动端
    tablet: 1024,   // 平板端
    desktop: 1200   // 桌面端
  }
})
```

### 2. 性能优化

```typescript
// 启用防抖和缓存
const { deviceType } = useDeviceDetector({
  debounceDelay: 100,
  enableCache: true,
  updateOnlyOnChange: true
})
```

### 3. 错误处理

```typescript
const { deviceType, error } = useDeviceDetector({
  enableErrorHandling: true,
  fallbackDevice: 'desktop'
})

if (error.value) {
  console.error('设备检测错误:', error.value)
}
```

## 下一步

- [模板管理](/guide/template-management) - 了解如何管理模板
- [缓存系统](/guide/caching) - 学习缓存机制
- [性能优化](/guide/performance) - 优化应用性能
