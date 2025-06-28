'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import Sidebar from '@/components/sidebar'
import ProfileMenu from '@/components/ProfileMenu'
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

  if (isLoading || !isAuthenticated) return null

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      <aside>
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white focus:outline-5"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* ✅ Pasar avatar al menú de perfil */}
          <ProfileMenu/>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
