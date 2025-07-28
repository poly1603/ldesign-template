# 模板开发指南

## 模板结构

每个模板都遵循统一的目录结构：

```
templates/
├── login/                    # 模板分类
│   ├── desktop/             # 设备类型
│   │   ├── default/         # 模板名称
│   │   │   ├── index.ts     # 模板配置
│   │   │   ├── LoginTemplate.vue  # Vue 组件
│   │   │   └── LoginTemplate.less # 样式文件
│   │   └── modern/          # 另一个模板
│   │       ├── index.ts
│   │       ├── LoginTemplate.vue
│   │       └── LoginTemplate.less
│   ├── mobile/              # 移动端模板
│   └── tablet/              # 平板端模板
└── register/                # 其他分类
```

## 创建模板配置

模板配置文件 `index.ts` 定义了模板的元数据：

```typescript
// templates/login/desktop/modern/index.ts
import type { TemplateConfig } from '@ldesign/template'

export const config: TemplateConfig = {
  // 基本信息
  id: 'login-desktop-modern',
  name: '现代登录模板',
  description: '采用现代化设计语言的桌面端登录模板',
  version: '1.0.0',
  author: 'Your Name',
  
  // 分类信息
  category: 'login',
  device: 'desktop',
  templateName: 'modern',
  
  // 预览图
  preview: '/previews/login-desktop-modern.png',
  
  // 标签
  tags: ['登录', '现代', '渐变', '响应式'],
  
  // 属性定义
  props: {
    title: {
      type: 'string',
      default: '用户登录',
      description: '登录页面标题'
    },
    logo: {
      type: 'string',
      default: '',
      description: '网站Logo URL'
    },
    backgroundColor: {
      type: 'string',
      default: '#f5f5f5',
      description: '背景颜色'
    },
    showRememberMe: {
      type: 'boolean',
      default: true,
      description: '是否显示记住我选项'
    },
    showForgotPassword: {
      type: 'boolean',
      default: true,
      description: '是否显示忘记密码链接'
    },
    socialLogins: {
      type: 'array',
      default: [],
      description: '社交登录选项'
    }
  },
  
  // 插槽定义
  slots: {
    header: {
      description: '页面头部插槽，可以放置Logo或标题'
    },
    footer: {
      description: '页面底部插槽，可以放置版权信息'
    },
    extra: {
      description: '额外内容插槽，可以放置广告或公告'
    },
    'social-login': {
      description: '社交登录插槽'
    }
  },
  
  // 事件定义
  events: {
    login: {
      description: '用户点击登录按钮时触发',
      params: {
        username: 'string',
        password: 'string',
        rememberMe: 'boolean'
      }
    },
    register: {
      description: '用户点击注册链接时触发'
    },
    forgotPassword: {
      description: '用户点击忘记密码时触发'
    },
    socialLogin: {
      description: '社交登录时触发',
      params: {
        provider: 'string',
        data: 'object'
      }
    }
  }
}

export default config
```

## 创建 Vue 组件

模板的 Vue 组件实现具体的界面和交互逻辑：

