import axios from 'axios'
import { getAccessToken } from './tokenStore'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL
  // ⛔️ NO pongas Content-Type fijo aquí (deja que Axios lo maneje según el payload)
})

// ✅ INTERCEPTOR DE REQUEST: agrega token automáticamente
api.interceptors.request.use(
  config => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)


export default api
