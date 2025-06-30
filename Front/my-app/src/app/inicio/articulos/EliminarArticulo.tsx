'use client'

import { useState } from 'react'
import { FiAlertTriangle, FiX, FiTrash2, FiBox, FiDollarSign, FiHash, FiAlertCircle } from 'react-icons/fi'
import api from '@/app/lib/api'
import type { Articulo } from '@/app/inicio/articulos/articledto'

interface Props {
  articulo: Articulo
  onClose: () => void
  onDeleted: () => void
}

export default function EliminarArticulo({ articulo, onClose, onDeleted }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await api.delete(`/articulos/${articulo.id}`)
      
      onDeleted()
      onClose()
    } catch (error: any) {
      console.error('Error al eliminar articulo:', error)
      setError(error.response?.data?.error || 'Error al eliminar el articulo')
    } finally {
      setLoading(false)
    }
  }

  const isConfirmValid = confirmText.toLowerCase() === 'eliminar'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
        {/* Header con gradiente de peligro */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <FiAlertTriangle className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-bold">Eliminar Articulo</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
              aria-label="Cerrar modal"
              disabled={loading}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Mensaje de advertencia */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <FiAlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-bold mb-2">Accion Irreversible</h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  Estas a punto de eliminar permanentemente este articulo. Esta accion no se puede deshacer 
                  y se perderan todos los datos asociados.
                </p>
              </div>
            </div>
          </div>

          {/* Información del artículo */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="flex items-center text-blue-800 font-bold mb-4">
              <FiBox className="w-5 h-5 mr-2" />
              Articulo a Eliminar
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">{articulo.nombre}</span>
                <div className="flex items-center text-blue-600 text-sm">
                  <FiHash className="w-4 h-4 mr-1" />
                  {articulo.codigo}
                </div>
              </div>
              
              {articulo.descripcion && (
                <p className="text-blue-600 text-sm bg-white/50 rounded-lg p-3">
                  {articulo.descripcion}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                <span className="text-blue-700 font-medium">Precio:</span>
                <div className="flex items-center text-green-600 font-bold">
                  <FiDollarSign className="w-4 h-4 mr-1" />
                  {articulo.precio.toLocaleString('es-CO')}
                </div>
              </div>
            </div>
          </div>

          {/* Campo de confirmación */}
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
              Para confirmar, escribe <span className="font-bold text-red-600">"eliminar"</span> en el campo:
            </label>
            <input
              id="confirm"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 
                       transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder="Escribe 'eliminar' para confirmar"
              disabled={loading}
              autoComplete="off"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || !isConfirmValid}
              className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                loading || !isConfirmValid
                  ? 'bg-gray-400 text-white cursor-not-allowed transform-none shadow-none'
                  : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white'
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
                  Eliminar Articulo
                </>
              )}
            </button>
          </div>

          {/* Advertencia final */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Esta accion eliminara permanentemente el articulo y no se puede deshacer
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}