<script setup lang="ts">
import { reactive, ref } from 'vue'

interface SocialProvider { name: string; label: string; icon?: string }

interface Props {
  title?: string
  subtitle?: string
  showLogo?: boolean
  showRememberMe?: boolean
  showSocialLogin?: boolean
  socialProviders?: Array<{
    name: string
    label: string
    icon?: string
  }>
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  title: '欢迎登录',
  subtitle: '请输入您的账号信息',
  showLogo: true,
  showRememberMe: true,
  showSocialLogin: false,
  socialProviders: () => [],
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [data: { username: string; password: string; rememberMe?: boolean }]
  register: []
  forgot: []
  socialLogin: [provider: SocialProvider]
}>()

const form = reactive({
  username: '',
  password: '',
  rememberMe: false,
})

const loading = ref(props.loading)
const error = ref(props.error)

const handleSubmit = () => {
  emit('submit', { ...form })
}

const handleRegister = () => {
  emit('register')
}

const handleForgot = () => {
  emit('forgot')
}

const handleSocialLogin = (provider: SocialProvider) => {
  emit('socialLogin', provider)
}
</script>

<template>
  <div class="login-tablet-default">
    <div class="container">
      <!-- Logo 插槽 -->
      <div v-if="$slots.logo || showLogo" class="logo-section">
        <slot name="logo">
          <div class="default-logo">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="#667eea">
              <circle cx="32" cy="32" r="28" opacity="0.1" />
              <path d="M32 16 L42 32 L32 48 L22 32 Z" fill="#667eea" />
            </svg>
          </div>
        </slot>
      </div>

      <!-- 头部插槽 -->
      <div class="header-section">
        <slot name="header" :title="title" :subtitle="subtitle">
          <h1>{{ title }}</h1>
          <p class="subtitle">
            {{ subtitle }}
          </p>
        </slot>
      </div>

      <!-- 登录面板插槽 -->
      <slot name="loginPanel" :form="form" :loading="loading" :error="error" :handle-submit="handleSubmit">
        <form class="login-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">用户名</label>
            <input id="username" v-model="form.username" type="text" placeholder="请输入用户名或邮箱" required>
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input id="password" v-model="form.password" type="password" placeholder="请输入密码" required>
          </div>

          <div v-if="showRememberMe" class="form-options">
            <label class="remember-me">
              <input v-model="form.rememberMe" type="checkbox">
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-link" @click.prevent="handleForgot">忘记密码？</a>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
      </slot>

      <!-- 社交登录插槽 -->
      <div v-if="$slots.socialLogin || showSocialLogin" class="social-section">
        <slot name="socialLogin" :providers="socialProviders">
          <div class="social-divider">
            <span>或使用以下方式登录</span>
          </div>
          <div class="social-buttons">
            <button v-for="provider in socialProviders" :key="provider.name" class="social-btn"
              @click="handleSocialLogin(provider)">
              {{ provider.label }}
            </button>
          </div>
        </slot>
      </div>

      <!-- 底部插槽 -->
      <div class="footer-section">
        <slot name="footer">
          <p class="footer-text">
            还没有账号？ <a href="#" @click.prevent="handleRegister">立即注册</a>
          </p>
        </slot>
      </div>

      <!-- 额外内容插槽 -->
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.login-tablet-default {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
      var(--template-login-bg-gradient-start) 0%,
      var(--template-login-bg-gradient-end) 100%);
  padding: var(--template-tablet-padding);
}

.container {
  width: 100%;
  max-width: 500px;
  padding: var(--template-spacing-4xl);
  background: var(--template-login-card-bg);
  border-radius: var(--template-radius-2xl);
  box-shadow: var(--template-shadow-xl);
}

/* Logo */
.logo-section {
  text-align: center;
  margin-bottom: var(--template-spacing-3xl);
}

.default-logo {
  display: inline-block;
}

/* 头部 */
.header-section {
  text-align: center;
  margin-bottom: var(--template-spacing-3xl);
}

.header-section h1 {
  margin: 0 0 var(--template-spacing-md);
  font-size: var(--template-font-3xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
}

.subtitle {
  margin: 0;
  font-size: var(--template-font-md);
  color: var(--template-text-secondary);
}

/* 表单 */
.login-form {
  margin-bottom: var(--template-spacing-2xl);
}

.form-group {
  margin-bottom: var(--template-spacing-xl);
}

.form-group label {
  display: block;
  margin-bottom: var(--template-spacing-md);
  font-size: var(--template-font-base);
  font-weight: var(--template-font-weight-medium);
  color: var(--template-text-primary);
}

.form-group input {
  width: 100%;
  padding: var(--template-spacing-lg) var(--template-spacing-xl);
  border: var(--template-border-width-thin) solid var(--template-border-input);
  border-radius: var(--template-radius-lg);
  font-size: var(--template-font-md);
  transition: var(--template-transition-all);
  box-sizing: border-box;
  color: var(--template-text-primary);
  background: var(--template-bg-container);
}

.form-group input::placeholder {
  color: var(--template-text-placeholder);
}

.form-group input:focus {
  outline: none;
  border-color: var(--template-border-input-focus);
  box-shadow: 0 0 0 3px var(--template-primary-lighter);
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--template-spacing-2xl);
  font-size: var(--template-font-base);
}

.remember-me {
  display: flex;
  align-items: center;
  gap: var(--template-spacing-md);
  cursor: pointer;
  color: var(--template-text-secondary);
}

.remember-me input[type="checkbox"] {
  cursor: pointer;
}

.forgot-link {
  color: var(--template-text-link);
  text-decoration: none;
  transition: var(--template-transition-color);
}

.forgot-link:hover {
  color: var(--template-text-link-hover);
  text-decoration: underline;
}

/* 按钮 */
.btn-submit {
  width: 100%;
  padding: var(--template-spacing-xl);
  background: linear-gradient(135deg,
      var(--template-login-bg-gradient-start) 0%,
      var(--template-login-bg-gradient-end) 100%);
  color: var(--template-text-inverse);
  border: none;
  border-radius: var(--template-radius-lg);
  font-size: var(--template-font-lg);
  font-weight: var(--template-font-weight-medium);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--template-primary-lighter);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 社交登录 */
.social-section {
  margin: var(--template-spacing-3xl) 0;
}

.social-divider {
  text-align: center;
  margin: var(--template-spacing-2xl) 0;
  position: relative;
}

.social-divider span {
  background: var(--template-bg-container);
  padding: 0 var(--template-spacing-xl);
  color: var(--template-text-tertiary);
  font-size: var(--template-font-base);
  position: relative;
  z-index: 1;
}

.social-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: var(--template-border-width-thin);
  background: var(--template-border-light);
}

.social-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--template-spacing-lg);
}

.social-btn {
  padding: var(--template-spacing-lg);
  background: var(--template-bg-container);
  border: var(--template-border-width-thin) solid var(--template-border);
  border-radius: var(--template-radius-lg);
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.social-btn:hover {
  border-color: var(--template-primary);
  color: var(--template-primary);
  background: var(--template-primary-lighter);
}

/* 底部 */
.footer-section {
  text-align: center;
  margin-top: var(--template-spacing-2xl);
}

.footer-text {
  margin: 0;
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
}

.footer-text a {
  color: var(--template-text-link);
  text-decoration: none;
  font-weight: var(--template-font-weight-medium);
  transition: var(--template-transition-color);
}

.footer-text a:hover {
  color: var(--template-text-link-hover);
  text-decoration: underline;
}
</style>
