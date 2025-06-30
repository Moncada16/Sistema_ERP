'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiMenu, FiX, FiLogIn, FiUserPlus, FiZap } from 'react-icons/fi'
import { useSidebar } from '@/app/context/SidebarContext'
import { useAuth } from '@/app/context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { toggleSidebar } = useSidebar()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // ✅ Ocultar navbar si el usuario está autenticado
  if (isAuthenticated) return null

  const publicLinks = [
    { href: '/login', label: 'Iniciar Sesión', icon: FiLogIn },
    { href: '/register', label: 'Registrarse', icon: FiUserPlus }
  ]

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex justify-between items-center h-16">
            {/* IZQUIERDA: Logo */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <button
                  onClick={toggleSidebar}
                  className="text-gray-700 p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors"
                >
                  <FiMenu className="h-6 w-6" />
                </button>
              )}

              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                    <FiZap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    EL SISTEMA ERP
                  </div>
                  <div className="text-xs text-gray-500 -mt-1">Sistema ERP</div>
                </div>
              </Link>
            </div>

            {/* CENTRO: Navegación (oculta en móvil) */}
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                href="/#caracteristicas" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                Características
              </Link>
              <Link 
                href="/#testimonios" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                Testimonios
              </Link>
              <Link 
                href="/#precios" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                Precios
              </Link>
            </div>

            {/* DERECHA: Enlaces de autenticación */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                <FiLogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Link>
              
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium transform hover:scale-105"
              >
                <FiUserPlus className="w-4 h-4 mr-2" />
                Registrarse
              </Link>
            </div>

            {/* Botón de menú móvil */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <div className="px-4 py-6 space-y-4">
              <Link 
                href="/#caracteristicas" 
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Características
              </Link>
              <Link 
                href="/#testimonios" 
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonios
              </Link>
              <Link 
                href="/#precios" 
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Precios
              </Link>
              
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <Link
                  href="/login"
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiLogIn className="w-5 h-5 mr-3" />
                  Iniciar Sesión
                </Link>
                
                <Link
                  href="/register"
                  className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUserPlus className="w-5 h-5 mr-3" />
                  Registrarse Gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Spacer para evitar que el contenido quede detrás del navbar fijo */}
      <div className="h-16"></div>
    </>
  )
}