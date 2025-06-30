'use client'

import { useEffect, useState } from 'react'
import { FiArchive, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiAlertCircle, FiHome } from 'react-icons/fi'
import api from '@/app/lib/api'
import { useAuth } from '@/app/context/AuthContext'
import BodegaModal from '@/app/inicio/bodega/BodegaModal'
import EliminarBodegaModal from '@/app/inicio/bodega/EliminarBodegaModal'

type Bodega = {
  id: number
  nombre: string
  direccion: string
}

export default function BodegaPage() {
  const { user, isLoading, hasCompany } = useAuth()
  const [bodegas, setBodegas] = useState<Bodega[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modo, setModo] = useState<'crear' | 'editar'>('crear')
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<Bodega | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalEliminar, setModalEliminar] = useState<Bodega | null>(null)

  const obtenerBodegas = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/bodegas')
      console.log('✅ Sistema SC - Bodegas obtenidas:', res.data)
      setBodegas(res.data)
    } catch (err: any) {
      console.error('❌ Sistema SC - Error al obtener bodegas:', err)
      const errorMessage = err.response?.data?.error || 'Error al cargar bodegas'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && hasCompany) {
      console.log('🏢 Sistema SC - Obteniendo bodegas para empresa:', user.empresaId)
      obtenerBodegas()
    } else if (user && !hasCompany) {
      setLoading(false)
      setError('Debes tener una empresa registrada para gestionar bodegas')
    }
  }, [user, hasCompany])

  const handleCrear = () => {
    setModo('crear')
    setBodegaSeleccionada(null)
    setModalAbierto(true)
  }

  const handleEditar = (bodega: Bodega) => {
    setModo('editar')
    setBodegaSeleccionada(bodega)
    setModalAbierto(true)
  }

  const handleEliminar = (bodega: Bodega) => {
    setModalEliminar(bodega)
  }

  const confirmarEliminar = async () => {
    if (!modalEliminar) return
    
    try {
      await api.delete(`/bodegas/${modalEliminar.id}`)
      console.log('✅ Sistema SC - Bodega eliminada:', modalEliminar.id)
      obtenerBodegas()
      setModalEliminar(null)
      setError('')
    } catch (err: any) {
      console.error('❌ Sistema SC - Error al eliminar:', err)
      const errorMessage = err.response?.data?.error || 'Error al eliminar bodega'
      setError(errorMessage)
    }
  }

  const handleGuardar = async (data: Partial<Bodega>, id?: number) => {
    console.log('💾 Sistema SC - Guardando bodega:', { data, id, modo })
    
    try {
      setError('')
      
      if (modo === 'crear') {
        const response = await api.post('/bodegas', data)
        console.log('✅ Sistema SC - Bodega creada:', response.data)
      } else if (id) {
        const response = await api.put(`/bodegas/${id}`, data)
        console.log('✅ Sistema SC - Bodega actualizada:', response.data)
      }
      
      setModalAbierto(false)
      obtenerBodegas()
    } catch (err: any) {
      console.error('❌ Sistema SC - Error al guardar bodega:', err)
      const errorMessage = err.response?.data?.error || 'Error al guardar bodega'
      setError(errorMessage)
    }
  }

  // Estados de carga y error
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando bodegas del Sistema SC...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <FiAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Acceso Restringido</h2>
          <p className="text-red-700">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  if (!hasCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 max-w-md text-center">
          <FiHome className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-amber-800 mb-2">Empresa Requerida</h2>
          <p className="text-amber-700 mb-4">Debes tener una empresa registrada para gestionar bodegas.</p>
          <button 
            onClick={() => window.location.href = '/empresa/crear'}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Crear Empresa
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Premium */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiArchive className="w-10 h-10 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Gestión de Bodegas</h1>
                <p className="text-green-100 mt-2">Administra las ubicaciones de almacenamiento del Sistema SC</p>
              </div>
            </div>
            <div className="hidden md:flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{bodegas.length}</div>
                <div className="text-green-100 text-sm">Bodegas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Botón crear */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleCrear}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg hover:from-green-700 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Nueva Bodega
          </button>
        </div>

        {/* Tabla de bodegas */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiArchive className="w-5 h-5 mr-2 text-green-600" />
              Listado de Bodegas ({bodegas.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiArchive className="w-4 h-4 mr-2" />
                      Nombre
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiMapPin className="w-4 h-4 mr-2" />
                      Dirección
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bodegas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FiArchive className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay bodegas</h3>
                        <p className="text-gray-500 mb-4">Comienza creando tu primera bodega para organizar el inventario</p>
                        <button
                          onClick={handleCrear}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FiPlus className="w-4 h-4 mr-2" />
                          Crear Primera Bodega
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bodegas.map((bodega) => (
                    <tr key={bodega.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <FiArchive className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{bodega.nombre}</div>
                            <div className="text-sm text-gray-500">ID: {bodega.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-900">
                          <FiMapPin className="w-4 h-4 text-gray-400 mr-2" />
                          {bodega.direccion}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditar(bodega)}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <FiEdit2 className="w-4 h-4 mr-1" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(bodega)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            <FiTrash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de bodega */}
      {modalAbierto && (
        <BodegaModal
          open={modalAbierto}
          modo={modo}
          initialData={bodegaSeleccionada ?? undefined}
          onClose={() => setModalAbierto(false)}
          onSubmit={handleGuardar}
        />
      )}

      {/* Modal de eliminar */}
      {modalEliminar && (
        <EliminarBodegaModal
          bodega={modalEliminar}
          onClose={() => setModalEliminar(null)}
          onConfirm={confirmarEliminar}
        />
      )}
    </div>
  )
}