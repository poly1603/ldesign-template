# 安装配置

## 系统要求

- **Node.js**: >= 16.0.0
- **Vue**: >= 3.2.0
- **TypeScript**: >= 4.5.0 (可选，但推荐)

## 安装

### 使用包管理器安装

::: code-group

```bash [pnpm]
pnpm add @ldesign/template vue
```

```bash [npm]
npm install @ldesign/template vue
```

```bash [yarn]
yarn add @ldesign/template vue
```

:::

### CDN 引入

如果你不使用构建工具，也可以通过 CDN 引入：

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@next"></script>
<!-- LDesign Template -->
<script src="https://unpkg.com/@ldesign/template"></script>
```

## 配置

### Vue 插件配置

推荐使用 Vue 插件的方式来配置模板系统：

```typescript
// main.ts
import { createApp } from 'vue'
import LDesignTemplate from '@ldesign/template'
import App from './App.vue'

const app = createApp(App)

// 使用默认配置
app.use(LDesignTemplate)

// 或者使用自定义配置
app.use(LDesignTemplate, {
  // 基础配置
  autoScan: true,              // 自动扫描模板
  scanDirectories: [           // 扫描目录
    './src/templates',
    './templates'
  ],
  enableCache: true,           // 启用缓存
  cacheExpiry: 3600000,       // 缓存过期时间（1小时）
  preloadDefault: true,       // 预加载默认模板
  
  // 设备检测配置
  enableDeviceDetection: true, // 启用设备检测
  deviceBreakpoints: {        // 设备断点
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },
  
  // 存储配置
  enableStorage: true,         // 启用本地存储
  storageKey: 'ldesign-template-preferences',
  storageAdapter: 'localStorage', // 'localStorage' | 'sessionStorage'
  
  // 错误处理配置
  errorRetryCount: 3,         // 错误重试次数
  errorRetryDelay: 1000,      // 重试延迟（毫秒）
  enableFallback: true,       // 启用降级
  fallbackTemplate: 'default', // 降级模板
  
  // 性能配置
  enableLazyLoading: true,    // 启用懒加载
  enablePreloading: true,     // 启用预加载
  maxConcurrentLoads: 3,      // 最大并发加载数
  
  // 开发配置
  enableDevTools: process.env.NODE_ENV === 'development',
  enableHotReload: process.env.NODE_ENV === 'development',
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
})

app.mount('#app')
```

### 手动初始化

如果你需要更精细的控制，可以手动初始化模板管理器：

```typescript
import { createTemplateManager } from '@ldesign/template'

// 创建模板管理器实例
const templateManager = createTemplateManager({
  autoScan: true,
  enableDeviceDetection: true,
  enableCache: true
})

// 手动初始化
await templateManager.initialize()

// 注册自定义模板
templateManager.registerTemplate({
  id: 'custom-login',
  name: '自定义登录模板',
  category: 'login',
  device: 'desktop',
  templateName: 'custom',
  // ... 其他配置
})

// 设置为全局实例
app.provide('templateManager', templateManager)
```

## 配置选项详解

### 基础配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `autoScan` | `boolean` | `true` | 是否自动扫描模板目录 |
| `scanDirectories` | `string[]` | `['./templates']` | 模板扫描目录列表 |
| `enableCache` | `boolean` | `true` | 是否启用模板缓存 |
| `cacheExpiry` | `number` | `3600000` | 缓存过期时间（毫秒） |
| `preloadDefault` | `boolean` | `true` | 是否预加载默认模板 |

### 设备检测配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `enableDeviceDetection` | `boolean` | `true` | 是否启用设备检测 |
| `deviceBreakpoints` | `object` | 见下方 | 设备断点配置 |

默认设备断点：

```typescript
{
  mobile: 768,    // 小于768px为移动端
  tablet: 1024,   // 768px-1024px为平板端
  desktop: 1200   // 大于1024px为桌面端
}
```

### 存储配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `enableStorage` | `boolean` | `true` | 是否启用本地存储 |
| `storageKey` | `string` | `'ldesign-template'` | 存储键名 |
| `storageAdapter` | `string` | `'localStorage'` | 存储适配器 |

### 错误处理配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `errorRetryCount` | `number` | `3` | 错误重试次数 |
| `errorRetryDelay` | `number` | `1000` | 重试延迟（毫秒） |
| `enableFallback` | `boolean` | `true` | 是否启用降级 |
| `fallbackTemplate` | `string` | `'default'` | 降级模板名称 |

### 性能配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `enableLazyLoading` | `boolean` | `true` | 是否启用懒加载 |
| `enablePreloading` | `boolean` | `true` | 是否启用预加载 |
| `maxConcurrentLoads` | `number` | `3` | 最大并发加载数 |

### 开发配置

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `enableDevTools` | `boolean` | `false` | 是否启用开发工具 |
| `enableHotReload` | `boolean` | `false` | 是否启用热重载 |
| `logLevel` | `string` | `'error'` | 日志级别 |

## 环境变量

你可以通过环境变量来配置一些选项：

```bash
# .env
VITE_LDESIGN_TEMPLATE_LOG_LEVEL=debug
VITE_LDESIGN_TEMPLATE_ENABLE_DEV_TOOLS=true
VITE_LDESIGN_TEMPLATE_CACHE_EXPIRY=7200000
```

在代码中使用：

```typescript
app.use(LDesignTemplate, {
  logLevel: import.meta.env.VITE_LDESIGN_TEMPLATE_LOG_LEVEL || 'error',
  enableDevTools: import.meta.env.VITE_LDESIGN_TEMPLATE_ENABLE_DEV_TOOLS === 'true',
  cacheExpiry: parseInt(import.meta.env.VITE_LDESIGN_TEMPLATE_CACHE_EXPIRY) || 3600000
})
```

## TypeScript 配置

如果你使用 TypeScript，建议在 `tsconfig.json` 中添加类型声明：

```json
{
  "compilerOptions": {
    "types": ["@ldesign/template/types"]
  }
}
```

## Vite 配置

如果你使用 Vite，可能需要配置别名：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@ldesign/template': '@ldesign/template/src'
    }
  }
})
```

## 验证安装

创建一个简单的测试页面来验证安装是否成功：

```vue
<template>
  <div>
    <h1>LDesign Template 测试</h1>
    <p>设备类型: {{ deviceType }}</p>
    <p>可用模板数量: {{ availableTemplates.length }}</p>
  </div>
</template>

<script setup lang="ts">
import { useTemplate, useDeviceDetector } from '@ldesign/template'

const { deviceType } = useDeviceDetector()
const { availableTemplates } = useTemplate({ category: 'login' })
</script>
```

如果页面正常显示设备类型和模板数量，说明安装配置成功！

## 下一步

- [核心概念](/guide/concepts) - 了解模板系统的核心概念
- [快速开始](/guide/getting-started) - 开始使用模板系统
- [模板管理](/guide/template-management) - 学习模板管理功能
