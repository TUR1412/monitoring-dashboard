<!-- src/components/RolePermissions.vue -->
<script setup lang="ts">
import { ref, reactive, nextTick, computed, watch, onMounted } from 'vue'
import type { Role, AlertType } from '@/types/role'
import { notify } from '@/utils/notify'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

// Types
interface Alert {
  show: boolean
  message: string
  type: AlertType
  icon: string
}

// State
const createDefaultRoles = () => ([
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
])

const roles = reactive<Role[]>(createDefaultRoles())

const STORAGE_KEY = 'md:roles-permissions'
const editingRole = ref<Role | null>(null)
const selectedRole = ref<Role | null>(null)
const showDeleteModal = ref(false)
const searchQuery = ref('')
const alert = reactive<Alert>({
  show: false,
  message: '',
  type: 'success',
  icon: 'fas fa-check-circle'
})

// 新增状态变量
const editingName = ref('')
const isEditingName = ref(false)

// 新增方法
const query = computed(() => searchQuery.value.trim().toLowerCase())

const roleStats = computed(() => {
  const totalRoles = roles.length
  const totalPermissions = roles.reduce((sum, role) => sum + role.permissions.length, 0)
  const enabledPermissions = roles.reduce(
    (sum, role) => sum + role.permissions.filter(perm => perm.enabled).length,
    0
  )
  return {
    totalRoles,
    totalPermissions,
    enabledPermissions
  }
})

const filteredRoles = computed(() => {
  const value = query.value
  if (!value) return roles
  return roles.filter((role) => {
    const nameMatch = role.name.toLowerCase().includes(value)
    const permissionMatch = role.permissions.some(perm => perm.name.toLowerCase().includes(value))
    return nameMatch || permissionMatch
  })
})

const getVisiblePermissions = (role: Role) => {
  const value = query.value
  if (!value || role.name.toLowerCase().includes(value)) return role.permissions
  return role.permissions.filter(perm => perm.name.toLowerCase().includes(value))
}

const getNextRoleId = () => roles.reduce((max, role) => Math.max(max, role.id), 0) + 1

const normalizeRoles = (data: unknown) => {
  if (!Array.isArray(data)) return []
  return data.map((role, index) => {
    const safeRole = role && typeof role === 'object' ? role : {}
    const permissions = Array.isArray(safeRole.permissions) ? safeRole.permissions : []
    return {
      id: Number.isFinite(safeRole.id) ? Number(safeRole.id) : index + 1,
      name: typeof safeRole.name === 'string' && safeRole.name.trim()
        ? safeRole.name.trim()
        : `角色 ${index + 1}`,
      permissions: permissions.map((perm, permIndex) => ({
        id: Number.isFinite(perm?.id) ? Number(perm.id) : permIndex + 1,
        name: typeof perm?.name === 'string' && perm.name.trim()
          ? perm.name.trim()
          : `权限 ${permIndex + 1}`,
        enabled: Boolean(perm?.enabled)
      }))
    }
  })
}

const enabledCount = (role: Role) => role.permissions.filter(perm => perm.enabled).length

const setAllPermissions = (role: Role, enabled: boolean) => {
  role.permissions.forEach((perm) => {
    perm.enabled = enabled
  })
  showAlert(enabled ? '已启用全部权限' : '已禁用全部权限', enabled ? 'success' : 'warning')
}

