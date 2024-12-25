<!-- src/components/RolePermissions.vue -->
<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import { Teleport, Transition } from 'vue'
import type { Role, Permission, AlertType } from '@/types/role'

// Types
interface Alert {
  show: boolean
  message: string
  type: AlertType
  icon: string
}

// State
const roles = reactive<Role[]>([
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

const editingRole = ref<Role | null>(null)
const selectedRole = ref<Role | null>(null)
const showDeleteModal = ref(false)
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
    const nameInput = document.querySelector('.role-name-input') as HTMLInputElement
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
  showAlert('已取消编辑', 'info')
}

/**
 * 添加新角色并进入编辑模式
 */
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
      <button class="btn btn--add" @click="addNewRole">
        <i class="fas fa-plus btn__icon" />
        添加角色
      </button>
    </div>

    <!-- Roles Grid -->
    <div class="roles-grid">
      <div
        v-for="role in roles"
        :key="role.id"
        :class="['role-card', { 'role-card--editing': editingRole?.id === role.id }]"
      >
        <div class="role-card__header">
          <div v-if="isEditingName && editingRole?.id === role.id" class="role-name-edit">
            <input
              v-model="editingName"
              type="text"
              class="role-name-input"
              @keyup.enter="saveRoleName(role)"
              @blur="saveRoleName(role)"
              ref="nameInput"
            >
          </div>
          <h3 v-else class="role-card__title" @dblclick="editRole(role)">
            {{ role.name }}
          </h3>
          <div class="role-card__actions">
            <template v-if="editingRole?.id === role.id">
              <button
                class="btn btn--icon btn--save"
                @click="saveRoleName(role)"
              >
                <i class="fas fa-check" />
              </button>
              <button
                class="btn btn--icon btn--cancel"
                @click="cancelEdit"
              >
                <i class="fas fa-times" />
              </button>
            </template>
            <template v-else>
              <button
                class="btn btn--icon btn--edit"
                @click="editRole(role)"
              >
                <i class="fas fa-edit" />
              </button>
              <button
                class="btn btn--icon btn--delete"
                @click="confirmDelete(role)"
              >
                <i class="fas fa-trash" />
              </button>
            </template>
          </div>
        </div>

        <div class="permissions-list">
          <div
            v-for="perm in role.permissions"
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
              <button
                class="btn btn--secondary"
                @click="closeModal"
              >
                取消
              </button>
              <button
                class="btn btn--primary"
                @click="deleteRole"
              >
                确认删除
              </button>
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

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--rp-spacing-sm);
  padding: var(--rp-spacing-sm) var(--rp-spacing-md);
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn--add {
  background-color: var(--neon-green);
  color: var(--text-color);
}

.btn--icon {
  padding: var(--rp-spacing-sm);
}

.btn--edit {
  background-color: var(--neon-blue);
  color: var(--text-color);
}

.btn--delete {
  background-color: var(--neon-red);
  color: var(--text-color);
}

.btn--save {
  background-color: var(--neon-green);
  color: var(--text-color);
}

.btn--cancel {
  background-color: var(--neon-red);
  color: var(--text-color);
}

.btn--primary {
  background-color: var(--neon-blue);
  color: var(--text-color);
}

.btn--secondary {
  background-color: var(--gray-600);
  color: var(--text-color);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 10px currentColor;
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
}

/* 新增样式 */
.role-name-edit {
  flex: 1;
  margin-right: var(--rp-spacing-md);
}

.role-name-input {
  width: 100%;
  padding: var(--rp-spacing-sm);
  border: 2px solid var(--neon-blue);
  border-radius: 0.25rem;
  background-color: var(--card-background-color);
  color: var(--text-color);
  font-size: 1.25rem;
}

/* Permissions List */
.permissions-list {
  display: flex;
  flex-direction: column;
  gap: var(--rp-spacing-sm);
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
  
  .roles-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    width: 95%;
    padding: var(--rp-spacing-lg);
  }
}
</style>
