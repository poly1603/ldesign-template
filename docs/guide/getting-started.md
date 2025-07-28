# 快速开始

## 安装

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

## 设置

### 1. 初始化模板系统

在你的 Vue 应用中初始化模板管理系统：

```typescript
// main.ts
import { createApp } from 'vue'
import { initTemplateSystem } from '@ldesign/template'
import App from './App.vue'

const app = createApp(App)

// 初始化模板系统
initTemplateSystem({
  autoScan: true,
  enableDeviceDetection: true,
  enableCache: true,
  scanDirectories: ['./src/templates']
}).then(() => {
  console.log('模板系统初始化完成')
})

app.mount('#app')
```

### 2. 使用 Vue 插件方式（推荐）

```typescript
// main.ts
import { createApp } from 'vue'
import LDesignTemplate from '@ldesign/template'
import App from './App.vue'

const app = createApp(App)

// 使用插件
app.use(LDesignTemplate, {
  autoScan: true,
  enableDeviceDetection: true,
  enableCache: true
})

app.mount('#app')
```

### 3. 在组件中使用模板

```vue
<template>
  <div class="app">
    <!-- 使用模板渲染器 -->
    <TemplateRenderer
      :template="currentTemplate"
      :props="templateProps"
      @login="handleLogin"
    >
      <template #header>
        <img src="/logo.png" alt="Logo" />
        <h1>{{ appTitle }}</h1>
      </template>
    </TemplateRenderer>

    <!-- 模板选择器（开发时使用） -->
    <TemplateSelector
      v-if="isDev"
      category="login"
      :current="currentTemplate?.id"
      @change="switchTemplate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTemplate } from '@ldesign/template'
import TemplateRenderer from '@ldesign/template/src/components/TemplateRenderer.vue'
import TemplateSelector from '@ldesign/template/src/components/TemplateSelector.vue'

// 使用模板组合式函数
const { currentTemplate, switchTemplate, isLoading } = useTemplate({
  category: 'login',
  autoDetectDevice: true,
  fallback: 'default'
})

const appTitle = ref('欢迎使用我们的应用')
const isDev = import.meta.env.DEV

// 模板属性
const templateProps = ref({
  title: '用户登录',
  logo: '/logo.png',
  showRememberMe: true,
  showForgotPassword: true
})

// 处理登录事件
const handleLogin = (loginData: any) => {
  console.log('登录数据:', loginData)
  // 处理登录逻辑
}
</script>
```

## 核心概念

### 模板管理器

模板管理器是整个系统的核心，负责模板的加载、缓存和管理：

```typescript
import { createTemplateManager } from '@ldesign/template'

const templateManager = createTemplateManager({
  autoScan: true,              // 自动扫描模板
  scanDirectories: ['./templates'], // 扫描目录
  enableCache: true,           // 启用缓存
  cacheExpiry: 3600000,       // 缓存过期时间（1小时）
  enableDeviceDetection: true, // 启用设备检测
  preloadDefault: true        // 预加载默认模板
})
```

### 设备检测

系统会自动检测用户设备类型，并选择最适合的模板：

```typescript
import { useDeviceDetector } from '@ldesign/template'

const { deviceType, isMobile, isTablet, isDesktop } = useDeviceDetector()

console.log('当前设备类型:', deviceType) // 'mobile' | 'tablet' | 'desktop'
```

### 模板配置

每个模板都有详细的配置信息：

```typescript
// templates/login/desktop/modern/index.ts
export const config: TemplateConfig = {
  id: 'login-desktop-modern',
  name: '现代登录模板',
  description: '现代化设计风格的桌面端登录模板',
  category: 'login',
  device: 'desktop',
  templateName: 'modern',
  props: {
    title: { type: 'string', default: '用户登录' },
    showLogo: { type: 'boolean', default: true }
  },
  events: {
    login: { description: '登录事件' },
    register: { description: '注册事件' }
  }
}
```

### 组合式函数

使用 `useTemplate` 组合式函数轻松管理模板：

```typescript
import { useTemplate } from '@ldesign/template'

const {
  currentTemplate,    // 当前模板
  availableTemplates, // 可用模板列表
  isLoading,         // 加载状态
  error,             // 错误信息
  loadTemplate,      // 加载模板
  switchTemplate,    // 切换模板
  refreshTemplates   // 刷新模板列表
} = useTemplate({
  category: 'login',
  device: 'auto',    // 自动检测设备
  fallback: 'default' // 降级模板
})
```

## 下一步

现在你已经了解了基础用法，可以继续学习：

- [核心概念](/guide/concepts) - 深入了解模板系统的工作原理
- [模板开发](/guide/template-development) - 学习如何创建自定义模板
- [设备适配](/guide/device-adaptation) - 了解多设备适配策略
- [性能优化](/guide/performance) - 优化模板加载性能
- [API 参考](/api/core) - 查看完整的 API 文档
- [示例](/examples/basic) - 查看更多实际示例