const exportRoles = () => {
  if (typeof window === 'undefined') return
  const payload = JSON.stringify(roles, null, 2)
  const blob = new Blob([payload], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `roles-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
  notify.success('角色权限已导出')
}

const resetRoles = async () => {
  const confirmed = await notify.confirm('确定要重置角色配置到默认状态吗？', '重置角色')
  if (!confirmed) return
  roles.splice(0, roles.length, ...createDefaultRoles())
  showAlert('角色配置已重置', 'info')
}

/**
 * 开始编辑角色名称
 * @param role 要编辑的角色
 */
const editRole = (role: Role) => {
  editingRole.value = role
  editingName.value = role.name
  isEditingName.value = true
  showAlert(`正在编辑角色：${role.name}`, 'info')
  
  // 使用 nextTick 确保在 DOM 更新后聚焦输入框
  nextTick(() => {
    const nameInput = document.querySelector('.role-name-input .base-input') as HTMLInputElement
    if (nameInput) {
      nameInput.focus()
      nameInput.select()
    }
  })
}

/**
 * 保存编辑后的角色名称
 * @param role 被编辑的角色
 */
const saveRoleName = (role: Role) => {
  if (editingName.value.trim()) {
    role.name = editingName.value.trim()
    isEditingName.value = false
    editingRole.value = null  // 保存后退出编辑状态
    showAlert('角色名称已更新', 'success')
  } else {
    showAlert('角色名称不能为空', 'error')
  }
}

/**
 * 取消编辑角色名称
 */
const cancelEdit = () => {
  editingRole.value = null
  isEditingName.value = false
  editingName.value = ''
  showAlert('已取消编辑', 'info')
}

/**
 * 添加新角色并进入编辑模式
 */
const addNewRole = () => {
  const nextId = getNextRoleId()
  const newRole: Role = {
    id: nextId,
    name: `新角色 ${nextId}`,
    permissions: [
      { id: 1, name: '用户管理', enabled: false },
      { id: 2, name: '系统设置', enabled: false },
      { id: 3, name: '数据访问', enabled: false }
    ]
  }
  roles.push(newRole)
  editRole(newRole)
  showAlert('角色添加成功', 'success')
}

/**
 * 确认编辑角色
 * @param role 要编辑的角色
 */
const confirmEditRole = (role: Role) => {
  editRole(role)
}

/**
 * 确认删除角色
 * @param role 要删除的角色
 */
const confirmDelete = (role: Role) => {
  selectedRole.value = role
  showDeleteModal.value = true
}

/**
 * 删除选定的角色
 */
const deleteRole = () => {
  if (selectedRole.value) {
    const index = roles.findIndex(role => role.id === selectedRole.value?.id)
    if (index !== -1) {
      roles.splice(index, 1)
      showAlert(`角色 "${selectedRole.value.name}" 已删除`, 'warning')
      closeModal()
    }
  }
}

/**
 * 切换角色的权限
 * @param roleId 角色ID
 * @param permId 权限ID
 */
const togglePermission = (roleId: number, permId: number) => {
  const role = roles.find(r => r.id === roleId)
  if (role) {
    const perm = role.permissions.find(p => p.id === permId)
    if (perm) {
      perm.enabled = !perm.enabled
      showAlert(`权限更新成功`, 'success')
    }
  }
}

/**
 * 显示警报
 * @param message 警报信息
 * @param type 警报类型
 */
const showAlert = (message: string, type: AlertType = 'success') => {
  const icons = {
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle',
    info: 'fas fa-info-circle'
  }
  
  alert.message = message
  alert.type = type
  alert.icon = icons[type]
  alert.show = true
  
  setTimeout(() => {
    alert.show = false
  }, 3000)
}

/**
 * 关闭删除确认模态框
 */
const closeModal = () => {
  showDeleteModal.value = false
  selectedRole.value = null
}

onMounted(() => {
  if (typeof window === 'undefined') return
  const cached = window.localStorage.getItem(STORAGE_KEY)
  if (!cached) return
  try {
    const parsed = JSON.parse(cached)
    const normalized = normalizeRoles(parsed)
    if (normalized.length > 0) {
      roles.splice(0, roles.length, ...normalized)
    }
  } catch (error) {
    window.localStorage.removeItem(STORAGE_KEY)
  }
})

watch(
  roles,
  (value) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true }
)
</script>

<template>
  <div class="role-permissions">
    <!-- Alert Component -->
    <Transition name="fade">
      <div
        v-if="alert.show"
        :class="['alert', `alert--${alert.type}`]"
      >
        <div class="alert__content">
          <i :class="['alert__icon', alert.icon]" />
          <span>{{ alert.message }}</span>
        </div>
      </div>
    </Transition>

    <!-- Header -->
    <div class="header">
      <h2 class="header__title">角色权限管理</h2>
      <BaseButton type="primary" icon="Plus" @click="addNewRole">
        添加角色
      </BaseButton>
    </div>

    <div class="role-toolbar">
      <div class="role-toolbar__search">
        <BaseInput
          v-model="searchQuery"
          placeholder="搜索角色或权限..."
        />
      </div>
      <div class="role-toolbar__stats">
        <span class="role-stat">角色 {{ roleStats.totalRoles }}</span>
        <span class="role-stat">
          已启用权限 {{ roleStats.enabledPermissions }}/{{ roleStats.totalPermissions }}
        </span>
      </div>
      <div class="role-toolbar__actions">
        <BaseButton type="ghost" size="small" @click="exportRoles">
          导出配置
        </BaseButton>
        <BaseButton type="ghost" size="small" @click="resetRoles">
          重置默认
        </BaseButton>
      </div>
    </div>

    <!-- Roles Grid -->
    <div class="roles-grid">
      <div v-if="filteredRoles.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <i class="fas fa-user-shield"></i>
        </div>
        <div class="empty-state__title">未找到匹配的角色或权限</div>
        <div class="empty-state__desc">试试调整关键词，或者创建一个新的角色模板。</div>
        <BaseButton type="primary" icon="Plus" @click="addNewRole">
          创建新角色
        </BaseButton>
      </div>
      <div
        v-for="role in filteredRoles"
        :key="role.id"
        :class="['role-card', { 'role-card--editing': editingRole?.id === role.id }]"
      >
        <div class="role-card__header">
          <div v-if="isEditingName && editingRole?.id === role.id" class="role-name-edit">
            <BaseInput
              v-model="editingName"
              type="text"
              class="role-name-input"
              @keyup.enter="saveRoleName(role)"
              @blur="saveRoleName(role)"
            />
          </div>
          <h3 v-else class="role-card__title" @dblclick="editRole(role)">
            {{ role.name }}
          </h3>
          <div class="role-card__actions">
            <span class="role-chip">
              {{ enabledCount(role) }}/{{ role.permissions.length }} 已启用
            </span>
            <template v-if="editingRole?.id === role.id">
              <BaseButton
                class="role-action"
                type="success"
                size="small"
                icon="Check"
                aria-label="保存角色名称"
                @click="saveRoleName(role)"
              />
              <BaseButton
                class="role-action"
                type="ghost"
                size="small"
                icon="Close"
                aria-label="取消编辑角色"
                @click="cancelEdit"
              />
            </template>
            <template v-else>
              <BaseButton
                class="role-action"
                type="info"
                size="small"
                icon="Edit"
                aria-label="编辑角色"
                @click="editRole(role)"
              />
              <BaseButton
                class="role-action"
                type="danger"
                size="small"
                icon="Delete"
                aria-label="删除角色"
                @click="confirmDelete(role)"
              />
            </template>
          </div>
        </div>

        <div class="permissions-list">
          <div
            v-for="perm in getVisiblePermissions(role)"
            :key="perm.id"
            class="permission-item"
          >
            <label class="permission-label">
              <input
                type="checkbox"
                :checked="perm.enabled"
                @change="togglePermission(role.id, perm.id)"
              >
              <span class="permission-label__text">{{ perm.name }}</span>
            </label>
          </div>
        </div>

        <div class="role-card__footer">
          <BaseButton type="success" size="small" @click="setAllPermissions(role, true)">
            全部启用
          </BaseButton>
          <BaseButton type="ghost" size="small" @click="setAllPermissions(role, false)">
            全部禁用
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteModal"
          class="modal-overlay"
          @click="closeModal"
        >
          <div
            class="modal"
            @click.stop
          >
            <h3 class="modal__title">确认删除</h3>
            <p class="modal__text">
              确定要删除角色 "{{ selectedRole?.name }}" 吗？
            </p>
            <div class="modal__actions">
              <BaseButton
                type="ghost"
                @click="closeModal"
              >
                取消
              </BaseButton>
              <BaseButton
                type="danger"
                @click="deleteRole"
              >
                确认删除
              </BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.role-permissions {
  --rp-spacing-sm: 0.5rem;
  --rp-spacing-md: 1rem;
  --rp-spacing-lg: 1.5rem;
  --rp-spacing-xl: 2rem;
  
  padding: var(--rp-spacing-xl);
  background-color: var(--background-color);
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--rp-spacing-xl);
}

.header__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--heading-color);
}

/* Toolbar */
.role-toolbar {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) auto auto;
  gap: var(--rp-spacing-md);
  align-items: center;
  margin-bottom: var(--rp-spacing-xl);
}

.role-toolbar__search {
  width: 100%;
}

.role-toolbar__stats {
  display: flex;
  gap: var(--rp-spacing-sm);
  flex-wrap: wrap;
}

.role-toolbar__actions {
  display: flex;
  gap: var(--rp-spacing-sm);
  justify-content: flex-end;
}

.role-stat {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 0.85rem;
}

/* Button Styles */
.role-action.btn {
  padding: 0.35rem;
  width: 2.1rem;
  height: 2.1rem;
}

.role-action .icon {
  width: 1rem;
  height: 1rem;
}

/* Roles Grid */
.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--rp-spacing-lg);
}

/* Role Card */
.role-card {
  background-color: var(--card-background-color);
  border-radius: 0.5rem;
  padding: var(--rp-spacing-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.role-card--editing {
  border-color: var(--neon-blue);
  box-shadow: 0 0 20px var(--neon-blue);
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px var(--neon-blue);
}

.role-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--rp-spacing-md);
}

.role-card__title {
  font-size: 1.25rem;
  color: var(--heading-color);
  cursor: pointer;
}

.role-card__title:hover {
  text-decoration: underline;
}

.role-card__actions {
  display: flex;
  gap: var(--rp-spacing-sm);
  align-items: center;
  flex-wrap: wrap;
}

.role-chip {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: var(--text-color);
  font-size: 0.75rem;
}

/* 新增样式 */
.role-name-edit {
  flex: 1;
  margin-right: var(--rp-spacing-md);
}

.role-name-input {
  width: 100%;
}

.role-name-input .base-input {
  font-size: 1.1rem;
  border-color: rgba(56, 189, 248, 0.6);
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.2);
}

/* Permissions List */
.permissions-list {
  display: flex;
  flex-direction: column;
  gap: var(--rp-spacing-sm);
}

.role-card__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--rp-spacing-sm);
  margin-top: var(--rp-spacing-md);
  flex-wrap: wrap;
}

.permission-label {
  display: flex;
  align-items: center;
  gap: var(--rp-spacing-sm);
  cursor: pointer;
}

.permission-label__text {
  color: var(--text-color);
}

/* Custom Checkbox */
input[type="checkbox"] {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--neon-blue);
  border-radius: 0.25rem;
  background-color: transparent;
  cursor: pointer;
  position: relative;
}

input[type="checkbox"]:checked {
  background-color: var(--neon-blue);
}

input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  color: var(--text-color);
  font-size: 0.875rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* Alert Styles */
.alert {
  padding: var(--rp-spacing-md);
  border-radius: 0.5rem;
  margin-bottom: var(--rp-spacing-md);
}

.alert--success {
  background-color: rgba(0, 255, 153, 0.1);
  border: 1px solid var(--neon-green);
}

.alert--warning {
  background-color: rgba(255, 221, 87, 0.1);
  border: 1px solid var(--neon-yellow);
}

.alert--error {
  background-color: rgba(255, 7, 58, 0.1);
  border: 1px solid var(--neon-red);
}

.alert--info {
  background-color: rgba(31, 142, 241, 0.1);
  border: 1px solid var(--neon-blue);
}

.alert__content {
  display: flex;
  align-items: center;
  gap: var(--rp-spacing-sm);
}

.alert__icon {
  font-size: 1.25rem;
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  padding: var(--rp-spacing-xl);
  border-radius: 1rem;
  border: 1px dashed rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  text-align: center;
  color: var(--text-color);
}

.empty-state__icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(56, 189, 248, 0.18);
  color: var(--text-color);
  font-size: 1.4rem;
}

.empty-state__title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--heading-color);
}

.empty-state__desc {
  font-size: 0.9rem;
  color: var(--text-color);
  max-width: 320px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: var(--card-background-color);
  padding: var(--rp-spacing-xl);
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0 20px var(--neon-blue);
}

.modal__title {
  font-size: 1.5rem;
  margin-bottom: var(--rp-spacing-md);
  color: var(--heading-color);
}

.modal__text {
  margin-bottom: var(--rp-spacing-lg);
  color: var(--text-color);
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--rp-spacing-md);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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
  transform: scale(0.95);
}

/* Responsive Design */
@media (max-width: 768px) {
  .role-permissions {
    padding: var(--rp-spacing-md);
  }
  
  .header {
    flex-direction: column;
    gap: var(--rp-spacing-md);
    align-items: stretch;
  }

  .role-toolbar {
    grid-template-columns: 1fr;
    justify-items: stretch;
  }
  
  .roles-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    width: 95%;
    padding: var(--rp-spacing-lg);
  }
}
</style>




