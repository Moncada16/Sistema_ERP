'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'
import ArticleModal from './articlemodal'
import EliminarArticulo from '@/components/EliminarArticulo'
import type { Articulo } from './articledto'

export default function ArticulosPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [editando, setEditando] = useState<Articulo | null>(null)
  const [eliminando, setEliminando] = useState<Articulo | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalFotos, setModalFotos] = useState<{ articulo: Articulo; fotos: any[] } | null>(null)

  const cargarArticulos = async () => {
    try {
      setLoading(true)
      setError(null)
      // ✅ CORREGIDO: Verificar que la URL sea correcta
      console.log('🔥 Intentando cargar desde:', '/articulos')
      const response = await api.get('/articulos')
      setArticulos(response.data)
    } catch (error: any) {
      console.error('Error al cargar artículos:', error)
      setError(error.response?.data?.error || 'Error al cargar los artículos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarArticulos()
  }, [])

  const abrirModalCrear = () => {
    console.log('🔥 abrirModalCrear llamado') // Debug
    setEditando(null)
    setMostrarModal(true)
  }

  const abrirModalEditar = (articulo: Articulo) => {
    console.log('🔥 abrirModalEditar llamado', articulo) // Debug
    setEditando(articulo)
    setMostrarModal(true)
  }

  const cerrarModal = () => {
    console.log('🔥 cerrarModal llamado') // Debug
    setMostrarModal(false)
    setEditando(null)
  }

  const alGuardar = () => {
    console.log('🔥 alGuardar llamado') // Debug
    cargarArticulos()
    cerrarModal()
  }

  const handleEliminarClick = (articulo: Articulo) => {
    setEliminando(articulo)
  }

  const handleEliminarClose = () => {
    setEliminando(null)
  }

  const handleEliminarSuccess = () => {
    cargarArticulos()
    handleEliminarClose()
  }

  const handleCrearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('🔥 handleCrearClick - evento:', e) // Debug
    e.preventDefault()
    e.stopPropagation()
    abrirModalCrear()
  }

  const abrirModalFotos = async (articulo: Articulo) => {
    try {
      // Cargar fotos del artículo
      const response = await api.get(`/articulos/fotos/${articulo.id}`)
      setModalFotos({ articulo, fotos: response.data })
    } catch (error) {
      console.error('Error al cargar fotos:', error)
    }
  }

  const cerrarModalFotos = () => {
    setModalFotos(null)
  }

  const cambiarFotoPrincipal = async (articuloId: number, nuevaFotoUrl: string) => {
    try {
      console.log('🔥 Cambiando foto principal:', { articuloId, nuevaFotoUrl })
      
      await api.put(`/articulos/${articuloId}`, {
        fotoPrincipal: nuevaFotoUrl
      })
      
      console.log('✅ Foto principal cambiada exitosamente')
      
      // Actualizar la lista de artículos
      await cargarArticulos()
      cerrarModalFotos()
    } catch (error) {
      console.error('❌ Error al cambiar foto principal:', error)
      // Mostrar error al usuario
      setError('Error al cambiar la foto principal')
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">📦 Artículos</h1>
        <button
          type="button"
          onClick={handleCrearClick}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          ➕ Crear Artículo
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-2">Cargando artículos...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="font-medium text-red-800">Error al cargar artículos</h3>
          <p className="text-sm mt-1 text-red-600">{error}</p>
          <button
            onClick={cargarArticulos}
            className="mt-3 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      ) : articulos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-lg">No hay artículos registrados</p>
          <button
            type="button"
            onClick={handleCrearClick}
            className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Crear tu primer artículo
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {articulos.map((articulo) => (
            <div key={articulo.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                {/* Foto Principal */}
                <div className="flex-shrink-0">
                  <div 
                    className="relative group cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('🔥 Click en foto, cargando fotos para artículo:', articulo.id)
                      abrirModalFotos(articulo)
                    }}
                    title="Click para cambiar foto principal"
                  >
                    {articulo.fotoPrincipal ? (
                      <img 
                        src={articulo.fotoPrincipal} 
                        alt={articulo.nombre}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 group-hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          console.log('❌ Error cargando foto principal, intentando fallback')
                          // Si falla la foto principal, mostrar la primera foto del array
                          if (articulo.fotos && articulo.fotos.length > 0) {
                            e.currentTarget.src = articulo.fotos[0].url
                          } else {
                            // Si no hay fotos, mostrar placeholder
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAzMkwyOCA0MEwyOCA0OEwzNiA0MEw0NCA0OEw0NCA0MEw0NCAzMkwzNiA0MEwyOCAzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                          }
                        }}
                        onLoad={() => console.log('✅ Foto principal cargada exitosamente')}
                      />
                    ) : articulo.fotos && articulo.fotos.length > 0 ? (
                      <img 
                        src={articulo.fotos[0].url} 
                        alt={articulo.nombre}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 group-hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          console.log('❌ Error cargando primera foto, usando placeholder')
                          // Si falla, mostrar placeholder
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAzMkwyOCA0MEwyOCA0OEwzNiA0MEw0NCA0OEw0NCA0MEw0NCAzMkwzNiA0MEwyOCAzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                        }}
                        onLoad={() => console.log('✅ Primera foto cargada exitosamente')}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <span className="text-gray-400 text-2xl">📦</span>
                      </div>
                    )}
                    
                    {/* Overlay al hacer hover */}
                    <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        📷 Cambiar
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información del Artículo */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{articulo.nombre}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{articulo.codigo}</span>
                  </div>

                  {articulo.descripcion && (
                    <p className="text-sm text-gray-600 mb-2">{articulo.descripcion}</p>
                  )}

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-green-600">
                      ${articulo.precio.toLocaleString('es-CO')}
                    </span>
                    <span className="text-xs text-gray-500">
                      Creado: {new Date(articulo.createdAt).toLocaleDateString('es-CO')}
                    </span>
                    {articulo.fotos && articulo.fotos.length > 0 && (
                      <span className="text-xs text-blue-600">
                        📷 {articulo.fotos.length} foto{articulo.fotos.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {Array.isArray(articulo.articuloValores) && articulo.articuloValores.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {articulo.articuloValores.map((articuloValor, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {articuloValor.valor?.tipoVariante?.nombre}: {articuloValor.valor?.nombre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      abrirModalEditar(articulo)
                    }}
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleEliminarClick(articulo)
                    }}
                    className="text-red-600 hover:text-red-800 hover:underline text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarModal && (
        <ArticleModal
          modo={editando ? 'editar' : 'crear'}
          articulo={editando || undefined}
          onClose={cerrarModal}
          onSuccess={alGuardar}
        />
      )}

      {eliminando && (
        <EliminarArticulo
          articulo={eliminando}
          onClose={handleEliminarClose}
          onDeleted={handleEliminarSuccess}
        />
      )}

      {/* Modal para seleccionar foto principal */}
      {modalFotos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                📷 Seleccionar Foto Principal - {modalFotos.articulo.nombre}
              </h2>
              <button
                onClick={cerrarModalFotos}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {modalFotos.fotos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📷</div>
                  <p className="text-gray-600">Este artículo no tiene fotos</p>
                  <button
                    onClick={() => {
                      cerrarModalFotos()
                      abrirModalEditar(modalFotos.articulo)
                    }}
                    className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    Agregar fotos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {modalFotos.fotos.map((foto) => (
                    <div key={foto.id} className="relative group">
                      {/* IMAGEN PRINCIPAL CON ONCLICK */}
                      <div
                        className="w-full h-32 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('🔥 SELECCIONANDO FOTO PRINCIPAL:', foto.url)
                          console.log('🔥 Artículo ID:', modalFotos.articulo.id)
                          cambiarFotoPrincipal(modalFotos.articulo.id, foto.url)
                        }}
                      >
                        <img 
                          src={foto.url} 
                          alt="Foto del artículo"
                          className="w-full h-full object-cover rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                          onError={(e) => {
                            console.log('❌ Error cargando foto en modal:', foto.url)
                            e.currentTarget.style.display = 'none'
                          }}
                          onLoad={() => console.log('✅ Foto cargada en modal:', foto.url)}
                        />
                        
                        {/* Overlay al hacer hover */}
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                          <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            📷 Seleccionar como principal
                          </span>
                        </div>
                      </div>
                      
                      {/* Indicador si es la foto principal actual */}
                      {modalFotos.articulo.fotoPrincipal === foto.url && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded z-10">
                          ⭐ Principal
                        </div>
                      )}

                      {/* Debug info */}
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded z-10">
                        ID: {foto.id}
                      </div>

                      {/* BOTÓN EXPLÍCITO DE SELECCIÓN */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('🔥 BOTÓN SELECCIONAR CLICKEADO:', foto.url)
                          cambiarFotoPrincipal(modalFotos.articulo.id, foto.url)
                        }}
                        className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors z-10"
                      >
                        Seleccionar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Debug del modal */}
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <p><strong>Debug Modal:</strong></p>
                <p>Artículo ID: {modalFotos.articulo.id}</p>
                <p>Foto principal actual: {modalFotos.articulo.fotoPrincipal || 'No definida'}</p>
                <p>Total fotos: {modalFotos.fotos.length}</p>
                <p>URLs de fotos: {modalFotos.fotos.map(f => f.url).join(', ')}</p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={cerrarModalFotos}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    cerrarModalFotos()
                    abrirModalEditar(modalFotos.articulo)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Gestionar fotos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}