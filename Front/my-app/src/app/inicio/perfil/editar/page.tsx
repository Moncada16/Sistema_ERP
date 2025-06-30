'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/app/lib/api'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiSave, 
  FiArrowLeft, 
  FiLoader,
  FiEdit3,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiUserCheck
} from 'react-icons/fi'

export default function EditarPerfilPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await api.get('/users/me/info')
        const { nombre, email, telefono } = res.data
        setNombre(nombre)
        setEmail(email)
        setTelefono(telefono || '')
      } catch (error) {
        console.error('Error al cargar datos:', error)
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El formato del email no es válido'
    }

    if (telefono && telefono.length < 7) {
      newErrors.telefono = 'El teléfono debe tener al menos 7 dígitos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'nombre':
        setNombre(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'telefono':
        setTelefono(value)
        break
    }

    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSaving(true)
    try {
      await api.put('/users/me', { 
        nombre: nombre.trim(), 
        email: email.trim(), 
        telefono: telefono.trim() || null 
      })
      
      alert('✅ Perfil actualizado correctamente')
      router.push('/inicio/perfil')
    } catch (error) {
      console.error('Error al actualizar:', error)
      alert('❌ Error al actualizar el perfil. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLoader className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cargando Datos</h2>
          <p className="text-gray-600">Obteniendo información de tu perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header con gradiente azul para edición de perfil */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                <FiEdit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Editar Perfil</h1>
                <p className="text-blue-100">
                  Actualiza tu información personal de manera segura
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/inicio/perfil')}
              className="p-3 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Formulario premium */}
        <div className="bg-white rounded-b-xl shadow-2xl p-8">
          <div className="border-l-4 border-blue-600 pl-4 mb-8">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <FiUserCheck className="w-5 h-5 mr-2 text-blue-600" />
              Información Personal
            </h2>
            <p className="text-gray-600 text-sm mt-1">Modifica los datos de tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FiUser className="inline w-4 h-4 mr-2 text-blue-600" />
                Nombre Completo
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Escribe tu nombre completo"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                  errors.nombre 
                    ? 'border-red-300 bg-red-50' 
                    : nombre.trim() 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300'
                }`}
                disabled={saving}
                required
              />
              {errors.nombre && (
                <div className="flex items-center mt-2 text-red-600">
                  <FiAlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{errors.nombre}</span>
                </div>
              )}
              {nombre.trim() && !errors.nombre && (
                <div className="flex items-center mt-2 text-green-600">
                  <FiCheck className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Nombre válido</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FiMail className="inline w-4 h-4 mr-2 text-blue-600" />
                Correo Electrónico
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="tu@email.com"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                  errors.email 
                    ? 'border-red-300 bg-red-50' 
                    : email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300'
                }`}
                disabled={saving}
                required
              />
              {errors.email && (
                <div className="flex items-center mt-2 text-red-600">
                  <FiAlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{errors.email}</span>
                </div>
              )}
              {email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !errors.email && (
                <div className="flex items-center mt-2 text-green-600">
                  <FiCheck className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Email válido</span>
                </div>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FiPhone className="inline w-4 h-4 mr-2 text-green-600" />
                Teléfono (Opcional)
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder="+57 300 123 4567"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                  errors.telefono 
                    ? 'border-red-300 bg-red-50' 
                    : telefono.trim() && telefono.length >= 7
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300'
                }`}
                disabled={saving}
              />
              {errors.telefono && (
                <div className="flex items-center mt-2 text-red-600">
                  <FiAlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{errors.telefono}</span>
                </div>
              )}
              {telefono.trim() && telefono.length >= 7 && !errors.telefono && (
                <div className="flex items-center mt-2 text-green-600">
                  <FiCheck className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Teléfono válido</span>
                </div>
              )}
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <FiInfo className="w-4 h-4 mr-1" />
                Campo opcional - Incluye código de país para mejor identificación
              </div>
            </div>

            {/* Vista previa de cambios */}
            {(nombre.trim() || email.trim() || telefono.trim()) && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                  <FiInfo className="w-5 h-5 mr-2" />
                  Vista Previa de Cambios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nombre.trim() && (
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <span className="text-sm text-gray-600 font-medium">Nombre:</span>
                      <p className="text-gray-900 font-semibold">{nombre}</p>
                    </div>
                  )}
                  {email.trim() && (
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <span className="text-sm text-gray-600 font-medium">Email:</span>
                      <p className="text-gray-900 font-semibold">{email}</p>
                    </div>
                  )}
                  {telefono.trim() && (
                    <div className="bg-white rounded-lg p-3 border border-green-100 md:col-span-2">
                      <span className="text-sm text-gray-600 font-medium">Teléfono:</span>
                      <p className="text-gray-900 font-semibold">{telefono}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/inicio/perfil')}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <>
                    <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                    Guardando cambios...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}