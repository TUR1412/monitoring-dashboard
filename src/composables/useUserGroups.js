// src/composables/useUserGroups.js
import { ref } from 'vue'

const STORAGE_KEY = 'userGroups'
const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const readStorage = (key, fallback) => {
  if (!canUseStorage) return fallback
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch (error) {
    console.warn(`Failed to parse storage key: ${key}`, error)
    return fallback
  }
}

const writeStorage = (key, value) => {
  if (!canUseStorage) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Failed to write storage key: ${key}`, error)
  }
}

export function useUserGroups() {
  const groups = ref(readStorage(STORAGE_KEY, []))
  const loading = ref(false)

  const fetchUserGroups = async () => {
    loading.value = true
    try {
      if (!groups.value.length) {
        // Replace with actual API call
        const response = await mockFetchGroups()
        groups.value = response
        writeStorage(STORAGE_KEY, groups.value)
      }
    } catch (error) {
      console.error('Failed to fetch user groups:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const addUserGroup = async (groupData) => {
    loading.value = true
    try {
      // Replace with actual API call
      const newGroup = await mockAddGroup(groupData)
      groups.value = [...groups.value, newGroup]
      writeStorage(STORAGE_KEY, groups.value)
      return newGroup
    } catch (error) {
      console.error('Failed to add user group:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateUserGroup = async (groupId, groupData) => {
    loading.value = true
    try {
      // Replace with actual API call
      const updatedGroup = await mockUpdateGroup(groupId, groupData)
      const index = groups.value.findIndex(g => g.id === groupId)
      if (index !== -1) {
        groups.value = [
          ...groups.value.slice(0, index),
          updatedGroup,
          ...groups.value.slice(index + 1)
        ]
        writeStorage(STORAGE_KEY, groups.value)
      }
      return updatedGroup
    } catch (error) {
      console.error('Failed to update user group:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteUserGroup = async (groupId) => {
    loading.value = true
    try {
      // Replace with actual API call
      await mockDeleteGroup(groupId)
      groups.value = groups.value.filter(g => g.id !== groupId)
      writeStorage(STORAGE_KEY, groups.value)
    } catch (error) {
      console.error('Failed to delete user group:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    groups,
    loading,
    fetchUserGroups,
    addUserGroup,
    updateUserGroup,
    deleteUserGroup
  }
}

// Mock API functions (replace with actual API calls)
const mockFetchGroups = () => {
  return Promise.resolve([
    {
      id: 1,
      name: '开发组',
      memberCount: 8,
      createTime: '2024-01-15'
    },
    {
      id: 2,
      name: '测试组',
      memberCount: 5,
      createTime: '2024-01-16'
    }
  ])
}

const mockAddGroup = (groupData) => {
  return Promise.resolve({
    id: Date.now(),
    ...groupData
  })
}

const mockUpdateGroup = (groupId, groupData) => {
  return Promise.resolve({
    id: groupId,
    ...groupData
  })
}

const mockDeleteGroup = (groupId) => {
  return Promise.resolve()
}
