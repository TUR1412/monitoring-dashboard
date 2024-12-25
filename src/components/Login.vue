<!-- src/components/Login.vue -->
<template>
  <div class="login">
    <h2>登录</h2>
    <form @submit.prevent="handleLogin" class="form">
      <div class="form-group">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="username" required placeholder="输入用户名" />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input type="password" id="password" v-model="password" required placeholder="输入密码" />
      </div>
      <button type="submit" :disabled="loading">登录</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const username = ref('')
    const password = ref('')
    const error = ref(null)
    const loading = ref(false)
    const store = useMonitorStore()
    const router = useRouter()

    const handleLogin = async () => {
      loading.value = true
      error.value = null
      try {
        await store.login(username.value, password.value)
        router.push({ name: 'Dashboard' })
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    return {
      username,
      password,
      error,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login {
  background-color: var(--card-background-color);
  padding: 40px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 142, 241, 0.7), 0 0 20px var(--neon-pink);
  width: 300px;
  margin: 0 auto;
  color: var(--text-color);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--highlight-color);
  text-shadow: 0 0 5px var(--highlight-color), 0 0 10px var(--neon-blue);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: var(--text-color);
}

input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background-color: var(--card-background-color);
  color: var(--text-color);
  transition: border-color 0.3s, box-shadow 0.3s;
}

input::placeholder {
  color: var(--paragraph-color);
}

input:focus {
  outline: none;
  border-color: var(--neon-blue);
  box-shadow: 0 0 0 2px rgba(31, 142, 241, 0.5);
}

button {
  padding: 0.75rem;
  background-color: var(--neon-blue);
  color: var(--text-color);
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 0 10px var(--neon-blue), 0 0 20px var(--neon-pink);
}

button:hover:not(:disabled) {
  background-color: var(--neon-pink);
  box-shadow: 0 0 15px var(--neon-pink), 0 0 25px var(--neon-blue);
}

button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.error {
  color: var(--neon-red);
  margin-top: 10px;
  text-align: center;
  padding: 0.5rem;
  background-color: rgba(255, 7, 58, 0.1);
  border-left: 4px solid var(--neon-red);
  border-radius: 0.375rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
