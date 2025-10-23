# 🌟 从这里开始 - @ldesign/template V2.0

> 欢迎使用 @ldesign/template V2.0！这是您开始使用的最佳起点。

## 🎯 您是...

### 🆕 新用户？
**推荐阅读顺序：**
1. 📖 [快速开始指南](./QUICK_START_V2.md) - 5 分钟快速上手
2. 🎨 [主题演示](./demo/theme-demo.vue) - 查看实际效果
3. 📚 [CSS 变量文档](./docs/CSS_VARIABLES.md) - 了解所有变量

### 🔄 从 V1 升级？
**推荐阅读顺序：**
1. 📖 [V2 迁移指南](./docs/MIGRATION_V2.md) - 了解如何升级
2. 📝 [变更日志](./CHANGELOG.md) - 查看所有变更
3. 📚 [CSS 变量文档](./docs/CSS_VARIABLES.md) - 学习新的变量系统

### 👨‍💻 开发者？
**推荐阅读顺序：**
1. 📖 [快速开始指南](./QUICK_START_V2.md) - 快速上手
2. 📚 [CSS 变量文档](./docs/CSS_VARIABLES.md) - 详细参考
3. 🎨 [主题演示](./demo/theme-demo.vue) - 学习最佳实践

### 📊 项目经理？
**推荐阅读顺序：**
1. 🎉 [项目完成报告](./🎉_V2_ALL_COMPLETE.md) - 了解项目成果
2. 🏆 [项目成就](./PROJECT_ACHIEVEMENT.md) - 查看价值和亮点
3. ✅ [执行摘要](./✅_EXECUTION_SUMMARY.md) - 了解执行详情

## ⚡ 快速开始

### 1. 安装

```bash
pnpm add @ldesign/template@^2.0.0
```

### 2. 初始化主题

```typescript
import { initTemplateTheme } from '@ldesign/template/theme'

await initTemplateTheme({
  mode: 'light',
  autoInjectVariables: true
})
```

### 3. 使用模板

```vue
<template>
  <TemplateRenderer
    category="login"
    device="desktop"
    template="default"
  />
</template>
```

### 4. 切换主题

```vue
<script setup>
import { useTemplateTheme } from '@ldesign/template/theme'

const { toggle, isDark } = useTemplateTheme()
</script>

<template>
  <button @click="toggle">
    {{ isDark ? '☀️ 浅色' : '🌙 深色' }}
  </button>
</template>
```

## 📚 完整文档

### 核心文档
- 📖 [快速开始指南](./QUICK_START_V2.md) - 快速上手
- 📖 [CSS 变量文档](./docs/CSS_VARIABLES.md) - 200+ 变量详解
- 📖 [V2 迁移指南](./docs/MIGRATION_V2.md) - 升级指南
- 📖 [主 README](./README.md) - 完整介绍

### 项目报告
- 🎉 [项目完成报告](./🎉_V2_ALL_COMPLETE.md) - 成果展示
- 🏆 [项目成就](./PROJECT_ACHIEVEMENT.md) - 价值分析
- ✅ [执行摘要](./✅_EXECUTION_SUMMARY.md) - 执行详情
- 🎊 [项目完成总结](./🎊_项目完成总结.md) - 中文总结

### 其他文档
- 📚 [文档索引](./📚_DOCS_INDEX.md) - 所有文档导航
- 📊 [实施状态](./docs/V2_IMPLEMENTATION_STATUS.md) - 详细进度
- 📝 [工作总结](./V2_SUMMARY.md) - 技术总结
- 📋 [变更日志](./CHANGELOG.md) - 版本变更

## 🎨 主要特性

### ✨ 主题系统
- Light/Dark/Auto 三种模式
- 运行时切换
- 跟随系统主题
- 自定义配色

### 🎯 CSS 变量
- 200+ 语义化变量
- 统一命名规范
- 完整的后备值
- 深色模式支持

### 🔗 生态集成
- @ldesign/color 集成
- @ldesign/size 集成
- Vue 3 支持
- TypeScript 支持

### 📱 模板组件
- 16 个模板全部支持主题切换
- Login、Dashboard、Form、List
- Desktop、Mobile、Tablet 全覆盖

## 💡 常见问题

### Q: 如何快速上手？
**A:** 阅读 [快速开始指南](./QUICK_START_V2.md)，5 分钟即可上手。

### Q: 有哪些 CSS 变量可用？
**A:** 查看 [CSS 变量文档](./docs/CSS_VARIABLES.md)，包含 200+ 变量的完整列表。

### Q: 如何从 V1 升级？
**A:** 参考 [V2 迁移指南](./docs/MIGRATION_V2.md)，有详细的步骤和示例。

### Q: 如何切换主题？
**A:** 使用 `useTemplateTheme()` Composable 的 `toggle()` 方法。

### Q: 如何自定义颜色？
**A:** 覆盖 CSS 变量或使用 `injectCSSVariables()` 函数。

### Q: 支持哪些浏览器？
**A:** Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+（不支持 IE 11）

## 🎬 查看演示

运行演示页面：

```bash
cd packages/template
pnpm dev
# 打开 demo/theme-demo.vue
```

演示内容：
- ✅ 主题模式切换
- ✅ 自定义颜色选择
- ✅ 变量效果预览
- ✅ 组件样式展示

## 📞 获取帮助

### 文档导航
所有文档都在 [📚 文档索引](./📚_DOCS_INDEX.md) 中分类导航。

### 问题排查
1. 查看 [快速开始](./QUICK_START_V2.md) 的常见问题
2. 查看 [迁移指南](./docs/MIGRATION_V2.md) 的 FAQ
3. 提交 [Issue](https://github.com/ldesign-org/template/issues)

## 🎯 推荐路径

### 路径 A：快速使用
```
快速开始指南 → 运行演示 → 开始使用
```

### 路径 B：深入学习
```
主 README → CSS 变量文档 → 主题演示 → 最佳实践
```

### 路径 C：项目升级
```
迁移指南 → 变更日志 → CSS 变量文档 → 测试验证
```

## ✅ 核心优势

### 开发者
- ✅ 简单易用的 API
- ✅ 完整的 TypeScript 支持
- ✅ 详尽的文档和示例
- ✅ 统一的设计规范

### 用户
- ✅ 深色模式支持
- ✅ 主题自定义
- ✅ 流畅的切换体验
- ✅ 一致的视觉体验

### 团队
- ✅ 降低开发成本
- ✅ 提高开发效率
- ✅ 统一技术标准
- ✅ 易于维护扩展

## 🎊 立即开始

### 步骤 1：安装包
```bash
pnpm add @ldesign/template@^2.0.0
```

### 步骤 2：初始化
```typescript
import { initTemplateTheme } from '@ldesign/template/theme'
await initTemplateTheme()
```

### 步骤 3：开始使用
```vue
<style scoped>
.my-component {
  background: var(--template-bg-container);
  color: var(--template-text-primary);
  padding: var(--template-spacing-2xl);
}
</style>
```

## 🔗 相关链接

- [主 README](./README.md)
- [快速开始](./QUICK_START_V2.md)
- [文档索引](./📚_DOCS_INDEX.md)
- [项目完成报告](./🎉_V2_ALL_COMPLETE.md)

---

## 🎉 欢迎使用！

**@ldesign/template V2.0** 已经准备就绪，期待您的使用反馈！

**版本：** V2.0.0  
**状态：** ✅ 稳定可用  
**更新：** 2024年

**立即开始 → [QUICK_START_V2.md](./QUICK_START_V2.md)**

