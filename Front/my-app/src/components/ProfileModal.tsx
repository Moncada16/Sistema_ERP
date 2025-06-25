'use client'

import { useAuth } from '../app/context/AuthContext'


interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout } = useAuth()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-3xl text-indigo-600">
                {user?.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <p className="mt-1 text-lg">{user?.nombre}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-lg">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <p className="mt-1 text-lg capitalize">{user?.rol}</p>
          </div>

          <div className="pt-4">
            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
