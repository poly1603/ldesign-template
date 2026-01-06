<script setup lang="ts">
/**
 * 桌面端登录模板 - 经典双栏风格
 * 深度优化版: 粒子背景、3D效果、弹性动画
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

// 展示卡片3D倾斜效果
const cardRef = ref<HTMLElement | null>(null)
const cardTransform = ref('perspective(1000px) rotateY(-5deg) rotateX(5deg)')

function handleCardMouseMove(e: MouseEvent) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  const rotateY = (x - 0.5) * 15
  const rotateX = (0.5 - y) * 15
  cardTransform.value = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`
}

function handleCardMouseLeave() {
  cardTransform.value = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)'
}

const captchaCode = ref('')
const smsCountdown = ref(0)
let smsTimer: ReturnType<typeof setInterval> | null = null

// 粒子系统
const particles = ref<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([])

function initParticles() {
  particles.value = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * -20,
  }))
}

onMounted(() => {
  setTimeout(() => mounted.value = true, 100)
  refreshCaptcha()
  initParticles()
})

onUnmounted(() => {
  if (smsTimer) clearInterval(smsTimer)
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
      <div class="brand-bg">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
        <div class="bg-shape shape-3"></div>
        <!-- 粒子效果 -->
        <div class="particles-container">
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
              animationDelay: `${p.delay}s`,
            }"
          />
        </div>
        <!-- 光线射线 -->
        <div class="light-rays"></div>
      </div>
      
      <div class="brand-content" :class="{ 'is-mounted': mounted }">
        <div class="brand-header">
          <div class="brand-logo">
            <img v-if="logo" :src="logo" alt="Logo" class="logo-image" />
            <div v-else class="logo-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <h1 class="brand-title">{{ brandTitle }}</h1>
        </div>
        <p class="brand-slogan">{{ brandSlogan }}</p>
        
        <div class="brand-showcase">
          <div 
            ref="cardRef"
            class="showcase-card"
            :style="{ transform: cardTransform }"
            @mousemove="handleCardMouseMove"
            @mouseleave="handleCardMouseLeave"
          >
            <div class="card-header">
              <div class="dot red"></div>
              <div class="dot yellow"></div>
              <div class="dot green"></div>
            </div>
            <div class="card-body">
              <div class="skeleton-line w-75"></div>
              <div class="skeleton-line w-50"></div>
              <div class="skeleton-row">
                <div class="skeleton-box"></div>
                <div class="skeleton-box"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="login-form-area">
      <div class="form-container" :class="{ 'is-mounted': mounted }">
        <!-- 头部 -->
        <div class="form-header">
          <h2 class="form-title">{{ title }}</h2>
          <p class="form-subtitle">{{ subtitle }}</p>
        </div>

        <!-- Tab 切换 -->
        <div class="login-tabs">
          <button 
            type="button" 
            class="tab-btn" 
            :class="{ active: loginType === 'username' }"
            @click="loginType = 'username'"
          >
            账号登录
          </button>
          <button 
            type="button" 
            class="tab-btn" 
            :class="{ active: loginType === 'phone' }"
            @click="loginType = 'phone'"
          >
            手机登录
          </button>
          <div class="tab-ink" :style="tabStyle"></div>
        </div>

        <!-- 表单 -->
        <form class="login-form" @submit.prevent="handleSubmit">
          <Transition name="fade-slide" mode="out-in">
            <div v-if="loginType === 'username'" key="username" class="form-group">
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input 
                  v-model="username" 
                  type="text" 
                  class="form-input" 
                  placeholder="请输入用户名/邮箱"
                  :disabled="loading"
                />
              </div>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-input" 
                  placeholder="请输入密码"
                  :disabled="loading"
                />
                <button type="button" class="input-suffix" @click="showPassword = !showPassword">
                  <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div v-else key="phone" class="form-group">
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                </span>
                <input 
                  v-model="phone" 
                  type="tel" 
                  class="form-input" 
                  placeholder="请输入手机号"
                  :disabled="loading"
                />
              </div>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </span>
                <input 
                  v-model="smsCode" 
                  type="text" 
                  class="form-input" 
                  placeholder="请输入验证码"
                  :disabled="loading"
                />
                <button 
                  type="button" 
                  class="sms-btn" 
                  :disabled="smsCountdown > 0 || !phone"
                  @click="sendSmsCode"
                >
                  {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码' }}
                </button>
              </div>
            </div>
          </Transition>

          <!-- 验证码 -->
          <div class="input-wrapper captcha-wrapper">
            <span class="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </span>
            <input 
              v-model="captcha" 
              type="text" 
              class="form-input" 
              placeholder="验证码"
              :disabled="loading"
            />
            <div class="captcha-img" @click="refreshCaptcha">
              <span class="captcha-text">{{ captchaCode }}</span>
            </div>
          </div>

          <div class="form-footer">
            <label class="checkbox-label">
              <input v-model="rememberMe" type="checkbox" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              记住我
            </label>
            <a href="javascript:;" class="link-btn" @click="props.onForgotPassword">忘记密码？</a>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '登录中...' : '登 录' }}
          </button>
        </form>

        <!-- 第三方登录 -->
        <div class="social-login">
          <div class="divider"><span>其他登录方式</span></div>
          <div class="social-icons">
            <button class="social-icon" title="GitHub" @click="handleSocialLogin('github')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>
            <button class="social-icon" title="WeChat" @click="handleSocialLogin('wechat')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 注册链接 -->
        <div class="register-link">
          还没有账户？<a href="javascript:;" @click="props.onRegister?.()">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== CSS Variables from ldesign/size & color ========== */
