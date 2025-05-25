'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'
import ArticleModal from './articlemodal'
import EliminarArticulo from '@/components/EliminarArticulo'
import type { Articulo } from './articledto'

export default function ArticulosPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [editando, setEditando] = useState<Articulo | null>(null)
  const [eliminando, setEliminando] = useState<Articulo | null>(null)
  const [mostrarCrear, setMostrarCrear] = useState(false)
 
  const cargarArticulos = async () => {
    const res = await api.get('/articulos')
    setArticulos(res.data)
  }

  useEffect(() => {
    cargarArticulos()
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📦 Artículos</h1>

      <button
        onClick={() => {
          setMostrarCrear(true)
          setEditando(null)
        }}
        className="mb-4 bg-black text-white px-4 py-2 rounded"
      >
        ➕ Crear Artículo
      </button>

      <ul className="space-y-2">
        {articulos.map((a) => (
          <li key={a.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <div className="font-bold">{a.nombre}</div>
              <div className="text-sm text-gray-500">{a.descripcion}</div>
              <div className="text-sm text-green-600">${a.precio}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => { setEditando(a); setMostrarCrear(true) }} className="text-blue-600 hover:underline">Editar</button>
              <button onClick={() => setEliminando(a)} className="text-red-600 hover:underline">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>

      {mostrarCrear && (
        <ArticleModal
          modo={editando ? 'editar' : 'crear'}
          articulo={editando || undefined}
          onClose={() => {
            setMostrarCrear(false)
            setEditando(null)
          }}
          onSuccess={cargarArticulos}
        />
      )}

      {eliminando && (
        <EliminarArticulo
          articulo={eliminando}
          onClose={() => setEliminando(null)}
          onDeleted={cargarArticulos}
        />
      )}
    </div>
  )
}
