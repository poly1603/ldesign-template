<script setup lang="ts">
/**
 * 移动端登录模板 - 全屏渐变风格
 * 深度优化版: 自然漂浮、涟漪按钮、触摸反馈
 */
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'

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
  /** 外部验证码图片 URL（如果提供则使用真实验证码） */
  captchaUrl?: string
  /** 刷新验证码回调 */
  onRefreshCaptcha?: () => string | void
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
const captchaImgUrl = ref('')
const smsCountdown = ref(0)
let smsTimer: ReturnType<typeof setInterval> | null = null

// 监听外部验证码 URL 变化
watch(() => props.captchaUrl, (url) => {
  if (url) {
    captchaImgUrl.value = url
  }
}, { immediate: true })

// 涟漪效果
const ripples = ref<{ id: number; x: number; y: number }[]>([])
let rippleId = 0

function createRipple(e: MouseEvent | TouchEvent) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  let x: number, y: number
  if ('touches' in e) {
    x = e.touches[0].clientX - rect.left
    y = e.touches[0].clientY - rect.top
  } else {
    x = e.clientX - rect.left
    y = e.clientY - rect.top
  }
  const id = rippleId++
  ripples.value.push({ id, x, y })
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, 600)
}

// 粒子系统
const particles = ref<{ id: number; x: number; y: number; size: number; duration: number }[]>([])

function initParticles() {
  particles.value = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
  }))
}

onMounted(() => {
  setTimeout(() => mounted.value = true, 50)
  refreshCaptcha()
  initParticles()
})

onUnmounted(() => {
  if (smsTimer) clearInterval(smsTimer)
})

function refreshCaptcha() {
  // 如果有外部刷新回调，调用它
  if (props.onRefreshCaptcha) {
    const newUrl = props.onRefreshCaptcha()
    if (newUrl) {
      captchaImgUrl.value = newUrl
    }
  } else {
    // 否则使用本地生成的假验证码
    captchaCode.value = Math.random().toString(36).substring(2, 6).toUpperCase()
  }
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
      <div class="bg-orb bg-orb-3" />
      <!-- 粒子效果 -->
      <div class="particles">
        <div 
          v-for="p in particles" 
          :key="p.id" 
          class="particle"
          :style="{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
          }"
        />
      </div>
    </div>

    <!-- 内容区 -->
    <div class="login-content" :class="{ 'is-mounted': mounted }">
      <!-- Logo & 标题 -->
      <div class="login-header">
        <div class="logo" @touchstart.passive>
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
            <!-- 使用外部验证码图片或本地生成的文字验证码 -->
            <img v-if="captchaImgUrl" :src="captchaImgUrl" alt="验证码" class="captcha-image" />
            <svg v-else width="100" height="50" viewBox="0 0 100 50">
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
        <button 
          type="submit" 
          class="submit-btn" 
          :disabled="loading"
          @touchstart="createRipple"
          @mousedown="createRipple"
        >
          <span v-if="loading" class="loader" />
          <span class="btn-text">{{ loading ? '登录中...' : '登 录' }}</span>
          <!-- 涟漪效果 -->
          <span 
            v-for="ripple in ripples" 
            :key="ripple.id" 
            class="ripple"
            :style="{ left: `${ripple.x}px`, top: `${ripple.y}px` }"
          />
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
  /* Semantic Colors Mapping */
  --color-text-inverse: var(--color-gray-0, #ffffff);

  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: env(safe-area-inset-top) var(--size-space-giant) env(safe-area-inset-bottom);
  font-family: var(--size-font-family);
}

.login-toolbar {
  position: fixed;
  top: calc(env(safe-area-inset-top) + var(--size-space-huge));
  right: var(--size-space-giant);
  z-index: 100;
  display: flex;
  gap: var(--size-space-medium);
}

/* 工具栏按钮样式 */
.login-toolbar :deep(button),
.login-toolbar :deep(a),
.login-toolbar :deep([class*="picker"]),
.login-toolbar :deep([class*="trigger"]) {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
  border-radius: 12px !important;
  transition: all 0.25s ease !important;
}

