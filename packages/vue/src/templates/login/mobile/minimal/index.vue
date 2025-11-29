<script setup lang="ts">
/**
 * 移动端登录模板 - 暗夜极简风格
 * 暗色主题，极简设计
 */
import { ref } from 'vue'

interface Props {
  title?: string
  logo?: string
  onSubmit?: (data: { username: string; password: string }) => void
}

const props = withDefaults(defineProps<Props>(), { title: '登录' })

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
  <div class="login-mobile-minimal">
    <div class="content">
      <div class="logo-area">
        <div class="logo">🌙</div>
        <h1 class="title">{{ title }}</h1>
      </div>
      <form class="form" @submit.prevent="handleSubmit">
        <input v-model="username" type="text" placeholder="用户名" class="input" :disabled="loading">
        <input v-model="password" type="password" placeholder="密码" class="input" :disabled="loading">
        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? '...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-mobile-minimal {
  min-height: 100vh;
  background: #0f0f23;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.content { width: 100%; max-width: 320px; text-align: center; }

.logo-area { margin-bottom: 48px; }
.logo { font-size: 56px; margin-bottom: 16px; }
.title {
  font-size: 24px;
  font-weight: 300;
  color: white;
  margin: 0;
  letter-spacing: 4px;
}

.form { display: flex; flex-direction: column; gap: 14px; }

.input {
  padding: 16px 20px;
  font-size: 16px;
  color: white;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  transition: all 0.2s;
}
.input::placeholder { color: rgba(255, 255, 255, 0.4); }
.input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn {
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #0f0f23;
  background: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  transition: opacity 0.2s;
}
.btn:hover:not(:disabled) { opacity: 0.9; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

