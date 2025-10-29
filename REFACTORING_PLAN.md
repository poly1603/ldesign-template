# Template 完整重构方案

## 🎯 功能全景分析

### 核心功能清单

1. **模板扫描与注册**
   - 自动扫描模板目录
   - 支持配置文件和组件文件
   - 持久化缓存（IndexedDB）
   - 支持分类（category）和设备类型（device）

2. **模板加载与缓存**
   - 懒加载模板组件
   - 智能三级缓存（Hot/Warm/Cold）
   - 预加载和批量加载
   - 样式动态加载

3. **模板选择与切换** ⭐ 核心交互
   - 按分类和设备筛选
   - 实时切换模板
   - 默认模板选择
   - 用户偏好记忆

4. **模板渲染** ⭐ 核心展示
   - 动态组件渲染
   - 属性传递
   - 插槽支持
   - 错误边界和重试
   - v-model 双向绑定

5. **设备检测与响应**
   - 自动检测设备类型
   - 响应式切换模板
   - 设备变化监听

6. **高级功能**
   - 版本管理
   - A/B 测试
   - 依赖管理
   - 主题切换
   - 国际化
   - SSR/SSG
   - DevTools

## 🏗️ 架构分层设计

### 第一层：Core（框架无关）

```typescript
// 核心状态管理
export class TemplateStateManager {
  private currentCategory: string
  private currentDevice: string
  private currentTemplate: string
  private listeners: Set<StateChangeListener>
  
  // 状态管理（纯JS，事件驱动）
  setState(category: string, device: string, template: string)
  getState(): TemplateState
  subscribe(listener: StateChangeListener): UnsubscribeFn
}

// 选择逻辑
export class TemplateSelectorLogic {
  constructor(private stateManager: TemplateStateManager)
  
  // 纯逻辑，返回数据
  getAvailableTemplates(category: string, device: string): TemplateMetadata[]
  selectTemplate(templateName: string): void
  getDefaultTemplate(category: string, device: string): TemplateMetadata | null
}

// 加载协调器
export class TemplateLoadCoordinator<TComponent = unknown> {
  async loadTemplate(...): Promise<TComponent>
  async switchTemplate(...): Promise<TComponent>
}
```

### 第二层：Adapter（框架适配）

```typescript
// Vue 适配器
export class VueTemplateAdapter {
  // 将 Core 状态转为 Vue reactive
  createReactiveState(stateManager: TemplateStateManager): Ref<TemplateState>
  
  // Vue 组件加载
  async loadVueComponent(path: string): Promise<Component>
}

// React 适配器
export class ReactTemplateAdapter {
  // 将 Core 状态转为 React state
  useTemplateState(stateManager: TemplateStateManager): [TemplateState, SetState]
  
  // React 组件加载
  async loadReactComponent(path: string): Promise<ComponentType>
}
```

### 第三层：UI Components（框架特定）

```vue
<!-- Vue 渲染器 -->
<script setup>
import { useVueTemplateRenderer } from './adapters'

const { component, select, switch } = useVueTemplateRenderer(props)
</script>

<template>
  <component :is="component" v-bind="$attrs" />
</template>
```

## 📦 最终包结构

