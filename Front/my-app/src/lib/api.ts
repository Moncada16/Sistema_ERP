// src/lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, setAccessToken } from './tokenStore'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// INTERCEPTOR DE REQUEST
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      // Asegurarnos de que headers siempre exista
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// INTERCEPTOR DE RESPONSE
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await axios.post<{ accessToken: string }>(
          `${baseURL}/users/refresh`,
          {},
          { withCredentials: true }
        )
        setAccessToken(data.accessToken)
        originalRequest.headers!['Authorization'] = `Bearer ${data.accessToken}`
        return api.request(originalRequest)
      } catch {
        if (typeof window !== 'undefined') window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
