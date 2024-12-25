<!-- src/components/UserManagement/UserForm.vue -->
<template>
  <div class="user-form">
    <h2>{{ title }}</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          :class="{ 'error-input': v$.form.username.$error }"
          @blur="v$.form.username.$touch()"
          required
          placeholder="输入用户名"
        />
        <span v-if="v$.form.username.$error" class="error-text">
          {{ v$.form.username.$errors[0].$message }}
        </span>
      </div>
      
      <div class="form-group">
        <label for="role">角色</label>
        <select
          id="role"
          v-model="form.role"
          :class="{ 'error-input': v$.form.role.$error }"
          @blur="v$.form.role.$touch()"
          required
        >
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
        </select>
        <span v-if="v$.form.role.$error" class="error-text">
          {{ v$.form.role.$errors[0].$message }}
        </span>
      </div>

      <button type="submit" class="button-neon" :disabled="loading || v$.$invalid">
        {{ loading ? '处理中...' : submitText }}
      </button>

      <div v-if="successMessage" class="success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

export default {
  name: 'UserForm',
  props: {
    initialData: {
      type: Object,
      default: () => ({
        username: '',
        role: 'user'
      })
    },
    title: {
      type: String,
      required: true
    },
    submitText: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['submit'],

  setup(props, { emit }) {
    const form = reactive({
      username: props.initialData.username,
      role: props.initialData.role
    })

    const rules = computed(() => ({
      form: {
        username: { 
          required, 
          minLength: minLength(3)
        },
        role: { required }
      }
    }))

    const v$ = useVuelidate(rules, { form })
    
    const successMessage = ref('')
    const errorMessage = ref('')

    const handleSubmit = async () => {
      errorMessage.value = ''
      successMessage.value = ''
      
      const isValid = await v$.value.$validate()
      if (!isValid) return

      try {
        emit('submit', { ...form })
        successMessage.value = '操作成功！'
      } catch (err) {
        errorMessage.value = err.message || '操作失败'
      }
    }

    return {
      form,
      v$,
      successMessage,
      errorMessage,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.user-form {
  padding: 20px;
  background-color: var(--card-background-color);
  color: var(--text-color);
  max-width: 500px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 142, 241, 0.7), 0 0 20px var(--neon-pink);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
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

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background-color: var(--card-background-color);
  color: var(--text-color);
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input::placeholder,
select::placeholder {
  color: var(--paragraph-color);
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--neon-blue);
  box-shadow: 0 0 0 2px rgba(31, 142, 241, 0.5);
}

.error-input {
  border-color: var(--neon-red);
  box-shadow: 0 0 5px var(--neon-red);
}

.error-text {
  color: var(--neon-red);
  font-size: 0.875rem;
}

/* 移除局部按钮样式，使用全局 .button-neon 类 */
button {
  /* 移除局部样式 */
}

/* 确保全局按钮样式应用 */
:deep(.button-neon) {
  /* 无需添加样式，依赖全局样式 */
}

.success,
.error {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  text-align: center;
}

.success {
  background-color: rgba(56, 162, 89, 0.1);
  color: var(--neon-green);
  border-left: 4px solid var(--neon-green);
}

.error {
  background-color: rgba(255, 7, 58, 0.1);
  color: var(--neon-red);
  border-left: 4px solid var(--neon-red);
}
</style>
