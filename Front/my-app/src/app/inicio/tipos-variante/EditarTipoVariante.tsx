'use client'

import { useState } from 'react'
import { FiEdit2, FiSave, FiX, FiAlertCircle, FiTag } from 'react-icons/fi'
import api from '@/app/lib/api'
import type { TipoVariante } from '@/app/tipos-variante/typedto'

export default function EditarTipoVariante({
  tipo,
  onClose,
  onUpdated,
}: {
  tipo: TipoVariante
  onClose: () => void
  onUpdated: () => void
}) {
  const [nombre, setNombre] = useState(tipo.nombre)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nombre.trim()) {
      setError('El nombre del tipo de variante es requerido')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      await api.put(`/tipos-variante/${tipo.id}`, { nombre: nombre.trim() })
      onUpdated()
      onClose()
    } catch (err) {
      console.error('Error al editar tipo de variante:', err)
      setError('Error al actualizar tipo de variante. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setNombre(tipo.nombre) // Resetear al valor original
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <FiEdit2 className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-bold">Editar Tipo de Variante</h2>
            </div>
            <button
              onClick={handleCancel}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
              aria-label="Cerrar modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Campo nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FiTag className="w-4 h-4 mr-2 text-amber-600" />
                Nombre del Tipo de Variante
              </div>
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value)
                setError('') // Limpiar error al escribir
              }}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                       transition-all duration-200 text-gray-900 placeholder-gray-500
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Ej: Talla, Color, Material..."
              required
              disabled={isLoading}
              maxLength={50}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo 50 caracteres ({nombre.length}/50)
            </p>
          </div>

          {/* Información del tipo actual */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-amber-800 mb-2">Información Actual</h3>
            <div className="text-sm text-amber-700">
              <p><span className="font-medium">ID:</span> {tipo.id}</p>
              <p><span className="font-medium">Nombre Original:</span> {tipo.nombre}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || !nombre.trim() || nombre.trim() === tipo.nombre}
              className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                isLoading || !nombre.trim() || nombre.trim() === tipo.nombre
                  ? 'bg-gray-400 text-white cursor-not-allowed transform-none shadow-none'
                  : 'bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5 mr-2" />
                  Actualizar Tipo
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}