import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@ldesign/template',
  description: '强大的 Vue3 模板管理系统 - 让你的应用界面千变万化',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#667eea' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh-CN' }],
    ['meta', { property: 'og:title', content: '@ldesign/template | Vue3 模板管理系统' }],
    ['meta', { property: 'og:site_name', content: '@ldesign/template' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://ldesign-template.docs.com/' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/template-manager' },
      { text: '示例', link: '/examples/basic' },
      { text: '演示', link: '/demo', target: '_blank' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '核心概念', link: '/guide/concepts' },
            { text: '安装配置', link: '/guide/installation' },
          ],
        },
        {
          text: '核心功能',
          items: [
            { text: '模板管理', link: '/guide/template-management' },
            { text: '设备检测', link: '/guide/device-detection' },
            { text: '缓存系统', link: '/guide/caching' },
            { text: '事件系统', link: '/guide/events' },
          ],
        },
        {
          text: '高级特性',
          items: [
            { text: '模板开发', link: '/guide/template-development' },
            { text: '主题定制', link: '/guide/theming' },
            { text: '性能优化', link: '/guide/performance' },
            { text: '错误处理', link: '/guide/error-handling' },
          ],
        },
        {
          text: '测试与部署',
          items: [
            { text: '测试指南', link: '/guide/testing' },
            { text: '部署指南', link: '/guide/deployment' },
            { text: '故障排除', link: '/guide/troubleshooting' },
          ],
        },
      ],
      '/api/': [
        {
          text: '核心 API',
          items: [
            { text: '模板管理器', link: '/api/template-manager' },
            { text: '组合式函数', link: '/api/composables' },
            { text: '组件', link: '/api/components' },
          ],
        },
        {
          text: '工具函数',
          items: [
            { text: '设备检测', link: '/api/device-detector' },
            { text: '缓存管理', link: '/api/cache' },
            { text: '存储工具', link: '/api/storage' },
          ],
        },
        {
          text: '类型定义',
          items: [
            { text: '模板配置', link: '/api/template-config' },
            { text: '管理器配置', link: '/api/manager-config' },
            { text: '类型定义', link: '/api/types' },
          ],
        },
      ],
      '/examples/': [
        {
          text: '基础示例',
          items: [
            { text: '基础用法', link: '/examples/basic' },
            { text: '模板切换', link: '/examples/template-switching' },
            { text: '设备适配', link: '/examples/device-adaptation' },
          ],
        },
        {
          text: '高级示例',
          items: [
            { text: '自定义模板', link: '/examples/custom-template' },
            { text: '主题定制', link: '/examples/theming' },
            { text: '性能监控', link: '/examples/performance-monitoring' },
          ],
        },
        {
          text: '集成示例',
          items: [
            { text: 'Vue 3 集成', link: '/examples/vue3-integration' },
            { text: 'React 集成', link: '/examples/react-integration' },
            { text: 'Angular 集成', link: '/examples/angular-integration' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ldesign/template' },
      { icon: 'discord', link: 'https://discord.gg/ldesign' },
      { icon: 'twitter', link: 'https://twitter.com/ldesign_team' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 LDesign Team',
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    editLink: {
      pattern: 'https://github.com/ldesign/template/edit/main/packages/template/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  },

  vite: {
    resolve: {
      alias: {
        '@ldesign/template': '../src'
      }
    }
  }
})
