<!-- src/components/Login.vue -->
<template>
  <div class="login-container">
    <div class="login-card" :class="{ 'form-loading': loading }">
      <div class="card-header">
        <h2 class="login-title">
          <span class="neon-text">系统登录</span>
        </h2>
        <div class="cyberpunk-decoration"></div>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <span class="label-icon"><i class="fas fa-user"></i></span>
            用户名
          </label>
          <div class="input-wrapper">
            <input
              type="text"
              id="username"
              v-model="username"
              :disabled="loading"
              class="form-input cyberpunk-input"
              required
              placeholder="请输入用户名"
            />
            <div class="input-glow"></div>
            <transition name="fade">
              <span v-if="usernameError" class="error-message">
                {{ usernameError }}
              </span>
            </transition>
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <span class="label-icon"><i class="fas fa-lock"></i></span>
            密码
          </label>
          <div class="input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              :disabled="loading"
              class="form-input cyberpunk-input"
              required
              placeholder="请输入密码"
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="togglePassword"
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
            <div class="input-glow"></div>
            <transition name="fade">
              <span v-if="passwordError" class="error-message">
                {{ passwordError }}
              </span>
            </transition>
          </div>
        </div>

        <button 
          type="submit" 
          class="login-button cyberpunk-button"
          :disabled="loading"
        >
          <template v-if="!loading">
            <span class="button-text">登 录</span>
            <div class="button-glitch"></div>
          </template>
          <span v-else class="loading-spinner"></span>
        </button>

        <transition name="slide-fade">
          <div v-if="error" class="error-container">
            <span class="error-icon">!</span>
            {{ error }}
          </div>
        </transition>

        <div class="option-buttons">
          <button type="button" class="option-btn" @click="showNotImplemented('忘记密码')">
            忘记密码?
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
            <span class="social-icon"><i class="fab fa-weixin"></i></span>
            微信登录
          </button>
          <button type="button" class="social-btn" @click="showNotImplemented('企业微信登录')">
            <span class="social-icon"><i class="fas fa-building"></i></span>
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

  // Simple validation
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, 
    var(--background-color) 0%,
    var(--dark-purple) 100%);
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    var(--neon-blue) 45%,
    var(--neon-pink) 55%,
    transparent 100%
  );
  animation: backgroundShift 10s linear infinite;
  opacity: 0.1;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: rgba(15, 23, 42, 0.72);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(46, 196, 182, 0.25);
  box-shadow: var(--shadow-soft), 0 0 40px rgba(46, 196, 182, 0.2);
  position: relative;
  z-index: 1;
  animation: cardAppear 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(
      transparent 0%,
      transparent 2%,
      var(--neon-blue) 2%,
      var(--neon-blue) 2.5%,
      transparent 2.5%,
      transparent 97.5%,
      var(--neon-pink) 97.5%,
      var(--neon-pink) 98%,
      transparent 98%
    ),
    linear-gradient(
      90deg,
      transparent 0%,
      transparent 2%,
      var(--neon-blue) 2%,
      var(--neon-blue) 2.5%,
      transparent 2.5%,
      transparent 97.5%,
      var(--neon-pink) 97.5%,
      var(--neon-pink) 98%,
      transparent 98%
    );
  background-size: 50px 50px;
  animation: circuitAnimation 20s linear infinite;
  opacity: 0.1;
  z-index: 0;
}

@keyframes circuitAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Enhanced input styling */
.cyberpunk-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 2px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-family: 'Space Grotesk', 'Noto Sans SC', sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.cyberpunk-input::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
  z-index: -1;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.cyberpunk-input:focus::before {
  opacity: 1;
}

.cyberpunk-input:focus {
  border-color: var(--neon-blue);
  box-shadow: 0 0 0 2px rgba(31, 142, 241, 0.2);
  outline: none;
}

.input-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 8px;
  background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.cyberpunk-input:focus + .input-glow {
  opacity: 0.5;
}

/* Glitch effect for error messages */
.error-message {
  position: relative;
  color: var(--neon-red);
  text-shadow: 
    2px 0 var(--neon-blue),
    -2px 0 var(--neon-pink);
  animation: glitchText 0.3s infinite;
}

