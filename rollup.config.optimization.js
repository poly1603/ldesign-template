/**
 * Rollup 打包优化配置
 *
 * @description
 * 针对生产环境的高级优化配置
 */

import path from 'node:path'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'rollup'
import analyze from 'rollup-plugin-analyzer'
import esbuild from 'rollup-plugin-esbuild'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'

/**
 * 外部依赖（不打包）
 */
const external = [
  'vue',
  '@vue/runtime-core',
  '@vue/runtime-dom',
  '@vue/reactivity',
  '@vue/shared',
  '@vueuse/core',
  'lucide-vue-next',
  // ldesign 内部包
  /^@ldesign\//,
]

/**
 * 全局变量映射（UMD）
 */
const globals = {
  'vue': 'Vue',
  '@vueuse/core': 'VueUse',
  'lucide-vue-next': 'LucideVue',
}

/**
 * 代码分割配置
 */
const manualChunks = {
  // 核心运行时
  'runtime-core': [
    'src/core/manager.ts',
    'src/core/loader.ts',
    'src/core/scanner.ts',
    'src/core/smart-cache.ts',
    'src/core/memory-aware-cache.ts',
  ],
  // 组件
  'components': [
    'src/components/TemplateRenderer.vue',
    'src/components/TemplateSelector.vue',
    'src/components/VirtualScroll.vue',
  ],
  // 工具函数
  'utils': [
    'src/utils/performance.ts',
    'src/utils/helpers.ts',
    'src/utils/logger.ts',
    'src/utils/requestScheduler.ts',
  ],
  // 高级功能（懒加载）
  'advanced': [
    'src/utils/templateSearch.ts',
    'src/utils/performanceAnalyzer.ts',
    'src/utils/dependencyAnalyzer.ts',
    'src/utils/memoryOptimizer.ts',
  ],
  // SSR相关（可选加载）
  'ssr': [
    'src/ssr/render.ts',
    'src/ssr/hydrate.ts',
    'src/ssr/context.ts',
  ],
  // DevTools（开发环境）
  'devtools': [
    'src/devtools/panel.ts',
    'src/devtools/inspector.ts',
    'src/devtools/performance-profiler.ts',
    'src/devtools/template-debugger.ts',
  ],
}

/**
 * Terser 优化配置
 */
const terserOptions = {
  compress: {
    // 移除 console
    drop_console: true,
    drop_debugger: true,
    // 移除未使用的代码
    dead_code: true,
    unused: true,
    // 优化条件表达式
    conditionals: true,
    evaluate: true,
    // 优化布尔值
    booleans: true,
    // 优化循环
    loops: true,
    // 内联函数
    inline: 2,
    // 提升常量
    hoist_funs: true,
    hoist_vars: true,
    // 其他优化
    if_return: true,
    join_vars: true,
    reduce_vars: true,
    side_effects: true,
    warnings: false,
    // 不安全的优化（谨慎使用）
    unsafe: true,
    unsafe_math: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    // 传递优化
    passes: 3,
  },
  mangle: {
    // 短变量名
    toplevel: true,
    // 保留类名（调试用）
    keep_classnames: false,
    keep_fnames: false,
    // 保留的属性
    reserved: [],
    // Safari 10 兼容
    safari10: true,
  },
  format: {
    // 移除注释
    comments: false,
    // 紧凑输出
    compact: true,
    // ASCII 输出
    ascii_only: true,
  },
  // 源码映射
  sourceMap: false,
}

/**
 * ESBuild 配置
 */
const esbuildOptions = {
  target: 'es2018',
  // 移除空白
  minify: true,
  // 移除合法注释
  legalComments: 'none',
  // 纯函数标记（用于 tree-shaking）
  pure: [
    'console.log',
    'console.debug',
    'console.info',
    'console.warn',
    'debugger',
  ],
  // Tree-shaking
  treeShaking: true,
  // 定义全局常量
  define: {
    'process.env.NODE_ENV': '"production"',
    '__DEV__': 'false',
    '__BROWSER__': 'true',
    '__FEATURE_PROD_DEVTOOLS__': 'false',
  },
}

