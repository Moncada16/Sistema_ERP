'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'
import ProveedorModal from './ProveedorModal'
import EliminarProveedor from '@/components/EliminarProveedor'

type Proveedor = {
  id: number
  nombre: string
  nit: string
  direccion?: string
  telefono?: string
  email?: string
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [editando, setEditando] = useState<Proveedor | null>(null)
  const [eliminando, setEliminando] = useState<Proveedor | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)

  const cargar = async () => {
    const res = await api.get('/proveedores')
    setProveedores(res.data)
  }

  useEffect(() => {
    cargar()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">💼 Proveedores</h1>

      <button
        onClick={() => {
          setEditando(null)
          setMostrarModal(true)
        }}
        className="bg-black text-white px-4 py-2 rounded"
      >
        ➕ Nuevo Proveedor
      </button>

      <table className="w-full border mt-4 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Nombre</th>
            <th className="p-2">NIT</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Email</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">{p.nit}</td>
              <td className="p-2">{p.telefono}</td>
              <td className="p-2">{p.email}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => { setEditando(p); setMostrarModal(true) }} className="text-blue-600">Editar</button>
                <button onClick={() => setEliminando(p)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <ProveedorModal
          proveedor={editando ?? undefined}
          onClose={() => { setMostrarModal(false); setEditando(null) }}
          onSuccess={cargar}
        />
      )}

      {eliminando && (
        <EliminarProveedor
          proveedor={eliminando}
          onClose={() => setEliminando(null)}
          onDeleted={cargar}
        />
      )}
    </div>
  )
}