.login-toolbar :deep(button:active),
.login-toolbar :deep(a:active) {
  transform: scale(0.95) !important;
  background: rgba(255, 255, 255, 0.25) !important;
}

/* 工具栏弹窗样式 */
.login-toolbar :deep([class*="dropdown"]),
.login-toolbar :deep([class*="menu"]),
.login-toolbar :deep([class*="panel"]),
.login-toolbar :deep([class*="popover"]),
.login-toolbar :deep([class*="content"]) {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 14px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2) !important;
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
.bg-gradient {
  position: fixed;
  inset: 0;
  background: linear-gradient(160deg, var(--color-primary-600) 0%, var(--color-primary-800) 50%, var(--color-primary-900) 100%);
}

.bg-orb {
  position: absolute;
  border-radius: var(--size-radius-circle);
  filter: blur(80px);
  opacity: 0.4;
  animation: orb-float 20s ease-in-out infinite;
}

.bg-orb-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -80px;
  background: var(--color-info-400);
}

.bg-orb-2 {
  width: 250px;
  height: 250px;
  bottom: -80px;
  left: -60px;
  background: var(--color-success-400);
  animation-delay: -10s;
}

.bg-orb-3 {
  width: 180px;
  height: 180px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #f472b6, #fb923c);
  opacity: 0.25;
  animation-delay: -5s;
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
  padding: var(--size-space-giant) 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s var(--size-ease-out);
}

.login-content.is-mounted {
  opacity: 1;
  transform: translateY(0);
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: var(--size-space-massive);
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--size-space-huge);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-text-inverse);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: logoBreathe 3s ease-in-out infinite;
}

.logo:active {
  transform: scale(0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

@keyframes logoBreathe {
  0%, 100% {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.15);
  }
}

.logo img {
  width: 40px;
  height: 40px;
  border-radius: var(--size-radius-medium);
}

.title {
  font-size: var(--size-font-h1);
  font-weight: var(--size-font-weight-bold);
  color: var(--color-text-inverse);
  margin: 0 0 var(--size-space-medium);
}

.subtitle {
  font-size: var(--size-font-medium);
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* Tabs */
.login-tabs {
  position: relative;
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--size-radius-huge);
  padding: 4px;
  margin-bottom: var(--size-space-giant);
}

.tab-bg {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--size-radius-large);
  transition: transform 0.3s var(--size-ease-out);
}

.tab {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: var(--size-space-huge);
  font-size: var(--size-font-medium);
  font-weight: var(--size-font-weight-medium);
  color: rgba(255, 255, 255, 0.6);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
}

.tab:active {
  transform: scale(0.95);
}

.tab.active {
  color: var(--color-text-inverse);
}

/* Tab 指示器弹性 */
.tab-bg {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--size-radius-large);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-huge);
}

.fields {
  display: flex;
  flex-direction: column;
  gap: var(--size-space-huge);
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
  left: var(--size-space-huge);
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  width: var(--size-icon-medium);
  height: var(--size-icon-medium);
}

.field input {
  width: 100%;
  height: var(--size-btn-large-height);
  padding: 0 var(--size-space-huge) 0 48px;
  font-size: var(--size-font-medium);
  color: var(--color-text-inverse);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--size-radius-huge);
  outline: none;
  transition: all 0.2s;
  appearance: none;
  -webkit-appearance: none;
}

