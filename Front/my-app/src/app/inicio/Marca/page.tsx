'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import api from '@/app/lib/api'
import MarcaModal from './MarcaModal'
import Link from 'next/link'
import { 
  FiAward, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiPackage, 
  FiTrendingUp,
  FiAlertCircle,
  FiEye,
  FiZap,
  FiStar,
  FiLoader,
  FiBarChart,
  FiShoppingBag,
  FiTag,
  FiLayers
} from 'react-icons/fi'

interface Marca {
  id: number
  nombre: string
  descripcion?: string
  logo?: string
  empresaId: number
  createdAt: string
  updatedAt: string
  _count?: {
    articulos: number
  }
}

export default function MarcaPage() {
  const { user, isLoading } = useAuth()
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modo, setModo] = useState<'crear' | 'editar'>('crear')
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<Marca | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creandoDefecto, setCreandoDefecto] = useState(false)

  // Agrupar marcas por categoría premium
  const marcasRopa = ['Zara', 'H&M', 'Pull & Bear', 'Bershka', 'Stradivarius', 'Massimo Dutti', 'Uniqlo', 'Forever 21']
  const marcasZapatos = ['Nike', 'Adidas', 'Converse', 'Vans', 'Puma', 'Reebok', 'Dr. Martens', 'Clarks']
  const marcasAccesorios = ['Ray-Ban', 'Oakley', 'Fossil', 'Casio', 'Michael Kors', 'Coach', 'Pandora', 'Swatch']

  const obtenerMarcas = async () => {
    try {
      setError('')
      const res = await api.get('/marcas')
      console.log('Marcas obtenidas:', res.data)
      setMarcas(res.data)
    } catch (err: any) {
      console.error('Error al cargar marcas:', err)
      const errorMessage = err.response?.data?.error || 'Error al cargar las marcas'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const crearMarcasDefecto = async () => {
    if (!confirm('¿Crear las marcas predeterminadas de ropa, zapatos y accesorios? Solo se puede hacer si no tienes marcas existentes.')) {
      return
    }

    setCreandoDefecto(true)
    setError('')

    try {
      const res = await api.post('/marcas/crear-defecto')
      console.log('Marcas por defecto creadas:', res.data)
      
      obtenerMarcas()
      
      alert(`✅ ${res.data.marcas?.length || 'Varias'} marcas creadas exitosamente`)
    } catch (err: any) {
      console.error('Error al crear marcas por defecto:', err)
      const errorMessage = err.response?.data?.error || 'Error al crear marcas por defecto'
      setError(errorMessage)
    } finally {
      setCreandoDefecto(false)
    }
  }

  const handleCrear = () => {
    setModo('crear')
    setMarcaSeleccionada(null)
    setModalAbierto(true)
  }

  const handleEditar = (marca: Marca) => {
    setModo('editar')
    setMarcaSeleccionada(marca)
    setModalAbierto(true)
  }

  const handleEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar la marca "${nombre}"?\n\nEsta acción no se puede deshacer.`)) return

    try {
      await api.delete(`/marcas/${id}`)
      obtenerMarcas()
      setError('')
    } catch (err: any) {
      console.error('Error al eliminar:', err)
      const errorMessage = err.response?.data?.error || 'Error al eliminar marca'
      setError(errorMessage)
    }
  }

  const handleGuardar = async (data: Partial<Marca>, id?: number) => {
    try {
      if (modo === 'crear') {
        await api.post('/marcas', data)
      } else if (id) {
        await api.put(`/marcas/${id}`, data)
      }
      setModalAbierto(false)
      obtenerMarcas()
      setError('')
    } catch (err: any) {
      console.error('Error al guardar:', err)
      const errorMessage = err.response?.data?.error || 'Error al guardar marca'
      setError(errorMessage)
    }
  }

  const getMarcasPorCategoria = (categoria: string[]) => {
    return marcas.filter(marca => categoria.includes(marca.nombre))
  }

  const getMarcasOtras = () => {
    const todasLasCategorias = [...marcasRopa, ...marcasZapatos, ...marcasAccesorios]
    return marcas.filter(marca => !todasLasCategorias.includes(marca.nombre))
  }

  useEffect(() => {
    if (user?.empresaId) {
      obtenerMarcas()
    }
  }, [user])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLoader className="w-10 h-10 text-purple-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cargando Sistema</h2>
          <p className="text-gray-600">Preparando la gestión de marcas...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-pink-50 p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">Debes iniciar sesión para acceder al sistema de gestión de marcas.</p>
          <Link 
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Iniciar Sesión
          </Link>
        </div>
      </main>
    )
  }

  if (!user.empresaId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50 p-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Empresa Requerida</h2>
          <p className="text-gray-600 mb-8">
            Para gestionar marcas necesitas tener una empresa registrada en el sistema. 
            Esto nos permite organizar mejor tu inventario y productos.
          </p>
          <Link 
            href="/inicio/empresa"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Crear Mi Empresa
          </Link>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header con gradiente púrpura para marcas */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6">
                  <FiAward className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Gestión de Marcas</h1>
                  <p className="text-purple-100 text-lg">
                    Administra las marcas de tus productos para una organización premium
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-purple-100 text-sm">Total Marcas</p>
                    <p className="text-white font-bold text-3xl">{marcas.length}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-purple-100 text-sm">Productos</p>
                    <p className="text-white font-bold text-3xl">
                      {marcas.reduce((total, marca) => total + (marca._count?.articulos || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción premium */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {marcas.length === 0 && (
              <button
                onClick={crearMarcasDefecto}
                disabled={creandoDefecto}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {creandoDefecto ? (
                  <>
                    <FiLoader className="w-5 h-5 mr-3 animate-spin" />
                    Creando marcas...
                  </>
                ) : (
                  <>
                    <FiZap className="w-5 h-5 mr-3" />
                    Crear Marcas de Moda
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={handleCrear}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiPlus className="w-5 h-5 mr-3" />
              Nueva Marca
            </button>

            <Link
              href="/inicio/resumen-categorias"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiEye className="w-5 h-5 mr-3" />
              Ver Resumen
            </Link>

            <button
              onClick={obtenerMarcas}
              disabled={loading}
              className="inline-flex items-center px-6 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <FiBarChart className="w-5 h-5 mr-2" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Mensaje de error premium */}
        {error && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 flex items-center shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 mb-1">Error en el Sistema</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-2xl p-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiLoader className="w-10 h-10 text-purple-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cargando Marcas</h3>
              <p className="text-gray-600">Obteniendo información de tu inventario...</p>
            </div>
          </div>
        ) : marcas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-2xl p-16">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FiAward className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No tienes marcas registradas
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Las marcas te permiten organizar mejor tus productos y crear un catálogo profesional. 
                Puedes empezar con las marcas predeterminadas de moda o crear marcas personalizadas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={crearMarcasDefecto}
                  disabled={creandoDefecto}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {creandoDefecto ? (
                    <>
                      <FiLoader className="w-5 h-5 mr-3 animate-spin" />
                      Creando marcas...
                    </>
                  ) : (
                    <>
                      <FiZap className="w-5 h-5 mr-3" />
                      Crear Marcas de Moda
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleCrear}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FiPlus className="w-5 h-5 mr-3" />
                  Crear Marca Personalizada
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Categorización visual premium por tipo de producto */}
            <div className="space-y-8">
              
              {/* Marcas de Ropa */}
              {getMarcasPorCategoria(marcasRopa).length > 0 && (
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
                        <span className="text-3xl">👕</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          <FiShoppingBag className="w-6 h-6 mr-2 text-blue-600" />
                          Marcas de Ropa
                        </h2>
                        <p className="text-gray-600 text-lg">{getMarcasPorCategoria(marcasRopa).length} marcas de vestimenta disponibles</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">{getMarcasPorCategoria(marcasRopa).length}</p>
                      <p className="text-sm text-gray-500">marcas</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {getMarcasPorCategoria(marcasRopa).map((marca) => (
                      <MarcaCard 
                        key={marca.id} 
                        marca={marca} 
                        onEdit={handleEditar} 
                        onDelete={handleEliminar}
                        color="blue"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Marcas de Zapatos */}
              {getMarcasPorCategoria(marcasZapatos).length > 0 && (
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mr-6">
                        <span className="text-3xl">👟</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          <FiLayers className="w-6 h-6 mr-2 text-green-600" />
                          Marcas de Zapatos
                        </h2>
                        <p className="text-gray-600 text-lg">{getMarcasPorCategoria(marcasZapatos).length} marcas de calzado disponibles</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">{getMarcasPorCategoria(marcasZapatos).length}</p>
                      <p className="text-sm text-gray-500">marcas</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {getMarcasPorCategoria(marcasZapatos).map((marca) => (
                      <MarcaCard 
                        key={marca.id} 
                        marca={marca} 
                        onEdit={handleEditar} 
                        onDelete={handleEliminar}
                        color="green"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Marcas de Accesorios */}
              {getMarcasPorCategoria(marcasAccesorios).length > 0 && (
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mr-6">
                        <span className="text-3xl">👜</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          <FiTag className="w-6 h-6 mr-2 text-purple-600" />
                          Marcas de Accesorios
                        </h2>
                        <p className="text-gray-600 text-lg">{getMarcasPorCategoria(marcasAccesorios).length} marcas de complementos disponibles</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-600">{getMarcasPorCategoria(marcasAccesorios).length}</p>
                      <p className="text-sm text-gray-500">marcas</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {getMarcasPorCategoria(marcasAccesorios).map((marca) => (
                      <MarcaCard 
                        key={marca.id} 
                        marca={marca} 
                        onEdit={handleEditar} 
                        onDelete={handleEliminar}
                        color="purple"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Otras Marcas */}
              {getMarcasOtras().length > 0 && (
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mr-6">
                        <FiStar className="w-8 h-8 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          <FiAward className="w-6 h-6 mr-2 text-amber-600" />
                          Marcas Personalizadas
                        </h2>
                        <p className="text-gray-600 text-lg">{getMarcasOtras().length} marcas creadas por ti</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-amber-600">{getMarcasOtras().length}</p>
                      <p className="text-sm text-gray-500">marcas</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {getMarcasOtras().map((marca) => (
                      <MarcaCard 
                        key={marca.id} 
                        marca={marca} 
                        onEdit={handleEditar} 
                        onDelete={handleEliminar}
                        color="amber"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Dashboard de estadísticas premium */}
        {marcas.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-2xl p-8">
            <div className="border-l-4 border-purple-600 pl-6 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <FiBarChart className="w-6 h-6 mr-3 text-purple-600" />
                Dashboard de Marcas
              </h3>
              <p className="text-gray-600 mt-2">Estadísticas completas de tu inventario por marcas</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total de Marcas</p>
                    <p className="text-white font-bold text-3xl">{marcas.length}</p>
                  </div>
                  <FiAward className="w-10 h-10 text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Marcas de Ropa</p>
                    <p className="text-white font-bold text-3xl">{getMarcasPorCategoria(marcasRopa).length}</p>
                  </div>
                  <FiShoppingBag className="w-10 h-10 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Marcas de Zapatos</p>
                    <p className="text-white font-bold text-3xl">{getMarcasPorCategoria(marcasZapatos).length}</p>
                  </div>
                  <FiLayers className="w-10 h-10 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">Accesorios</p>
                    <p className="text-white font-bold text-3xl">{getMarcasPorCategoria(marcasAccesorios).length}</p>
                  </div>
                  <FiTag className="w-10 h-10 text-amber-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de marca */}
        {modalAbierto && (
          <MarcaModal
            open={modalAbierto}
            modo={modo}
            initialData={marcaSeleccionada ?? undefined}
            onClose={() => setModalAbierto(false)}
            onSubmit={handleGuardar}
          />
        )}
      </div>
    </div>
  )
}

// Componente de tarjeta de marca premium
interface MarcaCardProps {
  marca: Marca
  onEdit: (marca: Marca) => void
  onDelete: (id: number, nombre: string) => void
  color: 'blue' | 'green' | 'purple' | 'amber'
}

function MarcaCard({ marca, onEdit, onDelete, color }: MarcaCardProps) {
  const colorMap = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
      icon: 'bg-blue-100',
      text: 'text-blue-600',
      hover: 'hover:from-blue-100 hover:to-blue-200'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-200',
      icon: 'bg-green-100',
      text: 'text-green-600',
      hover: 'hover:from-green-100 hover:to-green-200'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-200',
      icon: 'bg-purple-100',
      text: 'text-purple-600',
      hover: 'hover:from-purple-100 hover:to-purple-200'
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
      border: 'border-amber-200',
      icon: 'bg-amber-100',
      text: 'text-amber-600',
      hover: 'hover:from-amber-100 hover:to-amber-200'
    }
  }

  const colors = colorMap[color]

  return (
    <div className={`${colors.bg} ${colors.hover} border ${colors.border} rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
            {marca.logo ? (
              <img src={marca.logo} alt={marca.nombre} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <span className={`text-xl font-bold ${colors.text}`}>
                {marca.nombre.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-lg truncate">{marca.nombre}</h3>
            {marca.descripcion && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{marca.descripcion}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center ${colors.text} bg-white rounded-lg px-3 py-1 shadow-sm`}>
          <FiPackage className="w-4 h-4 mr-2" />
          <span className="text-sm font-semibold">
            {marca._count?.articulos || 0} productos
          </span>
        </div>
        <div className="flex items-center text-gray-400">
          <FiTrendingUp className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(marca)}
          className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm font-semibold border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
        >
          <FiEdit2 className="w-4 h-4 mr-2" />
          Editar
        </button>
        <button
          onClick={() => onDelete(marca.id, marca.nombre)}
          className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 text-sm font-semibold border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md"
        >
          <FiTrash2 className="w-4 h-4 mr-2" />
          Eliminar
        </button>
      </div>
    </div>
  )
}