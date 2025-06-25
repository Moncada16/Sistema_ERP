'use client'

import React, { useState, useEffect } from 'react'

type Bodega = {
  id: number
  nombre: string
  direccion: string
}

type BodegaModalProps = {
  open: boolean
  modo: 'crear' | 'editar'
  initialData?: Bodega
  onClose: () => void
  onSubmit: (data: Partial<Bodega>, id?: number) => Promise<void>
}

const BodegaModal: React.FC<BodegaModalProps> = ({
  open,
  modo,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Bodega>>({
    nombre: '',
    direccion: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        direccion: initialData.direccion,
      })
    } else {
      setFormData({ nombre: '', direccion: '' })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData, initialData?.id)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-md transition">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          {modo === 'crear' ? 'Crear Bodega' : 'Editar Bodega'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            value={formData.nombre || ''}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            name="direccion"
            value={formData.direccion || ''}
            onChange={handleChange}
            placeholder="Dirección"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BodegaModal
