<!--src\components\UserManagement\EditUser.vue-->
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
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color, #dcdfe6);
  border-radius: 4px;
  background-color: var(--input-background, #fff);
  color: var(--text-color);
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

button {
  padding: 12px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3071d3;
}

button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.error {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #fef0f0;
  color: #f56c6c;
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