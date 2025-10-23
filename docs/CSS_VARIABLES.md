# CSS 变量使用指南

> @ldesign/template 的 CSS 变量系统完整文档

## 📖 目录

- [快速开始](#快速开始)
- [变量命名规范](#变量命名规范)
- [颜色变量](#颜色变量)
- [尺寸变量](#尺寸变量)
- [模板专用变量](#模板专用变量)
- [主题切换](#主题切换)
- [自定义主题](#自定义主题)

## 快速开始

### 1. 引入 CSS 变量文件

```typescript
// 方式 1：自动注入（推荐）
import { initTemplateTheme } from '@ldesign/template/theme'

await initTemplateTheme({
  mode: 'light',
  autoInjectVariables: true
})

// 方式 2：手动引入
import '@ldesign/template/styles/variables.css'
```

### 2. 在组件中使用

```vue
<template>
  <div class="my-component">
    <h1>标题</h1>
    <p>内容</p>
  </div>
</template>

<style scoped>
.my-component {
  padding: var(--template-spacing-2xl);
  background: var(--template-bg-container);
  color: var(--template-text-primary);
  border-radius: var(--template-radius-lg);
}

h1 {
  font-size: var(--template-font-2xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
}

p {
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
}
</style>
```

## 变量命名规范

所有模板变量遵循 `--template-*` 命名规范，与 `@ldesign/color` (`--color-*`) 和 `@ldesign/size` (`--size-*`) 保持一致。

### 命名模式

```
--template-{category}-{property}-{variant}
```

示例：
- `--template-text-primary` - 主要文本颜色
- `--template-spacing-lg` - 大间距
- `--template-login-card-bg` - 登录卡片背景

## 颜色变量

### 背景颜色

```css
/* 页面和容器背景 */
--template-bg-page              /* 页面背景 */
--template-bg-container          /* 主容器背景 */
--template-bg-container-secondary /* 次级容器背景 */
--template-bg-container-tertiary  /* 三级容器背景 */
--template-bg-component          /* 组件背景 */
--template-bg-component-hover    /* 组件悬停背景 */
--template-bg-component-active   /* 组件激活背景 */
--template-bg-component-disabled /* 组件禁用背景 */

/* 特殊背景 */
--template-bg-overlay            /* 遮罩层背景 */
--template-bg-mask               /* 模态遮罩背景 */
--template-bg-tooltip            /* 提示框背景 */
--template-bg-popover            /* 弹出框背景 */

/* 状态背景 */
--template-bg-success            /* 成功背景 */
--template-bg-warning            /* 警告背景 */
--template-bg-error              /* 错误背景 */
--template-bg-info               /* 信息背景 */
```

### 文本颜色

```css
/* 文本层级 */
--template-text-primary          /* 主要文字 */
--template-text-secondary        /* 次要文字 */
--template-text-tertiary         /* 辅助文字 */
--template-text-quaternary       /* 四级文字 */
--template-text-disabled         /* 禁用文字 */
--template-text-placeholder      /* 占位符文字 */
--template-text-inverse          /* 反色文字 */
--template-text-inverse-secondary /* 反色次要文字 */

/* 链接颜色 */
--template-text-link             /* 链接文字 */
--template-text-link-hover       /* 链接悬停文字 */
--template-text-link-active      /* 链接激活文字 */
--template-text-link-visited     /* 已访问链接文字 */

/* 状态文字颜色 */
--template-text-success          /* 成功文字 */
--template-text-warning          /* 警告文字 */
--template-text-error            /* 错误文字 */
--template-text-info             /* 信息文字 */
```

### 边框颜色

```css
/* 默认边框 */
--template-border                /* 默认边框 */
--template-border-light          /* 浅色边框 */
--template-border-lighter        /* 更浅边框 */
--template-border-dark           /* 深色边框 */
--template-border-darker         /* 更深边框 */

/* 输入框边框 */
--template-border-input          /* 输入框边框 */
--template-border-input-hover    /* 输入框悬停边框 */
--template-border-input-focus    /* 输入框聚焦边框 */
--template-border-input-error    /* 输入框错误边框 */
--template-border-input-disabled /* 输入框禁用边框 */
```

### 主题色状态

```css
/* Primary 状态 */
--template-primary               /* 主色 */
--template-primary-lighter       /* 最浅 */
--template-primary-light         /* 浅色 */
--template-primary-hover         /* 悬停 */
--template-primary-active        /* 激活 */
--template-primary-darker        /* 深色 */
--template-primary-disabled      /* 禁用 */

/* Success、Warning、Error、Info 同样遵循此模式 */
--template-success
--template-success-lighter
--template-success-light
--template-success-hover
--template-success-active
--template-success-darker
--template-success-disabled

--template-warning-*
--template-error-*
--template-info-*
```

### 阴影

```css
--template-shadow-xs             /* 最小阴影 */
--template-shadow-sm             /* 小阴影 */
--template-shadow-md             /* 中等阴影 */
--template-shadow-lg             /* 大阴影 */
--template-shadow-xl             /* 超大阴影 */
--template-shadow-2xl            /* 巨大阴影 */
--template-shadow-inner          /* 内阴影 */
```

## 尺寸变量

### 间距系统

```css
--template-spacing-none          /* 0 */
--template-spacing-3xs           /* 1px */
--template-spacing-2xs           /* 2px */
--template-spacing-xs            /* 4px */
--template-spacing-sm            /* 6px */
--template-spacing-md            /* 8px */
--template-spacing-lg            /* 12px */
--template-spacing-xl            /* 16px */
--template-spacing-2xl           /* 24px */
--template-spacing-3xl           /* 32px */
--template-spacing-4xl           /* 48px */
```

### 字体尺寸

```css
--template-font-2xs              /* 10px */
--template-font-xs               /* 11px */
--template-font-sm               /* 12px */
--template-font-base             /* 14px */
--template-font-md               /* 16px */
--template-font-lg               /* 18px */
--template-font-xl               /* 20px */
--template-font-2xl              /* 24px */
--template-font-3xl              /* 30px */
--template-font-4xl              /* 36px */

/* 标题尺寸 */
--template-font-h1               /* 28px */
--template-font-h2               /* 24px */
--template-font-h3               /* 20px */
--template-font-h4               /* 18px */
--template-font-h5               /* 16px */
--template-font-h6               /* 14px */
```

### 圆角

```css
--template-radius-none           /* 0 */
--template-radius-xs             /* 2px */
--template-radius-sm             /* 4px */
--template-radius-md             /* 6px */
--template-radius-lg             /* 8px */
--template-radius-xl             /* 12px */
--template-radius-2xl            /* 16px */
--template-radius-3xl            /* 24px */
--template-radius-full           /* 9999px */
--template-radius-circle         /* 50% */
```

### 行高

```css
--template-line-none             /* 1.0 */
--template-line-tight            /* 1.25 */
--template-line-snug             /* 1.375 */
--template-line-normal           /* 1.5 */
--template-line-relaxed          /* 1.625 */
--template-line-loose            /* 2.0 */
```

### 字重

```css
--template-font-weight-thin      /* 100 */
--template-font-weight-extralight /* 200 */
--template-font-weight-light     /* 300 */
--template-font-weight-regular   /* 400 */
--template-font-weight-medium    /* 500 */
--template-font-weight-semibold  /* 600 */
--template-font-weight-bold      /* 700 */
--template-font-weight-extrabold /* 800 */
--template-font-weight-black     /* 900 */
```

### 组件尺寸

```css
/* 按钮 */
--template-btn-height-tiny       /* 24px */
--template-btn-height-small      /* 28px */
--template-btn-height-medium     /* 32px */
--template-btn-height-large      /* 36px */
--template-btn-height-huge       /* 40px */
--template-btn-padding-tiny      /* 0 8px */
--template-btn-padding-small     /* 0 10px */
--template-btn-padding-medium    /* 0 14px */
--template-btn-padding-large     /* 0 16px */
--template-btn-padding-huge      /* 0 20px */

/* 输入框 */
--template-input-height-small    /* 28px */
--template-input-height-medium   /* 32px */
--template-input-height-large    /* 36px */
--template-input-padding-small   /* 4px 8px */
--template-input-padding-medium  /* 6px 10px */
--template-input-padding-large   /* 8px 12px */
```

### 边框宽度

```css
--template-border-width-thin     /* 1px */
--template-border-width-medium   /* 2px */
--template-border-width-thick    /* 3px */
```

### 动画

```css
/* 持续时间 */
--template-duration-instant      /* 0ms */
--template-duration-fast         /* 150ms */
--template-duration-normal       /* 300ms */
--template-duration-slow         /* 450ms */
--template-duration-slower       /* 600ms */

/* 缓动函数 */
--template-ease-linear           /* linear */
--template-ease-in               /* cubic-bezier(0.4, 0, 1, 1) */
--template-ease-out              /* cubic-bezier(0, 0, 0.2, 1) */
--template-ease-in-out           /* cubic-bezier(0.4, 0, 0.2, 1) */
```

### Z-Index

```css
--template-z-dropdown            /* 1000 */
--template-z-sticky              /* 1020 */
--template-z-fixed               /* 1030 */
--template-z-modal-backdrop      /* 1040 */
--template-z-modal               /* 1050 */
--template-z-popover             /* 1060 */
--template-z-tooltip             /* 1070 */
```

## 模板专用变量

### Login 模板

```css
--template-login-bg-gradient-start    /* 渐变起始色 */
--template-login-bg-gradient-end      /* 渐变结束色 */
--template-login-card-bg              /* 卡片背景 */
--template-login-card-shadow          /* 卡片阴影 */
--template-login-card-radius          /* 卡片圆角 */
--template-login-card-padding         /* 卡片内边距 */
--template-login-input-height         /* 输入框高度 */
--template-login-input-padding        /* 输入框内边距 */
--template-login-button-height        /* 按钮高度 */
--template-login-button-padding       /* 按钮内边距 */
```

### Dashboard 模板

```css
--template-dashboard-header-height    /* Header 高度：60px */
--template-dashboard-header-bg        /* Header 背景 */
--template-dashboard-sidebar-width    /* 侧边栏宽度：240px */
--template-dashboard-sidebar-bg       /* 侧边栏背景 */
--template-dashboard-content-bg       /* 内容区背景 */
--template-dashboard-card-bg          /* 卡片背景 */
--template-dashboard-card-shadow      /* 卡片阴影 */
--template-dashboard-card-radius      /* 卡片圆角 */
--template-dashboard-card-padding     /* 卡片内边距 */
```

### Form 模板

```css
--template-form-max-width             /* 表单最大宽度：600px */
--template-form-gap                   /* 表单字段间距 */
--template-form-label-margin          /* 标签外边距 */
--template-form-input-border          /* 输入框边框 */
--template-form-input-border-focus    /* 输入框聚焦边框 */
--template-form-input-radius          /* 输入框圆角 */
--template-form-button-gap            /* 按钮间距 */
```

### List 模板

```css
--template-list-header-bg             /* 表头背景 */
--template-list-row-hover-bg          /* 行悬停背景 */
--template-list-border                /* 列表边框 */
--template-list-cell-padding          /* 单元格内边距 */
--template-list-row-height-small      /* 小行高：36px */
--template-list-row-height-medium     /* 中行高：44px */
--template-list-row-height-large      /* 大行高：52px */
```

### 通用变量

```css
--template-card-gap                   /* 卡片间距 */
--template-card-min-width             /* 卡片最小宽度：200px */

/* 移动端 */
--template-mobile-header-height       /* 移动端 Header 高度：56px */
--template-mobile-bottom-nav-height   /* 移动端底部导航高度：60px */
--template-mobile-padding             /* 移动端内边距 */

/* 平板 */
--template-tablet-sidebar-width       /* 平板侧边栏宽度：200px */
--template-tablet-padding             /* 平板内边距 */

/* 过渡动画 */
--template-transition-color           /* 颜色过渡 */
--template-transition-bg              /* 背景过渡 */
--template-transition-border          /* 边框过渡 */
--template-transition-transform       /* 变换过渡 */
--template-transition-all             /* 全部过渡 */
```

## 主题切换

### 使用 Vue Composable

```vue
<script setup>
import { useTemplateTheme } from '@ldesign/template/theme'

const { mode, actualMode, isDark, setMode, toggle } = useTemplateTheme()

// 切换主题
const switchTheme = () => {
  toggle() // 在 light 和 dark 之间切换
}

// 设置特定主题
const setLightTheme = () => {
  setMode('light')
}

const setDarkTheme = () => {
  setMode('dark')
}

const setAutoTheme = () => {
  setMode('auto') // 跟随系统
}
</script>

<template>
  <div>
    <p>当前模式: {{ mode }}</p>
    <p>实际应用: {{ actualMode }}</p>
    <p>是否深色: {{ isDark }}</p>
    <button @click="switchTheme">切换主题</button>
  </div>
</template>
```

### 使用主题管理器

```typescript
import { initTemplateTheme } from '@ldesign/template/theme'

const theme = await initTemplateTheme({
  mode: 'auto',
  followSystemTheme: true,
  onChange: (newMode) => {
    console.log('主题已切换到:', newMode)
  }
})

// 获取当前主题
const currentMode = theme.getMode()  // 'light' | 'dark' | 'auto'
const actualMode = theme.getActualMode()  // 'light' | 'dark'

// 设置主题
theme.setMode('dark')

// 切换主题
theme.toggle()

// 销毁主题管理器
theme.destroy()
```

## 自定义主题

### 覆盖 CSS 变量

```css
/* 在你的全局样式中 */
:root {
  /* 自定义主色 */
  --template-primary: #ff6b6b;
  --template-primary-hover: #ff5252;
  --template-primary-active: #ff3838;
  
  /* 自定义圆角 */
  --template-radius-lg: 12px;
  --template-radius-xl: 16px;
  
  /* 自定义间距 */
  --template-spacing-xl: 20px;
  --template-spacing-2xl: 28px;
  
  /* 自定义登录模板 */
  --template-login-bg-gradient-start: #667eea;
  --template-login-bg-gradient-end: #764ba2;
}

/* 深色模式自定义 */
:root[data-theme-mode='dark'] {
  --template-primary: #ff8787;
  --template-primary-hover: #ff6b6b;
}
```

### 使用 JavaScript 注入

```typescript
import { injectCSSVariables } from '@ldesign/template/theme'

injectCSSVariables({
  '--template-primary': '#ff6b6b',
  '--template-radius-lg': '12px',
  '--template-spacing-xl': '20px'
})
```

### 获取变量值

```typescript
import { getCSSVariable } from '@ldesign/template/theme'

const primaryColor = getCSSVariable('--template-primary')
console.log(primaryColor) // '#0079eb'
```

## 最佳实践

### 1. 优先使用语义化变量

```css
/* ✅ 推荐 */
.button {
  background: var(--template-primary);
  color: var(--template-text-inverse);
}

/* ❌ 不推荐 */
.button {
  background: #0079eb;
  color: white;
}
```

### 2. 使用模板专用变量

```css
/* ✅ 推荐 - 使用模板专用变量 */
.login-card {
  padding: var(--template-login-card-padding);
  background: var(--template-login-card-bg);
  border-radius: var(--template-login-card-radius);
  box-shadow: var(--template-login-card-shadow);
}

/* ⚠️ 可接受 - 使用通用变量 */
.login-card {
  padding: var(--template-spacing-2xl) var(--template-spacing-3xl);
  background: var(--template-bg-container);
  border-radius: var(--template-radius-lg);
  box-shadow: var(--template-shadow-xl);
}
```

### 3. 提供后备值

```css
/* ✅ 推荐 - 提供后备值 */
.text {
  color: var(--template-text-primary, #242424);
  font-size: var(--template-font-base, 14px);
}
```

### 4. 组合使用过渡变量

```css
/* ✅ 推荐 */
.button {
  transition: var(--template-transition-bg);
}

.link {
  transition: var(--template-transition-color);
}

/* 或组合多个 */
.card {
  transition: 
    var(--template-transition-bg),
    var(--template-transition-border),
    var(--template-transition-transform);
}
```

## 浏览器兼容性

CSS 变量在现代浏览器中广泛支持：

- ✅ Chrome 49+
- ✅ Firefox 31+
- ✅ Safari 9.1+
- ✅ Edge 15+
- ❌ IE 11 及以下（不支持）

对于不支持 CSS 变量的浏览器，建议：

1. 提供后备值
2. 使用 PostCSS 等工具进行降级处理
3. 考虑不支持旧浏览器

## 参考资源

- [色值源 - @ldesign/color](../../color/README.md)
- [尺寸源 - @ldesign/size](../../size/README.md)
- [V2 迁移指南](./MIGRATION_V2.md)
- [主 README](../README.md)


