'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api'
import { getAccessToken, setAccessToken } from '@/lib/tokenStore'
import { useRouter } from 'next/navigation'

type User = {
  userId: number
  empresaId?: number
  rol: string
  img: string
  nombre?: string
}

interface AuthContextType {
  user: User | null
  login: (accessToken: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = getAccessToken()
    if (!token) return

    api.get('/users/me/info')
      .then(res => {
        const data = res.data
        const parsedUser: User = {
          userId: data.id,
          empresaId: data.empresaId,
          rol: data.rol,
          img: data.img,
          nombre: data.nombre
        }
        setUser(parsedUser)
      })
      .catch(() => {
        logout()
      })
  }, [])

  const login = (accessToken: string, userData: User) => {
    setAccessToken(accessToken)
    setUser(userData)
    router.push('/inicio')
  }

  const logout = () => {
    setAccessToken('')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}
