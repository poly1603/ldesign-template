# LDesign Template

一个功能强大的 Vue 3 模板管理系统，支持自动设备检测、动态模板加载、缓存管理和用户偏好存储。

## ✨ 特性

- 🎯 **智能设备检测** - 自动识别移动端、平板端、桌面端设备
- 🔄 **动态模板切换** - 支持运行时模板切换和预览
- 💾 **智能缓存** - 内置模板缓存机制，提升加载性能
- 🎨 **模板选择器** - 可视化模板选择界面
- 📱 **响应式设计** - 完美适配各种屏幕尺寸
- 🔧 **高度可定制** - 灵活的配置选项和插槽系统
- 💪 **TypeScript 支持** - 完整的类型定义
- 🚀 **Vue 3 优化** - 基于 Composition API 构建

## 📦 安装

```bash
npm install @ldesign/template
# 或
yarn add @ldesign/template
# 或
pnpm add @ldesign/template
```

## 🚀 快速开始

### 1. 基础使用

```vue
<template>
  <TemplateProvider category="default" :auto-detect-device="true">
    <!-- 模板内容将在这里自动渲染 -->
  </TemplateProvider>
</template>

<script setup>
import { TemplateProvider } from '@ldesign/template'
</script>
```

### 2. 使用 Composition API

```vue
<template>
  <div>
    <p>当前设备: {{ deviceType }}</p>
    <p>当前模板: {{ currentTemplate?.name }}</p>
    
    <button @click="switchDevice('mobile')">移动端</button>
    <button @click="switchDevice('tablet')">平板端</button>
    <button @click="switchDevice('desktop')">桌面端</button>
    
    <TemplateRenderer 
      v-if="currentTemplate" 
      :template="currentTemplate" 
    />
  </div>
</template>

<script setup>
import { useTemplate, useDeviceDetector, TemplateRenderer } from '@ldesign/template'

const { deviceType } = useDeviceDetector()
const { currentTemplate, switchDevice } = useTemplate({
  category: 'default',
  autoDetectDevice: true
})
</script>
```

### 3. 模板选择器

```vue
<template>
  <div>
    <button @click="showSelector = true">选择模板</button>
    
    <TemplateSelector
      v-model:visible="showSelector"
      :templates="availableTemplates"
      :current-template="currentTemplate?.id"
      @select="onTemplateSelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TemplateSelector, useTemplate } from '@ldesign/template'

const showSelector = ref(false)
const { availableTemplates, currentTemplate, switchTemplate } = useTemplate()

const onTemplateSelect = (templateId) => {
  switchTemplate(templateId)
  showSelector.value = false
}
</script>
```

## 📚 API 文档

### 组件

#### TemplateProvider

模板提供者组件，负责模板的加载和渲染。

**Props:**
- `category: string` - 模板分类
- `deviceType?: 'mobile' | 'tablet' | 'desktop'` - 设备类型
- `templateId?: string` - 指定模板ID
- `autoDetectDevice?: boolean` - 是否自动检测设备
- `enableSelector?: boolean` - 是否启用模板选择器
- `enableStorage?: boolean` - 是否启用本地存储

**插槽:**
- `loading` - 加载状态
- `error` - 错误状态
- `empty` - 空状态

#### TemplateRenderer

模板渲染器组件，用于渲染指定的模板。

**Props:**
- `template: TemplateConfig` - 模板配置
- `props?: Record<string, any>` - 传递给模板的属性

**事件:**
- `render-complete` - 渲染完成
- `render-error` - 渲染错误

#### TemplateSelector

模板选择器组件，提供可视化的模板选择界面。

**Props:**
- `visible: boolean` - 是否显示
- `templates: TemplateConfig[]` - 模板列表
- `currentTemplate?: string` - 当前模板ID
- `category: string` - 模板分类
- `config?: TemplateSelectorConfig` - 选择器配置

**事件:**
- `select` - 选择模板
- `cancel` - 取消选择

### Composables

#### useTemplate

模板管理的核心 Hook。

```typescript
const {
  currentTemplate,
  availableTemplates,
  status,
  error,
  switchTemplate,
  switchDevice,
  refreshTemplates
} = useTemplate(config?)
```

#### useDeviceDetector

设备检测 Hook。

```typescript
const {
  deviceType,
  screenSize,
  isMobile,
  isTablet,
  isDesktop
} = useDeviceDetector()
```

#### useTemplateCache

模板缓存管理 Hook。

```typescript
const {
  getCache,
  setCache,
  removeCache,
  clearCache,
  getCacheStats
} = useTemplateCache()
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

## 🎯 自定义模板

### 1. 创建模板文件

```vue
<!-- templates/custom/mobile/my-template.vue -->
<template>
  <div class="my-custom-template">
    <h1>{{ title }}</h1>
    <slot name="content" />
  </div>
</template>

<script setup>
interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '自定义模板'
})
</script>

<style scoped>
.my-custom-template {
  /* 样式定义 */
}
</style>
```

### 2. 注册模板

```typescript
import { getGlobalTemplateManager } from '@ldesign/template'

const manager = getGlobalTemplateManager()

manager.registerTemplate({
  id: 'custom-mobile-template',
  name: '自定义移动模板',
  deviceType: 'mobile',
  category: 'custom',
  component: () => import('./templates/custom/mobile/my-template.vue')
})
```

## 🔍 示例

查看 `examples/` 目录获取更多使用示例：

- `basic-usage.vue` - 基础使用示例
- `advanced-usage.vue` - 高级功能示例
- `custom-template.vue` - 自定义模板示例

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

[MIT](./LICENSE) © LDesign Team

## 🙏 致谢

感谢所有贡献者的努力！

---

如果这个项目对你有帮助，请给我们一个 ⭐️！