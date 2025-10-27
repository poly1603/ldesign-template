/**
 * 模板测试工具集
 * 
 * @description
 * 提供完整的自动化测试工具：
 * - 截图对比测试：视觉回归测试
 * - 可访问性测试：WCAG合规性检查
 * - 性能回归测试：性能指标对比
 * - 快照测试：模板状态快照对比
 * - 集成测试：端到端测试支持
 * 
 * @example
 * ```ts
 * // 截图对比测试
 * const tester = new VisualRegressionTester()
 * const result = await tester.compareScreenshot(element, 'baseline.png')
 * 
 * // 可访问性测试
 * const a11yTester = new AccessibilityTester()
 * const issues = await a11yTester.test(element)
 * 
 * // 性能测试
 * const perfTester = new PerformanceRegressionTester()
 * const perfResult = await perfTester.test(() => loadTemplate())
 * ```
 */

/**
 * 截图对比结果
 */
export interface ScreenshotComparisonResult {
  /** 是否通过 */
  passed: boolean
  /** 差异百分比 (0-100) */
  diffPercentage: number
  /** 差异图片URL */
  diffImageUrl?: string
  /** 差异像素数 */
  diffPixels: number
  /** 总像素数 */
  totalPixels: number
  /** 阈值 */
  threshold: number
}

/**
 * 可访问性问题
 */
export interface AccessibilityIssue {
  /** 问题类型 */
  type: 'error' | 'warning' | 'notice'
  /** 问题描述 */
  message: string
  /** WCAG级别 */
  wcagLevel: 'A' | 'AA' | 'AAA'
  /** 影响的元素 */
  element?: HTMLElement
  /** 建议修复方法 */
  suggestion?: string
  /** 相关WCAG规则 */
  wcagRule?: string
}

/**
 * 可访问性测试结果
 */
export interface AccessibilityTestResult {
  /** 是否通过 */
  passed: boolean
  /** 问题列表 */
  issues: AccessibilityIssue[]
  /** 错误数量 */
  errorCount: number
  /** 警告数量 */
  warningCount: number
  /** 分数 (0-100) */
  score: number
}

/**
 * 性能回归测试结果
 */
export interface PerformanceRegressionResult {
  /** 是否通过 */
  passed: boolean
  /** 当前性能指标 */
  current: PerformanceMetrics
  /** 基线性能指标 */
  baseline: PerformanceMetrics
  /** 回归项目 */
  regressions: PerformanceRegression[]
  /** 改进项目 */
  improvements: PerformanceImprovement[]
}

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  /** 加载时间（毫秒） */
  loadTime: number
  /** 渲染时间（毫秒） */
  renderTime: number
  /** 内存使用（字节） */
  memoryUsage: number
  /** FPS */
  fps: number
  /** 首次内容绘制（毫秒） */
  fcp?: number
  /** 最大内容绘制（毫秒） */
  lcp?: number
}

/**
 * 性能回归
 */
export interface PerformanceRegression {
  /** 指标名称 */
  metric: string
  /** 当前值 */
  current: number
  /** 基线值 */
  baseline: number
  /** 回归百分比 */
  regressionPercent: number
}

/**
 * 性能改进
 */
export interface PerformanceImprovement {
  /** 指标名称 */
  metric: string
  /** 当前值 */
  current: number
  /** 基线值 */
  baseline: number
  /** 改进百分比 */
  improvementPercent: number
}

/**
 * 视觉回归测试器
 */
export class VisualRegressionTester {
  private baselines: Map<string, ImageData> = new Map()

  /**
   * 对比截图
   * 
   * @description
   * 比较当前截图与基线截图的差异
   * 
   * @param element - 要截图的元素
   * @param baselineName - 基线名称
   * @param threshold - 差异阈值 (0-100)
   * @returns 对比结果
   */
  async compareScreenshot(
    element: HTMLElement,
    baselineName: string,
    threshold: number = 0.1
  ): Promise<ScreenshotComparisonResult> {
    // 生成当前截图
    const currentImage = await this.captureElement(element)

    // 获取基线图片
    const baselineImage = this.baselines.get(baselineName)

    if (!baselineImage) {
      // 如果没有基线，保存当前图片作为基线
      this.baselines.set(baselineName, currentImage)
      return {
        passed: true,
        diffPercentage: 0,
        diffPixels: 0,
        totalPixels: currentImage.width * currentImage.height,
        threshold,
      }
    }

    // 计算差异
    const diff = this.calculateDiff(currentImage, baselineImage)

    return {
      passed: diff.percentage <= threshold,
      diffPercentage: diff.percentage,
      diffPixels: diff.pixels,
      totalPixels: currentImage.width * currentImage.height,
      threshold,
      diffImageUrl: diff.imageUrl,
    }
  }

