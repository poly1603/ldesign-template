# 模板选择器优化 - 使用指南 🎨

> **重要更新**: 从 v2.x 开始，模板选择器的位置由模板组件自己决定，不再固定在右上角！

## 🎯 快速开始

### 对于使用者

如果你只是使用模板，无需改动任何代码。模板组件已经内置了选择器。

### 对于模板开发者

在你的模板组件中添加 3 行代码：

```vue
<script setup lang="ts">
// 1️⃣ 导入
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'

// 2️⃣ 获取
const selector = useTemplateSelector()
</script>

<template>
  <div>
    <!-- 3️⃣ 放置（在任何位置） -->
    <TemplateSelector
      v-if="selector?.enabled"
      v-bind="selector.props.value"
      @select="selector.onSelect"
    />
  </div>
</template>
```

## 📖 文档导航

| 文档 | 说明 | 适合人群 |
|------|------|----------|
| [快速参考](./docs/QUICK_REFERENCE_SELECTOR.md) | 常用代码片段和速查表 | ⭐ 所有开发者 |
| [完整指南](./docs/TEMPLATE_SELECTOR_GUIDE.md) | 详细的使用说明和示例 | 模板开发者 |
| [优化说明](./SELECTOR_OPTIMIZATION.md) | 技术实现细节 | 架构师/高级开发者 |
| [完成报告](./TEMPLATE_SELECTOR_OPTIMIZATION_COMPLETE.md) | 优化总结和 API 参考 | 项目管理者 |

## 🚀 常见场景

### Dashboard 模板 - Header 右侧

```vue
<header class="header">
  <h1>仪表板</h1>
  <div class="header-actions">
    <TemplateSelector
      v-if="selector?.enabled"
      v-bind="selector.props.value"
      @select="selector.onSelect"
    />
  </div>
</header>
```

### Login 模板 - 左上角浮动

```vue
<div class="login-page">
  <div v-if="selector?.enabled" class="selector-fixed">
    <TemplateSelector v-bind="selector.props.value" @select="selector.onSelect" />
  </div>
  <!-- 登录表单 -->
</div>

<style scoped>
.selector-fixed {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
```

### Form 模板 - 表单标题旁

```vue
<div class="form-header">
  <h2>表单标题</h2>
  <TemplateSelector
    v-if="selector?.enabled"
    v-bind="selector.props.value"
    @select="selector.onSelect"
  />
</div>
```

## 🛠️ 工具脚本

我们提供了自动添加工具（实验性）：

```bash
# 自动为模板添加选择器支持
node scripts/add-template-selector.js <模板文件路径> [位置]

# 示例
node scripts/add-template-selector.js src/templates/dashboard/desktop/default/index.vue header-right
```

支持的位置：
- `header-right` - Header 右侧（默认）
- `header-left` - Header 左侧
- `top-left` - 左上角浮动
- `top-right` - 右上角浮动  
- `bottom-right` - 右下角浮动
- `sidebar-bottom` - 侧边栏底部

## 📦 已更新的模板

以下内置模板已经更新，可以作为参考：

- ✅ `dashboard/desktop/default` - Header 右侧
- ✅ `login/desktop/default` - 左上角浮动
- ✅ `form/desktop/single-column` - 表单标题右侧

## 🎓 学习路径

### 1. 快速上手 (5 分钟)
阅读 [快速参考](./docs/QUICK_REFERENCE_SELECTOR.md)

### 2. 深入理解 (15 分钟)
阅读 [完整指南](./docs/TEMPLATE_SELECTOR_GUIDE.md)

### 3. 实践应用 (30 分钟)
- 查看示例模板的实现
- 为自己的模板添加选择器
- 根据需要调整位置和样式

### 4. 高级定制 (1 小时)
- 添加权限控制
- 自定义样式
- 响应式布局适配

## ❓ 常见问题

<details>
<summary><b>Q: 为什么选择器不显示？</b></summary>

**A**: 检查以下几点：
1. 确保 `selector` 不为 `null`（即在模板组件中使用）
2. 检查 `selector.enabled` 是否为 `true`
3. 确保 `TemplateRenderer` 的 `showSelector` 属性未设置为 `false`
4. 检查 CSS 是否被覆盖或隐藏

```vue
<!-- 添加调试信息 -->
<div v-if="selector">
  <p>Enabled: {{ selector.enabled }}</p>
  <p>Category: {{ selector.props.value.category }}</p>
</div>
```
</details>

<details>
<summary><b>Q: 可以在多个位置显示选择器吗？</b></summary>

**A**: 技术上可以，但不推荐。一个模板中只显示一个选择器，避免用户困惑。
</details>

<details>
<summary><b>Q: 如何自定义选择器样式？</b></summary>

**A**: 使用包裹容器和深度选择器：

```vue
<div class="custom-wrapper">
  <TemplateSelector ... />
</div>

<style scoped>
.custom-wrapper {
  /* 容器样式 */
}

.custom-wrapper :deep(.template-selector .toggle-btn) {
  /* 覆盖内部样式 */
  background: red;
}
</style>
```
</details>

<details>
<summary><b>Q: 旧版本模板还能用吗？</b></summary>

**A**: 可以！没有添加选择器的模板仍然可以正常使用，只是不会显示选择器。可以逐步迁移。
</details>

<details>
<summary><b>Q: 如何根据权限控制选择器显示？</b></summary>

**A**: 添加额外的条件判断：

```vue
<script setup>
const selector = useTemplateSelector()
const isAdmin = ref(true) // 从用户状态获取

const canShowSelector = computed(() => 
  selector?.enabled && isAdmin.value
)
</script>

<template>
  <TemplateSelector
    v-if="canShowSelector"
    v-bind="selector.props.value"
    @select="selector.onSelect"
  />
</template>
```
</details>

## 💡 最佳实践

### ✅ 推荐

```vue
<!-- 简洁、类型安全 -->
<TemplateSelector
  v-if="selector?.enabled"
  v-bind="selector.props.value"
  @select="selector.onSelect"
/>
```

### ❌ 不推荐

```vue
<!-- 忽略 enabled 标志 -->
<TemplateSelector
  v-if="selector"
  v-bind="selector.props.value"
  @select="selector.onSelect"
/>

<!-- 手动传递属性，容易出错 -->
<TemplateSelector
  :category="selector.props.value.category"
  :device="selector.props.value.device"
  ...
/>
```

## 🔗 相关链接

- [模板系统文档](./README.md)
- [创建自定义模板](./docs/CUSTOM_TEMPLATE.md)
- [模板继承系统](./docs/TEMPLATE_INHERITANCE.md)
- [模板主题系统](./docs/THEME_SYSTEM.md)

## 🎉 总结

这次优化让模板选择器变得：

- **更灵活** - 每个模板决定自己的选择器位置
- **更优雅** - 选择器成为模板设计的一部分
- **更强大** - 支持条件显示、权限控制等高级功能
- **更易用** - 3 行代码即可集成

开始使用吧！如有问题，请查阅完整文档或提交 Issue。

---

**上次更新**: 2024-10
**版本要求**: @ldesign/template >= 2.0.0

