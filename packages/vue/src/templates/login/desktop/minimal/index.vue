<script setup lang="ts">
/**
 * 桌面端登录模板 - 极简毛玻璃风格
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
const focused = ref<string | null>(null)

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
  <div class="login-glass">
    <!-- 工具栏 -->
    <div class="login-toolbar">
      <slot name="toolbar" />
    </div>

    <!-- 动态背景 -->
    <div class="glass-background">
      <div class="bg-gradient bg-gradient-1" />
      <div class="bg-gradient bg-gradient-2" />
      <div class="bg-gradient bg-gradient-3" />
      <!-- 网格装饰 -->
      <div class="bg-grid" />
      <!-- 浮动光斑 -->
      <div class="bg-orbs">
        <div class="orb orb-1" />
        <div class="orb orb-2" />
        <div class="orb orb-3" />
      </div>
    </div>

    <!-- 登录卡片 -->
    <div class="glass-card" :class="{ 'is-mounted': mounted }">
      <!-- Logo -->
      <div class="card-logo">
        <img v-if="logo" :src="logo" alt="Logo" class="logo-img" />
        <div v-else class="logo-default">
          <!-- Lucide: Diamond -->
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

      <!-- Tab 切换 -->
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
            <div class="form-field" :class="{ 'is-focused': focused === 'username', 'has-value': username }">
              <input v-model="username" type="text" class="field-input" placeholder=" " :disabled="loading"
                @focus="focused = 'username'" @blur="focused = null" />
              <label class="field-label">用户名 / 邮箱</label>
              <span class="field-line" />
            </div>
            <div class="form-field" :class="{ 'is-focused': focused === 'password', 'has-value': password }">
              <input v-model="password" type="password" class="field-input" placeholder=" " :disabled="loading"
                @focus="focused = 'password'" @blur="focused = null" />
              <label class="field-label">密码</label>
              <span class="field-line" />
            </div>
          </div>

          <!-- 手机登录 -->
          <div v-else key="phone" class="form-fields">
            <div class="form-field" :class="{ 'is-focused': focused === 'phone', 'has-value': phone }">
              <input v-model="phone" type="tel" class="field-input" placeholder=" " :disabled="loading" maxlength="11"
                @focus="focused = 'phone'" @blur="focused = null" />
              <label class="field-label">手机号</label>
              <span class="field-line" />
            </div>
            <div class="form-field sms-field" :class="{ 'is-focused': focused === 'sms', 'has-value': smsCode }">
              <input v-model="smsCode" type="text" class="field-input" placeholder=" " :disabled="loading" maxlength="6"
                @focus="focused = 'sms'" @blur="focused = null" />
              <label class="field-label">验证码</label>
              <button type="button" class="sms-btn" :disabled="smsCountdown > 0 || !phone" @click="sendSmsCode">
                {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取' }}
              </button>
              <span class="field-line" />
            </div>
          </div>
        </Transition>

        <!-- 图片验证码 -->
        <div class="captcha-row">
          <div class="form-field captcha-field" :class="{ 'is-focused': focused === 'captcha', 'has-value': captcha }">
            <input v-model="captcha" type="text" class="field-input" placeholder=" " :disabled="loading" maxlength="4"
              @focus="focused = 'captcha'" @blur="focused = null" />
            <label class="field-label">验证码</label>
            <span class="field-line" />
          </div>
          <div class="captcha-img" @click="refreshCaptcha">
            <svg width="100" height="48" viewBox="0 0 100 48">
              <rect fill="rgba(255,255,255,0.1)" width="100" height="48" rx="10" />
              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace"
                font-size="20" font-weight="bold" fill="var(--color-primary-400, #a78bfa)">{{ captchaCode }}</text>
            </svg>
          </div>
        </div>

        <!-- 登录按钮 -->
        <button type="submit" class="glass-btn" :disabled="loading">
          <span v-if="loading" class="btn-loader" />
          <span class="btn-text">{{ loading ? '登录中' : '登 录' }}</span>
        </button>
      </form>

      <!-- 第三方登录 -->
      <div class="social-section">
        <div class="social-divider"><span>其他方式</span></div>
        <div class="social-btns">
          <button type="button" class="social-btn" @click="handleSocialLogin('github')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </button>
          <button type="button" class="social-btn" @click="handleSocialLogin('google')">
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
          <button type="button" class="social-btn wechat" @click="handleSocialLogin('wechat')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#07C160">
              <path
                d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 底部链接 -->
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
  width: 600px;
  height: 600px;
  top: -150px;
  left: -100px;
  background: var(--color-primary-600, #7c3aed);
}

.bg-gradient-2 {
  width: 500px;
  height: 500px;
  bottom: -150px;
  right: -100px;
  background: var(--color-info-500, #06b6d4);
  animation-delay: -7s;
}

.bg-gradient-3 {
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-success-500, #10b981);
  animation-delay: -14s;
}

@keyframes gradient-float {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(40px, -40px) scale(1.1);
  }

  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}

/* 网格 */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: grid-move 30s linear infinite;
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(60px, 60px);
  }
}

/* 浮动光斑 */
.bg-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  animation: orb-float 15s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  left: 10%;
}

.orb-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: -5s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 30%;
  animation-delay: -10s;
}

@keyframes orb-float {

  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }

  50% {
    transform: translateY(-30px) scale(1.1);
    opacity: 0.6;
  }
}

/* 卡片 - 加宽 */
.glass-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card.is-mounted {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Logo */
.card-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-img {
  width: 60px;
  height: 60px;
  border-radius: 16px;
}

.logo-default {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--color-primary-500, #8b5cf6), var(--color-primary-700, #6d28d9));
  border-radius: 16px;
  box-shadow: 0 8px 24px -8px var(--color-primary-500, rgba(139, 92, 246, 0.5));
  color: #fff;
}

/* Header */
.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.card-title {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
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
  margin-bottom: 24px;
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.tab-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 12px 16px;
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
  gap: 16px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.form-field {
  position: relative;
}

.field-input {
  width: 100%;
  height: 52px;
  padding: 22px 16px 8px;
  font-size: 15px;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  outline: none;
  transition: all 0.2s;
}

.field-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-primary-400, #a78bfa);
}

.field-label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 15px;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  transition: all 0.2s;
}

.form-field.is-focused .field-label,
.form-field.has-value .field-label {
  top: 14px;
  font-size: 11px;
  color: var(--color-primary-400, #a78bfa);
}

.field-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary-400, #a78bfa), var(--color-info-400, #22d3ee));
  transform: translateX(-50%);
  transition: width 0.3s;
}

.form-field.is-focused .field-line {
  width: 90%;
}

/* SMS */
.sms-field .field-input {
  padding-right: 80px;
}

.sms-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary-400, #a78bfa);
  background: rgba(139, 92, 246, 0.15);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
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

.captcha-field {
  flex: 1;
}

.captcha-img {
  flex-shrink: 0;
  height: 52px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.captcha-img:hover {
  transform: scale(1.02);
}

/* Submit */
.glass-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 52px;
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary-500, #8b5cf6), var(--color-primary-600, #7c3aed));
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.glass-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -10px var(--color-primary-500, rgba(139, 92, 246, 0.6));
}

.glass-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loader {
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
.social-section {
  margin-top: 24px;
}

.social-divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
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
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

/* Footer */
.card-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-link {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #fff;
}

.footer-dot {
  color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 480px) {
  .glass-card {
    padding: 28px;
    max-width: 100%;
  }

  .card-title {
    font-size: 22px;
  }
}
</style>
