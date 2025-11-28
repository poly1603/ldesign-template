
# 实施指南 - import.meta.glob 核心方案

## 🎯 核心设计理念

使用 **import.meta.glob** 实现:
1. **运行时动态发现**: 自动扫描所有符合规则的模板文件
2. **懒加载优化**: 按需加载模板组件,提升性能
3. **类型安全**: 配合 TypeScript 提供完整的类型推导
4. **热更新支持**: 开发时新增模板自动识别

---

## 📋 import.meta.glob 详细方案

### 方案 1: 双模式扫描(推荐)

```typescript
// packages/vue/src/scanner/TemplateScanner.ts

export class TemplateScanner {
  /**
   * 懒加载模式 - 用于组件本身
   * eager: false 表示返回的是加载函数,不会立即执行
   */
  private lazyComponents = import.meta.glob<{ default: Component }>(
    '../templates/**/{desktop,mobile,tablet}/*/index.vue',
    { eager: false }
  )

  /**
   * 即时加载模式 - 用于配置文件
   * eager: true 表示构建时就加载,import 指定导入的内容
   */
  private eagerConfigs = import.meta.glob<TemplateConfig>(
    '../templates/**/{desktop,mobile,tablet}/*/template.config.ts',
    { eager: true, import: 'default' }
  )

  /**
   * 扫描并构建模板注册表
   */
  scan(): TemplateMetadata[] {
    const templates: TemplateMetadata[] = []

    for (const [componentPath, loader] of Object.entries(this.lazyComponents)) {
      // 从路径提取信息
      // 路径格式: ../templates/login/desktop/default/index.vue
      const parsed = this.parsePath(componentPath)
      
      // 查找对应的配置文件
      const configPath = componentPath.replace('index.vue', 'template.config.ts')
      const config = this.eagerConfigs[configPath] || {}

      templates.push({
        id: `${parsed.category}:${parsed.device}:${parsed.name}`,
        category: parsed.category,
        device: parsed.device,
        name: parsed.name,
        path: componentPath,
        loader, // 保存懒加载函数
        ...config, // 合并配置
      })
    }

    return templates
  }

  /**
   * 路径解析
   * ../templates/login/desktop/default/index.vue
   *            └─┬──┘ └──┬──┘ └──┬──┘
   *           category device  name
   */
  private parsePath(path: string) {
    const regex = /templates\/([^/]+)\/([^/]+)\/([^/]+)\//
    const match = path.match(regex)
    
    if (!match) {
      throw new Error(`Invalid template path: ${path}`)
    }

    return {
      category: match[1],
      device: match[2] as DeviceType,
      name: match[3],
    }
  }
}
```

### 方案 2: 类型安全的 Glob 模式

```typescript
// packages/vue/src/types/glob.ts

/**
 * 为 import.meta.glob 提供类型支持
 */
export type GlobModule<T = any> = Record<string, () => Promise<T>>

export type GlobEagerModule<T = any> = Record<string, T>

export interface TemplateGlobResult {
  components: GlobModule<{ default: Component }>
  configs: GlobEagerModule<TemplateConfig>
  previews: GlobEagerModule<string>
}

/**
 * 类型安全的扫描器
 */
export function createTemplateGlob(): TemplateGlobResult {
  return {
    components: import.meta.glob(
      '../templates/**/{desktop,mobile,tablet}/*/index.vue',
      { eager: false }
    ),
    configs: import.meta.glob(
      '../templates/**/{desktop,mobile,tablet}/*/template.config.ts',
      { eager: true, import: 'default' }
    ),
    previews: import.meta.glob(
      '../templates/**/{desktop,mobile,tablet}/*/preview.png',
      { eager: true, as: 'url' }
    ),
  }
}
```

---

## 🔧 关键实现细节

### 1. TemplateRegistry 实现

