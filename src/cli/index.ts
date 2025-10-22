/**
 * CLI 工具入口
 * 提供命令行工具用于模板管理、性能分析和代码生成
 */

export * from './commands'
export * from './generator'
export * from './analyzer'
export { createCLI, type CLIOptions } from './cli-core'


