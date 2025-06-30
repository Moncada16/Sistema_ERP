'use client'

import { useEffect, useState } from 'react'

interface CategoriaArticulo {
  id?: number
  nombre: string
  descripcion?: string
  icono?: string
}

type Props = {
  open: boolean
  modo: 'crear' | 'editar'
  initialData?: CategoriaArticulo
  onClose: () => void
  onSubmit: (data: Partial<CategoriaArticulo>, id?: number) => void
}

const iconosDisponibles = [
  '👕', '👟', '🧢', '👜', '💍', '📱', '🏠', '⚽', '💄', '📚',
  '🧸', '🚗', '🐕', '🔧', '🌱', '🍳', '🥤', '🍕', '📋', '🎨',
  '⌚', '👓', '🎵', '🏆', '🎮', '💊', '🧴', '🛏️', '🚲', '📷'
]

const defaultForm: CategoriaArticulo = {
  nombre: '',
  descripcion: '',
  icono: '🏷️'
}

export default function CategoriaModal({ open, modo, initialData, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CategoriaArticulo>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        icono: initialData.icono || '🏷️'
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
  }, [initialData, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleIconoChange = (icono: string) => {
    setForm(prev => ({ ...prev, icono }))
    if (errors.icono) {
      setErrors(prev => ({ ...prev, icono: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (form.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (form.descripcion && form.descripcion.length > 200) {
      newErrors.descripcion = 'La descripción no puede exceder 200 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const dataToSubmit = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion?.trim() || undefined, // ← CAMBIADO: usar undefined en lugar de null
        icono: form.icono || '🏷️'
      }

      await onSubmit(dataToSubmit, initialData?.id)
      onClose()
    } catch (error) {
      console.error('Error en modal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {modo === 'crear' ? '➕ Nueva Categoría' : '✏️ Editar Categoría'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la categoría *
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Ropa, Calzado, Electrónicos..."
                className={`w-full px-3 py-2 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe qué tipo de productos incluye esta categoría..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black resize-none ${
                  errors.descripcion ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.descripcion && (
                <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {form.descripcion?.length || 0}/200 caracteres
              </p>
            </div>

            {/* Icono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icono
              </label>
              <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                {iconosDisponibles.map((icono) => (
                  <button
                    key={icono}
                    type="button"
                    onClick={() => handleIconoChange(icono)}
                    className={`w-8 h-8 flex items-center justify-center rounded border-2 transition-colors ${
                      form.icono === icono
                        ? 'border-black bg-gray-100'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    disabled={isSubmitting}
                  >
                    <span className="text-lg">{icono}</span>
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">Seleccionado:</span>
                <span className="text-2xl">{form.icono}</span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !form.nombre.trim()}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '⏳ Guardando...' : modo === 'crear' ? '💾 Crear' : '💾 Actualizar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}