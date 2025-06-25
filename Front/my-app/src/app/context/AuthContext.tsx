'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import api from '../lib/api'

/* --- Tipos --- */
interface User {
  photo: string
  userId: number
  empresaId: number
  nombre?: string
  email?: string
  [key: string]: string | number | undefined
  img: string | undefined
  
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  setUser: (userData: User) => void
}

/* --- Contexto --- */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/* --- Provider --- */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const userData = JSON.parse(savedUser)
        setUserState(userData)
      } catch (err) {
        console.error('⚠️ Error al restaurar usuario:', err)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUserState(userData)
    router.push('/inicio')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUserState(null)
    router.push('/login')
  }

  const setUser = (userData: User) => {
    setUserState(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/* --- Hook personalizado --- */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}
