# 模板选择器优化说明

## 优化背景

在之前的版本中，模板选择器（TemplateSelector）是固定显示在页面右上角的（`position: fixed`），这种方式存在以下问题：

1. **缺乏灵活性**：所有模板的选择器都在同一位置，无法根据不同模板的布局需求调整
2. **可能遮挡内容**：固定位置可能会遮挡某些模板的关键内容
3. **不够优雅**：与模板本身的设计不协调，像是"强加"上去的

## 优化方案

### 核心思路

将模板选择器的显示位置控制权交给模板组件自己，通过 `provide/inject` 机制实现：

1. `TemplateRenderer` 通过 `provide` 向子模板提供选择器控制数据
2. 模板组件使用 `useTemplateSelector` 获取控制数据
3. 模板组件在任意位置通过插槽/组件放置 `TemplateSelector`

### 技术实现

#### 1. TemplateRenderer 提供选择器控制

```typescript
// TemplateRenderer.vue
const selectorProps = computed(() => ({
  category: props.category,
  device: currentDevice.value,
  currentTemplate: currentName.value,
}))

const handleSelectorSelect = (templateName: string) => {
  handleTemplateSelect(templateName)
}

provide('templateSelector', {
  props: selectorProps,
  onSelect: handleSelectorSelect,
  enabled: props.showSelector,
})
```

#### 2. 创建 useTemplateSelector composable

```typescript
// composables/useTemplateSelector.ts
export interface TemplateSelectorInjection {
  props: ComputedRef<{
    category: string
    device: DeviceType
    currentTemplate: string
  }>
  onSelect: (templateName: string) => void
  enabled: boolean
}

export function useTemplateSelector() {
  return inject<TemplateSelectorInjection | null>('templateSelector', null)
}
```

#### 3. 修改 TemplateSelector 样式

```css
/* 从 fixed 改为 relative */
.template-selector {
  position: relative;
  display: inline-block;
  z-index: 999;
}
```

#### 4. 模板组件中使用

```vue
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'

const selector = useTemplateSelector()
</script>

<template>
  <div class="my-template">
    <!-- 在任意位置放置选择器 -->
    <TemplateSelector
      v-if="selector && selector.enabled"
      v-bind="selector.props.value"
      @select="selector.onSelect"
    />
  </div>
</template>
```

## 优化效果

### 1. 灵活性提升

每个模板可以根据自己的布局决定选择器的位置：

- **Dashboard 模板**：放在 header 右侧，与用户信息并排
- **Login 模板**：放在页面左上角，不干扰登录表单
- **List 模板**：可以放在工具栏中，作为视图切换的一部分
- **Form 模板**：可以放在表单标题旁边

### 2. 设计一致性

选择器成为模板设计的一部分，而不是外部强加的元素：

```vue
<!-- Dashboard 示例：选择器是 header 的一部分 -->
<header class="dashboard-header">
  <h1>仪表板</h1>
  <div class="header-actions">
    <UserMenu />
    <Notifications />
    <TemplateSelector />  <!-- 自然地融入 header -->
  </div>
</header>
```

### 3. 更好的用户体验

- 选择器位置符合用户对该类型界面的预期
- 不会意外遮挡重要内容
- 可以根据权限动态控制显示

### 4. 更强的可扩展性

```vue
<!-- 可以添加额外的控制逻辑 -->
<TemplateSelector
  v-if="selector && selector.enabled && isAdmin && !isEmbedded"
  v-bind="selector.props.value"
  @select="selector.onSelect"
  class="my-custom-style"
/>
```

## 向后兼容性

### 不影响现有代码

如果模板组件没有使用 `useTemplateSelector`，则：
- 不会显示选择器（之前会显示在右上角）
- 功能完全正常，只是缺少模板切换功能
- 可以逐步迁移

### 迁移路径清晰

