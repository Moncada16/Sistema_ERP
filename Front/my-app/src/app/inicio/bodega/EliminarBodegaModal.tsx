'use client'

import { useState } from 'react'
import { FiAlertTriangle, FiX, FiTrash2, FiArchive, FiMapPin, FiAlertCircle } from 'react-icons/fi'

type Bodega = {
  id: number
  nombre: string
  direccion: string
}

interface EliminarBodegaModalProps {
  bodega: Bodega
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function EliminarBodegaModal({
  bodega,
  onClose,
  onConfirm
}: EliminarBodegaModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const handleConfirm = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await onConfirm()
      onClose()
    } catch (error: any) {
      console.error('❌ Sistema SC - Error al eliminar bodega:', error)
      setError(error.message || 'Error al eliminar la bodega')
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
              <h2 className="text-xl font-bold">Eliminar Bodega</h2>
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
                <h3 className="text-red-800 font-bold mb-2">Acción Irreversible</h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  Eliminar esta bodega del Sistema SC es permanente y puede afectar:
                </p>
                <ul className="text-red-700 text-sm mt-2 ml-4 list-disc">
                  <li>Inventario asociado a esta ubicación</li>
                  <li>Registros de movimientos de stock</li>
                  <li>Reportes históricos de la bodega</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Información de la bodega */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="flex items-center text-green-800 font-bold mb-4">
              <FiArchive className="w-5 h-5 mr-2" />
              Bodega a Eliminar
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-medium text-lg">{bodega.nombre}</span>
                <div className="flex items-center text-green-600 text-sm bg-white/50 rounded-lg px-3 py-1">
                  ID: {bodega.id}
                </div>
              </div>
              
              <div className="flex items-center text-green-600">
                <FiMapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{bodega.direccion}</span>
              </div>
            </div>
          </div>

          {/* Campo de confirmación */}
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
              Para confirmar la eliminación, escribe <span className="font-bold text-red-600">"eliminar"</span>:
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
              onClick={handleConfirm}
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
                  Eliminar Bodega
                </>
              )}
            </button>
          </div>

          {/* Advertencia final */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Esta acción eliminará permanentemente la bodega del Sistema SC
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}