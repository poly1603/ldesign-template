<template>
  <div 
    class="login-template-modern"
    :class="{ 
      'glass-morphism': enableGlassMorphism,
      'animations-enabled': enableAnimations 
    }"
    :style="{ background: backgroundColor }"
  >
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="login-container">
      <!-- 头部插槽 -->
      <header class="login-header">
        <slot name="header">
          <div class="logo-section">
            <img v-if="logo" :src="logo" alt="Logo" class="logo" />
            <div class="title-section">
              <h1 class="title">{{ title }}</h1>
              <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
            </div>
          </div>
        </slot>
      </header>

      <!-- 登录卡片 -->
      <main class="login-main">
        <div class="login-card">
          <form @submit.prevent="handleSubmit" class="login-form">
            <!-- 用户名输入 -->
            <div class="form-group">
              <label for="username" class="form-label">
                <i class="fas fa-user"></i>
                用户名
              </label>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                placeholder="请输入用户名或邮箱"
                class="form-input"
                :class="{ 'has-error': errors.username }"
                @focus="handleInputFocus('username')"
                @blur="handleInputBlur('username', formData.username)"
                required
              />
              <span v-if="errors.username" class="error-message">
                {{ errors.username }}
              </span>
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">
                <i class="fas fa-lock"></i>
                密码
              </label>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  class="form-input"
                  :class="{ 'has-error': errors.password }"
                  @focus="handleInputFocus('password')"
                  @blur="handleInputBlur('password', formData.password)"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <span v-if="errors.password" class="error-message">
                {{ errors.password }}
              </span>
            </div>

            <!-- 表单额外字段插槽 -->
            <slot name="form-extra"></slot>

            <!-- 表单选项 -->
            <div class="form-options">
              <label v-if="showRememberMe" class="checkbox-label">
                <input 
                  v-model="formData.rememberMe" 
                  type="checkbox" 
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
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

            <!-- 登录按钮 -->
            <button 
              type="submit" 
              class="login-button" 
              :disabled="isLoading || !isFormValid"
              :class="{ 'loading': isLoading }"
            >
              <span v-if="!isLoading">登录</span>
              <span v-else class="loading-content">
                <i class="fas fa-spinner fa-spin"></i>
                登录中...
              </span>
            </button>
          </form>

          <!-- 社交登录 -->
          <div v-if="socialLogins.length > 0" class="social-login">
            <div class="divider">
              <span>或使用以下方式登录</span>
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

          <!-- 注册链接 -->
          <div v-if="showRegisterLink" class="register-section">
            <p>还没有账户？ 
              <a href="#" @click.prevent="$emit('register')" class="register-link">
                立即注册
              </a>
            </p>
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
          <p>&copy; 2024 LDesign. All rights reserved.</p>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// 定义属性
interface Props {
  title?: string
  subtitle?: string
  logo?: string
  backgroundColor?: string
  showRememberMe?: boolean
  showForgotPassword?: boolean
  showRegisterLink?: boolean
  socialLogins?: Array<{
    name: string
    label: string
    icon: string
  }>
  enableGlassMorphism?: boolean
  enableAnimations?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '欢迎回来',
  subtitle: '请登录您的账户',
  logo: '',
  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  showRememberMe: true,
  showForgotPassword: true,
  showRegisterLink: true,
  socialLogins: () => [
    { name: 'google', label: 'Google', icon: 'fab fa-google' },
    { name: 'github', label: 'GitHub', icon: 'fab fa-github' }
  ],
  enableGlassMorphism: true,
  enableAnimations: true
})

// 定义事件
const emit = defineEmits<{
  login: [data: { username: string; password: string; rememberMe: boolean }]
  register: []
  forgotPassword: []
  socialLogin: [data: { provider: string; data: any }]
  inputFocus: [data: { field: string }]
  inputBlur: [data: { field: string; value: string }]
}>()

// 响应式数据
const isLoading = ref(false)
const showPassword = ref(false)
const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  username: '',
  password: ''
})

// 计算属性
const isFormValid = computed(() => {
  return formData.username.trim() !== '' && 
         formData.password.trim() !== '' && 
         !errors.username && 
         !errors.password
})

// 方法
const validateForm = () => {
  errors.username = ''
  errors.password = ''

  if (!formData.username.trim()) {
    errors.username = '请输入用户名'
    return false
  }

  if (!formData.password.trim()) {
    errors.password = '请输入密码'
    return false
  }

  if (formData.password.length < 6) {
    errors.password = '密码长度至少6位'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
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
    setTimeout(() => {
      isLoading.value = false
    }, 1000) // 模拟网络延迟
  }
}

const handleSocialLogin = (provider: any) => {
  emit('socialLogin', {
    provider: provider.name,
    data: provider
  })
}

const handleInputFocus = (field: string) => {
  emit('inputFocus', { field })
}

const handleInputBlur = (field: string, value: string) => {
  emit('inputBlur', { field, value })
}
</script>

<style lang="less" scoped>
@import './LoginTemplate.less';
</style>
