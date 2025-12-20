<!-- src/components/Login.vue -->
<template>
  <div class="login-container">
    <div class="login-card surface-glass">
      <div class="login-header">
        <h2>系统登录</h2>
        <p>进入实时监控与安全态势中心</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="login-hint">
          演示账号：<strong>admin</strong> / <strong>password</strong>
        </div>
        <div class="form-group">
          <label for="username" class="form-label">
            <i class="fas fa-user"></i>
            用户名
          </label>
          <input
            id="username"
            v-model="username"
            :disabled="loading"
            type="text"
            required
            placeholder="请输入用户名"
          />
          <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <i class="fas fa-lock"></i>
            密码
          </label>
          <div class="password-wrapper">
            <input
              id="password"
              v-model="password"
              :disabled="loading"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="请输入密码"
            />
            <button
              type="button"
              class="toggle-password"
              @click="togglePassword"
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>

        <button type="submit" class="btn btn-primary login-button" :disabled="loading">
          <span v-if="!loading">登 录</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <div v-if="error" class="error-container">
          <span class="error-icon">!</span>
          {{ error }}
        </div>

        <div class="option-buttons">
          <button type="button" class="option-btn" @click="showNotImplemented('忘记密码')">
            忘记密码？
          </button>
          <button type="button" class="option-btn" @click="showNotImplemented('扫码登录')">
            扫码登录
          </button>
          <button type="button" class="option-btn" @click="showNotImplemented('注册账号')">
            注册账号
          </button>
        </div>

        <div class="social-login">
          <button type="button" class="social-btn" @click="showNotImplemented('微信登录')">
            <i class="fab fa-weixin"></i>
            微信登录
          </button>
          <button type="button" class="social-btn" @click="showNotImplemented('企业微信登录')">
            <i class="fab fa-weixin"></i>
            企业微信
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useMonitorStore()
const loading = ref(false)
const error = ref(null)
const showPassword = ref(false)

const username = ref('')
const password = ref('')

const usernameError = ref(null)
const passwordError = ref(null)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  loading.value = true
  error.value = null
  usernameError.value = null
  passwordError.value = null

  if (!username.value) {
    usernameError.value = '请输入用户名'
  }

  if (!password.value) {
    passwordError.value = '请输入密码'
  }

  if (usernameError.value || passwordError.value) {
    loading.value = false
    return
  }

  try {
    await store.login(username.value, password.value)
    router.push({ name: 'Dashboard' })
  } catch (err) {
    error.value = err.message || '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const showNotImplemented = (feature) => {
  alert(`${feature} 功能暂未实现`)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: min(420px, 90vw);
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-header h2 {
  font-size: 1.6rem;
}

.login-header p {
  margin-top: 0.35rem;
  color: var(--text-2);
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-hint {
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  background: rgba(34, 211, 238, 0.12);
  border: 1px solid rgba(34, 211, 238, 0.3);
  color: var(--text-1);
  font-size: 0.85rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-2);
  font-size: 0.9rem;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 2.5rem;
}

.toggle-password {
  position: absolute;
  right: 0.6rem;
  background: transparent;
  border: none;
  color: var(--text-2);
  cursor: pointer;
}

.login-button {
  justify-content: center;
}

.loading-spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fecaca;
  font-size: 0.85rem;
}

.error-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.4);
  color: var(--text-0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.error-message {
  font-size: 0.8rem;
  color: #fecaca;
}

.option-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-btn {
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid var(--border);
  color: var(--text-2);
  padding: 0.6rem 1rem;
  border-radius: 10px;
  cursor: pointer;
}

.social-login {
  display: grid;
  gap: 0.6rem;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(34, 211, 238, 0.12);
  border: 1px solid rgba(34, 211, 238, 0.3);
  padding: 0.6rem 1rem;
  border-radius: 10px;
  color: var(--text-1);
  cursor: pointer;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
