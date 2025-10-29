# 模板系统架构文档

## 📦 包结构

```
packages/
├── core/                    # @ldesign/template-core (框架无关核心)
│   ├── src/
│   │   ├── types/          # 通用类型定义
│   │   ├── registry/       # 模板注册表
│   │   ├── manager/        # 状态管理和编排
│   │   ├── loader/         # 加载协调器
│   │   ├── device/         # 设备检测
│   │   ├── selector/       # 模板选择逻辑
│   │   ├── scanner/        # 扫描器抽象
│   │   └── index.ts
│   └── package.json
│
└── vue/                     # @ldesign/template-vue (Vue 3 适配器)
    ├── src/
    │   ├── core/           # Vue 适配层
    │   │   ├── VueStateAdapter.ts      # 状态适配器
    │   │   ├── VueLoaderAdapter.ts     # 加载器适配器
    │   │   └── VueTemplateScanner.ts   # 扫描器实现
    │   ├── composables/    # Vue composables
    │   │   └── useTemplateRenderer.ts  # 核心 hook
    │   ├── components/     # Vue UI 组件
    │   ├── directives/     # Vue 指令
    │   ├── plugin/         # Vue 插件
    │   └── index.ts
    └── package.json
```

## 🏗️ 架构分层

### Layer 1: Core (框架无关)

**职责：** 纯业务逻辑，不依赖任何框架

**核心模块：**

1. **TemplateRegistry** - 模板注册表
   - 存储模板元数据
   - 提供查询、过滤功能
   - 泛型设计 `TemplateRegistry<TComponent>`

2. **TemplateStateManager** - 状态管理
   - 管理当前选中的分类、设备、模板
   - 事件驱动的状态变更通知
   - 框架无关的观察者模式

3. **TemplateLoadCoordinator** - 加载协调器
   - 协调组件加载、样式加载
   - 处理缓存、超时、错误
   - 支持预加载和切换

4. **TemplateOrchestrator** - 编排器
   - 整合状态管理和加载协调
   - 提供高层 API
   - 自动加载、预加载策略

5. **DeviceDetector** - 设备检测
   - 响应式设备检测
   - 自动监听窗口变化
   - 可自定义检测逻辑

6. **TemplateSelectorLogic** - 选择逻辑
   - 模板选择策略（优先级、随机、顺序等）
   - A/B 测试支持
   - 权重选择

### Layer 2: Adapter (框架适配)

**职责：** 将 Core 适配到具体框架

**Vue 适配器：**

1. **VueStateAdapter**
   - 将 Core 状态转换为 Vue 响应式
   - 双向同步：Core ↔ Vue reactive
   - 提供 refs、computed

2. **VueLoaderAdapter**
   - 实现 `ComponentLoader<Component>` 接口
   - 处理 Vue 组件动态导入
   - 样式加载器

3. **VueTemplateScanner**
   - 使用 Vite `import.meta.glob` 扫描
   - 解析模板路径
   - 注册到 Registry

### Layer 3: UI (框架 UI 层)

**职责：** 提供声明式 UI 组件

**Vue Composables：**

1. **useTemplateRenderer**
   - 整合所有功能的主 hook
   - 返回响应式状态和方法
   - 自动管理生命周期

## 🔄 数据流

```
用户操作
  ↓
Vue Component (使用 useTemplateRenderer)
  ↓
VueStateAdapter (响应式状态)
  ↓
TemplateOrchestrator (编排)
  ├→ TemplateStateManager (状态)
  └→ TemplateLoadCoordinator (加载)
      ├→ VueLoaderAdapter (组件加载)
      ├→ VueStyleLoader (样式加载)
      └→ TemplateRegistry (元数据)
```

## 🎯 核心设计原则

### 1. 泛型设计
所有 Core 层使用泛型 `<TComponent>`，不绑定具体框架：

```typescript
class TemplateRegistry<TComponent = unknown> { }
class TemplateStateManager<TComponent = unknown> { }
```

### 2. 依赖注入
通过构造函数注入依赖，便于测试和扩展：

```typescript
class TemplateLoadCoordinator<TComponent> {
  constructor(
    private componentLoader: ComponentLoader<TComponent>,
    private registry: TemplateRegistry<TComponent>,
    private styleLoader?: StyleLoader
  ) {}
}
```

### 3. 观察者模式
Core 层使用事件监听器，Adapter 层转换为框架响应式：

```typescript
// Core
stateManager.addListener({
  onCategoryChange: (category) => { }
})

// Vue Adapter
watch(categoryRef, (newCategory) => {
  stateManager.setCategory(newCategory)
})
```

### 4. 单一职责
每个模块职责明确：
- Registry 只管理元数据
- StateManager 只管理状态
- LoadCoordinator 只管理加载
- Orchestrator 协调所有模块

## 🚀 使用示例

### 基础使用

```vue
<script setup lang="ts">
import { useTemplateRenderer } from '@ldesign/template-vue'

const {
  component,
  category,
  device,
  isLoading,
  switchCategory,
  switchDevice,
  availableCategories,
} = useTemplateRenderer({
  initialCategory: 'login',
  enableDeviceDetection: true,
})
</script>

<template>
  <div>
    <!-- 分类切换 -->
    <select v-model="category">
      <option v-for="cat in availableCategories" :key="cat" :value="cat">
        {{ cat }}
      </option>
    </select>
    
    <!-- 模板渲染 -->
    <component :is="component" v-if="component && !isLoading" />
    <div v-else-if="isLoading">Loading...</div>
  </div>
</template>
```

### 高级配置

```typescript
const renderer = useTemplateRenderer({
  initialCategory: 'dashboard',
  initialDevice: 'mobile',
  enableDeviceDetection: true,
  deviceDetectionDebounce: 500,
  orchestrator: {
    autoLoad: true,
    enablePreload: true,
    preloadStrategy: 'adjacent',
    loadTimeout: 5000,
  },
})
```

## 🔧 扩展其他框架

要支持 React，只需：

1. 创建 `packages/react/`
2. 实现 React 适配器：
   - `ReactStateAdapter` (useState/useReducer)
   - `ReactLoaderAdapter` (React.lazy)
   - `ReactTemplateScanner`
3. 实现 `useTemplateRenderer` hook
4. Core 层完全复用！

## 📊 性能特性

- ✅ 懒加载组件
- ✅ 智能缓存
- ✅ 预加载策略
- ✅ 去抖设备检测
- ✅ 样式按需加载
- ✅ 支持代码分割

## 🎨 设计亮点

1. **最大化复用** - Core 层 90% 代码可跨框架复用
2. **类型安全** - 全泛型设计，完整 TypeScript 支持
3. **解耦合** - 三层架构，职责清晰
4. **可测试** - 依赖注入，易于 mock
5. **可扩展** - 插件化设计，易于添加新功能
