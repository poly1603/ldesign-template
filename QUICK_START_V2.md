# 🚀 @ldesign/template V2.0 快速开始

## 安装

```bash
pnpm add @ldesign/template@^2.0.0
```

## 基本使用

### 1. 初始化主题

```typescript
// main.ts
import { initTemplateTheme } from '@ldesign/template/theme'

await initTemplateTheme({
  mode: 'light',  // 'light' | 'dark' | 'auto'
  autoInjectVariables: true,
  followSystemTheme: true
})
```

### 2. 使用主题 Composable

```vue
<script setup>
import { useTemplateTheme } from '@ldesign/template/theme'

const { mode, isDark, toggle, setMode } = useTemplateTheme()
</script>

<template>
  <button @click="toggle">
    切换主题 ({{ isDark ? '深色' : '浅色' }})
  </button>
</template>
```

### 3. 使用 CSS 变量

```vue
<style scoped>
.my-component {
  /* 颜色 */
  color: var(--template-text-primary);
  background: var(--template-bg-container);
  border: var(--template-border-width-thin) solid var(--template-border);
  
  /* 尺寸 */
  padding: var(--template-spacing-2xl);
  font-size: var(--template-font-base);
  border-radius: var(--template-radius-lg);
  
  /* 阴影和过渡 */
  box-shadow: var(--template-shadow-md);
  transition: var(--template-transition-all);
}
</style>
```

## 常用 CSS 变量

### 颜色
```css
--template-primary              /* 主色 */
--template-text-primary         /* 主要文本 */
--template-text-secondary       /* 次要文本 */
--template-bg-container         /* 容器背景 */
--template-bg-component         /* 组件背景 */
--template-border               /* 边框颜色 */
```

### 尺寸
```css
--template-spacing-xs           /* 4px */
--template-spacing-sm           /* 6px */
--template-spacing-md           /* 8px */
--template-spacing-lg           /* 12px */
--template-spacing-xl           /* 16px */
--template-spacing-2xl          /* 24px */

--template-font-sm              /* 12px */
--template-font-base            /* 14px */
--template-font-md              /* 16px */
--template-font-lg              /* 18px */
--template-font-xl              /* 20px */

--template-radius-sm            /* 4px */
--template-radius-md            /* 6px */
--template-radius-lg            /* 8px */
```

## 自定义主题

```css
/* 全局自定义 */
:root {
  --template-primary: #ff6b6b;
  --template-primary-hover: #ee5a6f;
}

/* 深色模式自定义 */
:root[data-theme-mode='dark'] {
  --template-primary: #ff8787;
}
```

或使用 JavaScript：

```typescript
import { injectCSSVariables } from '@ldesign/template/theme'

injectCSSVariables({
  '--template-primary': '#ff6b6b',
  '--template-radius-lg': '12px'
})
```

## 使用模板组件

```vue
<script setup>
import { TemplateRenderer } from '@ldesign/template'
</script>

<template>
  <TemplateRenderer
    category="login"
    device="desktop"
    template="default"
    :props="{
      title: '欢迎登录',
      subtitle: '请输入账号信息'
    }"
  />
</template>
```

## 查看演示

```bash
# 运行演示
pnpm dev

# 打开 demo/theme-demo.vue 查看效果
```

## 完整文档

- 📖 [CSS 变量完整列表](./docs/CSS_VARIABLES.md)
- 📖 [V2 迁移指南](./docs/MIGRATION_V2.md)
- 📖 [完整 README](./README.md)

## 主要变更（相比 V1.x）

- ✅ 新增 200+ CSS 变量
- ✅ 新增主题管理系统
- ✅ 新增深色模式支持
- ✅ 所有模板支持主题切换
- ⚠️ 需要初始化主题系统
- ⚠️ 不再支持 IE 11

## 快速问题解决

**Q: 样式不显示？**  
A: 确保已初始化主题或引入 CSS 变量文件

**Q: 如何切换主题？**  
A: 使用 `useTemplateTheme()` Composable 的 `toggle()` 方法

**Q: 如何自定义颜色？**  
A: 使用 `injectCSSVariables()` 或直接覆盖 CSS 变量

**Q: 支持哪些浏览器？**  
A: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+（不支持 IE 11）

---

**版本：** V2.0.0  
**更新：** 2024年  
**状态：** ✅ 稳定可用

