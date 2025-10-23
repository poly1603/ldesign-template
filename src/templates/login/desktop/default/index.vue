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
  subtitle: 'LDesign 模板系统',
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
  forgotPassword: []
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

const handleForgotPassword = () => {
  emit('forgotPassword')
}

const handleSocialLogin = (provider: SocialProvider) => {
  emit('socialLogin', provider)
}

// 获取模板选择器
const selector = useTemplateSelector()
</script>

<template>
  <div class="login-desktop-default">
    <!-- 模板选择器 - 放在左上角 -->
    <div v-if="selector && selector.enabled" class="template-selector-wrapper">
      <TemplateSelector v-bind="selector.props.value" @select="selector.onSelect" />
    </div>

    <div class="login-container">
      <!-- Logo 插槽 -->
      <div v-if="$slots.logo || showLogo" class="login-logo">
        <slot name="logo">
          <div class="default-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
              <circle cx="24" cy="24" r="20" opacity="0.1" />
              <path d="M24 12 L32 24 L24 36 L16 24 Z" fill="currentColor" />
            </svg>
          </div>
        </slot>
      </div>

      <!-- 头部插槽 -->
      <div class="login-header">
        <slot name="header" :title="title" :subtitle="subtitle">
          <h1>{{ title }}</h1>
          <p class="subtitle">
            {{ subtitle }}
          </p>
        </slot>
      </div>

      <!-- 登录面板插槽 - 核心插槽 -->
      <slot name="loginPanel" :form="form" :loading="loading" :error="error" :handle-submit="handleSubmit">
        <!-- 默认表单 -->
        <form class="login-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">用户名</label>
            <input id="username" v-model="form.username" type="text" placeholder="请输入用户名" required>
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input id="password" v-model="form.password" type="password" placeholder="请输入密码" required>
          </div>

          <div v-if="showRememberMe" class="form-group">
            <label class="checkbox-label">
              <input v-model="form.rememberMe" type="checkbox">
              <span>记住我</span>
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>
        </form>
      </slot>

      <!-- 社交登录插槽 -->
      <div v-if="$slots.socialLogin || showSocialLogin" class="social-section">
        <slot name="socialLogin">
          <div class="social-divider">
            <span>或</span>
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
      <div class="login-footer">
        <slot name="footer">
          <p>还没有账号？ <a href="#" @click.prevent="handleRegister">立即注册</a></p>
          <p><a href="#" @click.prevent="handleForgotPassword">忘记密码？</a></p>
        </slot>
      </div>

      <!-- 额外内容插槽 -->
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.login-desktop-default {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg,
      var(--template-bg-page) 0%,
      var(--template-bg-container-tertiary) 100%);
}

.template-selector-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.login-container {
  width: 100%;
  max-width: 450px;
  padding: var(--template-login-card-padding);
  background: var(--template-login-card-bg);
  border-radius: var(--template-login-card-radius);
  box-shadow: var(--template-login-card-shadow);
}

.login-header {
  text-align: center;
  margin-bottom: var(--template-spacing-2xl);
}

.login-header h1 {
  margin: 0;
  font-size: var(--template-font-xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
}

.subtitle {
  margin: 0;
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
}

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
  padding: var(--template-login-input-padding);
  font-size: var(--template-font-base);
  border: var(--template-border-width-thin) solid var(--template-border-input);
  border-radius: var(--template-form-input-radius);
  transition: var(--template-transition-border);
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
}

.form-actions {
  margin-top: var(--template-spacing-2xl);
}

.btn-primary {
  width: 100%;
  padding: var(--template-login-button-padding);
  height: var(--template-login-button-height);
  font-size: var(--template-font-md);
  font-weight: var(--template-font-weight-medium);
  color: var(--template-text-inverse);
  background: var(--template-primary);
  border: none;
  border-radius: var(--template-form-input-radius);
  cursor: pointer;
  transition: var(--template-transition-bg);
}

.btn-primary:hover:not(:disabled) {
  background: var(--template-primary-hover);
}

.btn-primary:active:not(:disabled) {
  background: var(--template-primary-active);
}

.login-footer {
  text-align: center;
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
  margin-top: var(--template-spacing-xl);
}

.login-footer a {
  color: var(--template-text-link);
  text-decoration: none;
  transition: var(--template-transition-color);
}

.login-footer a:hover {
  color: var(--template-text-link-hover);
  text-decoration: underline;
}

/* Logo 样式 */
.login-logo {
  text-align: center;
}

.default-logo {
  display: inline-flex;
  align-items: center;
  color: var(--template-primary);
}

/* 复选框样式 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--template-spacing-md);
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
}

/* 社交登录样式 */
.social-section {
  margin-top: var(--template-spacing-2xl);
}

.social-divider {
  position: relative;
  text-align: center;
  margin: var(--template-spacing-xl) 0;
}

.social-divider span {
  background: var(--template-bg-container);
  padding: 0 var(--template-spacing-xl);
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
  gap: var(--template-spacing-lg);
  margin-top: var(--template-spacing-xl);
}

.social-btn {
  flex: 1;
  padding: var(--template-spacing-md) var(--template-spacing-lg);
  border: var(--template-border-width-thin) solid var(--template-border);
  background: var(--template-bg-container);
  border-radius: var(--template-form-input-radius);
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

/* 加载状态 */
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
