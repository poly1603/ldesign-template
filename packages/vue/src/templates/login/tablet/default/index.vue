<script setup lang="ts">
import { ref } from 'vue'

/**
 * 登录数据接口
 */
interface LoginData {
  username: string
  password: string
}

/**
 * 组件属性
 */
interface Props {
  /** 登录页标题 */
  title?: string
  /** Logo 图片地址 */
  logo?: string
  /** 登录提交回调 */
  onSubmit?: (data: LoginData) => void | Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  title: '欢迎登录',
})

const username = ref('')
const password = ref('')
const loading = ref(false)

/**
 * 处理登录提交
 */
async function handleSubmit(): Promise<void> {
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
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-tablet">
    <div class="login-card">
      <div class="login-header">
        <img v-if="logo" :src="logo" alt="Logo" class="login-logo">
        <h1 class="login-title">
          {{ title }}
        </h1>
        <p class="login-subtitle">
          请输入您的账号信息
        </p>
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
          >
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            :disabled="loading"
          >
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-tablet {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 100%;
  max-width: 480px;
  padding: 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo {
  width: 72px;
  height: 72px;
  margin-bottom: 20px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
}

.login-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 15px;
  font-weight: 500;
  color: #444;
}

.form-group input {
  padding: 14px 18px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
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
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 8px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

