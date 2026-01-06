<script setup lang="ts">
/**
 * 平板端登录模板 - 卡片渐变风格
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'

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
  onSubmit?: (data: LoginData) => void
  onForgotPassword?: () => void
  onRegister?: () => void
  onSocialLogin?: (provider: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '登录',
  subtitle: '请登录您的账户',
  brandTitle: 'LDesign',
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
const showPassword = ref(false)
const loading = ref(false)
const mounted = ref(false)

const captchaCode = ref('')
const smsCountdown = ref(0)
let smsTimer: ReturnType<typeof setInterval> | null = null

// 鼠标跟随倒斜效果
const cardRef = ref<HTMLElement | null>(null)
const cardStyle = ref<{ transform: string }>({ transform: '' })

function handleMouseMove(e: MouseEvent) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = (y - centerY) / 25
  const rotateY = (centerX - x) / 25
  cardStyle.value = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }
}

function handleMouseLeave() {
  cardStyle.value = { transform: '' }
}

// 验证码翻转
const captchaFlipping = ref(false)

onMounted(() => {
  setTimeout(() => mounted.value = true, 100)
  refreshCaptcha()
})

onUnmounted(() => {
  if (smsTimer) {
    clearInterval(smsTimer)
    smsTimer = null
  }
})

function refreshCaptcha() {
  captchaFlipping.value = true
  setTimeout(() => {
    captchaCode.value = Math.random().toString(36).substring(2, 6).toUpperCase()
    captchaFlipping.value = false
  }, 300)
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
</script>

<template>
  <div class="login-tablet">
    <!-- 工具栏 -->
    <div class="login-toolbar">
      <slot name="toolbar" />
    </div>

    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-blob bg-blob-1" />
      <div class="bg-blob bg-blob-2" />
      <div class="bg-blob bg-blob-3" />
      <!-- 网格线 -->
      <div class="bg-grid" />
    </div>

    <!-- 头部 Logo -->
    <div class="login-header" :class="{ 'is-mounted': mounted }">
      <div class="header-logo">
        <!-- Lucide: Sparkles -->
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path
            d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      </div>
      <span class="header-title">{{ brandTitle }}</span>
    </div>

    <div 
      ref="cardRef"
      class="login-card" 
      :class="{ 'is-mounted': mounted }"
      :style="cardStyle"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <!-- 标题 -->
      <div class="card-header">
        <h1 class="card-title">{{ title }}</h1>
        <p class="card-subtitle">{{ subtitle }}</p>
      </div>

      <!-- Tab 切换 -->
      <div class="login-tabs">
        <div class="tab-indicator" :style="tabStyle" />
        <button type="button" class="tab-btn" :class="{ active: loginType === 'username' }"
          @click="loginType = 'username'">
          <!-- Lucide: User -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          账号登录
        </button>
        <button type="button" class="tab-btn" :class="{ active: loginType === 'phone' }" @click="loginType = 'phone'">
          <!-- Lucide: Smartphone -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
          手机登录
        </button>
      </div>

      <!-- 表单 -->
      <form class="login-form" @submit.prevent="handleSubmit">
        <Transition name="tab-slide" mode="out-in">
          <!-- 账号登录 -->
          <div v-if="loginType === 'username'" key="username" class="form-fields">
            <div class="input-group">
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input v-model="username" type="text" class="form-input" placeholder="用户名 / 邮箱" :disabled="loading">
              </div>
            </div>
            <div class="input-group">
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="密码"
                  :disabled="loading">
                <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                  <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                <input v-model="phone" type="tel" class="form-input" placeholder="手机号" :disabled="loading"
                  maxlength="11">
              </div>
            </div>
            <div class="input-group">
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <input v-model="smsCode" type="text" class="form-input" placeholder="验证码" :disabled="loading"
                  maxlength="6">
                <button type="button" class="sms-btn" :disabled="smsCountdown > 0 || !phone" @click="sendSmsCode">
                  {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 验证码 -->
        <div class="captcha-row">
          <div class="input-group captcha-input">
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="m9 9 6 6" />
                <path d="m15 9-6 6" />
              </svg>
              <input v-model="captcha" type="text" class="form-input" placeholder="验证码" :disabled="loading"
                maxlength="4">
            </div>
          </div>
          <div class="captcha-img" :class="{ flipping: captchaFlipping }" @click="refreshCaptcha">
            <svg width="110" height="48" viewBox="0 0 110 48">
              <rect fill="var(--color-fill-tertiary, #f3f4f6)" width="110" height="48" rx="10" />
              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace"
                font-size="20" font-weight="bold" fill="var(--color-primary-default, #6366f1)">{{ captchaCode }}</text>
            </svg>
          </div>
        </div>

        <!-- 选项 -->
        <div class="form-options">
          <label class="remember"><input type="checkbox" /><span>记住我</span></label>
          <a href="javascript:;" class="forgot" @click="props.onForgotPassword?.()">忘记密码?</a>
        </div>

        <!-- 登录按钮 -->
        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading" class="loader" />
          {{ loading ? '登录中...' : '立即登录' }}
        </button>
      </form>

      <!-- 三方登录 -->
      <div class="social-area">
        <div class="social-title"><span>其他登录方式</span></div>
        <div class="social-btns">
          <button type="button" class="social-btn" @click="props.onSocialLogin?.('github')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </button>
          <button type="button" class="social-btn" @click="props.onSocialLogin?.('wechat')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#07C160">
              <path
                d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z" />
            </svg>
          </button>
          <button type="button" class="social-btn" @click="props.onSocialLogin?.('qq')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#12B7F5">
              <path
                d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.212 0 6.29.256 6.29-.43 0-.687-1.77-1.182-1.77-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.633 2.072 1.746 2.072.111 0 .282-.36.282-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 注册 -->
      <p class="register-hint">
        还没有账户? <a href="javascript:;" @click="props.onRegister?.()">立即注册</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-tablet {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, var(--color-primary-50, #eef2ff) 0%, var(--color-bg-layout, #f8fafc) 100%);
}

.login-toolbar {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
  display: flex;
  gap: 8px;
}

/* 工具栏按钮样式 */
.login-toolbar :deep(button),
.login-toolbar :deep(a),
.login-toolbar :deep([class*="picker"]),
.login-toolbar :deep([class*="trigger"]) {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(99, 102, 241, 0.15) !important;
  color: var(--color-primary-default, #6366f1) !important;
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
  transition: all 0.25s ease !important;
}

.login-toolbar :deep(button:hover),
.login-toolbar :deep(a:hover) {
  background: rgba(255, 255, 255, 0.95) !important;
  border-color: var(--color-primary-200, #c7d2fe) !important;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15) !important;
}

/* 工具栏弹窗样式 */
.login-toolbar :deep([class*="dropdown"]),
.login-toolbar :deep([class*="menu"]),
.login-toolbar :deep([class*="panel"]),
.login-toolbar :deep([class*="popover"]) {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid var(--color-border, #e5e7eb) !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
  color: var(--color-text-primary, #1f2937) !important;
}

.login-toolbar :deep([class*="dropdown"] *),
.login-toolbar :deep([class*="menu"] *),
.login-toolbar :deep([class*="panel"] *) {
  color: var(--color-text-primary, #1f2937) !important;
}

.login-toolbar :deep([class*="item"]:hover),
.login-toolbar :deep([class*="option"]:hover) {
  background: var(--color-primary-50, #eef2ff) !important;
}

/* 背景 */
.bg-decoration {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: blob-move 25s ease-in-out infinite, blobPulse 4s ease-in-out infinite;
}

.bg-blob-1 {
  width: 500px;
  height: 500px;
  top: -150px;
  right: -100px;
  background: var(--color-primary-300, #a5b4fc);
}

.bg-blob-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -80px;
  background: var(--color-info-300, #67e8f9);
  animation-delay: -8s;
}

.bg-blob-3 {
  width: 300px;
  height: 300px;
  top: 40%;
  left: 30%;
  background: var(--color-success-300, #86efac);
  animation-delay: -16s;
}

@keyframes blob-move {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes blobPulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.55;
  }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--color-border-secondary, rgba(0, 0, 0, 0.03)) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border-secondary, rgba(0, 0, 0, 0.03)) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Header */
.login-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.5s ease;
}

.login-header.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

.header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary-default, #6366f1), var(--color-primary-600, #4f46e5));
  border-radius: 14px;
  color: #fff;
  box-shadow: 0 8px 20px -8px var(--color-primary-400, rgba(99, 102, 241, 0.5));
  animation: logoFloat 4s ease-in-out infinite;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.header-logo:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 25px -8px var(--color-primary-400, rgba(99, 102, 241, 0.6));
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary-default, #6366f1), var(--color-primary-700, #4338ca));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 卡片 */
.login-card {
  position: relative;
  width: 100%;
  max-width: 440px;
  padding: 36px;
  background: var(--color-bg-container, #fff);
  border-radius: 24px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 10px 20px -5px rgba(0, 0, 0, 0.04);
  opacity: 0;
  transform: translateY(30px) scale(0.98);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.1s;
  transform-style: preserve-3d;
  will-change: transform;
}

.login-card.is-mounted {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.login-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 26px;
  background: linear-gradient(135deg, 
    var(--color-primary-200, rgba(99, 102, 241, 0.3)),
    transparent 40%,
    transparent 60%,
    var(--color-info-200, rgba(6, 182, 212, 0.3)));
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s;
}

.login-card:hover::before {
  opacity: 1;
}

/* Header */
.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary, #1f2937);
  margin: 0 0 8px;
}

.card-subtitle {
  font-size: 14px;
  color: var(--color-text-tertiary, #6b7280);
  margin: 0;
}

/* Tabs */
.login-tabs {
  position: relative;
  display: flex;
  background: var(--color-fill-quaternary, #f3f4f6);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: var(--color-bg-container, #fff);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tab-btn.active {
  color: var(--color-primary-default, #6366f1);
}

.tab-btn:hover:not(.active) {
  color: var(--color-text-secondary, #4b5563);
}

.tab-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-tertiary, #6b7280);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.tab-btn.active {
  color: var(--color-primary-default, #6366f1);
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tab-slide-enter-active,
.tab-slide-leave-active {
  transition: all 0.25s ease;
}

.tab-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.tab-slide-leave-to {
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
  left: 14px;
  color: var(--color-text-quaternary, #9ca3af);
  transition: color 0.2s;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 14px 0 44px;
  font-size: 15px;
  color: var(--color-text-primary, #1f2937);
  background: var(--color-fill-quaternary, #f9fafb);
  border: 2px solid transparent;
  border-radius: 12px;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  background: var(--color-bg-container, #fff);
  border-color: var(--color-primary-default, #6366f1);
  box-shadow: 
    0 0 0 4px var(--color-primary-100, rgba(99, 102, 241, 0.15)),
    0 0 20px rgba(99, 102, 241, 0.1);
}

.input-wrapper:focus-within .input-icon {
  color: var(--color-primary-default, #6366f1);
  transform: scale(1.15);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.form-input:focus~.input-icon {
  color: var(--color-primary-default, #6366f1);
}

.eye-btn {
  position: absolute;
  right: 12px;
  padding: 6px;
  color: var(--color-text-quaternary, #9ca3af);
  background: none;
  border: none;
  cursor: pointer;
}

.sms-btn {
  position: absolute;
  right: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary-default, #6366f1);
  background: var(--color-primary-50, #eef2ff);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.sms-btn:disabled {
  color: var(--color-text-quaternary, #9ca3af);
  background: var(--color-fill-quaternary, #f3f4f6);
  cursor: not-allowed;
}

/* Captcha */
.captcha-row {
  display: flex;
  gap: 12px;
}

.captcha-input {
  flex: 1;
}

.captcha-img {
  flex-shrink: 0;
  height: 48px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
}

.captcha-img:hover {
  transform: scale(1.05);
}

.captcha-img.flipping {
  animation: captchaFlip 0.6s ease;
}

@keyframes captchaFlip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

/* Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary, #6b7280);
  cursor: pointer;
}

.forgot {
  font-size: 14px;
  color: var(--color-primary-default, #6366f1);
  text-decoration: none;
}

.forgot:hover {
  text-decoration: underline;
}

/* Submit */
.submit-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  margin-top: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary-default, #6366f1), var(--color-primary-600, #4f46e5));
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 20px -5px var(--color-primary-500, rgba(99, 102, 241, 0.4));
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px -8px var(--color-primary-500, rgba(99, 102, 241, 0.5));
}

.submit-btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px -5px var(--color-primary-500, rgba(99, 102, 241, 0.4));
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Social */
.social-area {
  margin-top: 24px;
}

.social-title {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.social-title::before,
.social-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border-secondary, #e5e7eb);
}

.social-title span {
  font-size: 13px;
  color: var(--color-text-quaternary, #9ca3af);
}

.social-btns {
  display: flex;
  justify-content: center;
  gap: 14px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-fill-quaternary, #f9fafb);
  border: 1px solid var(--color-border-secondary, #e5e7eb);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.social-btn:hover {
  transform: translateY(-5px) scale(1.08);
  box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.18);
}

/* 品牌色悬停效果 */
.social-btn:nth-child(1):hover {
  border-color: #333;
  background: rgba(51, 51, 51, 0.05);
}

.social-btn:nth-child(2):hover {
  border-color: #07C160;
  background: rgba(7, 193, 96, 0.05);
}

.social-btn:nth-child(3):hover {
  border-color: #12B7F5;
  background: rgba(18, 183, 245, 0.05);
}

/* 社交按钮交错入场 */
.social-btn:nth-child(1) {
  animation: socialFadeIn 0.4s ease backwards 0.1s;
}

.social-btn:nth-child(2) {
  animation: socialFadeIn 0.4s ease backwards 0.2s;
}

.social-btn:nth-child(3) {
  animation: socialFadeIn 0.4s ease backwards 0.3s;
}

@keyframes socialFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Register */
.register-hint {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--color-text-tertiary, #9ca3af);
}

.register-hint a {
  color: var(--color-primary-default, #6366f1);
  text-decoration: none;
  font-weight: 500;
}

.register-hint a:hover {
  text-decoration: underline;
}

/* 按钮光晕动画 */
.submit-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent);
  opacity: 0;
}

.submit-btn:hover::after {
  animation: buttonShine 1.5s ease infinite;
}

@keyframes buttonShine {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* 标题动画 */
.card-title {
  background: linear-gradient(135deg, 
    var(--color-text-primary, #1f2937) 0%,
    var(--color-primary-default, #6366f1) 50%,
    var(--color-text-primary, #1f2937) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGradient 4s ease-in-out infinite;
}

@keyframes titleGradient {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 200% center;
  }
}
</style>
