import request from '@/util/http.js'

// get user profile API
export function getProfileAPI(token) {
  return request({
    url: '/api/user/getProfile',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}



// set user profile API
export function setProfileAPI(data, token) {
  return request({
    url: '/api/user/setProfile',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}


// reset password API
export function resetPasswordAPI(data, token) {
  return request({
    url: '/api/user/resetPassword',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}
