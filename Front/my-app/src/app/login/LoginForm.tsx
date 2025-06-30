'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiShield, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      console.log('🔄 Iniciando proceso de login...')
      console.log('📤 Enviando datos:', { email: formData.email, password: '***' })
      
      const res = await api.post('/auth/login', formData)
      console.log('📥 Respuesta del servidor:', res.data)
      console.log('📊 Status de respuesta:', res.status)

      // Verificar estructura de respuesta
      if (!res.data) {
        console.error('❌ No hay data en la respuesta')
        throw new Error('No se recibió respuesta del servidor')
      }

      // Extraer datos con diferentes posibles estructuras
      const accessToken = res.data.token || res.data.accessToken || res.data.access_token
      const rawUser = res.data.user || res.data.usuario || res.data.data?.user

      console.log('🔍 Token extraído:', accessToken ? '✅ Presente' : '❌ Ausente')
      console.log('👤 Usuario extraído:', rawUser ? '✅ Presente' : '❌ Ausente')

      if (!accessToken) {
        console.error('❌ Token no encontrado en:', Object.keys(res.data))
        throw new Error('Token de acceso no recibido')
      }

      if (!rawUser) {
        console.error('❌ Usuario no encontrado en:', Object.keys(res.data))
        throw new Error('Datos de usuario no recibidos')
      }

      // Construir objeto de usuario con validaciones
      const user = {
        userId: rawUser.id || rawUser.userId || rawUser.user_id,
        empresaId: rawUser.empresaId || rawUser.empresa_id || null,
        nombre: rawUser.nombre || rawUser.name || rawUser.username || '',
        email: rawUser.email || formData.email,
        photoURL: rawUser.img || rawUser.photo || rawUser.avatar || null,
        // Propiedades requeridas por la interface User
        photo: rawUser.photo || rawUser.img || rawUser.avatar || '',
        img: rawUser.img || rawUser.photo || rawUser.avatar || undefined,
        rol: rawUser.rol || rawUser.role || 'usuario'
      }

      console.log('✅ Usuario procesado:', user)
      console.log('🔐 Ejecutando login en contexto...')

      setSuccess('Autenticación exitosa')

      // Ejecutar login y capturar posibles errores del contexto
      try {
        // Pasar el objeto user completo, no solo el nombre
        await login(accessToken, user)
        console.log('✅ Login en contexto exitoso')
        
        setTimeout(() => {
          const redirectPath = user.empresaId ? '/inicio' : '/empresa/crear'
          console.log('🔄 Redirigiendo a:', redirectPath)
          router.push(redirectPath)
        }, 800)
        
      } catch (contextError) {
        console.error('❌ Error en contexto de autenticación:', contextError)
        throw new Error('Error al establecer sesión: ' + (contextError as Error).message)
      }

    } catch (err: any) {
      console.error('💥 Error completo en login:', err)
      console.error('🔍 Tipo de error:', typeof err)
      console.error('📝 Stack trace:', err.stack)
      
      let errorMessage = 'Error de autenticación'

      // Error de respuesta HTTP
      if (err.response) {
        const { status, data } = err.response
        console.error('🌐 Error HTTP:', { status, data })

        switch (status) {
          case 400:
            errorMessage = 'Datos inválidos - Verifica email y contraseña'
            break
          case 401:
            errorMessage = 'Credenciales incorrectas - Email o contraseña incorrectos'
            break
          case 403:
            errorMessage = 'Acceso denegado - Cuenta desactivada'
            break
          case 404:
            errorMessage = 'Usuario no encontrado - Verifica tu email'
            break
          case 500:
            errorMessage = 'Error del servidor - Inténtalo más tarde'
            break
          default:
            errorMessage = data?.message || `Error HTTP ${status}`
        }
      } 
      // Error de red/conexión
      else if (err.request) {
        console.error('🌐 Error de red:', err.request)
        errorMessage = 'Sin conexión al servidor - Verifica tu internet'
      } 
      // Error de procesamiento local
      else if (err.message) {
        console.error('⚙️ Error de procesamiento:', err.message)
        
        if (err.message.includes('Token')) {
          errorMessage = 'Error de token - Respuesta del servidor inválida'
        } else if (err.message.includes('usuario') || err.message.includes('Usuario')) {
          errorMessage = 'Error de datos de usuario - Respuesta incompleta'
        } else if (err.message.includes('sesión')) {
          errorMessage = 'Error al establecer sesión - Problema de autenticación'
        } else {
          errorMessage = `Error: ${err.message}`
        }
      }
      // Error desconocido
      else {
        console.error('❓ Error desconocido:', err)
        errorMessage = 'Error desconocido - Contacta al administrador'
      }

      console.error('📢 Mensaje final de error:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
      console.log('🏁 Proceso de login finalizado')
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950">
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Subtle glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Main container */}
      <div className="relative w-full max-w-sm">
        
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900/50 border border-slate-800 rounded-2xl mb-6 group hover:border-blue-500/50 transition-all duration-300">
            <FiShield className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
          </div>
          
          <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
            Bendito Calzado
          </h1>
          <p className="text-slate-400 text-sm font-light">
            Sistema ERP
          </p>
        </div>

        {/* Login form */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
          
          {/* Form header */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-light text-white mb-2">
              Iniciar Sesión
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center text-red-400">
                  <FiAlertCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-sm font-light">{error}</span>
                </div>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center text-green-400">
                  <FiCheckCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-sm font-light">{success}</span>
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-slate-300 text-sm font-light">
                Email
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/80 transition-all duration-200 font-light"
                  placeholder="tu@empresa.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-slate-300 text-sm font-light">
                Contraseña
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/80 transition-all duration-200 font-light"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors duration-200"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl py-3 px-4 font-light transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>

            {/* Forgot password */}
            <div className="text-center pt-4">
              <a 
                href="#" 
                className="text-slate-400 hover:text-blue-400 text-sm font-light transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-slate-500 text-xs font-light">
            Bendito Calzado ERP v2.0
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-slate-600 text-xs font-light">Seguro</span>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}