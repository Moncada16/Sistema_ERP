'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiUser, FiSettings, FiLogOut, FiChevronDown, FiMail, FiShield, FiCalendar } from 'react-icons/fi'
import { useAuth } from '@/app/context/AuthContext'
import Image from 'next/image'

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  const handleProfileClick = () => {
    router.push('/inicio/perfil')
    setOpen(false)
  }

  if (!user) return null

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón perfil */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 border border-white/20"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            {user.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
          {/* Si tienes foto de perfil disponible, descomenta esto:
          <Image
            src={user.photo || '/default-avatar.png'}
            alt="Foto de perfil"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
          />
          */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="hidden md:block text-left">
          <div className="text-white font-medium text-sm">
            {user.nombre || 'Usuario'}
          </div>
          <div className="text-white/70 text-xs">
            {user.rol || 'Admin'}
          </div>
        </div>
        
        <FiChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Header del perfil */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {user.nombre?.charAt(0).toUpperCase() || 'U'}
                </div>
                {/* Si tienes foto de perfil disponible, descomenta esto:
                <Image
                  src={user.photo || '/default-avatar.png'}
                  alt="Foto de perfil"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-3 border-white/30"
                />
                */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">
                  {user.nombre || 'Usuario'}
                </h3>
                <p className="text-blue-100 text-sm truncate">
                  {user.email || 'email@ejemplo.com'}
                </p>
                <div className="flex items-center mt-1">
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-white text-xs font-medium">
                      {user.rol || 'Administrador'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <FiMail className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-gray-600">Email</div>
                  <div className="font-medium text-gray-900 truncate">
                    {user.email || 'No definido'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-gray-600">Sesión</div>
                  <div className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('es-CO')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiShield className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-gray-600">Empresa ID</div>
                  <div className="font-medium text-gray-900">
                    {user.empresaId ? `#${user.empresaId}` : 'Sin empresa'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-gray-600">Usuario ID</div>
                  <div className="font-medium text-gray-900">
                    #{user.userId || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-2">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                <FiUser className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">Mi Perfil</div>
                <div className="text-sm text-gray-500">Gestionar información personal</div>
              </div>
            </button>

            <button
              onClick={() => {
                router.push('/inicio/configuracion')
                setOpen(false)
              }}
              className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                <FiSettings className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">Configuración</div>
                <div className="text-sm text-gray-500">Ajustes del sistema</div>
              </div>
            </button>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200"></div>

          {/* Cerrar sesión */}
          <div className="py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-200 transition-colors">
                <FiLogOut className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">Cerrar Sesión</div>
                <div className="text-sm text-red-400">Salir del sistema</div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>El Sistema SC ERP</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}