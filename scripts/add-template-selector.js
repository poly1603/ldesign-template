#!/usr/bin/env node

/**
 * 自动为模板添加模板选择器支持的脚本
 * 
 * 使用方法:
 * node scripts/add-template-selector.js <template-file-path> [position]
 * 
 * 示例:
 * node scripts/add-template-selector.js src/templates/dashboard/desktop/default/index.vue header-right
 * 
 * 支持的位置:
 * - header-right: Header 右侧（默认）
 * - header-left: Header 左侧
 * - top-left: 左上角浮动
 * - top-right: 右上角浮动
 * - bottom-right: 右下角浮动
 * - sidebar-bottom: 侧边栏底部
 */

const fs = require('fs')
const path = require('path')

// 位置模板配置
const POSITION_TEMPLATES = {
  'header-right': {
    import: `import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'`,
    script: `
// 获取模板选择器
const selector = useTemplateSelector()`,
    template: `
        <!-- 模板选择器 - Header 右侧 -->
        <TemplateSelector
          v-if="selector && selector.enabled"
          v-bind="selector.props.value"
          @select="selector.onSelect"
        />`,
    description: 'Header 右侧'
  },

  'header-left': {
    import: `import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'`,
    script: `
// 获取模板选择器
const selector = useTemplateSelector()`,
    template: `
        <!-- 模板选择器 - Header 左侧 -->
        <TemplateSelector
          v-if="selector && selector.enabled"
          v-bind="selector.props.value"
          @select="selector.onSelect"
        />`,
    description: 'Header 左侧'
  },

  'top-left': {
    import: `import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'`,
    script: `
// 获取模板选择器
const selector = useTemplateSelector()`,
    template: `
    <!-- 模板选择器 - 左上角 -->
    <div v-if="selector && selector.enabled" class="template-selector-wrapper top-left">
      <TemplateSelector
        v-bind="selector.props.value"
        @select="selector.onSelect"
      />
    </div>`,
    style: `
.template-selector-wrapper.top-left {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}`,
    description: '左上角浮动'
  },

  'top-right': {
    import: `import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'`,
    script: `
// 获取模板选择器
const selector = useTemplateSelector()`,
    template: `
    <!-- 模板选择器 - 右上角 -->
    <div v-if="selector && selector.enabled" class="template-selector-wrapper top-right">
      <TemplateSelector
        v-bind="selector.props.value"
        @select="selector.onSelect"
      />
    </div>`,
    style: `
.template-selector-wrapper.top-right {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
}`,
    description: '右上角浮动'
  },

  'bottom-right': {
    import: `import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'`,
    script: `
// 获取模板选择器
const selector = useTemplateSelector()`,
    template: `
    <!-- 模板选择器 - 右下角 -->
    <div v-if="selector && selector.enabled" class="template-selector-wrapper bottom-right">
      <TemplateSelector
        v-bind="selector.props.value"
        @select="selector.onSelect"
      />
    </div>`,
    style: `
.template-selector-wrapper.bottom-right {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}`,
    description: '右下角浮动'
  },

  'sidebar-bottom': {
    import: `import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'`,
    script: `
// 获取模板选择器
const selector = useTemplateSelector()`,
    template: `
      <!-- 模板选择器 - 侧边栏底部 -->
      <div v-if="selector && selector.enabled" class="template-selector-wrapper sidebar-bottom">
        <TemplateSelector
          v-bind="selector.props.value"
          @select="selector.onSelect"
        />
      </div>`,
    style: `
.template-selector-wrapper.sidebar-bottom {
  margin-top: auto;
  padding: 16px;
}`,
    description: '侧边栏底部'
  }
}

function addTemplateSelectorSupport(filePath, position = 'header-right') {
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${filePath}`)
    process.exit(1)
  }

  // 检查位置是否支持
  if (!POSITION_TEMPLATES[position]) {
    console.error(`❌ 不支持的位置: ${position}`)
    console.log(`\n支持的位置:`)
    Object.keys(POSITION_TEMPLATES).forEach(key => {
      console.log(`  - ${key}: ${POSITION_TEMPLATES[key].description}`)
    })
    process.exit(1)
  }

  const template = POSITION_TEMPLATES[position]
  const content = fs.readFileSync(filePath, 'utf-8')

  // 检查是否已经添加过
  if (content.includes('useTemplateSelector')) {
    console.log(`⚠️  该模板已经添加过选择器支持`)
    return
  }

  let newContent = content

  // 1. 添加 import
  const scriptSetupMatch = content.match(/<script setup[^>]*>\n/)
  if (scriptSetupMatch) {
    const insertPos = scriptSetupMatch.index + scriptSetupMatch[0].length
    newContent =
      newContent.slice(0, insertPos) +
      template.import + '\n' +
      newContent.slice(insertPos)
  } else {
    console.error(`❌ 找不到 <script setup> 标签`)
    process.exit(1)
  }

  // 2. 添加 script 代码
  const scriptEndMatch = newContent.match(/<\/script>/)
  if (scriptEndMatch) {
    const insertPos = scriptEndMatch.index
    newContent =
      newContent.slice(0, insertPos) +
      template.script + '\n' +
      newContent.slice(insertPos)
  }

  // 3. 添加 style（如果需要）
  if (template.style) {
    const styleMatch = newContent.match(/<style[^>]*>/)
    if (styleMatch) {
      const insertPos = styleMatch.index + styleMatch[0].length
      newContent =
        newContent.slice(0, insertPos) +
        '\n' + template.style +
        newContent.slice(insertPos)
    } else {
      // 没有 style 标签，添加一个
      newContent += `\n<style scoped>${template.style}\n</style>\n`
    }
  }

  // 4. 写回文件
  fs.writeFileSync(filePath, newContent, 'utf-8')

  console.log(`✅ 成功添加模板选择器支持`)
  console.log(`   文件: ${filePath}`)
  console.log(`   位置: ${template.description} (${position})`)
  console.log(`\n⚠️  注意: 你需要手动将模板代码插入到合适的位置！`)
  console.log(`\n建议的模板代码:\n${template.template}`)
}

// 主程序
const args = process.argv.slice(2)
if (args.length === 0) {
  console.log(`
模板选择器自动添加工具

使用方法:
  node scripts/add-template-selector.js <template-file-path> [position]

示例:
  node scripts/add-template-selector.js src/templates/dashboard/desktop/default/index.vue header-right

支持的位置:`)

  Object.keys(POSITION_TEMPLATES).forEach(key => {
    console.log(`  - ${key}: ${POSITION_TEMPLATES[key].description}`)
  })

  process.exit(0)
}

const filePath = args[0]
const position = args[1] || 'header-right'

addTemplateSelectorSupport(filePath, position)

