<!-- src/components/UserManagement/AddUser.vue -->
<template>
  <div class="user-form-page fade-in">
    <header class="header">
      <div>
        <h1 class="page-title">新增用户</h1>
        <p class="subtitle">创建新账号并授予基础权限。</p>
      </div>
      <BaseButton type="default" @click="goBack">
        <i class="fas fa-arrow-left"></i>
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
import { useMonitorStore } from '@/stores/monitorStore'
import { useRouter } from 'vue-router'
import { notify } from '@/utils/notify'
import BaseButton from '@/components/base/BaseButton.vue'
import UserForm from './UserForm.vue'

export default {
  name: 'AddUser',
  components: {
    UserForm,
    BaseButton
  },

  setup() {
    const store = useMonitorStore()
    const router = useRouter()
    const loading = ref(false)

    const handleAddUser = async (formData) => {
      loading.value = true
      try {
        await store.addUser(formData)
        notify.success('用户已添加')
        setTimeout(() => {
          router.push({ name: 'UserManagementParent' })
        }, 600)
      } catch (err) {
        notify.error('添加用户失败，请稍后重试')
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

</style>
