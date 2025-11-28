<script setup lang="ts">
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
  if (!username.value || !password.value) {
    alert('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    await props.onSubmit?.({
      username: username.value,
      password: password.value,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-template">
    <div class="login-container">
      <div class="login-header">
        <img v-if="logo" :src="logo" alt="Logo" class="login-logo" />
        <h1 class="login-title">{{ title }}</h1>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            :disabled="loading"
          />
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-template {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.login-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: #667eea;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-button:hover:not(:disabled) {
  background: #5568d3;
}

.login-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>