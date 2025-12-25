<!-- src/components/UserManagement/EditUser.vue -->
<template>
  <div class="user-form-page fade-in">
    <header class="header">
      <div>
        <h1 class="page-title">编辑用户</h1>
        <p class="subtitle">更新用户信息与角色权限配置。</p>
      </div>
      <BaseButton type="default" @click="goBack">
        <AppIcon name="arrow-left" className="inline-icon" />
        返回用户管理
      </BaseButton>
    </header>

    <div v-if="error" class="card error-card">
      <AppIcon name="alert" className="inline-icon" />
      <span>{{ error }}</span>
    </div>

    <UserForm
      v-if="user"
      title="用户信息"
      subtitle="调整用户名与角色后提交保存"
      submit-text="保存更改"
      :initial-data="user"
      :loading="loading"
      @submit="handleEditUser"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import UserForm from './UserForm.vue'
import AppIcon from '@/components/base/AppIcon.vue'

export default {
  name: 'EditUser',
  components: {
    UserForm,
    BaseButton,
    AppIcon
  },

  setup() {
    const usersStore = useUsersStore()
    const uiStore = useUiStore()
    const router = useRouter()
    const route = useRoute()
    const loading = ref(false)
    const user = ref(null)
    const error = ref('')

    const userId = Number(route.query.id)

    onMounted(() => {
      if (!userId) {
        error.value = '用户 ID 无效，请返回列表重试。'
        return
      }

      const foundUser = usersStore.users.find(u => u.id === userId)
      if (!foundUser) {
        error.value = '未找到指定用户，请检查用户列表。'
        return
      }

      user.value = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role
      }
    })

    const handleEditUser = async (formData) => {
      loading.value = true
      try {
        usersStore.editUser({
          id: userId,
          username: formData.username,
          role: formData.role
        })
        uiStore.pushToast({ type: 'success', message: '用户信息已更新' })
        router.push({ name: 'UserManagementParent' })
      } catch (err) {
        uiStore.pushToast({ type: 'error', message: '更新用户失败，请稍后重试' })
      } finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.push({ name: 'UserManagementParent' })
    }

    return {
      user,
      loading,
      error,
      handleEditUser,
      goBack
    }
  }
}
</script>

<style scoped>
.user-form-page {
  padding: var(--container-padding);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.error-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--neon-red);
  border-color: rgba(231, 111, 81, 0.5);
  background: rgba(231, 111, 81, 0.12);
}

.inline-icon {
  margin-right: 0.5rem;
}
</style>
