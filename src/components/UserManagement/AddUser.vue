<!-- src/components/UserManagement/AddUser.vue -->
<template>
  <div class="user-form-page fade-in">
    <header class="header">
      <div>
        <h1 class="page-title">新增用户</h1>
        <p class="subtitle">创建新账号并授予基础权限。</p>
      </div>
      <BaseButton type="default" @click="goBack">
        <AppIcon name="arrow-left" className="inline-icon" />
        返回用户管理
      </BaseButton>
    </header>

    <UserForm
      title="用户信息"
      subtitle="填写用户名并选择角色后提交"
      submit-text="添加用户"
      :loading="loading"
      @submit="handleAddUser"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import UserForm from './UserForm.vue'
import AppIcon from '@/components/base/AppIcon.vue'

export default {
  name: 'AddUser',
  components: {
    UserForm,
    BaseButton,
    AppIcon
  },

  setup() {
    const usersStore = useUsersStore()
    const uiStore = useUiStore()
    const router = useRouter()
    const loading = ref(false)

    const handleAddUser = async (formData) => {
      loading.value = true
      try {
        usersStore.addUser(formData)
        uiStore.pushToast({ type: 'success', message: '用户已添加' })
        router.push({ name: 'UserManagementParent' })
      } catch (err) {
        uiStore.pushToast({ type: 'error', message: '添加用户失败，请稍后重试' })
      } finally {
        loading.value = false
      }
    }

    const goBack = () => {
      router.push({ name: 'UserManagementParent' })
    }

    return {
      loading,
      handleAddUser,
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

.inline-icon {
  margin-right: 0.5rem;
}

</style>
