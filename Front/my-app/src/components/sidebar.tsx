'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import {
  FiSettings,
  FiUser,
  FiHome,
  FiBox,
  FiShoppingCart,
  FiArchive,
  FiBarChart2,
  FiChevronUp,
  FiChevronDown,
  FiDollarSign,
  FiPackage
} from 'react-icons/fi'
import Tooltip from '@/components/Tooltip'

import { useSidebar } from '../app/context/SidebarContext'

interface NavItem {
  name: string
  href?: string
  icon?: React.ReactNode
  description: string
  subItems?: {
    name: string
    href: string
    icon?: React.ReactNode
    description: string
  }[]
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/inicio', icon: <FiHome />, description: 'Vista general del sistema' },
  {
    name: 'Catálogo',
    icon: <FiPackage />,
    description: 'Gestión de productos y servicios',
    subItems: [
      { name: 'Artículos', href: '/inicio/articulos', icon: <FiBox />, description: 'Administrar artículos y variantes' },
      { name: 'Tipos de variantes', href: '/inicio/tipos-variante', icon: <FiArchive />, description: 'Configurar tipos de variantes' },
      { name: 'Tipos de precio', href: '/inicio/tipo-precio', icon: <FiBarChart2 />, description: 'Gestionar precios' },
    ],
  },
  {
    name: 'Operaciones',
    icon: <FiShoppingCart />,
    description: 'Gestión de operaciones diarias',
    subItems: [
      { name: 'Compras', href: '/inicio/compras', icon: <FiShoppingCart />, description: 'Gestionar compras' },
      { name: 'Inventario', href: '/inicio/inventario', icon: <FiArchive />, description: 'Control de inventario' },
      { name: 'Cuentas por Pagar', href: '/inicio/cxp', icon: <FiDollarSign />, description: 'Gestionar pagos pendientes' },
    ],
  },
  { name: 'Reportes', href: '/inicio/reportes', icon: <FiBarChart2 />, description: 'Análisis y estadísticas' },
  {
    name: 'Configuración',
    icon: <FiSettings />,
    description: 'Ajustes del sistema',
    subItems: [
      { name: 'Mi Perfil', href: '/inicio/perfil', icon: <FiUser />, description: 'Editar información personal' },
      { name: 'Empresa', href: '/inicio/empresa', icon: <FiHome />, description: 'Configuración de la empresa' },
      { name: 'Bodegas', href: '/inicio/bodega', icon: <FiBox />, description: 'Administrar bodegas' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggleSidebar } = useSidebar()
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (name: string) =>
    setOpenSection(openSection === name ? null : name)

  return (
    <aside
      className={clsx(
        'h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700',
        'p-4 flex flex-col transition-all duration-300 overflow-hidden shadow-lg',
        { 'w-64': isOpen, 'w-16': !isOpen }
      )}
    >
      {/* Logo/Header */}
      <div className="mb-6">
        <button
          onClick={toggleSidebar}
          className={clsx(
            'flex items-center transition-all',
            isOpen ? 'px-4 justify-start' : 'px-0 justify-center'
          )}
        > 
          <FiHome className="text-2xl text-gray-900 dark:text-gray-100" />
          {isOpen && (
            <Link href={'/inicio'} className="ml-2 text-gray-900 dark:text-gray-100 text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              SC erp
            </Link>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map(item => {
          const isActiveParent = item.href
            ? pathname === item.href
            : item.subItems?.some(si => pathname === si.href)

          if (item.subItems) {
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleSection(item.name)}
                  className={clsx(
                    'flex items-center w-full py-2 rounded-lg text-sm font-medium transition-colors',
                    isActiveParent
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                    isOpen
                      ? 'px-4 justify-between'
                      : 'px-0 justify-center'
                  )}
                >
                  <div className="flex items-center">
                    <Tooltip content={item.description} disabled={isOpen}>
            <div className="flex items-center">
              <span className="text-xl" role="img" aria-hidden="true">{item.icon}</span>
              {isOpen && (
                <span className="ml-2">{item.name}</span>
              )}
            </div>
          </Tooltip>
                  </div>
                  {isOpen && (
                    openSection === item.name
                      ? <FiChevronUp />
                      : <FiChevronDown />
                  )}
                </button>

                {isOpen && openSection === item.name && (
                  <ul className="mt-1 ml-6 flex flex-col gap-1">
                    {item.subItems.map(sub => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={clsx(
                          'flex items-center py-1 rounded-lg text-sm transition-colors',
                          pathname === sub.href
                            ? 'bg-blue-50 dark:bg-blue-800 text-blue-800 dark:text-blue-100'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                          'px-4'
                        )}
                      >
                        <span className="text-lg">{sub.icon}</span>
                        <span className="ml-2">{sub.name}</span>
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={clsx(
                'flex items-center py-2 rounded-lg text-sm font-medium transition-colors',
                isActiveParent
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                isOpen
                  ? 'px-4 justify-start'
                  : 'px-0 justify-center'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && (
                <span className="ml-2">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
