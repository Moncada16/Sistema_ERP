'use client'

import { useEffect } from 'react'
import CrearProveedor from '@/app/inicio/proveedores/CrearProveedor'
import EditarProveedor from '@/app/inicio/proveedores/EditarProveedor'
import { FiX, FiTruck, FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi'

type Props = {
  proveedor?: { id: number; nombre?: string }
  onClose: () => void
  onSuccess: () => void
}

export default function ProveedorModal({ proveedor, onClose, onSuccess }: Props) {
  const isEditing = !!proveedor

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Header con gradiente índigo para proveedores */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                {isEditing ? (
                  <FiEdit3 className="w-6 h-6 text-white" />
                ) : (
                  <FiPlus className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </h2>
                <p className="text-indigo-100 text-sm">
                  {isEditing 
                    ? `Modifica la información de ${proveedor?.nombre || 'este proveedor'}`
                    : 'Registra un nuevo proveedor en tu sistema empresarial'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-xl transition-colors duration-200 group"
              title="Cerrar modal"
            >
              <FiX className="w-6 h-6 text-white group-hover:text-indigo-100" />
            </button>
          </div>
        </div>

        {/* Contenido del modal con scroll */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {isEditing ? (
            <EditarProveedor 
              proveedor={proveedor} 
              onClose={onClose} 
              onUpdated={onSuccess} 
            />
          ) : (
            <CrearProveedor 
              onClose={onClose} 
              onCreated={onSuccess} 
            />
          )}
        </div>

        {/* Footer informativo */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <FiTruck className="w-4 h-4 mr-2 text-indigo-600" />
              <span>
                {isEditing 
                  ? 'Los cambios se aplicarán inmediatamente al guardar'
                  : 'Todos los campos marcados con * son obligatorios'
                }
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Presiona ESC para cerrar
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}