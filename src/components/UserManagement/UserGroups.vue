<!-- src/components/UserManagement/UserGroups.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useUserGroups } from '@/composables/useUserGroups'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const {
  groups,
  loading,
  addUserGroup,
  updateUserGroup,
  deleteUserGroup,
  fetchUserGroups
} = useUserGroups()

const showAddGroupModal = ref(false)
const newGroupName = ref('')
const editingGroup = ref(null)

onMounted(async () => {
  await fetchUserGroups()
})

const handleAddGroup = async () => {
  if (!newGroupName.value.trim()) return
  
  try {
    await addUserGroup({
      name: newGroupName.value.trim(),
      memberCount: 0,
      createTime: new Date().toISOString().split('T')[0]
    })
    
    showAddGroupModal.value = false
    newGroupName.value = ''
    ElMessage.success('用户组创建成功')
  } catch (error) {
    ElMessage.error('创建用户组失败：' + error.message)
  }
}

const handleEditGroup = async (group) => {
  editingGroup.value = { ...group }
  showAddGroupModal.value = true
}

const handleDeleteGroup = async (groupId) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户组吗？此操作不可恢复', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteUserGroup(groupId)
    ElMessage.success('用户组删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除用户组失败：' + error.message)
    }
  }
}
</script>

<template>
  <div class="user-groups-container">
    <header class="user-groups-header">
      <h2 class="user-groups-title">用户组管理</h2>
      <BaseButton 
        type="primary"
        icon="Plus"
        @click="showAddGroupModal = true"
      >
        新建用户组
      </BaseButton>
    </header>

    <div class="user-groups-table">
      <table>
        <thead>
          <tr>
            <th scope="col">组名称</th>
            <th scope="col">成员数量</th>
            <th scope="col">创建时间</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="group in groups" :key="group.id" class="group-row">
            <td>{{ group.name }}</td>
            <td>{{ group.memberCount }}</td>
            <td>{{ group.createTime }}</td>
            <td class="action-buttons">
              <BaseButton
                type="info"
                size="small"
                icon="Edit"
                @click="handleEditGroup(group)"
              >
                编辑
              </BaseButton>
              <BaseButton
                type="danger"
                size="small"
                icon="Delete"
                @click="handleDeleteGroup(group.id)"
              >
                删除
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal
      v-model="showAddGroupModal"
      :title="editingGroup ? '编辑用户组' : '新建用户组'"
      width="400px"
    >
      <form @submit.prevent="handleAddGroup" class="group-form">
        <div class="form-group">
          <label for="groupName">组名称</label>
          <BaseInput
            id="groupName"
            v-model="newGroupName"
            placeholder="请输入组名称"
            required
            :disabled="loading"
          />
        </div>
        
        <div class="form-actions">
          <BaseButton
            type="default"
            @click="showAddGroupModal = false"
          >
            取消
          </BaseButton>
          <BaseButton
            type="primary"
            :loading="loading"
            native-type="submit"
          >
            {{ loading ? '处理中...' : (editingGroup ? '保存' : '创建') }}
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<style scoped>
.user-groups-container {
  @apply p-6 bg-transparent;
}

.user-groups-header {
  @apply flex justify-between items-center mb-6;
}

.user-groups-title {
  @apply text-2xl font-bold;
  color: var(--heading-color);
}

.user-groups-table {
  @apply w-full overflow-x-auto rounded-lg;
  background-color: var(--card-background-color);
}

table {
  @apply w-full border-collapse;
}

th {
  @apply px-4 py-3 text-left font-medium;
  background-color: var(--neon-blue);
  color: var(--text-color);
}

td {
  @apply px-4 py-3 border-b;
  border-color: var(--border-color);
}

.group-row {
  @apply transition-colors duration-200;
}

.group-row:hover {
  background-color: color-mix(in srgb, var(--neon-blue) 10%, transparent);
}

.action-buttons {
  @apply flex gap-2;
}

.group-form {
  @apply flex flex-col gap-4;
}

.form-group {
  @apply flex flex-col gap-2;
}

.form-group label {
  @apply font-medium;
  color: var(--text-color);
}

.form-actions {
  @apply flex justify-end gap-3 mt-4;
}

@media (max-width: 768px) {
  .user-groups-container {
    @apply p-4;
  }
  
  .action-buttons {
    @apply flex-col gap-1;
  }
  
  .user-groups-header {
    @apply flex-col items-start gap-3;
  }
}
</style>