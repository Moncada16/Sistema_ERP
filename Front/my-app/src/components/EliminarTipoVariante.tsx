'use client'

import api from '@/app/lib/api'
import type { TipoVariante } from '@/app/tipos-variante/typedto'

export default function EliminarTipoVariante({
  tipo,
  onClose,
  onDeleted,
}: {
  tipo: TipoVariante
  onClose: () => void
  onDeleted: () => void
}) {
  const handleDelete = async () => {
    try {
      await api.delete(`/tipos-variante/${tipo.id}`)
      onDeleted()
      onClose()
    } catch (error) {
      console.error('Error al eliminar tipo de variante:', error)
      alert('Error al eliminar tipo de variante')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-red-700">❌ Eliminar Tipo</h2>
      <p>¿Estás seguro que deseas eliminar <strong>{tipo.nombre}</strong>? Todos sus valores serán eliminados.</p>
      <div className="flex gap-4">
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Eliminar</button>
        <button onClick={onClose} className="text-gray-600 hover:underline">Cancelar</button>
      </div>
    </div>
  )
}