.login-split {
  /* Colors */
  --color-primary-default: var(--color-primary-500, #2563eb);
  --color-primary-hover: var(--color-primary-600, #1d4ed8);
  --color-primary-active: var(--color-primary-700, #1e40af);
  --color-primary-lighter: var(--color-primary-50, #eff6ff);
  --color-primary-light: var(--color-primary-100, #dbeafe);

  --color-text-primary: var(--color-text-primary, #1e293b);
  --color-text-secondary: var(--color-text-secondary, #475569);
  --color-text-tertiary: var(--color-text-tertiary, #64748b);
  --color-text-quaternary: var(--color-text-quaternary, #94a3b8);
  --color-text-placeholder: var(--color-text-placeholder, #cbd5e1);
  --color-text-inverse: #ffffff;
  --color-text-disabled: var(--color-text-disabled, #cbd5e1);

  --color-bg-container: var(--color-bg-container, #ffffff);
  --color-bg-container-secondary: var(--color-bg-container-secondary, #f8fafc);
  --color-bg-component-disabled: var(--color-bg-component-disabled, #f1f5f9);

  --color-border: var(--color-border, #e2e8f0);

  /* Sizes (Mapped from Size Package) */
  --size-font-small: var(--size-font-xs, 12px);
  --size-font-medium: var(--size-font-sm, 14px);
  --size-font-large: var(--size-font-md, 16px);
  --size-font-h2: var(--size-font-2xl, 24px);
  --size-font-display2: var(--size-font-4xl, 36px);

  --size-space-small: var(--size-space-xs, 4px);
  --size-space-medium: var(--size-space-sm, 8px);
  --size-space-large: var(--size-space-md, 16px);
  --size-space-huge: var(--size-space-lg, 24px);
  --size-space-giant: var(--size-space-xl, 32px);
  --size-space-colossal: var(--size-space-2xl, 40px);
  --size-space-massive: var(--size-space-3xl, 64px);

  --size-radius-small: var(--size-radius-xs, 4px);
  --size-radius-medium: var(--size-radius-sm, 6px);
  --size-radius-large: var(--size-radius-md, 8px);
  --size-radius-circle: 50%;

  --size-icon-medium: 20px;
  --size-btn-large-height: 48px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  --size-font-weight-medium: 500;
  --size-font-weight-semibold: 600;
  --size-font-weight-bold: 700;

  --size-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --size-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  font-family: var(--size-font-family, system-ui, -apple-system, sans-serif);
}

.login-split {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
  background-color: var(--color-bg-container);
}

.login-toolbar {
  position: fixed;
  top: var(--size-space-huge);
  right: var(--size-space-huge);
  z-index: 100;
  display: flex;
  gap: var(--size-space-medium);
}

/* 工具栏按钮样式 */
.login-toolbar :deep(button),
.login-toolbar :deep([class*="picker"]),
.login-toolbar :deep([class*="trigger"]) {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
  border-radius: 8px !important;
}

.login-toolbar :deep(button:hover),
.login-toolbar :deep([class*="picker"]:hover),
.login-toolbar :deep([class*="trigger"]:hover) {
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
}

/* 工具栏下拉弹窗样式 */
.login-toolbar :deep([class*="dropdown"]),
.login-toolbar :deep([class*="menu"]),
.login-toolbar :deep([class*="panel"]),
.login-toolbar :deep([class*="popover"]),
.login-toolbar :deep([class*="content"]) {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
  color: var(--color-text-primary) !important;
}

.login-toolbar :deep([class*="dropdown"] *),
.login-toolbar :deep([class*="menu"] *),
.login-toolbar :deep([class*="panel"] *),
.login-toolbar :deep([class*="popover"] *) {
  color: var(--color-text-primary) !important;
}

.login-toolbar :deep([class*="item"]:hover),
.login-toolbar :deep([class*="option"]:hover) {
  background: var(--color-primary-lighter) !important;
}

/* 左侧品牌区 */
.login-brand {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-600, #2563eb) 0%, var(--color-primary-800, #1e40af) 100%);
  overflow: hidden;
}

/* 背景装饰动画 */
.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 500px;
  height: 500px;
  top: -100px;
  right: -100px;
  background: var(--color-primary-400, #60a5fa);
}

.shape-2 {
  width: 400px;
  height: 400px;
  bottom: -80px;
  left: -80px;
  background: var(--color-primary-300, #93c5fd);
  animation-delay: -7s;
}

.shape-3 {
  width: 300px;
  height: 300px;
  top: 40%;
  left: 50%;
  background: var(--color-info-400, #38bdf8);
  animation-delay: -14s;
  opacity: 0.25;
}

/* 粒子效果 */
.particles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat 20s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translate(20px, -30px) scale(1.2);
    opacity: 1;
  }
  50% {
    transform: translate(-10px, 20px) scale(0.8);
    opacity: 0.4;
  }
  75% {
    transform: translate(30px, 10px) scale(1.1);
    opacity: 0.8;
  }
}

/* 光线射线 */
.light-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    rgba(255, 255, 255, 0.03) 10deg,
    transparent 20deg,
    transparent 45deg,
    rgba(255, 255, 255, 0.05) 55deg,
    transparent 65deg,
    transparent 90deg,
    rgba(255, 255, 255, 0.02) 100deg,
    transparent 110deg,
    transparent 135deg,
    rgba(255, 255, 255, 0.04) 145deg,
    transparent 155deg,
    transparent 180deg,
    rgba(255, 255, 255, 0.03) 190deg,
    transparent 200deg,
    transparent 225deg,
    rgba(255, 255, 255, 0.05) 235deg,
    transparent 245deg,
    transparent 270deg,
    rgba(255, 255, 255, 0.02) 280deg,
    transparent 290deg,
    transparent 315deg,
    rgba(255, 255, 255, 0.04) 325deg,
    transparent 335deg,
    transparent 360deg
  );
  animation: rotateRays 60s linear infinite;
  pointer-events: none;
}

@keyframes rotateRays {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 30px) scale(0.95);
  }
}

/* 品牌展示卡片 */
.brand-showcase {
  margin-top: var(--size-space-colossal);
}

.showcase-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.showcase-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background: #ff5f57; }
.dot.yellow { background: #febc2e; }
.dot.green { background: #28c840; }

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-line.w-75 { width: 75%; }
.skeleton-line.w-50 { width: 50%; }

.skeleton-row {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.skeleton-box {
  flex: 1;
  height: 60px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
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
  perspective: 500px;
}

.brand-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-image {
  width: 80px;
  height: 80px;
  border-radius: var(--size-radius-large);
  box-shadow: var(--shadow-lg);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-image:hover {
  transform: rotateY(15deg) rotateX(-10deg) scale(1.05);
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: logoPulse 3s ease-in-out infinite;
}

.logo-placeholder:hover {
  transform: rotateY(15deg) rotateX(-10deg) scale(1.1);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 255, 255, 0.2);
}

@keyframes logoPulse {
  0%, 100% {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 255, 255, 0.15);
  }
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

/* 右侧表单区 */
.login-form-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-space-massive);
  background: var(--color-bg-container);
}

.form-container {
  width: 100%;
  max-width: 420px;
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.2s;
}

.form-container.is-mounted {
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
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 28px;
  border: 1px solid var(--color-border);
}

.tab-btn {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  background: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.tab-btn:hover:not(.active) {
  color: var(--color-text-secondary);
  transform: scale(1.02);
}

.tab-btn:active {
  transform: scale(0.98);
}

.tab-btn.active {
  color: var(--color-primary-default);
}

/* 表单 */
.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-bg-container-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all 0.25s ease;
}

.input-wrapper:hover {
  border-color: var(--color-text-quaternary);
  background: var(--color-bg-container);
}

.input-wrapper:focus-within {
  border-color: var(--color-primary-default);
  box-shadow: 0 0 0 3px var(--color-primary-lighter);
  background: var(--color-bg-container);
}

.input-icon {
  position: absolute;
  left: 16px;
  color: var(--color-text-quaternary);
  pointer-events: none;
  transition: color 0.25s ease;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-wrapper:focus-within .input-icon {
  color: var(--color-primary-default);
}

.form-input {
  width: 100%;
  height: 52px;
  padding: 0 16px 0 48px;
  font-size: 15px;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  border-radius: 12px;
  outline: none;
}

.form-input::placeholder {
  color: var(--color-text-placeholder);
}

/* 浏览器自动填充样式 */
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus,
.form-input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px var(--color-bg-container-secondary) inset !important;
  -webkit-text-fill-color: var(--color-text-primary) !important;
  background-color: var(--color-bg-container-secondary) !important;
  caret-color: var(--color-text-primary);
  transition: background-color 5000s ease-in-out 0s;
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
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sms-btn:hover:not(:disabled) {
  background: var(--color-primary-light);
  transform: scale(1.05);
}

.sms-btn:active:not(:disabled) {
  transform: scale(0.95);
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

/* 表单底部选项 */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--size-font-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
  flex-shrink: 0;
  background: var(--color-bg-container);
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--color-primary-default);
  border-color: var(--color-primary-default);
}

.checkbox-input:checked + .checkbox-custom::after {
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

.link-btn {
  font-size: var(--size-font-medium);
  color: var(--color-primary-default);
  text-decoration: none;
  transition: color 0.2s;
}

.link-btn:hover {
  color: var(--color-primary-hover);
}

/* 提交按钮 */
.submit-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 52px;
  margin-top: 28px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary-default) 0%, var(--color-primary-hover) 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
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
  background: linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary-active) 100%);
  box-shadow: 0 6px 24px rgba(37, 99, 235, 0.45);
  transform: translateY(-2px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
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
  gap: 16px;
  margin: 28px 0 20px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.divider span {
  font-size: 13px;
  color: var(--color-text-quaternary);
}

/* 社交登录 */
.social-login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-bg-container-secondary);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-secondary);
}

.social-icon:hover {
  border-color: var(--color-text-quaternary);
  color: var(--color-text-primary);
  background: var(--color-bg-container);
}

.social-icon:active {
  transform: scale(0.95);
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  font-size: var(--size-font-medium);
  color: var(--color-text-tertiary);
}

.register-link a {
  color: var(--color-primary-default);
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.register-link a:hover {
  color: var(--color-primary-hover);
}

/* 表单切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Tab 指示器 */
.tab-ink {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: var(--color-bg-container);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 验证码样式 */
.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.captcha-wrapper .form-input {
  flex: 1;
  padding-right: 16px;
}

.captcha-img {
  flex-shrink: 0;
  cursor: pointer;
}

.captcha-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  height: 52px;
  padding: 0 20px;
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 4px;
  color: var(--color-primary-default);
  background: linear-gradient(135deg, var(--color-primary-lighter) 0%, var(--color-primary-light) 100%);
  border-radius: 12px;
  user-select: none;
  transition: all 0.25s ease;
}

.captcha-text:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

/* 响应式 */
@media (max-width: 1024px) {
  .login-brand {
    display: none;
  }
}

/* 深色模式支持 */
:root[data-theme-mode="dark"] .login-split,
.dark .login-split {
  --color-bg-container: #0f172a;
  --color-bg-container-secondary: #1e293b;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #94a3b8;
  --color-border: #334155;
}

:root[data-theme-mode="dark"] .login-brand,
.dark .login-brand {
  background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1a1a2e 100%);
}

:root[data-theme-mode="dark"] .login-form-area,
.dark .login-form-area {
  background: var(--color-bg-container);
  position: relative;
}

:root[data-theme-mode="dark"] .login-form-area::before,
.dark .login-form-area::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

:root[data-theme-mode="dark"] .form-container,
.dark .form-container {
  background: transparent;
}

:root[data-theme-mode="dark"] .form-input:focus,
.dark .form-input:focus {
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2), 0 0 30px rgba(37, 99, 235, 0.1);
}

:root[data-theme-mode="dark"] .tab-ink,
.dark .tab-ink {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2);
}

:root[data-theme-mode="dark"] .social-icon:hover,
.dark .social-icon:hover {
  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.4);
}
</style>
