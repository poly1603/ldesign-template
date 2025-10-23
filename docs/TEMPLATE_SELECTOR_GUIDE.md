# 模板选择器使用指南

## 概述

从 v2.x 开始，模板选择器的显示位置由模板组件自己控制，而不是固定在右上角。每个模板可以通过 `useTemplateSelector` 组合式函数来决定选择器在哪里显示。

## 核心概念

### 1. 模板选择器注入机制

`TemplateRenderer` 会通过 `provide/inject` 向子模板组件提供选择器控制：

```typescript
interface TemplateSelectorInjection {
  props: ComputedRef<{
    category: string
    device: DeviceType
    currentTemplate: string
  }>
  onSelect: (templateName: string) => void
  enabled: boolean
}
```

### 2. 模板组件中使用选择器

在模板组件中使用 `useTemplateSelector` 来获取选择器控制，然后将 `TemplateSelector` 组件放在任何需要的位置。

## 使用方法

### 基本使用

```vue
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'

// 获取模板选择器控制
const selector = useTemplateSelector()
</script>

<template>
  <div class="my-template">
    <!-- 在任何位置放置选择器 -->
    <TemplateSelector
      v-if="selector && selector.enabled"
      v-bind="selector.props.value"
      @select="selector.onSelect"
    />
    
    <!-- 模板内容 -->
    <div class="content">
      <!-- ... -->
    </div>
  </div>
</template>
```

### 示例 1：Dashboard 模板 - 放在 Header 右侧

```vue
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'

const selector = useTemplateSelector()
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1>仪表板</h1>
      </div>
      
      <div class="header-right">
        <!-- 用户信息 -->
        <div class="user-info">
          <span>用户名</span>
        </div>
        
        <!-- 模板选择器 - 放在 header 右侧 -->
        <TemplateSelector
          v-if="selector && selector.enabled"
          v-bind="selector.props.value"
          @select="selector.onSelect"
        />
      </div>
    </header>
    
    <main>
      <!-- 主内容 -->
    </main>
  </div>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
```

### 示例 2：Login 模板 - 放在左上角

```vue
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'

const selector = useTemplateSelector()
</script>

<template>
  <div class="login-page">
    <!-- 模板选择器 - 放在页面左上角 -->
    <div v-if="selector && selector.enabled" class="selector-wrapper">
      <TemplateSelector
        v-bind="selector.props.value"
        @select="selector.onSelect"
      />
    </div>
    
    <div class="login-container">
      <!-- 登录表单 -->
    </div>
  </div>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
}

.selector-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}
</style>
```

### 示例 3：浮动按钮 - 放在右下角

```vue
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'

const selector = useTemplateSelector()
</script>

<template>
  <div class="content-page">
    <!-- 页面内容 -->
    <main>
      <!-- ... -->
    </main>
    
    <!-- 模板选择器 - 浮动在右下角 -->
    <div v-if="selector && selector.enabled" class="floating-selector">
      <TemplateSelector
        v-bind="selector.props.value"
        @select="selector.onSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.floating-selector {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
```

### 示例 4：侧边栏中

```vue
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'

const selector = useTemplateSelector()
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <nav>
        <!-- 导航菜单 -->
      </nav>
      
      <!-- 模板选择器 - 放在侧边栏底部 -->
      <div v-if="selector && selector.enabled" class="sidebar-footer">
        <TemplateSelector
          v-bind="selector.props.value"
          @select="selector.onSelect"
        />
      </div>
    </aside>
    
    <main class="main-content">
      <!-- 主内容 -->
    </main>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sidebar-footer {
  margin-top: auto;
  padding: 16px;
}
</style>
```

## 高级用法

### 条件显示

你可以根据自己的逻辑决定是否显示选择器：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'

const selector = useTemplateSelector()
const isAdmin = ref(true) // 示例：只有管理员可以看到

const canShowSelector = computed(() => {
  return selector && selector.enabled && isAdmin.value
})
</script>

<template>
  <div>
    <TemplateSelector
      v-if="canShowSelector"
      v-bind="selector.props.value"
      @select="selector.onSelect"
    />
  </div>
</template>
```

### 自定义样式

你可以完全控制选择器的样式：

```vue
<template>
  <div class="custom-selector-wrapper">
    <TemplateSelector
      v-if="selector && selector.enabled"
      v-bind="selector.props.value"
      @select="selector.onSelect"
    />
  </div>
