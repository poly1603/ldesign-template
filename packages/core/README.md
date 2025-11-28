# @ldesign/template-core

模板管理核心库 - 框架无关的模板管理系统。

## 特性

- ✅ **框架无关**: 不依赖任何 UI 框架,可用于任何前端项目
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **高性能**: 使用 Map 数据结构和索引优化查询性能
- ✅ **灵活查询**: 支持链式查询和多种查询方式
- ✅ **轻量级**: 核心库体积小于 20KB

## 安装

```bash
pnpm add @ldesign/template-core
```

## 核心概念

### 模板元数据 (TemplateMetadata)

```typescript
interface TemplateMetadata {
  id: string              // 唯一标识: "login:desktop:default"
  category: string        // 功能分类: "login"
  device: DeviceType      // 设备类型: "desktop" | "mobile" | "tablet"
  name: string           // 模板名称: "default"
  displayName?: string   // 显示名称
  description?: string   // 描述
  path: string          // 文件路径
  loader?: () => Promise<any>  // 懒加载函数
  // ...更多字段
}
```

### 模板注册表 (TemplateRegistry)

负责存储和管理所有模板元数据,提供高效的索引查询。

```typescript
import { TemplateRegistry } from '@ldesign/template-core'

const registry = new TemplateRegistry()

// 注册模板
registry.register({
  id: 'login:desktop:default',
  category: 'login',
  device: 'desktop',
  name: 'default',
  path: '/path/to/template'
})

// 查询模板
const template = registry.get('login:desktop:default')
```

### 模板管理器 (TemplateManager)

提供高级的模板管理功能和查询接口。

```typescript
import { TemplateRegistry, TemplateManager } from '@ldesign/template-core'

const registry = new TemplateRegistry()
const manager = new TemplateManager(registry)

// 智能解析模板ID
const template = manager.resolveTemplate('login:desktop')

// 按分类查询
const loginTemplates = manager.getTemplatesByCategory('login')

// 按设备查询
const desktopTemplates = manager.getTemplatesByDevice('desktop')

// 链式查询
const results = manager
  .query()
  .byCategory('login')
  .byDevice('desktop')
  .byTag('simple')
  .execute()
```

## API 文档

### TemplateRegistry

#### 方法

- `register(metadata: TemplateMetadata): void` - 注册单个模板
- `registerBatch(metadataList: TemplateMetadata[]): void` - 批量注册
- `unregister(id: string): boolean` - 注销模板
- `get(id: string): TemplateMetadata | undefined` - 获取模板
- `has(id: string): boolean` - 检查模板是否存在
- `getAll(): TemplateMetadata[]` - 获取所有模板
- `getIdsByCategory(category: string): string[]` - 按分类获取ID列表
- `getIdsByDevice(device: DeviceType): string[]` - 按设备获取ID列表
- `getIdsByCategoryAndDevice(category, device): string[]` - 组合查询
- `clear(): void` - 清空注册表

### TemplateManager

#### 方法

- `getTemplate(id: string): TemplateMetadata | undefined` - 获取模板
- `resolveTemplate(idOrPattern: string): TemplateMetadata | undefined` - 智能解析
- `getTemplatesByCategory(category: string): TemplateMetadata[]` - 按分类查询
- `getTemplatesByDevice(device: DeviceType): TemplateMetadata[]` - 按设备查询
- `getTemplatesByCategoryAndDevice(category, device): TemplateMetadata[]` - 组合查询
- `query(): TemplateQuery` - 创建查询构建器
- `search(keyword: string): TemplateMetadata[]` - 模糊搜索

### TemplateQuery

#### 链式方法

- `byId(id: string): this` - 按ID查询
- `byCategory(category: string): this` - 按分类查询
- `byDevice(device: DeviceType): this` - 按设备查询
- `byTag(tag: string): this` - 按标签查询
- `filter(predicate: (template) => boolean): this` - 自定义过滤
- `execute(): TemplateMetadata[]` - 执行查询
- `first(): TemplateMetadata | undefined` - 获取第一个结果
- `count(): number` - 获取结果数量
- `exists(): boolean` - 检查是否存在匹配结果

## 工具函数

```typescript
import {
  parsePath,
  generateTemplateId,
  parseTemplateId,
  isValidDevice,
  validateTemplateMetadata
} from '@ldesign/template-core'

// 解析路径
const parsed = parsePath('templates/login/desktop/default/')
// { category: 'login', device: 'desktop', name: 'default' }

// 生成模板ID
const id = generateTemplateId('login', 'desktop', 'default')
// 'login:desktop:default'

// 解析模板ID
const parts = parseTemplateId('login:desktop:default')
// { category: 'login', device: 'desktop', name: 'default' }

// 验证设备类型
isValidDevice('desktop') // true

// 验证模板元数据
validateTemplateMetadata(metadata) // boolean
```

## License

MIT