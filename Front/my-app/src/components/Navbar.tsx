'use client'

import Link from 'next/link'
import { useSidebar } from '@/app/context/SidebarContext'
import { useAuth } from '@/app/context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { toggleSidebar } = useSidebar()

  // ✅ Ocultar navbar si el usuario está autenticado
  if (isAuthenticated) return null

  const publicLinks = [
    { href: '/login', label: 'Iniciar Sesión' },
    { href: '/register', label: 'Registrarse' }
  ]

  return (
    <nav className="bg-gray-900 text-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex justify-between items-center">
        
        {/* IZQUIERDA: Botón de menú + logo (solo si está autenticado) */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="text-gray-200 p-2 rounded-md hover:bg-gray-800 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Logo siempre visible */}
          <Link href="/" className="text-2xl font-bold text-white">
            ERP Sistema
          </Link>
        </div>

        {/* DERECHA: enlaces públicos solo si NO está autenticado */}
        <div className="flex items-center space-x-4">
          {publicLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-200 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
