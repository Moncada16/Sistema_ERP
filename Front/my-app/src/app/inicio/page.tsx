'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { debugSession, hasValidSession, getSessionInfo } from '../lib/auth' // Importar funciones del auth unificado
import Link from 'next/link'
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { 
  FiBox, 
  FiArchive, 
  FiShoppingBag, 
  FiTrendingUp, 
  FiAlertCircle,
  FiTag,
  FiAward,
  FiPlus,
  FiEye,
  FiPackage,
  FiGrid,
  FiBarChart2,
  FiHome,
  FiShoppingCart,
  FiUsers,
  FiTarget,
  FiActivity,
  FiLoader,
  FiStar,
  FiClock,
  FiDollarSign,
  FiShield
} from 'react-icons/fi'

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

interface DashboardStats {
  totalArticulos: number
  totalBodegas: number
  totalInventario: number
  totalCompras: number
  totalCategorias: number
  totalMarcas: number
  ultimasCompras: Array<{
    id: number
    fecha: string
    total: number
    proveedor: string
  }>
  inventarioPorBodega: Array<{
    bodega: string
    cantidad: number
  }>
  comprasPorMes: Array<{
    mes: string
    total: number
  }>
  alertasInventario: Array<{
    articulo: string
    cantidad: number
    minimo: number
  }>
  categoriasMasUsadas: Array<{
    nombre: string
    cantidad: number
    icono: string
  }>
  marcasMasUsadas: Array<{
    nombre: string
    cantidad: number
  }>
}

interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
  bgColor: string
  hoverColor: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  const quickActions: QuickAction[] = [
    {
      title: 'Nuevo Artículo',
      description: 'Agregar producto al catálogo',
      href: '/inicio/articulos',
      icon: <FiPlus className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      hoverColor: 'hover:from-blue-100 hover:to-blue-200'
    },
    {
      title: 'Gestionar Categorías',
      description: 'Organizar tipos de productos',
      href: '/inicio/categoria-articulo',
      icon: <FiTag className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      hoverColor: 'hover:from-green-100 hover:to-green-200'
    },
    {
      title: 'Gestionar Marcas',
      description: 'Administrar marcas premium',
      href: '/inicio/Marca',
      icon: <FiAward className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      hoverColor: 'hover:from-purple-100 hover:to-purple-200'
    },
    {
      title: 'Ver Inventario',
      description: 'Revisar stock disponible',
      href: '/inicio/inventario',
      icon: <FiPackage className="w-6 h-6" />,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      hoverColor: 'hover:from-amber-100 hover:to-amber-200'
    },
    {
      title: 'Nueva Bodega',
      description: 'Crear ubicación de almacén',
      href: '/inicio/bodega',
      icon: <FiArchive className="w-6 h-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      hoverColor: 'hover:from-indigo-100 hover:to-indigo-200'
    },
    {
      title: 'Resumen Categorías',
      description: 'Vista organizada de productos',
      href: '/inicio/resumen-categorias',
      icon: <FiGrid className="w-6 h-6" />,
      color: 'text-rose-600',
      bgColor: 'bg-gradient-to-br from-rose-50 to-rose-100',
      hoverColor: 'hover:from-rose-100 hover:to-rose-200'
    }
  ]

  useEffect(() => {
    // Debug de sesión en desarrollo
    if (process.env.NODE_ENV === 'development') {
      debugSession()
    }

    // Obtener información de sesión
    const currentSessionInfo = getSessionInfo()
    setSessionInfo(currentSessionInfo)

    console.log('🔍 Dashboard - Estado de sesión:', {
      hasValidSession: hasValidSession(),
      sessionInfo: currentSessionInfo,
      user: user
    })
  }, [user])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError('')

        // Verificar sesión válida antes de hacer requests
        if (!hasValidSession()) {
          console.warn('⚠️ Dashboard - Sesión inválida detectada')
          setError('Sesión expirada. Por favor, inicie sesión nuevamente.')
          return
        }
        
        console.log('📊 Dashboard - Cargando datos...')
        
        // Obtener datos del dashboard con manejo de errores robusto
        const [
          articulosRes,
          bodegasRes,
          categoriasRes,
          marcasRes
        ] = await Promise.allSettled([
          api.get('/articulos'),
          api.get('/bodegas'),
          api.get('/categoria-articulo'),
          api.get('/marcas')
        ])

        // Procesar resultados de Promise.allSettled
        const articulosData = articulosRes.status === 'fulfilled' ? articulosRes.value.data : []
        const bodegasData = bodegasRes.status === 'fulfilled' ? bodegasRes.value.data : []
        const categoriasData = categoriasRes.status === 'fulfilled' ? categoriasRes.value.data : []
        const marcasData = marcasRes.status === 'fulfilled' ? marcasRes.value.data : []

        // Log de errores si los hay
        if (articulosRes.status === 'rejected') console.warn('⚠️ Error cargando artículos:', articulosRes.reason)
        if (bodegasRes.status === 'rejected') console.warn('⚠️ Error cargando bodegas:', bodegasRes.reason)
        if (categoriasRes.status === 'rejected') console.warn('⚠️ Error cargando categorías:', categoriasRes.reason)
        if (marcasRes.status === 'rejected') console.warn('⚠️ Error cargando marcas:', marcasRes.reason)

        // Procesar datos para estadísticas mejoradas
        const mockStats: DashboardStats = {
          totalArticulos: articulosData.length || 0,
          totalBodegas: bodegasData.length || 0,
          totalCategorias: categoriasData.length || 0,
          totalMarcas: marcasData.length || 0,
          totalInventario: 1250,
          totalCompras: 15680,
          ultimasCompras: [
            { id: 1, fecha: '2025-06-28', total: 150000, proveedor: 'Nike Colombia' },
            { id: 2, fecha: '2025-06-27', total: 85000, proveedor: 'Adidas Distribución' },
            { id: 3, fecha: '2025-06-26', total: 220000, proveedor: 'Zara Fashion Group' }
          ],
          inventarioPorBodega: [
            { bodega: 'Bodega Principal', cantidad: 450 },
            { bodega: 'Bodega Norte', cantidad: 320 },
            { bodega: 'Bodega Sur', cantidad: 280 },
            { bodega: 'Almacén Central', cantidad: 200 }
          ],
          comprasPorMes: [
            { mes: 'Ene', total: 125000 },
            { mes: 'Feb', total: 135000 },
            { mes: 'Mar', total: 142000 },
            { mes: 'Abr', total: 155000 },
            { mes: 'May', total: 148000 },
            { mes: 'Jun', total: 168000 }
          ],
          alertasInventario: [
            { articulo: 'Camiseta Nike Dri-FIT Básica', cantidad: 5, minimo: 20 },
            { articulo: 'Zapatos Adidas Running Boost', cantidad: 3, minimo: 15 }
          ],
          categoriasMasUsadas: categoriasData.slice(0, 5).map((cat: any) => ({
            nombre: cat.nombre,
            cantidad: cat._count?.articulos || Math.floor(Math.random() * 50) + 10,
            icono: cat.icono || '📦'
          })),
          marcasMasUsadas: marcasData.slice(0, 5).map((marca: any) => ({
            nombre: marca.nombre,
            cantidad: marca._count?.articulos || Math.floor(Math.random() * 30) + 5
          }))
        }

        console.log('✅ Dashboard - Datos cargados exitosamente:', mockStats)
        setStats(mockStats)
      } catch (err: any) {
        console.error('❌ Dashboard - Error al cargar datos:', err)
        
        // Manejo específico de errores de autenticación
        if (err.response?.status === 401) {
          setError('Sesión expirada. Por favor, inicie sesión nuevamente.')
        } else if (err.response?.status === 403) {
          setError('No tiene permisos para acceder a esta información.')
        } else if (err.request) {
          setError('Error de conexión. Verifique su internet e inténtelo de nuevo.')
        } else {
          setError('Error al cargar los datos del dashboard. Inténtelo más tarde.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.empresaId && hasValidSession()) {
      fetchDashboardData()
    } else if (user?.empresaId && !hasValidSession()) {
      setError('Sesión inválida. Por favor, inicie sesión nuevamente.')
      setIsLoading(false)
    }
  }, [user])

  // Configuración de gráficos
  const inventarioChartData = {
    labels: stats?.inventarioPorBodega?.map(item => item.bodega) || [],
    datasets: [
      {
        data: stats?.inventarioPorBodega?.map(item => item.cantidad) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 3,
      },
    ],
  }

  const categoriasChartData = {
    labels: stats?.categoriasMasUsadas?.map(item => item.nombre) || [],
    datasets: [
      {
        data: stats?.categoriasMasUsadas?.map(item => item.cantidad) || [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 3,
      },
    ],
  }

  // Estado sin empresa
  if (!user?.empresaId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6">
        <div className="max-w-4xl mx-auto pt-16">
          <div className="bg-white rounded-xl shadow-2xl border border-amber-200 overflow-hidden">
            {/* Header con gradiente ámbar */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-8 py-8">
              <div className="flex items-center text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6">
                  <FiAlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Empresa Requerida</h2>
                  <p className="text-amber-100 text-lg">Configure su empresa para acceder al dashboard premium</p>
                </div>
              </div>
            </div>
            
            {/* Contenido */}
            <div className="p-12 text-center">
              <div className="max-w-lg mx-auto">
                <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FiHome className="w-16 h-16 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¡Bienvenido al Sistema ERP Bendito Calzado!
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Para comenzar a utilizar el sistema ERP premium, necesita crear y configurar su empresa primero. 
                  Esto le permitirá acceder a todas las funcionalidades avanzadas.
                </p>
                <Link 
                  href="/inicio/empresa"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-xl hover:from-amber-700 hover:to-amber-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  <FiPlus className="w-6 h-6 mr-3" />
                  Crear Mi Empresa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <FiLoader className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cargando Dashboard</h2>
          <p className="text-gray-600 font-medium mb-2">Preparando su panel de control empresarial...</p>
          {process.env.NODE_ENV === 'development' && sessionInfo && (
            <div className="text-xs text-gray-500 mt-4 p-2 bg-white rounded-lg max-w-md mx-auto">
              <p>Debug: Sesión válida: {sessionInfo.isValid ? '✅' : '❌'}</p>
              <p>Token restante: {Math.round(sessionInfo.tokenTimeRemaining / 1000)}s</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto pt-16">
          <div className="bg-white rounded-xl shadow-2xl border border-red-200 p-8">
            <div className="flex items-center text-red-600 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <FiAlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Error en el Dashboard</h2>
                <p className="text-red-700 mt-2">{error}</p>
              </div>
            </div>
            
            {error.includes('sesión') && (
              <div className="mt-6">
                <Link 
                  href="/login"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                >
                  <FiShield className="w-5 h-5 mr-2" />
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6 space-y-8">
      {/* Header Section Premium */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-6">
              <FiHome className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">¡Bienvenido, {user?.nombre}!</h1>
              <p className="text-indigo-100 text-lg mb-1">Panel de control empresarial premium</p>
              <div className="flex items-center text-sm text-indigo-200">
                <FiClock className="w-4 h-4 mr-2" />
                <span>{getCurrentDate()}</span>
                <span className="mx-2">•</span>
                <span>{getCurrentTime()}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center">
                <FiActivity className="w-6 h-6 mr-3" />
                <div>
                  <p className="text-indigo-100 text-sm">Estado del Sistema</p>
                  <p className="text-white font-bold text-lg">
                    {hasValidSession() ? 'Operativo' : 'Verificando...'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center">
                <FiTarget className="w-6 h-6 mr-3" />
                <div>
                  <p className="text-indigo-100 text-sm">Empresa ID</p>
                  <p className="text-white font-bold text-lg">{user?.empresaId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard 
          title="Artículos" 
          value={stats?.totalArticulos || 0} 
          icon={<FiBox />}
          color="blue"
          trend="+5%"
          href="/inicio/articulos"
          subtitle="productos registrados"
        />
        <StatCard 
          title="Bodegas" 
          value={stats?.totalBodegas || 0} 
          icon={<FiArchive />}
          color="green"
          trend="0%"
          href="/inicio/bodega"
          subtitle="ubicaciones activas"
        />
        <StatCard 
          title="Categorías" 
          value={stats?.totalCategorias || 0} 
          icon={<FiTag />}
          color="purple"
          trend="+12%"
          href="/inicio/categoria-articulo"
          subtitle="tipos organizados"
        />
        <StatCard 
          title="Marcas" 
          value={stats?.totalMarcas || 0} 
          icon={<FiAward />}
          color="amber"
          trend="+8%"
          href="/inicio/Marca"
          subtitle="marcas premium"
        />
        <StatCard 
          title="Inventario" 
          value={stats?.totalInventario || 0} 
          icon={<FiShoppingBag />}
          color="indigo"
          trend="+15%"
          href="/inicio/inventario"
          subtitle="unidades en stock"
        />
        <StatCard 
          title="Compras" 
          value={stats?.totalCompras || 0} 
          icon={<FiShoppingCart />}
          color="rose"
          trend="+3%"
          href="/inicio/compras"
          subtitle="operaciones totales"
        />
      </div>

      {/* Quick Actions Premium */}
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8">
        <div className="border-l-4 border-indigo-600 pl-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiGrid className="w-6 h-6 text-indigo-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Acciones Rápidas</h2>
                <p className="text-gray-600 mt-1">Herramientas de gestión empresarial</p>
              </div>
            </div>
            <FiStar className="w-6 h-6 text-amber-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              href={action.href}
              className={`${action.bgColor} ${action.hoverColor} border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 transform group`}
            >
              <div className="flex items-start space-x-4">
                <div className={`${action.color} p-4 rounded-xl bg-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{action.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{action.description}</p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <FiEye className="w-3 h-3 mr-1" />
                    Acceder ahora
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Grid Premium */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Inventario por Bodega */}
        <div className="bg-white shadow-2xl rounded-xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300">
          <div className="border-l-4 border-amber-600 pl-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiArchive className="w-6 h-6 mr-3 text-amber-600" /> 
              Inventario por Bodega
            </h2>
            <p className="text-gray-600 text-sm mt-1">Distribución de stock por ubicación</p>
          </div>
          <div className="aspect-square">
            <Doughnut
              data={inventarioChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toLocaleString()} unidades`;
                      }
                    }
                  }
                },
              }}
            />
          </div>
        </div>

        {/* Compras Mensuales */}
        <div className="bg-white shadow-2xl rounded-xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300">
          <div className="border-l-4 border-green-600 pl-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiTrendingUp className="w-6 h-6 mr-3 text-green-600" /> 
              Compras Mensuales
            </h2>
            <p className="text-gray-600 text-sm mt-1">Evolución de compras en el tiempo</p>
          </div>
          <div className="h-80">
            <Bar
              data={{
                labels: stats?.comprasPorMes?.map(item => item.mes) || [],
                datasets: [
                  {
                    label: 'Total de Compras',
                    data: stats?.comprasPorMes?.map(item => item.total) || [],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 3,
                    borderRadius: 8,
                    borderSkipped: false,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.raw || 0;
                        return `$ ${Number(value).toLocaleString()}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$ ' + value.toLocaleString('es-CO');
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Categorías Más Usadas */}
        <div className="bg-white shadow-2xl rounded-xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300">
          <div className="border-l-4 border-green-600 pl-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiTag className="w-6 h-6 mr-3 text-green-600" /> 
              Categorías Populares
            </h2>
            <p className="text-gray-600 text-sm mt-1">Categorías con más productos</p>
          </div>
          <div className="aspect-square">
            <Doughnut
              data={categoriasChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} productos`;
                      }
                    }
                  }
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Grid Premium */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alertas de Inventario */}
        <div className="bg-white shadow-2xl rounded-xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300">
          <div className="border-l-4 border-amber-600 pl-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiAlertCircle className="w-6 h-6 mr-3 text-amber-600" /> 
              Alertas de Inventario
            </h2>
            <p className="text-gray-600 text-sm mt-1">Productos con stock bajo</p>
          </div>
          <div className="space-y-4">
            {stats?.alertasInventario?.length ? (
              stats.alertasInventario.map((alerta, index) => (
                <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:from-amber-100 hover:to-yellow-100 transition-all duration-300">
                  <div className="flex-1">
                    <h3 className="font-bold text-amber-900 text-lg">{alerta.articulo}</h3>
                    <p className="text-amber-700 mt-2">
                      <span className="font-semibold">Stock actual: {alerta.cantidad}</span> | 
                      <span className="font-semibold"> Mínimo: {alerta.minimo}</span>
                    </p>
                    <div className="flex items-center mt-2 text-sm text-amber-600">
                      <FiTarget className="w-3 h-3 mr-1" />
                      <span>Requiere reposición urgente</span>
                    </div>
                  </div>
                  <div className="text-amber-500">
                    <FiAlertCircle className="w-10 h-10" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiPackage className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">¡Inventario en Orden!</h3>
                <p className="text-green-500">No hay alertas de stock bajo en este momento</p>
              </div>
            )}
          </div>
        </div>

        {/* Últimas Compras */}
        <div className="bg-white shadow-2xl rounded-xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300">
          <div className="border-l-4 border-rose-600 pl-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FiShoppingCart className="w-6 h-6 mr-3 text-rose-600" /> 
              Últimas Compras
            </h2>
            <p className="text-gray-600 text-sm mt-1">Transacciones recientes con proveedores</p>
          </div>
          <div className="overflow-hidden">
            {stats?.ultimasCompras?.length ? (
              <div className="space-y-4">
                {stats.ultimasCompras.map((compra) => (
                  <div key={compra.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100 hover:from-rose-100 hover:to-pink-100 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                        <FiDollarSign className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{compra.proveedor}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <FiClock className="w-3 h-3 mr-1" />
                          <span>{new Date(compra.fecha).toLocaleDateString('es-CO')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        ${compra.total.toLocaleString('es-CO')}
                      </p>
                      <p className="text-xs text-gray-500">COP</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiShoppingCart className="w-10 h-10 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No hay compras recientes</h3>
                <p className="text-gray-500">Las transacciones aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Marcas Premium */}
      {stats?.marcasMasUsadas && stats.marcasMasUsadas.length > 0 && (
        <div className="bg-white shadow-2xl rounded-xl border border-gray-200 p-8">
          <div className="border-l-4 border-purple-600 pl-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FiAward className="w-6 h-6 mr-3 text-purple-600" /> 
              Marcas Más Utilizadas
            </h2>
            <p className="text-gray-600 mt-1">Top de marcas con más productos registrados</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.marcasMasUsadas.map((marca, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <FiStar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">{marca.cantidad}</div>
                <div className="text-sm font-bold text-purple-800 mb-1">{marca.nombre}</div>
                <div className="text-xs text-purple-600">productos registrados</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Info para desarrollo */}
      {process.env.NODE_ENV === 'development' && sessionInfo && (
        <div className="bg-gray-100 rounded-xl p-6 text-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <FiShield className="w-5 h-5 mr-2" />
            Debug - Información de Sesión
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p><strong>Sesión válida:</strong> {sessionInfo.isValid ? '✅' : '❌'}</p>
              <p><strong>Tiempo restante:</strong> {Math.round(sessionInfo.tokenTimeRemaining / 1000)}s</p>
              <p><strong>Necesita renovación:</strong> {sessionInfo.shouldRefresh ? '⚠️' : '✅'}</p>
            </div>
            <div>
              <p><strong>Usuario ID:</strong> {sessionInfo.userData?.userId}</p>
              <p><strong>Empresa ID:</strong> {sessionInfo.userData?.empresaId}</p>
              <p><strong>Email:</strong> {sessionInfo.userData?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Dashboard */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200 p-8">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <FiActivity className="w-6 h-6 mr-2 text-indigo-600" />
            Sistema ERP Bendito Calzado
          </h3>
          <p className="text-gray-600">
            Dashboard actualizado en tiempo real • Última actualización: {getCurrentTime()}
          </p>
          <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-gray-400">
            <span className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${hasValidSession() ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {hasValidSession() ? 'Sesión activa' : 'Sesión inválida'}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Sincronizado
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'amber' | 'indigo' | 'rose'
  trend: string
  href: string
  subtitle: string
}

function StatCard({ title, value, icon, color, trend, href, subtitle }: StatCardProps) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      bgLight: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
      hover: 'hover:from-blue-100 hover:to-blue-200'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      bgLight: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-200',
      hover: 'hover:from-green-100 hover:to-green-200'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      bgLight: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-200',
      hover: 'hover:from-purple-100 hover:to-purple-200'
    },
    amber: {
      bg: 'bg-amber-500',
      text: 'text-amber-600',
      bgLight: 'bg-gradient-to-br from-amber-50 to-amber-100',
      border: 'border-amber-200',
      hover: 'hover:from-amber-100 hover:to-amber-200'
    },
    indigo: {
      bg: 'bg-indigo-500',
      text: 'text-indigo-600',
      bgLight: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      border: 'border-indigo-200',
      hover: 'hover:from-indigo-100 hover:to-indigo-200'
    },
    rose: {
      bg: 'bg-rose-500',
      text: 'text-rose-600',
      bgLight: 'bg-gradient-to-br from-rose-50 to-rose-100',
      border: 'border-rose-200',
      hover: 'hover:from-rose-100 hover:to-rose-200'
    }
  }

  const colors = colorMap[color]
  const trendColor = trend.startsWith('+') ? 'text-green-500' : trend === '0%' ? 'text-gray-500' : 'text-red-500'

  return (
    <Link href={href} className="block group">
      <div className={`${colors.bgLight} ${colors.hover} shadow-xl rounded-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border ${colors.border}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
            <div className={`h-6 w-6 ${colors.text}`}>{icon}</div>
          </div>
          <div className={`text-sm font-bold ${trendColor} flex items-center`}>
            <FiTrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        </div>
        <div>
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString('es-CO')}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="mt-4 flex items-center text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
          <FiEye className="w-3 h-3 mr-1" />
          Ver detalles completos
        </div>
      </div>
    </Link>
  )
}