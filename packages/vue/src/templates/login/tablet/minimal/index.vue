<script setup lang="ts">
/**
 * 平板端登录模板 - 极简毛玻璃风格
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
  onSubmit?: (data: LoginData) => void
  onForgotPassword?: () => void
  onRegister?: () => void
  onSocialLogin?: (provider: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '登录',
  subtitle: '登录以访问您的账户',
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
  const rotateX = (y - centerY) / 30
  const rotateY = (centerX - x) / 30
  cardStyle.value = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }
}

function handleMouseLeave() {
  cardStyle.value = { transform: '' }
}

// 验证码翻转
const captchaFlipping = ref(false)

// 光线动画
interface LightRay {
  id: number
  x: number
  delay: number
  duration: number
}
const lightRays = ref<LightRay[]>([])

function initLightRays() {
  lightRays.value = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 2,
  }))
}

onMounted(() => {
  setTimeout(() => mounted.value = true, 100)
  refreshCaptcha()
  initLightRays()
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
  <div class="login-glass">
    <!-- 工具栏 -->
    <div class="login-toolbar">
      <slot name="toolbar" />
    </div>

    <!-- 背景 -->
    <div class="glass-background">
      <div class="bg-gradient bg-gradient-1" />
      <div class="bg-gradient bg-gradient-2" />
      <div class="bg-gradient bg-gradient-3" />
      <!-- 光线 -->
      <div class="light-rays">
        <div 
          v-for="ray in lightRays" 
          :key="ray.id" 
          class="light-ray"
          :style="{
            left: `${ray.x}%`,
            animationDelay: `${ray.delay}s`,
            animationDuration: `${ray.duration}s`,
          }"
        />
      </div>
      <div class="bg-grid" />
    </div>

    <!-- 登录卡片 -->
    <div 
      ref="cardRef"
      class="glass-card" 
      :class="{ 'is-mounted': mounted }"
      :style="cardStyle"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <!-- Logo -->
      <div class="card-logo">
        <img v-if="logo" :src="logo" alt="Logo" class="logo-img" />
        <div v-else class="logo-default">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
          </svg>
        </div>
      </div>

      <!-- 标题 -->
      <div class="card-header">
        <h1 class="card-title">{{ title }}</h1>
        <p class="card-subtitle">{{ subtitle }}</p>
      </div>

      <!-- Tab -->
      <div class="login-tabs">
        <div class="tab-indicator" :style="tabStyle" />
        <button type="button" class="tab-btn" :class="{ active: loginType === 'username' }"
          @click="loginType = 'username'">账号登录</button>
        <button type="button" class="tab-btn" :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'">手机登录</button>
      </div>

      <!-- 表单 -->
      <form class="glass-form" @submit.prevent="handleSubmit">
        <Transition name="tab-fade" mode="out-in">
          <!-- 账号登录 -->
          <div v-if="loginType === 'username'" key="username" class="form-fields">
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input v-model="username" type="text" class="form-input" placeholder="用户名 / 邮箱" :disabled="loading">
            </div>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input v-model="password" type="password" class="form-input" placeholder="密码" :disabled="loading">
            </div>
          </div>

          <!-- 手机登录 -->
          <div v-else key="phone" class="form-fields">
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
              </svg>
              <input v-model="phone" type="tel" class="form-input" placeholder="手机号" :disabled="loading" maxlength="11">
            </div>
            <div class="input-wrapper sms-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <input v-model="smsCode" type="text" class="form-input" placeholder="验证码" :disabled="loading"
                maxlength="6">
              <button type="button" class="sms-btn" :disabled="smsCountdown > 0 || !phone" @click="sendSmsCode">
                {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取' }}
              </button>
            </div>
          </div>
        </Transition>

        <!-- 验证码 -->
        <div class="captcha-row">
          <div class="input-wrapper captcha-wrapper">
            <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="m9 9 6 6" />
              <path d="m15 9-6 6" />
            </svg>
            <input v-model="captcha" type="text" class="form-input" placeholder="验证码" :disabled="loading" maxlength="4">
          </div>
          <div class="captcha-img" :class="{ flipping: captchaFlipping }" @click="refreshCaptcha">
            <svg width="110" height="48" viewBox="0 0 110 48">
              <rect fill="rgba(255,255,255,0.1)" width="110" height="48" rx="10" />
              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace"
                font-size="20" font-weight="bold" fill="var(--color-primary-400, #a78bfa)">{{ captchaCode }}</text>
            </svg>
          </div>
        </div>

        <!-- 登录按钮 -->
        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading" class="loader" />
          {{ loading ? '登录中' : '登 录' }}
        </button>
      </form>

      <!-- 三方登录 -->
      <div class="social-section">
        <div class="social-divider"><span>其他方式</span></div>
        <div class="social-btns">
          <button type="button" class="social-btn" @click="props.onSocialLogin?.('github')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </button>
          <button type="button" class="social-btn" @click="props.onSocialLogin?.('google')">
            <svg width="18" height="18" viewBox="0 0 24 24">
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
          <button type="button" class="social-btn" @click="props.onSocialLogin?.('wechat')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#07C160">
              <path
                d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 底部 -->
      <div class="card-footer">
        <a href="javascript:;" class="footer-link" @click="props.onForgotPassword?.()">忘记密码?</a>
        <span class="footer-dot">·</span>
        <a href="javascript:;" class="footer-link" @click="props.onRegister?.()">注册账户</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-glass {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  overflow: hidden;
}

.login-toolbar {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
  display: flex;
  gap: 8px;
}

/* 工具栏按钮样式 - 深色主题 */
.login-toolbar :deep(button),
.login-toolbar :deep(a),
.login-toolbar :deep([class*="picker"]),
.login-toolbar :deep([class*="trigger"]) {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  color: rgba(255, 255, 255, 0.8) !important;
  border-radius: 12px !important;
  transition: all 0.25s ease !important;
}

