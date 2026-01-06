<script setup lang="ts">
/**
 * 桌面端登录模板 - 极简毛玻璃风格
 * 深度优化版: 彩虹光斑、噪点纹理、3D卡片、翻转验证码
 */
import { ref, onMounted, computed, onUnmounted } from 'vue'

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

// 3D卡片效果
const cardRef = ref<HTMLElement | null>(null)
const cardStyle = ref({})

function handleCardMouseMove(e: MouseEvent) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  const rotateX = (0.5 - y) * 8
  const rotateY = (x - 0.5) * 8
  cardStyle.value = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0) scale(1)`,
  }
}

function handleCardMouseLeave() {
  cardStyle.value = {}
}

// 翻转验证码
const captchaFlipped = ref(false)

const captchaCode = ref('')
const smsCountdown = ref(0)
let smsTimer: ReturnType<typeof setInterval> | null = null

// 星点动画
const stars = ref<{ id: number; x: number; y: number; size: number; delay: number }[]>([])

function initStars() {
  stars.value = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
  }))
}

onMounted(() => {
  setTimeout(() => mounted.value = true, 100)
  refreshCaptcha()
  initStars()
})

onUnmounted(() => {
  if (smsTimer) clearInterval(smsTimer)
})

function refreshCaptcha() {
  captchaFlipped.value = true
  setTimeout(() => {
    captchaCode.value = Math.random().toString(36).substring(2, 6).toUpperCase()
    captchaFlipped.value = false
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
      <div class="bg-gradient bg-gradient-4" />
      <!-- 噪点纹理 -->
      <div class="bg-noise" />
      <!-- 网格装饰 -->
      <div class="bg-grid" />
      <!-- 星点闪烁 -->
      <div class="bg-stars">
        <div 
          v-for="star in stars" 
          :key="star.id" 
          class="star"
          :style="{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }"
        />
      </div>
      <!-- 浮动光斑 -->
      <div class="bg-orbs">
        <div class="orb orb-1" />
        <div class="orb orb-2" />
        <div class="orb orb-3" />
      </div>
    </div>

    <!-- 登录卡片 -->
    <div 
      ref="cardRef"
      class="glass-card" 
      :class="{ 'is-mounted': mounted }"
      :style="cardStyle"
      @mousemove="handleCardMouseMove"
      @mouseleave="handleCardMouseLeave"
    >
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
            <div class="form-field">
              <input v-model="username" type="text" class="field-input" placeholder="用户名 / 邮箱" :disabled="loading" />
            </div>
            <div class="form-field">
              <input v-model="password" type="password" class="field-input" placeholder="密码" :disabled="loading" />
            </div>
          </div>

          <!-- 手机登录 -->
          <div v-else key="phone" class="form-fields">
            <div class="form-field">
              <input v-model="phone" type="tel" class="field-input" placeholder="手机号" :disabled="loading" maxlength="11" />
            </div>
            <div class="form-field sms-field">
              <input v-model="smsCode" type="text" class="field-input" placeholder="验证码" :disabled="loading" maxlength="6" />
              <button type="button" class="sms-btn" :disabled="smsCountdown > 0 || !phone" @click="sendSmsCode">
                {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取' }}
              </button>
            </div>
          </div>
        </Transition>

        <!-- 图片验证码 -->
        <div class="captcha-row">
          <div class="form-field captcha-field">
            <input v-model="captcha" type="text" class="field-input" placeholder="验证码" :disabled="loading" maxlength="4" />
          </div>
          <div class="captcha-img" :class="{ 'is-flipped': captchaFlipped }" @click="refreshCaptcha">
            <div class="captcha-inner">
              <div class="captcha-front">
                <svg width="100" height="48" viewBox="0 0 100 48">
                  <rect fill="rgba(255,255,255,0.1)" width="100" height="48" rx="10" />
                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace"
                    font-size="20" font-weight="bold" fill="var(--color-primary-400, #a78bfa)">{{ captchaCode }}</text>
                </svg>
              </div>
              <div class="captcha-back">
                <svg width="100" height="48" viewBox="0 0 100 48">
                  <rect fill="rgba(139, 92, 246, 0.2)" width="100" height="48" rx="10" />
                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace"
                    font-size="14" fill="rgba(255,255,255,0.6)">刷新中...</text>
                </svg>
              </div>
            </div>
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
/* ========== CSS Variables ========== */
.login-glass {
  /* Sizes Mapping (Compatibility for space/spacing) */
  --size-space-xs: var(--size-space-xs, 4px);
  --size-space-sm: var(--size-space-sm, 8px);
  --size-space-md: var(--size-space-md, 16px);
  --size-space-lg: var(--size-space-lg, 24px);
  --size-space-xl: var(--size-space-xl, 32px);
  --size-space-2xl: var(--size-space-2xl, 40px);
  --size-space-3xl: var(--size-space-3xl, 64px);

  /* Font Sizes */
  --size-font-xs: 12px;
  --size-font-sm: 14px;
  --size-font-base: 16px;
  --size-font-lg: 18px;
  --size-font-xl: 20px;
  --size-font-2xl: 24px;
  --size-font-3xl: 30px;

  /* Radius */
  --size-radius-md: 6px;
  --size-radius-lg: 8px;
  --size-radius-xl: 12px;
  --size-radius-2xl: 16px;

  /* Colors - Glass Theme (Dark Mode Base) */
  --glass-bg-primary: rgba(255, 255, 255, 0.05);
  --glass-bg-secondary: rgba(255, 255, 255, 0.03);
  --glass-bg-input: rgba(0, 0, 0, 0.2);
  --glass-bg-input-focus: rgba(0, 0, 0, 0.3);
  
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-light: rgba(255, 255, 255, 0.15);
  
  --glass-text-primary: #ffffff;
  --glass-text-secondary: rgba(255, 255, 255, 0.7);
  --glass-text-tertiary: rgba(255, 255, 255, 0.45);
  --glass-text-placeholder: rgba(255, 255, 255, 0.3);

  /* Brand Colors */
  --color-primary: var(--color-primary-500, #8b5cf6);
  --color-primary-hover: var(--color-primary-600, #7c3aed);
  --color-primary-glow: rgba(139, 92, 246, 0.5);
  --color-success: var(--color-success-500, #10b981);
  --color-info: var(--color-info-500, #06b6d4);

  /* Shadows */
  --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  --shadow-glass-hover: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 20px var(--color-primary-glow);

  font-family: var(--size-font-family, system-ui, sans-serif);
  color: var(--glass-text-primary);
}

.login-glass {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--size-space-xl);
  overflow: hidden;
  background: #0f172a; /* Fallback */
  background: radial-gradient(circle at top left, #1e1b4b 0%, #0f172a 40%, #020617 100%);
}

/* 工具栏 - 右下角垂直圆形按钮 */
.login-toolbar {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-toolbar :deep(button),
.login-toolbar :deep(a),
.login-toolbar :deep(.toolbar-btn) {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  padding: 0 !important;
  border-radius: 50% !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(12px) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.25s ease !important;
}

.login-toolbar :deep(button):hover,
.login-toolbar :deep(a):hover,
.login-toolbar :deep(.toolbar-btn):hover {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
  transform: scale(1.08) !important;
}

.login-toolbar :deep(span),
.login-toolbar :deep(.btn-text) {
  display: none !important;
}

/* 工具栏弹窗样式 - 深色主题适配 */
.login-toolbar :deep(.dropdown),
.login-toolbar :deep(.popup),
.login-toolbar :deep(.popover),
.login-toolbar :deep([class*="dropdown"]),
.login-toolbar :deep([class*="popup"]),
.login-toolbar :deep([class*="popover"]),
.login-toolbar :deep([class*="menu"]),
.login-toolbar :deep([class*="panel"]) {
  position: fixed !important;
  right: 80px !important;
  bottom: auto !important;
  top: auto !important;
  left: auto !important;
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
  color: #ffffff !important;
  min-width: 120px !important;
  padding: 8px !important;
}

/* 弹窗内文字 */
.login-toolbar :deep(.dropdown) *,
.login-toolbar :deep(.popup) *,
.login-toolbar :deep(.popover) *,
.login-toolbar :deep([class*="dropdown"]) *,
.login-toolbar :deep([class*="popup"]) *,
.login-toolbar :deep([class*="popover"]) *,
.login-toolbar :deep([class*="menu"]) *,
.login-toolbar :deep([class*="panel"]) * {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* 弹窗内按钮/选项 */
.login-toolbar :deep(.dropdown) button,
.login-toolbar :deep(.popup) button,
.login-toolbar :deep([class*="dropdown"]) button,
.login-toolbar :deep([class*="menu"]) button,
.login-toolbar :deep([class*="option"]),
.login-toolbar :deep([class*="item"]) {
  width: 100% !important;
  height: auto !important;
  min-width: auto !important;
  padding: 10px 16px !important;
  border-radius: 8px !important;
  background: transparent !important;
  border: none !important;
  text-align: left !important;
  justify-content: flex-start !important;
  color: rgba(255, 255, 255, 0.85) !important;
}

.login-toolbar :deep(.dropdown) button:hover,
.login-toolbar :deep(.popup) button:hover,
.login-toolbar :deep([class*="dropdown"]) button:hover,
.login-toolbar :deep([class*="menu"]) button:hover,
.login-toolbar :deep([class*="option"]):hover,
.login-toolbar :deep([class*="item"]):hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  transform: none !important;
}

/* 弹窗内文字显示 */
.login-toolbar :deep(.dropdown) span,
.login-toolbar :deep(.popup) span,
.login-toolbar :deep([class*="dropdown"]) span,
.login-toolbar :deep([class*="menu"]) span {
  display: inline !important;
}

/* 分割线 */
.login-toolbar :deep([class*="divider"]),
.login-toolbar :deep(hr) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* 标题 */
.login-toolbar :deep([class*="title"]),
.login-toolbar :deep([class*="header"]) {
  color: rgba(255, 255, 255, 0.6) !important;
  font-size: 12px !important;
  padding: 8px 16px 4px !important;
}

/* 动态背景 */
.glass-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

.bg-gradient-1 {
  width: 50vw;
  height: 50vw;
  max-width: 600px;
  max-height: 600px;
  top: -10%;
  left: -10%;
  background: var(--color-primary);
  animation-delay: 0s;
}

.bg-gradient-2 {
  width: 40vw;
  height: 40vw;
  max-width: 500px;
  max-height: 500px;
  bottom: -10%;
  right: -5%;
  background: var(--color-info);
  animation-delay: -5s;
}

.bg-gradient-3 {
  width: 30vw;
  height: 30vw;
  max-width: 400px;
  max-height: 400px;
  top: 40%;
  left: 30%;
  background: var(--color-success);
  opacity: 0.2;
  animation-delay: -10s;
}

/* 彩虹渐变光球 */
.bg-gradient-4 {
  width: 35vw;
  height: 35vw;
  max-width: 450px;
  max-height: 450px;
  top: 60%;
  right: 20%;
  background: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #fbbf24 100%);
  opacity: 0.15;
  animation-delay: -15s;
  filter: blur(100px);
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* 噪点纹理 */
.bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* 星点闪烁 */
.bg-stars {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.star {
  position: absolute;
  background: #ffffff;
  border-radius: 50%;
  animation: starTwinkle 3s ease-in-out infinite;
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
    box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.3);
  }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
}

.bg-orbs .orb {
  position: absolute;
  border-radius: 50%;
  background: white;
  opacity: 0.1;
  filter: blur(1px);
  animation: twinkle 4s ease-in-out infinite;
}

.orb-1 { width: 4px; height: 4px; top: 20%; left: 20%; animation-delay: 0s; }
.orb-2 { width: 6px; height: 6px; top: 60%; right: 25%; animation-delay: 1s; }
.orb-3 { width: 3px; height: 3px; bottom: 30%; left: 40%; animation-delay: 2s; }

@keyframes twinkle {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.5); }
}

/* 登录卡片 */
.glass-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: var(--glass-bg-primary);
  border: 1px solid var(--glass-border);
  border-top-color: var(--glass-border-light);
  border-radius: var(--size-radius-2xl);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: var(--shadow-glass), inset 0 1px 1px rgba(255, 255, 255, 0.05);
  opacity: 0;
  transform: translateY(30px) scale(0.98);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.glass-card.is-mounted {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.glass-card:hover {
  box-shadow: var(--shadow-glass-hover), inset 0 1px 1px rgba(255, 255, 255, 0.08);
}

/* 卡片彩虹边框效果 */
.glass-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.3) 0%,
    rgba(6, 182, 212, 0.2) 50%,
    rgba(16, 185, 129, 0.3) 100%
  );
  z-index: -1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.glass-card:hover::before {
  opacity: 1;
  animation: borderGlow 3s ease-in-out infinite;
}

@keyframes borderGlow {
  0%, 100% {
    background: linear-gradient(
      135deg,
      rgba(139, 92, 246, 0.3) 0%,
      rgba(6, 182, 212, 0.2) 50%,
      rgba(16, 185, 129, 0.3) 100%
    );
  }
  50% {
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.3) 0%,
      rgba(139, 92, 246, 0.2) 50%,
      rgba(6, 182, 212, 0.3) 100%
    );
  }
}

.card-logo {
  display: flex;
  justify-content: center;
  margin-bottom: var(--size-space-lg);
}

.logo-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.logo-default {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #6366f1 100%);
  border-radius: var(--size-radius-xl);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
  color: white;
  animation: logoPulse 3s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% {
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 12px 32px rgba(139, 92, 246, 0.6);
    transform: scale(1.02);
  }
}

.card-header {
  text-align: center;
  margin-bottom: var(--size-space-xl);
}

.card-title {
  font-size: var(--size-font-2xl);
  font-weight: 700;
  margin: 0 0 8px;
  background: linear-gradient(to right, #fff, rgba(255,255,255,0.7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-subtitle {
  font-size: var(--size-font-sm);
  color: var(--glass-text-tertiary);
  margin: 0;
}

/* Tabs */
.login-tabs {
  position: relative;
  display: flex;
  background: var(--glass-bg-secondary);
  border-radius: var(--size-radius-lg);
  padding: 4px;
  margin-bottom: var(--size-space-xl);
  border: 1px solid var(--glass-border);
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
}

.tab-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 12px 16px;
  background: none;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.25s ease;
}

.tab-btn:hover:not(.active) {
  color: var(--glass-text-primary);
  transform: scale(1.02);
}

.tab-btn:active {
  transform: scale(0.98);
}

.tab-btn.active {
  color: var(--glass-text-primary);
  font-weight: 500;
}

/* Form */
.glass-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field {
  position: relative;
}

.field-input {
  width: 100%;
  height: 52px;
  padding: 0 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  outline: none;
  transition: all 0.25s ease;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.field-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* 浏览器自动填充样式 - 保持毛玻璃效果 */
.field-input:-webkit-autofill,
.field-input:-webkit-autofill:hover,
.field-input:-webkit-autofill:focus,
.field-input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px rgba(30, 27, 75, 0.95) inset !important;
  -webkit-text-fill-color: #ffffff !important;
  background-color: rgba(30, 27, 75, 0.95) !important;
  border: 1px solid rgba(139, 92, 246, 0.3) !important;
  caret-color: #ffffff;
  transition: background-color 5000s ease-in-out 0s;
}

.field-input:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.field-input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.25), 0 0 20px rgba(139, 92, 246, 0.15);
}

.field-label {
  display: none;
}

.field-line {
  display: none; /* Removed in favor of border */
}

/* SMS Button */
.sms-field .field-input {
  padding-right: 80px;
}

.sms-btn {
  position: absolute;
  right: 8px;
  top: 8px;
  bottom: 8px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--size-radius-md);
  color: var(--color-primary);
  font-size: var(--size-font-xs);
  cursor: pointer;
  transition: all 0.2s;
}

.sms-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.sms-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Captcha */
.captcha-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.captcha-field {
  flex: 1;
}

.captcha-img {
  width: 120px;
  height: 52px;
  cursor: pointer;
  flex-shrink: 0;
}

.captcha-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
}

.captcha-img.is-flipped .captcha-inner {
  transform: rotateY(180deg);
}

.captcha-front,
.captcha-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.captcha-back {
  transform: rotateY(180deg);
}

.captcha-img:hover .captcha-front,
.captcha-img:hover .captcha-back {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

/* Submit Button */
.glass-btn {
  position: relative;
  width: 100%;
  height: 54px;
  margin-top: 20px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #6366f1 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
}

.glass-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-primary-hover) 0%, #4f46e5 100%);
  box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5);
  transform: translateY(-2px);
}

.glass-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.glass-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Social Login */
.social-section {
  margin-top: 28px;
}

.social-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.social-divider::before,
.social-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.social-divider span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
}

.social-btns {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Footer */
.card-footer {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
}

.footer-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: white;
}

.footer-dot {
  opacity: 0.4;
}

/* Transitions */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.tab-fade-leave-active {
  position: absolute;
  width: 100%;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}


/* 响应式 */
@media (max-width: 480px) {
  .glass-card {
    padding: 24px;
    background: rgba(20, 20, 30, 0.85);
    backdrop-filter: blur(20px);
  }
  
  .bg-gradient {
    filter: blur(60px);
    opacity: 0.3;
  }
}
</style>
