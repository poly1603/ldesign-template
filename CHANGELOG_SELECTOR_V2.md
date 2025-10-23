# 模板选择器优化 - 变更日志

## [2.0.0] - 2024-10

### 🎉 重大变更

#### 模板选择器位置控制权转移

模板选择器不再固定在页面右上角，而是由模板组件自己决定放置位置。

**之前 (v1.x)**:
```vue
<!-- 选择器自动显示在右上角，无法控制 -->
<template>
  <div class="my-template">
    <!-- 内容 -->
  </div>
</template>
```

**现在 (v2.x)**:
```vue
<script setup lang="ts">
import { useTemplateSelector, TemplateSelector } from '@ldesign/template'
const selector = useTemplateSelector()
</script>

<template>
  <div class="my-template">
    <!-- 可以在任何位置放置选择器 -->
    <TemplateSelector
      v-if="selector?.enabled"
      v-bind="selector.props.value"
      @select="selector.onSelect"
    />
  </div>
</template>
```

### ✨ 新增功能

#### 1. 新增 Composable

- **`useTemplateSelector()`**: 获取模板选择器控制
  ```typescript
  const selector = useTemplateSelector()
  // 返回: TemplateSelectorInjection | null
  ```

#### 2. 新增类型

- **`TemplateSelectorInjection`**: 选择器注入数据的类型定义
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

#### 3. 新增工具脚本

- **`scripts/add-template-selector.js`**: 自动为模板添加选择器支持
  ```bash
  node scripts/add-template-selector.js <template-file> [position]
  ```

### 🔧 修改

#### TemplateRenderer 组件

**文件**: `src/components/TemplateRenderer.vue`

- ✅ 移除了直接渲染 `TemplateSelector` 组件
- ✅ 通过 `provide` 向子组件提供选择器控制
- ✅ 保留 `showSelector` 属性用于全局控制

**提供的数据**:
```typescript
provide('templateSelector', {
  props: computed(() => ({
    category: props.category,
    device: currentDevice.value,
    currentTemplate: currentName.value,
  })),
  onSelect: handleSelectorSelect,
  enabled: props.showSelector,
})
```

#### TemplateSelector 组件

**文件**: `src/components/TemplateSelector.vue`

- ✅ 样式从 `position: fixed` 改为 `position: relative`
- ✅ 调整 z-index 为相对值（999 → 相对定位）
- ✅ 支持灵活嵌入到任意位置

**样式变更**:
```css
/* 之前 */
.template-selector {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

/* 现在 */
.template-selector {
  position: relative;
  display: inline-block;
  z-index: 999;
}
```

### 📦 更新的模板示例

以下内置模板已更新，展示不同的使用场景：

1. **dashboard/desktop/default**
   - 位置：Header 右侧
   - 与用户信息并排显示

2. **login/desktop/default**
   - 位置：页面左上角（绝对定位）
   - 不干扰登录表单

3. **form/desktop/single-column**
   - 位置：表单标题右侧
   - 作为表单配置的一部分

### 📚 新增文档

1. **[完整使用指南](./docs/TEMPLATE_SELECTOR_GUIDE.md)**
   - 核心概念
   - 详细示例（4+ 种场景）
   - 高级用法
   - API 参考
   - 迁移指南
   - 常见问题

2. **[快速参考](./docs/QUICK_REFERENCE_SELECTOR.md)**
   - 3 步快速开始
   - 常见位置代码片段
   - 样式定制
   - 故障排查

3. **[优化说明](./SELECTOR_OPTIMIZATION.md)**
   - 优化背景
   - 技术实现
   - 文件变更清单
   - 测试检查

4. **[完成报告](./TEMPLATE_SELECTOR_OPTIMIZATION_COMPLETE.md)**
   - 优化总结
   - 完整 API 参考
   - 使用示例集合

5. **[更新指南](./SELECTOR_UPDATE_README.md)**
   - 快速开始
   - 文档导航
   - 常见问题

### 🔄 导出更新

