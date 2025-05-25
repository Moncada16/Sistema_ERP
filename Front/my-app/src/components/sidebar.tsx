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
} from 'react-icons/fi'

import { useSidebar } from '../context/SidebarContext'

interface NavItem {
  name: string
  href?: string
  icon?: React.ReactNode
  subItems?: {
    name: string
    href: string
    icon?: React.ReactNode
  }[]
}

const navItems: NavItem[] = [
  {
    name: 'Ajustes de Empresa',
    icon: <FiSettings />,
    subItems: [
      { name: 'Editar mi usuario', href: '/inicio/perfil', icon: <FiUser /> },
      { name: 'Empresa',            href: '/inicio/empresa', icon: <FiHome /> },
      { name: 'Bodega',             href: '/inicio/bodega',  icon: <FiBox /> },
      { name: 'Tipos de variantes', href: '/inicio/tipos-variante', icon: <FiArchive /> },
      { name: 'Tipos de precio',     href: '/inicio/tipo-precio', icon: <FiBarChart2 /> },
    ],
  },
  { name: 'Artículos', href: '/inicio/articulos', icon: <FiBox /> },
  { name: 'Compras',   href: '/inicio/compras',   icon: <FiShoppingCart /> },
  { name: 'Inventario',href: '/inicio/inventario',icon: <FiArchive /> },
  { name: 'Reportes',  href: '/inicio/reportes',  icon: <FiBarChart2 /> },
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
        'h-screen sticky top-0 bg-black border-r border-gray-700 p-4 flex flex-col transition-all duration-300 overflow-hidden',
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
          <FiHome className="text-2xl text-white" />
          {isOpen && (
            <Link href={'/inicio'} className="ml-2 text-white text-lg font-bold">
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
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300',
                    isOpen
                      ? 'px-4 justify-between'
                      : 'px-0 justify-center'
                  )}
                >
                  <div className="flex items-center">
                    <span className="text-xl">{item.icon}</span>
                    {isOpen && (
                      <span className="ml-2">{item.name}</span>
                    )}
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
                            ? 'bg-blue-500 text-white'
                            : 'hover:bg-gray-700 text-gray-300',
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
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300',
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
