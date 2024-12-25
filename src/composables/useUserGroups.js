// src/composables/useUserGroups.js
import { ref } from 'vue'

export function useUserGroups() {
  const groups = ref([])
  const loading = ref(false)

  const fetchUserGroups = async () => {
    loading.value = true
    try {
      // Replace with actual API call
      const response = await mockFetchGroups()
      groups.value = response
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
      groups.value.push(newGroup)
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
        groups.value[index] = updatedGroup
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