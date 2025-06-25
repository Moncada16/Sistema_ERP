// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Define qué rutas proteges:
  const protectedPaths = ['/inicio', '/articulos', '/bodega', '/inventario', '/compras']
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtected && !token) {
    // Si entra a ruta protegida y no hay token, redirige a login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Aplica el middleware solo a esas rutas
export const config = {
  matcher: ['/inicio/:path*', '/articulos/:path*', '/bodega/:path*', '/inventario/:path*', '/compras/:path*'],
}