#### src/composables/index.ts
```typescript
// 新增导出
export {
  type TemplateSelectorInjection,
  useTemplateSelector
} from './useTemplateSelector'
```

#### src/index.ts
```typescript
// 新增函数导出
export {
  // ... 其他导出
  useTemplateSelector,  // ← 新增
} from './composables'

// 新增类型导出
export type {
  // ... 其他类型
  TemplateSelectorInjection,  // ← 新增
} from './composables'
```

### ⚠️ 破坏性变更

#### 选择器不再自动显示

**影响**: 如果你的模板组件没有使用 `useTemplateSelector`，选择器将不会显示。

**迁移方法**:

1. 在模板组件的 `<script setup>` 中添加：
   ```typescript
   import { useTemplateSelector, TemplateSelector } from '@ldesign/template'
   const selector = useTemplateSelector()
   ```

2. 在模板中合适的位置添加：
   ```vue
   <TemplateSelector
     v-if="selector?.enabled"
     v-bind="selector.props.value"
     @select="selector.onSelect"
   />
   ```

3. 根据需要添加样式调整位置

**自动化工具**:
```bash
node scripts/add-template-selector.js <your-template-file> [position]
```

### ✅ 向后兼容

#### 不影响的部分

- ✅ `TemplateRenderer` 的所有 props 保持不变
- ✅ `showSelector` 属性仍然有效（控制全局开关）
- ✅ 没有使用选择器的模板仍然可以正常工作（只是不显示选择器）
- ✅ 所有其他功能完全不受影响

#### 推荐迁移时机

- **新项目**: 立即使用新方式
- **现有项目**: 可以逐步迁移，不影响现有功能
- **生产环境**: 建议先在开发环境测试

### 📊 优化效果

#### 灵活性提升
- ✅ 每个模板可以自定义选择器位置
- ✅ 支持条件显示和权限控制
- ✅ 可以完全自定义样式

#### 代码质量
- ✅ 更好的关注点分离
- ✅ 更清晰的代码组织
- ✅ 更强的类型安全

#### 用户体验
- ✅ 选择器位置符合界面设计
- ✅ 不会意外遮挡重要内容
- ✅ 与模板风格统一

#### 可维护性
- ✅ 选择器成为模板的一部分，易于理解
- ✅ 减少全局依赖
- ✅ 便于测试和调试

### 🔍 测试覆盖

- ✅ TemplateRenderer 正确提供选择器控制
- ✅ useTemplateSelector 可以正确获取数据
- ✅ 选择器在模板中可以正常渲染
- ✅ 选择器的样式可以被自定义
- ✅ 选择模板功能正常工作
- ✅ showSelector=false 时选择器不显示
- ✅ 没有使用选择器的模板仍然正常工作
- ✅ 类型定义完整且正确
- ✅ 无 linter 错误
- ✅ 文档清晰完整

### 🐛 Bug 修复

无（此版本为功能优化，无 bug 修复）

### 📝 开发者注意事项

#### 创建新模板时

1. 参考[快速参考](./docs/QUICK_REFERENCE_SELECTOR.md)
2. 根据模板类型选择合适的选择器位置
3. 考虑添加权限控制（如需要）
4. 确保样式在不同设备上正常工作

#### 更新现有模板时

1. 使用自动化脚本或手动添加
2. 测试选择器功能
3. 调整样式确保与模板风格一致
4. 更新相关文档

### 🎯 下一步计划

1. **v2.1.0**: 更新所有内置模板
2. **v2.2.0**: CLI 工具集成（自动生成带选择器的模板）
3. **v2.3.0**: 可视化配置工具
4. **v2.4.0**: 更多主题和样式预设

### 💬 反馈

如有任何问题、建议或 bug 报告，请：

1. 查阅相关文档
2. 搜索现有 Issues
3. 创建新的 Issue（如有必要）

### 🙏 致谢

感谢所有贡献者和使用者的反馈，让模板系统变得更加强大和易用！

---

**版本**: 2.0.0
**发布日期**: 2024-10
**兼容性**: @ldesign/template >= 2.0.0

