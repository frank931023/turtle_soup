import request from '@/util/http.js'



// post 方法處理登入請求
export function logingAPI({ username, password }) {
  return request({
    url: '/api/user/login',
    method: 'POST',
    data: {
      username,
      password,
    }
  })
}
