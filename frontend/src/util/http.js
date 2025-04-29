import axios from 'axios'
import {ElMessage} from '@element-plus'

const httpInstance = axios.create({
  //後端伺服器的基地址(預設後端port3030)
  baseURL: "http://localhost:3030/",
  timeout: 5000
})


// 請求攔截
httpInstance.interceptors.request.use(configs => {
    return configs;
  }, (error) => {Promise.reject(error)}
)

//響應攔截
httpInstance.interceptors.response.use(res => res.data, e => {
  ElMessage({
    type: 'warning',
    message: e.response.data.message,
  })
  return Promise.reject(e)
})


export default httpInstance;