.login-toolbar :deep(button:hover),
.login-toolbar :deep(a:hover) {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
}

/* 工具栏弹窗样式 - 深色主题 */
.login-toolbar :deep([class*="dropdown"]),
.login-toolbar :deep([class*="menu"]),
.login-toolbar :deep([class*="panel"]),
.login-toolbar :deep([class*="popover"]) {
  background: rgba(15, 15, 30, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.login-toolbar :deep([class*="dropdown"] *),
.login-toolbar :deep([class*="menu"] *),
.login-toolbar :deep([class*="panel"] *) {
  color: rgba(255, 255, 255, 0.85) !important;
}

.login-toolbar :deep([class*="item"]:hover),
.login-toolbar :deep([class*="option"]:hover) {
  background: rgba(139, 92, 246, 0.2) !important;
}

/* 背景 */
.glass-background {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
}

.bg-gradient {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
  animation: gradient-float 20s ease-in-out infinite;
}

.bg-gradient-1 {
  width: 500px;
  height: 500px;
  top: -100px;
  left: -50px;
  background: var(--color-primary-600, #7c3aed);
}

.bg-gradient-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  right: -50px;
  background: var(--color-info-500, #06b6d4);
  animation-delay: -10s;
}

.bg-gradient-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  background: var(--color-warning-500, #f59e0b);
  opacity: 0.3;
  animation-delay: -5s;
}

@keyframes gradient-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}

/* 光线效果 */
.light-rays {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.light-ray {
  position: absolute;
  top: -100%;
  width: 3px;
  height: 200%;
  background: linear-gradient(
    180deg, 
    transparent, 
    rgba(139, 92, 246, 0.2), 
    rgba(139, 92, 246, 0.5),
    rgba(6, 182, 212, 0.4),
    rgba(139, 92, 246, 0.2),
    transparent
  );
  animation: rayFall linear infinite;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.1);
}

@keyframes rayFall {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* 卡片 */
.glass-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 36px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.08);
  opacity: 0;
  transform: translateY(30px) scale(0.98);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-style: preserve-3d;
  will-change: transform;
}

.glass-card.is-mounted {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 渐变边框 */
.glass-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 26px;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.4),
    transparent 30%,
    transparent 70%,
    rgba(6, 182, 212, 0.4)
  );
  opacity: 0;
  z-index: -1;
  transition: opacity 0.4s;
}

.glass-card:hover::before {
  opacity: 1;
}

/* Logo */
.card-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.logo-img {
  width: 56px;
  height: 56px;
  border-radius: 14px;
}

