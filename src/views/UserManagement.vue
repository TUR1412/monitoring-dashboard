<!-- src/views/UserManagement.vue -->
<template>
  <div class="user-management fade-in">
    <header class="header">
      <div>
        <h1 class="page-title">用户管理</h1>
        <p class="subtitle">统一管理用户、角色与状态，支持快速检索与导出。</p>
      </div>
      <div class="header-actions">
        <BaseButton type="default" @click="exportUsers">
          <AppIcon name="export" className="inline-icon" />
          导出用户
        </BaseButton>
        <router-link :to="{ name: 'AddUser' }">
          <BaseButton type="primary">
            <AppIcon name="plus" className="inline-icon" />
            新增用户
          </BaseButton>
        </router-link>
      </div>
    </header>

    <div class="stats-row">
      <div class="card stat-card">
        <span class="stat-label">总用户数</span>
        <div class="stat-value">{{ store.users.length }}</div>
      </div>
      <div class="card stat-card">
        <span class="stat-label">管理员数</span>
        <div class="stat-value">{{ adminCount }}</div>
      </div>
      <div class="card stat-card">
        <span class="stat-label">禁用账户</span>
        <div class="stat-value">{{ inactiveCount }}</div>
      </div>
    </div>

    <div class="card filter-card">
      <div class="filter-grid">
        <div class="filter-item">
          <label>搜索用户</label>
          <BaseInput v-model="searchQuery" placeholder="输入用户名 / ID / 角色" />
        </div>
        <div class="filter-item">
          <label>角色筛选</label>
          <select v-model="roleFilter">
            <option value="all">全部角色</option>
            <option value="ADMIN">管理员</option>
            <option value="USER">普通用户</option>
          </select>
        </div>
        <div class="filter-item">
          <label>状态筛选</label>
          <select v-model="statusFilter">
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="inactive">禁用</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card table-card">
      <div v-if="loading" class="state-block">
        <div class="loading-spinner"></div>
        <p>正在加载用户数据...</p>
      </div>

      <div v-else-if="!filteredUsers.length" class="state-block">
        <p>暂无匹配用户，请调整筛选条件。</p>
      </div>

      <table v-else class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>角色</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" :class="{ inactive: !user.isActive }">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>
              <span :class="['role-badge', `role-${String(user.role || 'user').toLowerCase()}`]">
                {{ user.role?.toUpperCase?.() || 'USER' }}
              </span>
            </td>
            <td>
              <span :class="['status-pill', user.isActive ? 'active' : 'inactive']">
                {{ user.isActive ? '活跃' : '禁用' }}
              </span>
            </td>
            <td class="actions-cell">
              <router-link :to="{ name: 'EditUser', query: { id: user.id } }">
                <BaseButton type="default" size="small">
                  <AppIcon name="edit" className="inline-icon" />
                  编辑
                </BaseButton>
              </router-link>
              <BaseButton type="default" size="small" @click="toggleStatus(user)">
                {{ user.isActive ? '禁用' : '启用' }}
              </BaseButton>
              <BaseButton type="danger" size="small" @click="confirmDelete(user)">
                <AppIcon name="trash" className="inline-icon" />
                删除
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content card">
        <h2>确认删除</h2>
        <p>是否确认删除用户 “{{ selectedUser?.username }}”？该操作不可恢复。</p>
        <div class="modal-actions">
          <BaseButton type="danger" @click="executeDelete">确认删除</BaseButton>
          <BaseButton type="default" @click="showDeleteModal = false">取消</BaseButton>
        </div>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import { downloadText } from '@/utils/download'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import AppIcon from '@/components/base/AppIcon.vue'

