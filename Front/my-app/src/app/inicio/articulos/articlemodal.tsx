'use client'

import { useState } from 'react'
import { FiX, FiSave, FiImage, FiTrash2, FiPackage, FiDollarSign, FiFileText, FiTag, FiAlertCircle, FiUpload } from 'react-icons/fi'
import api from '@/app/lib/api'
import CategoriaSelector from './CategoriaSelector'
import MarcaSelector from './MarcaSelector'
import type { Articulo, CrearArticuloDto, ActualizarArticuloDto } from './articledto'

interface Props {
  modo: 'crear' | 'editar'
  articulo?: Articulo
  onClose: () => void
  onSuccess: () => void
}

export default function ArticleModal({ modo, articulo, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    nombre: articulo?.nombre || '',
    descripcion: articulo?.descripcion || '',
    precio: articulo?.precio || 0,
    categoriaId: articulo?.categoriaId || null,
    marcaId: articulo?.marcaId || null,
    variantes: articulo?.articuloValores?.map(av => ({
      tipoVarianteId: av.valor?.tipoVarianteId || 0,
      valor: av.valor?.nombre || ''
    })) || [],
    precios: articulo?.precios?.map(p => ({
      tipoPrecioId: p.tipoPrecioId,
      valor: p.valor
    })) || []
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fotos, setFotos] = useState<any[]>(articulo?.fotos || [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nombre.trim() || formData.precio <= 0) {
      setError('Nombre y precio válido son requeridos')
      return
    }

    try {
      setLoading(true)
      setError(null)

      let articuloCreado;

      if (modo === 'crear') {
        const createData: CrearArticuloDto = {
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim() || undefined,
          precio: formData.precio,
          categoriaId: formData.categoriaId,
          marcaId: formData.marcaId
        }
        
        const response = await api.post('/articulos', createData)
        articuloCreado = response.data
        
        if (selectedFiles.length > 0) {
          await subirFotos(articuloCreado.id)
        }
        
      } else {
        const updateData: ActualizarArticuloDto = {
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim() || undefined,
          precio: formData.precio,
          categoriaId: formData.categoriaId,
          marcaId: formData.marcaId
        }
        
        await api.put(`/articulos/${articulo!.id}`, updateData)
        
        if (selectedFiles.length > 0) {
          await subirFotos(articulo!.id)
        }
      }

      onSuccess()
    } catch (error: any) {
      console.error('Error al guardar artículo:', error)
      setError(error.response?.data?.error || 'Error al guardar el artículo')
    } finally {
      setLoading(false)
    }
  }

  const subirFotos = async (articuloId: number) => {
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const formDataPhoto = new FormData()
      formDataPhoto.append('imagen', file)
      formDataPhoto.append('orden', (i + 1).toString())
      
      try {
        await api.post(`/articulos/fotos/${articuloId}`, formDataPhoto, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } catch (error) {
        console.error('Error al subir foto:', error)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  const removerArchivo = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const eliminarFoto = async (fotoId: number) => {
    try {
      await api.delete(`/articulos/fotos/${fotoId}`)
      setFotos(prev => prev.filter(foto => foto.id !== fotoId))
    } catch (error) {
      console.error('Error al eliminar foto:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCategoriaChange = (categoriaId: number | null) => {
    handleInputChange('categoriaId', categoriaId)
  }

  const handleMarcaChange = (marcaId: number | null) => {
    handleInputChange('marcaId', marcaId)
  }

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-white">
              <FiPackage className="w-6 h-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">
                  {modo === 'crear' ? 'Crear Nuevo Artículo' : 'Editar Artículo'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {modo === 'crear' 
                    ? 'Agrega un nuevo producto a tu catálogo' 
                    : `Modificando: ${articulo?.nombre || 'Artículo'}`
                  }
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseClick}
              className="text-white hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/10"
              disabled={loading}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-red-800">Error al procesar</h4>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Grid principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna izquierda - Información básica */}
              <div className="space-y-6">
                {/* Información del producto */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center mb-4">
                    <FiFileText className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-900">Información del Producto</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del artículo *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Ej: Camiseta Nike Dri-FIT"
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* Descripción */}
                    <div>
                      <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        id="descripcion"
                        rows={4}
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Describe las características principales del artículo..."
                        disabled={loading}
                      />
                    </div>

                    {/* Precio */}
                    <div>
                      <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                        Precio *
                      </label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                          type="number"
                          id="precio"
                          min="0"
                          step="0.01"
                          value={formData.precio}
                          onChange={(e) => handleInputChange('precio', parseFloat(e.target.value) || 0)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="0.00"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clasificación */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center mb-4">
                    <FiTag className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-900">Clasificación</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría
                      </label>
                      <CategoriaSelector
                        value={formData.categoriaId}
                        onChange={handleCategoriaChange}
                        disabled={loading}
                      />
                    </div>

                    {/* Marca */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marca
                      </label>
                      <MarcaSelector
                        value={formData.marcaId}
                        onChange={handleMarcaChange}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Información de clasificación seleccionada */}
                  {(formData.categoriaId || formData.marcaId) && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800 mb-2">Clasificación seleccionada:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.categoriaId && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                            📂 Categoría ID: {formData.categoriaId}
                          </span>
                        )}
                        {formData.marcaId && (
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                            🏷️ Marca ID: {formData.marcaId}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna derecha - Gestión de fotos */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                  <div className="flex items-center mb-4">
                    <FiImage className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-purple-900">Gestión de Fotos</h3>
                  </div>

                  {/* Fotos existentes */}
                  {modo === 'editar' && fotos.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-3">Fotos actuales:</p>
                      <div className="grid grid-cols-3 gap-3">
                        {fotos.map((foto) => (
                          <div key={foto.id} className="relative group">
                            <img 
                              src={foto.url} 
                              alt="Foto del artículo"
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-purple-300 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => eliminarFoto(foto.id)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 hover:scale-100 shadow-lg"
                              disabled={loading}
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selector de archivos */}
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="fotos-input"
                      disabled={loading}
                    />
                    <label
                      htmlFor="fotos-input"
                      className="cursor-pointer flex flex-col items-center space-y-3 text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiUpload className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Seleccionar fotos</p>
                        <p className="text-sm text-gray-500">PNG, JPG hasta 10MB cada una</p>
                      </div>
                    </label>
                  </div>

                  {/* Preview de archivos seleccionados */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        Nuevas fotos ({selectedFiles.length}):
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-300 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => removerArchivo(index)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 hover:scale-100 shadow-lg"
                              disabled={loading}
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {file.name.length > 8 ? file.name.substring(0, 8) + '...' : file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Información adicional en modo editar */}
                {modo === 'editar' && articulo && (
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
                    <h3 className="font-semibold text-amber-900 mb-4">Información del Sistema</h3>
                    
                    {/* Código */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código del Sistema
                      </label>
                      <div className="flex items-center bg-white rounded-lg border border-amber-200 px-4 py-3">
                        <span className="text-gray-900 font-mono">{articulo.codigo}</span>
                        <span className="ml-auto text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                          Solo lectura
                        </span>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
                        <div className="text-lg font-bold text-amber-600">
                          {formData.variantes.length}
                        </div>
                        <div className="text-xs text-gray-600">Variantes</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
                        <div className="text-lg font-bold text-amber-600">
                          {articulo.fotos?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600">Fotos</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información adicional expandible */}
            {(formData.variantes.length > 0 || formData.precios.length > 0) && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Configuración Avanzada</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Variantes */}
                  {formData.variantes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Variantes actuales
                      </label>
                      <div className="space-y-2">
                        {formData.variantes.map((variante, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                            <span className="text-sm">
                              <span className="font-medium">Tipo {variante.tipoVarianteId}:</span>{' '}
                              {variante.valor}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Precios adicionales */}
                  {formData.precios.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Precios adicionales
                      </label>
                      <div className="space-y-2">
                        {formData.precios.map((precio, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                            <span className="text-sm">Tipo {precio.tipoPrecioId}</span>
                            <span className="font-medium text-green-600">
                              ${precio.valor.toLocaleString('es-CO')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseClick}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    {modo === 'crear' ? 'Creando...' : 'Guardando...'}
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 mr-2" />
                    {modo === 'crear' ? 'Crear Artículo' : 'Guardar Cambios'}
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