'use client'

import { useState } from 'react'
import { FiEdit2, FiTrash2, FiMapPin, FiPhone, FiHome, FiAlertTriangle, FiX, FiAlertCircle } from 'react-icons/fi'
import api from '@/app/lib/api'
import { useRouter } from 'next/navigation'

type Props = {
  id: number
  nombre: string
  direccion: string
  telefono: string
  onDelete: () => void
}

export default function EmpresaCard({ id, nombre, direccion, telefono, onDelete }: Props) {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const handleEdit = () => {
    router.push(`/empresas/editar/${id}`)
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await api.delete(`/empresas/${id}`)
      
      onDelete()
      setShowDeleteModal(false)
    } catch (error: any) {
      console.error('Error al eliminar empresa:', error)
      setError(error.response?.data?.error || 'Error al eliminar empresa')
    } finally {
      setLoading(false)
    }
  }

  const isConfirmValid = confirmText.toLowerCase() === 'eliminar'

  return (
    <>
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
              <FiHome className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{nombre}</h3>
              <p className="text-sm text-purple-600 font-medium">ID: {id}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <FiMapPin className="w-4 h-4 mr-3 text-green-600" />
            <span className="text-sm">{direccion}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiPhone className="w-4 h-4 mr-3 text-blue-600" />
            <span className="text-sm">{telefono}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
          >
            <FiEdit2 className="w-4 h-4 mr-2" />
            Editar
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
          >
            <FiTrash2 className="w-4 h-4 mr-2" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-white">
                  <FiAlertTriangle className="w-6 h-6 mr-3" />
                  <h2 className="text-xl font-bold">Eliminar Empresa</h2>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                  disabled={loading}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start">
                  <FiAlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-800 font-bold mb-2">Accion Critica</h3>
                    <p className="text-red-700 text-sm leading-relaxed">
                      Eliminar esta empresa del Sistema SC es irreversible y afectara todos los datos asociados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="flex items-center text-purple-800 font-bold mb-4">
                  <FiHome className="w-5 h-5 mr-2" />
                  Empresa a Eliminar
                </h3>
                <div className="space-y-3">
                  <div className="text-purple-700 font-medium text-lg">{nombre}</div>
                  <div className="flex items-center text-purple-600 text-sm">
                    <FiMapPin className="w-4 h-4 mr-2" />
                    {direccion}
                  </div>
                  <div className="flex items-center text-purple-600 text-sm">
                    <FiPhone className="w-4 h-4 mr-2" />
                    {telefono}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para confirmar, escribe <span className="font-bold text-red-600">"eliminar"</span>:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  placeholder="Escribe 'eliminar' para confirmar"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading || !isConfirmValid}
                  className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    loading || !isConfirmValid
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white transform hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-5 h-5 mr-2" />
                      Eliminar Empresa
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}