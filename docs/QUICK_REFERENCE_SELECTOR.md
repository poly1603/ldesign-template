# 模板选择器快速参考

## 🚀 快速开始

### 1. 基本使用（3 步）

```vue
<!-- Step 1: 导入 -->
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'

<!-- Step 2: 获取选择器 -->
const selector = useTemplateSelector()
</script>

<template>
  <div>
    <!-- Step 3: 放置选择器 -->
    <TemplateSelector
      v-if="selector?.enabled"
      v-bind="selector.props.value"
      @select="selector.onSelect"
    />
  </div>
</template>
```

## 📍 常见位置

### 右上角（Header）

```vue
<header class="header">
  <h1>标题</h1>
  <div class="header-right">
    <TemplateSelector v-if="selector?.enabled" v-bind="selector.props.value" @select="selector.onSelect" />
  </div>
</header>
```

### 左上角（浮动）

```vue
<div class="page">
  <div v-if="selector?.enabled" class="selector-fixed-left">
    <TemplateSelector v-bind="selector.props.value" @select="selector.onSelect" />
  </div>
</div>

<style>
.selector-fixed-left {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
```

### 右下角（浮动）

```vue
<div class="page">
  <div v-if="selector?.enabled" class="selector-fixed-right">
    <TemplateSelector v-bind="selector.props.value" @select="selector.onSelect" />
  </div>
</div>

<style>
.selector-fixed-right {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
```

### 侧边栏底部

```vue
<aside class="sidebar">
  <nav><!-- 导航 --></nav>
  
  <div v-if="selector?.enabled" class="sidebar-footer">
    <TemplateSelector v-bind="selector.props.value" @select="selector.onSelect" />
  </div>
</aside>

<style>
.sidebar {
  display: flex;
  flex-direction: column;
}
.sidebar-footer {
  margin-top: auto;
}
</style>
```

## 🎨 样式定制

### 包裹容器样式

```vue
<div class="custom-wrapper">
  <TemplateSelector
    v-if="selector?.enabled"
    v-bind="selector.props.value"
    @select="selector.onSelect"
  />
</div>

<style scoped>
.custom-wrapper {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
```

### 深度覆盖内部样式

```vue
<style scoped>
.custom-wrapper :deep(.template-selector .toggle-btn) {
  background: #ff6b6b;
  width: 40px;
  height: 40px;
}

.custom-wrapper :deep(.selector-panel) {
  width: 280px;
}
</style>
```

## 🔒 条件显示

### 仅管理员可见

```vue
<script setup lang="ts">
import { computed } from 'vue'

const selector = useTemplateSelector()
const isAdmin = ref(true) // 从用户状态获取

const showSelector = computed(() => selector?.enabled && isAdmin.value)
</script>

<template>
  <TemplateSelector
    v-if="showSelector"
    v-bind="selector.props.value"
    @select="selector.onSelect"
  />
</template>
```

### 非嵌入模式显示

```vue
<script setup lang="ts">
const selector = useTemplateSelector()
const isEmbedded = ref(false) // 从配置获取

const showSelector = computed(() => selector?.enabled && !isEmbedded.value)
</script>

<template>
  <TemplateSelector
    v-if="showSelector"
    v-bind="selector.props.value"
    @select="selector.onSelect"
  />
</template>
```

## 📱 响应式布局

### 桌面端显示，移动端隐藏

```vue
<template>
  <TemplateSelector
    v-if="selector?.enabled"
    v-bind="selector.props.value"
    @select="selector.onSelect"
    class="desktop-only"
  />
</template>

<style scoped>
.desktop-only {
  display: inline-block;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
}
</style>
```

### 不同设备不同位置

```vue
<template>
  <div class="template">
    <!-- 桌面端：header 右侧 -->
    <header class="header">
      <h1>标题</h1>
      <TemplateSelector
        v-if="selector?.enabled"
        v-bind="selector.props.value"
        @select="selector.onSelect"
        class="desktop-selector"
      />
    </header>
    
    <!-- 移动端：底部浮动 -->
    <TemplateSelector
      v-if="selector?.enabled"
      v-bind="selector.props.value"
      @select="selector.onSelect"
      class="mobile-selector"
    />
  </div>
</template>

<style scoped>
.mobile-selector {
  display: none;
}

@media (max-width: 768px) {
  .desktop-selector {
    display: none;
  }
  
  .mobile-selector {
    display: block;
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
}
</style>
```

## 🔧 API

### useTemplateSelector()

```typescript
const selector = useTemplateSelector()

// 返回值
selector?.props.value.category      // 当前分类
selector?.props.value.device        // 当前设备
selector?.props.value.currentTemplate // 当前模板
selector?.onSelect                  // 选择回调
selector?.enabled                   // 是否启用
```

### 完整类型

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

## ⚠️ 注意事项

1. **必须在模板组件中使用**：`useTemplateSelector` 只能在通过 `TemplateRenderer` 渲染的模板组件中使用
2. **检查 null**：始终检查 `selector` 是否为 `null`
3. **检查 enabled**：尊重 `enabled` 标志，不要强制显示
4. **一个页面一个**：避免在同一个模板中多次显示选择器

## 💡 最佳实践

✅ **推荐**
```vue
<!-- 简洁清晰 -->
<TemplateSelector
  v-if="selector?.enabled"
  v-bind="selector.props.value"
  @select="selector.onSelect"
/>
```

✅ **推荐（有额外条件）**
```vue
<!-- 额外的业务逻辑 -->
<TemplateSelector
  v-if="selector?.enabled && isAdmin"
  v-bind="selector.props.value"
  @select="selector.onSelect"
/>
```

❌ **不推荐**
```vue
<!-- 忽略 enabled 标志 -->
<TemplateSelector
  v-if="selector"
  v-bind="selector.props.value"
  @select="selector.onSelect"
/>
```

❌ **不推荐**
```vue
<!-- 手动传递属性，容易出错 -->
<TemplateSelector
  :category="selector.props.value.category"
  :device="selector.props.value.device"
  :current-template="selector.props.value.currentTemplate"
  @select="selector.onSelect"
/>
```

## 🐛 故障排查

### 选择器不显示

1. 检查 `selector` 是否为 `null` → 确保在模板组件中使用
2. 检查 `selector.enabled` 是否为 `false` → 检查 `TemplateRenderer` 的 `showSelector` 属性
3. 检查 CSS 样式 → 可能被其他样式隐藏

### 选择器位置不对

1. 检查父容器的 `position` 属性
2. 检查 `z-index` 是否足够大
3. 使用浏览器开发工具检查元素层级

### 点击选择器无反应

1. 确保正确绑定了 `@select="selector.onSelect"`
2. 检查是否有其他元素遮挡
3. 检查控制台是否有错误

## 📚 更多资源

- [完整使用指南](./TEMPLATE_SELECTOR_GUIDE.md)
- [优化说明](../SELECTOR_OPTIMIZATION.md)
- [模板开发文档](./CUSTOM_TEMPLATE.md)

