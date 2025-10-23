<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'

interface SocialProvider { name: string; label: string; icon?: string }

interface Props {
  title?: string
  subtitle?: string
  brandName?: string
  slogan?: string
  bgImage?: string
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
  title: '欢迎回来',
  subtitle: '请输入您的账号信息',
  brandName: 'LDesign',
  slogan: '专业的模板管理系统',
  bgImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
  showLogo: false,
  showSocialLogin: false,
  socialProviders: () => [],
  loading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [data: { username: string; password: string; remember: boolean }]
  register: []
  forgot: []
  socialLogin: [provider: SocialProvider]
}>()

const form = reactive({
  username: '',
  password: '',
  remember: false,
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
  <div class="login-desktop-split">
    <!-- 模板选择器 - 放在左上角 -->
    <div v-if="selector && selector.enabled" class="template-selector-wrapper">
      <TemplateSelector v-bind="selector.props.value" @select="selector.onSelect" />
    </div>

    <!-- 左侧面板 -->
    <div class="left-panel" :style="{ backgroundImage: `url(${bgImage})` }">
      <slot name="leftPanel" :brand="brandName" :slogan="slogan">
        <div class="overlay">
          <slot name="brand">
            <h1 class="brand">
              {{ brandName }}
            </h1>
            <p class="slogan">
              {{ slogan }}
            </p>
          </slot>

          <!-- 左侧额外内容 -->
          <slot name="leftExtra" />
        </div>
      </slot>
    </div>

    <!-- 右侧登录区域 -->
    <div class="right-panel">
      <div class="login-box">
        <!-- Logo 插槽 -->
        <div v-if="$slots.logo || showLogo" class="logo-area">
          <slot name="logo">
            <div class="default-logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                <circle cx="20" cy="20" r="18" opacity="0.1" />
                <path d="M20 10 L28 20 L20 30 L12 20 Z" fill="currentColor" />
              </svg>
            </div>
          </slot>
        </div>

        <!-- 标题区域 -->
        <slot name="header" :title="title" :subtitle="subtitle">
          <h2>{{ title }}</h2>
          <p class="subtitle">
            {{ subtitle }}
          </p>
        </slot>

        <!-- 登录面板插槽 -->
        <slot name="loginPanel" :form="form" :loading="loading" :error="error" :handle-submit="handleSubmit">
          <form class="login-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <input v-model="form.username" type="text" placeholder="用户名或邮箱" required>
            </div>

            <div class="form-group">
              <input v-model="form.password" type="password" placeholder="密码" required>
            </div>

            <div class="form-options">
              <label class="checkbox">
                <input v-model="form.remember" type="checkbox">
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
            <div class="divider">
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
        <div class="footer-text">
          <slot name="footer">
            还没有账号？
            <a href="#" @click.prevent="handleRegister">立即注册</a>
          </slot>
        </div>

        <!-- 额外内容 -->
        <slot name="extra" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-desktop-split {
  position: relative;
  display: flex;
  height: 100vh;
}

.template-selector-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.left-panel {
  flex: 1;
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
      var(--template-login-bg-gradient-start) 0%,
      var(--template-login-bg-gradient-end) 100%);
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--template-text-inverse);
  padding: var(--template-spacing-4xl);
}

.brand {
  font-size: var(--template-font-3xl);
  font-weight: var(--template-font-weight-bold);
  margin: 0 0 var(--template-spacing-xl);
}

.slogan {
  font-size: var(--template-font-xl);
  margin: 0;
  opacity: 0.9;
}

.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--template-bg-container);
  padding: var(--template-spacing-4xl);
}

.login-box {
  width: 100%;
  max-width: 400px;
}

.login-box h2 {
  margin: 0 0 var(--template-spacing-md);
  font-size: var(--template-font-3xl);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-primary);
}

.subtitle {
  margin: 0 0 var(--template-spacing-3xl);
  font-size: var(--template-font-base);
  color: var(--template-text-secondary);
}

.login-form {
  margin-bottom: var(--template-spacing-2xl);
}

.form-group {
  margin-bottom: var(--template-spacing-xl);
}

.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  padding: var(--template-spacing-lg);
  font-size: var(--template-font-base);
  border: var(--template-border-width-thin) solid var(--template-border-input);
  border-radius: var(--template-radius-lg);
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

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--template-spacing-2xl);
  font-size: var(--template-font-base);
}

.checkbox {
  display: flex;
  align-items: center;
  gap: var(--template-spacing-md);
  cursor: pointer;
  color: var(--template-text-secondary);
}

.checkbox input {
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

.btn-submit {
  width: 100%;
  padding: var(--template-spacing-lg);
  font-size: var(--template-font-md);
  font-weight: var(--template-font-weight-medium);
  color: var(--template-text-inverse);
  background: linear-gradient(135deg,
      var(--template-login-bg-gradient-start) 0%,
      var(--template-login-bg-gradient-end) 100%);
  border: none;
  border-radius: var(--template-radius-lg);
  cursor: pointer;
  transition: var(--template-transition-transform);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.footer-text {
  text-align: center;
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

/* Logo 区域 */
.logo-area {
  text-align: center;
  margin-bottom: var(--template-spacing-2xl);
}

.default-logo {
  display: inline-block;
  color: var(--template-primary);
}

/* 社交登录 */
.social-section {
  margin: var(--template-spacing-2xl) 0;
}

.divider {
  position: relative;
  text-align: center;
  margin: var(--template-spacing-2xl) 0;
}

.divider span {
  background: var(--template-bg-container);
  padding: 0 var(--template-spacing-xl);
  color: var(--template-text-tertiary);
  font-size: var(--template-font-sm);
  position: relative;
  z-index: 1;
}

.divider::before {
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
}

.social-btn {
  flex: 1;
  padding: var(--template-spacing-md) var(--template-spacing-lg);
  border: var(--template-border-width-thin) solid var(--template-border);
  background: var(--template-bg-container);
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

/* 加载状态 */
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--template-bg-component-disabled);
}
</style>
