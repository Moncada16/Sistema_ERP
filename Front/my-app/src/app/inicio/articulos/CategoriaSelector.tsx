'use client'

import { useEffect, useState } from 'react'
import { FiFolder, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'
import api from '@/app/lib/api'

interface CategoriaArticulo {
  id: number
  nombre: string
  descripcion?: string
  icono?: string
}

interface Props {
  value?: number | null
  onChange: (categoriaId: number | null) => void
  disabled?: boolean
  required?: boolean
}

export default function CategoriaSelector({ value, onChange, disabled = false, required = false }: Props) {
  const [categorias, setCategorias] = useState<CategoriaArticulo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get('/categoria-articulo')
        setCategorias(res.data)
      } catch (err: any) {
        console.error('Error al cargar categorías:', err)
        setError('Error al cargar categorías')
      } finally {
        setLoading(false)
      }
    }

    cargarCategorias()
  }, [])

  const reintentar = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await api.get('/categoria-articulo')
      setCategorias(res.data)
    } catch (err: any) {
      console.error('Error al cargar categorías:', err)
      setError('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="relative">
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent mr-3"></div>
          <span className="text-sm font-medium">Cargando categorías...</span>
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
        <FiFolder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4 z-10" />
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
          disabled={disabled}
          required={required}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 appearance-none"
        >
          <option value="">
            {categorias.length === 0 
              ? '📂 No hay categorías disponibles' 
              : '📂 Seleccionar categoría (opcional)'
            }
          </option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.icono ? `${categoria.icono} ${categoria.nombre}` : `📁 ${categoria.nombre}`}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {/* Información adicional */}
      {categorias.length > 0 && (
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <FiFolder className="w-3 h-3 mr-1" />
          <span>{categorias.length} categoría{categorias.length !== 1 ? 's' : ''} disponible{categorias.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      
      {/* Mostrar categoría seleccionada */}
      {value && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-700">
            <FiFolder className="w-3 h-3 mr-2" />
            <span className="text-xs font-medium">
              Categoría seleccionada: {categorias.find(c => c.id === value)?.nombre || 'Desconocida'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}