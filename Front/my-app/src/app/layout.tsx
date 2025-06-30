import { Metadata, Viewport } from 'next'
import './globals.css'
import RootClientLayout from '@/components/RootClientLayout'

// ✅ Metadata corregida - SIN themeColor
export const metadata: Metadata = {
  title: 'El Sistema SC',
  description: 'Sistema integral de gestión empresarial para el crecimiento de tu negocio',
  keywords: 'ERP, gestión empresarial, inventario, compras, ventas',
  authors: [{ name: 'El Sistema SC' }],
  openGraph: {
    title: 'El Sistema SC',
    description: 'Tu sistema ERP para crecer sin límites',
    type: 'website',
  },
}

// ✅ Viewport separado - CON themeColor aquí
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="min-h-screen scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-900 font-['Inter'] antialiased transition-all duration-300">
        <div className="min-h-screen flex flex-col">
          <RootClientLayout>
            <div className="flex-1">
              {children}
            </div>
          </RootClientLayout>
        </div>
                
        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')]"></div>
        </div>
      </body>
    </html>
  )
}