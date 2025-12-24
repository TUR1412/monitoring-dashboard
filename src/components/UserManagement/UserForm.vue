<!-- src/components/UserManagement/UserForm.vue -->
<template>
  <div class="card user-form">
    <div class="form-header">
      <div>
        <h2 class="page-title">{{ title }}</h2>
        <p class="subtitle">{{ subtitle }}</p>
      </div>
      <span class="stat-chip">
        <AppIcon name="shield" className="inline-icon" />
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
            :invalid="touched.username && Boolean(errors.username)"
            @blur="touch('username')"
            required
            placeholder="输入用户名"
          />
          <span v-if="touched.username && errors.username" class="error-text">
            {{ errors.username }}
          </span>
        </div>

        <div class="form-group">
          <label for="role">角色</label>
          <select
            id="role"
            v-model="form.role"
            @blur="touch('role')"
            required
          >
            <option value="ADMIN">管理员</option>
            <option value="USER">普通用户</option>
          </select>
          <span v-if="touched.role && errors.role" class="error-text">
            {{ errors.role }}
          </span>
        </div>
      </div>

      <div class="form-actions">
        <BaseButton type="primary" native-type="submit" :disabled="loading || isInvalid">
          {{ loading ? '处理中...' : submitText }}
        </BaseButton>
        <span class="hint">提交后自动保存至本地存储。</span>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import AppIcon from '@/components/base/AppIcon.vue'

const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return 'USER'
  return role.toUpperCase()
}

export default {
  name: 'UserForm',
  components: {
    BaseButton,
    BaseInput,
    AppIcon
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

    const touched = reactive({
      username: false,
      role: false
    })

    const errors = computed(() => {
      const username = String(form.username || '').trim()
      const role = normalizeRole(form.role)
      return {
        username: !username
          ? '请输入用户名'
          : username.length < 3
            ? '用户名至少 3 个字符'
            : '',
        role: !role ? '请选择角色' : ''
      }
    })

    const isInvalid = computed(() => Boolean(errors.value.username || errors.value.role))

    const touch = (field) => {
      if (!field) return
      touched[field] = true
    }

    const handleSubmit = async () => {
      touched.username = true
      touched.role = true
      if (isInvalid.value) return

      emit('submit', {
        ...form,
        role: normalizeRole(form.role)
      })
    }

    return {
      form,
      touched,
      errors,
      isInvalid,
      touch,
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

.inline-icon {
  margin-right: 0.5rem;
}
</style>
