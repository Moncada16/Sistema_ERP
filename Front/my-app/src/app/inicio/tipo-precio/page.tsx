'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import api from '@/app/lib/api'
import { 
  FiDollarSign, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSave, 
  FiX,
  FiLoader,
  FiAlertCircle,
  FiTag,
  FiBarChart,
  FiCheck,
  FiUsers,
  FiTrendingUp,
  FiRefreshCw,
  FiInfo,
  FiTarget,
  FiAward
} from 'react-icons/fi'
import Link from 'next/link'

interface TipoPrecio {
  id?: string
  _id: string
  nombre: string
}

export default function TipoPrecioPage() {
  const { user, isLoading } = useAuth()
  const [nombre, setNombre] = useState('')
  const [tiposPrecio, setTiposPrecio] = useState<TipoPrecio[]>([])
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  const obtenerTipos = async () => {
    try {
      setError('')
      const res = await api.get('/tipoPrecio')
      console.log('Tipos de precio obtenidos:', res.data)
      
      // Asegurar que cada tipo tenga un ID válido para eliminar/editar
      const tiposConId = res.data.map((tipo: any) => ({
        ...tipo,
        id: tipo.id || tipo._id // Usar id si existe, sino _id
      }))
      
      setTiposPrecio(tiposConId)
    } catch (err: any) {
      console.error('Error al cargar tipos de precio:', err)
      const errorMessage = err.response?.data?.error || 'Error al cargar los tipos de precio'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const crearTipo = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nombre.trim()) {
      setError('El nombre es requerido')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await api.post('/tipoPrecio', { nombre: nombre.trim() })
      console.log('Tipo de precio creado:', res.data)
      
      setNombre('')
      setSuccess(`Tipo de precio "${nombre.trim()}" creado exitosamente`)
      obtenerTipos()
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      console.error('Error al crear tipo de precio:', err)
      const errorMessage = err.response?.data?.error || 'Error al crear tipo de precio'
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const eliminarTipo = async (id: string, nombre: string) => {
    console.log('Eliminando tipo con ID:', id) // Debug log
    
    if (!id) {
      setError('ID de tipo de precio inválido')
      return
    }
    
    if (!confirm(`¿Estás seguro de eliminar "${nombre}"?\n\nEsta acción no se puede deshacer.`)) return

    try {
      await api.delete(`/tipoPrecio/${id}`)
      console.log('Tipo de precio eliminado:', id)
      setSuccess(`Tipo de precio "${nombre}" eliminado exitosamente`)
      obtenerTipos()
      setError('')
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      console.error('Error al eliminar tipo de precio:', err)
      const errorMessage = err.response?.data?.error || 'Error al eliminar tipo de precio'
      setError(errorMessage)
    }
  }

  const iniciarEdicion = (tipo: TipoPrecio) => {
    const idParaEditar = tipo.id || tipo._id
    console.log('Iniciando edición con ID:', idParaEditar) // Debug log
    
    setEditandoId(idParaEditar)
    setEditNombre(tipo.nombre)
    setError('')
    setSuccess('')
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    setEditNombre('')
    setError('')
  }

  const guardarEdicion = async () => {
    if (!editNombre.trim()) {
      setError('El nombre es requerido')
      return
    }
    
    if (!editandoId) return

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const res = await api.put(`/tipoPrecio/${editandoId}`, { 
        nombre: editNombre.trim() 
      })
      console.log('Tipo de precio actualizado:', res.data)
      
      setSuccess(`Tipo de precio actualizado a "${editNombre.trim()}"`)
      setEditandoId(null)
      setEditNombre('')
      obtenerTipos()
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      console.error('Error al actualizar tipo de precio:', err)
      const errorMessage = err.response?.data?.error || 'Error al actualizar tipo de precio'
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (user?.empresaId) {
      obtenerTipos()
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLoader className="w-10 h-10 text-amber-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cargando Sistema</h2>
          <p className="text-gray-600">Verificando tu sesión...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-pink-50 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">Debes iniciar sesión para acceder al sistema de tipos de precio.</p>
          <Link 
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  if (!user.empresaId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Empresa Requerida</h2>
          <p className="text-gray-600 mb-8">
            Para gestionar tipos de precio necesitas tener una empresa registrada. 
            Los tipos de precio te permiten manejar diferentes categorías de clientes.
          </p>
          <Link 
            href="/inicio/empresa"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Crear Mi Empresa
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header con gradiente ámbar para tipos de precio */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6">
                <FiDollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Tipos de Precio</h1>
                <p className="text-amber-100 text-lg">
                  Configura diferentes categorías de precios para tus clientes
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-amber-100 text-sm">Total Tipos</p>
                  <p className="text-white font-bold text-3xl">{tiposPrecio.length}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-amber-100 text-sm">Empresa</p>
                  <p className="text-white font-bold text-lg">{user.empresaId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 flex items-center shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 mb-1">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 flex items-center shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
              <FiCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-green-900 mb-1">Éxito</h3>
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Formulario para crear nuevo tipo */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="border-l-4 border-amber-600 pl-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiPlus className="w-5 h-5 mr-2 text-amber-600" />
              Crear Nuevo Tipo de Precio
            </h2>
            <p className="text-gray-600 text-sm mt-1">Define categorías como: Público, Mayorista, VIP, Distribuidor</p>
          </div>

          <form onSubmit={crearTipo} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FiTag className="inline w-4 h-4 mr-2 text-amber-600" />
                Nombre del Tipo de Precio
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Público, Mayorista, VIP, Distribuidor..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                disabled={submitting}
                required
              />
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <FiInfo className="w-4 h-4 mr-1" />
                Los tipos de precio te permiten manejar diferentes categorías de clientes
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || !nombre.trim()}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                    Creando tipo...
                  </>
                ) : (
                  <>
                    <FiPlus className="w-5 h-5 mr-2" />
                    Crear Tipo de Precio
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={obtenerTipos}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de tipos de precio */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-l-4 border-amber-600 pl-4 p-6 pb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiBarChart className="w-5 h-5 mr-2 text-amber-600" />
              Tipos de Precio Registrados
            </h2>
            <p className="text-gray-600 text-sm mt-1">Gestiona tus categorías de precios existentes</p>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLoader className="w-8 h-8 text-amber-600 animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cargando Tipos de Precio</h3>
              <p className="text-gray-600">Obteniendo información...</p>
            </div>
          ) : tiposPrecio.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FiTarget className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No tienes tipos de precio registrados
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                Los tipos de precio te permiten manejar diferentes categorías de clientes como público general, mayoristas, VIP, etc.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2">Ejemplos comunes:</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Público General</li>
                    <li>• Mayorista</li>
                    <li>• VIP / Premium</li>
                    <li>• Distribuidor</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                      <div className="flex items-center">
                        <FiTag className="w-4 h-4 mr-2 text-amber-600" />
                        Nombre del Tipo
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tiposPrecio.map((tipo) => {
                    const idActual = tipo.id || tipo._id
                    const isEditing = editandoId === idActual
                    
                    return (
                      <tr key={`tipo-${tipo._id}`} className="hover:bg-amber-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <FiEdit2 className="w-4 h-4 text-amber-600" />
                              </div>
                              <input
                                type="text"
                                value={editNombre}
                                onChange={(e) => setEditNombre(e.target.value)}
                                className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                autoFocus
                                disabled={submitting}
                                placeholder="Nombre del tipo de precio..."
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <FiDollarSign className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900 text-lg">{tipo.nombre}</span>
                                <div className="text-xs text-gray-500 mt-1">
                                  ID: {idActual}
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={guardarEdicion}
                                  disabled={submitting || !editNombre.trim()}
                                  className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Guardar cambios"
                                >
                                  {submitting ? (
                                    <FiLoader className="w-4 h-4 mr-1 animate-spin" />
                                  ) : (
                                    <FiSave className="w-4 h-4 mr-1" />
                                  )}
                                  Guardar
                                </button>
                                <button
                                  onClick={cancelarEdicion}
                                  disabled={submitting}
                                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                                  title="Cancelar edición"
                                >
                                  <FiX className="w-4 h-4 mr-1" />
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => iniciarEdicion(tipo)}
                                  className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                                  title="Editar tipo de precio"
                                >
                                  <FiEdit2 className="w-4 h-4 mr-1" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => eliminarTipo(idActual, tipo.nombre)}
                                  className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                                  title="Eliminar tipo de precio"
                                >
                                  <FiTrash2 className="w-4 h-4 mr-1" />
                                  Eliminar
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer con estadísticas */}
        {tiposPrecio.length > 0 && (
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-center mb-2">
                  <FiAward className="w-6 h-6" />
                </div>
                <div className="font-bold text-xl">{tiposPrecio.length}</div>
                <div className="text-amber-100 text-sm">Tipos Registrados</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-center mb-2">
                  <FiUsers className="w-6 h-6" />
                </div>
                <div className="font-bold text-xl">Activos</div>
                <div className="text-green-100 text-sm">Estado del sistema</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-center mb-2">
                  <FiTrendingUp className="w-6 h-6" />
                </div>
                <div className="font-bold text-xl">Premium</div>
                <div className="text-blue-100 text-sm">Gestión avanzada</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}