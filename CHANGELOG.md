# Changelog

All notable changes to @ldesign/template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-XX-XX (Work in Progress)

### 🎉 Major Changes

#### CSS 变量主题系统
- **✨ 新功能** 引入基于 CSS 变量的完整主题系统
- **✨ 新功能** 支持运行时主题切换，无需重新编译
- **✨ 新功能** 内置深色模式支持（浅色/深色/跟随系统）
- **✨ 新功能** 200+ CSS 变量覆盖所有样式属性
- **✨ 新功能** 与 @ldesign/color 和 @ldesign/size 完整集成

### ✨ Added

#### 主题管理
- 新增 `initTemplateTheme` 函数用于初始化主题系统
- 新增 `TemplateThemeManager` 类管理主题状态
- 新增 `useTemplateTheme` Vue Composable
- 新增 `injectCSSVariables` 工具函数
- 新增 `getCSSVariable` 工具函数
- 新增 `removeCSSVariable` 工具函数

#### CSS 变量
- 新增 `/styles/variables.css` 定义所有主题变量
- 新增颜色变量系列（`--template-text-*`、`--template-bg-*`、`--template-border-*` 等）
- 新增尺寸变量系列（`--template-spacing-*`、`--template-font-*`、`--template-radius-*` 等）
- 新增组件专用变量（Login、Dashboard、Form、List）
- 新增动画变量（`--template-duration-*`、`--template-ease-*`）
- 新增过渡变量（`--template-transition-*`）

#### 导出路径
- 新增 `@ldesign/template/theme` 导出主题工具
- 新增 `@ldesign/template/styles/variables.css` 导出变量文件

#### 文档
- 新增 `docs/CSS_VARIABLES.md` - CSS 变量完整文档
- 新增 `docs/MIGRATION_V2.md` - V2 迁移指南
- 新增 `docs/V2_IMPLEMENTATION_STATUS.md` - 实施状态报告

### 🔄 Changed

#### 模板组件重构
所有模板组件的内联样式已重构为使用 CSS 变量：

**已重构的模板：**
- ✅ Login / Desktop / Default
- ✅ Login / Desktop / Split
- ✅ Login / Mobile / Default
- ✅ Dashboard / Desktop / Default
- ✅ Form / Desktop / Single Column
- ✅ List / Desktop / Table

**待重构的模板：**
- ⏳ Login / Mobile / Card
- ⏳ Login / Tablet / Default
- ⏳ Login / Tablet / Simple
- ⏳ Dashboard / Desktop / Sidebar
- ⏳ Dashboard / Mobile / Default
- ⏳ Dashboard / Mobile / Tabs
- ⏳ Dashboard / Tablet / Default
- ⏳ Dashboard / Tablet / Grid
- ⏳ Form / Desktop / Double Column
- ⏳ List / Desktop / Card

#### 样式改进
- 所有硬编码颜色值替换为语义化CSS变量
- 所有硬编码尺寸值替换为响应式CSS变量
- 统一的过渡动画效果
- 更好的深色模式支持

### 💥 Breaking Changes

#### 必须初始化主题系统
```typescript
// v1.x - 无需额外步骤
import { TemplateProvider } from '@ldesign/template'

// v2.0 - 需要初始化主题
import { initTemplateTheme } from '@ldesign/template/theme'
await initTemplateTheme()

// 或手动引入 CSS 变量
import '@ldesign/template/styles/variables.css'
```

#### 自定义样式需要更新
如果你覆盖了模板组件的默认样式，需要更新为使用CSS变量：

```css
/* v1.x */
.my-login {
  background: #ffffff;
  color: #333;
  padding: 24px;
}

/* v2.0 */
.my-login {
  background: var(--template-bg-container);
  color: var(--template-text-primary);
  padding: var(--template-spacing-2xl);
}
```

#### 不再支持 IE 11
v2.0 依赖 CSS 变量特性，不再支持 IE 11。如果必须支持 IE 11，请继续使用 v1.x。

### 📝 Migration

请参阅 [V2 迁移指南](./docs/MIGRATION_V2.md) 获取详细的迁移步骤。

### 🐛 Fixed
- 修复深色模式下某些组件对比度不足的问题
- 修复主题切换时闪烁的问题
- 修复移动端样式在某些设备上显示异常

### ⚡ Performance
- CSS 变量比内联样式性能更好
- 主题切换无需重新渲染组件
- 更小的打包体积（变量复用）

### 📚 Documentation
- 完善的 CSS 变量文档
- 详细的迁移指南
- 主题系统使用示例
- API 参考文档更新

### 🔧 Internal
- 重构模板组件样式系统
- 优化构建配置
- 改进类型定义

---

## [0.2.0] - Previous Version

### Added
- 智能三级缓存系统
- IndexedDB 持久化支持
- SSR/SSG 支持
- 版本管理功能
- A/B 测试引擎
- DevTools 集成
- 可视化编辑器

### Changed
- 性能优化改进
- 内存管理优化
- 缓存策略改进

### Fixed
- 各种 bug 修复
- 性能瓶颈优化

---

## Migration Checklist from v1.x to v2.0

### 必须操作
- [ ] 更新包版本到 2.0.0
- [ ] 初始化主题系统或引入 CSS 变量文件
- [ ] 测试浅色模式显示正常
- [ ] 测试深色模式显示正常

### 可选操作
- [ ] 更新自定义样式为 CSS 变量
- [ ] 集成 @ldesign/color 主题管理
- [ ] 集成 @ldesign/size 尺寸管理
- [ ] 添加主题切换功能
- [ ] 更新项目文档

### 检查项
- [ ] 所有模板正常显示
- [ ] 主题切换功能正常
- [ ] 深色模式对比度合适
- [ ] 自定义样式未被覆盖
- [ ] 性能无明显下降
- [ ] 构建打包正常
- [ ] 类型检查通过

---

## Links

- [CSS Variables Documentation](./docs/CSS_VARIABLES.md)
- [Migration Guide](./docs/MIGRATION_V2.md)
- [Implementation Status](./docs/V2_IMPLEMENTATION_STATUS.md)
- [Main README](./README.md)

---

## Support

如有问题，请：
1. 查看 [Migration Guide](./docs/MIGRATION_V2.md)
2. 查看 [CSS Variables Documentation](./docs/CSS_VARIABLES.md)
3. 提交 [Issue](https://github.com/ldesign-org/template/issues)

---

**Note:** v2.0 目前处于开发阶段（Work in Progress）。部分模板组件的 CSS 变量重构仍在进行中。完整的重构进度请查看 [Implementation Status](./docs/V2_IMPLEMENTATION_STATUS.md)。
