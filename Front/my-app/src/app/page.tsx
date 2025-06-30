'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'
import { FiArrowRight, FiUsers, FiTrendingUp, FiShield, FiStar, FiZap, FiTarget, FiBox, FiArchive, FiBarChart2, FiAward, FiShoppingCart } from 'react-icons/fi'

const reseñas = [
  {
    nombre: 'Laura García',
    foto: '/img/user1.jpg',
    cargo: 'Gerente de Ventas',
    empresa: 'Calzados Premium',
    texto: 'El Sistema SC revolucionó nuestra gestión de inventario. Ahora controlamos todo en tiempo real.',
    rating: 5
  },
  {
    nombre: 'Carlos Pérez',
    foto: '/img/user2.jpg',
    cargo: 'Director Comercial',
    empresa: 'Zapatos & Más',
    texto: 'La interfaz es muy intuitiva y fácil de usar. Lo recomiendo para cualquier empresa del sector.',
    rating: 5
  },
  {
    nombre: 'Valentina Ríos',
    foto: '/img/user3.jpg',
    cargo: 'Propietaria',
    empresa: 'Boutique Elegante',
    texto: 'Desde que usamos el sistema, nuestras ventas aumentaron 30% y tenemos mejor control.',
    rating: 5
  }
]

const caracteristicas = [
  {
    icon: FiBox,
    titulo: 'Gestión de Artículos',
    descripcion: 'Control total de productos, variantes y categorías en tiempo real',
    color: 'blue'
  },
  {
    icon: FiArchive,
    titulo: 'Control de Bodegas',
    descripcion: 'Administra múltiples ubicaciones y transfiere inventario fácilmente',
    color: 'green'
  },
  {
    icon: FiShield,
    titulo: 'Datos Seguros',
    descripcion: 'Protección avanzada para toda la información de tu negocio',
    color: 'purple'
  },
  {
    icon: FiBarChart2,
    titulo: 'Reportes Avanzados',
    descripcion: 'Análisis detallados y métricas que impulsan tu crecimiento',
    color: 'amber'
  }
]

const estadisticas = [
  { numero: '500+', texto: 'Empresas Satisfechas', icon: FiUsers },
  { numero: '99.9%', texto: 'Tiempo de Actividad', icon: FiShield },
  { numero: '24/7', texto: 'Soporte Técnico', icon: FiTarget },
  { numero: '85%', texto: 'Mejora en Eficiencia', icon: FiTrendingUp }
]

const modulos = [
  {
    titulo: 'Inventario Inteligente',
    descripcion: 'Control preciso de stock, alertas automáticas y gestión de ubicaciones múltiples.',
    icon: FiBox,
    color: 'blue'
  },
  {
    titulo: 'Gestión de Compras',
    descripcion: 'Optimiza tus compras, gestiona proveedores y controla costos eficientemente.',
    icon: FiShoppingCart,
    color: 'rose'
  },
  {
    titulo: 'Categorías y Marcas',
    descripcion: 'Organiza tu catálogo con categorías personalizadas y gestión de marcas.',
    icon: FiAward,
    color: 'purple'
  },
  {
    titulo: 'Reportes y Analytics',
    descripcion: 'Dashboards interactivos y reportes detallados para tomar mejores decisiones.',
    icon: FiBarChart2,
    color: 'amber'
  }
]

export default function Home() {
  const router = useRouter()
  const { isLoading, user } = useAuth()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/inicio')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <main className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Cargando sesión...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section Premium */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 text-white">
        {/* Elementos flotantes animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-indigo-400/20 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-1/2 right-20 w-12 h-12 bg-blue-300/20 rounded-full animate-float animation-delay-4000"></div>
          <div className="absolute bottom-1/3 left-20 w-14 h-14 bg-indigo-300/20 rounded-full animate-float animation-delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
              <FiStar className="w-4 h-4 mr-2 text-yellow-400" />
              Sistema ERP #1 para Calzado en Colombia
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Bienvenido a{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                El Sistema SC
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              El sistema ERP completo para hacer crecer tu empresa sin límites
              <br />
              <span className="text-lg text-blue-200 mt-2 block">
                Gestiona inventario, compras, categorías, marcas y mucho más desde una sola plataforma
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <button 
                onClick={() => router.push('/register')}
                className="group inline-flex items-center px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Comenzar Gratis Ahora
                <FiArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              
              <button 
                onClick={() => router.push('/login')}
                className="inline-flex items-center px-10 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-white/50"
              >
                Iniciar Sesión
              </button>
            </div>

            <div className="pt-8">
              <p className="text-blue-200 text-sm">
                ✅ Sin tarjeta de crédito • ✅ Configuración en 5 minutos • ✅ Soporte 24/7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas Premium */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Resultados que hablan por sí solos
            </h2>
            <p className="text-xl text-gray-600">
              Miles de empresas confían en nosotros para gestionar sus operaciones
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {estadisticas.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{stat.numero}</div>
                <div className="text-gray-600 font-medium text-lg">{stat.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Módulos del Sistema */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Módulos Completos para tu Negocio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Todo lo que necesitas para gestionar tu empresa de calzado de manera profesional y eficiente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {modulos.map((modulo, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${modulo.color}-500 to-${modulo.color}-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <modulo.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{modulo.titulo}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{modulo.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Por qué elegir El Sistema SC?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnología de vanguardia diseñada específicamente para la industria del calzado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {caracteristicas.map((feature, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.titulo}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios Premium */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full translate-x-48 translate-y-48"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Historias de Éxito Reales
            </h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              Empresarios exitosos que han transformado sus negocios con nuestra plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reseñas.map((resena, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {resena.nombre.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">{resena.nombre}</h4>
                    <p className="text-indigo-200 text-sm">{resena.cargo}</p>
                    <p className="text-indigo-300 text-xs">{resena.empresa}</p>
                  </div>
                </div>
                
                <div className="flex mb-6">
                  {[...Array(resena.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-indigo-100 leading-relaxed italic text-lg">
                  "{resena.texto}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Premium */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-5xl mx-auto px-6 md:px-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            ¿Listo para revolucionar tu negocio?
          </h2>
          <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Únete a cientos de empresarios que ya están creciendo exponencialmente con El Sistema SC
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
            <button 
              onClick={() => router.push('/register')}
              className="group inline-flex items-center px-12 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              Empezar Ahora - Es Gratis
              <FiArrowRight className="ml-4 w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            
            <button 
              onClick={() => router.push('/login')}
              className="inline-flex items-center px-12 py-5 border-2 border-white/30 text-white rounded-xl font-bold text-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-white/50"
            >
              Acceder al Sistema
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center text-indigo-200">
              <FiShield className="w-5 h-5 mr-2" />
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center justify-center text-indigo-200">
              <FiZap className="w-5 h-5 mr-2" />
              <span>Configuración Rápida</span>
            </div>
            <div className="flex items-center justify-center text-indigo-200">
              <FiUsers className="w-5 h-5 mr-2" />
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Estilos personalizados */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  )
}