```
packages/
├── core/                      # @ldesign/template-core
│   ├── src/
│   │   ├── state/
│   │   │   ├── TemplateStateManager.ts     # 状态管理
│   │   │   ├── DeviceDetector.ts          # 设备检测
│   │   │   └── PreferenceManager.ts       # 偏好管理
│   │   │
│   │   ├── registry/
│   │   │   ├── TemplateRegistry.ts        # 注册表
│   │   │   ├── TemplateScanner.ts         # 扫描器（抽象）
│   │   │   └── MetadataParser.ts          # 元数据解析
│   │   │
│   │   ├── loader/
│   │   │   ├── TemplateLoader.ts<T>       # 泛型加载器
│   │   │   ├── LoadCoordinator.ts         # 加载协调
│   │   │   └── StyleLoader.ts             # 样式加载
│   │   │
│   │   ├── selector/
│   │   │   ├── TemplateSelectorLogic.ts   # 选择逻辑
│   │   │   └── TemplateFilter.ts          # 过滤逻辑
│   │   │
│   │   ├── renderer/
│   │   │   ├── RenderCoordinator.ts       # 渲染协调
│   │   │   ├── PropsMerger.ts             # 属性合并
│   │   │   └── ErrorBoundary.ts           # 错误边界
│   │   │
│   │   ├── cache/
│   │   │   ├── SmartCache.ts
│   │   │   └── PersistentCache.ts
│   │   │
│   │   ├── managers/
│   │   │   ├── VersionManager.ts
│   │   │   ├── DependencyManager.ts
│   │   │   └── ABTestEngine.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts                  # 通用类型
│   │   │
│   │   └── index.ts                       # 核心导出
│   └── package.json
│
└── vue/                       # @ldesign/template-vue
    ├── src/
    │   ├── adapters/
    │   │   ├── VueStateAdapter.ts        # 状态适配
    │   │   ├── VueLoaderAdapter.ts       # 加载适配
    │   │   └── VueTemplateScanner.ts     # 扫描适配
    │   │
    │   ├── composables/
    │   │   ├── useTemplateRenderer.ts    # 渲染 hook
    │   │   ├── useTemplateSelector.ts    # 选择 hook
    │   │   ├── useTemplateState.ts       # 状态 hook
    │   │   └── useDeviceDetect.ts        # 设备检测 hook
    │   │
    │   ├── components/
    │   │   ├── TemplateRenderer.vue      # 渲染器组件
    │   │   ├── TemplateSelector.vue      # 选择器组件
    │   │   └── ...                       # 其他组件
    │   │
    │   ├── templates/                 # Vue 模板实现
    │   │   ├── login/
    │   │   ├── dashboard/
    │   │   └── ...
    │   │
    │   └── index.ts
    └── package.json
```

## 🔧 Core 核心模块详细设计

### 1. 状态管理（TemplateStateManager）

```typescript
// packages/core/src/state/TemplateStateManager.ts
export interface TemplateState {
  category: string
  device: string
  template: string
  loading: boolean
  error: Error | null
}

export type StateChangeListener = (state: TemplateState) => void

export class TemplateStateManager {
  private state: TemplateState
  private listeners = new Set<StateChangeListener>()
  
  constructor(initial: Partial<TemplateState> = {}) {
    this.state = {
      category: '',
      device: 'desktop',
      template: '',
      loading: false,
      error: null,
      ...initial
    }
  }
  
  // 获取当前状态
  getState(): Readonly<TemplateState> {
    return { ...this.state }
  }
  
  // 设置状态
  setState(partial: Partial<TemplateState>): void {
    this.state = { ...this.state, ...partial }
    this.notify()
  }
  
  // 订阅状态变化
  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
  
  private notify(): void {
    const state = this.getState()
    this.listeners.forEach(listener => listener(state))
  }
}
```

### 2. 选择逻辑（TemplateSelectorLogic）

```typescript
// packages/core/src/selector/TemplateSelectorLogic.ts
export class TemplateSelectorLogic {
  constructor(
    private stateManager: TemplateStateManager,
    private registry: TemplateRegistry
  ) {}
  
  // 获取可用模板
  getAvailableTemplates(category: string, device: string): TemplateMetadata[] {
    return this.registry.query({ category, device })
  }
  
  // 选择模板
  selectTemplate(templateName: string): void {
    const currentState = this.stateManager.getState()
    this.stateManager.setState({
      template: templateName,
      loading: true,
      error: null
    })
  }
  
  // 获取默认模板
  getDefaultTemplate(category: string, device: string): TemplateMetadata | null {
    const templates = this.getAvailableTemplates(category, device)
    return templates.find(t => t.isDefault) || templates[0] || null
  }
}
```

### 3. 加载协调（TemplateLoadCoordinator）

```typescript
// packages/core/src/loader/LoadCoordinator.ts
export interface ComponentLoader<T> {
  load(path: string): Promise<T>
}

export class TemplateLoadCoordinator<TComponent = unknown> {
  constructor(
    private componentLoader: ComponentLoader<TComponent>,
    private cache: SmartCache<TComponent>,
    private styleLoader: StyleLoader
  ) {}
  
  async loadTemplate(
    category: string,
    device: string,
    name: string
  ): Promise<TComponent> {
    const key = `${category}/${device}/${name}`
    
    // 检查缓存
    const cached = this.cache.get(key)
    if (cached) return cached
    
    // 加载组件
    const template = await this.registry.getTemplate(category, device, name)
    if (!template) throw new Error(`Template not found: ${key}`)
    
    // 加载样式
    await this.styleLoader.load(template.stylePath)
    
    // 加载组件
    const component = await this.componentLoader.load(template.componentPath)
    
    // 缓存
    this.cache.set(key, component)
    
    return component
  }
  
  async switchTemplate(
    from: string,
    to: string
  ): Promise<TComponent> {
    // 切换逻辑：预加载、清理等
    return this.loadTemplate(...)
  }
}
```