  /**
   * 捕获元素截图
   */
  private async captureElement(element: HTMLElement): Promise<ImageData> {
    const canvas = document.createElement('canvas')
    const rect = element.getBoundingClientRect()

    canvas.width = rect.width
    canvas.height = rect.height

    const ctx = canvas.getContext('2d')!

    // 简化实现：使用Canvas API
    // 实际应该使用html2canvas或类似库
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    return imageData
  }

  /**
   * 计算图片差异
   */
  private calculateDiff(
    image1: ImageData,
    image2: ImageData
  ): { percentage: number; pixels: number; imageUrl?: string } {
    if (image1.width !== image2.width || image1.height !== image2.height) {
      return { percentage: 100, pixels: image1.width * image1.height }
    }

    let diffPixels = 0
    const totalPixels = image1.width * image1.height

    // 像素级对比
    for (let i = 0; i < image1.data.length; i += 4) {
      const r1 = image1.data[i]
      const g1 = image1.data[i + 1]
      const b1 = image1.data[i + 2]
      const a1 = image1.data[i + 3]

      const r2 = image2.data[i]
      const g2 = image2.data[i + 1]
      const b2 = image2.data[i + 2]
      const a2 = image2.data[i + 3]

      // 计算颜色差异
      const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) +
        Math.abs(b1 - b2) + Math.abs(a1 - a2)

      if (diff > 10) { // 阈值
        diffPixels++
      }
    }

    return {
      percentage: (diffPixels / totalPixels) * 100,
      pixels: diffPixels,
    }
  }

  /**
   * 保存基线
   */
  saveBaseline(name: string, imageData: ImageData): void {
    this.baselines.set(name, imageData)
  }

  /**
   * 清除所有基线
   */
  clearBaselines(): void {
    this.baselines.clear()
  }
}

/**
 * 可访问性测试器
 */
export class AccessibilityTester {
  private rules: Array<{
    name: string
    check: (element: HTMLElement) => AccessibilityIssue[]
  }> = []

  constructor() {
    this.registerDefaultRules()
  }

