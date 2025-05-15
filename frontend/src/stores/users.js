import { ref } from 'vue'
import { defineStore } from 'pinia'

// 模擬一個 users API
import { getAllUsersAPI, addUserAPI, updateUserAPI, removeUserAPI, uploadAvatarAPI } from '@/apis/users'

export const useUsersStore = defineStore('users', () => {
  const items = ref([])
  const pagination = ref({ page: 1, perPage: 10, total: 0 })

  const getAll = async ({ filters, sorting, pagination: pageInfo }) => {
    const res = await getAllUsersAPI({ filters, sorting, pagination: pageInfo })
    items.value = res.data
    pagination.value = res.pagination
  }

  const add = async (user) => {
    const res = await addUserAPI(user)
    items.value.push(res.data)
    return res
  }

  const update = async (user) => {
    const res = await updateUserAPI(user)
    const idx = items.value.findIndex(u => u.id === user.id)
    if (idx !== -1) items.value[idx] = res.data
    return res
  }

  const remove = async (user) => {
    await removeUserAPI(user.id)
    items.value = items.value.filter(u => u.id !== user.id)
  }

  const uploadAvatar = async (formData) => {
    const res = await uploadAvatarAPI(formData)
    return res
  }

  return {
    items,
    pagination,
    getAll,
    add,
    update,
    remove,
    uploadAvatar,
  }
})
