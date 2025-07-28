import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { chromium, Browser, Page, BrowserContext } from 'playwright'

describe('演示应用 E2E 测试', () => {
  let browser: Browser
  let context: BrowserContext
  let page: Page

  beforeAll(async () => {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
  })

  afterAll(async () => {
    await browser.close()
  })

  beforeEach(async () => {
    context = await browser.newContext({
      viewport: { width: 1200, height: 800 }
    })
    page = await context.newPage()
    
    // 导航到演示应用
    await page.goto('http://localhost:3000')
  })

  afterEach(async () => {
    await context.close()
  })

  describe('应用加载', () => {
    it('应该成功加载演示应用', async () => {
      await expect(page).toHaveTitle(/LDesign Template 演示/)
      
      // 检查主要导航
      await expect(page.locator('.nav-tabs')).toBeVisible()
      await expect(page.locator('[data-tab="basic"]')).toBeVisible()
      await expect(page.locator('[data-tab="advanced"]')).toBeVisible()
      await expect(page.locator('[data-tab="developer"]')).toBeVisible()
      await expect(page.locator('[data-tab="performance"]')).toBeVisible()
    })

    it('应该显示默认的基础演示', async () => {
      await expect(page.locator('.basic-demo')).toBeVisible()
      await expect(page.locator('.template-display')).toBeVisible()
      await expect(page.locator('.control-panel')).toBeVisible()
    })
  })

  describe('基础演示功能', () => {
    beforeEach(async () => {
      // 确保在基础演示页面
      await page.click('[data-tab="basic"]')
      await page.waitForSelector('.basic-demo')
    })

    it('应该显示设备检测信息', async () => {
      const deviceInfo = page.locator('.device-info')
      await expect(deviceInfo).toBeVisible()
      
      const deviceType = await deviceInfo.locator('.device-type').textContent()
      expect(deviceType).toMatch(/桌面端|平板端|移动端/)
    })

    it('应该能够切换设备模拟', async () => {
      // 点击移动端按钮
      await page.click('[data-device="mobile"]')
      
      // 等待设备类型更新
      await page.waitForFunction(() => {
        const element = document.querySelector('.device-type')
        return element?.textContent?.includes('移动端')
      })
      
      const deviceType = await page.locator('.device-type').textContent()
      expect(deviceType).toContain('移动端')
    })

    it('应该能够切换模板', async () => {
      // 等待模板列表加载
      await page.waitForSelector('.template-list .template-item')
      
      // 获取第一个模板项
      const firstTemplate = page.locator('.template-list .template-item').first()
      const templateName = await firstTemplate.locator('.template-name').textContent()
      
      // 点击模板
      await firstTemplate.click()
      
      // 等待模板切换
      await page.waitForTimeout(500)
      
      // 检查当前模板是否更新
      const currentTemplate = page.locator('.template-meta .badge').first()
      await expect(currentTemplate).toBeVisible()
    })

    it('应该能够修改模板属性', async () => {
      // 修改应用标题
      const titleInput = page.locator('input[placeholder*="标题"]')
      await titleInput.fill('测试标题')
      
      // 等待属性更新
      await page.waitForTimeout(300)
      
      // 检查模板中的标题是否更新
      const templateTitle = page.locator('.template-display h1')
      await expect(templateTitle).toHaveText('测试标题')
    })

    it('应该记录事件日志', async () => {
      // 触发登录事件
      const loginForm = page.locator('.template-display form')
      await loginForm.locator('input[type="text"]').fill('testuser')
      await loginForm.locator('input[type="password"]').fill('testpass')
      await loginForm.locator('button[type="submit"]').click()
      
      // 检查事件日志
      await page.waitForSelector('.event-log .event-item')
      const eventItems = page.locator('.event-log .event-item')
      await expect(eventItems.first()).toBeVisible()
      
      const eventName = await eventItems.first().locator('.event-name').textContent()
      expect(eventName).toContain('登录')
    })
  })

  describe('高级功能演示', () => {
    beforeEach(async () => {
      await page.click('[data-tab="advanced"]')
      await page.waitForSelector('.advanced-demo')
    })

    it('应该显示缓存管理功能', async () => {
      // 点击缓存管理选项卡
      await page.click('[data-feature="cache"]')
      await page.waitForSelector('.cache-controls')
      
      await expect(page.locator('.cache-stats')).toBeVisible()
      await expect(page.locator('.cache-controls')).toBeVisible()
    })

    it('应该能够清空缓存', async () => {
      await page.click('[data-feature="cache"]')
      
      // 点击清空缓存按钮
      await page.click('button:has-text("清空缓存")')
      
      // 等待通知显示
      await page.waitForSelector('.notification')
      const notification = page.locator('.notification')
      await expect(notification).toHaveText(/缓存已清空/)
    })

    it('应该显示性能监控', async () => {
      await page.click('[data-feature="performance"]')
      await page.waitForSelector('.metrics-grid')
      
      // 检查性能指标卡片
      const metricCards = page.locator('.metric-card')
      await expect(metricCards).toHaveCount(4) // 加载时间、渲染时间、内存使用、FPS
      
      // 检查每个指标都有值
      for (let i = 0; i < 4; i++) {
        const metricValue = metricCards.nth(i).locator('.metric-value')
        await expect(metricValue).not.toBeEmpty()
      }
    })

    it('应该能够自定义主题', async () => {
      await page.click('[data-feature="theme"]')
      await page.waitForSelector('.theme-editor')
      
      // 修改主色调
      const colorInput = page.locator('input[type="color"]').first()
      await colorInput.fill('#ff0000')
      
      // 点击应用主题
      await page.click('button:has-text("应用主题")')
      
      // 检查预览区域的颜色是否更新
      const previewArea = page.locator('.theme-preview')
      const computedStyle = await previewArea.evaluate(el => 
        getComputedStyle(el).getPropertyValue('--primary-color')
      )
      expect(computedStyle).toContain('#ff0000')
    })
  })

  describe('开发者工具', () => {
    beforeEach(async () => {
      await page.click('[data-tab="developer"]')
      await page.waitForSelector('.developer-demo')
    })

    it('应该显示代码编辑器', async () => {
      await expect(page.locator('.code-editor')).toBeVisible()
      await expect(page.locator('.file-tabs')).toBeVisible()
      
      // 检查文件选项卡
      await expect(page.locator('[data-file="config.ts"]')).toBeVisible()
      await expect(page.locator('[data-file="template.vue"]')).toBeVisible()
      await expect(page.locator('[data-file="styles.less"]')).toBeVisible()
    })

    it('应该能够切换文件选项卡', async () => {
      // 点击 template.vue 选项卡
      await page.click('[data-file="template.vue"]')
      
      // 检查代码内容是否更新
      const codeContent = page.locator('.code-content')
      const content = await codeContent.textContent()
      expect(content).toContain('<template>')
    })

    it('应该能够生成模板', async () => {
      // 填写模板生成器表单
      await page.fill('input[placeholder*="模板名称"]', '测试模板')
      await page.selectOption('select[data-field="device"]', 'mobile')
      await page.selectOption('select[data-field="style"]', 'modern')
      
      // 点击生成模板
      await page.click('button:has-text("生成模板")')
      
      // 等待通知
      await page.waitForSelector('.notification')
      const notification = page.locator('.notification')
      await expect(notification).toHaveText(/模板已生成/)
    })

    it('应该能够验证模板', async () => {
      // 点击验证模板按钮
      await page.click('button:has-text("验证模板")')
      
      // 等待验证结果
      await page.waitForSelector('.validation-result')
      const result = page.locator('.validation-result')
      await expect(result).toBeVisible()
    })

    it('应该能够预览模板', async () => {
      // 点击预览模板按钮
      await page.click('button:has-text("预览模板")')
      
      // 等待预览模态框
      await page.waitForSelector('.preview-modal')
      const modal = page.locator('.preview-modal')
      await expect(modal).toBeVisible()
      
      // 检查预览内容
      await expect(modal.locator('.template-placeholder')).toBeVisible()
      
      // 关闭模态框
      await page.click('.btn-close')
      await expect(modal).not.toBeVisible()
    })
  })

  describe('性能监控', () => {
    beforeEach(async () => {
      await page.click('[data-tab="performance"]')
      await page.waitForSelector('.performance-demo')
    })

    it('应该显示性能指标', async () => {
      // 检查性能指标卡片
      const metricCards = page.locator('.metric-card')
      await expect(metricCards).toHaveCount(4)
      
      // 检查每个指标的结构
      for (let i = 0; i < 4; i++) {
        const card = metricCards.nth(i)
        await expect(card.locator('.metric-icon')).toBeVisible()
        await expect(card.locator('.metric-value')).toBeVisible()
        await expect(card.locator('.metric-label')).toBeVisible()
        await expect(card.locator('.metric-trend')).toBeVisible()
      }
    })

    it('应该能够开始和停止监控', async () => {
      // 开始监控
      await page.click('button:has-text("开始")')
      
      // 检查监控状态
      await page.waitForSelector('.status-indicator.active')
      const statusIndicator = page.locator('.status-indicator.active')
      await expect(statusIndicator).toBeVisible()
      
      // 等待一段时间让监控收集数据
      await page.waitForTimeout(2000)
      
      // 停止监控
      await page.click('button:has-text("停止")')
      
      // 检查监控已停止
      await expect(page.locator('.status-indicator.active')).not.toBeVisible()
    })

    it('应该能够生成性能报告', async () => {
      // 点击生成报告按钮
      await page.click('button:has-text("生成报告")')
      
      // 等待下载开始（检查通知）
      await page.waitForSelector('.notification')
      const notification = page.locator('.notification')
      await expect(notification).toHaveText(/性能报告已生成/)
    })
  })

  describe('响应式设计', () => {
    it('应该在移动端正确显示', async () => {
      // 设置移动端视口
      await page.setViewportSize({ width: 375, height: 667 })
      
      // 等待响应式布局生效
      await page.waitForTimeout(500)
      
      // 检查移动端布局
      const controlPanel = page.locator('.control-panel')
      const templateDisplay = page.locator('.template-display')
      
      // 在移动端，控制面板应该在模板显示区域下方
      const controlPanelBox = await controlPanel.boundingBox()
      const templateDisplayBox = await templateDisplay.boundingBox()
      
      if (controlPanelBox && templateDisplayBox) {
        expect(controlPanelBox.y).toBeGreaterThan(templateDisplayBox.y)
      }
    })

    it('应该在平板端正确显示', async () => {
      // 设置平板端视口
      await page.setViewportSize({ width: 768, height: 1024 })
      
      await page.waitForTimeout(500)
      
      // 检查设备检测是否正确
      const deviceType = await page.locator('.device-type').textContent()
      expect(deviceType).toContain('平板端')
    })
  })

  describe('错误处理', () => {
    it('应该处理网络错误', async () => {
      // 模拟网络错误
      await page.route('**/api/**', route => route.abort())
      
      // 尝试触发需要网络请求的操作
      await page.click('button:has-text("预加载模板")')
      
      // 检查错误处理
      await page.waitForSelector('.notification.error', { timeout: 5000 })
      const errorNotification = page.locator('.notification.error')
      await expect(errorNotification).toBeVisible()
    })

    it('应该显示降级模板', async () => {
      // 模拟模板加载失败
      await page.evaluate(() => {
        // 注入错误到模板管理器
        window.__TEMPLATE_MANAGER__?.simulateError('template-load-error')
      })
      
      // 检查是否显示降级模板或错误状态
      const errorState = page.locator('.template-error, .fallback-template')
      await expect(errorState).toBeVisible()
    })
  })

  describe('用户交互', () => {
    it('应该支持键盘导航', async () => {
      // 使用 Tab 键导航
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // 检查焦点是否正确
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    it('应该支持快捷键', async () => {
      // 测试快捷键（如果有的话）
      await page.keyboard.press('Control+k')
      
      // 检查是否触发了相应的功能
      // 这里需要根据实际的快捷键功能来验证
    })
  })

  describe('数据持久化', () => {
    it('应该保存用户偏好设置', async () => {
      // 修改设置
      await page.fill('input[placeholder*="标题"]', '持久化测试')
      
      // 刷新页面
      await page.reload()
      await page.waitForSelector('.basic-demo')
      
      // 检查设置是否保存
      const titleInput = page.locator('input[placeholder*="标题"]')
      const value = await titleInput.inputValue()
      expect(value).toBe('持久化测试')
    })
  })
})
