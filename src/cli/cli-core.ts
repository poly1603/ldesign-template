/**
 * CLI 核心
 */

export interface CLICommand {
  name: string
  description: string
  options?: CLIOption[]
  action: (args: any, options: any) => void | Promise<void>
}

export interface CLIOption {
  name: string
  alias?: string
  description: string
  required?: boolean
  default?: any
}

export interface CLIOptions {
  name?: string
  version?: string
  description?: string
}

/**
 * CLI 实例
 */
export class CLI {
  private commands = new Map<string, CLICommand>()
  private options: Required<CLIOptions>

  constructor(options: CLIOptions = {}) {
    this.options = {
      name: options.name || 'ldesign-template',
      version: options.version || '0.2.0',
      description: options.description || 'LDesign Template CLI',
    }

    // 注册内置命令
    this.registerBuiltInCommands()
  }

  /**
   * 注册命令
   */
  register(command: CLICommand): void {
    this.commands.set(command.name, command)
  }

  /**
   * 执行命令
   */
  async execute(commandName: string, args: any = {}, options: any = {}): Promise<void> {
    const command = this.commands.get(commandName)

    if (!command) {
      console.error(`Unknown command: ${commandName}`)
      this.showHelp()
      return
    }

    try {
      await command.action(args, options)
    } catch (error) {
      console.error(`Command failed:`, error)
      process.exit(1)
    }
  }

  /**
   * 显示帮助
   */
  showHelp(): void {
    console.log(`\n${this.options.name} v${this.options.version}`)
    console.log(this.options.description)
    console.log('\nCommands:\n')

    this.commands.forEach(command => {
      console.log(`  ${command.name.padEnd(20)} ${command.description}`)
    })

    console.log('\nRun "ldesign-template <command> --help" for command details\n')
  }

  /**
   * 注册内置命令
   */
  private registerBuiltInCommands(): void {
    // init 命令
    this.register({
      name: 'init',
      description: '初始化模板项目',
      options: [
        { name: 'name', description: '项目名称', required: true },
        { name: 'template', description: '模板类型', default: 'basic' },
      ],
      action: async (args, options) => {
        console.log(`Initializing project: ${args.name}`)
        // 实现初始化逻辑
      },
    })

    // create 命令
    this.register({
      name: 'create',
      description: '创建新模板',
      options: [
        { name: 'category', description: '模板分类', required: true },
        { name: 'device', description: '设备类型', required: true },
        { name: 'name', description: '模板名称', required: true },
      ],
      action: async (args) => {
        console.log(`Creating template: ${args.category}/${args.device}/${args.name}`)
        // 实现创建逻辑
      },
    })

    // analyze 命令
    this.register({
      name: 'analyze',
      description: '分析模板性能',
      action: async () => {
        console.log('Analyzing templates...')
        // 实现分析逻辑
      },
    })

    // build 命令
    this.register({
      name: 'build',
      description: '构建模板',
      options: [
        { name: 'output', alias: 'o', description: '输出目录', default: 'dist' },
        { name: 'minify', description: '是否压缩', default: true },
      ],
      action: async (args, options) => {
        console.log(`Building templates to ${options.output}`)
        // 实现构建逻辑
      },
    })
  }
}

/**
 * 创建 CLI 实例
 */
export function createCLI(options?: CLIOptions): CLI {
  return new CLI(options)
}


