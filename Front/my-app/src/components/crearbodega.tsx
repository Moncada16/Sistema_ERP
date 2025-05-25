// src/components/crearbodega.tsx
'use client'

import { useState } from 'react'
import { BodegaFormData } from '@/app/bodega/bodegadto'

type Props = {
  onSubmit: (data: Partial<BodegaFormData>) => void
  onClose: () => void
}

export default function CrearBodega({ onSubmit, onClose }: Props) {
  const [form, setForm] = useState<Partial<BodegaFormData>>({
    nombre: '',
    direccion: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">➕ Crear Bodega</h2>

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre || ''}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        name="direccion"
        placeholder="Dirección"
        value={form.direccion || ''}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <div className="flex justify-between">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Guardar
        </button>
        <button type="button" onClick={onClose} className="text-gray-600 hover:underline">
          Cancelar
        </button>
      </div>
    </form>
  )
}
