// src/composables/useUserGroups.js
import { ref } from 'vue'
import { safeStorage } from '@/utils/storage'

const STORAGE_KEY = 'monitoring-dashboard:userGroups'

export function useUserGroups() {
  const groups = ref([])
  const loading = ref(false)

  const fetchUserGroups = async () => {
    loading.value = true
    try {
      const cached = safeStorage.get(STORAGE_KEY, null)
      if (cached && Array.isArray(cached)) {
        groups.value = cached
        return
      }
      const response = await mockFetchGroups()
      groups.value = response
      safeStorage.set(STORAGE_KEY, groups.value)
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const addUserGroup = async (groupData) => {
    loading.value = true
    try {
      const newGroup = await mockAddGroup(groupData)
      groups.value.push(newGroup)
      safeStorage.set(STORAGE_KEY, groups.value)
      return newGroup
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateUserGroup = async (groupId, groupData) => {
    loading.value = true
    try {
      const updatedGroup = await mockUpdateGroup(groupId, groupData)
      const index = groups.value.findIndex(g => g.id === groupId)
      if (index !== -1) {
        groups.value[index] = updatedGroup
      }
      safeStorage.set(STORAGE_KEY, groups.value)
      return updatedGroup
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteUserGroup = async (groupId) => {
    loading.value = true
    try {
      await mockDeleteGroup(groupId)
      groups.value = groups.value.filter(g => g.id !== groupId)
      safeStorage.set(STORAGE_KEY, groups.value)
    } catch (error) {
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
      createTime: '2025-12-02'
    },
    {
      id: 2,
      name: '测试组',
      memberCount: 5,
      createTime: '2025-12-05'
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
