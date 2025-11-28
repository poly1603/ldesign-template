# @ldesign/template-vue

Vue 3 模板管理系统 - 基于 [@ldesign/template-core](../core) 的 Vue 框架适配层。

## 特性

- ✅ **自动扫描**: 使用 `import.meta.glob` 自动发现模板
- ✅ **懒加载**: 按需加载模板组件,提升性能
- ✅ **三级目录**: `category/device/name` 清晰的组织结构
- ✅ **类型安全**: 完整的 TypeScript 类型支持
- ✅ **Vue 3**: 基于 Composition API 和 `<script setup>`
- ✅ **开箱即用**: 提供插件、组件和 Composables

## 安装

```bash
pnpm add @ldesign/template-vue
```

## 快速开始

### 1. 安装插件

```typescript
// main.ts
import { createApp } from 'vue'
import { createTemplatePlugin } from '@ldesign/template-vue'
import App from './App.vue'

const app = createApp(App)

app.use(createTemplatePlugin({
  autoScan: true,  // 自动扫描模板
  debug: true,     // 开发模式开启调试
}))

app.mount('#app')
```

### 2. 使用组件

```vue
<script setup lang="ts">
import { TemplateRenderer } from '@ldesign/template-vue'
import { ref } from 'vue'

const templateId = ref('login:desktop:default')

function handleLogin(data: { username: string; password: string }) {
  console.log('登录:', data)
}
</script>

<template>
  <TemplateRenderer
    :template-id="templateId"
    :props="{ onSubmit: handleLogin }"
  />
</template>
```

### 3. 使用模板选择器

```vue
<script setup lang="ts">
import { TemplateSelector, TemplateRenderer } from '@ldesign/template-vue'
import { ref } from 'vue'

const selectedTemplate = ref('login:desktop:default')
</script>

<template>
  <div>
    <!-- 模板选择器 -->
    <TemplateSelector
      category="login"
      device="desktop"
      v-model="selectedTemplate"
      show-preview
      show-description
    />

    <!-- 渲染选中的模板 -->
    <TemplateRenderer
      :template-id="selectedTemplate"
      :props="{ onSubmit: handleLogin }"
    />
  </div>
</template>
```

## API 文档

### 组件

#### TemplateRenderer

模板渲染器组件,负责动态加载和渲染模板。

**Props:**
- `templateId: string` - 模板ID (必需)
- `props?: Record<string, any>` - 传递给模板的属性
- `fallback?: Component` - 后备组件
- `onLoad?: () => void` - 加载成功回调
- `onError?: (error: Error) => void` - 加载失败回调

**插槽:**
- `loading` - 自定义加载状态
- `error` - 自定义错误状态
- 其他插槽会透传给模板组件

#### TemplateSelector

模板选择器组件,展示可用模板列表供用户选择。

**Props:**
- `category: string` - 功能分类 (必需)
- `device?: DeviceType` - 设备类型
- `modelValue?: string` - 当前选中的模板ID (v-model)
- `showPreview?: boolean` - 是否显示预览图 (默认: true)
- `showDescription?: boolean` - 是否显示描述 (默认: true)

**Events:**
- `update:modelValue` - 选中模板变化
- `change` - 选中模板变化

### Composables

#### useTemplate

```typescript
const {
  template,    // 模板元数据
  component,   // 加载的组件
  loading,     // 加载状态
  error,       // 错误信息
  load,        // 加载方法
  unload,      // 卸载方法
} = useTemplate('login:desktop:default', {
  immediate: false,           // 是否立即加载
  onLoad: (template) => {},   // 加载成功回调
  onError: (error) => {},     // 加载失败回调
})
```

#### useTemplateList

```typescript
const {
  templates,    // 模板列表
  loading,      // 加载状态
  count,        // 模板数量
  refresh,      // 刷新列表
  filterByTag,  // 按标签过滤
  search,       // 搜索模板
} = useTemplateList('login', 'desktop')
```

### 插件

#### createTemplatePlugin

```typescript
createTemplatePlugin({
  autoScan: true,       // 是否自动扫描模板
  debug: false,         // 是否开启调试
  templates: [],        // 预定义模板列表
})
```

## 模板开发

### 目录结构

```
packages/vue/src/templates/
└── {category}/          # 功能分类
    └── {device}/        # 设备类型
        └── {name}/      # 模板名称
            ├── index.vue            # 组件实现
            ├── template.config.ts   # 配置文件
            └── preview.png         # 预览图(可选)
```

### 示例模板

#### template.config.ts

```typescript
import type { TemplateConfig } from '@ldesign/template-core'

export default {
  name: 'default',
  displayName: '默认登录模板',
  description: '简洁的居中式登录页面',
  author: 'ldesign',
  version: '1.0.0',
  tags: ['login', 'simple', 'center'],
  props: {
    title: { type: String, default: '欢迎登录' },
    onSubmit: { type: Function, required: true },
  },
} satisfies TemplateConfig
```

#### index.vue

```vue
<script setup lang="ts">
interface Props {
  title?: string
  onSubmit?: (data: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '欢迎登录',
})

// 你的模板逻辑...
</script>

<template>
  <div class="template">
    <!-- 你的模板 UI -->
  </div>
</template>

<style scoped>
/* 你的模板样式 */
</style>
```

## 模板ID格式

支持两种格式:

1. **完整格式**: `{category}:{device}:{name}`
   - 示例: `login:desktop:default`
   
2. **简化格式**: `{category}:{device}`
   - 自动选择该分类和设备的 `default` 模板或第一个模板
   - 示例: `login:desktop`

## License

MIT