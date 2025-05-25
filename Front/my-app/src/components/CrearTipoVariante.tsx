'use client'
import { useState } from 'react'
import api from '@/app/lib/api'

export default function CrearTipoVariante({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/tipos-variante', { nombre })
      onCreated()
      onClose()
    } catch (error) {
      console.error('Error al crear tipo de variante:', error)
      setError('Error al crear tipo')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <h2 className="text-lg font-bold">➕ Tipo de Variante</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border p-2 rounded" required />
      <div className="flex gap-4">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Guardar</button>
        <button type="button" onClick={onClose} className="text-gray-500 hover:underline">Cancelar</button>
      </div>
    </form>
  )
}
