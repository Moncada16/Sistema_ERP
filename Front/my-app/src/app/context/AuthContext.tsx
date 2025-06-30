'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

// ==========================================
// IMPORTACIONES LOCALES - PROBLEMA SOLUCIONADO
// ==========================================

// 🔍 VERIFICA LA RUTA SEGÚN TU ESTRUCTURA:
// Si auth.ts está en src/lib/ usar: '../lib/auth'  
// Si auth.ts está en src/app/lib/ usar: '../lib/auth'
// Cambiar esta línea según tu estructura real:

import { 
  setToken, 
  getToken, 
  removeToken, 
  isTokenExpired, 
  setUserData, 
  getUserData, 
  clearSession
} from '../lib/auth' // ← CAMBIAR ESTA RUTA SI ES NECESARIO

// ==========================================
// TIPOS LOCALES - CORREGIDOS DEFINITIVAMENTE
// ==========================================

export interface UserData {
  userId: number
  empresaId: number | null
  nombre: string
  email: string
  rol: string
  photo?: string
  img?: string
  [key: string]: string | number | undefined | null  // ✅ SIGNATURE DE ÍNDICE AGREGADA
}

export interface User extends UserData {
  // Ya no necesita [key: string] porque UserData ya lo tiene
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  setUser: (userData: User) => void
  refreshUser: () => Promise<void>
  hasCompany: boolean
  userRole: string | null  // ✅ CORREGIDO: solo string | null
  hasPermission: (requiredRole: string) => boolean
  updateUserCompany: (empresaId: number) => void
}

// ==========================================
// INSTANCIA AXIOS LOCAL
// ==========================================

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// ==========================================
// CONTEXTO
// ==========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ==========================================
// PROVIDER - CORREGIDO
// ==========================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar si el usuario tiene empresa
  const hasCompany = Boolean(user?.empresaId)
  
  // ✅ CORREGIDO: Obtener rol del usuario (solo string | null)
  const userRole: string | null = user?.rol ? String(user.rol) : null

  // ==========================================
  // DECODIFICACIÓN LOCAL DE TOKEN
  // ==========================================

  const getUserFromTokenLocal = (token: string): User | null => {
    try {
      // Verificar formato JWT básico
      const parts = token.split('.')
      if (parts.length !== 3) {
        console.error('❌ Token no tiene formato JWT válido')
        return null
      }

      // Decodificar payload
      const base64Url = parts[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )

      const decoded = JSON.parse(jsonPayload)
      console.log('🔍 Sistema SC - Token decodificado:', decoded)
      
      if (decoded && decoded.userId) {
        return {
          photo: decoded.photo || '',
          userId: decoded.userId,
          empresaId: decoded.empresaId || null,
          nombre: decoded.nombre || '',
          email: decoded.email || '',
          rol: decoded.rol || 'usuario',
          img: decoded.img || undefined
        }
      }
      return null
    } catch (error) {
      console.error('❌ Sistema SC - Error decodificando token:', error)
      return null
    }
  }

  // ==========================================
  // FUNCIONES DE AUTENTICACIÓN
  // ==========================================

  const hasPermission = (requiredRole: string): boolean => {
    if (!user?.rol) return false
    
    const roleHierarchy = {
      'super_admin': 4,
      'admin': 3,
      'manager': 2,
      'usuario': 1
    }
    
    const userLevel = roleHierarchy[user.rol as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0
    
    return userLevel >= requiredLevel
  }

  const refreshUser = async (): Promise<void> => {
    try {
      console.log('🔄 Sistema SC - Refrescando usuario...')
      
      const token = getToken()
      if (!token) {
        console.log('❌ Sistema SC - No hay token para refrescar')
        return
      }

      if (isTokenExpired(token)) {
        console.log('⚠️ Sistema SC - Token expirado, cerrando sesión')
        logout()
        return
      }

      const userData = getUserFromTokenLocal(token)
      
      if (userData) {
        console.log('✅ Sistema SC - Usuario refrescado:', userData)
        setUserState(userData)
        setUserData(userData as UserData)  // ✅ CAST EXPLÍCITO
      } else {
        console.log('❌ Sistema SC - No se pudo extraer usuario del token')
        logout()
      }
    } catch (error) {
      console.error('❌ Sistema SC - Error refrescando usuario:', error)
      logout()
    }
  }

  const login = (token: string, userData: User) => {
    console.log('🔐 Sistema SC - Iniciando sesión:', userData)
    
    if (!token || !userData.userId) {
      console.error('❌ Sistema SC - Datos de login inválidos')
      return
    }
    
    setToken(token)
    setUserData(userData as UserData)  // ✅ CAST EXPLÍCITO
    
    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUserState(userData)
    
    if (userData.empresaId) {
      router.push('/inicio')
    } else {
      router.push('/empresa/crear')
    }
  }

  const logout = () => {
    console.log('👋 Sistema SC - Cerrando sesión')
    
    clearSession()
    delete apiInstance.defaults.headers.common['Authorization']
    setUserState(null)
    router.push('/login')
  }

  const setUser = (userData: User) => {
    console.log('👤 Sistema SC - Actualizando usuario:', userData)
    
    if (!userData.userId) {
      console.error('❌ Sistema SC - Datos de usuario inválidos')
      return
    }
    
    setUserState(userData)
    setUserData(userData as UserData)  // ✅ CAST EXPLÍCITO
  }

  const updateUserCompany = (empresaId: number) => {
    if (user) {
      const updatedUser = { ...user, empresaId }
      setUser(updatedUser)
    }
  }

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken()
      const savedUser = getUserData()

      console.log('🚀 Sistema SC - Inicializando autenticación...')
      console.log('Token presente:', !!token)
      console.log('Usuario guardado:', !!savedUser)

      if (token) {
        try {
          if (isTokenExpired(token)) {
            console.log('⚠️ Sistema SC - Token expirado durante inicialización')
            clearSession()
            setIsLoading(false)
            return
          }

          apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          const userFromToken = getUserFromTokenLocal(token)
          
          if (userFromToken) {
            console.log('✅ Sistema SC - Usuario cargado desde token:', userFromToken)
            setUserState(userFromToken)
            setUserData(userFromToken as UserData)
          } else if (savedUser) {
            console.log('⚠️ Sistema SC - Usando usuario guardado como fallback')
            setUserState(savedUser as User)  // ✅ CAST EXPLÍCITO
          }
        } catch (err) {
          console.error('⚠️ Sistema SC - Error al restaurar usuario:', err)
          clearSession()
          delete apiInstance.defaults.headers.common['Authorization']
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setUser,
        refreshUser,
        hasCompany,
        userRole,
        hasPermission,
        updateUserCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ==========================================
// HOOKS PERSONALIZADOS
// ==========================================

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider> en el Sistema SC')
  }
  return context
}

export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🔒 Sistema SC - Acceso denegado, redirigiendo...')
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  return { isAuthenticated, isLoading }
}

export function useRequireCompany() {
  const { user, hasCompany, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user && !hasCompany) {
      console.log('🏢 Sistema SC - Usuario sin empresa, redirigiendo...')
      router.push('/empresa/crear')
    }
  }, [user, hasCompany, isLoading, router])

  return { hasCompany, isLoading }
}

export default AuthProvider