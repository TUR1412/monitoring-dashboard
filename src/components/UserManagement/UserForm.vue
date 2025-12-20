<!-- src/components/UserManagement/UserForm.vue -->
<template>
  <div class="user-form">
    <h2>{{ title }}</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="username">用户名</label>
        <BaseInput
          id="username"
          v-model="form.username"
          :invalid="v$.form.username.$error"
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

      <BaseButton
        type="primary"
        native-type="submit"
        :loading="loading"
        :disabled="loading || v$.$invalid"
      >
        {{ loading ? '处理中...' : submitText }}
      </BaseButton>

      <div v-if="successMessage" class="success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

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
  components: {
    BaseInput,
    BaseButton
  },

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
  background-color: var(--surface-1);
  color: var(--text-1);
  max-width: 500px;
  margin: 0 auto;
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--accent-0);
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
  color: var(--text-2);
}

select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background-color: rgba(148, 163, 184, 0.08);
  color: var(--text-1);
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

select::placeholder {
  color: var(--paragraph-color);
}

select:focus {
  outline: none;
  border-color: var(--accent-0);
  box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.4);
}

.error-input {
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.error-text {
  color: #fecaca;
  font-size: 0.875rem;
}

/* BaseButton 已负责按钮样式 */

.success,
.error {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  text-align: center;
}

.success {
  background-color: rgba(34, 197, 94, 0.12);
  color: #bbf7d0;
  border-left: 4px solid rgba(34, 197, 94, 0.6);
}

.error {
  background-color: rgba(239, 68, 68, 0.12);
  color: #fecaca;
  border-left: 4px solid rgba(239, 68, 68, 0.6);
}
</style>
