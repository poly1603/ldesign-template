<script setup lang="ts">
/**
 * 桌面端登录模板 - 简约分栏风格
 * 左右分栏布局，左侧品牌展示，右侧登录表单
 */
import { ref } from 'vue'

interface Props {
  title?: string
  logo?: string
  onSubmit?: (data: { username: string; password: string }) => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '欢迎登录',
})

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
  <div class="login-minimal">
    <div class="brand-side">
      <div class="brand-content">
        <div class="brand-icon">🚀</div>
        <h1 class="brand-title">LDesign</h1>
        <p class="brand-slogan">构建优雅的设计系统</p>
      </div>
    </div>
    <div class="form-side">
      <div class="form-container">
        <h2 class="form-title">{{ title }}</h2>
        <p class="form-subtitle">请输入您的账号信息</p>
        <form class="login-form" @submit.prevent="handleSubmit">
          <input v-model="username" type="text" placeholder="用户名" class="form-input" :disabled="loading">
          <input v-model="password" type="password" placeholder="密码" class="form-input" :disabled="loading">
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登 录' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-minimal { display: flex; height: 100vh; }

.brand-side {
  flex: 1;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-content { text-align: center; color: white; }
.brand-icon { font-size: 64px; margin-bottom: 20px; }
.brand-title { font-size: 48px; font-weight: 700; margin: 0 0 12px; }
.brand-slogan { font-size: 18px; opacity: 0.8; }

.form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.form-container { width: 100%; max-width: 360px; padding: 40px; }
.form-title { font-size: 28px; font-weight: 600; color: #1a1a2e; margin: 0 0 8px; }
.form-subtitle { color: #666; margin: 0 0 32px; }
.login-form { display: flex; flex-direction: column; gap: 16px; }

.form-input {
  padding: 14px 16px;
  font-size: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.2s;
  background: white;
}
.form-input:focus { outline: none; border-color: #1a1a2e; }

.submit-btn {
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: #1a1a2e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 8px;
}
.submit-btn:hover:not(:disabled) { opacity: 0.9; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

