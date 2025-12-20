<!-- src/components/UserManagement/UserGroups.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserGroups } from '@/composables/useUserGroups'
import { notify } from '@/utils/notify'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const {
  groups,
  loading,
  addUserGroup,
  updateUserGroup,
  deleteUserGroup,
  fetchUserGroups
} = useUserGroups()

const showModal = ref(false)
const editingGroup = ref(null)
const groupName = ref('')
const searchQuery = ref('')

onMounted(async () => {
  await fetchUserGroups()
})

const totalMembers = computed(() =>
  groups.value.reduce((sum, group) => sum + Number(group.memberCount || 0), 0)
)

const filteredGroups = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  if (!keyword) return groups.value
  return groups.value.filter(group => group.name.toLowerCase().includes(keyword))
})

const openCreate = () => {
  editingGroup.value = null
  groupName.value = ''
  showModal.value = true
}

const openEdit = (group) => {
  editingGroup.value = group
  groupName.value = group.name
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingGroup.value = null
  groupName.value = ''
}

const handleSubmit = async () => {
  if (!groupName.value.trim()) return

  try {
    if (editingGroup.value) {
      await updateUserGroup(editingGroup.value.id, {
        ...editingGroup.value,
        name: groupName.value.trim()
      })
      notify.success('用户组已更新')
    } else {
      await addUserGroup({
        name: groupName.value.trim(),
        memberCount: 0,
        createTime: new Date().toISOString().split('T')[0]
      })
      notify.success('用户组创建成功')
    }
    closeModal()
  } catch (error) {
    notify.error('操作失败，请稍后重试')
  }
}

const handleDeleteGroup = async (groupId) => {
  try {
    await notify.confirm('确定要删除该用户组吗？此操作不可恢复', '警告')
    await deleteUserGroup(groupId)
    notify.success('用户组删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      notify.error('删除用户组失败，请稍后重试')
    }
  }
}
</script>

<template>
  <div class="user-groups fade-in">
    <header class="header">
      <div>
        <h2 class="page-title">用户组管理</h2>
        <p class="subtitle">集中维护用户组、成员规模与创建信息。</p>
      </div>
      <div class="header-actions">
        <span class="stat-chip">
          <i class="fas fa-users"></i>
          共 {{ groups.length }} 组 / {{ totalMembers }} 人
        </span>
        <BaseButton type="primary" @click="openCreate">
          <i class="fas fa-plus"></i>
          新建用户组
        </BaseButton>
      </div>
    </header>

    <div class="card filter-card">
      <div class="filter-row">
        <div class="filter-item">
          <label>搜索用户组</label>
          <BaseInput v-model="searchQuery" placeholder="输入组名称" />
        </div>
        <div class="filter-item">
          <label>快速提示</label>
          <div class="hint">支持模糊搜索，按组名称过滤。</div>
        </div>
      </div>
    </div>

    <div class="card table-card">
      <div v-if="loading" class="state-block">
        <i class="fas fa-spinner fa-spin"></i>
        <span>加载用户组...</span>
      </div>
      <div v-else-if="!filteredGroups.length" class="state-block">
        <span>暂无用户组，请创建新的分组。</span>
      </div>
      <table v-else class="group-table">
        <thead>
          <tr>
            <th>组名称</th>
            <th>成员数量</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="group in filteredGroups" :key="group.id">
            <td>{{ group.name }}</td>
            <td>{{ group.memberCount }}</td>
            <td>{{ group.createTime }}</td>
            <td>
              <div class="actions-cell">
                <BaseButton type="default" size="small" @click="openEdit(group)">
                  编辑
                </BaseButton>
                <BaseButton type="danger" size="small" @click="handleDeleteGroup(group.id)">
                  删除
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal card" @click.stop>
          <h3>{{ editingGroup ? '编辑用户组' : '新建用户组' }}</h3>
          <p class="subtitle">请输入用户组名称，创建后可继续调整成员。</p>
          <div class="modal-body">
            <label>组名称</label>
            <BaseInput v-model="groupName" placeholder="请输入组名称" />
          </div>
          <div class="modal-actions">
            <BaseButton type="default" @click="closeModal">取消</BaseButton>
            <BaseButton type="primary" :disabled="loading" @click="handleSubmit">
              {{ editingGroup ? '保存' : '创建' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.user-groups {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-card {
  background: rgba(15, 23, 42, 0.28);
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--text-muted);
}

.hint {
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-sm);
  background: rgba(46, 196, 182, 0.12);
  color: var(--text-strong);
  border: 1px solid rgba(46, 196, 182, 0.35);
}

.table-card {
  background: rgba(15, 23, 42, 0.28);
}

.group-table {
  width: 100%;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.state-block {
  padding: 2.5rem 0;
  text-align: center;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: center;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 16, 24, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: min(480px, 92vw);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
