'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FiZap, FiSettings } from 'react-icons/fi'
import { ThemeProvider } from '@/app/context/ThemeContext'
import { SidebarProvider } from '@/app/context/SidebarContext'
import { AuthProvider } from '@/app/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { HydrationFix } from '@/components/HydrationFix'
import ThemeToggle from '@/components/ThemeToggle'

interface LoadingBarProps {
  isLoading: boolean
}

function LoadingBar({ isLoading }: LoadingBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 100)

      return () => clearInterval(timer)
    } else {
      setProgress(100)
      setTimeout(() => setProgress(0), 500)
    }
  }, [isLoading])

  if (progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-200">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

interface FloatingControlsProps {
  showThemeToggle: boolean
}

function FloatingControls({ showThemeToggle }: FloatingControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {/* Botones expandidos */}
      {isExpanded && (
        <div className="flex flex-col space-y-3 animate-in slide-in-from-bottom-2 duration-200">
          {showThemeToggle && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-2">
              <ThemeToggle />
            </div>
          )}
          
          <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-110">
            <FiSettings className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 ${
          isExpanded ? 'rotate-45' : ''
        }`}
        title="Controles rápidos"
      >
        <FiZap className="w-6 h-6" />
      </button>
    </div>
  )
}

function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsLoading(false)
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {displayChildren}
      </div>
    </>
  )
}

function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 opacity-[0.02] pointer-events-none">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')]" />
    </div>
  )
}

function NotificationToast() {
  const [notifications, setNotifications] = useState<Array<{
    id: number
    message: string
    type: 'success' | 'error' | 'info'
  }>>([])

  // Función para agregar notificaciones (puede ser llamada desde cualquier parte)
  useEffect(() => {
    // Ejemplo de notificación de bienvenida
    const welcomeTimer = setTimeout(() => {
      setNotifications([{
        id: Date.now(),
        message: '¡Bienvenido a El Sistema SC ERP!',
        type: 'success'
      }])
    }, 2000)

    return () => clearTimeout(welcomeTimer)
  }, [])

  // Auto-remove notifications
  useEffect(() => {
    notifications.forEach(notification => {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 5000)
    })
  }, [notifications])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-6 z-[60] space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-xl shadow-lg backdrop-blur-sm border animate-in slide-in-from-right-2 duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-50/90 border-green-200 text-green-800'
              : notification.type === 'error'
              ? 'bg-red-50/90 border-red-200 text-red-800'
              : 'bg-blue-50/90 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center">
            {notification.type === 'success' && <span className="mr-2">✅</span>}
            {notification.type === 'error' && <span className="mr-2">❌</span>}
            {notification.type === 'info' && <span className="mr-2">ℹ️</span>}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function RootClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/register'
  const showThemeToggle = !isPublicPage // Solo mostrar en páginas internas

  return (
    <>
      <HydrationFix />
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <div className="relative min-h-screen flex flex-col">
              {/* Background Pattern */}
              <BackgroundPattern />
              
              {/* Navigation */}
              <Navbar />
              
              {/* Main Content */}
              <main className="flex-1 relative">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              
              {/* Footer */}
              <Footer />
              
              {/* Floating Controls */}
              <FloatingControls showThemeToggle={showThemeToggle} />
              
              {/* Notification Toast */}
              <NotificationToast />
              
              {/* Gradient Overlays for Visual Enhancement */}
              <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />
              <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/5 to-transparent pointer-events-none z-10" />
            </div>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}