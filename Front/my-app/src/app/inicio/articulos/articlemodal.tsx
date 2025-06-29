'use client'

import { useState } from 'react'
import api from '@/app/lib/api'
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
    // ✅ CORREGIDO: Usar articuloValores en lugar de valoresVariante
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
          precio: formData.precio
        }
        
        const response = await api.post('/articulos', createData)
        articuloCreado = response.data
        
        // ✅ SUBIR FOTOS SI HAY ARCHIVOS SELECCIONADOS
        if (selectedFiles.length > 0) {
          await subirFotos(articuloCreado.id)
        }
        
      } else {
        const updateData: ActualizarArticuloDto = {
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim() || undefined,
          precio: formData.precio
        }
        
        await api.put(`/articulos/${articulo!.id}`, updateData)
        
        // ✅ SUBIR FOTOS NUEVAS SI HAY
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

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {modo === 'crear' ? '➕ Crear nuevo artículo' : '✏️ Editar artículo'}
          </h2>
          <button
            type="button"
            onClick={handleCloseClick}
            className="text-gray-500 hover:text-black text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del artículo *
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Ej: Laptop Dell XPS 13"
              required
              disabled={loading}
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              rows={3}
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Descripción del artículo..."
              disabled={loading}
            />
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
              Precio *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="precio"
                min="0"
                step="0.01"
                value={formData.precio}
                onChange={(e) => handleInputChange('precio', parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Sección de Fotos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotos del artículo
            </label>
            
            {/* Fotos existentes (solo en modo editar) */}
            {modo === 'editar' && fotos.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Fotos actuales:</p>
                <div className="flex flex-wrap gap-2">
                  {fotos.map((foto) => (
                    <div key={foto.id} className="relative group">
                      <img 
                        src={foto.url} 
                        alt="Foto del artículo"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => eliminarFoto(foto.id)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de archivos */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                className="cursor-pointer flex flex-col items-center space-y-2 text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">📷</span>
                <span className="text-sm">Seleccionar fotos</span>
                <span className="text-xs">Máximo 5 fotos, JPG/PNG</span>
              </label>
            </div>

            {/* Preview de archivos seleccionados */}
            {selectedFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Fotos seleccionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removerArchivo(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={loading}
                      >
                        ×
                      </button>
                      <div className="text-xs text-gray-500 mt-1 truncate w-16">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Código (solo mostrar en modo editar) */}
          {modo === 'editar' && articulo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                value={articulo.codigo}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled
              />
            </div>
          )}

          {/* Variantes existentes (solo mostrar si existen) */}
          {formData.variantes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variantes actuales
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.variantes.map((variante, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    Tipo {variante.tipoVarianteId}: {variante.valor}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Las variantes se gestionan por separado
              </p>
            </div>
          )}

          {/* Precios adicionales (solo mostrar si existen) */}
          {formData.precios.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precios adicionales
              </label>
              <div className="space-y-1">
                {formData.precios.map((precio, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">Tipo {precio.tipoPrecioId}</span>
                    <span className="text-sm font-medium">${precio.valor.toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Los precios adicionales se gestionan por separado
              </p>
            </div>
          )}

          {/* Debug info (temporal) */}
          {modo === 'editar' && articulo && (
            <div className="bg-gray-100 p-3 rounded text-xs">
              <p><strong>Debug Modal:</strong></p>
              <p>Artículo ID: {articulo.id}</p>
              <p>Variantes: {articulo.articuloValores?.length || 0}</p>
              <p>Fotos: {articulo.fotos?.length || 0}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseClick}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading 
                ? (modo === 'crear' ? 'Creando...' : 'Guardando...') 
                : (modo === 'crear' ? 'Crear Artículo' : 'Guardar Cambios')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}