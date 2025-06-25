'use client'

import api from '@/app/lib/api'

export default function EliminarProveedor({
  proveedor,
  onClose,
  onDeleted
}: {
  proveedor: { id: number; nombre: string }
  onClose: () => void
  onDeleted: () => void
}) {
  const eliminar = async () => {
    await api.delete(`/proveedores/${proveedor.id}`)
    onDeleted()
    onClose()
  }

  return (
    <div className="bg-red-50 border p-4 rounded">
      <p>¿Eliminar proveedor <strong>{proveedor.nombre}</strong>?</p>
      <div className="flex gap-4 pt-4">
        <button onClick={eliminar} className="bg-red-600 text-white px-4 py-2 rounded">Eliminar</button>
        <button onClick={onClose} className="text-gray-600 hover:underline">Cancelar</button>
      </div>
    </div>
  )
}
