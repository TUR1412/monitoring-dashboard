<!-- src/components/UserManagement/EditUser.vue -->
<template>
  <div class="edit-user">
    <div v-if="error" class="error">{{ error }}</div>
    <UserForm
      v-if="user"
      title="编辑用户"
      submit-text="保存"
      :initial-data="user"
      :loading="loading"
      @submit="handleEditUser"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { useRouter, useRoute } from 'vue-router'
import UserForm from './UserForm.vue'

export default {
  name: 'EditUser',
  components: {
    UserForm
  },

  setup() {
    const store = useMonitorStore()
    const router = useRouter()
    const route = useRoute()
    const loading = ref(false)
    const user = ref(null)
    const error = ref('')

    const userId = parseInt(route.query.id)

    onMounted(() => {
      if (!userId) {
        error.value = '用户ID无效'
        setTimeout(() => {
          router.push('/dashboard/user-management')
        }, 1500)
        return
      }

      const foundUser = store.users.find(u => u.id === userId)
      if (!foundUser) {
        error.value = '未找到指定用户'
        setTimeout(() => {
          router.push({ 
            path: '/dashboard/user-management',
            query: { error: 'user-not-found' }
          })
        }, 1500)
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
        // 更新用户信息
        await store.editUser({
          id: userId,
          username: formData.username,
          role: formData.role
        })
        
        // 延迟跳转以显示成功状态
        setTimeout(() => {
          router.push('/dashboard/user-management')
        }, 1000)
      } catch (err) {
        error.value = '更新用户失败：' + (err.message || '未知错误')
      } finally {
        loading.value = false
      }
    }

    return {
      user,
      loading,
      error,
      handleEditUser
    }
  }
}
</script>

<style scoped>
.edit-user {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: var(--card-background-color);
  color: var(--text-color);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 142, 241, 0.7), 0 0 20px var(--neon-pink);
}

.error {
  margin-bottom: 15px;
  padding: 10px;
  background-color: rgba(255, 7, 58, 0.1); /* 使用霓虹红色的透明背景 */
  color: var(--neon-red);
  border-left: 4px solid var(--neon-red);
  border-radius: 4px;
  text-align: center;
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

/* 深色主题适配 */
:root[data-theme='dark'] .edit-user {
  --background-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #4c4c4c;
  --input-background: #2c2c2c;
}
</style>
