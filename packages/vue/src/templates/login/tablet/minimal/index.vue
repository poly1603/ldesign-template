<script setup lang="ts">
/**
 * 平板端登录模板 - 清新蓝调风格
 * 蓝色渐变背景，图标输入框
 */
import { ref } from 'vue'

interface Props {
  title?: string
  logo?: string
  onSubmit?: (data: { username: string; password: string }) => void
}

const props = withDefaults(defineProps<Props>(), { title: '欢迎登录' })

const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (!username.value || !password.value) return
  loading.value = true
  try {
    await props.onSubmit?.({ username: username.value, password: password.value })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-tablet-minimal">
    <div class="brand-header">
      <span class="brand-icon">✨</span>
      <span class="brand-name">LDesign</span>
    </div>
    <div class="login-card">
      <h1 class="card-title">{{ title }}</h1>
      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="input-group">
          <span class="input-icon">👤</span>
          <input v-model="username" type="text" placeholder="请输入用户名" :disabled="loading">
        </div>
        <div class="input-group">
          <span class="input-icon">🔒</span>
          <input v-model="password" type="password" placeholder="请输入密码" :disabled="loading">
        </div>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '登录中...' : '立即登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-tablet-minimal {
  min-height: 100vh;
  background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
}

.brand-header { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
.brand-icon { font-size: 32px; }
.brand-name { font-size: 28px; font-weight: 700; color: white; }

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.card-title { font-size: 26px; font-weight: 600; color: #333; margin: 0 0 32px; }
.login-form { display: flex; flex-direction: column; gap: 18px; }

.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #f5f7fa;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}
.input-group:focus-within { border-color: #4facfe; background: white; }
.input-icon { font-size: 18px; }
.input-group input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  outline: none;
}

.submit-btn {
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4);
}
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>

