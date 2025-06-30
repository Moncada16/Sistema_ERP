'use client'

import { useState, useEffect } from 'react'
import { FiEdit3, FiX, FiSave, FiTag, FiAlertCircle, FiCheck, FiLayers, FiPackage, FiTrash2 } from 'react-icons/fi'
import api from '@/app/lib/api'

// Tipos locales
interface ValorVariante {
  id: number
  nombre: string
  tipoVarianteId: number
  tipoVariante?: {
    id: number
    nombre: string
  }
  articuloValores?: any[]
}

interface TipoVariante {
  id: number
  nombre: string
}

interface Props {
  valor: ValorVariante
  tipo: TipoVariante
  onClose: () => void
  onUpdated: () => void
}

export default function EditarValorVariante({ valor, tipo, onClose, onUpdated }: Props) {
  const [nombre, setNombre] = useState(valor.nombre)
  const [nombreOriginal] = useState(valor.nombre)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

    if (nombre.trim() === nombreOriginal) {
      setError('Debes cambiar el nombre para poder guardar')
      setLoading(false)
      return
    }

    try {
      await api.put(`/valor-variante/valores/${valor.id}`, { nombre: nombre.trim() })
      setSuccess('Valor actualizado exitosamente')
      
      setTimeout(() => {
        onUpdated()
        onClose()
      }, 1000)
    } catch (error: any) {
      console.error('Error al actualizar valor de variante:', error)
      setError(error.response?.data?.error || 'Error al actualizar el valor')
    } finally {
      setLoading(false)
    }
  }

  // Nueva función para eliminar valor
  const handleEliminar = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    try {
      setLoading(true)
      setError('')
      await api.delete(`/valor-variante/valores/${valor.id}`)
      setSuccess('Valor eliminado exitosamente')
      
      setTimeout(() => {
        onUpdated()
        onClose()
      }, 1000)
    } catch (error: any) {
      console.error('Error al eliminar valor:', error)
      setError(error.response?.data?.error || 'Error al eliminar el valor')
      setShowDeleteConfirm(false)
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

  const ejemplos = getEjemplos(tipo.nombre).filter(ejemplo => 
    ejemplo.toLowerCase() !== nombre.toLowerCase()
  )

  const getColorForType = (tipoNombre: string) => {
    const colores: { [key: string]: string } = {
      'talla': 'blue',
      'color': 'red',
      'material': 'green',
      'marca': 'purple',
      'estilo': 'indigo',
      'temporada': 'orange'
    }
    return colores[tipoNombre.toLowerCase()] || 'amber'
  }

  const color = getColorForType(tipo.nombre)
  const hasChanges = nombre.trim() !== nombreOriginal
  const productosAsociados = valor.articuloValores?.length || 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${color}-600 to-${color}-700 px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <FiEdit3 className="w-6 h-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Editar Valor</h2>
                <p className={`text-${color}-100 text-sm`}>
                  Modificar valor de: <strong>{tipo.nombre}</strong>
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
            {/* Información del valor actual */}
            <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg p-4 border border-${color}-200`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FiLayers className={`w-5 h-5 text-${color}-600 mr-2`} />
                  <div>
                    <h3 className={`font-semibold text-${color}-900`}>Tipo de Variante</h3>
                    <p className={`text-${color}-700 text-sm`}>{tipo.nombre}</p>
                  </div>
                </div>
                <div className={`bg-${color}-600 text-white px-3 py-1 rounded-full text-xs font-medium`}>
                  ID: {valor.id}
                </div>
              </div>
              
              {/* Información de productos asociados */}
              {productosAsociados > 0 && (
                <div className="flex items-center mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <FiPackage className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-blue-800 text-sm font-medium">
                    {productosAsociados} producto(s) usando este valor
                  </span>
                </div>
              )}
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
                  placeholder={`Ej: ${getEjemplos(tipo.nombre)[0]}`}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:border-transparent transition-all ${
                    error && !nombre.trim() ? 'border-red-300' : hasChanges ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                  }`}
                  required
                  disabled={loading}
                  maxLength={30}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  {hasChanges ? (
                    <span className="text-blue-600 font-medium">✓ Cambios detectados</span>
                  ) : (
                    'Modifica el nombre para guardar cambios'
                  )}
                </p>
                <span className="text-xs text-gray-400">
                  {nombre.length}/30
                </span>
              </div>
            </div>

            {/* Comparación antes/después */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FiEdit3 className="w-4 h-4 mr-2 text-gray-600" />
                Comparación de Cambios
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Valor Actual:</span>
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                    {nombreOriginal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Nuevo Valor:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    hasChanges 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {nombre || '(vacío)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sugerencias (solo si hay ejemplos diferentes) */}
            {ejemplos.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <FiTag className="w-4 h-4 mr-2 text-gray-600" />
                  Otras opciones para {tipo.nombre}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ejemplos.slice(0, 4).map((ejemplo, index) => (
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
              </div>
            )}

            {/* Advertencia si hay productos asociados */}
            {productosAsociados > 0 && hasChanges && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">⚠️ Advertencia</h4>
                <p className="text-orange-700 text-sm">
                  Este valor está siendo usado en <strong>{productosAsociados} producto(s)</strong>. 
                  Al cambiar el nombre, se actualizará en todos los productos que lo usen.
                </p>
              </div>
            )}

            {/* Confirmación de eliminación */}
            {showDeleteConfirm && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <FiAlertCircle className="w-5 h-5 mr-2" />
                  ¿Confirmar Eliminación?
                </h4>
                <p className="text-red-700 text-sm mb-3">
                  {productosAsociados > 0 ? (
                    <>
                      <strong>ATENCIÓN:</strong> Este valor está siendo usado en <strong>{productosAsociados} producto(s)</strong>. 
                      Al eliminarlo, se quitará de todos los productos asociados.
                    </>
                  ) : (
                    <>
                      ¿Estás seguro de que quieres eliminar el valor "<strong>{valor.nombre}</strong>"? 
                      Esta acción no se puede deshacer.
                    </>
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEliminar}
                    disabled={loading}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Eliminando...' : 'Sí, Eliminar'}
                  </button>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Información</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Los cambios se aplicarán inmediatamente</li>
                <li>• Los productos asociados mantendrán la referencia actualizada</li>
                <li>• Puedes revertir los cambios antes de guardar</li>
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

              {/* Botón eliminar */}
              <button
                type="button"
                onClick={handleEliminar}
                disabled={loading}
                className={`px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                  showDeleteConfirm 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
                title={showDeleteConfirm ? "Confirmar eliminación" : "Eliminar este valor"}
              >
                <FiTrash2 className="w-5 h-5 mr-2" />
                {showDeleteConfirm ? 'Confirmar' : 'Eliminar'}
              </button>
              
              <button
                type="submit"
                disabled={loading || !nombre.trim() || !hasChanges}
                className={`flex-1 px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                  hasChanges && nombre.trim()
                    ? `bg-gradient-to-r from-${color}-600 to-${color}-700 text-white hover:from-${color}-700 hover:to-${color}-800`
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 mr-2" />
                    {hasChanges ? 'Guardar Cambios' : 'Sin Cambios'}
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