.field input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.field input:focus {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.field:focus-within .field-icon {
  color: rgba(255, 255, 255, 0.9);
  transform: scale(1.1);
  transition: all 0.2s ease;
}

/* Eye */
.eye {
  position: absolute;
  right: var(--size-space-huge);
  padding: var(--size-space-medium);
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
  right: var(--size-space-medium);
  padding: var(--size-space-large) var(--size-space-huge);
  font-size: var(--size-font-small);
  font-weight: var(--size-font-weight-medium);
  color: var(--color-text-inverse);
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: var(--size-radius-large);
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
  gap: var(--size-space-huge);
}

.captcha-field {
  flex: 1;
}

.captcha-img {
  flex-shrink: 0;
  height: var(--size-btn-large-height);
  display: flex;
  align-items: center;
  border-radius: var(--size-radius-huge);
  overflow: hidden;
  cursor: pointer;
}

/* Options */
.options {
  text-align: right;
  margin-top: 2px;
}

.options a {
  font-size: var(--size-font-medium);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}

/* Submit */
.submit-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-space-medium);
  height: var(--size-btn-large-height);
  margin-top: var(--size-space-medium);
  font-size: var(--size-font-large);
  font-weight: var(--size-font-weight-semibold);
  color: var(--color-primary-700);
  background: #fff;
  border: none;
  border-radius: var(--size-radius-huge);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
}

.btn-text {
  position: relative;
  z-index: 1;
}

/* 涟漪效果 */
.ripple {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(99, 102, 241, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: rippleExpand 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes rippleExpand {
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  100% {
    width: 400px;
    height: 400px;
    opacity: 0;
  }
}

.submit-btn:active {
  transform: scale(0.97);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-top-color: var(--color-primary-600);
  border-radius: var(--size-radius-circle);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Social */
.social-section {
  margin-top: var(--size-space-massive);
  text-align: center;
}

.social-title {
  font-size: var(--size-font-small);
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: var(--size-space-huge);
}

.social-btns {
  display: flex;
  justify-content: center;
  gap: var(--size-space-giant);
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--size-radius-huge);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;
}

/* 社交按钮弹跳效果 */
.social-btn:active {
  transform: scale(0.85);
  background: rgba(255, 255, 255, 0.25);
}

.social-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.social-btn:active::after {
  opacity: 1;
}

/* Register */
.register {
  text-align: center;
  margin-top: 22px;
  font-size: var(--size-font-medium);
  color: rgba(255, 255, 255, 0.6);
}

.register a {
  color: var(--color-text-inverse);
  font-weight: var(--size-font-weight-medium);
  text-decoration: none;
  position: relative;
}

.register a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}

.register a:active::after {
  width: 100%;
}

/* Tab 过渡动画 */
.tab-bg {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--size-radius-large);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* SMS 按钮改进 */
.sms-btn:not(:disabled):active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.25);
}

/* 验证码图片交互 */
.captcha-img:active {
  transform: scale(0.98);
}

.captcha-image {
  width: 100px;
  height: 50px;
  border-radius: 12px;
  object-fit: cover;
  user-select: none;
  transition: all 0.25s ease;
}

.captcha-image:active {
  transform: scale(0.98);
}

/* 粒子效果增强 */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-drift ease-in-out infinite;
}

@keyframes particle-drift {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translate(15px, -20px) scale(1.2);
    opacity: 1;
  }
  50% {
    transform: translate(-10px, 15px) scale(0.8);
    opacity: 0.4;
  }
  75% {
    transform: translate(20px, 10px) scale(1.1);
    opacity: 0.8;
  }
}

/* 输入框聚焦效果增强 */
.field input:focus {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.15), 0 0 20px rgba(255, 255, 255, 0.1);
}

/* 按钮光晕效果 */
.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: btn-shine 3s ease-in-out infinite;
}

@keyframes btn-shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

/* 社交按钮入场动画 */
.social-btn:nth-child(1) {
  animation: social-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s backwards;
}

.social-btn:nth-child(2) {
  animation: social-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
}

.social-btn:nth-child(3) {
  animation: social-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s backwards;
}

@keyframes social-bounce {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 内容分步入场 */
.login-content.is-mounted .login-header {
  animation: content-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

.login-content.is-mounted .login-tabs {
  animation: content-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards;
}

.login-content.is-mounted .login-form {
  animation: content-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
}

.login-content.is-mounted .social-section {
  animation: content-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
}

@keyframes content-slide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