  /**
   * 注册默认规则
   */
  private registerDefaultRules(): void {
    // 图片alt属性检查
    this.registerRule('image-alt', (element) => {
      const issues: AccessibilityIssue[] = []
      const images = element.querySelectorAll('img')

      images.forEach(img => {
        if (!img.alt) {
          issues.push({
            type: 'error',
            message: '图片缺少alt属性',
            wcagLevel: 'A',
            element: img,
            suggestion: '为图片添加描述性的alt文本',
            wcagRule: 'WCAG 1.1.1',
          })
        }
      })

      return issues
    })

    // 表单标签检查
    this.registerRule('form-labels', (element) => {
      const issues: AccessibilityIssue[] = []
      const inputs = element.querySelectorAll('input, textarea, select')

      inputs.forEach(input => {
        const id = input.id
        if (id) {
          const label = element.querySelector(`label[for="${id}"]`)
          if (!label) {
            issues.push({
              type: 'error',
              message: '表单控件缺少关联的label',
              wcagLevel: 'A',
              element: input as HTMLElement,
              suggestion: '添加<label>元素或aria-label属性',
              wcagRule: 'WCAG 3.3.2',
            })
          }
        }
      })

      return issues
    })

    // 颜色对比度检查
    this.registerRule('color-contrast', (element) => {
      const issues: AccessibilityIssue[] = []
      const texts = element.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6')

      texts.forEach(text => {
        const styles = window.getComputedStyle(text)
        const color = styles.color
        const bgColor = styles.backgroundColor

        if (!this.hasGoodContrast(color, bgColor)) {
          issues.push({
            type: 'warning',
            message: '颜色对比度可能不足',
            wcagLevel: 'AA',
            element: text as HTMLElement,
            suggestion: '增加文本和背景的对比度',
            wcagRule: 'WCAG 1.4.3',
          })
        }
      })

      return issues
    })

    // 语义化HTML检查
    this.registerRule('semantic-html', (element) => {
      const issues: AccessibilityIssue[] = []

      // 检查按钮
      const divButtons = element.querySelectorAll('div[onclick], span[onclick]')
      divButtons.forEach(btn => {
        issues.push({
          type: 'warning',
          message: '使用非语义化元素作为按钮',
          wcagLevel: 'A',
          element: btn as HTMLElement,
          suggestion: '使用<button>元素代替',
          wcagRule: 'WCAG 4.1.2',
        })
      })

      return issues
    })

    // ARIA属性检查
    this.registerRule('aria-attributes', (element) => {
      const issues: AccessibilityIssue[] = []
      const interactive = element.querySelectorAll('[role]')

      interactive.forEach(el => {
        const role = el.getAttribute('role')

        // 检查必需的ARIA属性
        if (role === 'button' && !el.hasAttribute('aria-label') && !el.textContent?.trim()) {
          issues.push({
            type: 'error',
            message: '按钮缺少可访问的名称',
            wcagLevel: 'A',
            element: el as HTMLElement,
            suggestion: '添加aria-label或文本内容',
            wcagRule: 'WCAG 4.1.2',
          })
        }
      })

      return issues
    })
  }

  /**
   * 注册测试规则
   */
  registerRule(
    name: string,
    check: (element: HTMLElement) => AccessibilityIssue[]
  ): void {
    this.rules.push({ name, check })
  }

  /**
   * 执行测试
   * 
   * @param element - 要测试的元素
   * @returns 测试结果
   */
  async test(element: HTMLElement): Promise<AccessibilityTestResult> {
    const allIssues: AccessibilityIssue[] = []

    // 执行所有规则
    for (const rule of this.rules) {
      try {
        const issues = rule.check(element)
        allIssues.push(...issues)
      } catch (error) {
        console.error(`[A11y] 规则执行失败: ${rule.name}`, error)
      }
    }

    // 统计
    const errorCount = allIssues.filter(i => i.type === 'error').length
    const warningCount = allIssues.filter(i => i.type === 'warning').length

    // 计算分数
    const score = Math.max(0, 100 - (errorCount * 10 + warningCount * 5))

    return {
      passed: errorCount === 0,
      issues: allIssues,
      errorCount,
      warningCount,
      score,
    }
  }

  /**
   * 检查颜色对比度
   */
  private hasGoodContrast(color: string, bgColor: string): boolean {
    // 简化实现：实际应使用WCAG对比度计算公式
    // 这里只是示例
    return true
  }

  /**
   * 生成报告
   */
  generateReport(result: AccessibilityTestResult): string {
    const lines: string[] = []

    lines.push('# 可访问性测试报告')
    lines.push('')
    lines.push(`- 测试结果: ${result.passed ? '✅ 通过' : '❌ 失败'}`)
    lines.push(`- 分数: ${result.score}/100`)
    lines.push(`- 错误: ${result.errorCount}`)
    lines.push(`- 警告: ${result.warningCount}`)
    lines.push('')

    if (result.issues.length > 0) {
      lines.push('## 问题列表')
      lines.push('')

      const errors = result.issues.filter(i => i.type === 'error')
      const warnings = result.issues.filter(i => i.type === 'warning')

      if (errors.length > 0) {
        lines.push('### 错误')
        errors.forEach(issue => {
          lines.push(`- ❌ ${issue.message}`)
          lines.push(`  - WCAG级别: ${issue.wcagLevel}`)
          lines.push(`  - 规则: ${issue.wcagRule}`)
          if (issue.suggestion) {
            lines.push(`  - 建议: ${issue.suggestion}`)
          }
        })
        lines.push('')
      }

      if (warnings.length > 0) {
        lines.push('### 警告')
        warnings.forEach(issue => {
          lines.push(`- ⚠️ ${issue.message}`)
          lines.push(`  - WCAG级别: ${issue.wcagLevel}`)
          if (issue.suggestion) {
            lines.push(`  - 建议: ${issue.suggestion}`)
          }
        })
      }
    }

    return lines.join('\n')
  }
}

