'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'
import ProveedorModal from './ProveedorModal'
import EliminarProveedor from '@/app/inicio/proveedores/EliminarProveedor'
import { 
  FiTruck, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiLoader,
  FiAlertCircle,
  FiUsers,
  FiBarChart,
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiFileText,
  FiHome
} from 'react-icons/fi'

type Proveedor = {
  id: number
  nombre: string
  nit: string
  direccion?: string
  telefono?: string
  email?: string
  _count?: {
    compras: number
  }
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [editando, setEditando] = useState<Proveedor | null>(null)
  const [eliminando, setEliminando] = useState<Proveedor | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([])

  const cargar = async () => {
    try {
      setError('')
      const res = await api.get('/proveedores')
      setProveedores(res.data)
      setFilteredProveedores(res.data)
    } catch (err: any) {
      console.error('Error al cargar proveedores:', err)
      setError('Error al cargar los proveedores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProveedores(proveedores)
    } else {
      const filtered = proveedores.filter(proveedor =>
        proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.nit.includes(searchTerm) ||
        proveedor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.telefono?.includes(searchTerm)
      )
      setFilteredProveedores(filtered)
    }
  }, [searchTerm, proveedores])

  const handleNuevoProveedor = () => {
    setEditando(null)
    setMostrarModal(true)
  }

  const handleEditarProveedor = (proveedor: Proveedor) => {
    setEditando(proveedor)
    setMostrarModal(true)
  }

  const handleEliminarProveedor = (proveedor: Proveedor) => {
    setEliminando(proveedor)
  }

  const handleCloseModal = () => {
    setMostrarModal(false)
    setEditando(null)
  }

  const handleCloseEliminar = () => {
    setEliminando(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLoader className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cargando Proveedores</h2>
          <p className="text-gray-600">Obteniendo información de tus proveedores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header con gradiente índigo para proveedores */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6">
                <FiTruck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Gestión de Proveedores</h1>
                <p className="text-indigo-100 text-lg">
                  Administra tu red de proveedores y socios comerciales
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-indigo-100 text-sm">Total Proveedores</p>
                  <p className="text-white font-bold text-3xl">{proveedores.length}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-indigo-100 text-sm">Activos</p>
                  <p className="text-white font-bold text-3xl">{filteredProveedores.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de herramientas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            
            {/* Buscador */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar proveedores por nombre, NIT, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={handleNuevoProveedor}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Nuevo Proveedor
              </button>
              
              <button
                onClick={cargar}
                disabled={loading}
                className="inline-flex items-center px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>

              <button className="inline-flex items-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <FiDownload className="w-5 h-5 mr-2" />
                Exportar
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          {searchTerm && (
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <FiFilter className="w-4 h-4 mr-2" />
              Mostrando {filteredProveedores.length} de {proveedores.length} proveedores
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 flex items-center shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 mb-1">Error en el Sistema</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {filteredProveedores.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FiTruck className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm ? 'No se encontraron proveedores' : 'No tienes proveedores registrados'}
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {searchTerm 
                  ? `No hay proveedores que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`
                  : 'Los proveedores son fundamentales para tu negocio. Registra proveedores para gestionar tus compras y relaciones comerciales.'
                }
              </p>
              
              {!searchTerm && (
                <button
                  onClick={handleNuevoProveedor}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiPlus className="w-5 h-5 mr-3" />
                  Registrar Primer Proveedor
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Tabla premium de proveedores */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        <div className="flex items-center">
                          <FiHome className="w-4 h-4 mr-2 text-indigo-600" />
                          Empresa
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        <div className="flex items-center">
                          <FiFileText className="w-4 h-4 mr-2 text-indigo-600" />
                          NIT
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        <div className="flex items-center">
                          <FiPhone className="w-4 h-4 mr-2 text-green-600" />
                          Contacto
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        <div className="flex items-center">
                          <FiMapPin className="w-4 h-4 mr-2 text-blue-600" />
                          Ubicación
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProveedores.map((proveedor) => (
                      <tr key={proveedor.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-indigo-600 font-bold text-sm">
                                {proveedor.nombre.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{proveedor.nombre}</div>
                              {proveedor._count?.compras && (
                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                  <FiBarChart className="w-3 h-3 mr-1" />
                                  {proveedor._count.compras} compras
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-gray-900 font-medium">{proveedor.nit}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {proveedor.telefono && (
                              <div className="flex items-center text-sm text-gray-600">
                                <FiPhone className="w-3 h-3 mr-2 text-green-500" />
                                <span>{proveedor.telefono}</span>
                              </div>
                            )}
                            {proveedor.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <FiMail className="w-3 h-3 mr-2 text-blue-500" />
                                <span className="truncate max-w-xs">{proveedor.email}</span>
                              </div>
                            )}
                            {!proveedor.telefono && !proveedor.email && (
                              <span className="text-gray-400 text-sm">Sin contacto</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {proveedor.direccion ? (
                            <div className="flex items-start text-sm text-gray-600">
                              <FiMapPin className="w-3 h-3 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{proveedor.direccion}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Sin dirección</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditarProveedor(proveedor)}
                              className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                              title="Editar proveedor"
                            >
                              <FiEdit2 className="w-4 h-4 mr-1" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleEliminarProveedor(proveedor)}
                              className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                              title="Eliminar proveedor"
                            >
                              <FiTrash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer con estadísticas */}
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-center mb-2">
                    <FiUsers className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xl">{proveedores.length}</div>
                  <div className="text-indigo-100 text-sm">Total Proveedores</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-center mb-2">
                    <FiTruck className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xl">{filteredProveedores.length}</div>
                  <div className="text-blue-100 text-sm">Mostrados</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-center mb-2">
                    <FiMail className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xl">
                    {proveedores.filter(p => p.email).length}
                  </div>
                  <div className="text-green-100 text-sm">Con Email</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-center mb-2">
                    <FiPhone className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xl">
                    {proveedores.filter(p => p.telefono).length}
                  </div>
                  <div className="text-purple-100 text-sm">Con Teléfono</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modales - Fuera del contenedor principal */}
      </div>

      {/* Modales renderizados al nivel más alto */}
      {mostrarModal && (
        <ProveedorModal
          proveedor={editando ?? undefined}
          onClose={handleCloseModal}
          onSuccess={cargar}
        />
      )}

      {eliminando && (
        <EliminarProveedor
          proveedor={eliminando}
          onClose={handleCloseEliminar}
          onDeleted={cargar}
        />
      )}
    </div>
  )
}