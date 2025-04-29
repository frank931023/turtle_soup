import request from '@/util/http.js'



// post 方法處理登入請求
export const logingAPI = ({ account, password }) => {
  return request({
    url: '/login',
    method: 'POST',
    data: {
      account,
      password,
    }
  })
}
