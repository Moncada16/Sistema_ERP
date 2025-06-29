'use client'

import { useState } from 'react'
import api from '@/app/lib/api'
import type { Articulo } from '@/app/inicio/articulos/articledto'

export default function EditarArticulo({ articulo, onClose, onUpdated }: { articulo: Articulo, onClose: () => void, onUpdated: () => void }) {
  const [nombre, setNombre] = useState(articulo.nombre)
  const [descripcion, setDescripcion] = useState(articulo.descripcion)
  const [precio, setPrecio] = useState(articulo.precio)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put(`/articulos/${articulo.id}`, { nombre, descripcion, precio })
      onUpdated()
      onClose()
    } catch (error) {
      console.error('Error al editar artículo:', error)
      setError('Error al actualizar artículo')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <h2 className="text-lg font-bold">✏️ Editar Artículo</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border p-2 rounded" required />
      <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full border p-2 rounded" required />
      <input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} className="w-full border p-2 rounded" required />
      <div className="flex gap-4">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Actualizar</button>
        <button type="button" onClick={onClose} className="text-gray-500 hover:underline">Cancelar</button>
      </div>
    </form>
  )
}
