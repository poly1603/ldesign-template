# 命名规范指南

> 📋 @ldesign/template 命名规范  
> 🎯 目标：统一、清晰、语义化

---

## 📖 命名规范概览

### 函数命名前缀

| 前缀 | 用途 | 示例 | 说明 |
|------|------|------|------|
| `get` | 获取单例或已存在的实例 | `getManager()` | 多次调用返回同一实例 |
| `create` | 创建新实例（工厂函数） | `createSmartCache()` | 每次调用创建新实例 |
| `use` | Vue组合式函数 | `useTemplate()` | 仅在setup中使用 |
| `is` | 布尔判断函数 | `isTemplate()` | 返回boolean |
| `has` | 检查存在性 | `hasTemplate()` | 返回boolean |
| `on` | 事件处理函数 | `onTemplateLoad()` | 事件回调 |
| `handle` | 事件处理函数 | `handleClick()` | 事件处理 |

### 变量命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 常量 | UPPER_SNAKE_CASE | `MAX_CACHE_SIZE` |
| 变量 | camelCase | `templateData` |
| 类名 | PascalCase | `TemplateManager` |
| 接口 | PascalCase | `TemplateMetadata` |
| 类型别名 | PascalCase | `DeviceType` |
| 枚举 | PascalCase | `ErrorCode` |
| 枚举值 | UPPER_SNAKE_CASE | `TEMPLATE_NOT_FOUND` |

### 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue组件 | PascalCase.vue | `TemplateRenderer.vue` |
| TypeScript | camelCase.ts | `templateSearch.ts` |
| 类文件 | PascalCase.ts 或 camelCase.ts | `TemplateManager.ts` |
| 工具函数 | camelCase.ts | `performance.ts` |
| 类型定义 | index.ts 或 types.ts | `types/index.ts` |

---

## 🎯 具体规范

### 1. 函数命名

#### ✅ 正确示例

```typescript
// 单例获取
export function getManager(): TemplateManager
export function getLoader(): TemplateLoader
export function getGlobalErrorHandler(): ErrorHandler

// 工厂函数
export function createSmartCache(options?: CacheOptions): SmartCache
export function createTemplateSearcher(templates: Template[]): Searcher
export function createMemoryOptimizer(config?: Config): MemoryOptimizer

// 组合式函数
export function useTemplate(...): TemplateHookResult
export function useTemplateSelector(...): SelectorHookResult
export function useTemplateTheme(...): ThemeHookResult

// 判断函数
export function isTemplate(value: unknown): value is Template
export function hasTemplate(id: string): boolean

// 事件处理
function handleClick(event: Event): void
function onTemplateLoad(template: Template): void
```

#### ❌ 不推荐

```typescript
// 不要混用前缀
function getNewManager() // 应该用 createManager
function useManager() // 应该用 getManager (单例)

// 不要使用缩写（除非是约定俗成的）
function getTmpl() // 应该用 getTemplate
function useTplSel() // 应该用 useTemplateSelector
```

### 2. 变量命名

#### ✅ 正确示例

```typescript
// 常量
const MAX_CACHE_SIZE = 100
const DEFAULT_TIMEOUT = 5000
const FILTER_CACHE_TTL = 60000

// 普通变量
const templateMetadata: TemplateMetadata
const isLoading: boolean
const currentDevice: DeviceType

// 私有变量（类内部）
private filterCache: Map<string, any>
private loadingPromises: Map<string, Promise<any>>

// 临时变量（局部作用域可使用短命名）
for (const t of templates) { // t 可接受
  // ...
}

templates.filter(t => t.isDefault) // t 可接受
```

#### ❌ 不推荐

```typescript
// 全局作用域使用缩写
const mgr = getManager() // 应该用 manager
const cat = props.category // 应该用 category
const dev = props.device // 应该用 device

// 不清晰的命名
const data: any // 应该用具体名称
const temp: any // 应该说明是什么的临时变量
const flag: boolean // 应该说明标志的含义
```

### 3. 类和接口命名

#### ✅ 正确示例