export default {
  name: 'UserManagement',
  components: {
    BaseButton,
    BaseInput,
    AppIcon
  },

  setup() {
    const store = useUsersStore()
    const uiStore = useUiStore()
    const loading = ref(false)
    const showDeleteModal = ref(false)
    const selectedUser = ref(null)
    const searchQuery = ref('')
    const roleFilter = ref('all')
    const statusFilter = ref('all')

    const normalizeRole = (role) => (role && typeof role === 'string' ? role.toUpperCase() : 'USER')
    const adminCount = computed(() => store.users.filter(user => normalizeRole(user.role) === 'ADMIN').length)
    const inactiveCount = computed(() => store.users.filter(user => !user.isActive).length)

    const filteredUsers = computed(() => {
      const keyword = searchQuery.value.trim().toLowerCase()
      return store.users.filter(user => {
        const roleValue = normalizeRole(user.role)
        const matchesKeyword =
          !keyword ||
          user.username.toLowerCase().includes(keyword) ||
          String(user.id).includes(keyword) ||
          roleValue.toLowerCase().includes(keyword)

        const matchesRole = roleFilter.value === 'all' || roleValue === roleFilter.value
        const matchesStatus =
          statusFilter.value === 'all' ||
          (statusFilter.value === 'active' && user.isActive) ||
          (statusFilter.value === 'inactive' && !user.isActive)

        return matchesKeyword && matchesRole && matchesStatus
      })
    })

    const confirmDelete = (user) => {
      selectedUser.value = user
      showDeleteModal.value = true
    }

    const executeDelete = async () => {
      try {
        store.deleteUser(selectedUser.value.id)
        uiStore.pushToast({ type: 'success', message: '用户已删除' })
      } catch (error) {
        console.error('删除用户失败:', error)
        uiStore.pushToast({ type: 'error', message: '删除用户失败，请稍后重试' })
      } finally {
        showDeleteModal.value = false
      }
    }

    const toggleStatus = (user) => {
      const nextActive = !user.isActive
      store.toggleUserStatus(user.id)
      uiStore.pushToast({ type: 'success', message: nextActive ? '用户已启用' : '用户已禁用' })
    }

    const exportUsers = () => {
      const rows = store.users.map(user => ({
        ID: user.id,
        用户名: user.username,
        角色: normalizeRole(user.role),
        状态: user.isActive ? '活跃' : '禁用'
      }))

      if (!rows.length) {
        uiStore.pushToast({ type: 'error', message: '没有可导出的用户数据' })
        return
      }

      const headers = Object.keys(rows[0]).join(',')
      const body = rows.map(row => Object.values(row).join(',')).join('\n')
      const csvContent = `${headers}\n${body}`
      downloadText(csvContent, `用户列表_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8')
      uiStore.pushToast({ type: 'success', message: '导出完成' })
    }

    return {
      store,
      loading,
      showDeleteModal,
      selectedUser,
      adminCount,
      inactiveCount,
      searchQuery,
      roleFilter,
      statusFilter,
      filteredUsers,
      confirmDelete,
      executeDelete,
      toggleStatus,
      exportUsers
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: var(--container-padding);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: rgba(15, 23, 42, 0.3);
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-strong);
}

.filter-card {
  background: rgba(15, 23, 42, 0.28);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.table-card {
  overflow-x: auto;
  background: rgba(15, 23, 42, 0.28);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.role-badge {
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.role-admin {
  color: var(--neon-pink);
  border-color: rgba(244, 162, 97, 0.45);
  background: rgba(244, 162, 97, 0.12);
}

.role-user {
  color: var(--neon-blue);
  border-color: rgba(46, 196, 182, 0.45);
  background: rgba(46, 196, 182, 0.12);
}

.status-pill {
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.status-pill.active {
  color: var(--neon-green);
  border-color: rgba(6, 214, 160, 0.45);
  background: rgba(6, 214, 160, 0.12);
}

.status-pill.inactive {
  color: var(--neon-red);
  border-color: rgba(231, 111, 81, 0.45);
  background: rgba(231, 111, 81, 0.12);
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 2.5rem 0;
  color: var(--text-muted);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(46, 196, 182, 0.3);
  border-top-color: var(--neon-blue);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(10, 16, 24, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: min(520px, 90vw);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.inline-icon {
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .actions-cell {
    flex-direction: column;
  }
}
</style>
