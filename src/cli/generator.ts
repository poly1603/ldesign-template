/**
 * 模板生成器
 * 生成模板脚手架代码
 */

export interface GenerateOptions {
  category: string
  device: string
  name: string
  typescript?: boolean
  style?: 'css' | 'less' | 'scss'
  outputDir?: string
}

export interface TemplateFile {
  path: string
  content: string
}

/**
 * 模板生成器
 */
export class TemplateGenerator {
  /**
   * 生成模板
   */
  async generate(options: GenerateOptions): Promise<TemplateFile[]> {
    const files: TemplateFile[] = []

    // 生成配置文件
    files.push({
      path: `${options.outputDir || 'src/templates'}/${options.category}/${options.device}/${options.name}/config.ts`,
      content: this.generateConfig(options),
    })

    // 生成组件文件
    files.push({
      path: `${options.outputDir || 'src/templates'}/${options.category}/${options.device}/${options.name}/index.vue`,
      content: this.generateComponent(options),
    })

    // 生成样式文件
    if (options.style !== 'css') {
      files.push({
        path: `${options.outputDir || 'src/templates'}/${options.category}/${options.device}/${options.name}/index.${options.style || 'less'}`,
        content: this.generateStyle(options),
      })
    }

    return files
  }

  /**
   * 生成配置文件
   */
  private generateConfig(options: GenerateOptions): string {
    return `/**
 * ${options.category} 模板配置 - ${options.device} / ${options.name}
 */
import type { TemplateConfig } from '@ldesign/template'

export default {
  name: '${options.name}',
  displayName: '${this.toDisplayName(options.name)}',
  description: '${options.category} 模板 - ${options.device} 版本',
  version: '1.0.0',
  author: 'Your Name',
  tags: ['${options.category}', '${options.device}'],
  isDefault: ${options.name === 'default'},
  responsive: true,
  minWidth: ${options.device === 'desktop' ? 1024 : options.device === 'tablet' ? 768 : 0},
} as TemplateConfig
`
  }

  /**
   * 生成组件文件
   */
  private generateComponent(options: GenerateOptions): string {
    const scriptLang = options.typescript ? ' lang="ts"' : ''

    return `<template>
  <div class="${options.category}-${options.device}-${options.name}">
    <div v-if="title" class="template-header">
      <h2>{{ title }}</h2>
    </div>
    
    <div class="template-content">
      <slot />
    </div>
  </div>
</template>

<script setup${scriptLang}>
interface Props {
  title?: string
}

${options.typescript ? `const props = ` : ''}defineProps<Props>()

const emit = defineEmits<{
  action: [type: string, data: any]
}>()
</script>

<style scoped>
.${options.category}-${options.device}-${options.name} {
  width: 100%;
  padding: 24px;
}

.template-header {
  margin-bottom: 24px;
}

.template-content {
  /* Your styles here */
}
</style>
`
  }

  /**
   * 生成样式文件
   */
  private generateStyle(options: GenerateOptions): string {
    return `.${options.category}-${options.device}-${options.name} {
  width: 100%;
  padding: 24px;
  
  .template-header {
    margin-bottom: 24px;
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
    }
  }
  
  .template-content {
    // Your styles here
  }
}
`
  }

  /**
   * 转换为显示名称
   */
  private toDisplayName(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}

/**
 * 创建生成器
 */
export function createGenerator(): TemplateGenerator {
  return new TemplateGenerator()
}


