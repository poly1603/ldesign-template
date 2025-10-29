# 重构实施进度

## ✅ 已完成

### Phase 1: Core 包基础

- ✅ 创建目录结构 `packages/core/src/`
- ✅ **TemplateStateManager** - 纯JS状态管理，观察者模式
- ✅ **DeviceDetector** - 设备检测逻辑（带防抖）

### 核心特点

1. **TemplateStateManager**
   - 纯 JavaScript，无框架依赖
   - 观察者模式，支持多个订阅者
   - 不可变状态更新
   - 错误处理

2. **DeviceDetector**
   - 框架无关的设备检测
   - 响应式监听窗口变化
   - 防抖优化（150ms）
   - 支持自定义检测函数
   - SSR 友好

## 🚧 待实施

### Phase 1 剩余任务

1. **TemplateRegistry** (核心注册表)
   ```typescript
   export abstract class TemplateRegistry {
     abstract register(metadata: TemplateMetadata): void
     abstract query(filter: TemplateFilter): TemplateMetadata[]
     abstract getTemplate(category, device, name): TemplateRegistryItem | null
   }
   ```

2. **Tem**plateSelectorLogic** (选择逻辑)
   ```typescript
   export class TemplateSelectorLogic {
     constructor(stateManager, registry)
     getAvailableTemplates(category, device): TemplateMetadata[]
     selectTemplate(name): void
     getDefaultTemplate(category, device): TemplateMetadata | null
   }
   ```

3. **TemplateLoadCoordinator** (加载协调)
   ```typescript
   export interface ComponentLoader<T> {
     load(path: string): Promise<T>
   }
   
   export class TemplateLoadCoordinator<TComponent = unknown> {
     async loadTemplate(category, device, name): Promise<TComponent>
     async switchTemplate(from, to): Promise<TComponent>
   }
   ```

4. **复用现有模块**
   - 复制 `smart-cache.ts` 到 `packages/core/src/cache/`
   - 复制 `persistent-cache.ts`
   - 复制 `version-manager.ts` 到 `packages/core/src/managers/`
   - 复制 `dependency-manager.ts`
   - 复制 `ab-test-engine.ts`

5. **通用类型定义**
   - 提取框架无关的类型到 `packages/core/src/types/`
   - 移除 Vue 特定类型（Component 等）

6. **Core 包配置**
   - `package.json`
   - `tsconfig.json`
   - `eslint.config.js`

### Phase 2: Vue 适配层

1. **创建 Vue 包结构**
   ```
   packages/vue/
   ├── src/
   │   ├── adapters/
   │   ├── composables/
   │   ├── components/
   │   └── templates/
   ```

2. **VueStateAdapter**
   ```typescript
   export function useTemplateState(stateManager: TemplateStateManager) {
     const state = ref(stateManager.getState())
     // 订阅 Core 状态变化，更新 Vue ref
     return { state, setState }
   }
   ```

3. **VueLoaderAdapter**
   ```typescript
   export class VueComponentLoader implements ComponentLoader<Component> {
     async load(path: string): Promise<Component> {
       const module = await import(/* @vite-ignore */ path)
       return module.default || module
     }
   }
   ```

4. **VueTemplateScanner**
   ```typescript
   export class VueTemplateScanner {
     async scan() {
       const configs = import.meta.glob('../templates/**/config.ts', { eager: true })
       const components = import.meta.glob('../templates/**/index.vue')
       return this.parseAndRegister(configs, components)
     }
   }
   ```

5. **useTemplateRenderer**
   - 核心渲染 hook
   - 整合所有 Core 模块
   - 提供 Vue 友好的 API

6. **迁移组件**
   - `TemplateRenderer.vue` - 基于 useTemplateRenderer
   - `TemplateSelector.vue` - 使用 Core 的 SelectorLogic
   - 其他辅助组件

7. **迁移模板**
   - 移动 `src/templates/` 到 `packages/vue/src/templates/`

## 📋 下一步执行计划

### 立即执行

1. 实现 TemplateRegistry（抽象类）
2. 实现 TemplateSelectorLogic
3. 实现 TemplateLoadCoordinator（泛型）
4. 复制 cache 模块
5. 定义通用类型

### 然后执行

1. 创建 Vue 包结构
2. 实现 3 个 Adapter
3. 实现 useTemplateRenderer
4. 迁移 Vue 组件
5. 迁移模板实现

## 🎯 验证标准

完成后必须满足：

1. ✅ Core 包完全独立，无框架依赖
2. ✅ Vue 包功能完整，与原有一致
3. ✅ 类型检查通过
4. ✅ ESLint 无错误
5. ✅ 所有测试通过

## 💡 架构优势

### 代码复用率

- **Core 层**: 80%+ 代码（状态、选择、加载、缓存等所有逻辑）
- **Adapter 层**: 10-15% 代码（状态转换、组件加载、扫描适配）
- **UI 层**: 5-10% 代码（框架特定组件语法）

### 扩展性

添加新框架只需：
1. 实现 Adapter（~200-300行）
2. 创建 UI 组件（~100-200行）
3. 框架特定的模板实现

**总计**: 每个新框架约 300-500 行代码即可完整支持！

## 📝 使用示例

### Core 使用（框架无关）

```typescript
import { TemplateStateManager, DeviceDetector } from '@ldesign/template-core'

const stateManager = new TemplateStateManager()
const deviceDetector = new DeviceDetector()

// 订阅状态
stateManager.subscribe(state => {
  console.log('State changed:', state)
})

// 监听设备
deviceDetector.observe(device => {
  stateManager.setState({ device })
})
```

### Vue 使用

```vue
<script setup>
import { useTemplateRenderer } from '@ldesign/template-vue'

const { component, state, selectTemplate } = useTemplateRenderer({
  category: 'login',
  device: 'desktop'
})
</script>

<template>
  <component :is="component" v-bind="$attrs" />
</template>
```

### React 使用（未来）

```jsx
import { useTemplateRenderer } from '@ldesign/template-react'

function App() {
  const { Component, state, selectTemplate } = useTemplateRenderer({
    category: 'login',
    device: 'desktop'
  })
  
  return <Component />
}
```

## 🔗 相关文档

- [重构方案](./REFACTORING_PLAN.md) - 完整设计文档
- [现有功能](./README.md) - 当前 Vue 实现文档
