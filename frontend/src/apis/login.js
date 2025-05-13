import request from '@/util/http.js'



// post 方法處理一般登入請求
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


// Google 登入（用 id_token）
export function googleLoginAPI({ id_token }) {
  return request({
    url: '/api/user/google-login',
    method: 'POST',
    data: {
      id_token,
    }
  })
}


// FaceBook 登入（用 accessToken）
export function facebookLoginAPI({ accessToken }) {
  return request({
    url: '/api/user/facebook-login',
    method: 'POST',
    data: {
      accessToken,
    }
  })
}