## 🔌 Vue 适配层详细设计

### 1. 状态适配（VueStateAdapter）

```typescript
// packages/vue/src/adapters/VueStateAdapter.ts
import { ref, readonly, type Ref } from 'vue'
import type { TemplateStateManager, TemplateState } from '@ldesign/template-core'

export function useTemplateState(stateManager: TemplateStateManager) {
  // 将 Core 状态转为 Vue reactive
  const state = ref<TemplateState>(stateManager.getState())
  
  // 订阅变化
  const unsubscribe = stateManager.subscribe((newState) => {
    state.value = newState
  })
  
  // 清理
  onUnmounted(() => unsubscribe())
  
  return {
    state: readonly(state),
    setState: (partial: Partial<TemplateState>) => {
      stateManager.setState(partial)
    }
  }
}
```

### 2. 加载适配（VueLoaderAdapter）

```typescript
// packages/vue/src/adapters/VueLoaderAdapter.ts
import type { Component } from 'vue'
import type { ComponentLoader } from '@ldesign/template-core'

export class VueComponentLoader implements ComponentLoader<Component> {
  async load(path: string): Promise<Component> {
    // Vite dynamic import
    const module = await import(/* @vite-ignore */ path)
    return module.default || module
  }
}
```

### 3. 扫描适配（VueTemplateScanner）

```typescript
// packages/vue/src/adapters/VueTemplateScanner.ts
import type { TemplateScanner } from '@ldesign/template-core'

export class VueTemplateScanner implements TemplateScanner {
  async scan(): Promise<TemplateRegistry> {
    // 使用 Vite 的 import.meta.glob
    const configs = import.meta.glob('../templates/**/config.ts', { eager: true })
    const components = import.meta.glob('../templates/**/index.vue')
    
    // 解析和注册
    return this.parseAndRegister(configs, components)
  }
}
```

### 4. 渲染 Hook（useTemplateRenderer）

```typescript
// packages/vue/src/composables/useTemplateRenderer.ts
import { computed, ref, watch } from 'vue'
import {
  TemplateStateManager,
  TemplateLoadCoordinator,
  TemplateSelectorLogic
} from '@ldesign/template-core'
import { VueComponentLoader } from '../adapters'
import { useTemplateState } from '../adapters/VueStateAdapter'

export function useTemplateRenderer(props) {
  // 初始化 Core
  const stateManager = new TemplateStateManager()
  const loader = new TemplateLoadCoordinator(
    new VueComponentLoader(),
    cache,
    styleLoader
  )
  const selectorLogic = new TemplateSelectorLogic(stateManager, registry)
  
  // 适配为 Vue
  const { state } = useTemplateState(stateManager)
  const component = ref(null)
  
  // 监听状态变化，加载组件
  watch(() => [state.value.category, state.value.device, state.value.template],
    async ([category, device, template]) => {
      if (!category || !device || !template) return
      
      try {
        component.value = await loader.loadTemplate(category, device, template)
      } catch (error) {
        stateManager.setState({ error, loading: false })
      }
    },
    { immediate: true }
  )
  
  return {
    component: readonly(component),
    state: readonly(state),
    selectTemplate: (name: string) => selectorLogic.selectTemplate(name),
    getAvailableTemplates: () => selectorLogic.getAvailableTemplates(...)
  }
}
```

## ✅ 核心优势

### 1. 最大化复用

**Core 包实现的功能（100% 复用）**：
- ✅ 状态管理逻辑
- ✅ 模板选择逻辑
- ✅ 加载协调逻辑
- ✅ 缓存策略
- ✅ 设备检测算法
- ✅ 过滤和搜索逻辑
- ✅ 错误处理逻辑
- ✅ 版本、依赖、A/B测试

**框架适配层只需实现（最少代码）**：
- ✅ 状态转换（Core State → Framework State）
- ✅ 组件加载（框架特定的 import）
- ✅ 模板扫描（框架特定的构建工具）
- ✅ UI 组件（框架特定语法）

