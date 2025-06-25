'use client'

import { useState } from 'react'
import api from '@/app/lib/api'

export default function CrearProveedor({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ nombre: '', nit: '', direccion: '', telefono: '', email: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/proveedores', form)
    onCreated()
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">➕ Nuevo Proveedor</h2>
      <input type="text" placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full border p-2 rounded" required />
      <input type="text" placeholder="NIT" value={form.nit} onChange={(e) => setForm({ ...form, nit: e.target.value })} className="w-full border p-2 rounded" required />
      <input type="text" placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className="w-full border p-2 rounded" />
      <input type="text" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full border p-2 rounded" />
      <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border p-2 rounded" />
      <div className="flex justify-between pt-4">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Guardar</button>
        <button type="button" onClick={onClose} className="text-gray-600 hover:underline">Cancelar</button>
      </div>
    </form>
  )
}