</template>

<style scoped>
.custom-selector-wrapper {
  /* 自定义容器样式 */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px;
}

/* 深度选择器覆盖选择器内部样式 */
.custom-selector-wrapper :deep(.template-selector) {
  /* 自定义内部样式 */
}
</style>
```

### 不显示选择器

如果你的模板不需要显示选择器（比如某些嵌入式场景），可以直接不使用它：

```vue
<script setup lang="ts">
// 不导入 useTemplateSelector
</script>

<template>
  <div class="embedded-template">
    <!-- 没有选择器，只有内容 -->
    <div class="content">
      <!-- ... -->
    </div>
  </div>
</template>
```

## TemplateRenderer 控制

在使用 `TemplateRenderer` 时，你仍然可以通过 `showSelector` 属性来全局控制是否启用选择器：

```vue
<template>
  <!-- 不显示选择器 -->
  <TemplateRenderer
    category="dashboard"
    :show-selector="false"
  />
  
  <!-- 显示选择器（默认行为） -->
  <TemplateRenderer
    category="dashboard"
    :show-selector="true"
  />
</template>
```

## API 参考

### useTemplateSelector()

返回模板选择器注入的数据，如果没有可用的选择器则返回 `null`。

**返回值：**

```typescript
{
  props: ComputedRef<{
    category: string       // 当前模板分类
    device: DeviceType     // 当前设备类型
    currentTemplate: string // 当前模板名称
  }>
  onSelect: (templateName: string) => void  // 选择模板的回调函数
  enabled: boolean  // 是否启用选择器（由 TemplateRenderer 的 showSelector 控制）
} | null
```

**使用示例：**

```typescript
const selector = useTemplateSelector()

if (selector) {
  console.log('当前分类:', selector.props.value.category)
  console.log('当前设备:', selector.props.value.device)
  console.log('当前模板:', selector.props.value.currentTemplate)
  console.log('是否启用:', selector.enabled)
}
```

## 迁移指南

### 从旧版本迁移

如果你之前使用的是 v1.x 版本（选择器固定在右上角），现在需要在你的模板组件中手动添加选择器：

**旧版本（v1.x）：**
```vue
<template>
  <div class="my-template">
    <!-- 选择器自动显示在右上角 -->
    <div class="content">
      <!-- ... -->
    </div>
  </div>
</template>
```

**新版本（v2.x）：**
```vue
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'

const selector = useTemplateSelector()
</script>

<template>
  <div class="my-template">
    <!-- 手动放置选择器 -->
    <TemplateSelector
      v-if="selector && selector.enabled"
      v-bind="selector.props.value"
      @select="selector.onSelect"
    />
    
    <div class="content">
      <!-- ... -->
    </div>
  </div>
</template>
```

## 常见问题

### Q: 为什么 `selector` 是 `null`？

A: 可能的原因：
1. 你的组件不是通过 `TemplateRenderer` 渲染的
2. 你在 `TemplateRenderer` 之外使用了这个组件

### Q: 可以在多个位置同时显示选择器吗？

A: 可以，但不建议。你可以在模板中多次使用 `TemplateSelector` 组件，但这可能会让用户感到困惑。

### Q: 如何自定义选择器的外观？

A: 你可以通过包裹容器添加样式，或使用深度选择器覆盖内部样式：

```vue
<style scoped>
.my-wrapper :deep(.template-selector .toggle-btn) {
  background: red;
}
</style>
```

### Q: 选择器在移动端会自适应吗？

A: 是的，`TemplateSelector` 组件本身是响应式的。但你需要确保放置选择器的容器也是响应式的。

## 最佳实践

1. **一致性**：在同一类型的模板中，将选择器放在相同的位置
2. **可访问性**：确保选择器不会遮挡重要内容
3. **响应式**：在不同设备上测试选择器的位置
4. **权限控制**：如果需要，添加权限检查来控制选择器的显示
5. **性能**：选择器使用了懒加载，不会影响初始加载性能

## 相关文档

- [TemplateRenderer 组件](./TEMPLATE_RENDERER.md)
- [创建自定义模板](./CUSTOM_TEMPLATE.md)
- [模板系统架构](./ARCHITECTURE.md)

