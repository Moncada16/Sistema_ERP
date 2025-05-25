'use client'

import api from '@/app/lib/api'
import type { Articulo } from '@/app/articulos/articledto'

export default function EliminarArticulo({ articulo, onClose, onDeleted }: { articulo: Articulo, onClose: () => void, onDeleted: () => void }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/articulos/${articulo.id}`)
      onDeleted()
      onClose()
    } catch (error) {
      console.error('Error al eliminar artículo:', error)
      alert('Error al eliminar artículo')
    }
  }

  return (
    <div className="border p-4 rounded bg-red-50">
      <h2 className="font-bold mb-2 text-red-700">¿Eliminar Artículo?</h2>
      <p>Se eliminará permanentemente: <strong>{articulo.nombre}</strong></p>
      <div className="flex gap-4 mt-4">
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Eliminar</button>
        <button onClick={onClose} className="text-gray-600 hover:underline">Cancelar</button>
      </div>
    </div>
  )
}
