---
layout: home

hero:
  name: "@ldesign/template"
  text: "强大的 Vue3 模板管理系统"
  tagline: 智能化、响应式的多设备模板解决方案
  image:
    src: /logo.svg
    alt: LDesign Template
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看示例
      link: /examples/basic
    - theme: alt
      text: 模板预览
      link: /playground

features:
  - icon: 📱
    title: 多设备适配
    details: 自动检测设备类型，为桌面、移动端、平板提供最佳模板体验
  - icon: 🎨
    title: 丰富的模板库
    details: 内置多种精美模板，支持登录、注册、仪表板等常见场景
  - icon: ⚡
    title: 智能缓存
    details: 内置模板缓存机制，提升加载性能和用户体验
  - icon: 🔧
    title: 高度可定制
    details: 支持模板配置、插槽、事件等多种自定义方式
  - icon: 🔍
    title: TypeScript 支持
    details: 完整的类型定义和智能提示，开发体验更佳
  - icon: 🧪
    title: 测试友好
    details: 易于测试的 API 设计，支持单元测试和集成测试
---

## 快速预览

```typescript
import { createTemplateManager, useTemplate } from '@ldesign/template'

// 创建模板管理器
const templateManager = createTemplateManager({
  autoScan: true,
  enableDeviceDetection: true,
  enableCache: true
})

// 在组合式函数中使用
const { currentTemplate, loadTemplate, switchTemplate } = useTemplate({
  category: 'login',
  fallback: 'default'
})
```

```vue
<template>
  <div class="template-container">
    <!-- 使用模板渲染器 -->
    <TemplateRenderer
      :template="currentTemplate"
      :props="templateProps"
      @login="handleLogin"
      @forgot-password="handleForgotPassword"
    >
      <template #header>
        <h1>欢迎回来</h1>
      </template>
    </TemplateRenderer>

    <!-- 模板选择器 -->
    <TemplateSelector
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

const { currentTemplate, switchTemplate } = useTemplate({
  category: 'login'
})

const templateProps = ref({
  title: '用户登录',
  logo: '/logo.png',
  showRememberMe: true
})

const handleLogin = (data: any) => {
  console.log('登录数据:', data)
}

const handleForgotPassword = () => {
  console.log('忘记密码')
}
</script>
```

## 为什么选择 @ldesign/template？

### 🎨 简单易用的 API

传统的模板管理方式：

```typescript
// 手动管理模板
const isMobile = window.innerWidth < 768
const templateName = isMobile ? 'mobile-login' : 'desktop-login'

// 手动导入模板
import DesktopLogin from './templates/desktop-login.vue'
import MobileLogin from './templates/mobile-login.vue'

const currentTemplate = isMobile ? MobileLogin : DesktopLogin
```

使用 @ldesign/template：

```typescript
// 自动设备检测和模板选择
const { currentTemplate } = useTemplate({
  category: 'login',
  autoDetectDevice: true
})

// 模板会根据设备类型自动选择最佳模板
```

### 🚀 强大的功能特性

- **智能设备检测** - 自动识别桌面、移动端、平板设备
- **模板缓存系统** - 提升加载性能，减少重复请求
- **热插拔模板** - 运行时动态切换模板，无需重启应用
- **模板预加载** - 智能预加载常用模板，提升用户体验
- **错误降级** - 模板加载失败时自动降级到备用模板

### 📈 更好的开发体验

- **完整的 TypeScript 支持** - 类型安全和智能提示
- **Vue 3 组合式 API** - 现代化的开发体验
- **丰富的模板库** - 开箱即用的精美模板
- **可视化模板选择器** - 实时预览和切换模板
- **详细的文档和示例** - 快速上手，轻松集成

### 🎯 适用场景

- **多端应用开发** - 一套代码，多端适配
- **快速原型开发** - 丰富的模板库，快速搭建界面
- **企业级应用** - 可定制、可扩展的模板系统
- **设计系统** - 统一的视觉风格和交互体验