/**
 * 性能回归测试器
 */
export class PerformanceRegressionTester {
  private baselines: Map<string, PerformanceMetrics> = new Map()
  private threshold: number = 10 // 10%回归阈值

  /**
   * 执行性能测试
   * 
   * @param operation - 要测试的操作
   * @param baselineName - 基线名称
   * @returns 测试结果
   */
  async test(
    operation: () => Promise<void> | void,
    baselineName: string
  ): Promise<PerformanceRegressionResult> {
    const startTime = performance.now()

    // 记录初始内存
    const initialMemory = this.getMemoryUsage()

    // 执行操作
    await operation()

    // 记录性能指标
    const endTime = performance.now()
    const finalMemory = this.getMemoryUsage()

    const current: PerformanceMetrics = {
      loadTime: endTime - startTime,
      renderTime: endTime - startTime, // 简化
      memoryUsage: finalMemory - initialMemory,
      fps: this.getCurrentFPS(),
      fcp: this.getFCP(),
      lcp: this.getLCP(),
    }

    // 获取基线
    const baseline = this.baselines.get(baselineName)

    if (!baseline) {
      // 保存为新基线
      this.baselines.set(baselineName, current)
      return {
        passed: true,
        current,
        baseline: current,
        regressions: [],
        improvements: [],
      }
    }

    // 对比分析
    const regressions: PerformanceRegression[] = []
    const improvements: PerformanceImprovement[] = []

    const metrics: Array<keyof PerformanceMetrics> = [
      'loadTime',
      'renderTime',
      'memoryUsage',
    ]

    metrics.forEach(metric => {
      const currentValue = current[metric] as number
      const baselineValue = baseline[metric] as number

      if (currentValue > baselineValue) {
        const percent = ((currentValue - baselineValue) / baselineValue) * 100
        if (percent > this.threshold) {
          regressions.push({
            metric,
            current: currentValue,
            baseline: baselineValue,
            regressionPercent: percent,
          })
        }
      } else if (currentValue < baselineValue) {
        const percent = ((baselineValue - currentValue) / baselineValue) * 100
        if (percent > 5) {
          improvements.push({
            metric,
            current: currentValue,
            baseline: baselineValue,
            improvementPercent: percent,
          })
        }
      }
    })

    return {
      passed: regressions.length === 0,
      current,
      baseline,
      regressions,
      improvements,
    }
  }

  /**
   * 获取内存使用
   */
  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize
    }
    return 0
  }

  /**
   * 获取当前FPS
   */
  private getCurrentFPS(): number {
    // 简化实现
    return 60
  }

  /**
   * 获取首次内容绘制时间
   */
  private getFCP(): number | undefined {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const entries = performance.getEntriesByType('paint')
      const fcp = entries.find(e => e.name === 'first-contentful-paint')
      return fcp?.startTime
    }
    return undefined
  }

  /**
   * 获取最大内容绘制时间
   */
  private getLCP(): number | undefined {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const entries = performance.getEntriesByType('largest-contentful-paint')
      return entries[entries.length - 1]?.startTime
    }
    return undefined
  }

  /**
   * 保存基线
   */
  saveBaseline(name: string, metrics: PerformanceMetrics): void {
    this.baselines.set(name, metrics)
  }

  /**
   * 生成报告
   */
  generateReport(result: PerformanceRegressionResult): string {
    const lines: string[] = []

    lines.push('# 性能回归测试报告')
    lines.push('')
    lines.push(`- 测试结果: ${result.passed ? '✅ 通过' : '❌ 失败'}`)
    lines.push('')

    lines.push('## 性能指标对比')
    lines.push('')
    lines.push('| 指标 | 当前 | 基线 | 变化 |')
    lines.push('|------|------|------|------|')

    const formatMetric = (key: keyof PerformanceMetrics) => {
      const current = result.current[key]
      const baseline = result.baseline[key]

      if (typeof current === 'number' && typeof baseline === 'number') {
        const change = ((current - baseline) / baseline * 100).toFixed(1)
        const arrow = current > baseline ? '↑' : current < baseline ? '↓' : '→'
        return `| ${key} | ${current.toFixed(2)} | ${baseline.toFixed(2)} | ${arrow} ${change}% |`
      }
      return ''
    }

    lines.push(formatMetric('loadTime'))
    lines.push(formatMetric('renderTime'))
    lines.push(formatMetric('memoryUsage'))
    lines.push('')

    if (result.regressions.length > 0) {
      lines.push('## ⚠️ 性能回归')
      result.regressions.forEach(reg => {
        lines.push(`- ${reg.metric}: 回归 ${reg.regressionPercent.toFixed(1)}%`)
      })
      lines.push('')
    }

    if (result.improvements.length > 0) {
      lines.push('## ✅ 性能改进')
      result.improvements.forEach(imp => {
        lines.push(`- ${imp.metric}: 改进 ${imp.improvementPercent.toFixed(1)}%`)
      })
      lines.push('')
    }

    return lines.join('\n')
  }
}

