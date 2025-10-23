<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTemplateSelector } from '../../../../composables/useTemplateSelector'
import TemplateSelector from '../../../../components/TemplateSelector.vue'

interface SocialProvider { name: string; label: string; icon?: string }

interface Props {
  title?: string
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
  showLogo: false,
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
  <div class="login-tablet-simple">
    <!-- 模板选择器 - 放在右上角 -->
    <div v-if="selector && selector.enabled" class="template-selector-wrapper">
      <TemplateSelector v-bind="selector.props.value" @select="selector.onSelect" />
    </div>

    <div class="simple-container">
      <!-- Logo 插槽（简单版本） -->
      <div v-if="$slots.logo || showLogo" class="logo-area">
        <slot name="logo">
          <div class="simple-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="#667eea">
              <rect x="8" y="8" width="32" height="32" rx="8" opacity="0.1" />
              <rect x="16" y="16" width="16" height="16" rx="4" fill="#667eea" />
            </svg>
          </div>
        </slot>
      </div>

      <!-- 头部插槽（简化版） -->
      <slot name="header" :title="title">
        <h1 class="simple-title">
          {{ title }}
        </h1>
      </slot>

      <!-- 登录面板插槽（最简化） -->
      <slot name="loginPanel" :form="form" :loading="loading" :error="error" :handle-submit="handleSubmit">
        <form class="simple-form" @submit.prevent="handleSubmit">
          <input v-model="form.username" type="text" placeholder="用户名" class="simple-input" required>
          <input v-model="form.password" type="password" placeholder="密码" class="simple-input" required>
          <button type="submit" class="simple-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
      </slot>

      <!-- 社交登录插槽（简化版） -->
      <div v-if="$slots.socialLogin || showSocialLogin" class="simple-social">
        <slot name="socialLogin" :providers="socialProviders">
          <div class="social-row">
            <button v-for="provider in socialProviders" :key="provider.name" class="social-icon-btn"
              :title="provider.label" @click="handleSocialLogin(provider)">
              {{ provider.label[0] }}
            </button>
          </div>
        </slot>
      </div>

      <!-- 底部插槽（简单链接） -->
      <div class="simple-footer">
        <slot name="footer">
          <a href="#" @click.prevent="handleForgot">忘记密码</a>
          <span class="separator">·</span>
          <a href="#" @click.prevent="handleRegister">注册</a>
        </slot>
      </div>

      <!-- 额外内容插槽 -->
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.login-tablet-simple {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--template-bg-page);
  padding: var(--template-tablet-padding);
}

.template-selector-wrapper {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.simple-container {
  width: 100%;
  max-width: 420px;
  padding: var(--template-spacing-4xl) var(--template-spacing-3xl);
  background: var(--template-bg-container);
  border-radius: var(--template-radius-xl);
  box-shadow: var(--template-shadow-md);
}

/* Logo */
.logo-area {
  text-align: center;
  margin-bottom: var(--template-spacing-2xl);
}

.simple-logo {
  display: inline-block;
}

/* 标题 */
.simple-title {
  margin: 0 0 var(--template-spacing-3xl);
  font-size: var(--template-font-2xl);
  font-weight: var(--template-font-weight-medium);
  text-align: center;
  color: var(--template-text-primary);
}

/* 表单 */
.simple-form {
  display: flex;
  flex-direction: column;
  gap: var(--template-spacing-xl);
}

.simple-input {
  width: 100%;
  padding: var(--template-spacing-lg) var(--template-spacing-xl);
  border: var(--template-border-width-medium) solid var(--template-bg-component);
  border-radius: var(--template-radius-lg);
  font-size: var(--template-font-md);
  transition: var(--template-transition-all);
  box-sizing: border-box;
  background: var(--template-bg-component);
  color: var(--template-text-primary);
}

.simple-input:focus {
  outline: none;
  border-color: var(--template-border-input-focus);
  background: var(--template-bg-container);
}

.simple-input::placeholder {
  color: var(--template-text-placeholder);
}

.simple-btn {
  width: 100%;
  padding: var(--template-spacing-lg);
  background: var(--template-primary);
  color: var(--template-text-inverse);
  border: none;
  border-radius: var(--template-radius-lg);
  font-size: var(--template-font-md);
  font-weight: var(--template-font-weight-medium);
  cursor: pointer;
  transition: var(--template-transition-all);
  margin-top: var(--template-spacing-md);
}

.simple-btn:hover:not(:disabled) {
  background: var(--template-primary-hover);
  transform: translateY(-1px);
}

.simple-btn:active:not(:disabled) {
  transform: translateY(0);
}

.simple-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 社交登录 */
.simple-social {
  margin: var(--template-spacing-2xl) 0;
}

.social-row {
  display: flex;
  justify-content: center;
  gap: var(--template-spacing-lg);
}

.social-icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--template-bg-component);
  border: var(--template-border-width-thin) solid var(--template-border);
  border-radius: var(--template-radius-circle);
  font-size: var(--template-font-md);
  font-weight: var(--template-font-weight-semibold);
  color: var(--template-text-secondary);
  cursor: pointer;
  transition: var(--template-transition-all);
}

.social-icon-btn:hover {
  background: var(--template-primary);
  border-color: var(--template-primary);
  color: var(--template-text-inverse);
  transform: scale(1.1);
}

/* 底部 */
.simple-footer {
  text-align: center;
  margin-top: var(--template-spacing-2xl);
  font-size: var(--template-font-base);
}

.simple-footer a {
  color: var(--template-text-link);
  text-decoration: none;
  transition: var(--template-transition-color);
}

.simple-footer a:hover {
  color: var(--template-text-link-hover);
  text-decoration: underline;
}

.separator {
  margin: 0 var(--template-spacing-lg);
  color: var(--template-border);
}
</style>
