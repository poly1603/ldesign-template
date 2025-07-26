<template>
  <div class="login-template">
    <!-- 页面头部 -->
    <header class="login-header">
      <slot name="header">
        <div class="logo-section">
          <img v-if="logo" :src="logo" alt="Logo" class="logo" />
          <h1 class="title">{{ title }}</h1>
        </div>
      </slot>
    </header>

    <!-- 登录表单 -->
    <main class="login-main">
      <div class="login-form-container">
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              class="form-input"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="form-input"
              placeholder="请输入密码"
              required
            />
          </div>

          <div class="form-options" v-if="showRememberMe || showForgotPassword">
            <label v-if="showRememberMe" class="checkbox-label">
              <input
                v-model="formData.rememberMe"
                type="checkbox"
                class="checkbox"
              />
              <span class="checkbox-text">记住我</span>
            </label>

            <a
              v-if="showForgotPassword"
              href="#"
              @click.prevent="handleForgotPassword"
              class="forgot-link"
            >
              忘记密码？
            </a>
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 额外内容 -->
        <div class="extra-content">
          <slot name="extra"></slot>
        </div>
      </div>
    </main>

    <!-- 页面底部 -->
    <footer class="login-footer">
      <slot name="footer">
        <p class="copyright">&copy; 2024 LDesign. All rights reserved.</p>
      </slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Props定义
interface Props {
  title?: string
  logo?: string
  showRememberMe?: boolean
  showForgotPassword?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '用户登录',
  logo: '',
  showRememberMe: true,
  showForgotPassword: true
})

// Events定义
const emit = defineEmits<{
  login: [data: { username: string; password: string; rememberMe: boolean }]
  forgotPassword: []
}>()

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 加载状态
const isLoading = ref(false)

// 处理登录
const handleLogin = async () => {
  if (!formData.username || !formData.password) {
    return
  }

  isLoading.value = true
  
  try {
    // 模拟登录延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('login', {
      username: formData.username,
      password: formData.password,
      rememberMe: formData.rememberMe
    })
  } finally {
    isLoading.value = false
  }
}

// 处理忘记密码
const handleForgotPassword = () => {
  emit('forgotPassword')
}
</script>

<style scoped>
.login-template {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-header {
  padding: 2rem;
  text-align: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo {
  max-height: 60px;
  width: auto;
}

.title {
  color: white;
  font-size: 2rem;
  font-weight: 300;
  margin: 0;
}

.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-form-container {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox {
  width: 1rem;
  height: 1rem;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.forgot-link {
  font-size: 0.875rem;
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #5a67d8;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.extra-content {
  margin-top: 2rem;
  text-align: center;
}

.login-footer {
  padding: 1rem;
  text-align: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .login-header {
    padding: 1rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .login-main {
    padding: 1rem;
  }
  
  .login-form-container {
    padding: 2rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>