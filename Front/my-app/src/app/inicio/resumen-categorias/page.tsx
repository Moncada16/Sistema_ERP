// src/app/inicio/resumen-categorias/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import api from '@/app/lib/api'

interface Articulo {
  id: number
  nombre: string
  codigo: string
  precio: number
}

interface CategoriaConArticulos {
  id: number
  nombre: string
  descripcion?: string
  icono?: string
  _count: {
    articulos: number
  }
  articulos?: Articulo[]
}

export default function ResumenCategoriasPage() {
  const { user, isLoading } = useAuth()
  const [categorias, setCategorias] = useState<CategoriaConArticulos[]>([])
  const [articulosSinCategoria, setArticulosSinCategoria] = useState<Articulo[]>([])
  const [expandida, setExpandida] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarDatos = async () => {
    try {
      setError('')
      
      // Cargar categorías con conteo de artículos
      const resCategorias = await api.get('/categoria-articulo')
      
      // Cargar artículos sin categoría
      const resArticulos = await api.get('/articulos?sinCategoria=true')
      
      setCategorias(resCategorias.data)
      setArticulosSinCategoria(resArticulos.data || [])
    } catch (err: any) {
      console.error('Error al cargar datos:', err)
      setError('Error al cargar la información')
    } finally {
      setLoading(false)
    }
  }

  const cargarArticulosCategoria = async (categoriaId: number) => {
    try {
      const res = await api.get(`/articulos?categoriaId=${categoriaId}`)
      
      setCategorias(prev => 
        prev.map(cat => 
          cat.id === categoriaId 
            ? { ...cat, articulos: res.data }
            : cat
        )
      )
    } catch (err: any) {
      console.error('Error al cargar artículos:', err)
    }
  }

  const toggleExpansion = async (categoriaId: number) => {
    if (expandida === categoriaId) {
      setExpandida(null)
    } else {
      setExpandida(categoriaId)
      
      // Cargar artículos si no los tenemos
      const categoria = categorias.find(c => c.id === categoriaId)
      if (categoria && !categoria.articulos) {
        await cargarArticulosCategoria(categoriaId)
      }
    }
  }

  useEffect(() => {
    if (user?.empresaId) {
      cargarDatos()
    }
  }, [user])

  if (isLoading) {
    return (
      <main className="p-6 text-center text-gray-600">
        🔄 Cargando sesión...
      </main>
    )
  }

  if (!user?.empresaId) {
    return (
      <main className="p-6 text-center text-red-600">
        ⚠️ Debes tener una empresa registrada para ver este resumen.
      </main>
    )
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        🔄 Cargando resumen de categorías...
      </div>
    )
  }

  const totalArticulos = categorias.reduce((sum, cat) => sum + cat._count.articulos, 0) + articulosSinCategoria.length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">📊 Resumen de Categorías</h1>
        <p className="text-gray-600">
          Organización de tus {totalArticulos} artículos por categorías
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Categorías</p>
              <p className="text-2xl font-bold text-blue-800">{categorias.length}</p>
            </div>
            <span className="text-2xl">🏷️</span>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Total Artículos</p>
              <p className="text-2xl font-bold text-green-800">{totalArticulos}</p>
            </div>
            <span className="text-2xl">📦</span>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Sin Categoría</p>
              <p className="text-2xl font-bold text-yellow-800">{articulosSinCategoria.length}</p>
            </div>
            <span className="text-2xl">❓</span>
          </div>
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="space-y-4">
        {/* Artículos sin categoría */}
        {articulosSinCategoria.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg">
            <button
              onClick={() => toggleExpansion(0)}
              className="w-full p-4 text-left hover:bg-yellow-100 transition-colors rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❓</span>
                  <div>
                    <h3 className="font-semibold text-yellow-800">Sin Categoría</h3>
                    <p className="text-sm text-yellow-600">
                      Artículos que no tienen una categoría asignada
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                    {articulosSinCategoria.length} artículos
                  </span>
                  <span className="text-yellow-600">
                    {expandida === 0 ? '▼' : '▶'}
                  </span>
                </div>
              </div>
            </button>
            
            {expandida === 0 && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {articulosSinCategoria.map((articulo) => (
                    <div key={articulo.id} className="bg-white p-3 rounded border">
                      <h4 className="font-medium text-gray-900">{articulo.nombre}</h4>
                      <p className="text-sm text-gray-600">{articulo.codigo}</p>
                      <p className="text-sm font-medium text-green-600">
                        ${articulo.precio.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Categorías con artículos */}
        {categorias.map((categoria) => (
          <div key={categoria.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <button
              onClick={() => toggleExpansion(categoria.id)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoria.icono || '🏷️'}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{categoria.nombre}</h3>
                    {categoria.descripcion && (
                      <p className="text-sm text-gray-600">{categoria.descripcion}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {categoria._count.articulos} artículos
                  </span>
                  <span className="text-gray-600">
                    {expandida === categoria.id ? '▼' : '▶'}
                  </span>
                </div>
              </div>
            </button>
            
            {expandida === categoria.id && (
              <div className="px-4 pb-4">
                {categoria._count.articulos === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <span className="text-4xl mb-2 block">📦</span>
                    <p>No hay artículos en esta categoría</p>
                    <p className="text-sm">¡Agrega algunos artículos para empezar!</p>
                  </div>
                ) : categoria.articulos ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoria.articulos.map((articulo) => (
                      <div key={articulo.id} className="bg-gray-50 p-3 rounded border">
                        <h4 className="font-medium text-gray-900">{articulo.nombre}</h4>
                        <p className="text-sm text-gray-600">{articulo.codigo}</p>
                        <p className="text-sm font-medium text-green-600">
                          ${articulo.precio.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    🔄 Cargando artículos...
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {categorias.length === 0 && articulosSinCategoria.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay datos para mostrar
            </h3>
            <p className="text-gray-600 mb-4">
              Crea algunas categorías y artículos para ver el resumen aquí.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/inicio/categoria-articulo"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                🏷️ Gestionar Categorías
              </a>
              <a
                href="/inicio/articulos"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition"
              >
                📦 Gestionar Artículos
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Acciones rápidas */}
      {(categorias.length > 0 || articulosSinCategoria.length > 0) && (
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/inicio/categoria-articulo"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            🏷️ Gestionar Categorías
          </a>
          <a
            href="/inicio/articulos"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition"
          >
            📦 Gestionar Artículos
          </a>
        </div>
      )}
    </div>
  )
}