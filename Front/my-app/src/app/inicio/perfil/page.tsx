'use client'

import { useEffect, useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/app/lib/api'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiEdit3, 
  FiLock, 
  FiLogOut, 
  FiCamera,
  FiUpload,
  FiLoader,
  FiCheck,
  FiUserCheck,
  FiShield,
  FiSave,
  FiInfo
} from 'react-icons/fi'

interface UserProfile {
  id: number
  nombre: string
  email: string
  telefono?: string
  photo: string
  createdAt: string
  img: string
}

export default function PerfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await api.get('/users/me/info')
        setUser(res.data)
      } catch (error) {
        console.error('Error al cargar perfil:', error)
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    cargarPerfil()
  }, [router])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamaño del archivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB.')
        return
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten archivos de imagen.')
        return
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return
    
    const formData = new FormData()
    formData.append('imagen', selectedFile)
    setUploading(true)

    try {
      const res = await api.post(`/usuarios/fotos/usuario/foto/${user.id}`, formData)
      setUser(prev => prev ? { ...prev, img: res.data.img } : prev)
      setSelectedFile(null)
      setPreviewUrl(null)
      
      // Mostrar mensaje de éxito
      alert('✅ Foto de perfil actualizada exitosamente')
    } catch (error) {
      console.error('Error al subir foto:', error)
      alert('❌ Error al subir la foto. Inténtalo de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  const handleCerrarSesion = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('token')
      router.replace('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLoader className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cargando Perfil</h2>
          <p className="text-gray-600">Obteniendo información de tu cuenta...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-pink-50 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-xl shadow-2xl p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShield className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Autenticación</h2>
          <p className="text-gray-600">No se pudo cargar tu perfil. Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header con gradiente índigo para perfil de usuario */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6">
                <FiUser className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
                <p className="text-indigo-100 text-lg">
                  Gestiona tu información personal y configuración de cuenta
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <p className="text-indigo-100 text-sm">Miembro desde</p>
                <p className="text-white font-bold text-lg">
                  {new Date(user.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna izquierda - Foto de perfil */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <div className="border-l-4 border-indigo-600 pl-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FiCamera className="w-5 h-5 mr-2 text-indigo-600" />
                  Foto de Perfil
                </h2>
                <p className="text-gray-600 text-sm mt-1">Actualiza tu imagen de perfil</p>
              </div>

              <div className="flex flex-col items-center space-y-6">
                {/* Imagen de perfil con overlay */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg">
                    <Image
                      src={previewUrl || user.img || '/default-avatar.png'}
                      alt="Foto de perfil"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Overlay con icono de cámara */}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FiCamera className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Input file invisible */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                  />
                </div>

                {/* Información de la foto */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Haz clic en la imagen para cambiarla
                  </p>
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <FiInfo className="w-3 h-3 mr-1" />
                    <span>JPG, PNG - Máximo 5MB</span>
                  </div>
                </div>

                {/* Botón de subir foto */}
                {selectedFile && (
                  <div className="w-full space-y-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-center text-sm text-indigo-700">
                        <FiCheck className="w-4 h-4 mr-2" />
                        <span>Imagen seleccionada: {selectedFile.name}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {uploading ? (
                        <>
                          <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                          Subiendo foto...
                        </>
                      ) : (
                        <>
                          <FiUpload className="w-5 h-5 mr-2" />
                          Guardar Nueva Foto
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Información del perfil */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Información personal */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <div className="border-l-4 border-blue-600 pl-4 mb-8">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FiUserCheck className="w-5 h-5 mr-2 text-blue-600" />
                  Información Personal
                </h2>
                <p className="text-gray-600 text-sm mt-1">Datos de tu cuenta registrada</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center mb-2">
                    <FiUser className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-semibold text-gray-700">Nombre Completo</span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">{user.nombre}</p>
                </div>

                {/* Email */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                  <div className="flex items-center mb-2">
                    <FiMail className="w-5 h-5 text-indigo-600 mr-2" />
                    <span className="text-sm font-semibold text-gray-700">Correo Electrónico</span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">{user.email}</p>
                </div>

                {/* Teléfono */}
                {user.telefono && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center mb-2">
                      <FiPhone className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-700">Teléfono</span>
                    </div>
                    <p className="text-gray-900 font-bold text-lg">{user.telefono}</p>
                  </div>
                )}

                {/* Fecha de registro */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center mb-2">
                    <FiCalendar className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-sm font-semibold text-gray-700">Miembro Desde</span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">
                    {new Date(user.createdAt).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones del perfil */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
              <div className="border-l-4 border-indigo-600 pl-4 mb-8">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FiShield className="w-5 h-5 mr-2 text-indigo-600" />
                  Configuración de Cuenta
                </h2>
                <p className="text-gray-600 text-sm mt-1">Gestiona tu cuenta y seguridad</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Editar perfil */}
                <button
                  className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => router.push('/inicio/perfil/editar')}
                >
                  <FiEdit3 className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Editar Perfil</div>
                    <div className="text-xs text-blue-100">Actualizar datos</div>
                  </div>
                </button>

                {/* Cambiar contraseña */}
                <button
                  className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => router.push('/inicio/cambiar-contrasena')}
                >
                  <FiLock className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Cambiar Contraseña</div>
                    <div className="text-xs text-green-100">Seguridad</div>
                  </div>
                </button>

                {/* Cerrar sesión */}
                <button
                  className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={handleCerrarSesion}
                >
                  <FiLogOut className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Cerrar Sesión</div>
                    <div className="text-xs text-red-100">Salir del sistema</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con estadísticas del usuario */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-center mb-2">
                <FiUser className="w-6 h-6" />
              </div>
              <div className="font-bold text-xl">Activo</div>
              <div className="text-indigo-100 text-sm">Estado de cuenta</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-center mb-2">
                <FiShield className="w-6 h-6" />
              </div>
              <div className="font-bold text-xl">Verificado</div>
              <div className="text-blue-100 text-sm">Cuenta verificada</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-center mb-2">
                <FiCheck className="w-6 h-6" />
              </div>
              <div className="font-bold text-xl">Premium</div>
              <div className="text-green-100 text-sm">Usuario premium</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}