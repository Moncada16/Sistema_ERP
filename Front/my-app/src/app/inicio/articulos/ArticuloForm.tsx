'use client'

import { useState } from 'react'
import { 
  FiPackage, 
  FiSave, 
  FiX, 
  FiDollarSign, 
  FiFileText, 
  FiHash, 
  FiAlertCircle, 
  FiCheck,
  FiFolder,
  FiEdit3,
  FiCheckCircle,
  FiInfo
} from 'react-icons/fi'
import CategoriaSelector from './CategoriaSelector'
import api from '@/app/lib/api'

interface ArticuloFormData {
  nombre: string
  codigo: string
  descripcion: string
  precio: string
  categoriaId: number | null
}

interface Props {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export default function ArticuloForm({ initialData, onSubmit, onCancel, isSubmitting = false }: Props) {
  const [form, setForm] = useState<ArticuloFormData>({
    nombre: initialData?.nombre || '',
    codigo: initialData?.codigo || '',
    descripcion: initialData?.descripcion || '',
    precio: initialData?.precio?.toString() || '',
    categoriaId: initialData?.categoriaId || null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditMode = !!initialData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleCategoriaChange = (categoriaId: number | null) => {
    setForm(prev => ({ ...prev, categoriaId }))
    if (errors.categoriaId) {
      setErrors(prev => ({ ...prev, categoriaId: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!form.codigo.trim()) {
      newErrors.codigo = 'El código es requerido'
    }

    if (!form.precio || isNaN(parseFloat(form.precio)) || parseFloat(form.precio) <= 0) {
      newErrors.precio = 'El precio debe ser un número mayor a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const dataToSubmit = {
      nombre: form.nombre.trim(),
      codigo: form.codigo.trim(),
      descripcion: form.descripcion.trim() || null,
      precio: parseFloat(form.precio),
      categoriaId: form.categoriaId
    }

    await onSubmit(dataToSubmit)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Header con gradiente azul para artículos */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isEditMode ? (
                <FiEdit3 className="w-10 h-10 mr-4" />
              ) : (
                <FiPackage className="w-10 h-10 mr-4" />
              )}
              <div>
                <h2 className="text-3xl font-bold">
                  {isEditMode ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h2>
                <p className="text-blue-100 mt-2">
                  {isEditMode 
                    ? 'Modifica la información del producto en tu inventario' 
                    : 'Registra un nuevo producto en tu catálogo empresarial'
                  }
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-100 text-sm">Producto</p>
                <p className="text-white font-bold text-xl">
                  {isEditMode ? 'Actualizar' : 'Crear'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario con diseño premium */}
        <div className="bg-white rounded-b-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Información Básica */}
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiInfo className="w-5 h-5 mr-2 text-blue-600" />
                  Información Básica del Producto
                </h3>
                <p className="text-gray-600 text-sm mt-1">Datos esenciales para identificar tu artículo</p>
              </div>

              {/* Grid de campos principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FiFileText className="inline w-4 h-4 mr-2 text-blue-600" />
                    Nombre del artículo
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Camiseta Nike Dri-FIT, Zapatos Adidas Running..."
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                      errors.nombre 
                        ? 'border-red-300 bg-red-50' 
                        : form.nombre.trim() 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.nombre && (
                    <div className="flex items-center mt-2 text-red-600">
                      <FiAlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{errors.nombre}</span>
                    </div>
                  )}
                  {form.nombre.trim() && !errors.nombre && (
                    <div className="flex items-center mt-2 text-green-600">
                      <FiCheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Nombre válido y descriptivo</span>
                    </div>
                  )}
                </div>

                {/* Código */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FiHash className="inline w-4 h-4 mr-2 text-blue-600" />
                    Código del artículo
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={form.codigo}
                    onChange={handleChange}
                    placeholder="CAM-001, NIKE-DRI-001, ZAP-RUN-2024"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md font-mono ${
                      errors.codigo 
                        ? 'border-red-300 bg-red-50' 
                        : form.codigo.trim() 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.codigo && (
                    <div className="flex items-center mt-2 text-red-600">
                      <FiAlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{errors.codigo}</span>
                    </div>
                  )}
                  {form.codigo.trim() && !errors.codigo && (
                    <div className="flex items-center mt-2 text-green-600">
                      <FiCheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Código único asignado</span>
                    </div>
                  )}
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FiDollarSign className="inline w-4 h-4 mr-2 text-green-600" />
                    Precio de venta
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="number"
                      name="precio"
                      value={form.precio}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                        errors.precio 
                          ? 'border-red-300 bg-red-50' 
                          : form.precio && parseFloat(form.precio) > 0 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.precio && (
                    <div className="flex items-center mt-2 text-red-600">
                      <FiAlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{errors.precio}</span>
                    </div>
                  )}
                  {form.precio && parseFloat(form.precio) > 0 && !errors.precio && (
                    <div className="flex items-center mt-2 text-green-600">
                      <FiCheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        Precio: ${parseFloat(form.precio).toLocaleString('es-CO', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} COP
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Categorización */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="border-l-4 border-green-600 pl-4 mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiFolder className="w-5 h-5 mr-2 text-green-600" />
                  Categorización del Producto
                </h3>
                <p className="text-gray-600 text-sm mt-1">Organiza tu artículo por tipo para mejor gestión</p>
              </div>
              
              <CategoriaSelector
                value={form.categoriaId}
                onChange={handleCategoriaChange}
                disabled={isSubmitting}
              />
              
              <div className="flex items-center mt-3 text-sm text-gray-600">
                <FiCheckCircle className="w-4 h-4 mr-2 text-green-500" />
                {form.categoriaId 
                  ? `Categoría seleccionada (ID: ${form.categoriaId})`
                  : 'Selecciona una categoría para organizar mejor tus artículos'
                }
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiFileText className="w-5 h-5 mr-2 text-blue-600" />
                  Descripción Detallada
                </h3>
                <p className="text-gray-600 text-sm mt-1">Información adicional sobre el producto</p>
              </div>
              
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe las características principales del artículo: materiales, tallas disponibles, colores, cuidados especiales, garantía..."
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md resize-none"
                disabled={isSubmitting}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <FiInfo className="w-4 h-4 mr-1 text-blue-500" />
                  Información adicional que ayude a identificar y vender el producto
                </div>
                <span className="text-sm text-gray-400 font-medium">
                  {form.descripcion.length}/500 caracteres
                </span>
              </div>
            </div>

            {/* Vista previa del formulario */}
            {(form.nombre.trim() || form.precio) && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                  <FiPackage className="w-5 h-5 mr-2" />
                  Vista Previa del Artículo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.nombre.trim() && (
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <span className="text-sm text-gray-600 font-medium">Nombre:</span>
                      <p className="text-gray-900 font-semibold">{form.nombre}</p>
                    </div>
                  )}
                  {form.codigo.trim() && (
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <span className="text-sm text-gray-600 font-medium">Código:</span>
                      <p className="text-gray-900 font-mono font-semibold">{form.codigo}</p>
                    </div>
                  )}
                  {form.precio && parseFloat(form.precio) > 0 && (
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <span className="text-sm text-gray-600 font-medium">Precio:</span>
                      <p className="text-green-600 font-bold text-lg">
                        ${parseFloat(form.precio).toLocaleString('es-CO', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} COP
                      </p>
                    </div>
                  )}
                  {form.categoriaId && (
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <span className="text-sm text-gray-600 font-medium">Categoría:</span>
                      <p className="text-green-600 font-semibold">ID: {form.categoriaId}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <FiX className="w-5 h-5 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Guardando artículo...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 mr-2" />
                    {isEditMode ? 'Actualizar Artículo' : 'Crear Artículo'}
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