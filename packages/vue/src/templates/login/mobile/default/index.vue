<script setup lang="ts">
/**
 * 移动端登录模板 - 全屏渐变风格
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
  subtitle: '欢迎回来',
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

onMounted(() => {
  setTimeout(() => mounted.value = true, 50)
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
</script>

<template>
  <div class="login-mobile">
    <!-- 工具栏 -->
    <div class="login-toolbar">
      <slot name="toolbar" />
    </div>

    <!-- 背景 -->
    <div class="bg-gradient">
      <div class="bg-orb bg-orb-1" />
      <div class="bg-orb bg-orb-2" />
    </div>

    <!-- 内容区 -->
    <div class="login-content" :class="{ 'is-mounted': mounted }">
      <!-- Logo & 标题 -->
      <div class="login-header">
        <div class="logo">
          <img v-if="logo" :src="logo" alt="Logo">
          <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path
              d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        </div>
        <h1 class="title">{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
      </div>

      <!-- Tab 切换 -->
      <div class="login-tabs">
        <div class="tab-bg" :style="tabStyle" />
        <button type="button" class="tab" :class="{ active: loginType === 'username' }"
          @click="loginType = 'username'">账号</button>
        <button type="button" class="tab" :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'">手机</button>
      </div>

      <!-- 表单 -->
      <form class="login-form" @submit.prevent="handleSubmit">
        <Transition name="slide" mode="out-in">
          <!-- 账号登录 -->
          <div v-if="loginType === 'username'" key="username" class="fields">
            <div class="field">
              <svg class="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input v-model="username" type="text" placeholder="用户名 / 邮箱" :disabled="loading">
            </div>
            <div class="field">
              <svg class="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="密码" :disabled="loading">
              <button type="button" class="eye" @click="showPassword = !showPassword">
                <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 手机登录 -->
          <div v-else key="phone" class="fields">
            <div class="field">
              <svg class="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
              </svg>
              <input v-model="phone" type="tel" placeholder="手机号" :disabled="loading" maxlength="11">
            </div>
            <div class="field sms-field">
              <svg class="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <input v-model="smsCode" type="text" placeholder="验证码" :disabled="loading" maxlength="6">
              <button type="button" class="sms-btn" :disabled="smsCountdown > 0 || !phone" @click="sendSmsCode">
                {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取' }}
              </button>
            </div>
          </div>
        </Transition>

        <!-- 验证码 -->
        <div class="captcha-row">
          <div class="field captcha-field">
            <svg class="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="m9 9 6 6" />
              <path d="m15 9-6 6" />
            </svg>
            <input v-model="captcha" type="text" placeholder="验证码" :disabled="loading" maxlength="4">
          </div>
          <div class="captcha-img" @click="refreshCaptcha">
            <svg width="100" height="50" viewBox="0 0 100 50">
              <rect fill="rgba(255,255,255,0.1)" width="100" height="50" rx="12" />
              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace"
                font-size="20" font-weight="bold" fill="#fff">{{ captchaCode }}</text>
            </svg>
          </div>
        </div>

        <!-- 忘记密码 -->
        <div class="options">
          <a href="javascript:;" @click="props.onForgotPassword?.()">忘记密码?</a>
        </div>

        <!-- 登录按钮 -->
        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading" class="loader" />
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>

      <!-- 三方登录 -->
      <div class="social-section">
        <div class="social-title">其他方式</div>
        <div class="social-btns">
          <button type="button" class="social-btn" @click="props.onSocialLogin?.('wechat')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#07C160">
              <path
                d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z" />
            </svg>
          </button>
          <button type="button" class="social-btn" @click="props.onSocialLogin?.('qq')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#12B7F5">
              <path
                d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.212 0 6.29.256 6.29-.43 0-.687-1.77-1.182-1.77-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.633 2.072 1.746 2.072.111 0 .282-.36.282-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z" />
            </svg>
          </button>
          <button type="button" class="social-btn" @click="props.onSocialLogin?.('alipay')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1677FF">
              <path
                d="M21.422 15.358c-1.395-.466-5.016-1.756-6.753-2.432-.247.488-.524.962-.83 1.418 1.873.818 5.93 2.324 7.583 3.478v2.178c0 1.103-.897 2-2 2H4.578c-1.103 0-2-.897-2-2V4c0-1.103.897-2 2-2h14.844c1.103 0 2 .897 2 2v11.358zM12.5 3.5c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 注册 -->
      <p class="register">
        没有账户? <a href="javascript:;" @click="props.onRegister?.()">立即注册</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-mobile {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: env(safe-area-inset-top) 20px env(safe-area-inset-bottom);
}

.login-toolbar {
  position: fixed;
  top: calc(env(safe-area-inset-top) + 10px);
  right: 14px;
  z-index: 100;
  display: flex;
  gap: 6px;
}

/* 背景 */
.bg-gradient {
  position: fixed;
  inset: 0;
  background: linear-gradient(160deg, var(--color-primary-600, #4f46e5) 0%, var(--color-primary-800, #3730a3) 50%, var(--color-primary-900, #312e81) 100%);
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: orb-float 20s ease-in-out infinite;
}

.bg-orb-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -80px;
  background: var(--color-info-400, #22d3ee);
}

.bg-orb-2 {
  width: 250px;
  height: 250px;
  bottom: -80px;
  left: -60px;
  background: var(--color-success-400, #4ade80);
  animation-delay: -10s;
}

@keyframes orb-float {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(20px, -20px) scale(1.1);
  }
}

/* 内容 */
.login-content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
}

.login-content.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 14px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.logo img {
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px;
}

.subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* Tabs */
.login-tabs {
  position: relative;
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 4px;
  margin-bottom: 22px;
}

.tab-bg {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.tab {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 14px;
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.tab.active {
  color: #fff;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.field {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 14px;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.field input {
  width: 100%;
  height: 52px;
  padding: 0 16px 0 48px;
  font-size: 16px;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  outline: none;
  transition: all 0.2s;
  appearance: none;
  -webkit-appearance: none;
}

.field input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.field input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Eye */
.eye {
  position: absolute;
  right: 12px;
  padding: 8px;
  color: rgba(255, 255, 255, 0.5);
  background: none;
  border: none;
  cursor: pointer;
}

/* SMS */
.sms-field input {
  padding-right: 90px;
}

.sms-btn {
  position: absolute;
  right: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.sms-btn:disabled {
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.08);
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
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
}

/* Options */
.options {
  text-align: right;
  margin-top: 2px;
}

.options a {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}

/* Submit */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 52px;
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary-700, #4338ca);
  background: #fff;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:active {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-top-color: var(--color-primary-600, #4f46e5);
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
  margin-top: 28px;
  text-align: center;
}

.social-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
}

.social-btns {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.social-btn:active {
  transform: scale(0.95);
}

/* Register */
.register {
  text-align: center;
  margin-top: 22px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.register a {
  color: #fff;
  font-weight: 500;
  text-decoration: none;
}
</style>
