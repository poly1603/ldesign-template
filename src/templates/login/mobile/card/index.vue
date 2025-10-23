<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'

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
  subtitle: '',
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

// 获取模板选择器
const selector = useTemplateSelector()
</script>

<template>
  <div class="login-mobile-card">
    <!-- 模板选择器 - 放在右上角 -->
    <div v-if="selector && selector.enabled" class="template-selector-wrapper">
      <TemplateSelector v-bind="selector.props.value" @select="selector.onSelect" />
    </div>

    <div class="card-container">
      <!-- Logo 插槽 -->
      <div v-if="$slots.logo || showLogo" class="logo-section">
        <slot name="logo">
          <div class="default-logo">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="#667eea">
              <circle cx="28" cy="28" r="24" opacity="0.1" />
              <path d="M28 14 L38 28 L28 42 L18 28 Z" fill="#667eea" />
            </svg>
          </div>
        </slot>
      </div>

      <!-- 头部插槽 -->
      <div class="card-header">
        <slot name="header" :title="title" :subtitle="subtitle">
          <h1>{{ title }}</h1>
          <p v-if="subtitle" class="subtitle">
            {{ subtitle }}
          </p>
        </slot>
      </div>

      <!-- 登录面板插槽 -->
      <slot name="loginPanel" :form="form" :loading="loading" :error="error" :handle-submit="handleSubmit">
        <form class="login-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <div class="input-wrapper">
              <input v-model="form.username" type="text" placeholder="手机号/用户名/邮箱" required>
            </div>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <input v-model="form.password" type="password" placeholder="密码" required>
            </div>
          </div>

          <div v-if="showRememberMe" class="form-options">
            <label class="remember-me">
              <input v-model="form.rememberMe" type="checkbox">
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-link" @click.prevent="handleForgot">忘记密码？</a>
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
      </slot>

      <!-- 社交登录插槽 -->
      <div v-if="$slots.socialLogin || showSocialLogin" class="social-section">
        <slot name="socialLogin" :providers="socialProviders">
          <div class="social-divider">
            <span>其他方式</span>
          </div>
          <div class="social-buttons">
            <button v-for="provider in socialProviders" :key="provider.name" class="social-btn"
              @click="handleSocialLogin(provider)">
              <span>{{ provider.label }}</span>
            </button>
          </div>
        </slot>
      </div>

      <!-- 底部插槽 -->
      <div class="card-footer">
        <slot name="footer">
          <a href="#" @click.prevent="handleRegister">注册账号</a>
          <span class="divider">|</span>
          <a href="#" @click.prevent="handleForgot">忘记密码</a>
        </slot>
      </div>

      <!-- 额外内容插槽 -->
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.login-mobile-card {
  position: relative;
  min-height: 100vh;
  padding: var(--template-spacing-xl);
  background: linear-gradient(135deg,
      var(--template-login-bg-gradient-start) 0%,
      var(--template-login-bg-gradient-end) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-selector-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
}

.card-container {
  width: 100%;
  max-width: 380px;
  padding: var(--template-spacing-3xl) var(--template-spacing-2xl);
  background: var(--template-login-card-bg);
  border-radius: var(--template-radius-2xl);
  box-shadow: var(--template-shadow-xl);
}

/* Logo */
.logo-section {
  text-align: center;
  margin-bottom: var(--template-spacing-2xl);
}

.default-logo {
  display: inline-block;
}

/* 头部 */
.card-header {
  text-align: center;
  margin-bottom: var(--template-spacing-3xl);
}

.card-header h1 {
  margin: 0 0 var(--template-spacing-md);
  font-size: var(--template-font-h2);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
}

.subtitle {
  margin: 0;
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
}

/* 表单 */
.login-form {
  margin-bottom: var(--template-spacing-2xl);
}

.form-group {
  margin-bottom: var(--template-spacing-xl);
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: var(--template-spacing-lg) var(--template-spacing-xl);
  font-size: var(--template-font-md);
  border: var(--template-border-width-thin) solid var(--template-border-input);
  border-radius: var(--template-radius-md);
  background: var(--template-bg-component);
  transition: var(--template-transition-all);
  box-sizing: border-box;
  color: var(--template-text-primary);
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--template-border-input-focus);
  background: var(--template-bg-container);
  box-shadow: 0 0 0 3px var(--template-primary-lighter);
}

.input-wrapper input::placeholder {
  color: var(--template-text-placeholder);
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--template-spacing-xl);
  font-size: var(--template-font-sm);
}

.remember-me {
  display: flex;
  align-items: center;
  gap: var(--template-spacing-sm);
  color: var(--template-text-secondary);
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  cursor: pointer;
}

.forgot-link {
  color: var(--template-text-link);
  text-decoration: none;
  font-size: var(--template-font-sm);
  transition: var(--template-transition-color);
}

.forgot-link:active {
  opacity: 0.8;
}

/* 登录按钮 */
.btn-login {
  width: 100%;
  padding: var(--template-spacing-lg);
  font-size: var(--template-font-md);
  font-weight: var(--template-font-weight-medium);
  color: var(--template-text-inverse);
  background: linear-gradient(135deg,
      var(--template-login-bg-gradient-start) 0%,
      var(--template-login-bg-gradient-end) 100%);
  border: none;
  border-radius: var(--template-radius-md);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.btn-login:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 社交登录 */
.social-section {
  margin: var(--template-spacing-2xl) 0;
}

.social-divider {
  text-align: center;
  margin: var(--template-spacing-xl) 0;
  position: relative;
}

.social-divider span {
  background: var(--template-bg-container);
  padding: 0 var(--template-spacing-lg);
  color: var(--template-text-tertiary);
  font-size: var(--template-font-sm);
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
  display: flex;
  gap: var(--template-spacing-md);
}

.social-btn {
  flex: 1;
  padding: var(--template-spacing-md);
  background: var(--template-bg-component);
  border: var(--template-border-width-thin) solid var(--template-border);
  border-radius: var(--template-radius-lg);
  font-size: var(--template-font-sm);
  color: var(--template-text-secondary);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.social-btn:active {
  background: var(--template-bg-component-hover);
  transform: scale(0.98);
}

/* 底部 */
.card-footer {
  text-align: center;
  padding-top: var(--template-spacing-xl);
  font-size: var(--template-font-sm);
}

.card-footer a {
  color: var(--template-text-link);
  text-decoration: none;
  transition: var(--template-transition-color);
}

.card-footer a:active {
  opacity: 0.8;
}

.divider {
  margin: 0 var(--template-spacing-md);
  color: var(--template-border-light);
}
</style>
