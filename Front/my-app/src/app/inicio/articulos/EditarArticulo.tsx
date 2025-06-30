'use client'

import { useState } from 'react'
import { FiPackage, FiSave, FiX, FiCheck, FiAlertCircle, FiDollarSign, FiFileText, FiEdit3 } from 'react-icons/fi'
import api from '@/app/lib/api'
import type { Articulo } from '@/app/inicio/articulos/articledto'

interface Props {
  articulo: Articulo
  onClose: () => void
  onUpdated: () => void
}

export default function EditarArticulo({ articulo, onClose, onUpdated }: Props) {
  const [nombre, setNombre] = useState(articulo.nombre)
  const [descripcion, setDescripcion] = useState(articulo.descripcion || '')
  const [precio, setPrecio] = useState(articulo.precio)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validaciones
    if (!nombre.trim()) {
      setError('El nombre del artículo es requerido')
      setLoading(false)
      return
    }

    if (precio <= 0) {
      setError('El precio debe ser mayor a 0')
      setLoading(false)
      return
    }

    try {
      await api.put(`/articulos/${articulo.id}`, { 
        nombre: nombre.trim(), 
        descripcion: descripcion.trim() || null, 
        precio 
      })
      
      setSuccess('Artículo actualizado exitosamente')
      setTimeout(() => {
        onUpdated()
        onClose()
      }, 1000)
    } catch (error: any) {
      console.error('Error al editar artículo:', error)
      setError(error.response?.data?.error || 'Error al actualizar el artículo')
    } finally {
      setLoading(false)
    }
  }

  const precioOriginal = articulo.precio
  const hasChanges = nombre !== articulo.nombre || 
                    descripcion !== (articulo.descripcion || '') || 
                    precio !== precioOriginal

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <FiEdit3 className="w-6 h-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Editar Artículo</h2>
                <p className="text-blue-100 text-sm">
                  Modificando: <strong>{articulo.nombre}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/10"
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
            {/* Información del artículo */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <FiPackage className="w-4 h-4 mr-2" />
                Información del Artículo
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Código:</span>
                  <span className="ml-2 font-mono text-blue-900">{articulo.codigo}</span>
                </div>
                <div>
                  <span className="text-blue-700">ID:</span>
                  <span className="ml-2 font-bold text-blue-900">#{articulo.id}</span>
                </div>
                <div>
                  <span className="text-blue-700">Creado:</span>
                  <span className="ml-2 text-blue-900">
                    {new Date(articulo.createdAt).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Fotos:</span>
                  <span className="ml-2 text-blue-900">
                    {articulo.fotos?.length || 0} imagen{(articulo.fotos?.length || 0) !== 1 ? 'es' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Campos de edición */}
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Artículo *
                </label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Nombre del artículo"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      error && !nombre.trim() ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                    disabled={loading}
                    maxLength={100}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Nombre descriptivo del producto
                  </p>
                  <span className="text-xs text-gray-400">
                    {nombre.length}/100
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción detallada del artículo (opcional)"
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    disabled={loading}
                    maxLength={500}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Información adicional sobre el producto
                  </p>
                  <span className="text-xs text-gray-400">
                    {descripcion.length}/500
                  </span>
                </div>
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio *
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={precio || ''}
                    onChange={(e) => {
                      setPrecio(parseFloat(e.target.value) || 0)
                      if (error) setError('')
                    }}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      error && precio <= 0 ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Precio de venta del producto
                  </p>
                  {precio > 0 && (
                    <span className="text-xs text-green-600 font-medium">
                      ${precio.toLocaleString('es-CO')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Comparación de cambios */}
            {hasChanges && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-3">📋 Resumen de Cambios</h4>
                <div className="space-y-2 text-sm">
                  {nombre !== articulo.nombre && (
                    <div className="flex justify-between">
                      <span className="text-yellow-700">Nombre:</span>
                      <div className="text-right">
                        <div className="text-gray-500 line-through">{articulo.nombre}</div>
                        <div className="text-yellow-800 font-medium">{nombre}</div>
                      </div>
                    </div>
                  )}
                  {descripcion !== (articulo.descripcion || '') && (
                    <div className="flex justify-between">
                      <span className="text-yellow-700">Descripción:</span>
                      <div className="text-right max-w-xs">
                        <div className="text-gray-500 line-through text-xs">
                          {articulo.descripcion || 'Sin descripción'}
                        </div>
                        <div className="text-yellow-800 font-medium text-xs">
                          {descripcion || 'Sin descripción'}
                        </div>
                      </div>
                    </div>
                  )}
                  {precio !== precioOriginal && (
                    <div className="flex justify-between">
                      <span className="text-yellow-700">Precio:</span>
                      <div className="text-right">
                        <div className="text-gray-500 line-through">
                          ${precioOriginal.toLocaleString('es-CO')}
                        </div>
                        <div className="text-yellow-800 font-bold">
                          ${precio.toLocaleString('es-CO')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">ℹ️ Información Importante</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Los cambios se aplicarán inmediatamente al guardar</li>
                <li>• El código del artículo no se puede modificar</li>
                <li>• Las fotos se gestionan desde el listado principal</li>
                <li>• Los precios afectan cálculos de inventario existente</li>
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
                disabled={loading || !hasChanges || !nombre.trim() || precio <= 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Actualizando...
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