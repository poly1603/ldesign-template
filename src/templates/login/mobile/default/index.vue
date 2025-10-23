<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'

interface SocialProvider { name: string; label: string; icon?: string }

interface Props {
  title?: string
  subtitle?: string
  showLogo?: boolean
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
  title: '登录',
  subtitle: '',
  showLogo: true,
  showSocialLogin: false,
  socialProviders: () => [],
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [data: { username: string; password: string }]
  register: []
  forgot: []
  socialLogin: [provider: SocialProvider]
}>()

const form = reactive({
  username: '',
  password: '',
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
  <div class="login-mobile-default">
    <!-- 模板选择器 - 放在右上角 -->
    <div v-if="selector && selector.enabled" class="template-selector-wrapper">
      <TemplateSelector v-bind="selector.props.value" @select="selector.onSelect" />
    </div>

    <!-- Logo 插槽 -->
    <div v-if="$slots.logo || showLogo" class="logo-section">
      <slot name="logo">
        <div class="default-logo">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="white">
            <circle cx="30" cy="30" r="25" opacity="0.2" />
            <path d="M30 15 L40 30 L30 45 L20 30 Z" fill="white" />
          </svg>
        </div>
      </slot>
    </div>

    <!-- 头部插槽 -->
    <div class="login-header">
      <slot name="header" :title="title">
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
          <input v-model="form.username" type="text" placeholder="手机号/用户名" required>
        </div>

        <div class="form-group">
          <input v-model="form.password" type="password" placeholder="密码" required>
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
          <span>其他登录方式</span>
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
        <a href="#" @click.prevent="handleRegister">注册账号</a>
        <span class="divider">|</span>
        <a href="#" @click.prevent="handleForgot">忘记密码</a>
      </slot>
    </div>

    <!-- 额外内容插槽 -->
    <slot name="extra" />
  </div>
</template>

<style scoped>
.login-mobile-default {
  position: relative;
  min-height: 100vh;
  padding: var(--template-spacing-4xl) var(--template-spacing-xl);
  background: linear-gradient(135deg,
      var(--template-login-bg-gradient-start) 0%,
      var(--template-login-bg-gradient-end) 100%);
}

.template-selector-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
}

.login-header {
  text-align: center;
  margin-bottom: var(--template-spacing-4xl);
  padding-top: var(--template-spacing-4xl);
}

.login-header h1 {
  margin: 0;
  font-size: var(--template-font-3xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-inverse);
}

.login-form {
  margin-bottom: var(--template-spacing-3xl);
}

.form-group {
  margin-bottom: var(--template-spacing-xl);
}

.form-group input {
  width: 100%;
  padding: var(--template-spacing-xl);
  font-size: var(--template-font-md);
  color: var(--template-text-primary);
  background: var(--template-bg-container);
  border: none;
  border-radius: var(--template-radius-lg);
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: var(--template-text-placeholder);
}

.btn-login {
  width: 100%;
  padding: var(--template-spacing-xl);
  margin-top: var(--template-spacing-2xl);
  font-size: var(--template-font-lg);
  font-weight: var(--template-font-weight-medium);
  color: var(--template-primary);
  background: var(--template-bg-container);
  border: none;
  border-radius: var(--template-radius-lg);
  cursor: pointer;
  transition: var(--template-transition-transform);
}

.btn-login:active:not(:disabled) {
  transform: scale(0.98);
}

.login-footer {
  text-align: center;
  font-size: var(--template-font-base);
  color: var(--template-text-inverse);
}

.login-footer a {
  color: var(--template-text-inverse);
  text-decoration: none;
}

.divider {
  margin: 0 var(--template-spacing-lg);
}

/* Logo 样式 */
.logo-section {
  text-align: center;
  margin-bottom: var(--template-spacing-3xl);
  padding-top: var(--template-spacing-4xl);
}

.default-logo {
  display: inline-block;
}

/* 副标题 */
.subtitle {
  margin: var(--template-spacing-md) 0 0;
  font-size: var(--template-font-base);
  color: var(--template-text-inverse-secondary);
}

/* 社交登录 */
.social-section {
  margin: var(--template-spacing-3xl) 0;
}

.social-divider {
  text-align: center;
  margin: var(--template-spacing-xl) 0;
  position: relative;
}

.social-divider span {
  background: transparent;
  padding: 0 var(--template-spacing-xl);
  color: var(--template-text-inverse);
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
  background: var(--template-text-inverse-secondary);
}

.social-buttons {
  display: flex;
  gap: var(--template-spacing-md);
}

.social-btn {
  flex: 1;
  padding: var(--template-spacing-lg);
  background: rgba(255, 255, 255, 0.2);
  border: var(--template-border-width-thin) solid rgba(255, 255, 255, 0.3);
  color: var(--template-text-inverse);
  border-radius: var(--template-radius-lg);
  font-size: var(--template-font-base);
  cursor: pointer;
  transition: var(--template-transition-bg);
}

.social-btn:active {
  background: rgba(255, 255, 255, 0.3);
}

/* 加载状态 */
.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