### 2. 一致的 API

所有框架都有相同的使用体验：

```typescript
// Vue
const { component, selectTemplate } = useTemplateRenderer(props)

// React
const { component, selectTemplate } = useTemplateRenderer(props)

// Svelte
const { component, selectTemplate } = useTemplateRenderer(props)
```

### 3. 类型安全

泛型设计保证类型安全：

```typescript
// Core
const loader = new TemplateLoadCoordinator<Component>()

// Vue
const vueLoader = new TemplateLoadCoordinator<VueComponent>()

// React  
const reactLoader = new TemplateLoadCoordinator<ReactComponent>()
```

## 🚀 实施计划

### Phase 1: Core 包开发 (1-2周)
1. ✅ TemplateStateManager
2. ✅ TemplateSelectorLogic
3. ✅ TemplateLoadCoordinator
4. ✅ TemplateRegistry (抽象)
5. ✅ SmartCache & PersistentCache
6. ✅ DeviceDetector
7. ✅ 通用类型定义

### Phase 2: Vue 适配层 (1周)
1. ✅ VueStateAdapter
2. ✅ VueLoaderAdapter
3. ✅ VueTemplateScanner
4. ✅ useTemplateRenderer
5. ✅ useTemplateSelector
6. ✅ TemplateRenderer.vue
7. ✅ TemplateSelector.vue

### Phase 3: 测试与优化 (1周)
1. ✅ 单元测试
2. ✅ 集成测试
3. ✅ 性能优化
4. ✅ 文档完善

## 📝 总结

这个方案通过**三层架构**实现：

1. **Core 层**：纯 JS 逻辑，事件驱动，100% 框架无关
2. **Adapter 层**：轻量适配，将 Core 连接到具体框架
3. **UI 层**：框架特定组件，复用 Core 逻辑

**关键亮点**：
- ✅ 最大化代码复用（Core 占 80%+）
- ✅ 最少框架特定代码（Adapter 占 10-15%）
- ✅ 一致的 API 体验
- ✅ 类型安全
- ✅ 易于扩展

## 🔍 问题分析

### 当前代码的问题

1. **类型耦合**: `loader.ts`, `manager.ts`, `scanner.ts` 都使用 `import type { Component } from 'vue'`
2. **混杂架构**: 核心逻辑和 Vue 特定功能混在一起
3. **难以扩展**: 无法支持其他框架

### 核心模块分析

#### ✅ 完全框架无关的模块

```
src/core/
├── smart-cache.ts          ✅ 纯TS，三级缓存
├── persistent-cache.ts     ✅ 纯TS，IndexedDB
├── version-manager.ts      ✅ 纯TS，版本管理
├── dependency-manager.ts   ✅ 纯TS，依赖管理
├── ab-test-engine.ts       ✅ 纯TS，A/B测试
├── animation.ts            ✅ 纯TS，动画配置
├── inheritance.ts          ✅ 纯TS，继承系统
└── style-loader.ts         ✅ DOM API，通用
```

#### ⚠️ 需要重构的模块

```
src/core/
├── loader.ts        ⚠️ 使用 Vue Component 类型
├── manager.ts       ⚠️ 使用 Vue Component 类型
└── scanner.ts       ⚠️ 使用 import.meta.glob (Vite特定)
```

#### 📱 完全Vue特定的模块

```
src/
├── components/     📱 .vue文件
├── composables/    📱 Vue Composition API
├── directives/     📱 Vue指令
├── plugin/         📱 Vue插件
└── ssr/           📱 Vue SSR
```

## 🎯 重构方案

### 方案1: 泛型抽象（推荐）⭐

**核心思路**: 使用泛型让 core 包完全框架无关

```typescript
// @ldesign/template-core
export class TemplateLoader<T = any> {
  async load(category: string, device: string, name: string): Promise<T> {
    // 返回泛型类型，由框架适配层决定
  }
}

export class TemplateScanner<T = any> {
  scan(): Promise<TemplateScanResult<T>> {
    // 扫描逻辑框架无关
  }
}
```

```typescript
// @ldesign/template-vue
import { TemplateLoader as CoreLoader } from '@ldesign/template-core'
import type { Component } from 'vue'

export class VueTemplateLoader extends CoreLoader<Component> {
  // Vue特定的加载逻辑
}
```

**优点**:
- ✅ Core完全框架无关
- ✅ 类型安全
- ✅ 易于扩展