```typescript
// packages/core/src/registry/TemplateRegistry.ts

export class TemplateRegistry {
  private templates = new Map<string, TemplateMetadata>()
  private categoryIndex = new Map<string, Set<string>>()
  private deviceIndex = new Map<DeviceType, Set<string>>()

  /**
   * 注册单个模板
   */
  register(metadata: TemplateMetadata): void {
    const { id, category, device } = metadata

    // 主存储
    this.templates.set(id, metadata)

    // 构建分类索引
    if (!this.categoryIndex.has(category)) {
      this.categoryIndex.set(category, new Set())
    }
    this.categoryIndex.get(category)!.add(id)

    // 构建设备索引
    if (!this.deviceIndex.has(device)) {
      this.deviceIndex.set(device, new Set())
    }
    this.deviceIndex.get(device)!.add(id)
  }

  /**
   * 批量注册
   */
  registerBatch(metadataList: TemplateMetadata[]): void {
    metadataList.forEach(m => this.register(m))
  }

  /**
   * 通过ID获取模板
   */
  get(id: string): TemplateMetadata | undefined {
    return this.templates.get(id)
  }

  /**
   * 通过分类获取所有模板ID
   */
  getIdsByCategory(category: string): string[] {
    return Array.from(this.categoryIndex.get(category) || [])
  }

  /**
   * 通过设备类型获取所有模板ID
   */
  getIdsByDevice(device: DeviceType): string[] {
    return Array.from(this.deviceIndex.get(device) || [])
  }

  /**
   * 通过分类和设备获取模板ID
   */
  getIdsByCategoryAndDevice(category: string, device: DeviceType): string[] {
    const categoryIds = this.categoryIndex.get(category) || new Set()
    const deviceIds = this.deviceIndex.get(device) || new Set()
    
    // 取交集
    return Array.from(categoryIds).filter(id => deviceIds.has(id))
  }

  /**
   * 获取所有模板
   */
  getAll(): TemplateMetadata[] {
    return Array.from(this.templates.values())
  }

  /**
   * 检查是否存在
   */
  has(id: string): boolean {
    return this.templates.has(id)
  }

  /**
   * 清空注册表
   */
  clear(): void {
    this.templates.clear()
    this.categoryIndex.clear()
    this.deviceIndex.clear()
  }
}
```

### 2. TemplateManager 实现

```typescript
// packages/core/src/manager/TemplateManager.ts

export class TemplateManager {
  constructor(private registry: TemplateRegistry) {}

  /**
   * 获取单个模板
   */
  getTemplate(id: string): TemplateMetadata | undefined {
    return this.registry.get(id)
  }

  /**
   * 解析模板ID字符串
   * 支持格式:
   * 1. "login:desktop:default" - 完整ID
   * 2. "login:desktop" - 获取该分类和设备的默认模板
   */
  resolveTemplate(idOrPattern: string): TemplateMetadata | undefined {
    // 尝试直接获取
    let template = this.registry.get(idOrPattern)
    if (template) return template

    // 尝试解析模式
    const parts = idOrPattern.split(':')
    if (parts.length === 2) {
      // 格式: "login:desktop"
      const [category, device] = parts
      const ids = this.registry.getIdsByCategoryAndDevice(
        category,
        device as DeviceType
      )
      
      // 返回第一个找到的,或者寻找名为 'default' 的
      const defaultId = ids.find(id => id.endsWith(':default'))
      return this.registry.get(defaultId || ids[0])
    }

    return undefined
  }

  /**
   * 获取分类下的所有模板
   */
  getTemplatesByCategory(category: string): TemplateMetadata[] {
    const ids = this.registry.getIdsByCategory(category)
    return ids.map(id => this.registry.get(id)!).filter(Boolean)
  }

  /**
   * 获取设备类型的所有模板
   */
  getTemplatesByDevice(device: DeviceType): TemplateMetadata[] {
    const ids = this.registry.getIdsByDevice(device)
    return ids.map(id => this.registry.get(id)!).filter(Boolean)
  }

  /**
   * 获取特定分类和设备的模板
   */
  getTemplatesByCategoryAndDevice(
    category: string,
    device: DeviceType
  ): TemplateMetadata[] {
    const ids = this.registry.getIdsByCategoryAndDevice(category, device)
    return ids.map(id => this.registry.get(id)!).filter(Boolean)
  }

  /**
   * 创建查询构建器
   */
  query(): TemplateQuery {
    return new TemplateQuery(this.registry)
  }
}
```

### 3. useTemplate Composable

