'use client'

import { useEffect, useState } from 'react'
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

  if (loading) {
    return (
      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
        🔄 Cargando categorías...
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-600">
        ⚠️ {error}
      </div>
    )
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
      disabled={disabled}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">Seleccionar categoría (opcional)</option>
      {categorias.map((categoria) => (
        <option key={categoria.id} value={categoria.id}>
          {categoria.icono} {categoria.nombre}
        </option>
      ))}
    </select>
  )
}
