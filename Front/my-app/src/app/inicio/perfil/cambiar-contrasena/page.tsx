'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/app/lib/api'
import { 
  FiLock, 
  FiSave, 
  FiArrowLeft, 
  FiLoader,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiKey
} from 'react-icons/fi'

export default function CambiarContrasenaPage() {
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [cargando, setCargando] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const validatePassword = (password: string): string[] => {
    const issues = []
    if (password.length < 6) issues.push('Mínimo 6 caracteres')
    if (!/[A-Z]/.test(password)) issues.push('Una mayúscula')
    if (!/[a-z]/.test(password)) issues.push('Una minúscula')
    if (!/[0-9]/.test(password)) issues.push('Un número')
    return issues
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!actual.trim()) {
      newErrors.actual = 'La contraseña actual es requerida'
    }

    if (!nueva.trim()) {
      newErrors.nueva = 'La nueva contraseña es requerida'
    } else {
      const issues = validatePassword(nueva)
      if (issues.length > 0) {
        newErrors.nueva = `Faltan: ${issues.join(', ')}`
      }
    }

    if (!confirmar.trim()) {
      newErrors.confirmar = 'Confirma la nueva contraseña'
    } else if (nueva !== confirmar) {
      newErrors.confirmar = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'actual':
        setActual(value)
        break
      case 'nueva':
        setNueva(value)
        break
      case 'confirmar':
        setConfirmar(value)
        break
    }

    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const toggleShowPassword = (field: 'actual' | 'nueva' | 'confirmar') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setCargando(true)
    try {
      await api.put('/users/me/password', { actual, nueva, confirmar })
      alert('✅ Contraseña actualizada con éxito')
      router.push('/inicio/perfil')
    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error)
      const errorMessage = error.response?.data?.message || 'Error al cambiar la contraseña'
      alert(`❌ ${errorMessage}`)
    } finally {
      setCargando(false)
    }
  }

  const getPasswordStrength = (password: string): { level: number, text: string, color: string } => {
    const issues = validatePassword(password)
    if (password.length === 0) return { level: 0, text: 'Sin contraseña', color: 'gray' }
    if (issues.length === 0) return { level: 4, text: 'Muy segura', color: 'green' }
    if (issues.length === 1) return { level: 3, text: 'Segura', color: 'blue' }
    if (issues.length === 2) return { level: 2, text: 'Media', color: 'yellow' }
    return { level: 1, text: 'Débil', color: 'red' }
  }

  const passwordStrength = getPasswordStrength(nueva)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header con gradiente verde para seguridad */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-t-xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Cambiar Contraseña</h1>
                <p className="text-green-100">
                  Actualiza tu contraseña para mantener tu cuenta segura
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/inicio/perfil')}
              className="p-3 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Formulario premium */}
        <div className="bg-white rounded-b-xl shadow-2xl p-8">
          <div className="border-l-4 border-green-600 pl-4 mb-8">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <FiKey className="w-5 h-5 mr-2 text-green-600" />
              Seguridad de la Cuenta
            </h2>
            <p className="text-gray-600 text-sm mt-1">Modifica tu contraseña de acceso</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Contraseña actual */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FiLock className="inline w-4 h-4 mr-2 text-green-600" />
                Contraseña Actual
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.actual ? 'text' : 'password'}
                  value={actual}
                  onChange={(e) => handleChange('actual', e.target.value)}
                  placeholder="Escribe tu contraseña actual"
                  className={`w-full pl-4 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                    errors.actual 
                      ? 'border-red-300 bg-red-50' 
                      : actual.trim() 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300'
                  }`}
                  disabled={cargando}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('actual')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.actual ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.actual && (
                <div className="flex items-center mt-2 text-red-600">
                  <FiAlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{errors.actual}</span>
                </div>
              )}
            </div>

            {/* Nueva contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FiShield className="inline w-4 h-4 mr-2 text-blue-600" />
                Nueva Contraseña
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.nueva ? 'text' : 'password'}
                  value={nueva}
                  onChange={(e) => handleChange('nueva', e.target.value)}
                  placeholder="Escribe tu nueva contraseña"
                  className={`w-full pl-4 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                    errors.nueva 
                      ? 'border-red-300 bg-red-50' 
                      : nueva.trim() && validatePassword(nueva).length === 0
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300'
                  }`}
                  disabled={cargando}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('nueva')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.nueva ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Medidor de fortaleza de contraseña */}
              {nueva && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Fortaleza:</span>
                    <span className={`text-sm font-bold text-${passwordStrength.color}-600`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
                      style={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {errors.nueva && (
                <div className="flex items-center mt-2 text-red-600">
                  <FiAlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{errors.nueva}</span>
                </div>
              )}
              
              {nueva.trim() && validatePassword(nueva).length === 0 && !errors.nueva && (
                <div className="flex items-center mt-2 text-green-600">
                  <FiCheck className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Contraseña segura</span>
                </div>
              )}
            </div>

            {/* Confirmar nueva contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FiCheck className="inline w-4 h-4 mr-2 text-blue-600" />
                Confirmar Nueva Contraseña
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmar ? 'text' : 'password'}
                  value={confirmar}
                  onChange={(e) => handleChange('confirmar', e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  className={`w-full pl-4 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                    errors.confirmar 
                      ? 'border-red-300 bg-red-50' 
                      : confirmar.trim() && nueva === confirmar
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300'
                  }`}
                  disabled={cargando}
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('confirmar')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirmar ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmar && (
                <div className="flex items-center mt-2 text-red-600">
                  <FiAlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{errors.confirmar}</span>
                </div>
              )}
              {confirmar.trim() && nueva === confirmar && !errors.confirmar && (
                <div className="flex items-center mt-2 text-green-600">
                  <FiCheck className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Las contraseñas coinciden</span>
                </div>
              )}
            </div>

            {/* Requisitos de seguridad */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                <FiInfo className="w-5 h-5 mr-2" />
                Requisitos de Seguridad
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { req: 'Mínimo 6 caracteres', met: nueva.length >= 6 },
                  { req: 'Una letra mayúscula', met: /[A-Z]/.test(nueva) },
                  { req: 'Una letra minúscula', met: /[a-z]/.test(nueva) },
                  { req: 'Un número', met: /[0-9]/.test(nueva) }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center p-3 rounded-lg ${
                    item.met ? 'bg-green-100 border border-green-200' : 'bg-gray-100 border border-gray-200'
                  }`}>
                    {item.met ? (
                      <FiCheck className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-full mr-2" />
                    )}
                    <span className={`text-sm font-medium ${
                      item.met ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {item.req}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Consejos de seguridad */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center">
                <FiShield className="w-5 h-5 mr-2" />
                Consejos de Seguridad
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Usa una combinación única de letras, números y símbolos
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Evita usar información personal como fechas de nacimiento
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  No reutilices contraseñas de otras cuentas
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Cambia tu contraseña regularmente para mayor seguridad
                </li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/inicio/perfil')}
                disabled={cargando}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={cargando}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {cargando ? (
                  <>
                    <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                    Cambiando contraseña...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5 mr-2" />
                    Cambiar Contraseña
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}