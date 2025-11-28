/**
 * @ldesign/template-core 打包配置
 *
 * 框架无关的模板核心库
 * 使用 TDesign 风格的构建配置
 * 生成 es/、lib/、dist/ 三种产物
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  // 输入配置 - 使用主入口文件
  input: 'src/index.ts',

  // 输出配置 - TDesign 风格
  output: {
    // ES 模块 - 使用 .mjs
    es: {
      dir: 'es',
      sourcemap: true,
    },

    // CJS 模块
    cjs: {
      dir: 'lib',
      sourcemap: true,
    },

    // UMD 模块
    umd: {
      dir: 'dist',
      name: 'LDesignTemplateCore',
      globals: {},
    },
  },

  // 外部依赖（无框架依赖）
  external: [],

  // 库类型
  libraryType: 'typescript',

  // 打包器
  bundler: 'rollup',

  // 类型声明
  dts: {
    enabled: true,
  },
})

