<!-- src/components/UserManagement/RolePermissions.vue -->
<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import type { Role, AlertType } from '@/types/role'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import AppIcon from '@/components/base/AppIcon.vue'
import { safeStorage } from '@/utils/storage'

interface Alert {
  show: boolean
  message: string
  type: AlertType
  icon: string
}

const STORAGE_KEY = 'monitoring-dashboard:rolePermissions'
const AUDIT_KEY = 'monitoring-dashboard:roleAudit'

const defaultRoles: Role[] = [
  {
    id: 1,
    name: '管理员',
    permissions: [
      { id: 1, name: '用户管理', enabled: true },
      { id: 2, name: '系统设置', enabled: true },
      { id: 3, name: '数据访问', enabled: true }
    ]
  },
  {
    id: 2,
    name: '普通用户',
    permissions: [
      { id: 1, name: '用户管理', enabled: false },
      { id: 2, name: '系统设置', enabled: false },
      { id: 3, name: '数据访问', enabled: true }
    ]
  }
]

const roles = reactive<Role[]>([])

const editingRole = ref<Role | null>(null)
const selectedRole = ref<Role | null>(null)
const showDeleteModal = ref(false)
const editingName = ref('')
const isEditingName = ref(false)
const auditQuery = ref('')

const auditLogs = ref([
  {
    id: Date.now(),
    action: '策略初始化',
    detail: '加载默认角色与权限配置',
    time: new Date().toLocaleString('zh-CN', { hour12: false })
  }
])

const alert = reactive<Alert>({
  show: false,
  message: '',
  type: 'success',
  icon: 'check'
})

const totalRoles = computed(() => roles.length)
const totalPermissions = computed(() => {
  const set = new Set<string>()
  roles.forEach(role => role.permissions.forEach(permission => set.add(permission.name)))
  return set.size
})

const permissionMatrix = computed(() => {
  const set = new Set<string>()
  roles.forEach(role => role.permissions.forEach(permission => set.add(permission.name)))
  return Array.from(set)
})

const filteredAudits = computed(() => {
  const keyword = auditQuery.value.trim().toLowerCase()
  if (!keyword) return auditLogs.value
  return auditLogs.value.filter(log =>
    log.action.toLowerCase().includes(keyword) || log.detail.toLowerCase().includes(keyword)
  )
})

const persistRoles = () => {
  safeStorage.set(STORAGE_KEY, roles)
}

const persistAudit = () => {
  safeStorage.set(AUDIT_KEY, auditLogs.value)
}

const recordAudit = (action: string, detail: string) => {
  auditLogs.value.unshift({
    id: Date.now(),
    action,
    detail,
    time: new Date().toLocaleString('zh-CN', { hour12: false })
  })
  persistAudit()
}

const loadState = () => {
  const savedRoles = safeStorage.get(STORAGE_KEY, null)
  if (savedRoles && Array.isArray(savedRoles)) {
    roles.splice(0, roles.length, ...savedRoles)
  } else {
    roles.splice(0, roles.length, ...defaultRoles)
  }

  const savedAudit = safeStorage.get(AUDIT_KEY, null)
  if (savedAudit && Array.isArray(savedAudit)) {
    auditLogs.value = savedAudit
  }
}

const editRole = (role: Role) => {
  editingRole.value = role
  editingName.value = role.name
  isEditingName.value = true
  showAlert(`正在编辑角色：${role.name}`, 'info')

  nextTick(() => {
    const nameInput = document.querySelector('.role-name-input') as HTMLInputElement | null
    if (nameInput) {
      nameInput.focus()
      nameInput.select()
    }
  })
}

const saveRoleName = (role: Role) => {
  if (editingName.value.trim()) {
    role.name = editingName.value.trim()
    isEditingName.value = false
    editingRole.value = null
    showAlert('角色名称已更新', 'success')
    recordAudit('角色更名', `角色更新为：${role.name}`)
    persistRoles()
  } else {
    showAlert('角色名称不能为空', 'error')
  }
}

const cancelEdit = () => {
  editingRole.value = null
  isEditingName.value = false
  showAlert('已取消编辑', 'info')
}

const addNewRole = () => {
  const newRole: Role = {
    id: roles.length + 1,
    name: `新角色 ${roles.length + 1}`,
    permissions: [
      { id: 1, name: '用户管理', enabled: false },
      { id: 2, name: '系统设置', enabled: false },
      { id: 3, name: '数据访问', enabled: false }
    ]
  }
  roles.push(newRole)
  editRole(newRole)
  showAlert('角色添加成功', 'success')
  recordAudit('新增角色', `创建 ${newRole.name}`)
  persistRoles()
}

