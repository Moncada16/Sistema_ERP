'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'
import CrearTipoVariante from '@/app/inicio/tipos-variante/CrearTipoVariante'
import EditarTipoVariante from '@/app/inicio/tipos-variante/EditarTipoVariante'
import EliminarTipoVariante from '@/app/inicio/tipos-variante/EliminarTipoVariante'
import CrearValorVariante from '@/app/inicio/ValorVariante/CrearValorVariante'
import EditarValorVariante from '@/app/inicio/ValorVariante/EditarValorVariante'
import ModalInteractivo from '@/components/ModalInteractivo'
import { 
  FiTarget, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiTag,
  FiLoader,
  FiAlertCircle,
  FiLayers,
  FiGrid,
  FiBarChart,
  FiPackage,
  FiSettings,
  FiRefreshCw,
  FiInfo,
  FiStar,
  FiActivity,
  FiEdit3
} from 'react-icons/fi'

// Tipos locales para el componente
interface ValorVariante {
  id: number
  nombre: string
  tipoVarianteId: number
  articuloValores?: any[]
}

interface TipoVariante {
  id: number
  nombre: string
  valores?: ValorVariante[]
  createdAt?: Date
  updatedAt?: Date
}

export default function TiposVariantePage() {
  const [tipos, setTipos] = useState<TipoVariante[]>([])
  const [editando, setEditando] = useState<TipoVariante | null>(null)
  const [eliminando, setEliminando] = useState<TipoVariante | null>(null)
  const [creandoValor, setCreandoValor] = useState<TipoVariante | null>(null)
  const [editandoValor, setEditandoValor] = useState<{ valor: ValorVariante; tipo: TipoVariante } | null>(null) // Nuevo estado
  const [mostrarCrear, setMostrarCrear] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarTipos = async () => {
    try {
      setError('')
      const res = await api.get('/tipos-variante')
      setTipos(res.data)
    } catch (err: any) {
      console.error('Error al cargar tipos de variante:', err)
      setError('Error al cargar los tipos de variante')
    } finally {
      setLoading(false)
    }
  }

  const handleCrearTipo = () => {
    setMostrarCrear(true)
    setEditando(null)
  }

  const handleEditarTipo = (tipo: TipoVariante) => {
    setEditando(tipo)
  }

  const handleEliminarTipo = (tipo: TipoVariante) => {
    setEliminando(tipo)
  }

  const handleCrearValor = (tipo: TipoVariante) => {
    setCreandoValor(tipo)
  }

  // Nueva función para editar valor
  const handleEditarValor = (valor: ValorVariante, tipo: TipoVariante) => {
    // Asegurar que el valor tenga tipoVarianteId
    const valorCompleto = {
      ...valor,
      tipoVarianteId: valor.tipoVarianteId || tipo.id
    }
    setEditandoValor({ valor: valorCompleto, tipo })
  }

  const handleCloseModal = () => {
    setMostrarCrear(false)
    setEditando(null)
    setEliminando(null)
    setCreandoValor(null)
    setEditandoValor(null) // Cerrar modal de edición de valor
  }

  useEffect(() => {
    cargarTipos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLoader className="w-10 h-10 text-amber-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cargando Tipos de Variante</h2>
          <p className="text-gray-600">Obteniendo configuración de variantes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header con gradiente ámbar para inventario/variantes */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6">
                <FiTarget className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Tipos de Variante</h1>
                <p className="text-amber-100 text-lg">
                  Configura características personalizables para tus productos
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-amber-100 text-sm">Total Tipos</p>
                  <p className="text-white font-bold text-3xl">{tipos.length}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-amber-100 text-sm">Total Valores</p>
                  <p className="text-white font-bold text-3xl">
                    {tipos.reduce((total, tipo) => total + (tipo.valores?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de herramientas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            
            {/* Información */}
            <div className="flex-1">
              <div className="border-l-4 border-amber-600 pl-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <FiSettings className="w-5 h-5 mr-2 text-amber-600" />
                  Configuración de Variantes
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Define tipos como Color, Talla, Material y sus valores específicos. 
                  <span className="font-medium text-amber-600"> Haz clic en un valor para editarlo.</span>
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={handleCrearTipo}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Nuevo Tipo
              </button>
              
              <button
                onClick={cargarTipos}
                disabled={loading}
                className="inline-flex items-center px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 flex items-center shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 mb-1">Error en el Sistema</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {tipos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FiTarget className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No tienes tipos de variante configurados
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Los tipos de variante te permiten definir características personalizables para tus productos 
                como colores, tallas, materiales, etc.
              </p>
              
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200 mb-8">
                <h4 className="font-semibold text-amber-900 mb-4">Ejemplos de tipos de variante:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-amber-100">
                    <strong className="text-amber-800">Color:</strong>
                    <p className="text-amber-700 mt-1">Rojo, Azul, Verde, Negro</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-100">
                    <strong className="text-amber-800">Talla:</strong>
                    <p className="text-amber-700 mt-1">XS, S, M, L, XL, XXL</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-100">
                    <strong className="text-amber-800">Material:</strong>
                    <p className="text-amber-700 mt-1">Algodón, Poliéster, Cuero</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCrearTipo}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5 mr-3" />
                Crear Primer Tipo de Variante
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grid de tipos de variante */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {tipos.map((tipo) => (
                <div
                  key={tipo.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 transform hover:scale-105"
                >
                  {/* Header del tipo */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                        <FiLayers className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{tipo.nombre}</h2>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FiTag className="w-3 h-3 mr-1" />
                          <span>{tipo.valores?.length || 0} valores configurados</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg flex items-center justify-center">
                      <FiStar className="w-4 h-4 text-amber-600" />
                    </div>
                  </div>

                  {/* Valores del tipo - EDITABLES AL HACER CLIC */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <FiGrid className="w-4 h-4 mr-2 text-amber-600" />
                      Valores disponibles:
                      <span className="ml-2 text-xs text-blue-600 font-normal">(clic para editar)</span>
                    </h3>
                    {tipo.valores && tipo.valores.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tipo.valores.map((valor) => (
                          <button
                            key={valor.id}
                            onClick={() => handleEditarValor(valor, tipo)}
                            className="group relative inline-flex items-center px-3 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-sm font-medium rounded-lg border border-amber-200 hover:from-amber-200 hover:to-yellow-200 hover:border-amber-300 transition-all duration-200 hover:shadow-md transform hover:scale-105"
                            title={`Editar valor: ${valor.nombre}`}
                          >
                            <span>{valor.nombre}</span>
                            <FiEdit3 className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <FiPackage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Sin valores configurados</p>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditarTipo(tipo)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                      title="Editar tipo de variante"
                    >
                      <FiEdit2 className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleCrearValor(tipo)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium"
                      title="Agregar valor"
                    >
                      <FiPlus className="w-4 h-4 mr-1" />
                      Valor
                    </button>
                    <button
                      onClick={() => handleEliminarTipo(tipo)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                      title="Eliminar tipo de variante"
                    >
                      <FiTrash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con estadísticas */}
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-center mb-2">
                    <FiTarget className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xl">{tipos.length}</div>
                  <div className="text-amber-100 text-sm">Tipos Configurados</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-center mb-2">
                    <FiTag className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xl">
                    {tipos.reduce((total, tipo) => total + (tipo.valores?.length || 0), 0)}
                  </div>
                  <div className="text-green-100 text-sm">Valores Totales</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-center mb-2">
                    <FiBarChart className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xl">
                    {tipos.length > 0 ? Math.round(tipos.reduce((total, tipo) => total + (tipo.valores?.length || 0), 0) / tipos.length) : 0}
                  </div>
                  <div className="text-blue-100 text-sm">Promedio por Tipo</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-center mb-2">
                    <FiActivity className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-xl">Activo</div>
                  <div className="text-purple-100 text-sm">Estado del Sistema</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Información adicional */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <FiInfo className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">¿Qué son los tipos de variante?</h3>
              <p className="text-blue-800 leading-relaxed">
                Los tipos de variante te permiten crear características personalizables para tus productos. 
                Por ejemplo, un tipo "Color" puede tener valores como "Rojo", "Azul", "Verde". 
                Esto es especialmente útil para ropa, calzado y accesorios donde los productos tienen múltiples opciones.
                <span className="font-medium"> Haz clic en cualquier valor para editarlo o eliminarlo.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modales */}
        <ModalInteractivo
          isOpen={mostrarCrear}
          title="Crear Tipo de Variante"
          onClose={handleCloseModal}
        >
          <CrearTipoVariante
            onClose={handleCloseModal}
            onCreated={cargarTipos}
          />
        </ModalInteractivo>

        <ModalInteractivo
          isOpen={!!editando}
          title="Editar Tipo de Variante"
          onClose={handleCloseModal}
        >
          {editando && (
            <EditarTipoVariante
              tipo={editando}
              onClose={handleCloseModal}
              onUpdated={cargarTipos}
            />
          )}
        </ModalInteractivo>

        <ModalInteractivo
          isOpen={!!eliminando}
          title="Eliminar Tipo de Variante"
          onClose={handleCloseModal}
        >
          {eliminando && (
            <EliminarTipoVariante
              tipo={eliminando}
              onClose={handleCloseModal}
              onDeleted={cargarTipos}
            />
          )}
        </ModalInteractivo>

        <ModalInteractivo
          isOpen={!!creandoValor}
          title="Agregar Valor a Tipo"
          onClose={handleCloseModal}
        >
          {creandoValor && (
            <CrearValorVariante
              tipo={creandoValor}
              onClose={handleCloseModal}
              onCreated={cargarTipos}
            />
          )}
        </ModalInteractivo>

        {/* NUEVO MODAL: Editar Valor de Variante */}
        <ModalInteractivo
          isOpen={!!editandoValor}
          title="Editar Valor de Variante"
          onClose={handleCloseModal}
        >
          {editandoValor && (
            <EditarValorVariante
              valor={editandoValor.valor}
              tipo={editandoValor.tipo}
              onClose={handleCloseModal}
              onUpdated={cargarTipos}
            />
          )}
        </ModalInteractivo>
      </div>
    </div>
  )
}