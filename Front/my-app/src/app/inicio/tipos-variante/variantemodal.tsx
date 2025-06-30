'use client'

import CrearTipoVariante from '@/app/inicio/tipos-variante/CrearTipoVariante'
import EditarTipoVariante from '@/app/inicio/tipos-variante/EditarTipoVariante'
import EliminarTipoVariante from '@/app/inicio/tipos-variante/EliminarTipoVariante'
import type { TipoVariante } from '@/app/tipos-variante/typedto'

type Props = {
  modo: 'crear' | 'editar' | 'eliminar'
  tipo?: TipoVariante
  onClose: () => void
  onSuccess: () => void
}

export default function TipoVarianteModal({ modo, tipo, onClose, onSuccess }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {modo === 'crear' && (
          <CrearTipoVariante onClose={onClose} onCreated={onSuccess} />
        )}
        {modo === 'editar' && tipo && (
          <EditarTipoVariante tipo={tipo} onClose={onClose} onUpdated={onSuccess} />
        )}
        {modo === 'eliminar' && tipo && (
          <EliminarTipoVariante tipo={tipo} onClose={onClose} onDeleted={onSuccess} />
        )}
      </div>
    </div>
  )
}
