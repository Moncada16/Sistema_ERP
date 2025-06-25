// src/components/editarbodega.tsx
'use client'

import { useState } from 'react'
import type { Bodega } from '@/app/bodega/bodegadto'

type Props = {
  initialData: Bodega
  onSubmit: (data: Partial<Bodega>, id: number) => void
  onClose: () => void
}

export default function EditarBodega({ initialData, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<Partial<Bodega>>(initialData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form, form.id || 0)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">✏️ Editar Bodega</h2>

      {/* Código visible pero solo lectura */}
      <input
        type="text"
        name="codigo"
        value={form.id || ''}
        disabled
        className="w-full border p-2 rounded bg-gray-100 text-gray-600"
      />

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
          Actualizar
        </button>
        <button type="button" onClick={onClose} className="text-gray-600 hover:underline">
          Cancelar
        </button>
      </div>
    </form>
  )
}
