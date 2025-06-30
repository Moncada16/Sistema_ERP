// src/lib/api.ts - CLIENTE API CORREGIDO SIN EXPORTS DUPLICADOS
'use client'

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// ==========================================
// IMPORTACIONES DE AUTH - AJUSTAR RUTA
// ==========================================

// 🔍 AJUSTAR SEGÚN TU ESTRUCTURA:
import { 
  getToken, 
  setToken, 
  clearSession, 
  hasValidSession,
  isTokenValid 
} from './auth'  // ← Si auth.ts está en src/lib/

// Si auth.ts está en otra ubicación, cambiar la ruta aquí

// ==========================================
// CONFIGURACIÓN BASE
// ==========================================

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true,
  headers: { 
    'Content-Type': 'application/json'
  }
})

// ==========================================
// INTERCEPTOR DE REQUEST
// ==========================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    
    if (hasValidSession()) {
      const token = getToken()
      if (token && isTokenValid(token)) {
        config.headers = config.headers || {}
        config.headers['Authorization'] = `Bearer ${token}`
        console.log('🔐 Token agregado al request')
      } else {
        console.warn('⚠️ Token inválido encontrado')
      }
    } else {
      console.log('📭 No hay sesión válida para agregar token')
    }
    
    return config
  },
  error => {
    console.error('❌ Error en request interceptor:', error)
    return Promise.reject(error)
  }
)

// ==========================================
// INTERCEPTOR DE RESPONSE
// ==========================================

api.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  async (error: AxiosError) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data)
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    // Manejo de errores 401 - Token expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        console.log('🔄 Intentando renovar token...')
        
        const { data } = await axios.post<{ accessToken: string }>(
          `${baseURL}/users/refresh`,
          {},
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        
        if (data.accessToken) {
          setToken(data.accessToken)
          
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
          }
          
          console.log('✅ Token renovado exitosamente')
          return api.request(originalRequest)
        }
      } catch (refreshError) {
        console.error('❌ Error renovando token:', refreshError)
        clearSession()
        
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            console.log('🔄 Redirigiendo al login...')
            window.location.href = '/login'
          }
        }
      }
    }
    
    // Manejo de otros errores específicos
    switch (error.response?.status) {
      case 403:
        console.warn('⚠️ Sin permisos para esta acción')
        break
      case 404:
        console.warn('⚠️ Recurso no encontrado')
        break
      case 422:
        console.warn('⚠️ Datos de entrada inválidos')
        break
      case 500:
        console.error('💥 Error interno del servidor')
        break
      default:
        console.error('💥 Error desconocido:', error.response?.status || 'Sin código de estado')
        break
    }
    
    return Promise.reject(error)
  }
)

// ==========================================
// FUNCIONES AUXILIARES - UNA SOLA DECLARACIÓN
// ==========================================

export const apiGet = async <T = any>(url: string, params?: any): Promise<T> => {
  try {
    const response = await api.get<T>(url, { params })
    return response.data
  } catch (error) {
    console.error(`❌ Error en GET ${url}:`, error)
    throw error
  }
}

export const apiPost = async <T = any>(url: string, data?: any): Promise<T> => {
  try {
    const response = await api.post<T>(url, data)
    return response.data
  } catch (error) {
    console.error(`❌ Error en POST ${url}:`, error)
    throw error
  }
}

export const apiPut = async <T = any>(url: string, data?: any): Promise<T> => {
  try {
    const response = await api.put<T>(url, data)
    return response.data
  } catch (error) {
    console.error(`❌ Error en PUT ${url}:`, error)
    throw error
  }
}

export const apiDelete = async <T = any>(url: string): Promise<T> => {
  try {
    const response = await api.delete<T>(url)
    return response.data
  } catch (error) {
    console.error(`❌ Error en DELETE ${url}:`, error)
    throw error
  }
}

export const apiUpload = async <T = any>(url: string, formData: FormData): Promise<T> => {
  try {
    const response = await api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error(`❌ Error en UPLOAD ${url}:`, error)
    throw error
  }
}

export const debugApiConfig = (): void => {
  if (process.env.NODE_ENV !== 'development') return
  
  console.group('🔍 Debug API Config - Bendito Calzado')
  console.log('Base URL:', api.defaults.baseURL)
  console.log('Timeout:', api.defaults.timeout)
  console.log('With Credentials:', api.defaults.withCredentials)
  console.log('Default Headers:', api.defaults.headers)
  console.groupEnd()
}

// ==========================================
// EXPORT DEFAULT SOLAMENTE
// ==========================================

export default api

// ✅ NO MÁS EXPORTS DUPLICADOS AL FINAL