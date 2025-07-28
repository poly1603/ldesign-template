# 🎨 @ldesign/template

> 强大的 Vue3 模板管理系统 - 让你的应用界面千变万化！✨

[![npm version](https://badge.fury.io/js/@ldesign%2Ftemplate.svg)](https://badge.fury.io/js/@ldesign%2Ftemplate)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 为什么选择 @ldesign/template？

想象一下，你的应用可以根据用户的设备自动切换最适合的界面风格，用户可以在多种精美模板中自由选择，而你只需要几行代码就能实现这一切！这就是 @ldesign/template 的魔力所在。

## ✨ 特性亮点

🚀 **智能设备检测** - 自动识别桌面、平板、手机，为每种设备提供最佳体验
🎯 **丰富模板库** - 内置精美登录、注册、仪表板模板，开箱即用
⚡ **极速缓存** - 智能缓存机制，模板加载快如闪电
🔧 **高度可定制** - 支持插槽、事件、属性等多种自定义方式
🛡️ **TypeScript 原生支持** - 完整类型定义，开发体验丝滑
🧪 **测试友好** - 易于测试的 API 设计，质量有保障
🎪 **热插拔模板** - 运行时动态切换模板，无需重启应用
🌈 **主题定制** - 支持深色模式、自定义主题色等

## 📦 安装

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

## 🚀 快速开始

### 🎯 第一步：安装插件

```typescript
// main.ts
import { createApp } from 'vue'
import LDesignTemplate from '@ldesign/template'
import App from './App.vue'

const app = createApp(App)

// 🎉 一行代码，开启模板魔法
app.use(LDesignTemplate, {
  autoScan: true,              // 自动扫描模板
  enableDeviceDetection: true, // 启用设备检测
  enableCache: true           // 启用缓存
})

app.mount('#app')
```

### 🎨 第二步：使用模板渲染器

```vue
<!-- App.vue -->
<template>
  <div class="app">
    <!-- 🎨 模板渲染器 - 你的界面变身器 -->
    <TemplateRenderer
      :template="currentTemplate"
      :props="templateProps"
      @login="handleLogin"
      @register="handleRegister"
      @forgot-password="handleForgotPassword"
    >
      <!-- 🎪 自定义头部插槽 -->
      <template #header>
        <img src="/logo.png" alt="Logo" class="logo" />
        <h1>{{ appTitle }}</h1>
      </template>

      <!-- 🎭 自定义底部插槽 -->
      <template #footer>
        <p>&copy; 2024 我的公司. 保留所有权利.</p>
      </template>
    </TemplateRenderer>

    <!-- 🎛️ 模板选择器（开发时超好用） -->
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

// 🔮 魔法开始的地方
const { currentTemplate, switchTemplate } = useTemplate({
  category: 'login',
  autoDetectDevice: true  // 自动适配设备
})

const isDev = import.meta.env.DEV
const appTitle = ref('欢迎来到未来！')

// 🎨 模板属性配置
const templateProps = ref({
  title: '用户登录',
  logo: '/logo.png',
  showRememberMe: true,
  primaryColor: '#667eea',
  socialLogins: [
    { name: 'wechat', label: '微信登录', icon: 'fab fa-weixin' },
    { name: 'qq', label: 'QQ登录', icon: 'fab fa-qq' }
  ]
})

// 🎯 事件处理
const handleLogin = (loginData: any) => {
  console.log('登录成功！', loginData)
  // 在这里处理你的登录逻辑
}

const handleRegister = () => {
  console.log('跳转到注册页面')
}

const handleForgotPassword = () => {
  console.log('跳转到密码重置页面')
}
</script>
```

### 🎛️ 第三步：高级功能（可选）

```vue
<!-- 高级功能示例 -->
<template>
  <div class="advanced-demo">
    <!-- 设备信息显示 -->
    <div class="device-info">
      <h3>🔍 设备检测</h3>
      <p>当前设备: {{ deviceType }}</p>
      <p>屏幕宽度: {{ screenWidth }}px</p>
      <p>是否移动端: {{ isMobile ? '是' : '否' }}</p>
    </div>

    <!-- 模板切换按钮 -->
    <div class="template-controls">
      <h3>🎨 模板切换</h3>
      <button
        v-for="template in availableTemplates"
        :key="template.id"
        @click="switchTemplate(template.id)"
        :class="{ active: currentTemplate?.id === template.id }"
        class="template-btn"
      >
        {{ template.name }}
      </button>
    </div>

    <!-- 模板预览 -->
    <div class="template-preview">
      <h3>👀 当前模板</h3>
      <div class="template-info">
        <p><strong>名称:</strong> {{ currentTemplate?.name }}</p>
        <p><strong>设备:</strong> {{ currentTemplate?.device }}</p>
        <p><strong>版本:</strong> {{ currentTemplate?.version }}</p>
        <p><strong>作者:</strong> {{ currentTemplate?.author }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplate, useDeviceDetector } from '@ldesign/template'

// 设备检测
const { deviceType, isMobile, screenWidth } = useDeviceDetector()

// 模板管理
const {
  currentTemplate,
  availableTemplates,
  switchTemplate,
  isLoading,
  error
} = useTemplate({
  category: 'login',
  autoDetectDevice: true,
  fallback: 'default'
})
</script>

<style scoped>
.template-btn {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.template-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.template-btn:hover {
  border-color: #667eea;
}
</style>
```

## 🎪 核心概念

### 🎨 模板管理器

模板管理器是整个系统的大脑，负责模板的加载、缓存和管理：

```typescript
import { createTemplateManager } from '@ldesign/template'

const templateManager = createTemplateManager({
  autoScan: true,              // 🔍 自动扫描模板
  scanDirectories: ['./templates'], // 📁 扫描目录
  enableCache: true,           // 💾 启用缓存
  enableDeviceDetection: true, // 📱 启用设备检测
  preloadDefault: true        // ⚡ 预加载默认模板
})
```

### 📱 智能设备检测

系统会自动检测用户设备，选择最适合的模板：

```typescript
import { useDeviceDetector } from '@ldesign/template'

const {
  deviceType,    // 'mobile' | 'tablet' | 'desktop'
  isMobile,      // 是否移动端
  isTablet,      // 是否平板
  isDesktop,     // 是否桌面端
  screenWidth,   // 屏幕宽度
  screenHeight   // 屏幕高度
} = useDeviceDetector()

console.log(`当前设备: ${deviceType}`) // 当前设备: mobile
```

### 🎯 组合式函数

使用 `useTemplate` 轻松管理模板：

```typescript
import { useTemplate } from '@ldesign/template'

const {
  currentTemplate,    // 🎨 当前模板
  availableTemplates, // 📚 可用模板列表
  isLoading,         // ⏳ 加载状态
  error,             // ❌ 错误信息
  switchTemplate,    // 🔄 切换模板
  refreshTemplates   // 🔄 刷新模板列表
} = useTemplate({
  category: 'login',
  device: 'auto',    // 🤖 自动检测设备
  fallback: 'default' // 🛡️ 降级模板
})
```

## 📚 API 文档

### 🧩 组件

#### TemplateRenderer

模板渲染器组件，用于渲染指定的模板。

**Props:**
- `template: TemplateConfig` - 模板配置对象
- `props?: Record<string, any>` - 传递给模板的属性
- `loading?: boolean` - 加载状态
- `error?: Error` - 错误对象

**插槽:**
- `header` - 头部插槽
- `footer` - 底部插槽
- `extra` - 额外内容插槽
- `loading` - 自定义加载状态
- `error` - 自定义错误状态

**事件:**
- `login` - 登录事件
- `register` - 注册事件
- `forgot-password` - 忘记密码事件
- `social-login` - 社交登录事件

#### TemplateSelector

模板选择器组件，提供可视化的模板选择界面。

**Props:**
- `category: string` - 模板分类
- `current?: string` - 当前模板ID
- `device?: string` - 设备类型过滤

**事件:**
- `change` - 模板切换事件

### 🎣 组合式函数

#### useTemplate

模板管理的核心 Hook，提供完整的模板管理功能。

```typescript
interface UseTemplateOptions {
  category?: string           // 模板分类，默认 'login'
  device?: string            // 设备类型，'auto' 为自动检测
  autoDetectDevice?: boolean // 是否启用自动设备检测
  fallback?: string          // 降级模板名称
  preload?: boolean          // 是否预加载模板
  onChange?: (template: TemplateConfig) => void  // 模板变化回调
  onError?: (error: Error) => void              // 错误回调
}

const {
  currentTemplate,     // 当前激活的模板
  availableTemplates,  // 可用模板列表
  isLoading,          // 加载状态
  error,              // 错误信息
  switchTemplate,     // 切换到指定模板
  refreshTemplates,   // 刷新模板列表
  preloadTemplates    // 预加载模板
} = useTemplate(options?)
```

#### useDeviceDetector

设备检测 Hook，提供设备信息和响应式更新。

```typescript
interface UseDeviceDetectorOptions {
  breakpoints?: {
    mobile: number    // 移动端断点，默认 768
    tablet: number    // 平板端断点，默认 1024
    desktop: number   // 桌面端断点，默认 1200
  }
  debounceDelay?: number      // 防抖延迟，默认 100ms
  reactive?: boolean          // 是否响应式更新，默认 true
  customDetector?: () => string  // 自定义检测函数
}

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
  deviceInfo,      // 详细设备信息
  matchMedia       // 媒体查询函数
} = useDeviceDetector(options?)
```

#### useTemplateCache

模板缓存管理 Hook，提供缓存控制功能。

```typescript
const {
  getCache,           // 获取缓存
  setCache,           // 设置缓存
  removeCache,        // 移除缓存
  clearCache,         // 清空所有缓存
  getCacheStats,      // 获取缓存统计
  preloadTemplates    // 预加载模板到缓存
} = useTemplateCache()
```

#### useStorage

本地存储 Hook，用于保存用户偏好。

```typescript
const {
  getItem,     // 获取存储项
  setItem,     // 设置存储项
  removeItem,  // 移除存储项
  clear        // 清空存储
} = useStorage(storageType?: 'localStorage' | 'sessionStorage')
```

## 🎨 内置模板

系统提供了三套默认模板：

### 移动端模板
- **基础模板** - 移动优先的响应式设计
- 特性：触控优化、流畅动画、自适应布局

### 平板端模板
- **基础模板** - 平板设备优化设计
- 特性：横竖屏适配、侧边栏导航、触控友好

### 桌面端模板
- **基础模板** - 桌面端管理界面
- 特性：大屏优化、丰富组件、数据展示

## 🔧 配置

### 全局配置

```typescript
import { createApp } from 'vue'
import LDesignTemplate from '@ldesign/template'

const app = createApp(App)

app.use(LDesignTemplate, {
  autoScan: true,
  enableCache: true,
  cacheExpiry: 3600000,
  preloadDefault: true,
  enableDeviceDetection: true
})
```

### 模板管理器配置

```typescript
import { createTemplateManager } from '@ldesign/template'

const manager = createTemplateManager({
  scanDirectories: ['./templates'],
  enableCache: true,
  cacheExpiry: 3600000,
  errorRetryCount: 3
})
```

## 🎨 模板开发指南

### 📁 模板目录结构

我们的模板系统采用清晰的目录结构，让你轻松管理不同设备和风格的模板：

```
templates/
├── login/                    # 登录模板分类
│   ├── desktop/             # 桌面端模板
│   │   ├── default/         # 默认风格
│   │   │   ├── index.ts     # 模板配置
│   │   │   ├── LoginTemplate.vue  # Vue 组件
│   │   │   └── LoginTemplate.less # 样式文件
│   │   └── modern/          # 现代风格
│   ├── mobile/              # 移动端模板
│   │   ├── default/         # 默认风格
│   │   └── card/            # 卡片风格
│   └── tablet/              # 平板端模板
│       ├── default/         # 默认风格
│       └── split/           # 分屏风格
└── register/                # 注册模板分类
```

### 🛠️ 创建自定义模板

#### 第一步：创建模板配置

```typescript
// templates/login/mobile/awesome/index.ts
import type { TemplateConfig } from '@ldesign/template'

export const config: TemplateConfig = {
  // 基本信息
  id: 'login-mobile-awesome',
  name: '超棒移动端登录',
  description: '一个超级棒的移动端登录模板',
  version: '1.0.0',
  author: '你的名字',

  // 分类信息
  category: 'login',
  device: 'mobile',
  templateName: 'awesome',

  // 属性定义
  props: {
    title: {
      type: 'string',
      default: '欢迎回来',
      description: '登录页面标题'
    },
    primaryColor: {
      type: 'string',
      default: '#667eea',
      description: '主题色'
    }
  },

  // 插槽定义
  slots: {
    header: { description: '页面头部插槽' },
    footer: { description: '页面底部插槽' }
  },

  // 事件定义
  events: {
    login: {
      description: '登录事件',
      params: { username: 'string', password: 'string' }
    }
  }
}
```

#### 第二步：创建 Vue 组件

```vue
<!-- templates/login/mobile/awesome/LoginTemplate.vue -->
<template>
  <div class="awesome-login" :style="{ '--primary-color': primaryColor }">
    <slot name="header">
      <h1>{{ title }}</h1>
    </slot>

    <form @submit.prevent="handleLogin" class="login-form">
      <input v-model="username" placeholder="用户名" />
      <input v-model="password" type="password" placeholder="密码" />
      <button type="submit">登录</button>
    </form>

    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义属性
interface Props {
  title?: string
  primaryColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '欢迎回来',
  primaryColor: '#667eea'
})

// 定义事件
const emit = defineEmits<{
  login: [data: { username: string; password: string }]
}>()

// 响应式数据
const username = ref('')
const password = ref('')

// 处理登录
const handleLogin = () => {
  emit('login', {
    username: username.value,
    password: password.value
  })
}
</script>

<style lang="less" scoped>
.awesome-login {
  padding: 2rem;
  background: var(--primary-color);

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    input, button {
      padding: 0.75rem;
      border-radius: 8px;
      border: none;
    }

    button {
      background: white;
      color: var(--primary-color);
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>
```

## 🎯 使用自定义模板

### 方法一：自动扫描

将模板放在 `templates` 目录中，系统会自动扫描并注册。

### 方法二：手动注册

```typescript
import { getGlobalTemplateManager } from '@ldesign/template'
import { config } from './templates/login/mobile/awesome'

const manager = getGlobalTemplateManager()
manager.registerTemplate(config)
```

## 🎪 完整示例

查看 `examples/` 目录获取更多精彩示例：

### 🚀 基础示例
- **`quick-start.vue`** - 5分钟上手指南，最简单的使用方式
- **`basic-usage.vue`** - 基础功能演示，包含设备检测和模板切换
- **`complete-login-app.vue`** - 完整的登录应用，包含开发工具栏

### 🔥 高级示例
- **`advanced-features.vue`** - 高级功能展示，包含缓存管理、性能监控、主题定制
- **`template-integration.ts`** - 框架集成示例，支持 Vue、React、Angular

### 🎨 模板示例
我们内置了丰富的模板供你参考：

#### 桌面端模板
- **`desktop/default`** - 经典桌面端登录，简洁大方
- **`desktop/modern`** - 现代化设计，支持玻璃态效果和动画

#### 移动端模板
- **`mobile/default`** - 移动端优化，支持短信登录和生物识别
- **`mobile/card`** - 卡片式设计，现代感十足

#### 平板端模板
- **`tablet/default`** - 平板端适配，横竖屏完美支持
- **`tablet/split`** - 分屏设计，左侧品牌展示，右侧登录表单

## 🧪 测试

我们提供了完整的测试套件：

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行集成测试
pnpm test:integration

# 生成测试覆盖率报告
pnpm test:coverage
```

测试覆盖了：
- ✅ 模板管理器核心功能
- ✅ 设备检测准确性
- ✅ 组合式函数行为
- ✅ 组件渲染和事件
- ✅ 错误处理和降级
- ✅ 缓存和性能

## 🤝 贡献指南

我们热烈欢迎社区贡献！🎉

### 如何贡献

1. **🍴 Fork 本仓库**
2. **🌿 创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **💻 编写代码** (记得添加测试哦)
4. **✅ 运行测试** (`pnpm test`)
5. **📝 提交更改** (`git commit -m 'Add some AmazingFeature'`)
6. **🚀 推送到分支** (`git push origin feature/AmazingFeature`)
7. **🎯 开启 Pull Request**

### 贡献类型

- 🐛 **Bug 修复** - 发现问题？帮我们修复它！
- ✨ **新功能** - 有好想法？我们很乐意看到！
- 📚 **文档改进** - 让文档更清晰易懂
- 🎨 **新模板** - 分享你的精美模板设计
- 🧪 **测试增强** - 帮助提高代码质量

## 🆘 获取帮助

遇到问题？我们来帮你！

- 📖 **查看文档** - [完整文档](https://ldesign-template.docs.com)
- 🐛 **报告 Bug** - [GitHub Issues](https://github.com/ldesign/template/issues)
- 💬 **讨论交流** - [GitHub Discussions](https://github.com/ldesign/template/discussions)
- 📧 **邮件联系** - support@ldesign.com

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🌟 Star History

如果这个项目对你有帮助，请给我们一个 ⭐️！

[![Star History Chart](https://api.star-history.com/svg?repos=ldesign/template&type=Date)](https://star-history.com/#ldesign/template&Date)

## 🙏 致谢

感谢所有贡献者的努力！特别感谢：

- Vue.js 团队提供的优秀框架
- 所有提交 Issue 和 PR 的开发者
- 使用并推广本项目的用户们

---

<p align="center">
  <strong>🎨 让每个应用都拥有千变万化的界面！</strong><br>
  Made with ❤️ by <a href="https://github.com/ldesign">LDesign Team</a>
</p>

<p align="center">
  <a href="https://github.com/ldesign/template">⭐ 给我们一个 Star</a> •
  <a href="https://ldesign-template.docs.com">📖 查看文档</a> •
  <a href="https://github.com/ldesign/template/discussions">💬 加入讨论</a>
</p>
