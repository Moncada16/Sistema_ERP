'use client'

import { useState } from 'react'
import { FiLayers, FiSave, FiX, FiCheck, FiAlertCircle, FiTag } from 'react-icons/fi'
import api from '@/app/lib/api'

interface Props {
  onClose: () => void
  onCreated: () => void
}

export default function CrearTipoVariante({ onClose, onCreated }: Props) {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!nombre.trim()) {
      setError('El nombre del tipo de variante es requerido')
      setLoading(false)
      return
    }

    try {
      await api.post('/tipos-variante', { nombre: nombre.trim() })
      setSuccess('Tipo de variante creado exitosamente')
      
      setTimeout(() => {
        onCreated()
        onClose()
      }, 1000)
    } catch (error: any) {
      console.error('Error al crear tipo de variante:', error)
      setError(error.response?.data?.error || 'Error al crear el tipo de variante')
    } finally {
      setLoading(false)
    }
  }

  const ejemplos = ['Talla', 'Color', 'Material', 'Marca', 'Estilo', 'Temporada']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <FiLayers className="w-6 h-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Nuevo Tipo de Variante</h2>
                <p className="text-amber-100 text-sm">Define una nueva característica para tus productos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-amber-200 transition-colors p-2 rounded-lg hover:bg-white/10"
              disabled={loading}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información explicativa */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
                <FiTag className="w-4 h-4 mr-2" />
                ¿Qué es un Tipo de Variante?
              </h3>
              <p className="text-amber-800 text-sm mb-3">
                Los tipos de variante son características que pueden tener diferentes valores para tus productos. 
                Por ejemplo: <strong>Talla</strong> (S, M, L) o <strong>Color</strong> (Rojo, Azul, Verde).
              </p>
              
              <div className="space-y-2">
                <p className="text-amber-700 font-medium text-xs">Ejemplos comunes:</p>
                <div className="flex flex-wrap gap-2">
                  {ejemplos.map((ejemplo, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setNombre(ejemplo)}
                      className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      {ejemplo}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Campo de nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Tipo de Variante *
              </label>
              <div className="relative">
                <FiLayers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="Ej: Talla, Color, Material..."
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                    error && !nombre.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                  disabled={loading}
                  maxLength={50}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  Este será el nombre de la característica que podrás usar en tus productos
                </p>
                <span className="text-xs text-gray-400">
                  {nombre.length}/50
                </span>
              </div>
            </div>

            {/* Vista previa */}
            {nombre.trim() && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <FiTag className="w-4 h-4 mr-2" />
                  Vista Previa
                </h4>
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tipo de Variante:</span>
                    <span className="font-semibold text-blue-900">{nombre}</span>
                  </div>
                  <div className="text-blue-700 text-xs">
                    Después podrás agregar valores como: S, M, L (para Talla) o Rojo, Azul (para Color)
                  </div>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">📋 Consejos</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Usa nombres descriptivos y fáciles de entender</li>
                <li>• Evita abreviaciones confusas</li>
                <li>• Un tipo de variante puede tener múltiples valores</li>
                <li>• Puedes editar o eliminar tipos de variante más tarde</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FiX className="w-5 h-5 mr-2" />
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={loading || !nombre.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 mr-2" />
                    Crear Tipo
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