```typescript
// packages/vue/src/composables/useTemplate.ts

import { ref, shallowRef, watch, type Component, type Ref } from 'vue'
import type { TemplateMetadata } from '@ldesign/template-core'
import { getTemplateManager } from '../plugin/context'

export function useTemplate(templateId: string | Ref<string>) {
  const manager = getTemplateManager()
  
  const template = ref<TemplateMetadata>()
  const component = shallowRef<Component>()
  const loading = ref(false)
  const error = ref<Error>()

  /**
   * 加载模板
   */
  async function load(id?: string): Promise<void> {
    const targetId = id || (typeof templateId === 'string' ? templateId : templateId.value)
    
    loading.value = true
    error.value = undefined

    try {
      // 1. 从注册表获取元数据
      const meta = manager.resolveTemplate(targetId)
      if (!meta) {
        throw new Error(`Template not found: ${targetId}`)
      }
      template.value = meta

      // 2. 动态加载组件
      if (meta.loader) {
        const module = await meta.loader()
        component.value = module.default
      } else {
        throw new Error(`Template loader not found: ${targetId}`)
      }
    } catch (e) {
      error.value = e as Error
      console.error('Failed to load template:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 卸载模板
   */
  function unload(): void {
    component.value = undefined
    template.value = undefined
  }

  // 响应式ID变化
  if (typeof templateId !== 'string') {
    watch(templateId, (newId) => {
      if (newId) load(newId)
    }, { immediate: true })
  }

  return {
    template,
    component,
    loading,
    error,
    load,
    unload,
  }
}
```

### 4. TemplateRenderer 组件

```vue
<!-- packages/vue/src/components/TemplateRenderer.vue -->
<script setup lang="ts">
import { computed, watch } from 'vue'
import { useTemplate } from '../composables/useTemplate'

interface Props {
  templateId: string
  props?: Record<string, any>
  fallback?: Component
  onLoad?: () => void
  onError?: (error: Error) => void
}

const props = withDefaults(defineProps<Props>(), {
  props: () => ({}),
})

const { component, loading, error, load } = useTemplate(() => props.templateId)

// 自动加载
watch(() => props.templateId, () => {
  load()
}, { immediate: true })

// 回调
watch(loading, (isLoading) => {
  if (!isLoading && !error.value) {
    props.onLoad?.()
  }
})

watch(error, (err) => {
  if (err) {
    props.onError?.(err)
  }
})
</script>

<template>
  <div class="template-renderer">
    <!-- 加载中 -->
    <div v-if="loading" class="template-loading">
      <slot name="loading">加载中...</slot>
    </div>

    <!-- 错误 -->
    <div v-else-if="error" class="template-error">
      <slot name="error" :error="error">
        加载失败: {{ error.message }}
      </slot>
    </div>

    <!-- 渲染组件 -->
    <component
      v-else-if="component"
      :is="component"
      v-bind="props.props"
    />

    <!-- 后备内容 -->
    <component v-else-if="fallback" :is="fallback" />
  </div>
</template>

<style scoped>
.template-renderer {
  width: 100%;
  height: 100%;
}

.template-loading,
.template-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.template-error {
  color: #f56c6c;
}
</style>
```

### 5. Vue Plugin 初始化

```typescript
// packages/vue/src/plugin/TemplatePlugin.ts

import type { App } from 'vue'
import { TemplateRegistry, TemplateManager } from '@ldesign/template-core'
import { TemplateScanner } from '../scanner/TemplateScanner'

export interface TemplatePluginOptions {
  /**
   * 是否自动扫描模板
   * @default true
   */
  autoScan?: boolean

  /**
   * 自定义扫描器
   */
  scanner?: TemplateScanner

  /**
   * 初始模板列表
   */
  templates?: TemplateMetadata[]
}

// 全局单例
let globalManager: TemplateManager | null = null

export function createTemplatePlugin(options: TemplatePluginOptions = {}) {
  return {
    install(app: App) {
      const { autoScan = true, scanner, templates } = options

      // 创建注册表和管理器
      const registry = new TemplateRegistry()
      const manager = new TemplateManager(registry)

      // 自动扫描
      if (autoScan) {
        const templateScanner = scanner || new TemplateScanner()
        const scannedTemplates = templateScanner.scan()
        registry.registerBatch(scannedTemplates)
      }

      // 注册预定义模板
      if (templates && templates.length > 0) {
        registry.registerBatch(templates)
      }

      // 保存全局引用
      globalManager = manager

      // 提供给组件使用
      app.provide('templateManager', manager)

      // 全局属性
      app.config.globalProperties.$templates = manager
    },
  }
}

/**
 * 获取全局管理器
 */
export function getTemplateManager(): TemplateManager {
  if (!globalManager) {
    throw new Error('Template plugin not installed')
  }
  return globalManager
}
```

---

## 🎨 模板文件结构示例

### 登录模板 - Desktop Default

```
packages/vue/src/templates/login/desktop/default/
├── index.vue              # 组件实现
├── template.config.ts     # 配置文件
└── preview.png           # 预览图
```

#### index.vue

```vue
<script setup lang="ts">
interface Props {
  title?: string
  logo?: string
  onSubmit?: (data: LoginData) => void
}

const props = withDefaults(defineProps<Props>(), {
