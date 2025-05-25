import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from './context/AuthContext'
import { SidebarProvider } from '../context/SidebarContext' // ← NUEVO
import Navbar from '../components/Navbar'
import Footer from '@/components/Footer'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema ERP',
  description: 'Sistema de gestión empresarial',
  keywords: 'ERP, gestión, inventario, compras, ventas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="min-h-screen">
      <body>
        <AuthProvider>
          <SidebarProvider>
            <Navbar />
            {children}
            <Footer />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