**缺点**:
- ⚠️ 需要重写部分代码

### 方案2: 接口抽象

```typescript
// @ldesign/template-core
export interface ComponentLoader {
  load(path: string): Promise<unknown>
}

export class TemplateLoader {
  constructor(private componentLoader: ComponentLoader) {}
}
```

```typescript
// @ldesign/template-vue
import type { Component } from 'vue'

export class VueComponentLoader implements ComponentLoader {
  async load(path: string): Promise<Component> {
    return import(path)
  }
}
```

## 📦 最终包结构

```
packages/
├── core/                   # @ldesign/template-core
│   ├── src/
│   │   ├── loader.ts       # 泛型 TemplateLoader<T>
│   │   ├── manager.ts      # 泛型 TemplateManager<T>
│   │   ├── scanner.ts      # 抽象 TemplateScanner
│   │   ├── cache/
│   │   │   ├── smart-cache.ts
│   │   │   └── persistent-cache.ts
│   │   ├── managers/
│   │   │   ├── version-manager.ts
│   │   │   ├── dependency-manager.ts
│   │   │   └── ab-test-engine.ts
│   │   ├── types/
│   │   │   └── index.ts    # 通用类型
│   │   └── utils/
│   │       └── index.ts
│   └── package.json
│
└── vue/                    # @ldesign/template-vue
    ├── src/
    │   ├── core/          # Vue特定的core实现
    │   │   ├── loader.ts   # VueTemplateLoader
    │   │   ├── manager.ts  # VueTemplateManager
    │   │   └── scanner.ts  # VueTemplateScanner
    │   ├── components/
    │   ├── composables/
    │   ├── directives/
    │   ├── plugin/
    │   ├── templates/      # Vue模板实现
    │   └── index.ts
    └── package.json
```

## 🔨 实施步骤

### 第一阶段: Core 包

1. **创建泛型基础类**
   ```typescript
   // packages/core/src/loader.ts
   export class TemplateLoader<TComponent = unknown> {
     async load(...): Promise<TComponent> {}
   }
   ```

2. **提取纯逻辑模块**
   - smart-cache.ts → packages/core/src/cache/
   - version-manager.ts → packages/core/src/managers/
   - 等等...

3. **创建通用类型**
   ```typescript
   // packages/core/src/types/index.ts
   export interface TemplateMetadata {
     name: string
     category: string
     device: DeviceType
     // 不包含任何框架特定类型
   }
   ```

### 第二阶段: Vue 包

1. **实现 Vue 特定的 Loader**
   ```typescript
   // packages/vue/src/core/loader.ts
   import { TemplateLoader } from '@ldesign/template-core'
   import type { Component } from 'vue'
   
   export class VueTemplateLoader extends TemplateLoader<Component> {
     protected async loadComponent(path: string): Promise<Component> {
       return import(path) // Vite dynamic import
     }
   }
   ```

2. **实现 Vue 组件和 Composables**
   ```typescript
   // packages/vue/src/composables/useTemplate.ts
   import { VueTemplateLoader } from '../core/loader'
   
   export function useTemplate() {
     const loader = new VueTemplateLoader()
     // Vue特定逻辑
   }
   ```

3. **保留模板实现**
   ```
   packages/vue/src/templates/
   ├── login/
   ├── dashboard/
   └── ...
   ```

## ✅ 验证标准

重构完成后必须满足:

1. ✅ `@ldesign/template-core` 不依赖任何 UI 框架
2. ✅ `@ldesign/template-vue` 功能完全保留
3. ✅ 所有测试通过
4. ✅ 类型检查无错误
5. ✅ ESLint 无错误

## 🚀 未来扩展

基于新架构可以轻松实现:

```typescript
// @ldesign/template-react
import { TemplateLoader } from '@ldesign/template-core'
import type { ComponentType } from 'react'

export class ReactTemplateLoader extends TemplateLoader<ComponentType> {
  protected async loadComponent(path: string): Promise<ComponentType> {
    return React.lazy(() => import(path))
  }
}
```

## 📝 总结

采用**泛型抽象方案**，通过以下方式实现框架无关:

1. Core 使用泛型 `<T>` 代替具体框架类型
2. Vue 包继承 Core 并指定 `T = Component`
3. 其他框架按同样模式扩展

这样既保持了类型安全，又实现了框架无关。
