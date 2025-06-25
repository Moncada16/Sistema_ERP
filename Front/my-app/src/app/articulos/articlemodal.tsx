'use client'

import CrearArticulo from '@/components/CrearArticulo'
import EditarArticulo from '@/components/EditarArticulo'
import type { Articulo } from './articledto'

interface Props {
  modo: 'crear' | 'editar'
  articulo?: Articulo
  onClose: () => void
  onSuccess: () => void
} 

export default function ArticleModal({ modo, articulo, onClose, onSuccess }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        {modo === 'crear' && (
          <CrearArticulo onClose={onClose} onCreated={onSuccess} />
        )}
        {modo === 'editar' && articulo && (
          <EditarArticulo articulo={articulo} onClose={onClose} onUpdated={onSuccess} />
        )}
      </div>
    </div>
  )
}