/**
 * 创建优化配置
 */
export function createOptimizedConfig(format = 'es') {
  const isESM = format === 'es'
  const isCJS = format === 'cjs'
  const isUMD = format === 'umd'

  return defineConfig({
    input: 'src/index.ts',

    output: {
      format,
      name: isUMD ? 'LDesignTemplate' : undefined,
      globals: isUMD ? globals : undefined,
      // 代码分割
      ...(isESM ? {
        dir: 'dist/es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        manualChunks: (id) => {
          // 基于路径的代码分割
          if (id.includes('node_modules')) {
            return 'vendor'
          }

          for (const [chunk, patterns] of Object.entries(manualChunks)) {
            if (patterns.some(pattern => id.includes(pattern))) {
              return chunk
            }
          }

          return null
        },
      } : {
        file: `dist/${format}/index.js`,
      }),
      // 优化
      compact: true,
      generatedCode: {
        arrowFunctions: true,
        constBindings: true,
        objectShorthand: true,
      },
      // 严格模式
      strict: false,
      // 系统模块格式
      systemNullSetters: false,
    },

    external,

    plugins: [
      // Vue 3 支持
      vue({
        isProduction: true,
        template: {
          compilerOptions: {
            // 优化模板编译
            hoistStatic: true,
            cacheHandlers: true,
            // 内联模板优化
            inline: true,
          },
        },
      }),

      // Vue JSX 支持
      vueJsx(),

      // 节点解析
      nodeResolve({
        preferBuiltins: true,
        browser: true,
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
        // 优先使用 ES 模块
        mainFields: ['module', 'jsnext:main', 'main'],
      }),

      // CommonJS 转换
      commonjs({
        // 优化 CommonJS 检测
        strictRequires: true,
        // 忽略动态 require
        ignoreDynamicRequires: true,
      }),

      // ESBuild 编译
      esbuild(esbuildOptions),

      // Terser 压缩（二次优化）
      terser(terserOptions),

      // Gzip/Brotli 压缩
      compression({
        algorithm: 'gzip',
        exclude: [/\.map$/],
        threshold: 10240, // 10KB
        deleteOriginalAssets: false,
      }),

      compression({
        algorithm: 'brotliCompress',
        exclude: [/\.map$/],
        threshold: 10240,
        deleteOriginalAssets: false,
      }),

      // 包分析（开发时使用）
      process.env.ANALYZE && analyze({
        summaryOnly: true,
        limit: 20,
      }),

      // 可视化分析（开发时使用）
      process.env.VISUALIZE && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'sunburst',
      }),
    ],

    // 性能优化
    treeshake: {
      // 模块副作用
      moduleSideEffects: false,
      // 属性访问副作用
      propertyReadSideEffects: false,
      // 未知全局副作用
      unknownGlobalSideEffects: false,
      // 正确性优化
      correctVarValueBeforeDeclaration: true,
      // 注释控制
      annotations: true,
      preset: 'recommended',
    },

    // 实验性优化
    experimentalCacheExpiry: 10,
    perf: true,

    // 构建优化
    cache: true,

    // 警告处理
    onwarn(warning, warn) {
      // 忽略某些警告
      if (warning.code === 'UNUSED_EXTERNAL_IMPORT')
        return
      if (warning.code === 'CIRCULAR_DEPENDENCY')
        return
      warn(warning)
    },
  })
}

/**
 * 导出配置数组
 */
export default [
  // ES 模块（支持 tree-shaking）
  createOptimizedConfig('es'),

  // CommonJS（Node.js）
  createOptimizedConfig('cjs'),

  // UMD（浏览器直接使用）
  createOptimizedConfig('umd'),
]
