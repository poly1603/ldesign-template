# @ldesign/template 🎨

<div align="center">
  <h1>高性能模板管理系统</h1>
  <p>为 Vue 3 打造的企业级动态模板渲染解决方案</p>
  
  [![npm version](https://img.shields.io/npm/v/@ldesign/template.svg)](https://www.npmjs.com/package/@ldesign/template)
  [![License](https://img.shields.io/npm/l/@ldesign/template.svg)](https://github.com/ldesign-org/template/blob/main/LICENSE)
  [![Downloads](https://img.shields.io/npm/dm/@ldesign/template.svg)](https://www.npmjs.com/package/@ldesign/template)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
  [![Vue 3](https://img.shields.io/badge/Vue-3.4+-green.svg)](https://vuejs.org/)
  [![Test Coverage](https://img.shields.io/badge/coverage-90%25+-brightgreen.svg)]()
</div>

## ✨ 特性

### 🚀 高性能
- **智能三级缓存** - 内存 → IndexedDB → 远程，毫秒级响应
- **虚拟滚动** - 轻松处理万级模板列表
- **懒加载** - 按需加载，首屏性能提升 50%+
- **Web Worker** - 复杂计算不阻塞主线程
- **预加载策略** - 智能预测，提前加载

### 🎯 企业级功能
- **版本管理** - 模板版本控制，安全回滚
- **A/B 测试** - 内置实验引擎，数据驱动决策
- **权限控制** - 细粒度访问控制
- **依赖管理** - 自动处理模板依赖关系
- **热更新** - 模板实时更新，无需重启

### 🛠️ 开发者友好
- **TypeScript** - 100% 类型覆盖，完美的类型推导
- **Vue DevTools** - 深度集成，调试体验极佳
- **可视化编辑器** - 拖拽式模板设计
- **性能监控** - 实时性能分析面板
- **丰富文档** - 详尽的 API 文档和示例

### 🎨 精美设计
- **响应式布局** - 完美适配各种设备
- **主题定制** - 灵活的主题系统
- **暗黑模式** - 自动适应系统设置
- **流畅动画** - 优雅的过渡效果
- **设计系统** - 统一的设计语言

### 🔒 安全可靠
- **XSS 防护** - 自动清理危险内容
- **CSRF 保护** - 内置安全机制
- **数据验证** - Schema 验证，类型安全
- **错误边界** - 优雅的错误处理
- **测试覆盖** - 90%+ 单元测试覆盖

## 📦 安装

```bash
# 使用 pnpm（推荐）
pnpm add @ldesign/template

# 使用 npm
npm install @ldesign/template

# 使用 yarn
yarn add @ldesign/template
```

## 🚀 快速开始

### 基础使用

```vue
<template>
  <TemplateRenderer 
    :template-id="templateId"
    :props="templateProps"
    @loaded="onTemplateLoaded"
    @error="onTemplateError"
  />
</template>

<script setup lang="ts">
import { TemplateRenderer } from '@ldesign/template'
import { ref } from 'vue'

const templateId = ref('login:desktop:default')
const templateProps = {
  title: '欢迎登录',
  logo: '/logo.svg',
  onSubmit: async (data) => {
    console.log('Login data:', data)
    // 处理登录逻辑
  }
}

const onTemplateLoaded = (metadata) => {
  console.log('模板加载完成:', metadata)
}

const onTemplateError = (error) => {
  console.error('模板加载失败:', error)
}
</script>
```

### 使用 Vue 插件

```typescript
// main.ts
import { createApp } from 'vue'
import { createTemplatePlugin } from '@ldesign/template'
import App from './App.vue'

const app = createApp(App)

// 安装插件
app.use(createTemplatePlugin({
  // 配置选项
  cache: {
    enabled: true,
    strategy: 'lru',
    maxSize: 100,
    ttl: 3600000 // 1小时
  },
  preload: ['login:desktop:default'], // 预加载模板
  theme: {
    mode: 'auto', // 'light' | 'dark' | 'auto'
    primaryColor: '#1890ff'
  }
}))

app.mount('#app')
```

### 使用 Composables

```vue
<script setup lang="ts">
import { useTemplate, useTemplateList } from '@ldesign/template'
import { ref, onMounted } from 'vue'

// 加载单个模板
const templateId = ref('dashboard:desktop:analytics')
const { 
  template, 
  component, 
  loading, 
  error, 
  load, 
  refresh 
} = useTemplate(templateId)

// 获取模板列表
const { 
  templates, 
  filter, 
  sort, 
  paginate 
} = useTemplateList({
  category: 'dashboard',
  device: 'desktop'
})

onMounted(async () => {
  await load()
  
  // 筛选模板
  const filtered = filter({ tags: ['analytics'] })
  
  // 排序模板
  const sorted = sort('popularity', 'desc')
})
</script>

<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <Spinner />
      加载中...
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <Alert type="error">{{ error.message }}</Alert>
    </div>
    
    <!-- 渲染模板 -->
    <component v-else-if="component" :is="component" />
    
    <!-- 模板列表 -->
    <div class="template-grid">
      <TemplateCard 
        v-for="tpl in templates" 
        :key="tpl.id"
        :template="tpl"
        @select="selectTemplate"
      />
    </div>
  </div>
</template>
```

## 🏗️ 架构设计

### Monorepo 结构

```
@ldesign/template/
├── packages/
│   ├── core/          # 框架无关的核心逻辑
│   │   ├── registry/  # 模板注册表
│   │   ├── manager/   # 模板管理器
│   │   ├── cache/     # 缓存系统
│   │   └── types/     # TypeScript 类型定义
│   │
│   └── vue/           # Vue 3 适配层
│       ├── components/    # Vue 组件
│       ├── composables/   # 组合式 API
│       ├── scanner/       # 模板扫描器
│       ├── plugin/        # Vue 插件
│       └── templates/     # 模板实现
│
├── examples/          # 示例项目
├── docs/             # 文档
└── tests/            # 测试
```

### 模板目录结构

模板采用三级目录结构：`功能分类/设备类型/模板名称`

```
templates/
├── login/           # 功能分类
│   ├── desktop/     # 设备类型
│   │   ├── default/     # 模板名称
│   │   │   ├── index.vue           # 组件实现
│   │   │   ├── template.config.ts  # 模板配置
│   │   │   └── preview.png         # 预览图
│   │   └── minimal/
│   ├── mobile/
│   └── tablet/
├── dashboard/
└── form/
```

## 📖 API 文档

### 组件

#### TemplateRenderer

动态渲染模板的核心组件。

```vue
<TemplateRenderer
  :template-id="string"           // 模板 ID
  :props="object"                  // 传递给模板的属性
  :fallback="Component"            // 后备组件
  :loading-component="Component"   // 加载组件
  :error-component="Component"     // 错误组件
  :cache="boolean"                 // 是否缓存
  :preload="boolean"               // 是否预加载依赖
  @loaded="(metadata) => {}"       // 加载完成
  @error="(error) => {}"          // 加载失败
  @rendered="() => {}"            // 渲染完成
/>
```

#### TemplateSelector

模板选择器组件，支持预览和筛选。

```vue
<TemplateSelector
  v-model="selectedId"            // 选中的模板 ID
  :category="string"               // 功能分类
  :device="string"                 // 设备类型
  :show-preview="boolean"          // 显示预览
  :multiple="boolean"              // 多选模式
  :filterable="boolean"            // 可筛选
  :searchable="boolean"            // 可搜索
  @select="(template) => {}"      // 选择事件
  @preview="(template) => {}"     // 预览事件
/>
```

### Composables

#### useTemplate

管理单个模板的加载和状态。

```typescript
const {
  template,    // Ref<TemplateMetadata | null>
  component,   // ShallowRef<Component | null>
  loading,     // Ref<boolean>
  error,       // Ref<Error | null>
  load,        // () => Promise<void>
  refresh,     // () => Promise<void>
  preload,     // () => Promise<void>
  clear        // () => void
} = useTemplate(templateId: string | Ref<string>, options?: UseTemplateOptions)
```

#### useTemplateList

管理模板列表的查询和操作。

```typescript
const {
  templates,   // Ref<TemplateMetadata[]>
  total,       // Ref<number>
  loading,     // Ref<boolean>
  filter,      // (conditions: FilterConditions) => TemplateMetadata[]
  sort,        // (key: string, order: 'asc' | 'desc') => TemplateMetadata[]
  paginate,    // (page: number, pageSize: number) => TemplateMetadata[]
  search,      // (query: string) => TemplateMetadata[]
  refresh      // () => Promise<void>
} = useTemplateList(options?: UseTemplateListOptions)
```

#### useTemplateCache

管理模板缓存。

```typescript
const {
  get,         // (key: string) => T | null
  set,         // (key: string, value: T) => void
  remove,      // (key: string) => void
  clear,       // () => void
  has,         // (key: string) => boolean
  size,        // Ref<number>
  stats        // Ref<CacheStats>
} = useTemplateCache(options?: CacheOptions)
```

### 核心类

#### TemplateManager

模板管理器，负责模板的注册、查询和管理。

```typescript
class TemplateManager {
  // 注册模板
  register(metadata: TemplateMetadata): void
  
  // 批量注册
  registerBatch(metadataList: TemplateMetadata[]): void
  
  // 查询模板
  query(): TemplateQuery
  
  // 获取模板
  getTemplate(id: string): TemplateMetadata | null
  
  // 按分类获取
  getTemplatesByCategory(category: string): TemplateMetadata[]
  
  // 按设备获取
  getTemplatesByDevice(device: DeviceType): TemplateMetadata[]
  
  // 版本管理
  getVersions(templateId: string): TemplateVersion[]
  switchVersion(templateId: string, version: string): void
  
  // A/B 测试
  createExperiment(config: ExperimentConfig): Experiment
  getVariant(experimentId: string, userId: string): string
}
```

#### TemplateQuery

链式查询构建器。

```typescript
class TemplateQuery {
  byId(id: string): this
  byCategory(category: string): this
  byDevice(device: DeviceType): this
  byTag(tag: string): this
  byAuthor(author: string): this
  byVersion(version: string): this
  withPermission(permission: string): this
  orderBy(field: string, order?: 'asc' | 'desc'): this
  limit(count: number): this
  offset(count: number): this
  execute(): Promise<TemplateMetadata[]>
  first(): Promise<TemplateMetadata | null>
  count(): Promise<number>
}
```

## 🎯 高级功能

### 版本管理

```typescript
import { useTemplateVersion } from '@ldesign/template'

const { 
  versions, 
  currentVersion, 
  switchVersion, 
  rollback,
  compare 
} = useTemplateVersion('login:desktop:default')

// 切换版本
await switchVersion('2.0.0')

// 回滚到上一个版本
await rollback()

// 比较两个版本
const diff = await compare('1.0.0', '2.0.0')
```

### A/B 测试

```typescript
import { useTemplateExperiment } from '@ldesign/template'

// 创建实验
const experiment = useTemplateExperiment({
  name: '登录页优化实验',
  variants: [
    { id: 'control', templateId: 'login:desktop:default', weight: 50 },
    { id: 'variant-a', templateId: 'login:desktop:modern', weight: 25 },
    { id: 'variant-b', templateId: 'login:desktop:minimal', weight: 25 }
  ],
  metrics: ['conversion', 'engagement']
})

// 获取用户变体
const variant = experiment.getVariant(userId)

// 记录事件
experiment.track('login_success', { userId, variant: variant.id })

// 获取实验结果
const results = await experiment.getResults()
```

### 权限控制

```typescript
import { useTemplatePermission } from '@ldesign/template'

const { 
  can, 
  cannot, 
  define, 
  check 
} = useTemplatePermission()

// 定义权限规则
define('admin', {
  can: ['create', 'read', 'update', 'delete'],
  on: 'template'
})

define('user', {
  can: ['read'],
  on: 'template',
  where: { public: true }
})

// 检查权限
if (can('edit', template)) {
  // 允许编辑
}

// 批量检查
const permissions = check(['create', 'delete'], 'template')
```

### 性能监控

```typescript
import { useTemplateMonitor } from '@ldesign/template'

const monitor = useTemplateMonitor({
  metrics: ['loadTime', 'renderTime', 'cacheHitRate'],
  sampleRate: 0.1, // 10% 采样率
  reportUrl: '/api/metrics'
})

// 手动记录指标
monitor.record('customMetric', 123)

// 获取性能报告
const report = monitor.getReport()
console.log(report)
// {
//   loadTime: { avg: 45, p50: 40, p95: 120, p99: 200 },
//   renderTime: { avg: 12, p50: 10, p95: 25, p99: 40 },
//   cacheHitRate: 0.85
// }
```

## 🔧 配置选项

### 全局配置

```typescript
import { configureTemplate } from '@ldesign/template'

configureTemplate({
  // 缓存配置
  cache: {
    enabled: true,
    strategy: 'lru', // 'lru' | 'lfu' | 'fifo'
    maxSize: 100,
    ttl: 3600000, // 1小时
    storage: 'indexeddb' // 'memory' | 'indexeddb' | 'localstorage'
  },
  
  // 性能配置
  performance: {
    lazyLoad: true,
    preload: ['critical-template-id'],
    virtualScroll: true,
    webWorker: true,
    batchSize: 20
  },
  
  // 安全配置
  security: {
    xssProtection: true,
    csrfProtection: true,
    contentValidation: true,
    trustedDomains: ['example.com']
  },
  
  // 主题配置
  theme: {
    mode: 'auto', // 'light' | 'dark' | 'auto'
    primaryColor: '#1890ff',
    borderRadius: 4,
    fontSize: 14
  },
  
  // 国际化配置
  i18n: {
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
      'zh-CN': zhCN,
      'en-US': enUS
    }
  },
  
  // 开发工具配置
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
    showPerformance: true,
    showCache: true,
    showNetwork: true
  }
})
```

## 🌍 国际化

```typescript
import { useTemplateI18n } from '@ldesign/template'
import zhCN from '@ldesign/template/locales/zh-CN'
import enUS from '@ldesign/template/locales/en-US'

const { t, locale, setLocale, addMessages } = useTemplateI18n()

// 添加语言包
addMessages('zh-CN', zhCN)
addMessages('en-US', enUS)

// 切换语言
setLocale('en-US')

// 使用翻译
console.log(t('template.loading')) // "Loading template..."
```

## 🧪 测试

```bash
# 运行单元测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 运行 E2E 测试
pnpm test:e2e

# 运行性能测试
pnpm test:performance
```

## 🛠️ 开发

### 环境准备

```bash
# 克隆项目
git clone https://github.com/ldesign-org/template.git
cd template

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 脚本命令

```bash
# 开发模式
pnpm dev

# 构建项目
pnpm build

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 格式化代码
pnpm format

# 运行测试
pnpm test

# 生成文档
pnpm docs:build
```

### 项目结构

```
scripts/            # 构建脚本
├── build.ts       # 构建脚本
├── release.ts     # 发布脚本
└── utils.ts       # 工具函数

packages/
├── core/          # 核心包
│   ├── src/       # 源代码
│   ├── tests/     # 测试文件
│   └── package.json
│
└── vue/           # Vue 适配包
    ├── src/       # 源代码
    ├── tests/     # 测试文件
    └── package.json
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。

### 贡献流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 代码规范

- 使用 ESLint 和 Prettier 保持代码风格一致
- 遵循 Vue 3 组合式 API 最佳实践
- 保持 TypeScript 类型完整性
- 编写清晰的注释和文档
- 添加适当的单元测试

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [VueUse](https://vueuse.org/) - Vue 组合式 API 工具集

## 📮 联系我们

- 官网: [https://ldesign.dev](https://ldesign.dev)
- GitHub: [@ldesign-org](https://github.com/ldesign-org)
- Email: support@ldesign.dev
- Discord: [加入我们的社区](https://discord.gg/ldesign)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ldesign-org/template&type=Date)](https://star-history.com/#ldesign-org/template&Date)

---

<div align="center">
  <p>用 ❤️ 打造，来自 LDesign 团队</p>
  <p>Copyright © 2024 LDesign. All rights reserved.</p>
</div>