const confirmDelete = (role: Role) => {
  selectedRole.value = role
  showDeleteModal.value = true
}

const deleteRole = () => {
  if (selectedRole.value) {
    const index = roles.findIndex(role => role.id === selectedRole.value?.id)
    if (index !== -1) {
      const roleName = selectedRole.value.name
      roles.splice(index, 1)
      showAlert(`角色 "${roleName}" 已删除`, 'warning')
      recordAudit('删除角色', `删除 ${roleName}`)
      persistRoles()
      closeModal()
    }
  }
}

const togglePermission = (roleId: number, permId: number) => {
  const role = roles.find(r => r.id === roleId)
  if (role) {
    const perm = role.permissions.find(p => p.id === permId)
    if (perm) {
      perm.enabled = !perm.enabled
      showAlert(`权限更新成功`, 'success')
      recordAudit('权限变更', `${role.name}：${perm.name} 已${perm.enabled ? '启用' : '关闭'}`)
      persistRoles()
    }
  }
}

const togglePermissionByName = (roleId: number, permName: string) => {
  const role = roles.find(r => r.id === roleId)
  if (!role) return
  const existing = role.permissions.find(p => p.name === permName)
  if (existing) {
    togglePermission(roleId, existing.id)
    return
  }
  const nextId = Math.max(0, ...role.permissions.map(p => p.id)) + 1
  role.permissions.push({
    id: nextId,
    name: permName,
    enabled: true
  })
  showAlert('权限更新成功', 'success')
  recordAudit('权限新增', `${role.name}：新增 ${permName}`)
  persistRoles()
}

const setAllPermissions = (enabled: boolean) => {
  roles.forEach(role => {
    role.permissions.forEach(permission => {
      permission.enabled = enabled
    })
  })
  showAlert(enabled ? '全部权限已启用' : '全部权限已关闭', 'warning')
  recordAudit('批量权限', enabled ? '全量启用权限' : '全量关闭权限')
  persistRoles()
}

const showAlert = (message: string, type: AlertType = 'success') => {
  const icons: Record<AlertType, string> = {
    success: 'check',
    warning: 'alert',
    error: 'x',
    info: 'file'
  }

  alert.message = message
  alert.type = type
  alert.icon = icons[type]
  alert.show = true

  setTimeout(() => {
    alert.show = false
  }, 3000)
}

const closeModal = () => {
  showDeleteModal.value = false
  selectedRole.value = null
}

onMounted(() => {
  loadState()
})
</script>