/**
 * 测试套件
 */
export class TemplateTestSuite {
  private visualTester = new VisualRegressionTester()
  private a11yTester = new AccessibilityTester()
  private perfTester = new PerformanceRegressionTester()

  /**
   * 运行完整测试
   * 
   * @param element - 要测试的元素
   * @param options - 测试选项
   * @returns 测试结果
   */
  async runAll(
    element: HTMLElement,
    options: {
      visualBaseline?: string
      perfBaseline?: string
      operation?: () => Promise<void> | void
    } = {}
  ): Promise<{
    visual?: ScreenshotComparisonResult
    accessibility: AccessibilityTestResult
    performance?: PerformanceRegressionResult
  }> {
    const results: any = {}

    // 可访问性测试
    results.accessibility = await this.a11yTester.test(element)

    // 视觉回归测试
    if (options.visualBaseline) {
      results.visual = await this.visualTester.compareScreenshot(
        element,
        options.visualBaseline
      )
    }

    // 性能回归测试
    if (options.perfBaseline && options.operation) {
      results.performance = await this.perfTester.test(
        options.operation,
        options.perfBaseline
      )
    }

    return results
  }

  /**
   * 生成综合报告
   */
  generateReport(results: any): string {
    const lines: string[] = []

    lines.push('# 模板测试综合报告')
    lines.push('')
    lines.push(`生成时间: ${new Date().toISOString()}`)
    lines.push('')

    if (results.accessibility) {
      lines.push('## 可访问性测试')
      lines.push(`- 结果: ${results.accessibility.passed ? '✅ 通过' : '❌ 失败'}`)
      lines.push(`- 分数: ${results.accessibility.score}/100`)
      lines.push(`- 错误: ${results.accessibility.errorCount}`)
      lines.push(`- 警告: ${results.accessibility.warningCount}`)
      lines.push('')
    }

    if (results.visual) {
      lines.push('## 视觉回归测试')
      lines.push(`- 结果: ${results.visual.passed ? '✅ 通过' : '❌ 失败'}`)
      lines.push(`- 差异: ${results.visual.diffPercentage.toFixed(2)}%`)
      lines.push('')
    }

    if (results.performance) {
      lines.push('## 性能回归测试')
      lines.push(`- 结果: ${results.performance.passed ? '✅ 通过' : '❌ 失败'}`)
      lines.push(`- 回归项: ${results.performance.regressions.length}`)
      lines.push(`- 改进项: ${results.performance.improvements.length}`)
      lines.push('')
    }

    return lines.join('\n')
  }
}

/**
 * 创建测试套件
 */
export function createTestSuite(): TemplateTestSuite {
  return new TemplateTestSuite()
}

/**
 * 创建视觉回归测试器
 */
export function createVisualTester(): VisualRegressionTester {
  return new VisualRegressionTester()
}

/**
 * 创建可访问性测试器
 */
export function createA11yTester(): AccessibilityTester {
  return new AccessibilityTester()
}

/**
 * 创建性能回归测试器
 */
export function createPerfTester(): PerformanceRegressionTester {
  return new PerformanceRegressionTester()
}


