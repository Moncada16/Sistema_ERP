'use client'

import { useEffect, useState } from 'react'
import { FiBox, FiPlus, FiEdit2, FiTrash2, FiCamera, FiImage, FiAlertCircle, FiRefreshCw, FiTrendingUp, FiGrid } from 'react-icons/fi'
import api from '@/app/lib/api'
import ArticleModal from './articlemodal'
import EliminarArticulo from '@/app/inicio/articulos/EliminarArticulo'
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
    console.log('🔥 abrirModalCrear llamado')
    setEditando(null)
    setMostrarModal(true)
  }

  const abrirModalEditar = (articulo: Articulo) => {
    console.log('🔥 abrirModalEditar llamado', articulo)
    setEditando(articulo)
    setMostrarModal(true)
  }

  const cerrarModal = () => {
    console.log('🔥 cerrarModal llamado')
    setMostrarModal(false)
    setEditando(null)
  }

  const alGuardar = () => {
    console.log('🔥 alGuardar llamado')
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
    console.log('🔥 handleCrearClick - evento:', e)
    e.preventDefault()
    e.stopPropagation()
    abrirModalCrear()
  }

  const abrirModalFotos = async (articulo: Articulo) => {
    try {
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
      
      await cargarArticulos()
      cerrarModalFotos()
    } catch (error) {
      console.error('❌ Error al cambiar foto principal:', error)
      setError('Error al cambiar la foto principal')
    }
  }

  // Calcular estadísticas
  const totalArticulos = articulos.length
  const valorTotalInventario = articulos.reduce((sum, art) => sum + art.precio, 0)
  const articulosConFotos = articulos.filter(art => 
    art.fotoPrincipal || (art.fotos && art.fotos.length > 0)
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con gradiente y estadísticas */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBox className="w-10 h-10 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Gestión de Artículos</h1>
                <p className="mt-2 text-blue-100">
                  Administra tu catálogo completo de productos y servicios
                </p>
              </div>
            </div>
            
            {totalArticulos > 0 && (
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalArticulos}</div>
                  <div className="text-blue-200 text-sm">Total Artículos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    ${valorTotalInventario.toLocaleString('es-CO')}
                  </div>
                  <div className="text-blue-200 text-sm">Valor Inventario</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{articulosConFotos}</div>
                  <div className="text-blue-200 text-sm">Con Fotos</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            type="button"
            onClick={handleCrearClick}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Crear Artículo
          </button>
          
          <button
            onClick={cargarArticulos}
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FiRefreshCw className="w-5 h-5 mr-2" />
            Actualizar
          </button>
        </div>

        {/* Estados de carga y error */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-blue-600 font-medium">Cargando artículos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <FiAlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="font-semibold text-red-800">Error al cargar artículos</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={cargarArticulos}
              className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </button>
          </div>
        ) : articulos.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <FiBox className="w-24 h-24 text-blue-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Comienza tu catálogo!
              </h2>
              <p className="text-gray-600 mb-8">
                No tienes artículos registrados. Crea tu primer producto para comenzar.
              </p>
              <button
                type="button"
                onClick={handleCrearClick}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Crear primer artículo
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grid de artículos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {articulos.map((articulo) => (
                <div 
                  key={articulo.id} 
                  className="bg-white border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105"
                >
                  {/* Imagen del producto */}
                  <div className="relative mb-4">
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
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                          onError={(e) => {
                            console.log('❌ Error cargando foto principal, intentando fallback')
                            if (articulo.fotos && articulo.fotos.length > 0) {
                              e.currentTarget.src = articulo.fotos[0].url
                            } else {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDIwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA4MEw4MCA5Nkw4MCAxMTJMOTYgOTZMMTEyIDExMkwxMTIgOTZMMTEyIDgwTDk2IDk2TDgwIDgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4='
                            }
                          }}
                          onLoad={() => console.log('✅ Foto principal cargada exitosamente')}
                        />
                      ) : articulo.fotos && articulo.fotos.length > 0 ? (
                        <img 
                          src={articulo.fotos[0].url} 
                          alt={articulo.nombre}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                          onError={(e) => {
                            console.log('❌ Error cargando primera foto, usando placeholder')
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDIwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA4MEw4MCA5Nkw4MCAxMTJMOTYgOTZMMTEyIDExMkwxMTIgOTZMMTEyIDgwTDk2IDk2TDgwIDgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4='
                          }}
                          onLoad={() => console.log('✅ Primera foto cargada exitosamente')}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border border-blue-200 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                          <FiBox className="w-16 h-16 text-blue-400" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg px-3 py-2 flex items-center">
                          <FiCamera className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-blue-600 text-sm font-medium">Cambiar foto</span>
                        </div>
                      </div>
                    </div>

                    {/* Indicador de fotos */}
                    {articulo.fotos && articulo.fotos.length > 0 && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <FiImage className="w-3 h-3 mr-1" />
                        {articulo.fotos.length}
                      </div>
                    )}
                  </div>

                  {/* Información del artículo */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {articulo.nombre}
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {articulo.codigo}
                        </span>
                      </div>
                      
                      {articulo.descripcion && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {articulo.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        ${articulo.precio.toLocaleString('es-CO')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(articulo.createdAt).toLocaleDateString('es-CO')}
                      </span>
                    </div>

                    {/* Variantes */}
                    {Array.isArray(articulo.articuloValores) && articulo.articuloValores.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {articulo.articuloValores.slice(0, 2).map((articuloValor, index) => (
                          <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                            {articuloValor.valor?.tipoVariante?.nombre}: {articuloValor.valor?.nombre}
                          </span>
                        ))}
                        {articulo.articuloValores.length > 2 && (
                          <span className="text-xs text-blue-600">
                            +{articulo.articuloValores.length - 2} más
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        abrirModalEditar(articulo)
                      }}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4 mr-2" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleEliminarClick(articulo)
                      }}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con estadísticas */}
            {totalArticulos > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiTrendingUp className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Resumen del Catálogo</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{totalArticulos}</div>
                      <div className="text-gray-600 text-sm">Total Artículos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${valorTotalInventario.toLocaleString('es-CO')}
                      </div>
                      <div className="text-gray-600 text-sm">Valor Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round((articulosConFotos / totalArticulos) * 100)}%
                      </div>
                      <div className="text-gray-600 text-sm">Con Fotos</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modales */}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center  p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center text-white">
                  <FiCamera className="w-6 h-6 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold">Gestionar Fotos</h2>
                    <p className="text-blue-100 text-sm">{modalFotos.articulo.nombre}</p>
                  </div>
                </div>
                <button
                  onClick={cerrarModalFotos}
                  className="text-white hover:text-blue-200 text-2xl transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {modalFotos.fotos.length === 0 ? (
                  <div className="text-center py-12">
                    <FiImage className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Sin fotos disponibles
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Este artículo no tiene fotos. Agrega algunas para mejorar su presentación.
                    </p>
                    <button
                      onClick={() => {
                        cerrarModalFotos()
                        abrirModalEditar(modalFotos.articulo)
                      }}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="w-5 h-5 mr-2" />
                      Agregar fotos
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {modalFotos.fotos.map((foto) => (
                      <div key={foto.id} className="relative group">
                        <div
                          className="w-full h-32 cursor-pointer relative overflow-hidden rounded-lg"
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
                            className="w-full h-full object-cover border border-gray-200 hover:border-blue-500 transition-all duration-200 group-hover:scale-105"
                            onError={(e) => {
                              console.log('❌ Error cargando foto en modal:', foto.url)
                              e.currentTarget.style.display = 'none'
                            }}
                            onLoad={() => console.log('✅ Foto cargada en modal:', foto.url)}
                          />
                          
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg px-3 py-2 flex items-center">
                              <FiCamera className="w-4 h-4 text-blue-600 mr-2" />
                              <span className="text-blue-600 text-sm font-medium">Seleccionar</span>
                            </div>
                          </div>
                        </div>
                        
                        {modalFotos.articulo.fotoPrincipal === foto.url && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center z-10">
                            ⭐ Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={cerrarModalFotos}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      cerrarModalFotos()
                      abrirModalEditar(modalFotos.articulo)
                    }}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Gestionar fotos
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}