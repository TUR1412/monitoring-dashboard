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
          <BaseButton type="primary">
            <i class="fas fa-user-plus"></i>
            新增用户
          </BaseButton>
        </router-link>
        <BaseButton type="ghost" @click="exportUsers">
          <i class="fas fa-download"></i>
          导出名单
        </BaseButton>
      </div>
    </div>

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
      <div class="card stat-card">
        <h3>禁用用户</h3>
        <p class="stat-number">{{ disabledCount }}</p>
      </div>
    </div>

    <div class="surface-card filter-panel">
      <div class="filter-grid">
        <div class="filter-group">
          <span class="filter-label">搜索</span>
          <BaseInput
            v-model="searchQuery"
            placeholder="用户名 / 部门 / ID"
          />
        </div>
        <div class="filter-group">
          <span class="filter-label">角色</span>
          <select v-model="roleFilter">
            <option value="all">全部角色</option>
            <option v-for="role in roleOptions" :key="role" :value="role">
              {{ roleLabel(role) }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <span class="filter-label">状态</span>
          <select v-model="statusFilter">
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="inactive">禁用</option>
          </select>
        </div>
        <div class="filter-group">
          <span class="filter-label">排序</span>
          <select v-model="sortKey">
            <option value="recent">最近在线</option>
            <option value="role">角色</option>
            <option value="name">用户名</option>
          </select>
        </div>
      </div>

      <div class="bulk-bar">
        <label class="select-all">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
          />
          <span>已选 {{ selectedIds.length }} / {{ filteredUsers.length }}</span>
        </label>
        <div class="bulk-actions">
          <BaseButton type="success" size="small" @click="bulkEnable">
            批量启用
          </BaseButton>
          <BaseButton type="warning" size="small" @click="bulkDisable">
            批量禁用
          </BaseButton>
          <BaseButton type="danger" size="small" @click="bulkDelete">
            批量删除
          </BaseButton>
          <BaseButton type="ghost" size="small" @click="clearSelection">
            清空选择
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="surface-card template-panel">
      <div class="panel-header">
        <div>
          <h3>角色模板</h3>
          <p>一键套用角色与部门配置</p>
        </div>
        <span class="pill">已选 {{ selectedIds.length }} 人</span>
      </div>
      <div class="template-grid">
        <div v-for="template in roleTemplates" :key="template.id" class="template-card">
          <div class="template-title">{{ template.name }}</div>
          <div class="template-meta">角色：{{ roleLabel(template.role) }}</div>
          <div class="template-meta">部门：{{ template.department }}</div>
          <p class="template-desc">{{ template.description }}</p>
          <BaseButton type="ghost" size="small" @click="requestApplyTemplate(template)">
            应用模板
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="table-container card">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="!filteredUsers.length" class="empty-state">
        <p>暂无匹配用户</p>
      </div>
      
      <table v-else class="table user-table">
        <thead>
          <tr>
            <th></th>
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
          <tr v-for="user in sortedUsers" :key="user.id" :class="{ 'inactive': !user.isActive }">
            <td>
              <input
                type="checkbox"
                :checked="isSelected(user.id)"
                @change="toggleSelect(user.id)"
              />
            </td>
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>
              <span :class="['role-badge', `role-${roleClass(user.role)}`]">
                {{ roleLabel(user.role) }}
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
              <router-link :to="{ name: 'EditUser', query: { id: user.id } }">
                <BaseButton type="ghost" size="small">编辑</BaseButton>
              </router-link>
              <BaseButton
                :type="user.isActive ? 'warning' : 'success'"
                size="small"
                @click="toggleStatus(user)"
              >
                {{ user.isActive ? '禁用' : '启用' }}
              </BaseButton>
              <BaseButton type="danger" size="small" @click="confirmDelete([user.id])">
                删除
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="deleteModalOpen" title="确认删除" width="520px">
      <p class="modal-text">确认删除选中的 {{ pendingDeleteIds.length }} 位用户？该操作不可恢复。</p>
      <template #footer>
        <div class="modal-actions">
          <BaseButton type="ghost" size="small" @click="deleteModalOpen = false">取消</BaseButton>
          <BaseButton type="danger" size="small" @click="executeDelete">确认删除</BaseButton>
        </div>
      </template>
    </BaseModal>

    <BaseModal v-model="templateModalOpen" title="应用角色模板" width="520px">
      <p class="modal-text">
        确认将模板「{{ pendingTemplate?.name }}」应用到
        {{ selectedIds.length }} 位用户？
      </p>
      <template #footer>
        <div class="modal-actions">
          <BaseButton type="ghost" size="small" @click="templateModalOpen = false">取消</BaseButton>
          <BaseButton type="primary" size="small" @click="applyTemplate">确认应用</BaseButton>
        </div>
      </template>
    </BaseModal>

    <router-view />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { saveAs } from 'file-saver'
import { useMonitorStore } from '@/stores/monitorStore'
import { notify } from '@/utils/notify'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'

const store = useMonitorStore()
const loading = ref(false)

const searchQuery = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const sortKey = ref('recent')
const selectedIds = ref([])

const deleteModalOpen = ref(false)
const templateModalOpen = ref(false)
const pendingDeleteIds = ref([])
const pendingTemplate = ref(null)

const roleTemplates = [
  {
    id: 'tpl-ops',
    name: 'SRE 核心值班组',
    role: 'ADMIN',
    department: 'SRE',
    description: '关键链路运维人员，具备高权限与应急处置能力。'
  },
  {
    id: 'tpl-noc',
    name: '监控值班席',
    role: 'USER',
    department: 'NOC',
    description: '负责监控与告警处理，具备常规操作权限。'
  },
  {
    id: 'tpl-audit',
    name: '审计只读组',
    role: 'VIEWER',
    department: 'Audit',
    description: '只读权限，适用于合规审计与领导查看。'
  }
]

const roleLabel = (role) => {
  const normalized = String(role || '').toUpperCase()
  const map = {
    ADMIN: '管理员',
    USER: '普通用户',
    VIEWER: '只读用户',
    OPS: '运维'
  }
  return map[normalized] || normalized || '未知'
}

const roleClass = (role) => String(role || '').toLowerCase()

const roleOptions = computed(() => {
  const roles = new Set(
    store.users.map(user => String(user.role || '').toUpperCase()).filter(Boolean)
  )
  return Array.from(roles)
})

const filteredUsers = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  return store.users.filter(user => {
    const matchesRole = roleFilter.value === 'all' || String(user.role || '').toUpperCase() === roleFilter.value
    const matchesStatus = statusFilter.value === 'all' ||
      (statusFilter.value === 'active' ? user.isActive : !user.isActive)
    const haystack = `${user.username} ${user.department || ''} ${user.id}`.toLowerCase()
    const matchesKeyword = keyword ? haystack.includes(keyword) : true
    return matchesRole && matchesStatus && matchesKeyword
  })
})

