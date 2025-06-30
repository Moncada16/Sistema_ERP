'use client'

import { useState, useEffect } from 'react'
import { FiAlertTriangle, FiX, FiTrash2, FiTag, FiAlertCircle, FiPackage } from 'react-icons/fi'
import api from '@/app/lib/api'

// Tipos locales para el componente
interface TipoVariante {
  id: number
  nombre: string
  createdAt?: Date
  updatedAt?: Date
}

interface ValorVariante {
  id: number
  valor: string
  tipoVarianteId: number
  articulosCount?: number
}

interface DependenciasInfo {
  valoresCount: number
  valores: ValorVariante[]
  puedeEliminar: boolean
  dependencias: {
    valores: number
    articulosAfectados: number
    valoresConDependencias: any[]
  }
  razonBloqueo?: string | null
}

export default function EliminarTipoVariante({
  tipo,
  onClose,
  onDeleted,
}: {
  tipo: TipoVariante
  onClose: () => void
  onDeleted: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [loadingDependencias, setLoadingDependencias] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')
  const [dependencias, setDependencias] = useState<DependenciasInfo | null>(null)

  // Cargar dependencias al montar el componente
  useEffect(() => {
    const cargarDependencias = async () => {
      try {
        setLoadingDependencias(true)
        const response = await api.get(`/tipos-variante/${tipo.id}/dependencias`)
        setDependencias(response.data)
      } catch (error: any) {
        console.error('Error al cargar dependencias:', error)
        setError('Error al verificar las dependencias del tipo de variante')
      } finally {
        setLoadingDependencias(false)
      }
    }

    cargarDependencias()
  }, [tipo.id])

  const handleDelete = async () => {
    if (!isConfirmValid) return

    try {
      setLoading(true)
      setError(null)
      
      await api.delete(`/tipos-variante/${tipo.id}`)
      
      onDeleted()
      onClose()
    } catch (error: any) {
      console.error('Error al eliminar tipo de variante:', error)
      
      // Manejo mejorado de errores
      let errorMessage = 'Error al eliminar el tipo de variante'
      
      if (error.response?.status === 409) {
        errorMessage = 'No se puede eliminar: el tipo de variante tiene dependencias activas'
      } else if (error.response?.status === 404) {
        errorMessage = 'El tipo de variante no existe o ya fue eliminado'
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isConfirmValid = confirmText.toLowerCase().trim() === 'eliminar'

  if (loadingDependencias) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando dependencias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
        {/* Header con gradiente de peligro */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <FiAlertTriangle className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-bold">Eliminar Tipo de Variante</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
              aria-label="Cerrar modal"
              disabled={loading}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Mensaje de advertencia crítica */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <FiAlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-bold mb-2">
                  {dependencias?.puedeEliminar ? 'Eliminación Segura' : 'Eliminación Bloqueada'}
                </h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  {dependencias?.puedeEliminar ? (
                    <>
                      Se eliminará este tipo de variante y sus {dependencias.valoresCount} valor(es) asociado(s).
                      <span className="font-bold"> Esta acción es irreversible.</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold">No se puede eliminar:</span> {dependencias?.razonBloqueo}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Información del tipo de variante */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="flex items-center text-amber-800 font-bold mb-4">
              <FiTag className="w-5 h-5 mr-2" />
              Tipo de Variante a Eliminar
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-amber-700 font-medium text-lg">{tipo.nombre}</span>
                <div className="flex items-center text-amber-600 text-sm bg-white/50 rounded-lg px-3 py-1">
                  ID: {tipo.id}
                </div>
              </div>
              
              {/* Información de dependencias */}
              {dependencias && (
                <div className={`${dependencias.puedeEliminar ? 'bg-green-100 border-green-200' : 'bg-orange-100 border-orange-200'} rounded-lg p-3`}>
                  <div className="flex items-center mb-2">
                    <FiPackage className={`w-4 h-4 ${dependencias.puedeEliminar ? 'text-green-600' : 'text-orange-600'} mr-2`} />
                    <span className={`${dependencias.puedeEliminar ? 'text-green-800' : 'text-orange-800'} text-sm font-medium`}>
                      {dependencias.valoresCount} valores encontrados
                      {dependencias.dependencias.articulosAfectados > 0 && 
                        ` (${dependencias.dependencias.articulosAfectados} productos afectados)`
                      }
                    </span>
                  </div>
                  
                  {dependencias.valores.length > 0 && (
                    <div className="mt-2">
                      <p className={`${dependencias.puedeEliminar ? 'text-green-700' : 'text-orange-700'} text-xs mb-1`}>
                        {dependencias.puedeEliminar ? 'Valores que serán eliminados:' : 'Valores con dependencias:'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {dependencias.valores.slice(0, 5).map((valor) => (
                          <span 
                            key={valor.id}
                            className={`inline-flex items-center bg-white/60 text-xs px-2 py-1 rounded ${
                              dependencias.puedeEliminar ? 'text-green-800' : 'text-orange-800'
                            }`}
                          >
                            {valor.valor}
                            {valor.articulosCount && valor.articulosCount > 0 && (
                              <span className="ml-1 text-red-600 font-bold">({valor.articulosCount})</span>
                            )}
                          </span>
                        ))}
                        {dependencias.valores.length > 5 && (
                          <span className={`inline-block bg-white/60 text-xs px-2 py-1 rounded ${
                            dependencias.puedeEliminar ? 'text-green-800' : 'text-orange-800'
                          }`}>
                            +{dependencias.valores.length - 5} más...
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Campo de confirmación */}
          {dependencias?.puedeEliminar && (
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                Para confirmar la eliminación segura, escribe <span className="font-bold text-red-600">"eliminar"</span>:
              </label>
              <input
                id="confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Escribe 'eliminar' para confirmar"
                disabled={loading}
                autoComplete="off"
                autoFocus
              />
            </div>
          )}

          {/* Mensaje informativo si no se puede eliminar */}
          {dependencias && !dependencias.puedeEliminar && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <FiAlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm font-medium mb-2">
                    Para eliminar este tipo de variante:
                  </p>
                  <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                    <li>Primero elimina o modifica los productos que usan estos valores</li>
                    <li>Luego elimina los valores de variante individuales</li>
                    <li>Finalmente podrás eliminar el tipo de variante</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium 
                       hover:bg-gray-50 transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dependencias?.puedeEliminar ? 'Cancelar' : 'Cerrar'}
            </button>
            
            {dependencias?.puedeEliminar && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading || !isConfirmValid}
                className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium 
                         transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  loading || !isConfirmValid
                    ? 'bg-gray-400 text-white cursor-not-allowed transform-none shadow-none'
                    : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-5 h-5 mr-2" />
                    Eliminar Tipo y {dependencias?.valoresCount || 0} Valores
                  </>
                )}
              </button>
            )}
          </div>

          {/* Advertencia final */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              {dependencias?.puedeEliminar 
                ? 'Eliminación segura - No afectará productos existentes'
                : 'Protección de integridad de datos activa'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}