@keyframes glitchText {
  0% {
    text-shadow: 2px 0 var(--neon-blue), -2px 0 var(--neon-pink);
  }
  25% {
    text-shadow: -2px 0 var(--neon-blue), 2px 0 var(--neon-pink);
  }
  50% {
    text-shadow: 2px 0 var(--neon-pink), -2px 0 var(--neon-blue);
  }
  75% {
    text-shadow: -2px 0 var(--neon-pink), 2px 0 var(--neon-blue);
  }
}

/* Enhanced button styling */
.cyberpunk-button {
  position: relative;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
  border: none;
  border-radius: 6px;
  color: var(--text-color);
  font-family: 'Space Grotesk', 'Noto Sans SC', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
  z-index: 1;
}

.cyberpunk-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    transparent 50%,
    var(--neon-blue) 50%,
    var(--neon-pink) 100%
  );
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-100%);
  z-index: -1;
}

.cyberpunk-button:hover::before {
  transform: translateX(0);
}

.cyberpunk-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0 20px var(--neon-blue),
              0 0 40px var(--neon-pink);
}

.cyberpunk-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: linear-gradient(45deg, var(--gray-600), var(--gray-700));
}

.button-text {
  position: relative;
  z-index: 1;
}

.button-glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--neon-pink), var(--neon-blue));
  opacity: 0;
  transition: opacity 0.3s;
}

.cyberpunk-button:hover .button-glitch {
  opacity: 0.3;
  animation: glitchEffect 0.3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.error-container {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 7, 58, 0.15);
  border-left: 4px solid var(--neon-red);
  border-radius: 6px;
  color: var(--neon-red);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--neon-red);
  border-radius: 50%;
  color: var(--background-color);
  font-weight: bold;
  font-size: 1rem;
}

.loading-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid var(--text-color);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

/* Animations */
@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes decorationGlow {
  0%, 100% {
    box-shadow: 0 0 10px var(--neon-blue),
                0 0 20px var(--neon-pink);
  }
  50% {
    box-shadow: 0 0 20px var(--neon-blue),
                0 0 40px var(--neon-pink);
  }
}

@keyframes backgroundShift {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes glitchEffect {
  0% {
    clip-path: inset(0 0 0 0);
  }
  20% {
    clip-path: inset(20% 0 0 0);
  }
  40% {
    clip-path: inset(40% 0 60% 0);
  }
  60% {
    clip-path: inset(60% 0 40% 0);
  }
  80% {
    clip-path: inset(80% 0 20% 0);
  }
  100% {
    clip-path: inset(100% 0 0 0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
    margin: 0.5rem;
    max-width: 100%;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .cyberpunk-input {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .cyberpunk-button {
    padding: 0.875rem;
    font-size: 1rem;
  }

  .form-group {
    gap: 1.5rem;
  }

  .error-container {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
}

/* Mobile-first optimizations */
@media (max-width: 360px) {
  .login-card {
    padding: 1rem;
  }

  .login-title {
    font-size: 1.25rem;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .error-icon {
    width: 20px;
    height: 20px;
    font-size: 0.875rem;
  }
}

/* Added styles for option buttons */
.option-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.option-btn {
  background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
  border: none;
  border-radius: 6px;
  color: var(--text-color);
  font-family: 'Space Grotesk', 'Noto Sans SC', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.option-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    transparent 50%,
    var(--neon-blue) 50%,
    var(--neon-pink) 100%
  );
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-100%);
  z-index: -1;
}

.option-btn:hover::before {
  transform: translateX(0);
}

.option-btn:hover {
  box-shadow: 0 0 20px var(--neon-blue),
              0 0 40px var(--neon-pink);
}

.option-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(31, 142, 241, 0.2);
}

/* Social login buttons enhancement */
.social-btn {
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid var(--neon-blue);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  color: var(--text-color);
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.social-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.social-btn:hover::before {
  opacity: 0.2;
}

.social-btn:hover {
  box-shadow: 0 0 10px var(--neon-blue),
              0 0 20px var(--neon-pink);
}

.social-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(31, 142, 241, 0.2);
}
</style>



