# ⚡ @ldesign/template 快速参考

> 📦 v0.3.0 速查手册  
> 🎯 一页搞定所有API

---

## 🚀 安装

```bash
pnpm add @ldesign/template@^0.3.0
```

---

## 📦 核心API

### 模板管理

```typescript
import { getManager } from '@ldesign/template'

const manager = getManager()
await manager.initialize()
const template = await manager.loadTemplate('login', 'mobile', 'default')
```

### 组件使用

```typescript
import { TemplateRenderer } from '@ldesign/template'

<TemplateRenderer 
  category="login" 
  device="mobile"
  name="default"
/>
```

### 组合式函数

```typescript
import { useTemplate } from '@ldesign/template'

const { component, loading, error } = useTemplate(
  category, device, name
)
```

---

## 🔍 搜索引擎

```typescript
import { createTemplateSearcher } from '@ldesign/template/utils'

const searcher = createTemplateSearcher(templates)

// 全文搜索
searcher.search('登录')

// 模糊搜索
searcher.fuzzySearch('loign')

// 相似度
searcher.findSimilar(template)
```

---

## 📊 性能分析

```typescript
import { createPerformanceAnalyzer } from '@ldesign/template/utils'

const analyzer = createPerformanceAnalyzer()

analyzer.startProfile('load')
// ... 操作
analyzer.endProfile('load')

analyzer.printSummary()
```

---

## 🔗 依赖分析

```typescript
import { createDependencyAnalyzer } from '@ldesign/template/utils'

const analyzer = createDependencyAnalyzer(templates)

// 检测循环
const cycles = analyzer.detectCycles()

// 加载顺序
const order = analyzer.getLoadOrder()

// 可视化
const viz = analyzer.generateVisualizationData()
```

---

## 🤖 智能推荐

```typescript
import { createTemplateRecommender } from '@ldesign/template/utils'

const recommender = createTemplateRecommender(templates)

// 记录行为
recommender.recordUsage(userId, templateId, 'use')

// 获取推荐
const recs = recommender.getRecommendations(userId, {
  device: 'mobile',
  limit: 5
})
```

---

## 🛡️ 错误处理

```typescript
import { 
  ErrorFactory, 
  createErrorHandler,
  RecoveryStrategy 
} from '@ldesign/template/utils'

// 抛出错误
throw ErrorFactory.templateNotFound(id)

// 错误处理器
const handler = createErrorHandler({
  recovery: RecoveryStrategy.FALLBACK
})

// 包装函数
const safe = withErrorBoundary(fn, handler)
```

---

## 🖼️ 模板预览

```typescript
import { createTemplatePreviewManager } from '@ldesign/template/utils'

const preview = createTemplatePreviewManager()

// 生成预览
const data = await preview.generatePreview(element, {
  width: 400,
  height: 300
})

// 保存
await preview.savePreview(templateId, data)

// 获取
const url = await preview.getPreview(templateId)
```

---

## 🔄 版本迁移

```typescript
import { createMigrator } from '@ldesign/template/utils'

const migrator = createMigrator()

// 检查兼容性
const compat = migrator.checkCompatibility('0.3.0')

// 执行迁移
const result = await migrator.migrate('0.3.0')

// 生成报告
console.log(migrator.generateReport(result))
```

---

## 🧪 自动化测试

```typescript
import { createTestSuite } from '@ldesign/template/utils'

const suite = createTestSuite()

// 运行所有测试
const results = await suite.runAll(element, {
  visualBaseline: 'baseline',
  perfBaseline: 'perf'
})

// 生成报告
console.log(suite.generateReport(results))
```

---

## 💾 内存优化

```typescript
import { getMemoryOptimizer } from '@ldesign/template/utils'

const optimizer = getMemoryOptimizer()

// 启动监控
optimizer.startMonitoring()

// 获取状态
const status = optimizer.getMemoryStatus()

// 获取建议
const suggestions = optimizer.getSuggestions()

// 动态缓存大小
const { hotSize, warmSize } = optimizer.getDynamicCacheSize()
```

---

## 🛠️ 性能工具

```typescript
import { 
  fastHash,
  objectFingerprint,
  debounce,
  throttle,
  memoize,
  ObjectPool
} from '@ldesign/template/utils'

// 快速哈希
const hash = fastHash('my-string')

// 对象指纹
const fp = objectFingerprint({ key: 'value' })

// 防抖
const db = debounce(fn, 300)
db.cancel() // 清理
db.flush()  // 立即执行

// 节流
const th = throttle(fn, 100)
th.cancel() // 清理

// 记忆化
const memoized = memoize(fn)

// 对象池
const pool = new ObjectPool(() => [], arr => arr.length = 0)
const temp = pool.acquire()
pool.release(temp)
```

---

## 📊 快速对比

### 性能提升

| 操作 | v0.2.0 | v0.3.0 | 提升 |
|------|--------|--------|------|
| 缓存键 | 2.5ms | 0.3ms | **88%** |
| 过滤 | 15ms | 10ms | **33%** |
| 搜索 | N/A | 8ms | **新增** |

### 内存优化

| 场景 | v0.2.0 | v0.3.0 | 改善 |
|------|--------|--------|------|
| 100模板 | 45MB | 35MB | **22%** |
| 500模板 | 180MB | 120MB | **33%** |

---

## 🎯 使用场景

### 开发环境

```typescript
if (import.meta.env.DEV) {
  const analyzer = getPerformanceAnalyzer()
  const depAnalyzer = createDependencyAnalyzer(templates)
  
  setInterval(() => {
    analyzer.printSummary()
    depAnalyzer.printReport()
  }, 60000)
}
```

### 生产环境

```typescript
// 错误处理
setGlobalErrorHandler(createErrorHandler({
  recovery: RecoveryStrategy.FALLBACK,
  reportErrors: true
}))

// 内存优化
getMemoryOptimizer().startMonitoring()

// 性能监控
const analyzer = createPerformanceAnalyzer()
```

---

## 📚 文档导航

- **入门**：[README.md](./README.md)
- **升级**：[COMPLETE_UPGRADE_GUIDE.md](./COMPLETE_UPGRADE_GUIDE.md)
- **API**：[API_REFERENCE.md](./API_REFERENCE.md)
- **索引**：[📖_DOCUMENTATION_INDEX.md](./📖_DOCUMENTATION_INDEX.md)

---

## 💡 一行代码示例

```typescript
// 搜索
createTemplateSearcher(templates).search('query')

// 分析
createPerformanceAnalyzer().generateReport()

// 推荐
createTemplateRecommender(templates).getRecommendations(userId)

// 依赖
createDependencyAnalyzer(templates).detectCycles()

// 优化
getMemoryOptimizer().getSuggestions()
```

---

**快速上手，立即使用！** 🚀

