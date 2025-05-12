// 驗證帳號是否已存在
import request from '@/util/http.js'

export function checkUsernameExistsAPI(username) {
  return request({
    url: `/api/user/exists?username=${encodeURIComponent(username)}`,
    method: 'GET',
  })
}

export function registerUserAPI({username, password}) {
  return request({
    url: '/api/user/register',
    method: 'POST',
    data: {
      username,
      password,
    }
  })
}
