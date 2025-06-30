'use client'

import React, { useState, useEffect } from 'react'
import { FiArchive, FiMapPin, FiX, FiSave, FiAlertCircle } from 'react-icons/fi'

type Bodega = {
  id: number
  nombre: string
  direccion: string
}

type BodegaModalProps = {
  open: boolean
  modo: 'crear' | 'editar'
  initialData?: Bodega
  onClose: () => void
  onSubmit: (data: Partial<Bodega>, id?: number) => Promise<void>
}

const BodegaModal: React.FC<BodegaModalProps> = ({
  open,
  modo,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Bodega>>({
    nombre: '',
    direccion: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        direccion: initialData.direccion,
      })
    } else {
      setFormData({ nombre: '', direccion: '' })
    }
    setError('')
  }, [initialData, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('') // Limpiar error al escribir
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre?.trim() || !formData.direccion?.trim()) {
      setError('Todos los campos son obligatorios')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      await onSubmit(formData, initialData?.id)
    } catch (err: any) {
      setError(err.message || 'Error al guardar la bodega')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ nombre: '', direccion: '' })
    setError('')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
        {/* Header con gradiente verde */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <FiArchive className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-bold">
                {modo === 'crear' ? 'Nueva Bodega' : 'Editar Bodega'}
              </h2>
            </div>
            <button
              onClick={handleCancel}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
              aria-label="Cerrar modal"
              disabled={loading}
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
                <FiArchive className="w-4 h-4 mr-2 text-green-600" />
                Nombre de la Bodega
              </div>
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              placeholder="Ej: Bodega Principal, Almacén Norte..."
              required
              disabled={loading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-green-500 focus:border-green-500 
                       transition-all duration-200 text-gray-900 placeholder-gray-500
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
              maxLength={50}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo 50 caracteres ({formData.nombre?.length || 0}/50)
            </p>
          </div>

          {/* Campo dirección */}
          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <FiMapPin className="w-4 h-4 mr-2 text-green-600" />
                Dirección
              </div>
            </label>
            <input
              id="direccion"
              type="text"
              name="direccion"
              value={formData.direccion || ''}
              onChange={handleChange}
              placeholder="Ej: Calle 123 #45-67, Bogotá"
              required
              disabled={loading}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-green-500 focus:border-green-500 
                       transition-all duration-200 text-gray-900 placeholder-gray-500
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo 100 caracteres ({formData.direccion?.length || 0}/100)
            </p>
          </div>

          {/* Información adicional para edición */}
          {modo === 'editar' && initialData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">Información Actual</h3>
              <div className="text-sm text-green-700">
                <p><span className="font-medium">ID:</span> {initialData.id}</p>
                <p><span className="font-medium">Creada en:</span> Sistema SC</p>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading || !formData.nombre?.trim() || !formData.direccion?.trim()}
              className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                loading || !formData.nombre?.trim() || !formData.direccion?.trim()
                  ? 'bg-gray-400 text-white cursor-not-allowed transform-none shadow-none'
                  : 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5 mr-2" />
                  {modo === 'crear' ? 'Crear Bodega' : 'Actualizar Bodega'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BodegaModal