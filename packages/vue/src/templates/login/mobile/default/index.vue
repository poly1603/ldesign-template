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
  <div class="login-mobile">
    <div class="login-content">
      <div class="login-header">
        <img v-if="logo" :src="logo" alt="Logo" class="login-logo">
        <h1 class="login-title">
          {{ title }}
        </h1>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            :disabled="loading"
          >
        </div>

        <div class="form-group">
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
.login-mobile {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100%;
}

.login-header {
  text-align: center;
  margin-bottom: 48px;
}

.login-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group input {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  background: white;
}

.form-group input:disabled {
  opacity: 0.6;
}

.login-button {
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
  background: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 8px;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

