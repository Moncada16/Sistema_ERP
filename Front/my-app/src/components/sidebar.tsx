'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
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
  FiPackage,
  FiGrid,
  FiTag,
  FiFolder,
  FiTrendingUp,
  FiTruck,
  FiUsers,
  FiZap,
  FiLayers
} from 'react-icons/fi'
import Tooltip from '@/components/Tooltip'

import { useSidebar } from '../app/context/SidebarContext'
import { useAuth } from '../app/context/AuthContext'

interface NavItem {
  name: string
  href?: string
  icon?: React.ReactNode
  description: string
  color: string
  subItems?: {
    name: string
    href: string
    icon?: React.ReactNode
    description: string
    color: string
  }[]
}

const navItems: NavItem[] = [
  { 
    name: 'Dashboard', 
    href: '/inicio', 
    icon: <FiHome />, 
    description: 'Vista general del sistema', 
    color: 'indigo' 
  },
  {
    name: 'Catálogo',
    icon: <FiPackage />,
    description: 'Gestión de productos y servicios',
    color: 'blue',
    subItems: [
      { 
        name: 'Artículos', 
        href: '/inicio/articulos', 
        icon: <FiBox />, 
        description: 'Administrar artículos y variantes',
        color: 'blue'
      },
      { 
        name: 'Categorías', 
        href: '/inicio/categoria-articulo', 
        icon: <FiFolder />, 
        description: 'Organizar productos por categorías',
        color: 'green'
      },
      { 
        name: 'Marcas', 
        href: '/inicio/Marca', 
        icon: <FiTag />, 
        description: 'Gestionar marcas de productos',
        color: 'purple'
      },
      { 
        name: 'Tipos de variantes', 
        href: '/inicio/tipos-variante', 
        icon: <FiLayers />, 
        description: 'Configurar tipos de variantes',
        color: 'amber'
      },
      { 
        name: 'Tipos de precio', 
        href: '/inicio/tipo-precio', 
        icon: <FiBarChart2 />, 
        description: 'Gestionar estructuras de precios',
        color: 'rose'
      },
    ],
  },
  {
    name: 'Operaciones',
    icon: <FiShoppingCart />,
    description: 'Gestión de operaciones diarias',
    color: 'rose',
    subItems: [
      { 
        name: 'Compras', 
        href: '/inicio/compras', 
        icon: <FiShoppingCart />, 
        description: 'Gestionar órdenes de compra',
        color: 'rose'
      },
      { 
        name: 'Inventario', 
        href: '/inicio/inventario', 
        icon: <FiArchive />, 
        description: 'Control de stock y movimientos',
        color: 'amber'
      },
      { 
        name: 'Proveedores', 
        href: '/inicio/proveedores', 
        icon: <FiTruck />, 
        description: 'Administrar proveedores',
        color: 'indigo'
      },
      { 
        name: 'Cuentas por Pagar', 
        href: '/inicio/cxp', 
        icon: <FiDollarSign />, 
        description: 'Gestionar pagos pendientes',
        color: 'red'
      },
    ],
  },
  { 
    name: 'Reportes', 
    href: '/inicio/reportes', 
    icon: <FiTrendingUp />, 
    description: 'Análisis y estadísticas', 
    color: 'green' 
  },
  {
    name: 'Configuración',
    icon: <FiSettings />,
    description: 'Ajustes del sistema',
    color: 'gray',
    subItems: [
      { 
        name: 'Mi Perfil', 
        href: '/inicio/perfil', 
        icon: <FiUser />, 
        description: 'Editar información personal',
        color: 'blue'
      },
      { 
        name: 'Empresa', 
        href: '/inicio/empresa', 
        icon: <FiHome />, 
        description: 'Configuración de la empresa',
        color: 'purple'
      },
      { 
        name: 'Bodegas', 
        href: '/inicio/bodega', 
        icon: <FiGrid />, 
        description: 'Administrar almacenes y ubicaciones',
        color: 'green'
      },
      { 
        name: 'Usuarios', 
        href: '/inicio/usuarios', 
        icon: <FiUsers />, 
        description: 'Gestionar usuarios del sistema',
        color: 'amber'
      },
    ],
  },
]

