'use client'

import { useState } from 'react'
import { FiTag, FiSave, FiX, FiCheck, FiAlertCircle, FiLayers, FiPlus } from 'react-icons/fi'
import api from '@/app/lib/api'

// Tipos locales
interface TipoVariante {
  id: number
  nombre: string
  createdAt?: Date
  updatedAt?: Date
}

interface Props {
  tipo: TipoVariante
  onClose: () => void
  onCreated: () => void
}

export default function CrearValorVariante({ tipo, onClose, onCreated }: Props) {
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
      setError('El nombre del valor es requerido')
      setLoading(false)
      return
    }

    try {
      await api.post(`/valor-variante/tipos/${tipo.id}/valores`, { nombre: nombre.trim() })
      setSuccess('Valor creado exitosamente')
      
      setTimeout(() => {
        onCreated()
        onClose()
      }, 1000)
    } catch (error: any) {
      console.error('Error al crear valor de variante:', error)
      setError(error.response?.data?.error || 'Error al crear el valor')
    } finally {
      setLoading(false)
    }
  }

  // Ejemplos dinámicos basados en el tipo
  const getEjemplos = (tipoNombre: string) => {
    const ejemplos: { [key: string]: string[] } = {
      'talla': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      'color': ['Rojo', 'Azul', 'Verde', 'Negro', 'Blanco', 'Gris'],
      'material': ['Cuero', 'Sintético', 'Tela', 'Gamuza', 'Lona'],
      'marca': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Converse'],
      'estilo': ['Casual', 'Deportivo', 'Formal', 'Urbano', 'Clásico'],
      'temporada': ['Primavera', 'Verano', 'Otoño', 'Invierno']
    }

    const nombre = tipoNombre.toLowerCase()
    return ejemplos[nombre] || ['Valor 1', 'Valor 2', 'Valor 3']
  }

  const ejemplos = getEjemplos(tipo.nombre)

  const getColorForType = (tipoNombre: string) => {
    const colores: { [key: string]: string } = {
      'talla': 'blue',
      'color': 'red',
      'material': 'green',
      'marca': 'purple',
      'estilo': 'indigo',
      'temporada': 'orange'
    }
    return colores[tipoNombre.toLowerCase()] || 'gray'
  }

  const color = getColorForType(tipo.nombre)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${color}-600 to-${color}-700 px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <FiTag className="w-6 h-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Nuevo Valor</h2>
                <p className={`text-${color}-100 text-sm`}>
                  Agregar valor para: <strong>{tipo.nombre}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`text-white hover:text-${color}-200 transition-colors p-2 rounded-lg hover:bg-white/10`}
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
            {/* Información del tipo */}
            <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg p-4 border border-${color}-200`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiLayers className={`w-5 h-5 text-${color}-600 mr-2`} />
                  <div>
                    <h3 className={`font-semibold text-${color}-900`}>Tipo de Variante</h3>
                    <p className={`text-${color}-700 text-sm`}>{tipo.nombre}</p>
                  </div>
                </div>
                <div className={`bg-${color}-600 text-white px-3 py-1 rounded-full text-xs font-medium`}>
                  ID: {tipo.id}
                </div>
              </div>
            </div>

            {/* Campo de nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valor para {tipo.nombre} *
              </label>
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder={`Ej: ${ejemplos[0]}, ${ejemplos[1]}, ${ejemplos[2]}...`}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:border-transparent transition-all ${
                    error && !nombre.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                  disabled={loading}
                  maxLength={30}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  Este valor estará disponible para asignar a productos
                </p>
                <span className="text-xs text-gray-400">
                  {nombre.length}/30
                </span>
              </div>
            </div>

            {/* Ejemplos sugeridos */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <FiPlus className="w-4 h-4 mr-2 text-gray-600" />
                Valores sugeridos para {tipo.nombre}
              </h4>
              <div className="flex flex-wrap gap-2">
                {ejemplos.map((ejemplo, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setNombre(ejemplo)}
                    className={`text-sm bg-${color}-100 hover:bg-${color}-200 text-${color}-700 hover:text-${color}-800 px-3 py-2 rounded-lg transition-all duration-200 border border-${color}-200 hover:border-${color}-300`}
                  >
                    {ejemplo}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Haz clic en cualquier sugerencia para usarla como valor
              </p>
            </div>

            {/* Vista previa */}
            {nombre.trim() && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FiCheck className="w-4 h-4 mr-2 text-blue-600" />
                  Vista Previa del Valor
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Tipo:</span>
                    <span className={`bg-${color}-100 text-${color}-800 px-2 py-1 rounded text-sm font-medium`}>
                      {tipo.nombre}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Nuevo Valor:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                      {nombre}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Importante</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Este valor se podrá asignar a artículos del tipo "{tipo.nombre}"</li>
                <li>• Puedes crear múltiples valores para el mismo tipo</li>
                <li>• Los valores pueden ser editados o eliminados posteriormente</li>
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
                className={`flex-1 px-6 py-3 bg-gradient-to-r from-${color}-600 to-${color}-700 text-white rounded-lg hover:from-${color}-700 hover:to-${color}-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 mr-2" />
                    Crear Valor
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