'use client'

import { FiX, FiUser, FiMail, FiShield, FiLogOut, FiEdit3, FiCamera, FiCalendar, FiMapPin } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout } = useAuth()

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <FiX className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl">
                {user?.nombre?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                <FiCamera className="w-4 h-4 text-blue-600" />
              </button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                Perfil de Usuario
              </h2>
              <p className="text-blue-100">
                Información personal y configuración de la cuenta
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Información personal */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-blue-600" />
                Información Personal
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Nombre Completo
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {user?.nombre || 'No definido'}
                      </p>
                    </div>
                    <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Correo Electrónico
                      </label>
                      <p className="text-lg text-gray-900">
                        {user?.email || 'No definido'}
                      </p>
                    </div>
                    <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Rol del Sistema
                      </label>
                      <div className="flex items-center">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {user?.rol || 'Administrador'}
                        </span>
                      </div>
                    </div>
                    <FiShield className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Información del sistema */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiShield className="w-5 h-5 mr-2 text-green-600" />
                Información del Sistema
              </h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    ID de Usuario
                  </label>
                  <p className="text-lg font-mono text-green-900">
                    #{user?.userId || 'N/A'}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    ID de Empresa
                  </label>
                  <p className="text-lg font-mono text-blue-900">
                    {user?.empresaId ? `#${user.empresaId}` : 'Sin empresa asignada'}
                  </p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <label className="block text-sm font-medium text-amber-700 mb-1">
                    Estado de la Cuenta
                  </label>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-amber-900 font-medium">Activa</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Última Conexión
                  </label>
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {new Date().toLocaleDateString('es-CO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-blue-700 text-sm">Sesiones este mes</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-green-700 text-sm">Días consecutivos</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">45</div>
                <div className="text-purple-700 text-sm">Acciones realizadas</div>
              </div>
            </div>
          </div>

          {/* Configuraciones rápidas */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración Rápida</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                <div className="flex items-center">
                  <FiEdit3 className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Editar perfil</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                <div className="flex items-center">
                  <FiShield className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Cambiar contraseña</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                <div className="flex items-center">
                  <FiMapPin className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Configurar ubicación</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* Botón de cerrar sesión */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}