# V2 迁移指南

> 从 @ldesign/template v1.x 迁移到 v2.0 的完整指南

## 📋 目录

- [概述](#概述)
- [破坏性更改](#破坏性更改)
- [迁移步骤](#迁移步骤)
- [代码对比](#代码对比)
- [常见问题](#常见问题)

## 概述

v2.0 版本引入了基于 CSS 变量的主题系统，提供更好的主题切换能力和与 @ldesign/color、@ldesign/size 包的集成。

### 主要变更

1. **CSS 变量系统** - 所有硬编码的颜色和尺寸值替换为 CSS 变量
2. **主题管理** - 新增主题初始化和切换 API
3. **更好的可定制性** - 通过 CSS 变量轻松自定义样式
4. **深色模式支持** - 内置浅色/深色主题切换

### 优势

- ✅ 运行时主题切换无需重新编译
- ✅ 与 color 和 size 包无缝集成
- ✅ 更小的包体积（CSS 变量比内联样式更高效）
- ✅ 更好的浏览器兼容性
- ✅ 支持自定义主题配色

## 破坏性更改

### 1. 需要引入 CSS 变量文件

**v1.x**
```typescript
// 无需额外引入
import { TemplateProvider } from '@ldesign/template'
```

**v2.0**
```typescript
// 需要初始化主题或手动引入 CSS
import { initTemplateTheme } from '@ldesign/template/theme'
await initTemplateTheme()

// 或手动引入
import '@ldesign/template/styles/variables.css'
```

### 2. 某些内联样式被移除

v2.0 中，所有硬编码的颜色值（如 `#667eea`、`#333`）和尺寸值（如 `24px`、`16px`）都被替换为 CSS 变量。

如果你直接修改了模板组件的样式，需要更新为使用 CSS 变量。

### 3. 深色模式需要显式启用

**v1.x**
```typescript
// 没有内置深色模式支持
```

**v2.0**
```typescript
import { initTemplateTheme } from '@ldesign/template/theme'

await initTemplateTheme({
  mode: 'dark' // 或 'light' 或 'auto'
})
```

## 迁移步骤

### 步骤 1：更新包版本

```bash
# 使用 pnpm
pnpm add @ldesign/template@^2.0.0

# 使用 npm
npm install @ldesign/template@^2.0.0

# 使用 yarn
yarn add @ldesign/template@^2.0.0
```

### 步骤 2：初始化主题系统

在应用入口处初始化主题：

```typescript
// main.ts 或 App.vue
import { createApp } from 'vue'
import { initTemplateTheme } from '@ldesign/template/theme'
import App from './App.vue'

// 初始化主题
await initTemplateTheme({
  mode: 'light',
  autoInjectVariables: true,
  followSystemTheme: true
})

const app = createApp(App)
app.mount('#app')
```

### 步骤 3：检查自定义样式

如果你有自定义样式覆盖了模板组件的默认样式，需要更新为使用 CSS 变量：

**更新前**
```css
.my-login-page .login-container {
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  color: #333;
}
```

**更新后**
```css
.my-login-page .login-container {
  background: var(--template-login-card-bg);
  padding: var(--template-login-card-padding);
  border-radius: var(--template-login-card-radius);
  color: var(--template-text-primary);
}
```

### 步骤 4：集成 @ldesign/color 和 @ldesign/size（可选）

如果你的项目使用了 @ldesign/color 和 @ldesign/size 包，确保它们也已初始化：

```typescript
import { defaultThemeManager } from '@ldesign/color'
import { sizeManager } from '@ldesign/size'
import { initTemplateTheme } from '@ldesign/template/theme'

// 初始化 color 主题
defaultThemeManager.applyTheme('#0079eb')

// 初始化 size 配置
sizeManager.setPreset('medium')

// 初始化 template 主题
await initTemplateTheme({
  mode: 'light'
})
```

### 步骤 5：测试主题切换

添加主题切换功能以测试主题系统：

```vue
<script setup>
import { useTemplateTheme } from '@ldesign/template/theme'

const { isDark, toggle } = useTemplateTheme()
</script>

<template>
  <button @click="toggle">
    切换到 {{ isDark ? '浅色' : '深色' }} 模式
  </button>
</template>
```

## 代码对比

### 示例 1：Login 组件样式

**v1.x**
```vue
<style scoped>
.login-desktop-default {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 32px;
}

.login-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-header h1 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  color: #333;
}

.btn-primary {
  background: #667eea;
  color: white;
  font-size: 16px;
  padding: 12px;
}

.btn-primary:hover {
  background: #5568d3;
}
</style>
```

**v2.0**
```vue
<style scoped>
.login-desktop-default {
  background: linear-gradient(
    135deg,
    var(--template-login-bg-gradient-start) 0%,
    var(--template-login-bg-gradient-end) 100%
  );
  padding: var(--template-login-card-padding);
}

.login-container {
  background: var(--template-login-card-bg);
  border-radius: var(--template-login-card-radius);
  box-shadow: var(--template-login-card-shadow);
}

.login-header h1 {
  font-size: var(--template-font-xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
}

.form-group input {
  padding: var(--template-login-input-padding);
  font-size: var(--template-font-base);
  border: var(--template-border-width-thin) solid var(--template-border-input);
  color: var(--template-text-primary);
}

.btn-primary {
  background: var(--template-primary);
  color: var(--template-text-inverse);
  font-size: var(--template-font-md);
  padding: var(--template-login-button-padding);
}

.btn-primary:hover:not(:disabled) {
  background: var(--template-primary-hover);
}
</style>
```

### 示例 2：Dashboard 组件样式

**v1.x**
```vue
<style scoped>
.dashboard-desktop-default {
  background: #f5f5f5;
}

.dashboard-header {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 24px;
}

.dashboard-header h1 {
  font-size: 20px;
  color: #333;
}

.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e0e0e0;
}

.nav-item {
  padding: 12px 24px;
  color: #666;
}

.nav-item:hover {
  color: #667eea;
  background: #f5f7fa;
}

.stat-card {
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
```

**v2.0**
```vue
<style scoped>
.dashboard-desktop-default {
  background: var(--template-dashboard-content-bg);
}

.dashboard-header {
  height: var(--template-dashboard-header-height);
  background: var(--template-dashboard-header-bg);
  border-bottom: var(--template-border-width-thin) solid var(--template-border-light);
  padding: 0 var(--template-spacing-2xl);
}

.dashboard-header h1 {
  font-size: var(--template-font-xl);
  color: var(--template-text-primary);
}

.sidebar {
  width: var(--template-dashboard-sidebar-width);
  background: var(--template-dashboard-sidebar-bg);
  border-right: var(--template-border-width-thin) solid var(--template-border-light);
}

.nav-item {
  padding: var(--template-spacing-lg) var(--template-spacing-2xl);
  color: var(--template-text-secondary);
}

.nav-item:hover {
  color: var(--template-primary);
  background: var(--template-primary-lighter);
}

.stat-card {
  padding: var(--template-dashboard-card-padding);
  background: var(--template-dashboard-card-bg);
  border-radius: var(--template-dashboard-card-radius);
  box-shadow: var(--template-dashboard-card-shadow);
}
</style>
```

### 示例 3：主题初始化

**v1.x**
```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// 没有主题系统
```

**v2.0**
```typescript
// main.ts
import { createApp } from 'vue'
import { initTemplateTheme } from '@ldesign/template/theme'
import App from './App.vue'

// 初始化主题系统
await initTemplateTheme({
  mode: 'light',
  autoInjectVariables: true,
  followSystemTheme: true,
  onChange: (mode) => {
    console.log('主题切换到:', mode)
  }
})

const app = createApp(App)
app.mount('#app')
```

### 示例 4：自定义主题

**v1.x**
```css
/* 需要覆盖每个具体的类 */
.login-desktop-default {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%) !important;
}

.btn-primary {
  background: #ff6b6b !important;
}

.btn-primary:hover {
  background: #ee5a6f !important;
}

/* 需要在多个地方重复... */
```

**v2.0**
```css
/* 只需覆盖 CSS 变量 */
:root {
  --template-login-bg-gradient-start: #ff6b6b;
  --template-login-bg-gradient-end: #ee5a6f;
  --template-primary: #ff6b6b;
  --template-primary-hover: #ee5a6f;
  --template-primary-active: #fa5252;
}

/* 所有使用这些变量的地方都会自动更新 */
```

## 常见问题

### Q1: 升级后样式丢失或不正确？

**A:** 确保已经初始化主题系统或手动引入了 CSS 变量文件：

```typescript
import { initTemplateTheme } from '@ldesign/template/theme'
await initTemplateTheme()

// 或
import '@ldesign/template/styles/variables.css'
```

### Q2: 如何保留 v1.x 的硬编码颜色？

**A:** 可以通过 CSS 变量覆盖来恢复 v1.x 的默认颜色：

```css
:root {
  --template-primary: #667eea;
  --template-primary-hover: #5568d3;
  /* ... 其他颜色 */
}
```

### Q3: 可以同时使用 v1.x 和 v2.0 吗？

**A:** 不建议。v2.0 是 v1.x 的完全替代版本，建议完全迁移到 v2.0。

### Q4: 深色模式如何工作？

**A:** 深色模式通过 `data-theme-mode` 属性切换：

```html
<!-- 浅色模式 -->
<html data-theme-mode="light">

<!-- 深色模式 -->
<html data-theme-mode="dark">
```

CSS 变量会根据这个属性自动切换值。

### Q5: 如何在不同页面使用不同主题？

**A:** 可以在页面组件中使用 `injectCSSVariables` 局部覆盖：

```vue
<script setup>
import { injectCSSVariables } from '@ldesign/template/theme'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  injectCSSVariables({
    '--template-primary': '#ff6b6b'
  })
})

onUnmounted(() => {
  // 恢复默认值
  injectCSSVariables({
    '--template-primary': '#0079eb'
  })
})
</script>
```

### Q6: 如何禁用主题切换功能？

**A:** 初始化时设置固定主题并禁用系统主题跟随：

```typescript
await initTemplateTheme({
  mode: 'light',
  followSystemTheme: false
})
```

### Q7: 性能会受影响吗？

**A:** 不会。CSS 变量的性能与硬编码值相当，甚至在某些情况下更好：

- ✅ 运行时切换无需重新渲染
- ✅ 更小的 CSS 文件（变量复用）
- ✅ 浏览器原生支持，无需 JS 运行时

### Q8: IE 11 不支持怎么办？

**A:** v2.0 不支持 IE 11。如果必须支持 IE 11，请继续使用 v1.x 或考虑使用 PostCSS 等工具进行降级处理。

## 获取帮助

如果在迁移过程中遇到问题：

1. 查看 [CSS 变量使用指南](./CSS_VARIABLES.md)
2. 查看 [主 README](../README.md)
3. 提交 [Issue](https://github.com/ldesign-org/template/issues)

## 版本对照表

| 特性 | v1.x | v2.0 |
|------|------|------|
| CSS 变量系统 | ❌ | ✅ |
| 主题切换 API | ❌ | ✅ |
| 深色模式 | ❌ | ✅ |
| @ldesign/color 集成 | ⚠️ 部分 | ✅ 完整 |
| @ldesign/size 集成 | ⚠️ 部分 | ✅ 完整 |
| 运行时主题定制 | ❌ | ✅ |
| TypeScript 支持 | ✅ | ✅ |
| Vue 3 支持 | ✅ | ✅ |
| IE 11 支持 | ✅ | ❌ |

## 迁移检查清单

- [ ] 更新包版本到 v2.0
- [ ] 初始化主题系统或引入 CSS 变量文件
- [ ] 检查并更新自定义样式
- [ ] 集成 @ldesign/color 和 @ldesign/size（如果使用）
- [ ] 测试浅色模式显示
- [ ] 测试深色模式显示
- [ ] 测试主题切换功能
- [ ] 更新相关文档
- [ ] 移除 v1.x 的兼容代码

祝迁移顺利！🎉


