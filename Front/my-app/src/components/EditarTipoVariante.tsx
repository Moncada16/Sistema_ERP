'use client'

import { useState } from 'react'
import api from '@/app/lib/api'
import type { TipoVariante } from '@/app/tipos-variante/typedto'

export default function EditarTipoVariante({
  tipo,
  onClose,
  onUpdated,
}: {
  tipo: TipoVariante
  onClose: () => void
  onUpdated: () => void
}) {
  const [nombre, setNombre] = useState(tipo.nombre)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put(`/tipos-variante/${tipo.id}`, { nombre })
      onUpdated()
      onClose()
    } catch (err) {
      console.error('Error al editar tipo de variante:', err)
      setError( 'Error al actualizar tipo de variante')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">✏️ Editar Tipo de Variante</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <div className="flex gap-4">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Actualizar</button>
        <button type="button" onClick={onClose} className="text-gray-600 hover:underline">Cancelar</button>
      </div>
    </form>
  )
}
