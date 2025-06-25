'use client'

import CrearProveedor from '@/components/CrearProveedor'
import EditarProveedor from '@/components/EditarProveedor'

type Props = {
  proveedor?: { id: number }
  onClose: () => void
  onSuccess: () => void
}

export default function ProveedorModal({ proveedor, onClose, onSuccess }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        {proveedor ? (
          <EditarProveedor proveedor={proveedor} onClose={onClose} onUpdated={onSuccess} />
        ) : (
          <CrearProveedor onClose={onClose} onCreated={onSuccess} />
        )}
      </div>
    </div>
  )
}
