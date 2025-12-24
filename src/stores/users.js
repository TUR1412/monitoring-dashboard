// src/stores/users.js
// 用户管理（演示数据）：CRUD + 本地持久化。

import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'

const STORAGE_KEY = 'monitoring-dashboard:users'

const normalizeRole = (role) => {
  if (!role) return 'USER'
  return String(role).toUpperCase()
}

const createId = () => {
  const base = Date.now()
  const jitter = Math.floor(Math.random() * 1000)
  return base + jitter
}

const seedUsers = () => ([
  { id: 1, username: 'admin', role: 'ADMIN', isActive: true },
  { id: 2, username: 'user1', role: 'USER', isActive: true },
  { id: 3, username: 'user2', role: 'USER', isActive: true }
])

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: safeStorage.get(STORAGE_KEY, seedUsers())
  }),
  actions: {
    hydrate() {
      const users = safeStorage.get(STORAGE_KEY, null)
      this.users = Array.isArray(users) ? users : seedUsers()
      this.persist()
    },

    persist() {
      safeStorage.set(STORAGE_KEY, this.users)
    },

    addUser(payload) {
      const next = {
        id: createId(),
        username: String(payload?.username || '').trim(),
        role: normalizeRole(payload?.role),
        isActive: payload?.isActive ?? true
      }
      this.users = [...this.users, next]
      this.persist()
    },

    editUser(updatedUser) {
      const id = updatedUser?.id
      const index = this.users.findIndex((user) => user.id === id)
      if (index === -1) return

      const next = {
        ...this.users[index],
        ...updatedUser,
        role: normalizeRole(updatedUser?.role ?? this.users[index].role)
      }
      this.users = [
        ...this.users.slice(0, index),
        next,
        ...this.users.slice(index + 1)
      ]
      this.persist()
    },

    toggleUserStatus(id) {
      const index = this.users.findIndex((user) => user.id === id)
      if (index === -1) return
      const current = this.users[index]
      this.users = [
        ...this.users.slice(0, index),
        { ...current, isActive: !current.isActive },
        ...this.users.slice(index + 1)
      ]
      this.persist()
    },

    deleteUser(id) {
      this.users = this.users.filter((user) => user.id !== id)
      this.persist()
    }
  }
})
