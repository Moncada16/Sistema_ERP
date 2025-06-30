"use client"

import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { FiLogOut, FiUser, FiHome, FiSettings, FiActivity } from "react-icons/fi"

export default function DashboardPage() {
 const { logout, user } = useAuth()
 const router = useRouter()

 const handleLogout = () => {
   console.log('👋 Sistema SC - Cerrando sesión desde dashboard')
   logout()
   router.push('/login')
 }

 return (
   <div className="min-h-screen bg-gray-50">
     {/* Header Premium */}
     <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-xl p-8 text-white mb-8">
       <div className="flex items-center justify-between">
         <div className="flex items-center">
           <FiHome className="w-10 h-10 mr-4" />
           <div>
             <h1 className="text-3xl font-bold">Panel Principal</h1>
             <p className="text-indigo-100 mt-2">Bienvenido al Sistema SC, {user?.nombre || 'Usuario'}</p>
           </div>
         </div>
         <div className="hidden md:flex items-center space-x-6">
           <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
             <div className="flex items-center">
               <FiUser className="w-5 h-5 mr-2" />
               <div>
                 <p className="text-indigo-100 text-sm">Usuario</p>
                 <p className="text-white font-semibold">{user?.nombre || 'N/A'}</p>
               </div>
             </div>
           </div>
           <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
             <div className="flex items-center">
               <FiActivity className="w-5 h-5 mr-2" />
               <div>
                 <p className="text-indigo-100 text-sm">Estado</p>
                 <p className="text-white font-semibold">Activo</p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>

     {/* Contenido principal */}
     <div className="max-w-7xl mx-auto p-6 space-y-8">
       {/* Cards de acciones rápidas */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
           <div className="flex items-center justify-between mb-4">
             <div className="bg-blue-50 p-3 rounded-xl">
               <FiHome className="w-6 h-6 text-blue-600" />
             </div>
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-2">Dashboard</h3>
           <p className="text-gray-600 text-sm">Panel principal del sistema</p>
         </div>

         <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
           <div className="flex items-center justify-between mb-4">
             <div className="bg-green-50 p-3 rounded-xl">
               <FiUser className="w-6 h-6 text-green-600" />
             </div>
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-2">Perfil</h3>
           <p className="text-gray-600 text-sm">Gestionar información personal</p>
         </div>

         <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
           <div className="flex items-center justify-between mb-4">
             <div className="bg-purple-50 p-3 rounded-xl">
               <FiSettings className="w-6 h-6 text-purple-600" />
             </div>
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-2">Configuración</h3>
           <p className="text-gray-600 text-sm">Ajustes del sistema</p>
         </div>

         <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
           <div className="flex items-center justify-between mb-4">
             <div className="bg-amber-50 p-3 rounded-xl">
               <FiActivity className="w-6 h-6 text-amber-600" />
             </div>
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-2">Actividad</h3>
           <p className="text-gray-600 text-sm">Registro de actividades</p>
         </div>
       </div>

       {/* Información del usuario */}
       <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
         <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
           <FiUser className="w-6 h-6 mr-3 text-indigo-600" />
           Información de la Sesión
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
               <p className="mt-1 text-lg text-gray-900">{user?.nombre || 'No disponible'}</p>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700">Email</label>
               <p className="mt-1 text-lg text-gray-900">{user?.email || 'No disponible'}</p>
             </div>
           </div>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700">ID de Usuario</label>
               <p className="mt-1 text-lg text-gray-900">{user?.userId || 'No disponible'}</p>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700">ID de Empresa</label>
               <p className="mt-1 text-lg text-gray-900">{user?.empresaId || 'No asignada'}</p>
             </div>
           </div>
         </div>
       </div>

       {/* Panel de acciones */}
       <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
         <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
           <FiSettings className="w-6 h-6 mr-3 text-purple-600" />
           Acciones del Sistema
         </h2>
         
         <div className="flex flex-col sm:flex-row gap-4">
           <button
             onClick={() => router.push('/profile')}
             className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
           >
             <FiUser className="w-5 h-5 mr-2" />
             Editar Perfil
           </button>
           
           <button
             onClick={() => router.push('/settings')}
             className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
           >
             <FiSettings className="w-5 h-5 mr-2" />
             Configuración
           </button>
           
           <button
             onClick={handleLogout}
             className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
           >
             <FiLogOut className="w-5 h-5 mr-2" />
             Cerrar Sesión
           </button>
         </div>
       </div>

       {/* Footer informativo */}
       <div className="text-center py-8">
         <p className="text-gray-500 text-sm">
           Sistema SC - Versión 2.0 | Gestión empresarial integral
         </p>
       </div>
     </div>
   </div>
 )
}