// Componente Avatar inteligente
function UserAvatar({ size = 'md', showInfo = false }: { size?: 'sm' | 'md' | 'lg', showInfo?: boolean }) {
  const { user } = useAuth()
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }

  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Generar color basado en el nombre
  const getNameColor = (name: string) => {
    const colors = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-red-500 to-orange-500',
      'from-yellow-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-cyan-500'
    ]
    
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)
    
    return colors[Math.abs(hash) % colors.length]
  }

  const baseClasses = `
    ${sizeClasses[size]} 
    rounded-xl 
    flex 
    items-center 
    justify-center 
    font-bold 
    shadow-lg 
    transition-all 
    duration-300 
    hover:shadow-xl 
    hover:scale-105
    cursor-pointer
  `

  // Si hay imagen y no hay error, mostrar imagen
  if (user?.photo && !imageError) {
    return (
      <div className={`${baseClasses} overflow-hidden bg-gray-100`}>
        <Image
          src={user.photo}
          alt={`Avatar de ${user.nombre}`}
          width={40}
          height={40}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          priority={false}
        />
      </div>
    )
  }

  // Si hay nombre, mostrar iniciales con color generado
  if (user?.nombre) {
    const initials = getInitials(user.nombre)
    const colorGradient = getNameColor(user.nombre)
    
    return (
      <div className={`${baseClasses} bg-gradient-to-br ${colorGradient} text-white`}>
        {initials}
      </div>
    )
  }

  // Fallback: mostrar icono de usuario
  return (
    <div className={`${baseClasses} bg-gradient-to-br from-gray-400 to-gray-600 text-white`}>
      <FiUser className="w-5 h-5" />
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggleSidebar } = useSidebar()
  const { user } = useAuth()
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (name: string) => {
    if (isOpen) {
      setOpenSection(openSection === name ? null : name)
    }
  }

  return (
    <aside
      className={clsx(
        'h-screen sticky top-0 bg-gradient-to-b from-white via-gray-50 to-gray-100 border-r border-gray-200',
        'flex flex-col transition-all duration-300 overflow-hidden shadow-xl backdrop-blur-sm',
        { 'w-72': isOpen, 'w-16': !isOpen }
      )}
    >
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg">
        <button
          onClick={toggleSidebar}
          className={clsx(
            'flex items-center transition-all duration-300 w-full group',
            isOpen ? 'justify-start' : 'justify-center'
          )}
        > 
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 shadow-lg">
              <FiZap className="text-xl text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
          </div>
          
          {isOpen && (
            <div className="ml-4 text-white">
              <div className="text-lg font-bold">Bendito Calzado</div>
              <div className="text-blue-200 text-xs -mt-1">Sistema ERP</div>
            </div>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(item => {
          const isActiveParent = item.href
            ? pathname === item.href
            : item.subItems?.some(si => pathname === si.href)

          if (item.subItems) {
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleSection(item.name)}
                  className={clsx(
                    'flex items-center w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 group',
                    isActiveParent
                      ? `bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white shadow-lg transform scale-105`
                      : `hover:bg-gradient-to-r hover:from-${item.color}-50 hover:to-${item.color}-100 text-gray-700 hover:text-${item.color}-700 hover:shadow-md`,
                    isOpen
                      ? 'px-4 justify-between'
                      : 'px-0 justify-center'
                  )}
                >
                  <div className="flex items-center">
                    <Tooltip content={`${item.name} - ${item.description}`} disabled={isOpen}>
                      <div className="flex items-center">
                        <div className={clsx(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                          isActiveParent 
                            ? 'bg-white/20' 
                            : `group-hover:bg-${item.color}-200`
                        )}>
                          <span className="text-lg">{item.icon}</span>
                        </div>
                        {isOpen && (
                          <span className="ml-3">{item.name}</span>
                        )}
                      </div>
                    </Tooltip>
                  </div>
                  {isOpen && (
                    <div className={clsx(
                      'transition-transform duration-200',
                      openSection === item.name ? 'rotate-180' : ''
                    )}>
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {isOpen && openSection === item.name && (
                  <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-1">
                    {item.subItems.map(sub => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={clsx(
                          'flex items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 group',
                          pathname === sub.href
                            ? `bg-gradient-to-r from-${sub.color}-500 to-${sub.color}-600 text-white shadow-md transform scale-105`
                            : `hover:bg-gradient-to-r hover:from-${sub.color}-50 hover:to-${sub.color}-100 text-gray-600 hover:text-${sub.color}-700 hover:shadow-sm`
                        )}
                      >
                        <div className={clsx(
                          'w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200',
                          pathname === sub.href 
                            ? 'bg-white/20' 
                            : `group-hover:bg-${sub.color}-200`
                        )}>
                          <span className="text-base">{sub.icon}</span>
                        </div>
                        <span className="ml-3">{sub.name}</span>
                        
                        {/* Badge para nuevas funcionalidades */}
                        {(sub.name === 'Categorías' || sub.name === 'Marcas') && (
                          <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                            Nuevo
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={clsx(
                'flex items-center py-3 rounded-xl text-sm font-semibold transition-all duration-200 group',
                isActiveParent
                  ? `bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 text-white shadow-lg transform scale-105`
                  : `hover:bg-gradient-to-r hover:from-${item.color}-50 hover:to-${item.color}-100 text-gray-700 hover:text-${item.color}-700 hover:shadow-md`,
                isOpen
                  ? 'px-4 justify-start'
                  : 'px-0 justify-center'
              )}
            >
              <Tooltip content={`${item.name} - ${item.description}`} disabled={isOpen}>
                <div className="flex items-center">
                  <div className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                    isActiveParent 
                      ? 'bg-white/20' 
                      : `group-hover:bg-${item.color}-200`
                  )}>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  {isOpen && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </div>
              </Tooltip>
            </Link>
          )
        })}
      </nav>

      {/* Footer con información del usuario */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <Link 
            href="/inicio/perfil"
            className="flex items-center group hover:bg-white/80 rounded-xl p-2 transition-all duration-200 hover:shadow-md"
          >
            <UserAvatar size="md" />
            <div className="ml-3 flex-1">
              <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {user?.nombre || 'Usuario'}
              </div>
              <div className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">
                {user?.email || 'Sistema ERP'}
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <FiUser className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
            </div>
          </Link>
        </div>
      )}

      {/* Indicador de estado colapsado */}
      {!isOpen && (
        <div className="p-2 flex flex-col items-center space-y-2">
          <UserAvatar size="sm" />
          <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
        </div>
      )}
    </aside>
  )
}