const sortedUsers = computed(() => {
  const data = [...filteredUsers.value]
  if (sortKey.value === 'name') {
    data.sort((a, b) => String(a.username).localeCompare(String(b.username)))
  } else if (sortKey.value === 'role') {
    data.sort((a, b) => String(a.role).localeCompare(String(b.role)))
  } else {
    data.sort((a, b) => String(b.lastSeen || '').localeCompare(String(a.lastSeen || '')))
  }
  return data
})

const adminCount = computed(() =>
  store.users.filter(user => String(user.role || '').toUpperCase() === 'ADMIN').length
)
const activeCount = computed(() => store.users.filter(user => user.isActive).length)
const disabledCount = computed(() => store.users.filter(user => !user.isActive).length)

const isSelected = (id) => selectedIds.value.includes(String(id))
const isAllSelected = computed(() =>
  filteredUsers.value.length > 0 &&
  selectedIds.value.length === filteredUsers.value.length
)

const toggleSelect = (id) => {
  const normalized = String(id)
  if (selectedIds.value.includes(normalized)) {
    selectedIds.value = selectedIds.value.filter(item => item !== normalized)
  } else {
    selectedIds.value = [...selectedIds.value, normalized]
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filteredUsers.value.map(user => String(user.id))
  }
}

const clearSelection = () => {
  selectedIds.value = []
}

