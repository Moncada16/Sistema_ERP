// 'use client'

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// import api from '@/lib/api'
// import { getAccessToken, setAccessToken } from '@/lib/tokenStore'
// import { useRouter } from 'next/navigation'

// type User = {
//   userId: number
//   empresaId?: number
//   rol: string
//   img: string
//   nombre?: string
// }

// interface AuthContextType {
//   user: User | null
//   login: (accessToken: string, user: User) => void
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     const token = getAccessToken()
//     if (!token) return

//     api.get('/users/me/info')
//       .then(res => {
//         const data = res.data

//         console.log('📦 Datos del backend image:', data) // Verifica que data.img exista

//         const parsedUser: User = {
//           userId: data.id,
//           empresaId: data.empresaId,
//           rol: data.rol,
//           img: data.img,
//           nombre: data.nombre
//         }

//         console.log('✅ Usuario seteado en contexto:', parsedUser) // Asegura que photoURL llegue

//         setUser(parsedUser)
//       })
//       .catch((err) => {
//         console.error('❌ Error cargando usuario:', err)
//         sessionStorage.removeItem('accessToken')
//         router.push('/login')
//       })
//   }, [router])

//   const login = (accessToken: string, userData: User) => {
//     setAccessToken(accessToken)
//     setUser(userData)
//   }

//   const logout = () => {
//     api.post('/api/auth/logout', {}, { withCredentials: true })
//       .finally(() => {
//         sessionStorage.removeItem('accessToken')
//         setUser(null)
//         router.push('/login')
//       })
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider')
//   return ctx
// }
