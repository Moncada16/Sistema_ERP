'use client'

import { useEffect, useState } from 'react'
import { FiTag, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'
import api from '@/app/lib/api'

interface Marca {
  id: number
  nombre: string
  descripcion?: string
  logo?: string
}

interface Props {
  value?: number | null
  onChange: (marcaId: number | null) => void
  disabled?: boolean
  required?: boolean
}

export default function MarcaSelector({ value, onChange, disabled = false, required = false }: Props) {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Categorización de marcas para mejor organización
  const marcasRopa = ['Zara', 'H&M', 'Pull & Bear', 'Bershka', 'Stradivarius', 'Massimo Dutti', 'Uniqlo', 'Forever 21']
  const marcasZapatos = ['Nike', 'Adidas', 'Converse', 'Vans', 'Puma', 'Reebok', 'Dr. Martens', 'Clarks']
  const marcasAccesorios = ['Ray-Ban', 'Oakley', 'Fossil', 'Casio', 'Michael Kors', 'Coach', 'Pandora', 'Swatch']

  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get('/marcas')
        setMarcas(res.data)
      } catch (err: any) {
        console.error('Error al cargar marcas:', err)
        setError('Error al cargar marcas')
      } finally {
        setLoading(false)
      }
    }

    cargarMarcas()
  }, [])

  const reintentar = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await api.get('/marcas')
      setMarcas(res.data)
    } catch (err: any) {
      console.error('Error al cargar marcas:', err)
      setError('Error al cargar marcas')
    } finally {
      setLoading(false)
    }
  }

  const getMarcasPorCategoria = (categoria: string[]) => {
    return marcas.filter(marca => categoria.includes(marca.nombre))
  }

  const getMarcasOtras = () => {
    const todasLasCategorias = [...marcasRopa, ...marcasZapatos, ...marcasAccesorios]
    return marcas.filter(marca => !todasLasCategorias.includes(marca.nombre))
  }

  const getIconoCategoria = (marcaName: string) => {
    if (marcasRopa.includes(marcaName)) return '👕'
    if (marcasZapatos.includes(marcaName)) return '👟'
    if (marcasAccesorios.includes(marcaName)) return '👜'
    return '🏷️'
  }

  if (loading) {
    return (
      <div className="relative">
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent mr-3"></div>
          <span className="text-sm font-medium">Cargando marcas...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative">
        <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-gradient-to-r from-red-50 to-rose-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-red-700">
              <FiAlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={reintentar}
              className="ml-2 p-1 text-red-600 hover:text-red-800 transition-colors"
              title="Reintentar"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center">
        <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-4 h-4 z-10" />
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
          disabled={disabled}
          required={required}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 appearance-none"
        >
          <option value="">
            {marcas.length === 0 
              ? '🏷️ No hay marcas disponibles' 
              : '🏷️ Seleccionar marca (opcional)'
            }
          </option>
          
          {/* Marcas de Ropa */}
          {getMarcasPorCategoria(marcasRopa).length > 0 && (
            <optgroup label="👕 Ropa & Textil">
              {getMarcasPorCategoria(marcasRopa).map((marca) => (
                <option key={marca.id} value={marca.id}>
                  👕 {marca.nombre}
                </option>
              ))}
            </optgroup>
          )}

          {/* Marcas de Zapatos */}
          {getMarcasPorCategoria(marcasZapatos).length > 0 && (
            <optgroup label="👟 Calzado & Deportes">
              {getMarcasPorCategoria(marcasZapatos).map((marca) => (
                <option key={marca.id} value={marca.id}>
                  👟 {marca.nombre}
                </option>
              ))}
            </optgroup>
          )}

          {/* Marcas de Accesorios */}
          {getMarcasPorCategoria(marcasAccesorios).length > 0 && (
            <optgroup label="👜 Accesorios & Complementos">
              {getMarcasPorCategoria(marcasAccesorios).map((marca) => (
                <option key={marca.id} value={marca.id}>
                  👜 {marca.nombre}
                </option>
              ))}
            </optgroup>
          )}

          {/* Otras marcas */}
          {getMarcasOtras().length > 0 && (
            <optgroup label="🏷️ Otras Marcas">
              {getMarcasOtras().map((marca) => (
                <option key={marca.id} value={marca.id}>
                  🏷️ {marca.nombre}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {/* Estadísticas de marcas */}
      {marcas.length > 0 && (
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <FiTag className="w-3 h-3 mr-1" />
            <span>{marcas.length} marca{marcas.length !== 1 ? 's' : ''} disponible{marcas.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2">
            {getMarcasPorCategoria(marcasRopa).length > 0 && (
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                👕 {getMarcasPorCategoria(marcasRopa).length}
              </span>
            )}
            {getMarcasPorCategoria(marcasZapatos).length > 0 && (
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                👟 {getMarcasPorCategoria(marcasZapatos).length}
              </span>
            )}
            {getMarcasPorCategoria(marcasAccesorios).length > 0 && (
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                👜 {getMarcasPorCategoria(marcasAccesorios).length}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Mostrar marca seleccionada */}
      {value && (
        <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center text-purple-700">
            {(() => {
              const marcaSeleccionada = marcas.find(m => m.id === value)
              const icono = marcaSeleccionada ? getIconoCategoria(marcaSeleccionada.nombre) : '🏷️'
              return (
                <>
                  <span className="mr-2">{icono}</span>
                  <span className="text-xs font-medium">
                    Marca seleccionada: {marcaSeleccionada?.nombre || 'Desconocida'}
                  </span>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}