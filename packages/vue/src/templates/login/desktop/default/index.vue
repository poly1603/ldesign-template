<script setup lang="ts">
/**
 * 桌面端登录模板 - 经典双栏风格
 */
import { ref, onMounted, computed } from 'vue'

interface LoginData {
  loginType: 'username' | 'phone'
  username?: string
  phone?: string
  password?: string
  smsCode?: string
  captcha: string
}

interface Props {
  title?: string
  subtitle?: string
  logo?: string
  brandTitle?: string
  brandSlogan?: string
  onSubmit?: (data: LoginData) => void
  onForgotPassword?: () => void
  onRegister?: () => void
  onSocialLogin?: (provider: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '登录',
  subtitle: '请登录您的账户以继续',
  brandTitle: 'LDesign',
  brandSlogan: '构建优雅的企业级设计系统',
})

const loginType = ref<'username' | 'phone'>('username')
const tabStyle = computed(() => ({
  transform: `translateX(${loginType.value === 'username' ? '0' : '100%'})`,
}))

const username = ref('')
const phone = ref('')
const password = ref('')
const smsCode = ref('')
const captcha = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const mounted = ref(false)

const captchaCode = ref('')
const smsCountdown = ref(0)
let smsTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  setTimeout(() => mounted.value = true, 100)
  refreshCaptcha()
})

function refreshCaptcha() {
  captchaCode.value = Math.random().toString(36).substring(2, 6).toUpperCase()
}

function sendSmsCode() {
  if (smsCountdown.value > 0 || !phone.value) return
  smsCountdown.value = 60
  smsTimer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0 && smsTimer) {
      clearInterval(smsTimer)
      smsTimer = null
    }
  }, 1000)
}

async function handleSubmit() {
  const isUsername = loginType.value === 'username'
  if (isUsername && (!username.value || !password.value)) return
  if (!isUsername && (!phone.value || !smsCode.value)) return
  if (!captcha.value) return

  loading.value = true
  try {
    await props.onSubmit?.({
      loginType: loginType.value,
      username: isUsername ? username.value : undefined,
      phone: !isUsername ? phone.value : undefined,
      password: isUsername ? password.value : undefined,
      smsCode: !isUsername ? smsCode.value : undefined,
      captcha: captcha.value,
    })
  } finally {
    loading.value = false
  }
}

function handleSocialLogin(provider: string) {
  props.onSocialLogin?.(provider)
}
</script>

