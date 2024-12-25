<!-- src/components/UserManagement/AddUser.vue -->
<template>
  <UserForm
    title="新增用户"
    submit-text="添加"
    :loading="loading"
    @submit="handleAddUser"
  />
</template>

<script>
import { ref } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { useRouter } from 'vue-router'
import UserForm from './UserForm.vue'

export default {
  name: 'AddUser',
  components: {
    UserForm
  },
  
  setup() {
    const store = useMonitorStore()
    const router = useRouter()
    const loading = ref(false)

    const handleAddUser = async (formData) => {
      loading.value = true
      try {
        // 添加用户的操作
        await store.addUser(formData)
        // 延迟跳转以显示成功状态
        setTimeout(() => {
          // 使用命名路由重定向回用户管理页面
          router.push({ name: 'UserManagementParent' })
        }, 1000)
      } catch (err) {
        throw new Error('添加用户失败')
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      handleAddUser
    }
  }
}
</script>
      
<style scoped>
/* 无需额外样式，因为 UserForm.vue 已经处理了样式 */
</style>