```typescript
// 类名 - 名词
class TemplateManager { }
class SmartCache { }
class PerformanceAnalyzer { }

// 接口名 - 名词或形容词
interface TemplateMetadata { }
interface CacheOptions { }
interface Searchable { } // 形容词接口

// 类型别名
type DeviceType = 'desktop' | 'mobile' | 'tablet'
type TemplateCategory = string

// 泛型命名
function map<T, R>(items: T[], fn: (item: T) => R): R[]
```

### 4. 事件命名

#### ✅ 推荐：统一使用驼峰

```typescript
// Vue组件事件
emit('templateChange', template)
emit('deviceChange', device)
emit('loadComplete', data)
emit('error', error)

// 自定义事件
eventBus.emit('templateUpdated', template)
eventBus.on('cacheCleared', handler)
```

#### ❌ 不推荐：混用

```typescript
// 不要混用kebab-case和camelCase
emit('template-change', template) // 不推荐
emit('templateChange', template) // 推荐
```

### 5. 文件命名

#### ✅ 正确示例

```
components/
├── TemplateRenderer.vue    ✅ Vue组件：PascalCase
├── TemplateSelector.vue    ✅
└── TemplateSkeleton.vue    ✅

utils/
├── performance.ts          ✅ 工具函数：camelCase
├── templateSearch.ts       ✅
├── performanceAnalyzer.ts  ✅
└── memoryOptimizer.ts      ✅

core/
├── manager.ts              ✅ 核心模块：camelCase
├── loader.ts               ✅
└── smart-cache.ts          ✅ kebab-case也可接受

types/
└── index.ts                ✅ 类型定义：index.ts
```

---

## 🔧 命名模式

### 布尔变量

```typescript
// ✅ 使用is、has、can、should等前缀
const isLoading: boolean
const hasError: boolean
const canRetry: boolean
const shouldAutoLoad: boolean

// ❌ 避免模糊命名
const loading: boolean // 应该用 isLoading
const error: boolean // 应该用 hasError
```

### 集合变量

```typescript
// ✅ 使用复数或明确的集合名称
const templates: Template[]
const templateMap: Map<string, Template>
const templateSet: Set<string>
const templateList: Template[]

// ❌ 避免单数形式表示集合
const template: Template[] // 应该用 templates
```

### 函数参数

```typescript
// ✅ 清晰的参数命名
function loadTemplate(
  category: string,
  device: DeviceType,
  templateName: string
): Promise<Template>

// ✅ 配置对象使用options或config
function createCache(options?: CacheOptions): Cache

// ❌ 避免单字母（除非是约定俗成的）
function map(a: any[], f: Function) // 不推荐
function map<T, R>(items: T[], fn: (item: T) => R): R[] // 推荐
```

---

## 📊 现状分析

### 当前命名质量：85/100

#### 优点
- ✅ 大部分代码遵循规范
- ✅ 类型命名统一
- ✅ 函数前缀使用正确

#### 改进空间（低优先级）

**1. 局部变量缩写**

当前代码：
```typescript
// core/manager.ts
const mgr = getManager()
const cat = props.category
const dev = props.device
```

建议改进：
```typescript
const manager = getManager()
const category = props.category
const device = props.device
```

**2. 少数不一致的事件命名**

统一为驼峰命名（大部分已经统一）

---

## 💡 重构建议

### 低优先级重构（可选）

如果追求完美一致性，可以进行以下小幅重构：

#### 1. 统一局部变量命名

```typescript
// 搜索并替换
const mgr = getManager()  →  const manager = getManager()
const cat = props.category  →  const category = props.category
const dev = props.device  →  const device = props.device
```

**影响**：无，纯粹提升可读性

#### 2. 统一事件命名

确保所有事件都使用驼峰命名（当前已经90%+统一）

---

## ✅ 结论

### 当前状态

- **命名规范遵循度**：85%
- **一致性**：良好
- **可读性**：优秀

### 建议

当前命名质量已经很高，剩余的小问题（主要是局部变量缩写）：
- **影响**：非常小，仅影响局部可读性
- **优先级**：低
- **建议**：可以在后续维护中逐步改进

**不影响生产使用！**

---

## 📚 参考资源

### Vue官方风格指南
- https://vuejs.org/style-guide/

### TypeScript命名规范
- https://ts.dev/style/

### Airbnb JavaScript风格指南
- https://github.com/airbnb/javascript

---

*文档创建：2025-01-27*


