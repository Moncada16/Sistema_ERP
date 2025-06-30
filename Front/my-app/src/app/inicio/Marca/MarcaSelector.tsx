'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'
import { FiTag, FiLoader, FiAlertCircle, FiChevronDown, FiPackage } from 'react-icons/fi'

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

  // Agrupar marcas por categoría con iconos premium
  const marcasRopa = ['Zara', 'H&M', 'Pull & Bear', 'Bershka', 'Stradivarius', 'Massimo Dutti', 'Uniqlo', 'Forever 21']
  const marcasZapatos = ['Nike', 'Adidas', 'Converse', 'Vans', 'Puma', 'Reebok', 'Dr. Martens', 'Clarks']
  const marcasAccesorios = ['Ray-Ban', 'Oakley', 'Fossil', 'Casio', 'Michael Kors', 'Coach', 'Pandora', 'Swatch']

  useEffect(() => {
    const cargarMarcas = async () => {
      try {
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

  const getMarcasPorCategoria = (categoria: string[]) => {
    return marcas.filter(marca => categoria.includes(marca.nombre))
  }

  const getMarcasOtras = () => {
    const todasLasCategorias = [...marcasRopa, ...marcasZapatos, ...marcasAccesorios]
    return marcas.filter(marca => !todasLasCategorias.includes(marca.nombre))
  }

  if (loading) {
    return (
      <div className="relative">
        <div className="w-full px-4 py-3 border border-purple-300 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 flex items-center justify-center">
          <FiLoader className="w-5 h-5 text-purple-600 animate-spin mr-3" />
          <span className="text-purple-700 font-medium">Cargando marcas...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative">
        <div className="w-full px-4 py-3 border border-red-300 rounded-xl bg-gradient-to-r from-red-50 to-red-100 flex items-center">
          <FiAlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
          <span className="text-red-700 font-medium">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Selector premium con estilo moderno */}
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
          disabled={disabled}
          required={required}
          className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-purple-400 transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
        >
          <option value="">
            {marcas.length === 0 ? 'No hay marcas disponibles' : 'Seleccionar marca (opcional)'}
          </option>
          
          {/* Marcas de Ropa */}
          {getMarcasPorCategoria(marcasRopa).length > 0 && (
            <optgroup label="👕 Ropa & Vestimenta">
              {getMarcasPorCategoria(marcasRopa).map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </optgroup>
          )}

          {/* Marcas de Zapatos */}
          {getMarcasPorCategoria(marcasZapatos).length > 0 && (
            <optgroup label="👟 Calzado & Deportivo">
              {getMarcasPorCategoria(marcasZapatos).map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </optgroup>
          )}

          {/* Marcas de Accesorios */}
          {getMarcasPorCategoria(marcasAccesorios).length > 0 && (
            <optgroup label="👜 Accesorios & Complementos">
              {getMarcasPorCategoria(marcasAccesorios).map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </optgroup>
          )}

          {/* Otras marcas */}
          {getMarcasOtras().length > 0 && (
            <optgroup label="🏷️ Marcas Personalizadas">
              {getMarcasOtras().map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </optgroup>
          )}
        </select>

        {/* Icono de marca a la izquierda */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FiTag className="w-5 h-5 text-purple-500" />
        </div>

        {/* Icono de dropdown a la derecha */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Información adicional */}
      {marcas.length > 0 && (
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <FiPackage className="w-4 h-4 mr-1.5 text-purple-500" />
          <span className="font-medium text-purple-600">{marcas.length}</span>
          <span className="ml-1">marcas disponibles organizadas por categoría</span>
        </div>
      )}

      {/* Estado sin marcas */}
      {marcas.length === 0 && (
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <FiAlertCircle className="w-4 h-4 mr-1.5 text-amber-500" />
          No hay marcas registradas en tu empresa
        </div>
      )}
    </div>
  )
}