'use client'

import { useState } from 'react'
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

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // ✅ CORREGIDO: Cambiar de '/api/articulos' a '/articulos'
      await api.delete(`/articulos/${articulo.id}`)
      
      onDeleted()
    } catch (error: any) {
      console.error('Error al eliminar artículo:', error)
      setError(error.response?.data?.error || 'Error al eliminar el artículo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Eliminar Artículo
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-3">
              ¿Estás seguro de que deseas eliminar este artículo?
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-900">{articulo.nombre}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {articulo.codigo}
                </span>
              </div>
              
              {articulo.descripcion && (
                <p className="text-sm text-gray-600 mb-2">{articulo.descripcion}</p>
              )}
              
              <p className="text-sm font-medium text-green-600">
                ${articulo.precio.toLocaleString('es-CO')}
              </p>
            </div>

            <p className="text-red-600 text-sm mt-3 font-medium">
              Esta acción no se puede deshacer.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}