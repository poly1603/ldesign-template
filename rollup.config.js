import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { readFileSync } from 'node:fs'
import dts from 'rollup-plugin-dts'
import vue from 'rollup-plugin-vue'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  'vue',
  '@vue/reactivity',
  '@vue/runtime-core',
  '@vue/compiler-sfc',
]

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} LDesign Team
 * @license MIT
 */`

// 单入口构建配置

export default [
  // ESM build - 单入口
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
      banner,
      sourcemap: true,
      inlineDynamicImports: true,
    },
    external,
    plugins: [
      nodeResolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      json(),
      vue({
        target: 'browser',
        css: false,
        compileTemplate: true
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        outDir: 'es'
      }),
    ],
  },

  // CommonJS build - 单入口
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      banner,
      sourcemap: true,
      exports: 'named',
      inlineDynamicImports: true,
    },
    external,
    plugins: [
      nodeResolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      json(),
      vue({
        target: 'browser',
        css: false,
        compileTemplate: true
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      }),
    ],
  },

  // 暂时移除UMD构建以避免代码分割问题

  // Type definitions - 单入口
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    external,
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
      }),
    ],
  },
]