const bulkEnable = () => {
  if (!selectedIds.value.length) {
    notify.info('请先选择需要启用的用户')
    return
  }
  store.setUserStatusBatch(selectedIds.value, true)
  notify.success(`已启用 ${selectedIds.value.length} 位用户`)
  clearSelection()
}

const bulkDisable = () => {
  if (!selectedIds.value.length) {
    notify.info('请先选择需要禁用的用户')
    return
  }
  store.setUserStatusBatch(selectedIds.value, false)
  notify.warning(`已禁用 ${selectedIds.value.length} 位用户`)
  clearSelection()
}

const bulkDelete = () => {
  if (!selectedIds.value.length) {
    notify.info('请先选择需要删除的用户')
    return
  }
  confirmDelete(selectedIds.value)
}

const confirmDelete = (ids) => {
  pendingDeleteIds.value = ids.map(id => String(id))
  deleteModalOpen.value = true
}

const executeDelete = () => {
  store.deleteUsers(pendingDeleteIds.value)
  notify.success('用户已删除')
  deleteModalOpen.value = false
  clearSelection()
}

const toggleStatus = (user) => {
  const nextLabel = user.isActive ? '禁用' : '启用'
  store.toggleUserStatus(user.id)
  notify.info(`已${nextLabel}用户`)
}

const requestApplyTemplate = (template) => {
  if (!selectedIds.value.length) {
    notify.info('请先选择需要应用模板的用户')
    return
  }
  pendingTemplate.value = template
  templateModalOpen.value = true
}

const applyTemplate = () => {
  if (!pendingTemplate.value) return
  store.applyRoleTemplate(selectedIds.value, pendingTemplate.value)
  notify.success('模板已应用')
  templateModalOpen.value = false
  clearSelection()
}

const escapeCsv = (value) => {
  const stringValue = String(value ?? '')
  return `"${stringValue.replace(/\"/g, '\"\"')}"`
}

const exportUsers = () => {
  if (!filteredUsers.value.length) {
    notify.info('暂无可导出的用户')
    return
  }
  const header = ['ID', '用户名', '角色', '部门', '最近在线', '状态']
  const rows = filteredUsers.value.map(user => ([
    user.id,
    user.username,
    roleLabel(user.role),
    user.department || '未分配',
    user.lastSeen || '刚刚',
    user.isActive ? '活跃' : '禁用'
  ]))
  const csv = [header, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, `users-${Date.now()}.csv`)
  notify.success('名单已导出')
}

watch(filteredUsers, (next) => {
  const visible = new Set(next.map(user => String(user.id)))
  selectedIds.value = selectedIds.value.filter(id => visible.has(id))
})
</script>

<style scoped>
.user-management {
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
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

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
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

.filter-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filter-label {
  font-size: 0.8rem;
  color: var(--text-2);
}

.bulk-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border);
}

.select-all {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-2);
  font-size: 0.85rem;
}

.bulk-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.template-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.panel-header p {
  margin-top: 0.35rem;
  color: var(--text-2);
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.template-card {
  padding: 1.2rem;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(148, 163, 184, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.template-title {
  font-weight: 600;
  color: var(--text-0);
}

.template-meta {
  font-size: 0.8rem;
  color: var(--text-2);
}

.template-desc {
  font-size: 0.85rem;
  color: var(--text-3);
}

.table-container {
  overflow-x: auto;
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

.role-user,
.role-viewer {
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
  flex-wrap: wrap;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--gray-400);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--neon-blue);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.modal-text {
  color: var(--text-1);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .user-management {
    padding: 1rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
