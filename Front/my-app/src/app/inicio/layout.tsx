'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiMenu } from 'react-icons/fi'
import { useAuth } from '@/app/context/AuthContext'
import Sidebar from '@/components/sidebar'
import ProfileMenu from '@/app/inicio/perfil/ProfileMenu'
import { useSidebar } from '@/app/context/SidebarContext'

export default function InicioLayout({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando sistema...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside>
        <Sidebar />
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header premium */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Botón menú móvil */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 lg:hidden"
                aria-label="Abrir menú"
              >
                <FiMenu className="h-6 w-6" />
              </button>
              
              {/* Breadcrumb o título de página */}
              <div className="hidden md:flex items-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  El Sistema SC
                </h1>
              </div>
            </div>

            {/* Menú de perfil */}
            <div className="flex items-center">
              <ProfileMenu />
            </div>
          </div>
        </header>

        {/* Contenido principal con scroll */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}