<template>
  <div class="login-split">
    <!-- 工具栏 -->
    <div class="login-toolbar">
      <slot name="toolbar" />
    </div>

    <!-- 左侧品牌区 -->
    <div class="login-brand">
      <!-- 动态粒子 -->
      <div class="brand-particles">
        <div v-for="i in 8" :key="i" class="particle"
          :style="{ '--delay': `${i * 0.6}s`, '--size': `${6 + Math.random() * 8}px` }" />
      </div>

      <!-- 品牌内容 -->
      <div class="brand-content" :class="{ 'is-mounted': mounted }">
        <div class="brand-logo">
          <img v-if="logo" :src="logo" alt="Logo" class="logo-image" />
          <div v-else class="logo-placeholder">
            <!-- Lucide: Sparkles -->
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path
                d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </svg>
          </div>
        </div>
        <h1 class="brand-title">{{ brandTitle }}</h1>
        <p class="brand-slogan">{{ brandSlogan }}</p>

        <!-- 特性展示 -->
        <div class="brand-features">
          <div class="feature-item">
            <!-- Lucide: Palette -->
            <svg class="feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="13.5" cy="6.5" r=".5" />
              <circle cx="17.5" cy="10.5" r=".5" />
              <circle cx="8.5" cy="7.5" r=".5" />
              <circle cx="6.5" cy="12.5" r=".5" />
              <path
                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
            </svg>
            <span class="feature-text">主题定制</span>
          </div>
          <div class="feature-item">
            <!-- Lucide: Smartphone -->
            <svg class="feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
            <span class="feature-text">响应式设计</span>
          </div>
          <div class="feature-item">
            <!-- Lucide: Zap -->
            <svg class="feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span class="feature-text">高性能体验</span>
          </div>
        </div>
      </div>

      <!-- 装饰圆环 -->
      <div class="brand-rings">
        <div class="ring ring-1" />
        <div class="ring ring-2" />
        <div class="ring ring-3" />
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="login-form-area">
      <div class="form-wrapper" :class="{ 'is-mounted': mounted }">
        <!-- 表单头部 -->
        <div class="form-header">
          <h2 class="form-title">{{ title }}</h2>
          <p class="form-subtitle">{{ subtitle }}</p>
        </div>

        <!-- Tab 切换 -->
        <div class="login-tabs">
          <div class="tab-indicator" :style="tabStyle" />
          <button type="button" class="tab-btn" :class="{ active: loginType === 'username' }"
            @click="loginType = 'username'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            账号登录
          </button>
          <button type="button" class="tab-btn" :class="{ active: loginType === 'phone' }" @click="loginType = 'phone'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
            手机登录
          </button>
        </div>

        <!-- 登录表单 -->
        <form class="login-form" @submit.prevent="handleSubmit">
          <Transition name="tab-fade" mode="out-in">
            <!-- 账号登录 -->
            <div v-if="loginType === 'username'" key="username" class="form-fields">
              <div class="input-group">
                <div class="input-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input v-model="username" type="text" class="form-input" placeholder="请输入用户名/邮箱" :disabled="loading"
                    autocomplete="username" />
                </div>
              </div>
              <div class="input-group">
                <div class="input-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-input"
                    placeholder="请输入密码" :disabled="loading" autocomplete="current-password" />
                  <button type="button" class="input-suffix" @click="showPassword = !showPassword">
                    <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 手机登录 -->
            <div v-else key="phone" class="form-fields">
              <div class="input-group">
                <div class="input-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                  </svg>
                  <input v-model="phone" type="tel" class="form-input" placeholder="请输入手机号" :disabled="loading"
                    maxlength="11" />
                </div>
              </div>
              <div class="input-group">
                <div class="input-wrapper">
                  <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <input v-model="smsCode" type="text" class="form-input" placeholder="请输入验证码" :disabled="loading"
                    maxlength="6" />
                  <button type="button" class="sms-btn" :disabled="smsCountdown > 0 || !phone" @click="sendSmsCode">
                    {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- 图片验证码 -->
          <div class="input-group captcha-group">
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="m9 9 6 6" />
                <path d="m15 9-6 6" />
              </svg>
              <input v-model="captcha" type="text" class="form-input" placeholder="请输入验证码" :disabled="loading"
                maxlength="4" />
            </div>
            <div class="captcha-img" @click="refreshCaptcha" title="点击刷新">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="48" viewBox="0 0 100 48">
                <rect fill="var(--color-fill-tertiary, #f3f4f6)" width="100" height="48" rx="8" />
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace"
                  font-size="20" font-weight="bold" fill="var(--color-primary-default, #6366f1)">{{ captchaCode
                  }}</text>
                <line :x1="Math.random() * 20" :y1="Math.random() * 48" :x2="80 + Math.random() * 20"
                  :y2="Math.random() * 48" stroke="var(--color-border, #d1d5db)" stroke-width="1" />
              </svg>
            </div>
          </div>

          <!-- 选项 -->
          <div class="form-options">
            <label class="remember-me">
              <input v-model="rememberMe" type="checkbox" class="checkbox" />
              <span class="checkbox-custom" />
              <span class="checkbox-label">记住我</span>
            </label>
            <a href="javascript:;" class="forgot-link" @click="props.onForgotPassword?.()">忘记密码?</a>
          </div>

          <!-- 登录按钮 -->
          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="loading-spinner" />
            <span class="btn-text">{{ loading ? '登录中...' : '登 录' }}</span>
          </button>
        </form>

        <!-- 分隔线 -->
        <div class="divider">
          <span class="divider-text">其他登录方式</span>
        </div>

        <!-- 社交登录 -->
        <div class="social-login">
          <button type="button" class="social-btn github" title="GitHub" @click="handleSocialLogin('github')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </button>
          <button type="button" class="social-btn google" title="Google" @click="handleSocialLogin('google')">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4" />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853" />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05" />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335" />
            </svg>
          </button>
          <button type="button" class="social-btn wechat" title="微信" @click="handleSocialLogin('wechat')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#07C160">
              <path
                d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z" />
            </svg>
          </button>
          <button type="button" class="social-btn qq" title="QQ" @click="handleSocialLogin('qq')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#12B7F5">
              <path
                d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.212 0 6.29.256 6.29-.43 0-.687-1.77-1.182-1.77-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.633 2.072 1.746 2.072.111 0 .282-.36.282-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z" />
            </svg>
          </button>
        </div>

        <!-- 注册 -->
        <p class="signup-hint">
          还没有账户? <a href="javascript:;" class="signup-link" @click="props.onRegister?.()">立即注册</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础布局 */
.login-split {
  /* Semantic Colors Mapping */
  --color-bg-page: var(--color-gray-50, #f8fafc);
  --color-bg-container: var(--color-gray-0, #ffffff);
  --color-bg-container-secondary: var(--color-gray-50, #f9fafb);
  --color-text-primary: var(--color-gray-900, #0f172a);
  --color-text-secondary: var(--color-gray-600, #475569);
  --color-text-tertiary: var(--color-gray-400, #94a3b8);
  --color-text-quaternary: var(--color-gray-300, #cbd5e1);
  --color-text-placeholder: var(--color-gray-400, #9ca3af);
  --color-text-inverse: var(--color-gray-0, #ffffff);
  --color-border-light: var(--color-gray-200, #e2e8f0);
  --color-border: var(--color-gray-300, #cbd5e1);

  --color-fill-tertiary: var(--color-gray-100, #f3f4f6);
  --color-fill-quaternary: var(--color-gray-50, #f9fafb);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  position: relative;
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
  font-family: var(--size-font-family);
}

/* Dark Mode */
:root[data-theme-mode="dark"] .login-split,
.dark .login-split {
  --color-bg-page: var(--color-gray-950, #020617);
  --color-bg-container: var(--color-gray-900, #0f172a);
  --color-bg-container-secondary: var(--color-gray-800, #1e293b);
  --color-text-primary: var(--color-gray-50, #f8fafc);
  --color-text-secondary: var(--color-gray-300, #cbd5e1);
  --color-text-tertiary: var(--color-gray-500, #64748b);
  --color-text-quaternary: var(--color-gray-600, #475569);
  --color-text-placeholder: var(--color-gray-500, #64748b);
  --color-text-inverse: var(--color-gray-50, #f8fafc);
  --color-border-light: var(--color-gray-700, #334155);
  --color-border: var(--color-gray-600, #475569);

  --color-fill-tertiary: var(--color-gray-800, #1e293b);
  --color-fill-quaternary: var(--color-gray-900, #0f172a);
}

.login-toolbar {
  position: fixed;
  top: var(--size-space-huge);
  right: var(--size-space-huge);
  z-index: 100;
  display: flex;
  gap: var(--size-space-medium);
}

/* 左侧品牌区 */
.login-brand {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
  overflow: hidden;
}

/* 粒子 */
.brand-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--size-radius-circle);
  animation: particle-float 12s ease-in-out infinite;
  animation-delay: var(--delay);
}

.particle:nth-child(1) {
  top: 15%;
  left: 10%;
}

.particle:nth-child(2) {
  top: 55%;
  left: 15%;
}

.particle:nth-child(3) {
  top: 35%;
  left: 65%;
}

.particle:nth-child(4) {
  top: 75%;
  left: 55%;
}

.particle:nth-child(5) {
  top: 10%;
  left: 75%;
}

.particle:nth-child(6) {
  top: 65%;
  left: 80%;
}

.particle:nth-child(7) {
  top: 85%;
  left: 25%;
}

.particle:nth-child(8) {
  top: 25%;
  left: 85%;
}

@keyframes particle-float {

  0%,
  100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }

  50% {
    transform: translateY(-30px) translateX(15px);
    opacity: 0.8;
  }
}

/* 品牌内容 */
.brand-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--color-text-inverse);
  padding: var(--size-space-massive);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.brand-content.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.brand-logo {
  margin-bottom: var(--size-space-giant);
}

.logo-image {
  width: 80px;
  height: 80px;
  border-radius: var(--size-radius-large);
  box-shadow: var(--shadow-lg);
}

.logo-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: var(--size-radius-large);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-lg);
}

.brand-title {
  font-size: var(--size-font-display2);
  font-weight: var(--size-font-weight-bold);
  margin: 0 0 var(--size-space-large);
  letter-spacing: -0.02em;
}

.brand-slogan {
  font-size: var(--size-font-large);
  opacity: 0.85;
  margin: 0 0 var(--size-space-colossal);
}

/* 特性展示 */
.brand-features {
  display: flex;
  gap: var(--size-space-giant);
  justify-content: center;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-space-medium);
  padding: var(--size-space-huge) var(--size-space-giant);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--size-radius-large);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s var(--size-ease-out);
}

.feature-item:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  opacity: 0.9;
}

.feature-text {
  font-size: var(--size-font-small);
  opacity: 0.85;
}

/* 装饰圆环 */
.brand-rings {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ring {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--size-radius-circle);
  animation: ring-pulse 8s ease-in-out infinite;
}

.ring-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
}

.ring-2 {
  width: 300px;
  height: 300px;
  bottom: -80px;
  right: -80px;
  animation-delay: 2s;
}

.ring-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 4s;
}

@keyframes ring-pulse {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

/* 右侧表单区 */
.login-form-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-space-massive);
  background: var(--color-bg-container);
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.2s;
}

.form-wrapper.is-mounted {
  opacity: 1;
  transform: translateX(0);
}

/* 表单头部 */
.form-header {
  margin-bottom: var(--size-space-giant);
}

.form-title {
  font-size: var(--size-font-h2);
  font-weight: var(--size-font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--size-space-medium);
}

.form-subtitle {
  font-size: var(--size-font-medium);
  color: var(--color-text-tertiary);
  margin: 0;
}

/* Tab */
.login-tabs {
  position: relative;
  display: flex;
  background: var(--color-bg-container-secondary);
  border-radius: var(--size-radius-medium);
  padding: 4px;
  margin-bottom: var(--size-space-giant);
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: var(--color-bg-container);
  border-radius: var(--size-radius-small);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s var(--size-ease-in-out);
}

.tab-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-space-small);
  padding: var(--size-space-medium) var(--size-space-huge);
  font-size: var(--size-font-medium);
  font-weight: var(--size-font-weight-medium);
  color: var(--color-text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.tab-btn.active {
  color: var(--color-primary-default);
}

/* 表单 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-huge);
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-huge);
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.25s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: var(--size-space-large);
  color: var(--color-text-quaternary);
  pointer-events: none;
  transition: color 0.2s;
  width: var(--size-icon-medium);
  height: var(--size-icon-medium);
}

.form-input {
  width: 100%;
  height: var(--size-btn-large-height);
  padding: 0 var(--size-space-large) 0 44px;
  font-size: var(--size-font-medium);
  color: var(--color-text-primary);
  background: var(--color-bg-container-secondary);
  border: 2px solid transparent;
  border-radius: var(--size-radius-medium);
  outline: none;
  transition: all 0.2s;
}

.form-input::placeholder {
  color: var(--color-text-placeholder);
}

.form-input:focus {
  background: var(--color-bg-container);
  border-color: var(--color-primary-default);
  box-shadow: 0 0 0 4px var(--color-primary-lighter);
}

.form-input:focus~.input-icon {
  color: var(--color-primary-default);
}

.input-suffix {
  position: absolute;
  right: var(--size-space-large);
  padding: 4px;
  color: var(--color-text-quaternary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-suffix:hover {
  color: var(--color-text-secondary);
}

.sms-btn {
  position: absolute;
  right: 6px;
  padding: 6px 12px;
  font-size: var(--size-font-small);
  font-weight: var(--size-font-weight-medium);
  color: var(--color-primary-default);
  background: var(--color-primary-lighter);
  border: none;
  border-radius: var(--size-radius-small);
  cursor: pointer;
  transition: all 0.2s;
}

.sms-btn:hover:not(:disabled) {
  background: var(--color-primary-light);
}

.sms-btn:disabled {
  color: var(--color-text-disabled);
  background: var(--color-bg-component-disabled);
  cursor: not-allowed;
}

/* 验证码 */
.captcha-group {
  flex-direction: row;
  gap: var(--size-space-large);
}

.captcha-group .input-wrapper {
  flex: 1;
}

.captcha-img {
  flex-shrink: 0;
  height: var(--size-btn-large-height);
  display: flex;
  align-items: center;
  border-radius: var(--size-radius-medium);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: var(--shadow-sm);
}

.captcha-img:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.captcha-img:active {
  transform: scale(0.98);
}

/* 选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: var(--size-space-medium);
  cursor: pointer;
}

.checkbox {
  position: absolute;
  opacity: 0;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-radius: var(--size-radius-small);
  transition: all 0.2s;
  position: relative;
  background: var(--color-bg-container);
}

.checkbox:checked+.checkbox-custom {
  background: var(--color-primary-default);
  border-color: var(--color-primary-default);
}

.checkbox:checked+.checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  font-size: var(--size-font-medium);
  color: var(--color-text-secondary);
}

.forgot-link {
  font-size: var(--size-font-medium);
  color: var(--color-primary-default);
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

/* 提交按钮 */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-space-medium);
  height: var(--size-btn-large-height);
  margin-top: var(--size-space-medium);
  font-size: var(--size-font-large);
  font-weight: var(--size-font-weight-semibold);
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary-default) 0%, var(--color-primary-hover) 100%);
  border: none;
  border-radius: var(--size-radius-medium);
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--shadow-md);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  background: linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary-active) 100%);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-bg-component-disabled);
  color: var(--color-text-disabled);
  box-shadow: none;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: var(--size-radius-circle);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 分隔线 */
.divider {
  display: flex;
  align-items: center;
  margin: var(--size-space-giant) 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border-light);
}

.divider-text {
  padding: 0 var(--size-space-huge);
  font-size: var(--size-font-small);
  color: var(--color-text-quaternary);
}

/* 社交登录 */
.social-login {
  display: flex;
  justify-content: center;
  gap: var(--size-space-huge);
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  background: var(--color-bg-container-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--size-radius-medium);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text-secondary);
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  color: var(--color-text-primary);
  background: var(--color-bg-container);
}

.social-btn.github:hover {
  background: #24292e;
  color: #fff;
  border-color: #24292e;
}

.social-btn.google:hover {
  background: #fff;
  border-color: #4285F4;
}

.social-btn.wechat:hover {
  background: #07C160;
  border-color: #07C160;
}

.social-btn.wechat:hover svg {
  fill: #fff;
}

.social-btn.qq:hover {
  background: #12B7F5;
  border-color: #12B7F5;
}

.social-btn.qq:hover svg {
  fill: #fff;
}

/* 注册 */
.signup-hint {
  text-align: center;
  margin-top: var(--size-space-giant);
  font-size: var(--size-font-medium);
  color: var(--color-text-tertiary);
}

.signup-link {
  color: var(--color-primary-default);
  text-decoration: none;
  font-weight: var(--size-font-weight-medium);
  transition: color 0.2s;
}

.signup-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

/* 响应式 */
@media (max-width: 1024px) {
  .login-brand {
    display: none;
  }
}
</style>
