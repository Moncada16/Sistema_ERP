'use client'

import { useEffect, useState } from 'react'
import { FiHome, FiEdit3, FiPlus, FiCheck, FiAlertCircle, FiMapPin, FiPhone, FiMail, FiCreditCard, FiGlobe, FiCalendar, FiUser, FiActivity, FiTrendingUp } from 'react-icons/fi'
import api from '@/app/lib/api'
import { useAuth } from '@/app/context/AuthContext'
import EmpresaModal from '@/app/inicio/empresa/EmpresaModal'
import { Empresa } from '@/app/inicio/empresa/EmpresaDTO'

export default function EmpresaPage() {
 const { user, refreshUser, setUser, hasCompany } = useAuth()
 const [empresa, setEmpresa] = useState<Empresa | null>(null)
 const [modalOpen, setModalOpen] = useState(false)
 const [modo, setModo] = useState<'crear' | 'editar'>('crear')
 const [error, setError] = useState('')
 const [success, setSuccess] = useState('')
 const [loading, setLoading] = useState(true)

 useEffect(() => {
   const fetchEmpresa = async () => {
     try {
       setLoading(true)
       setError('')
       
       const res = await api.get('/empresa')
       
       if (res.data && res.data.id) {
         console.log('✅ Sistema SC - Empresa encontrada:', res.data)
         setEmpresa(res.data)
       } else {
         console.log('⚠️ Sistema SC - Usuario sin empresa')
         setEmpresa(null)
       }
     } catch (error: any) {
       console.error('❌ Sistema SC - Error al obtener empresa:', error)
       
       if (error.response?.status === 404) {
         setEmpresa(null)
       } else {
         setError('Error al cargar información de la empresa')
       }
     } finally {
       setLoading(false)
     }
   }

   if (user) {
     fetchEmpresa()
   }
 }, [user])

 const handleSubmit = async (data: Empresa) => {
   setError('')
   setSuccess('')
   setLoading(true)
   
   try {
     console.log('💾 Sistema SC - Guardando empresa:', data)
     
     if (modo === 'editar' && !empresa?.id) {
       setError('No hay empresa para editar.')
       setLoading(false)
       return
     }

     const res = modo === 'crear'
       ? await api.post('/empresa', data)
       : await api.put('/empresa', data)

     console.log('✅ Sistema SC - Respuesta del servidor:', res.data)

     if (modo === 'crear' && res.data.token) {
       console.log('🔄 Sistema SC - Actualizando token con empresaId...')
       
       localStorage.setItem('token', res.data.token)
       setEmpresa(res.data.empresa)
       
       const updatedUser = {
         photo: user?.photo || '',
         userId: user?.userId || 0,
         empresaId: res.data.empresa.id,
         nombre: user?.nombre || '',
         email: user?.email || '',
         rol: user?.rol || 'usuario',
         img: user?.img
       }
       
       setUser(updatedUser)
       await refreshUser()
       
       console.log('✅ Sistema SC - Token y usuario actualizados')
       setSuccess('¡Empresa creada exitosamente! Ya puedes gestionar el sistema completo.')
       
     } else if (modo === 'editar') {
       setEmpresa(res.data.empresa || res.data)
       setSuccess('Empresa actualizada correctamente')
     }

     setModalOpen(false)
     
   } catch (error: any) {
     console.error('❌ Sistema SC - Error desde backend:', error)
     
     let errorMessage = 'Error al guardar empresa'
     
     if (error.response?.data?.error) {
       errorMessage = error.response.data.error
     } else if (error.response?.status === 400) {
       errorMessage = 'Datos inválidos. Verifica todos los campos.'
     }
     
     setError(errorMessage)
   } finally {
     setLoading(false)
   }
 }

 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
         <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
         <p className="text-purple-600 font-medium">Cargando información de la empresa...</p>
       </div>
     </div>
   )
 }

 return (
   <div className="min-h-screen bg-gray-50">
     <div className="max-w-7xl mx-auto p-6 space-y-8">
       {/* Header Premium */}
       <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-xl p-8 text-white">
         <div className="flex items-center justify-between">
           <div className="flex items-center">
             <FiHome className="w-10 h-10 mr-4" />
             <div>
               <h1 className="text-3xl font-bold">Mi Empresa</h1>
               <p className="text-purple-100 mt-2">
                 {empresa ? 'Gestiona la información de tu empresa' : 'Configura tu empresa en el Sistema SC'}
               </p>
             </div>
           </div>
           <div className="hidden md:flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
             <div className="text-right">
               <div className="text-2xl font-bold">{empresa ? '✅' : '⚠️'}</div>
               <div className="text-purple-100 text-sm">
                 {empresa ? 'Configurada' : 'Pendiente'}
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Alerts */}
       {error && (
         <div className="bg-red-50 border border-red-200 rounded-xl p-4">
           <div className="flex items-center">
             <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
             <p className="text-red-800 font-medium">{error}</p>
           </div>
         </div>
       )}

       {success && (
         <div className="bg-green-50 border border-green-200 rounded-xl p-4">
           <div className="flex items-center">
             <FiCheck className="w-5 h-5 text-green-600 mr-3" />
             <p className="text-green-800 font-medium">{success}</p>
           </div>
         </div>
       )}

       {empresa ? (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Información principal */}
           <div className="lg:col-span-2">
             <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
               <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-gray-200">
                 <div className="flex items-center justify-between">
                   <div>
                     <h2 className="text-xl font-bold text-gray-900 flex items-center">
                       <FiHome className="w-5 h-5 mr-2 text-purple-600" />
                       Información de la Empresa
                     </h2>
                     <p className="text-gray-600 text-sm mt-1">Datos registrados en el Sistema SC</p>
                   </div>
                   <button
                     onClick={() => {
                       setModo('editar')
                       setModalOpen(true)
                     }}
                     className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                   >
                     <FiEdit3 className="w-4 h-4 mr-2" />
                     Editar
                   </button>
                 </div>
               </div>

               <div className="p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                     <div className="flex items-start">
                       <div className="bg-purple-100 p-3 rounded-xl mr-4">
                         <FiHome className="w-5 h-5 text-purple-600" />
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-600">Nombre de la Empresa</p>
                         <p className="text-lg font-bold text-gray-900 mt-1">{empresa.nombre}</p>
                       </div>
                     </div>

                     <div className="flex items-start">
                       <div className="bg-purple-100 p-3 rounded-xl mr-4">
                         <FiCreditCard className="w-5 h-5 text-purple-600" />
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-600">NIT</p>
                         <p className="text-lg font-bold text-gray-900 mt-1 font-mono">{empresa.nit}</p>
                       </div>
                     </div>

                     <div className="flex items-start">
                       <div className="bg-purple-100 p-3 rounded-xl mr-4">
                         <FiMapPin className="w-5 h-5 text-purple-600" />
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-600">Dirección</p>
                         <p className="text-lg font-bold text-gray-900 mt-1">{empresa.direccion}</p>
                         <p className="text-sm text-gray-500 mt-1">{empresa.ciudad}</p>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-6">
                     <div className="flex items-start">
                       <div className="bg-purple-100 p-3 rounded-xl mr-4">
                         <FiMail className="w-5 h-5 text-purple-600" />
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-600">Email Corporativo</p>
                         <p className="text-lg font-bold text-gray-900 mt-1">{empresa.email}</p>
                       </div>
                     </div>

                     <div className="flex items-start">
                       <div className="bg-purple-100 p-3 rounded-xl mr-4">
                         <FiPhone className="w-5 h-5 text-purple-600" />
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-600">Teléfono</p>
                         <p className="text-lg font-bold text-gray-900 mt-1">{empresa.telefono}</p>
                       </div>
                     </div>

                     <div className="flex items-start">
                       <div className="bg-purple-100 p-3 rounded-xl mr-4">
                         <FiGlobe className="w-5 h-5 text-purple-600" />
                       </div>
                       <div>
                         <p className="text-sm font-medium text-gray-600">Configuración Regional</p>
                         <p className="text-lg font-bold text-gray-900 mt-1">{empresa.moneda}</p>
                         <p className="text-sm text-gray-500 mt-1">{empresa.zonaHoraria}</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* Panel lateral */}
           <div className="space-y-6">
             {/* Estado de la empresa */}
             <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                 <FiActivity className="w-5 h-5 mr-2 text-green-600" />
                 Estado del Sistema
               </h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                   <div className="flex items-center">
                     <FiCheck className="w-4 h-4 text-green-600 mr-2" />
                     <span className="text-green-800 font-medium">Empresa Registrada</span>
                   </div>
                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                     ACTIVA
                   </span>
                 </div>
                 
                 <div className="space-y-2">
                   <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-600">ID de Empresa:</span>
                     <span className="font-mono text-purple-600 font-bold">#{empresa.id}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-600">Usuario Propietario:</span>
                     <span className="text-gray-900 font-medium">{user?.nombre}</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-600">Sistema:</span>
                     <span className="text-purple-600 font-medium">SC v2.0</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Módulos disponibles */}
             <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                 <FiTrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                 Módulos Disponibles
               </h3>
               <div className="space-y-3">
                 <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <FiCheck className="w-4 h-4 text-blue-600 mr-3" />
                   <div>
                     <p className="text-blue-900 font-medium">Gestión de Bodegas</p>
                     <p className="text-blue-700 text-xs">Múltiples ubicaciones</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <FiCheck className="w-4 h-4 text-blue-600 mr-3" />
                   <div>
                     <p className="text-blue-900 font-medium">Control de Inventario</p>
                     <p className="text-blue-700 text-xs">Tiempo real</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <FiCheck className="w-4 h-4 text-blue-600 mr-3" />
                   <div>
                     <p className="text-blue-900 font-medium">Gestión de Compras</p>
                     <p className="text-blue-700 text-xs">Proveedores y órdenes</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                   <FiCheck className="w-4 h-4 text-blue-600 mr-3" />
                   <div>
                     <p className="text-blue-900 font-medium">Reportes y Analytics</p>
                     <p className="text-blue-700 text-xs">Análisis detallados</p>
                   </div>
                 </div>
               </div>
             </div>

             {/* Próximos pasos */}
             <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                 <FiCalendar className="w-5 h-5 mr-2 text-amber-600" />
                 Próximos Pasos
               </h3>
               <div className="space-y-3">
                 <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                   <FiCheck className="w-4 h-4 text-green-600 mr-3" />
                   <span className="text-green-800 text-sm font-medium">Empresa configurada</span>
                 </div>
                 
                 <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                   <span className="w-4 h-4 bg-amber-600 rounded-full mr-3 text-xs flex items-center justify-center text-white font-bold">2</span>
                   <span className="text-amber-800 text-sm font-medium">Crear bodegas</span>
                 </div>
                 
                 <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                   <span className="w-4 h-4 bg-gray-400 rounded-full mr-3 text-xs flex items-center justify-center text-white font-bold">3</span>
                   <span className="text-gray-600 text-sm">Agregar productos</span>
                 </div>
                 
                 <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                   <span className="w-4 h-4 bg-gray-400 rounded-full mr-3 text-xs flex items-center justify-center text-white font-bold">4</span>
                   <span className="text-gray-600 text-sm">Configurar proveedores</span>
                 </div>
               </div>
             </div>
           </div>
         </div>
       ) : (
         <div className="text-center py-16">
           <div className="max-w-2xl mx-auto">
             <div className="bg-white rounded-xl shadow-xl p-12">
               <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-8">
                 <FiHome className="w-16 h-16 text-purple-600" />
               </div>
               
               <h3 className="text-3xl font-bold text-gray-900 mb-6">
                 ¡Bienvenido al Sistema SC!
               </h3>
               
               <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                 Para comenzar a usar el sistema ERP completo, necesitas registrar tu empresa. 
                 Esto te dará acceso a todas las funcionalidades del Sistema SC.
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 <div className="flex items-center text-gray-600 p-4 bg-gray-50 rounded-lg">
                   <FiCheck className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                   <span>Gestión completa de inventarios</span>
                 </div>
                 <div className="flex items-center text-gray-600 p-4 bg-gray-50 rounded-lg">
                   <FiCheck className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                   <span>Control de compras y proveedores</span>
                 </div>
                 <div className="flex items-center text-gray-600 p-4 bg-gray-50 rounded-lg">
                   <FiCheck className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                   <span>Reportes y análisis detallados</span>
                 </div>
                 <div className="flex items-center text-gray-600 p-4 bg-gray-50 rounded-lg">
                   <FiCheck className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                   <span>Múltiples bodegas y ubicaciones</span>
                 </div>
               </div>
               
               <button
                 onClick={() => {
                   setModo('crear')
                   setModalOpen(true)
                 }}
                 className="w-full max-w-md mx-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-lg flex items-center justify-center transform hover:scale-105"
               >
                 <FiPlus className="w-6 h-6 mr-3" />
                 Configurar Mi Empresa
               </button>
               
               <p className="text-sm text-gray-500 mt-6">
                 ✅ Configuración rápida • ✅ Sin costos adicionales • ✅ Soporte incluido
               </p>
             </div>
           </div>
         </div>
       )}

       <EmpresaModal
         open={modalOpen}
         onClose={() => setModalOpen(false)}
         onSubmit={handleSubmit}
         initialData={modo === 'editar' && empresa ? empresa : undefined}
       />
     </div>
   </div>
 )
}