<template>
  <div class="role-permissions fade-in">
    <Transition name="fade">
      <div v-if="alert.show" :class="['alert-banner', `alert-${alert.type}`]">
        <AppIcon :name="alert.icon" :size="18" />
        <span>{{ alert.message }}</span>
      </div>
    </Transition>

    <header class="header">
      <div>
        <h2 class="page-title">角色权限管理</h2>
        <p class="subtitle">统一维护角色能力边界，变更实时生效。</p>
      </div>
      <BaseButton type="primary" @click="addNewRole">
        <AppIcon name="plus" :size="14" />
        添加角色
      </BaseButton>
    </header>

    <div class="stats-row">
      <span class="stat-chip"><AppIcon name="users" :size="14" /> 角色数 {{ totalRoles }}</span>
      <span class="stat-chip"><AppIcon name="lock" :size="14" /> 权限项 {{ totalPermissions }}</span>
      <BaseButton type="default" size="small" @click="setAllPermissions(true)">
        一键启用
      </BaseButton>
      <BaseButton type="danger" size="small" @click="setAllPermissions(false)">
        一键关闭
      </BaseButton>
    </div>

    <div class="roles-grid">
      <div
        v-for="role in roles"
        :key="role.id"
        class="card role-card"
        :class="{ editing: editingRole?.id === role.id }"
      >
        <div class="role-header">
          <div class="role-title">
            <div v-if="isEditingName && editingRole?.id === role.id" class="role-name-edit">
              <input
                v-model="editingName"
                type="text"
                class="role-name-input"
                @keyup.enter="saveRoleName(role)"
                @blur="saveRoleName(role)"
              />
            </div>
            <h3 v-else @dblclick="editRole(role)">{{ role.name }}</h3>
          </div>
          <div class="role-actions">
            <template v-if="editingRole?.id === role.id">
              <BaseButton type="default" size="small" @click="saveRoleName(role)">
                <AppIcon name="check" :size="14" />
                保存
              </BaseButton>
              <BaseButton type="danger" size="small" @click="cancelEdit">
                取消
              </BaseButton>
            </template>
            <template v-else>
              <BaseButton type="default" size="small" @click="editRole(role)">
                <AppIcon name="edit" :size="14" />
                编辑
              </BaseButton>
              <BaseButton type="danger" size="small" @click="confirmDelete(role)">
                <AppIcon name="trash" :size="14" />
                删除
              </BaseButton>
            </template>
          </div>
        </div>

        <div class="permissions-list">
          <label v-for="perm in role.permissions" :key="perm.id" class="permission-item">
            <input
              type="checkbox"
              :checked="perm.enabled"
              @change="togglePermission(role.id, perm.id)"
            />
            <span>{{ perm.name }}</span>
          </label>
        </div>
      </div>
    </div>

    <section class="card matrix-card">
      <div class="section-header">
        <div class="section-title">
          <span class="icon-badge">
            <AppIcon name="dashboard" :size="18" />
          </span>
          权限矩阵
        </div>
        <span class="section-meta">矩阵视图支持跨角色对齐权限</span>
      </div>
      <div class="matrix-table">
        <table>
          <thead>
            <tr>
              <th>权限</th>
              <th v-for="role in roles" :key="role.id">{{ role.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="perm in permissionMatrix" :key="perm">
              <td>{{ perm }}</td>
              <td v-for="role in roles" :key="role.id">
                <label class="matrix-toggle">
                  <input
                    type="checkbox"
                    :checked="role.permissions.find(p => p.name === perm)?.enabled"
                    @change="togglePermissionByName(role.id, perm)"
                  />
                  <span></span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card audit-card">
      <div class="section-header">
        <div class="section-title">
          <span class="icon-badge">
            <AppIcon name="history" :size="18" />
          </span>
          审计日志
        </div>
        <BaseInput v-model="auditQuery" placeholder="搜索审计记录" />
      </div>
      <div class="audit-list">
        <div v-for="log in filteredAudits" :key="log.id" class="audit-item">
          <div class="audit-main">
            <span class="audit-action">{{ log.action }}</span>
            <span class="audit-time">{{ log.time }}</span>
          </div>
          <p class="audit-detail">{{ log.detail }}</p>
        </div>
        <div v-if="!filteredAudits.length" class="empty-state">暂无审计记录</div>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click="closeModal">
          <div class="modal card" @click.stop>
            <h3>确认删除</h3>
            <p>确定要删除角色 “{{ selectedRole?.name }}” 吗？该操作不可恢复。</p>
            <div class="modal-actions">
              <BaseButton type="default" @click="closeModal">取消</BaseButton>
              <BaseButton type="danger" @click="deleteRole">确认删除</BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.role-permissions {
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

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.section-meta {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.icon-badge {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(46, 196, 182, 0.18);
  color: var(--neon-blue);
  border: 1px solid rgba(46, 196, 182, 0.35);
}

.role-card {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.role-card.editing {
  border-color: rgba(46, 196, 182, 0.6);
  box-shadow: 0 0 18px rgba(46, 196, 182, 0.2);
}

.role-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.role-title h3 {
  margin: 0;
  font-size: 1.1rem;
}

.role-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.role-name-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(46, 196, 182, 0.5);
  background: rgba(15, 23, 42, 0.4);
  color: var(--text-strong);
}

.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-muted);
  font-size: 0.92rem;
}

.permission-item input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--neon-blue);
}

.matrix-card {
  background: rgba(15, 23, 42, 0.28);
}

.matrix-table {
  overflow-x: auto;
}

.matrix-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.matrix-toggle input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--neon-blue);
}

.audit-card {
  background: rgba(15, 23, 42, 0.28);
}

.audit-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.audit-item {
  padding: 0.9rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.3);
}

.audit-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.audit-action {
  font-weight: 600;
}

.audit-time {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.audit-detail {
  margin-top: 0.4rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 1rem 0;
}

.alert-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
}

.alert-success {
  color: var(--neon-green);
  border-color: rgba(6, 214, 160, 0.4);
  background: rgba(6, 214, 160, 0.12);
}

.alert-warning {
  color: var(--neon-yellow);
  border-color: rgba(246, 189, 96, 0.4);
  background: rgba(246, 189, 96, 0.12);
}

.alert-error {
  color: var(--neon-red);
  border-color: rgba(231, 111, 81, 0.4);
  background: rgba(231, 111, 81, 0.12);
}

.alert-info {
  color: var(--neon-blue);
  border-color: rgba(46, 196, 182, 0.4);
  background: rgba(46, 196, 182, 0.12);
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
