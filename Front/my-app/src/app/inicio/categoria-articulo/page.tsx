'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import api from '@/app/lib/api'
import CategoriaModal from './CategoriaModal'
import Link from 'next/link'
import { 
  FiTag, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiPackage, 
  FiGrid,
  FiTrendingUp,
  FiAlertCircle,
  FiEye,
  FiZap
} from 'react-icons/fi'

interface CategoriaArticulo {
  id: number
  nombre: string
  descripcion?: string
  icono?: string
  empresaId: number
  createdAt: string
  updatedAt: string
  _count?: {
    articulos: number
  }
}

export default function CategoriaArticuloPage() {
  const { user, isLoading } = useAuth()
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modo, setModo] = useState<'crear' | 'editar'>('crear')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaArticulo | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creandoDefecto, setCreandoDefecto] = useState(false)

  const obtenerCategorias = async () => {
    try {
      setError('')
      const res = await api.get('/categoria-articulo')
      console.log('Categorías obtenidas:', res.data)
      setCategorias(res.data)
    } catch (err: any) {
      console.error('Error al cargar categorías:', err)
      const errorMessage = err.response?.data?.error || 'Error al cargar las categorías'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const crearCategoriasDefecto = async () => {
    if (!confirm('¿Crear las 20 categorías predeterminadas? Solo se puede hacer si no tienes categorías existentes.')) {
      return
    }

    setCreandoDefecto(true)
    setError('')

    try {
      const res = await api.post('/categoria-articulo/crear-defecto')
      console.log('Categorías por defecto creadas:', res.data)
      
      obtenerCategorias()
      
      alert(`✅ ${res.data.categorias?.length || 20} categorías creadas exitosamente`)
    } catch (err: any) {
      console.error('Error al crear categorías por defecto:', err)
      const errorMessage = err.response?.data?.error || 'Error al crear categorías por defecto'
      setError(errorMessage)
    } finally {
      setCreandoDefecto(false)
    }
  }

  const handleCrear = () => {
    setModo('crear')
    setCategoriaSeleccionada(null)
    setModalAbierto(true)
  }

  const handleEditar = (categoria: CategoriaArticulo) => {
    setModo('editar')
    setCategoriaSeleccionada(categoria)
    setModalAbierto(true)
  }

  const handleEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${nombre}"?`)) return

    try {
      await api.delete(`/categoria-articulo/${id}`)
      obtenerCategorias()
      setError('')
    } catch (err: any) {
      console.error('Error al eliminar:', err)
      const errorMessage = err.response?.data?.error || 'Error al eliminar categoría'
      setError(errorMessage)
    }
  }

  const handleGuardar = async (data: Partial<CategoriaArticulo>, id?: number) => {
    try {
      if (modo === 'crear') {
        await api.post('/categoria-articulo', data)
      } else if (id) {
        await api.put(`/categoria-articulo/${id}`, data)
      }
      setModalAbierto(false)
      obtenerCategorias()
      setError('')
    } catch (err: any) {
      console.error('Error al guardar:', err)
      const errorMessage = err.response?.data?.error || 'Error al guardar categoría'
      setError(errorMessage)
    }
  }

  useEffect(() => {
    if (user?.empresaId) {
      obtenerCategorias()
    }
  }, [user])

  if (isLoading) {
    return (
      <main className="p-6 text-center text-gray-600 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="p-6 text-center text-red-600 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto mt-20 bg-white rounded-lg shadow-lg p-8">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Acceso Denegado</h2>
          <p>Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </main>
    )
  }

  if (!user.empresaId) {
    return (
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto mt-20 bg-white rounded-xl shadow-lg p-8 text-center">
          <FiAlertCircle className="w-20 h-20 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Empresa Requerida</h2>
          <p className="text-gray-600 mb-6">
            Debes tener una empresa registrada para gestionar categorías de artículos.
          </p>
          <Link 
            href="/inicio/empresa"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Crear Empresa
          </Link>
        </div>
      </main>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <FiTag className="mr-3" />
                Categorías de Artículos
              </h1>
              <p className="mt-2 text-green-100">
                Organiza tus productos por categorías para una mejor gestión
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-green-100 text-sm">Total Categorías</p>
                <p className="text-white font-bold text-2xl">{categorias.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        {categorias.length === 0 && (
          <button
            onClick={crearCategoriasDefecto}
            disabled={creandoDefecto}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            {creandoDefecto ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Creando...
              </>
            ) : (
              <>
                <FiZap className="w-5 h-5 mr-2" />
                Crear 20 Categorías Predeterminadas
              </>
            )}
          </button>
        )}
        
        <button
          onClick={handleCrear}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Nueva Categoría
        </button>

        <Link
          href="/inicio/resumen-categorias"
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FiEye className="w-5 h-5 mr-2" />
          Ver Resumen
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <FiAlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando categorías...</p>
          </div>
        </div>
      ) : categorias.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiTag className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              No tienes categorías registradas
            </h3>
            <p className="text-gray-600 mb-8">
              Crea categorías para organizar mejor tus artículos. Puedes empezar con las categorías predeterminadas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={crearCategoriasDefecto}
                disabled={creandoDefecto}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                {creandoDefecto ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <FiZap className="w-5 h-5 mr-2" />
                    Crear Categorías Predeterminadas
                  </>
                )}
              </button>
              
              <button
                onClick={handleCrear}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Crear Categoría Personalizada
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{categoria.icono || '🏷️'}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 truncate text-lg">{categoria.nombre}</h3>
                    {categoria.descripcion && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{categoria.descripcion}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-green-600">
                  <FiPackage className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    {categoria._count?.articulos || 0} productos
                  </span>
                </div>
                <div className="flex items-center text-gray-400">
                  <FiTrendingUp className="w-4 h-4" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditar(categoria)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <FiEdit2 className="w-4 h-4 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(categoria.id, categoria.nombre)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <FiTrash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {categorias.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {categorias.length}
              </div>
              <div className="text-gray-600">Total de Categorías</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {categorias.reduce((sum, cat) => sum + (cat._count?.articulos || 0), 0)}
              </div>
              <div className="text-gray-600">Productos Categorizados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((categorias.filter(cat => (cat._count?.articulos || 0) > 0).length / categorias.length) * 100)}%
              </div>
              <div className="text-gray-600">Categorías Utilizadas</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <CategoriaModal
          open={modalAbierto}
          modo={modo}
          initialData={categoriaSeleccionada ?? undefined}
          onClose={() => setModalAbierto(false)}
          onSubmit={handleGuardar}
        />
      )}
    </div>
  )
}