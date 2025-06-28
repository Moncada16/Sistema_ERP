import { Metadata } from 'next'
import './globals.css'
import RootClientLayout from '@/components/RootClientLayout'


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
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 transition-colors duration-200">
        <RootClientLayout>
            {children}
        </RootClientLayout>
      </body>
    </html>
  )
}
