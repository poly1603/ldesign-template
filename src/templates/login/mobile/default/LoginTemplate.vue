<template>
  <div 
    class="login-template-mobile-default"
    :style="{ 
      backgroundColor,
      '--primary-color': primaryColor 
    }"
  >
    <!-- 状态栏占位 -->
    <div class="status-bar-placeholder"></div>

    <!-- 头部 -->
    <header class="login-header">
      <slot name="header">
        <div class="header-content">
          <img v-if="logo" :src="logo" alt="Logo" class="logo" />
          <h1 class="title">{{ title }}</h1>
        </div>
      </slot>
    </header>

    <!-- 主要内容 -->
    <main class="login-main">
      <!-- 登录模式切换 -->
      <div class="login-mode-tabs">
        <button
          v-if="enableQuickLogin"
          class="mode-tab"
          :class="{ active: loginMode === 'sms' }"
          @click="switchLoginMode('sms')"
        >
          短信登录
        </button>
        <button
          class="mode-tab"
          :class="{ active: loginMode === 'password' }"
          @click="switchLoginMode('password')"
        >
          密码登录
        </button>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- 密码登录模式 -->
        <div v-if="loginMode === 'password'" class="form-content">
          <!-- 用户名输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <i class="fas fa-user input-icon"></i>
              <input
                v-model="formData.username"
                type="text"
                placeholder="手机号/邮箱/用户名"
                class="form-input"
                :class="{ 'has-error': errors.username }"
                required
              />
            </div>
            <span v-if="errors.username" class="error-message">
              {{ errors.username }}
            </span>
          </div>

          <!-- 密码输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <i class="fas fa-lock input-icon"></i>
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="form-input"
                :class="{ 'has-error': errors.password }"
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
        </div>

        <!-- 短信登录模式 -->
        <div v-else-if="loginMode === 'sms'" class="form-content">
          <!-- 手机号输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <i class="fas fa-mobile-alt input-icon"></i>
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="请输入手机号"
                class="form-input"
                :class="{ 'has-error': errors.phone }"
                required
              />
            </div>
            <span v-if="errors.phone" class="error-message">
              {{ errors.phone }}
            </span>
          </div>

          <!-- 验证码输入 -->
          <div class="form-group">
            <div class="input-wrapper sms-wrapper">
              <i class="fas fa-shield-alt input-icon"></i>
              <input
                v-model="formData.smsCode"
                type="text"
                placeholder="请输入验证码"
                class="form-input sms-input"
                :class="{ 'has-error': errors.smsCode }"
                maxlength="6"
                required
              />
              <button
                type="button"
                class="sms-button"
                :disabled="smsCountdown > 0 || !isValidPhone"
                @click="sendSmsCode"
              >
                {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码' }}
              </button>
            </div>
            <span v-if="errors.smsCode" class="error-message">
              {{ errors.smsCode }}
            </span>
          </div>
        </div>

        <!-- 记住我选项（仅密码模式显示） -->
        <div v-if="showRememberMe && loginMode === 'password'" class="form-options">
          <label class="checkbox-label">
            <input 
              v-model="formData.rememberMe" 
              type="checkbox" 
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            记住我
          </label>
        </div>

        <!-- 登录按钮 -->
        <button 
          type="submit" 
          class="login-button" 
          :disabled="isLoading || !isFormValid"
        >
          <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 生物识别登录 -->
      <div v-if="enableBiometric && supportsBiometric" class="biometric-login">
        <button @click="handleBiometricLogin" class="biometric-button">
          <i class="fas fa-fingerprint"></i>
          <span>指纹/面容登录</span>
        </button>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions">
        <slot name="quick-actions">
          <a
            v-if="showForgotPassword"
            href="#"
            @click.prevent="$emit('forgotPassword')"
            class="quick-link"
          >
            忘记密码？
          </a>
        </slot>
      </div>

      <!-- 社交登录 -->
      <div v-if="socialLogins.length > 0" class="social-login">
        <div class="divider">
          <span>其他登录方式</span>
        </div>
        
        <div class="social-buttons">
          <button
            v-for="provider in socialLogins"
            :key="provider.name"
            @click="handleSocialLogin(provider)"
            class="social-button"
            :style="{ '--social-color': provider.color }"
          >
            <i :class="provider.icon"></i>
            <span>{{ provider.label }}</span>
          </button>
        </div>
      </div>

      <!-- 注册链接 -->
      <div v-if="showRegisterLink" class="register-section">
        <p>还没有账户？ 
          <a href="#" @click.prevent="$emit('register')" class="register-link">
            立即注册
          </a>
        </p>
      </div>

      <!-- 额外内容 -->
      <div class="extra-content">
        <slot name="extra"></slot>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="login-footer">
      <slot name="footer">
        <p>&copy; 2024 LDesign. All rights reserved.</p>
      </slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

// 定义属性
interface Props {
  title?: string
  logo?: string
  backgroundColor?: string
  primaryColor?: string
  showRememberMe?: boolean
  showForgotPassword?: boolean
  showRegisterLink?: boolean
  enableBiometric?: boolean
  enableQuickLogin?: boolean
  socialLogins?: Array<{
    name: string
    label: string
    icon: string
    color: string
  }>
}

const props = withDefaults(defineProps<Props>(), {
  title: '登录',
  logo: '',
  backgroundColor: '#f8fafc',
  primaryColor: '#3b82f6',
  showRememberMe: false,
  showForgotPassword: true,
  showRegisterLink: true,
  enableBiometric: true,
  enableQuickLogin: true,
  socialLogins: () => [
    { name: 'wechat', label: '微信登录', icon: 'fab fa-weixin', color: '#07c160' },
    { name: 'qq', label: 'QQ登录', icon: 'fab fa-qq', color: '#12b7f5' }
  ]
})

// 定义事件
const emit = defineEmits<{
  login: [data: { username: string; password: string; rememberMe: boolean }]
  quickLogin: [data: { phone: string; code: string }]
  biometricLogin: []
  register: []
  forgotPassword: []
  socialLogin: [data: { provider: string; data: any }]
  switchLoginMode: [data: { mode: string }]
}>()

// 响应式数据
const isLoading = ref(false)
const showPassword = ref(false)
const loginMode = ref(props.enableQuickLogin ? 'sms' : 'password')
const smsCountdown = ref(0)
const supportsBiometric = ref(false)

const formData = reactive({
  username: '',
  password: '',
  phone: '',
  smsCode: '',
  rememberMe: false
})

const errors = reactive({
  username: '',
  password: '',
  phone: '',
  smsCode: ''
})

// 计算属性
const isValidPhone = computed(() => {
  return /^1[3-9]\d{9}$/.test(formData.phone)
})

const isFormValid = computed(() => {
  if (loginMode.value === 'password') {
    return formData.username.trim() !== '' && formData.password.trim() !== ''
  } else if (loginMode.value === 'sms') {
    return isValidPhone.value && formData.smsCode.trim() !== ''
  }
  return false
})

// 方法
const switchLoginMode = (mode: string) => {
  loginMode.value = mode
  clearErrors()
  emit('switchLoginMode', { mode })
}

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const validateForm = () => {
  clearErrors()

  if (loginMode.value === 'password') {
    if (!formData.username.trim()) {
      errors.username = '请输入用户名'
      return false
    }
    if (!formData.password.trim()) {
      errors.password = '请输入密码'
      return false
    }
  } else if (loginMode.value === 'sms') {
    if (!isValidPhone.value) {
      errors.phone = '请输入正确的手机号'
      return false
    }
    if (!formData.smsCode.trim()) {
      errors.smsCode = '请输入验证码'
      return false
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  
  try {
    if (loginMode.value === 'password') {
      emit('login', {
        username: formData.username,
        password: formData.password,
        rememberMe: formData.rememberMe
      })
    } else if (loginMode.value === 'sms') {
      emit('quickLogin', {
        phone: formData.phone,
        code: formData.smsCode
      })
    }
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  }
}

const sendSmsCode = () => {
  if (!isValidPhone.value) {
    errors.phone = '请输入正确的手机号'
    return
  }

  // 开始倒计时
  smsCountdown.value = 60
  const timer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  // 这里应该调用发送短信的API
  console.log('发送验证码到:', formData.phone)
}

const handleBiometricLogin = () => {
  emit('biometricLogin')
}

const handleSocialLogin = (provider: any) => {
  emit('socialLogin', {
    provider: provider.name,
    data: provider
  })
}

// 生命周期
onMounted(() => {
  // 检测是否支持生物识别
  if ('navigator' in window && 'credentials' in navigator) {
    supportsBiometric.value = true
  }
})
</script>

<style lang="less" scoped>
@import './LoginTemplate.less';
</style>
