// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '../app/context/AuthContext'

// interface ProtectedRouteProps {
//   children: React.ReactNode
//   requiresAuth?: boolean
//   requiresNoAuth?: boolean
// }

// export default function ProtectedRoute({
//   children,
//   requiresAuth = true,
//   requiresNoAuth = false,
// }: ProtectedRouteProps) {
//   const { isAuthenticated, isLoading } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!isLoading) {
//       // Si la ruta requiere autenticación y el usuario no está autenticado
//       if (requiresAuth && !isAuthenticated) {
//         router.push('/login')
//         return
//       }

//       // Si la ruta requiere NO autenticación y el usuario está autenticado
//       if (requiresNoAuth && isAuthenticated) {
//         router.push('/inicio')
//         return
//       }
//     }
//   }, [isAuthenticated, isLoading, requiresAuth, requiresNoAuth, router])

//   // Mostrar un estado de carga mientras se verifica la autenticación
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//           <p className="text-gray-600">Cargando...</p>
//         </div>
//       </div>
//     )
//   }

//   // Si la ruta requiere autenticación y el usuario no está autenticado,
//   // o si la ruta requiere NO autenticación y el usuario está autenticado,
//   // no mostrar nada mientras se realiza la redirección
//   if (
//     (requiresAuth && !isAuthenticated) ||
//     (requiresNoAuth && isAuthenticated)
//   ) {
//     return null
//   }

//   // Si todas las verificaciones pasan, mostrar el contenido
//   return <>{children}</>
// }
