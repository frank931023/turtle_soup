import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user.js'

// 創建 axios 實例
const httpInstance = axios.create({
  baseURL: 'http://localhost:3000',  // 確保這裡的端口與後端一致
  timeout: 30000
});

// 請求攔截
httpInstance.interceptors.request.use(configs => {

  // 自動在請求頭上加上token
  const userStore = useUserStore();
  const token = userStore.userInfo.token
  if(token){
    configs.headers.Authorization = `Bearer ${token}`
  }
    return configs;
  }, (error) => {Promise.reject(error)}
)

// 響應攔截
httpInstance.interceptors.response.use(
  res => {
    // 檢查 res 是否為 null
    if (!res) {
      ElMessage({
        type: 'error',
        message: '伺服器斷線，請稍後再試',
      });
      return Promise.reject(new Error('伺服器斷線'));
    }
    return res.data;
  },
  e => {
    // e.response 也有可能是 undefined，比如網路錯誤
    ElMessage({
      type: 'warning',
      message: e.response?.data?.message || '連線錯誤，請稍後再試',
    });
    // 如果響應是錯誤，axios回拋出錯誤
    return Promise.reject(e);
  }
);


export default httpInstance;
