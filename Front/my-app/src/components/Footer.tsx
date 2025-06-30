"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiInstagram, FiFacebook, FiLinkedin, FiZap, FiArrowUp } from 'react-icons/fi'

export default function Footer() {
  const [year, setYear] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    setYear(new Date().getFullYear().toString())
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const empresa = {
    nombre: 'EL SISTEMA ERP',
    descripcion: 'El sistema ERP más completo para la industria del calzado. Gestiona tu negocio de manera inteligente y eficiente.',
    email: 'contacto@elsistemasc.com',
    telefono: '+57 (1) 234-5678',
    direccion: 'Bogotá, Colombia'
  }

  const enlaces = {
    producto: [
      { nombre: 'Características', href: '/#caracteristicas' },
      { nombre: 'Precios', href: '/#precios' },
      { nombre: 'Demo', href: '/demo' },
      { nombre: 'Integraciones', href: '/integraciones' }
    ],
    empresa: [
      { nombre: 'Acerca de', href: '/acerca' },
      { nombre: 'Blog', href: '/blog' },
      { nombre: 'Carreras', href: '/carreras' },
      { nombre: 'Contacto', href: '/contacto' }
    ],
    soporte: [
      { nombre: 'Centro de Ayuda', href: '/ayuda' },
      { nombre: 'Documentación', href: '/docs' },
      { nombre: 'API', href: '/api' },
      { nombre: 'Estado del Sistema', href: '/estado' }
    ],
    legal: [
      { nombre: 'Privacidad', href: '/privacidad' },
      { nombre: 'Términos', href: '/terminos' },
      { nombre: 'Cookies', href: '/cookies' },
      { nombre: 'GDPR', href: '/gdpr' }
    ]
  }

  const redesSociales = [
    { nombre: 'Twitter', href: 'https://twitter.com/elsistemasc', icon: FiTwitter },
    { nombre: 'Instagram', href: 'https://instagram.com/elsistemasc', icon: FiInstagram },
    { nombre: 'Facebook', href: 'https://facebook.com/elsistemasc', icon: FiFacebook },
    { nombre: 'LinkedIn', href: 'https://linkedin.com/company/elsistemasc', icon: FiLinkedin }
  ]

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgo8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')]"></div>
        </div>

        <div className="relative">
          {/* Newsletter Section */}
          <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Mantente actualizado
                </h3>
                <p className="text-blue-200 mb-8">
                  Recibe las últimas noticias, tips y actualizaciones de nuestro sistema ERP
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                    Suscribirse
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
              {/* Información de la empresa */}
              <div className="lg:col-span-2">
                <Link href="/" className="flex items-center space-x-3 mb-6 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <FiZap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">
                      {empresa.nombre}
                    </div>
                    <div className="text-blue-300 text-sm">Sistema ERP</div>
                  </div>
                </Link>
                
                <p className="text-blue-200 mb-6 leading-relaxed">
                  {empresa.descripcion}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-blue-200">
                    <FiMail className="w-5 h-5 mr-3 text-blue-400" />
                    <a href={`mailto:${empresa.email}`} className="hover:text-white transition-colors">
                      {empresa.email}
                    </a>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <FiPhone className="w-5 h-5 mr-3 text-blue-400" />
                    <a href={`tel:${empresa.telefono}`} className="hover:text-white transition-colors">
                      {empresa.telefono}
                    </a>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <FiMapPin className="w-5 h-5 mr-3 text-blue-400" />
                    <span>{empresa.direccion}</span>
                  </div>
                </div>
              </div>

              {/* Enlaces del Producto */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">Producto</h4>
                <ul className="space-y-3">
                  {enlaces.producto.map((enlace, index) => (
                    <li key={index}>
                      <Link 
                        href={enlace.href} 
                        className="text-blue-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                      >
                        {enlace.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enlaces de la Empresa */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">Empresa</h4>
                <ul className="space-y-3">
                  {enlaces.empresa.map((enlace, index) => (
                    <li key={index}>
                      <Link 
                        href={enlace.href} 
                        className="text-blue-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                      >
                        {enlace.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enlaces de Soporte */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">Soporte</h4>
                <ul className="space-y-3">
                  {enlaces.soporte.map((enlace, index) => (
                    <li key={index}>
                      <Link 
                        href={enlace.href} 
                        className="text-blue-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                      >
                        {enlace.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enlaces Legales */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">Legal</h4>
                <ul className="space-y-3">
                  {enlaces.legal.map((enlace, index) => (
                    <li key={index}>
                      <Link 
                        href={enlace.href} 
                        className="text-blue-200 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                      >
                        {enlace.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 bg-black/20">
            <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <p className="text-blue-200 text-sm">
                    {year && (
                      <>© {year} {empresa.nombre}. Todos los derechos reservados.</>
                    )}
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    Hecho con ❤️ en Colombia
                  </p>
                </div>

                {/* Redes Sociales */}
                <div className="flex items-center space-x-4">
                  <span className="text-blue-200 text-sm mr-2">Síguenos:</span>
                  {redesSociales.map((red, index) => (
                    <a
                      key={index}
                      href={red.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                      title={red.nombre}
                    >
                      <red.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 animate-bounce"
          title="Volver arriba"
        >
          <FiArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  )
}