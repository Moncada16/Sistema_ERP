// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuración de rutas del Sistema SC
const ROUTE_CONFIG = {
  // Rutas públicas (accesibles sin autenticación)
  public: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/auth/login',
    '/api/auth/register'
  ],

  // Rutas que requieren autenticación
  protected: [
    '/inicio',
    '/articulos', 
    '/bodegas',
    '/inventario',
    '/compras',
    '/categoria-articulo',
    '/marcas',
    '/tipos-variante',
    '/proveedores',
    '/empresa',
    '/profile'
  ],

  // Rutas que requieren empresa configurada
  requireCompany: [
    '/inicio',
    '/articulos',
    '/bodegas', 
    '/inventario',
    '/compras',
    '/categoria-articulo',
    '/marcas',
    '/tipos-variante',
    '/proveedores'
  ],

  // Rutas de configuración inicial
  setup: [
    '/empresa/crear',
    '/empresa/editar'
  ]
}

// Función simple para decodificar JWT (sin verificación de firma)
function decodeJWT(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    const decoded = JSON.parse(
      Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    )
    
    // Verificar expiración
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      console.log('⚠️ Sistema SC - Token expirado')
      return null
    }
    
    return decoded
  } catch (error) {
    console.error('❌ Sistema SC - Error decodificando token:', error)
    return null
  }
}

// Función para verificar si la ruta coincide con algún patrón
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    if (route === pathname) return true
    if (route.endsWith('*')) {
      const baseRoute = route.slice(0, -1)
      return pathname.startsWith(baseRoute)
    }
    return pathname.startsWith(route)
  })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Logs para debugging (solo en development)
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Sistema SC - Middleware: ${pathname}`)
  }

  // Obtener token de cookies o headers
  const tokenFromCookie = request.cookies.get('token')?.value
  const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '')
  const token = tokenFromCookie || tokenFromHeader

  // Verificar si es ruta pública
  if (matchesRoute(pathname, ROUTE_CONFIG.public)) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Sistema SC - Ruta pública permitida: ${pathname}`)
    }
    return NextResponse.next()
  }

  // Verificar si es ruta protegida
  if (matchesRoute(pathname, ROUTE_CONFIG.protected)) {
    if (!token) {
      console.log(`🔒 Sistema SC - Sin token, redirigiendo a login desde: ${pathname}`)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Decodificar y verificar token
    const payload = decodeJWT(token)
    if (!payload || !payload.userId) {
      console.log(`❌ Sistema SC - Token inválido, redirigiendo a login`)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('token')
      return response
    }

    // Verificar si la ruta requiere empresa
    if (matchesRoute(pathname, ROUTE_CONFIG.requireCompany)) {
      const empresaId = payload.empresaId
      
      if (!empresaId) {
        console.log(`🏢 Sistema SC - Sin empresa, redirigiendo a crear empresa`)
        const empresaUrl = new URL('/empresa/crear', request.url)
        return NextResponse.redirect(empresaUrl)
      }
    }

    // Verificar rutas de setup cuando ya tiene empresa
    if (matchesRoute(pathname, ROUTE_CONFIG.setup)) {
      const empresaId = payload.empresaId
      
      if (empresaId && pathname === '/empresa/crear') {
        console.log(`✅ Sistema SC - Usuario ya tiene empresa, redirigiendo a inicio`)
        return NextResponse.redirect(new URL('/inicio', request.url))
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Sistema SC - Acceso autorizado a: ${pathname}`)
    }
    
    // Agregar headers con información del usuario para el servidor
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', String(payload.userId))
    requestHeaders.set('x-empresa-id', String(payload.empresaId || ''))
    requestHeaders.set('x-user-role', String(payload.rol || 'usuario'))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Ruta no configurada, permitir por defecto pero loggear
  if (process.env.NODE_ENV === 'development') {
    console.log(`⚠️ Sistema SC - Ruta no configurada: ${pathname}`)
  }
  return NextResponse.next()
}

// Configuración mejorada del matcher
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas del Sistema SC excepto:
     * - api routes de autenticación
     * - archivos estáticos de Next.js
     * - archivos de imágenes y assets
     * - favicon y otros archivos públicos
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}