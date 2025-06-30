'use client'

import { useState } from 'react'
import { FiAlertTriangle, FiTrash2, FiTruck, FiAlertCircle, FiX, FiSave, FiInfo } from 'react-icons/fi'
import api from '@/app/lib/api'

export default function EliminarProveedor({
  proveedor,
  onClose,
  onDeleted
}: {
  proveedor: { id: number; nombre: string }
  onClose: () => void
  onDeleted: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const eliminar = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await api.delete(`/proveedores/${proveedor.id}`)
      
      onDeleted()
      onClose()
    } catch (error: any) {
      console.error('Error al eliminar proveedor:', error)
      setError(error.response?.data?.error || 'Error al eliminar el proveedor')
    } finally {
      setLoading(false)
    }
  }

  const isConfirmValid = confirmText.toLowerCase() === 'eliminar'

  return (
    <div className="space-y-6">
      {/* Mensaje de advertencia principal */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
            <FiAlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-red-900 font-bold text-lg mb-2">⚠️ Acción Irreversible</h3>
            <p className="text-red-800 leading-relaxed">
              Estás a punto de eliminar permanentemente este proveedor del sistema. 
              Esta acción <strong>no se puede deshacer</strong> y se perderán todos los datos asociados.
            </p>
          </div>
        </div>
      </div>

      {/* Información del proveedor a eliminar */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
        <h3 className="flex items-center text-indigo-900 font-bold text-lg mb-4">
          <FiTruck className="w-6 h-6 mr-3" />
          Proveedor a Eliminar
        </h3>
        
        <div className="bg-white rounded-xl p-6 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{proveedor.nombre}</h4>
              <div className="flex items-center text-indigo-600 text-sm">
                <span className="bg-indigo-100 rounded-lg px-3 py-1 font-mono">
                  ID: #{proveedor.id}
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
              <FiAlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Consecuencias de la eliminación */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6">
        <h4 className="font-bold text-amber-900 mb-4 flex items-center">
          <FiInfo className="w-5 h-5 mr-2" />
          Consecuencias de esta Acción
        </h4>
        <ul className="text-amber-800 text-sm space-y-2">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Se eliminará permanentemente toda la información del proveedor
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Las compras históricas mantendrán el nombre del proveedor como referencia
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            No se podrán realizar nuevas compras con este proveedor
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Esta acción no se puede revertir una vez confirmada
          </li>
        </ul>
      </div>

      {/* Campo de confirmación */}
      <div className="space-y-4">
        <div className="border-l-4 border-red-600 pl-4">
          <h4 className="font-bold text-gray-900 mb-2">Confirmación Requerida</h4>
          <p className="text-gray-700 text-sm">
            Para confirmar esta acción destructiva, escribe exactamente <span className="font-bold text-red-600">"eliminar"</span> en el campo de abajo:
          </p>
        </div>
        
        <div>
          <label htmlFor="confirm" className="block text-sm font-semibold text-gray-700 mb-3">
            Escribir "eliminar" para confirmar:
          </label>
          <input
            id="confirm"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-gray-900 placeholder-gray-500"
            placeholder="Escribe 'eliminar' para habilitar el botón"
            disabled={loading}
            autoComplete="off"
          />
          
          {confirmText && !isConfirmValid && (
            <div className="mt-2 text-sm text-amber-600 flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-2" />
              Debes escribir exactamente "eliminar" para continuar
            </div>
          )}
          
          {isConfirmValid && (
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <FiTruck className="w-4 h-4 mr-2" />
              Confirmación válida - Puedes proceder con la eliminación
            </div>
          )}
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <FiAlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900">Error en la Eliminación</h4>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          <FiX className="w-5 h-5 mr-2" />
          Cancelar Eliminación
        </button>
        
        <button
          type="button"
          onClick={eliminar}
          disabled={loading || !isConfirmValid}
          className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
            loading || !isConfirmValid
              ? 'bg-gray-400 text-white cursor-not-allowed transform-none shadow-none'
              : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Eliminando Proveedor...
            </>
          ) : (
            <>
              <FiTrash2 className="w-5 h-5 mr-2" />
              Confirmar Eliminación
            </>
          )}
        </button>
      </div>

      {/* Advertencia final */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">
          ⚠️ Recuerda: Esta acción eliminará permanentemente el proveedor del Sistema SC
        </p>
      </div>
    </div>
  )
}