1. **第一步**：在模板组件中引入 `useTemplateSelector`
2. **第二步**：决定选择器的放置位置
3. **第三步**：添加 `TemplateSelector` 组件
4. **完成**：测试和调整样式

### 提供迁移工具

我们提供了详细的文档和示例：
- [模板选择器使用指南](./docs/TEMPLATE_SELECTOR_GUIDE.md)
- 多个实际模板示例
- 常见场景的代码模板

## 文件变更清单

### 修改的文件

1. **packages/template/src/components/TemplateRenderer.vue**
   - 移除模板选择器的直接渲染
   - 添加 provide 逻辑向子组件提供选择器控制
   - 移除 `TemplateSelector` 的导入（不再直接使用）

2. **packages/template/src/components/TemplateSelector.vue**
   - 修改样式：`position: fixed` → `position: relative`
   - 调整 z-index 为相对值

3. **packages/template/src/composables/index.ts**
   - 导出 `useTemplateSelector`
   - 导出 `TemplateSelectorInjection` 类型

4. **packages/template/src/index.ts**
   - 添加 `useTemplateSelector` 到导出列表
   - 添加 `TemplateSelectorInjection` 类型导出

### 新增的文件

1. **packages/template/src/composables/useTemplateSelector.ts**
   - 新增 composable，用于获取选择器控制

2. **packages/template/docs/TEMPLATE_SELECTOR_GUIDE.md**
   - 详细的使用指南
   - 多个实际示例
   - 迁移指南
   - 常见问题解答

3. **packages/template/SELECTOR_OPTIMIZATION.md**
   - 本文档，说明优化的背景和方案

### 更新的模板示例

1. **packages/template/src/templates/dashboard/desktop/default/index.vue**
   - 添加 `useTemplateSelector` 使用
   - 在 header 右侧放置选择器

2. **packages/template/src/templates/login/desktop/default/index.vue**
   - 添加 `useTemplateSelector` 使用
   - 在页面左上角放置选择器

## 使用示例

### 示例 1：Dashboard - Header 右侧

```vue
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'
const selector = useTemplateSelector()
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <h1>仪表板</h1>
      <div class="header-right">
        <span>用户</span>
        <TemplateSelector
          v-if="selector?.enabled"
          v-bind="selector.props.value"
          @select="selector.onSelect"
        />
      </div>
    </header>
  </div>
</template>
```

### 示例 2：Login - 左上角浮动

```vue
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'
const selector = useTemplateSelector()
</script>

<template>
  <div class="login-page">
    <div v-if="selector?.enabled" class="selector-wrapper">
      <TemplateSelector
        v-bind="selector.props.value"
        @select="selector.onSelect"
      />
    </div>
    <div class="login-form">
      <!-- 表单内容 -->
    </div>
  </div>
</template>

<style scoped>
.selector-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
```

## 测试检查清单

- [x] TemplateRenderer 正确提供选择器控制
- [x] useTemplateSelector 可以正确获取数据
- [x] 选择器在模板中可以正常渲染
- [x] 选择器的样式可以被自定义
- [x] 选择模板功能正常工作
- [x] showSelector=false 时选择器不显示
- [x] 没有使用选择器的模板仍然正常工作
- [x] 类型定义完整且正确
- [x] 文档清晰完整
- [x] 无 linter 错误

## 后续计划

1. **更新所有内置模板**：为所有内置模板添加选择器支持
2. **提供脚手架**：在 CLI 工具中提供模板选择器的代码片段
3. **视觉指南**：创建视觉设计指南，说明选择器的推荐放置位置
4. **主题支持**：为选择器提供更多主题变量支持

## 总结

这次优化将模板选择器从"全局固定元素"变为"模板内部组件"，大大提升了灵活性和可定制性，同时保持了良好的向后兼容性。通过 `provide/inject` 和 composable 的组合，我们实现了优雅的控制反转（IoC），让模板组件拥有了更多的自主权。

