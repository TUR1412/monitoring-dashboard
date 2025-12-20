<!-- src/components/UserManagement/UserForm.vue -->
<template>
  <div class="card user-form">
    <div class="form-header">
      <div>
        <h2 class="page-title">{{ title }}</h2>
        <p class="subtitle">{{ subtitle }}</p>
      </div>
      <span class="stat-chip">
        <i class="fas fa-user-shield"></i>
        权限即刻生效
      </span>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-grid">
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
            @blur="v$.form.role.$touch()"
            required
          >
            <option value="ADMIN">管理员</option>
            <option value="USER">普通用户</option>
          </select>
          <span v-if="v$.form.role.$error" class="error-text">
            {{ v$.form.role.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="form-actions">
        <BaseButton type="primary" native-type="submit" :disabled="loading || v$.$invalid">
          {{ loading ? '处理中...' : submitText }}
        </BaseButton>
        <span class="hint">提交后自动保存至本地存储。</span>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return 'USER'
  return role.toUpperCase()
}

export default {
  name: 'UserForm',
  components: {
    BaseButton,
    BaseInput
  },
  props: {
    initialData: {
      type: Object,
      default: () => ({
        username: '',
        role: 'USER'
      })
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: '请完善用户信息并选择权限角色'
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
      username: props.initialData.username ?? '',
      role: normalizeRole(props.initialData.role)
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

    const handleSubmit = async () => {
      const isValid = await v$.value.$validate()
      if (!isValid) return

      emit('submit', {
        ...form,
        role: normalizeRole(form.role)
      })
    }

    return {
      form,
      v$,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.user-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: rgba(15, 23, 42, 0.28);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.error-text {
  color: var(--neon-red);
  font-size: 0.8rem;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.hint {
  color: var(--text-muted);
  font-size: 0.85rem;
}
</style>
