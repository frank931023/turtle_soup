import request from '@/util/http.js'

// 获取用户列表
export function getUserListAPI({ page, pageSize, role, search }) {
  return request({
    url: '/api/user/list',
    method: 'GET',
    params: {
      page,
      pageSize,
      role,
      search
    }
  })
}

// 获取单个用户信息
export function getUserAPI(id) {
  return request({
    url: `/api/user/getUser/${id}`,
    method: 'GET'
  })
}

// 创建用户
export function createUserAPI(userData) {
  return request({
    url: '/api/user/createUser',
    method: 'POST',
    data: userData
  })
}

// 更新用户信息
export function updateUserAPI(id, userData) {
  return request({
    url: `/api/user/updateUser/${id}`,
    method: 'PUT',
    data: userData
  })
}

// 删除用户
export function deleteUserAPI(id) {
  return request({
    url: `/api/user/deleteUser/${id}`,
    method: 'DELETE'
  })
}

// 检查用户名是否存在
export function checkUserExistsAPI(username) {
  return request({
    url: '/api/user/check-exists',
    method: 'GET',
    params: { username }
  })
}