```vue
<!-- templates/login/desktop/modern/LoginTemplate.vue -->
<template>
  <div class="login-template-modern">
    <!-- 头部插槽 -->
    <header class="login-header">
      <slot name="header">
        <img v-if="logo" :src="logo" alt="Logo" class="logo" />
        <h1 class="title">{{ title }}</h1>
      </slot>
    </header>

    <!-- 主要内容 -->
    <main class="login-main">
      <div class="login-card">
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="请输入密码"
              required
            />
          </div>

          <div v-if="showRememberMe" class="form-options">
            <label class="checkbox-label">
              <input v-model="formData.rememberMe" type="checkbox" />
              记住我
            </label>
            
            <a
              v-if="showForgotPassword"
              href="#"
              @click.prevent="$emit('forgotPassword')"
              class="forgot-link"
            >
              忘记密码？
            </a>
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 社交登录 -->
        <div v-if="socialLogins.length > 0" class="social-login">
          <div class="divider">
            <span>或</span>
          </div>
          
          <slot name="social-login">
            <div class="social-buttons">
              <button
                v-for="provider in socialLogins"
                :key="provider.name"
                @click="handleSocialLogin(provider)"
                class="social-button"
                :class="`social-${provider.name}`"
              >
                <i :class="provider.icon"></i>
                {{ provider.label }}
              </button>
            </div>
          </slot>
        </div>

        <!-- 额外内容插槽 -->
        <div class="extra-content">
          <slot name="extra"></slot>
        </div>
      </div>
    </main>

    <!-- 底部插槽 -->
    <footer class="login-footer">
      <slot name="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 定义属性
interface Props {
  title?: string
  logo?: string
  backgroundColor?: string
  showRememberMe?: boolean
  showForgotPassword?: boolean
  socialLogins?: Array<{
    name: string
    label: string
    icon: string
  }>
}

const props = withDefaults(defineProps<Props>(), {
  title: '用户登录',
  logo: '',
  backgroundColor: '#f5f5f5',
  showRememberMe: true,
  showForgotPassword: true,
  socialLogins: () => []
})

// 定义事件
const emit = defineEmits<{
  login: [data: { username: string; password: string; rememberMe: boolean }]
  register: []
  forgotPassword: []
  socialLogin: [data: { provider: string; data: any }]
}>()

// 响应式数据
const isLoading = ref(false)
const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 处理表单提交
const handleSubmit = async () => {
  if (!formData.username || !formData.password) {
    return
  }

  isLoading.value = true
  
  try {
    emit('login', {
      username: formData.username,
      password: formData.password,
      rememberMe: formData.rememberMe
    })
  } finally {
    isLoading.value = false
  }
}

// 处理社交登录
const handleSocialLogin = (provider: any) => {
  emit('socialLogin', {
    provider: provider.name,
    data: provider
  })
}
</script>

<style lang="less" scoped>
@import './LoginTemplate.less';
</style>
```

## 样式文件

创建对应的样式文件：

```less
// templates/login/desktop/modern/LoginTemplate.less
.login-template-modern {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  .login-header {
    padding: 2rem;
    text-align: center;
    color: white;

    .logo {
      max-height: 60px;
      margin-bottom: 1rem;
    }

    .title {
      margin: 0;
      font-size: 2rem;
      font-weight: 300;
    }
  }

  .login-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 3rem;
      width: 100%;
      max-width: 400px;

      .login-form {
        .form-group {
          margin-bottom: 1.5rem;

          label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #333;
          }

          input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;

            &:focus {
              outline: none;
              border-color: #667eea;
            }
          }
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;

          .checkbox-label {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            color: #666;

            input {
              margin-right: 0.5rem;
              width: auto;
            }
          }

          .forgot-link {
            color: #667eea;
            text-decoration: none;
            font-size: 0.9rem;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .login-button {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s ease;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
          }

          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        }
      }

      .social-login {
        margin-top: 2rem;

        .divider {
          text-align: center;
          margin: 1.5rem 0;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e1e5e9;
          }

          span {
            background: white;
            padding: 0 1rem;
            color: #666;
            font-size: 0.9rem;
          }
        }

        .social-buttons {
          display: flex;
          gap: 0.5rem;

          .social-button {
            flex: 1;
            padding: 0.75rem;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              border-color: #667eea;
              color: #667eea;
            }

            i {
              margin-right: 0.5rem;
            }
          }
        }
      }

      .extra-content {
        margin-top: 1.5rem;
      }
    }
  }

  .login-footer {
    padding: 1rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-template-modern {
    .login-main {
      padding: 1rem;

      .login-card {
        padding: 2rem;
      }
    }
  }
}
```

## 注册模板

最后，在模板入口文件中注册新模板：

```typescript
// templates/index.ts
export * from './login/desktop/default'
export * from './login/desktop/modern'  // 新增
// ... 其他模板
```

## 最佳实践

1. **响应式设计**: 确保模板在不同屏幕尺寸下都能正常显示
2. **无障碍访问**: 添加适当的 ARIA 标签和键盘导航支持
3. **性能优化**: 使用懒加载和代码分割优化加载性能
4. **类型安全**: 为所有属性和事件提供完整的 TypeScript 类型定义
5. **测试覆盖**: 为模板编写单元测试和集成测试
6. **文档完善**: 为每个模板提供详细的使用文档和示例

## 下一步

- [设备适配指南](/guide/device-adaptation) - 学习如何适配不同设备
- [主题定制](/guide/theming) - 了解如何创建可定制的主题
- [测试指南](/guide/testing) - 学习如何测试模板