.logo-default {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-primary-500, #8b5cf6), var(--color-primary-700, #6d28d9));
  border-radius: 14px;
  box-shadow: 0 8px 24px -8px var(--color-primary-500, rgba(139, 92, 246, 0.5));
  color: #fff;
  animation: logoFloat 4s ease-in-out infinite;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-default:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 30px -8px var(--color-primary-500, rgba(139, 92, 246, 0.7));
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* Header */
.card-header {
  text-align: center;
  margin-bottom: 22px;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 50%, #fff 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: titleShimmer 4s ease-in-out infinite;
}

@keyframes titleShimmer {
  0%, 100% {
    background-position: 200% 50%;
  }
  50% {
    background-position: 0% 50%;
  }
}

.card-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* Tabs */
.login-tabs {
  position: relative;
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 22px;
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
}

.tab-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.tab-btn.active {
  color: #fff;
}

/* Form */
.glass-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  left: 14px;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 14px 0 44px;
  font-size: 15px;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary-400, #a78bfa);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15), 0 0 20px rgba(167, 139, 250, 0.1);
}

.input-wrapper:focus-within .input-icon {
  color: var(--color-primary-400, #a78bfa);
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* SMS */
.sms-wrapper .form-input {
  padding-right: 80px;
}

.sms-btn {
  position: absolute;
  right: 8px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary-400, #a78bfa);
  background: rgba(139, 92, 246, 0.15);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.sms-btn:disabled {
  color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
}

/* Captcha */
.captcha-row {
  display: flex;
  gap: 12px;
}

.captcha-wrapper {
  flex: 1;
}

.captcha-img {
  flex-shrink: 0;
  height: 48px;
  display: flex;
  align-items: center;
  border-radius: 12px;
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
  background: linear-gradient(135deg, var(--color-primary-500, #8b5cf6), var(--color-primary-600, #7c3aed));
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 20px -5px var(--color-primary-500, rgba(139, 92, 246, 0.5));
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px -8px var(--color-primary-500, rgba(139, 92, 246, 0.6));
}

.submit-btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px -5px var(--color-primary-500, rgba(139, 92, 246, 0.5));
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.loader {
  width: 16px;
  height: 16px;
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
.social-section {
  margin-top: 22px;
}

.social-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.social-divider::before,
.social-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.social-divider span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
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
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.4);
}

/* 品牌色悬停 */
.social-btn:nth-child(1):hover {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 12px 30px -8px rgba(51, 51, 51, 0.5);
}

.social-btn:nth-child(2):hover {
  border-color: rgba(66, 133, 244, 0.5);
  box-shadow: 0 12px 30px -8px rgba(66, 133, 244, 0.3);
}

.social-btn:nth-child(3):hover {
  border-color: rgba(7, 193, 96, 0.5);
  box-shadow: 0 12px 30px -8px rgba(7, 193, 96, 0.3);
}

/* 社交按钮入场动画 */
.social-btn:nth-child(1) {
  animation: socialIn 0.4s ease backwards 0.1s;
}

.social-btn:nth-child(2) {
  animation: socialIn 0.4s ease backwards 0.2s;
}

.social-btn:nth-child(3) {
  animation: socialIn 0.4s ease backwards 0.3s;
}

@keyframes socialIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Footer */
.card-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-link {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-primary-400, #a78bfa);
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: var(--color-primary-400, #a78bfa);
}

.footer-link:hover::after {
  width: 100%;
}

.footer-dot {
  color: rgba(255, 255, 255, 0.2);
}

/* 按钮渐变流动效果 */
.submit-btn {
  background: linear-gradient(
    135deg,
    var(--color-primary-400, #a78bfa) 0%,
    var(--color-primary-500, #8b5cf6) 30%,
    var(--color-primary-600, #7c3aed) 70%,
    var(--color-info-500, #06b6d4) 100%
  );
  background-size: 300% 100%;
  animation: gradientFlow 4s ease infinite;
}

@keyframes gradientFlow {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.submit-btn:hover {
  animation-play-state: paused;
}

/* 输入框霉虹效果 */
.form-input:focus {
  box-shadow: 
    0 0 0 3px rgba(167, 139, 250, 0.15), 
    0 0 20px rgba(167, 139, 250, 0.15),
    inset 0 0 10px rgba(167, 139, 250, 0.05);
}

.input-wrapper:focus-within .input-icon {
  color: var(--color-primary-400, #a78bfa);
  transform: scale(1.15);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 0 4px rgba(167, 139, 250, 0.5));
}
</style>
