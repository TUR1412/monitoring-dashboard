<!-- src/views/UserManagement.vue -->
<template>
  <div class="user-management fade-in">
    <div class="header-section">
      <div>
        <h1 class="title">用户管理控制台</h1>
        <p class="subtitle">统一管理权限、角色与活跃状态</p>
      </div>
      <div class="actions">
        <router-link :to="{ name: 'AddUser' }">
          <button class="btn btn-primary">
            <i class="fas fa-user-plus"></i>
            新增用户
          </button>
        </router-link>
      </div>
    </div>

    <!-- 用户统计卡片 -->
    <div class="stats-cards">
      <div class="card stat-card">
        <h3>总用户数</h3>
        <p class="stat-number">{{ store.users.length }}</p>
      </div>
      <div class="card stat-card">
        <h3>管理员数</h3>
        <p class="stat-number">{{ adminCount }}</p>
      </div>
      <div class="card stat-card">
        <h3>活跃用户</h3>
        <p class="stat-number">{{ activeCount }}</p>
      </div>
    </div>

    <!-- 用户表格，添加加载和空状态处理 -->
    <div class="table-container card">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="!store.users.length" class="empty-state">
        <p>暂无用户数据</p>
      </div>
      
      <table v-else class="table user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>角色</th>
            <th>部门</th>
            <th>最近在线</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in store.users" :key="user.id" :class="{ 'inactive': !user.isActive }">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>
              <span :class="['role-badge', `role-${user.role?.toLowerCase()}`]">
                {{ user.role }}
              </span>
            </td>
            <td>{{ user.department || '未分配' }}</td>
            <td>{{ user.lastSeen || '刚刚' }}</td>
            <td>
              <span :class="['status-indicator', user.isActive ? 'active' : 'inactive']">
                {{ user.isActive ? '活跃' : '禁用' }}
              </span>
            </td>
            <td class="actions-cell">
              <!-- 编辑用户，使用命名路由 -->
              <router-link :to="{ name: 'EditUser', query: { id: user.id } }">
                <button class="btn btn-ghost edit-btn">编辑</button>
              </router-link>
              <button
                class="btn btn-danger delete-btn"
                @click="confirmDelete(user)"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteModal" class="modal glassmorphism">
      <div class="modal-content card">
        <h2>确认删除</h2>
        <p>是否确认删除用户 "{{ selectedUser?.username }}"？</p>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="executeDelete">确认</button>
          <button class="btn btn-ghost" @click="showDeleteModal = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 路由出口，用于渲染子路由 -->
    <router-view />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'

export default {
  name: 'UserManagement',
  
  setup() {
    const store = useMonitorStore()
    const loading = ref(false)
    const showDeleteModal = ref(false)
    const selectedUser = ref(null)

    // 计算管理员数量
    const adminCount = computed(() => {
      return store.users.filter(user => user.role?.toLowerCase() === 'admin').length
    })

    const activeCount = computed(() => {
      return store.users.filter(user => user.isActive).length
    })

    // 删除确认
    const confirmDelete = (user) => {
      selectedUser.value = user
      showDeleteModal.value = true
    }

    // 执行删除
    const executeDelete = async () => {
      try {
        await store.deleteUser(selectedUser.value.id)
        showDeleteModal.value = false
        // 可以添加成功提示
      } catch (error) {
        console.error('删除用户失败:', error)
        // 可以添加错误提示
      }
    }

    return {
      store,
      loading,
      showDeleteModal,
      selectedUser,
      adminCount,
      activeCount,
      confirmDelete,
      executeDelete
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 2rem;
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  margin: 0;
}

.subtitle {
  margin-top: 0.5rem;
  color: var(--text-2);
  font-size: 0.9rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
}

.stat-number {
  font-size: 2rem;
  color: var(--accent-0);
  margin: 0.5rem 0;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 2rem;
  padding: 1rem;
}

.user-table {
  width: 100%;
  border-spacing: 0;
}

.user-table th {
  background-color: rgba(148, 163, 184, 0.12);
  color: var(--text-1);
  font-weight: 600;
  text-align: left;
  padding: 1rem;
}

.user-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.role-admin {
  background-color: rgba(251, 113, 133, 0.2);
  color: #fecaca;
}

.role-user {
  background-color: rgba(34, 211, 238, 0.2);
  color: #bae6fd;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.status-indicator.active {
  background-color: rgba(34, 197, 94, 0.2);
  color: #bbf7d0;
}

.status-indicator.inactive {
  background-color: rgba(148, 163, 184, 0.2);
  color: var(--text-2);
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  background-color: rgba(34, 211, 238, 0.2);
}

.delete-btn {
  background-color: rgba(239, 68, 68, 0.2);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--neon-blue);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--gray-400);
}

/* 模态框 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-management {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .actions-cell {
    flex-direction: column;
  }

  .button-neon {
    width: 100%;
  }
}
</style>
