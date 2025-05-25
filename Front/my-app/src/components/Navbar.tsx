'use client'

import { useState } from 'react'
import { useAuth } from '../app/context/AuthContext'
import Link from 'next/link'
import { useSidebar } from '@/context/SidebarContext'

export default function Navbar() {
  const { isAuthenticated } = useAuth()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toggleSidebar } = useSidebar()

  // ✅ Ocultar navbar si el usuario está autenticado
  if (isAuthenticated) return null

  // const handleLogout = () => {
  //   logout()
  //   router.push('/login')
  // }

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
        {!isAuthenticated && (
          <div className="hidden md:flex items-center space-x-6">
            {publicLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Botón de menú móvil (hamburguesa) solo si NO está autenticado */}
        {!isAuthenticated && (
          <button
            onClick={() => setIsMenuOpen(open => !open)}
            className="md:hidden p-2 rounded-md text-gray-200 hover:bg-gray-800 focus:outline-none"
          >
            <svg
              className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Menú móvil: solo si NO está autenticado */}
      {!isAuthenticated && isMenuOpen && (
        <div className="md:hidden bg-gray-800 text-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {publicLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
