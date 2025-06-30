'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiUserPlus, FiShield, FiAlertCircle } from 'react-icons/fi'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { ValidationError } from 'next/dist/compiled/amphtml-validator'

interface RegisterFormData {
  nombre: string
  email: string
  telefono: string
  password: string
  confirmPassword: string
}

interface FieldError {
  [key: string]: string | null
}

export default function RegisterForm() {
  const router = useRouter()
  const { login } = useAuth()

  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<ValidationError>({})
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validar requisitos de contraseña
  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    }
  }

  const passwordValidation = validatePassword(formData.password)
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const passwordsMatch = formData.password === formData.confirmPassword

  // Validación frontend completa
  const validateForm = (): boolean => {
    const errors: ValidationError = {}
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.trim().length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres'
    }
    
    if (!formData.email) {
      errors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido'
    }
    
    if (!formData.telefono) {
      errors.telefono = 'El teléfono es requerido'
    } else if (!/^\d{8,}$/.test(formData.telefono)) {
      errors.telefono = 'El teléfono debe tener al menos 8 dígitos'
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida'
    } else if (!isPasswordValid) {
      errors.password = 'La contraseña no cumple con todos los requisitos'
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debe confirmar la contraseña'
    } else if (!passwordsMatch) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar mensajes cuando el usuario empiece a escribir
    if (error) setError('')
    if (success) setSuccess('')
    if (validationErrors[name]) {
      setValidationErrors((prev: ValidationError) => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    setValidationErrors({})
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Preparar datos para el registro
      const registerData: RegisterFormData = {
        nombre: formData.nombre.trim(),
        email: formData.email.toLowerCase().trim(),
        telefono: formData.telefono.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }

      console.log("Enviando datos de registro:", registerData)

      const response = await api.post('/auth/register', registerData)
      
      console.log("Respuesta del servidor:", response.data)
      
      if (!response.data?.token || !response.data?.user) {
        throw new Error('Respuesta inválida del servidor')
      }

      const { token, user } = response.data

      // Mostrar éxito
      setSuccess('Usuario registrado exitosamente. Redirigiendo...')
      
      // Limpiar el formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: ''
      })

      // Iniciar sesión con los datos del usuario
      login(token, user)
      
      // Redireccionar después de un breve delay
      setTimeout(() => {
        router.push('/inicio')
      }, 2000)
      
    } catch (err: any) {
      console.error('Error completo:', err)
      
      if (err.validationErrors) {
        // Errores de validación específicos del backend
        setValidationErrors(err.validationErrors)
        
        // Mostrar el primer error como mensaje general
        const firstErrorKey = Object.keys(err.validationErrors)[0]
        const firstErrorMessage = err.validationErrors[firstErrorKey]
        if (Array.isArray(firstErrorMessage)) {
          setError(firstErrorMessage[0])
        } else {
          setError(firstErrorMessage)
        }
      } else {
        // Error general
        setError(err.message || 'Error al registrar usuario')
      }
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (fieldName: string): string | undefined => {
    const error = validationErrors[fieldName]
    if (Array.isArray(error)) {
      return error[0]
    }
    return error
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl mb-6">
            <FiUserPlus className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Crear Cuenta
          </h2>
          <p className="text-lg text-gray-600">
            Únete a El Sistema SC y transforma tu negocio
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h3 className="text-xl font-bold text-white">Información Personal</h3>
            <p className="text-blue-100 mt-1">Completa todos los campos para continuar</p>
          </div>

          <div className="p-8">
            {/* Alerts */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center">
                  <FiCheck className="w-5 h-5 text-green-600 mr-3" />
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('nombre') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Juan Carlos Pérez"
                    disabled={loading}
                  />
                </div>
                {getFieldError('nombre') && (
                  <div className="flex items-center mt-2 text-red-600">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{getFieldError('nombre')}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('email') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="correo@empresa.com"
                    disabled={loading}
                  />
                </div>
                {getFieldError('email') && (
                  <div className="flex items-center mt-2 text-red-600">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{getFieldError('email')}</span>
                  </div>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono *
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('telefono') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="3001234567"
                    disabled={loading}
                  />
                </div>
                {getFieldError('telefono') && (
                  <div className="flex items-center mt-2 text-red-600">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{getFieldError('telefono')}</span>
                  </div>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('password') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Crea una contraseña segura"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                
                {getFieldError('password') && (
                  <div className="flex items-center mt-2 text-red-600">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{getFieldError('password')}</span>
                  </div>
                )}
                
                {/* Indicadores de validación de contraseña */}
                {formData.password && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="font-semibold text-gray-700 mb-3 flex items-center">
                      <FiShield className="w-4 h-4 mr-2" />
                      Requisitos de Seguridad:
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className={`flex items-center ${passwordValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.length ? <FiCheck className="w-4 h-4 mr-2" /> : <FiX className="w-4 h-4 mr-2" />}
                        Al menos 8 caracteres
                      </div>
                      <div className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.uppercase ? <FiCheck className="w-4 h-4 mr-2" /> : <FiX className="w-4 h-4 mr-2" />}
                        Al menos una mayúscula (A-Z)
                      </div>
                      <div className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.lowercase ? <FiCheck className="w-4 h-4 mr-2" /> : <FiX className="w-4 h-4 mr-2" />}
                        Al menos una minúscula (a-z)
                      </div>
                      <div className={`flex items-center ${passwordValidation.number ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.number ? <FiCheck className="w-4 h-4 mr-2" /> : <FiX className="w-4 h-4 mr-2" />}
                        Al menos un número (0-9)
                      </div>
                      <div className={`flex items-center ${passwordValidation.special ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.special ? <FiCheck className="w-4 h-4 mr-2" /> : <FiX className="w-4 h-4 mr-2" />}
                        Al menos un símbolo especial (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('confirmPassword') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Repite tu contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                
                {getFieldError('confirmPassword') && (
                  <div className="flex items-center mt-2 text-red-600">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{getFieldError('confirmPassword')}</span>
                  </div>
                )}
                
                {/* Indicador de coincidencia de contraseñas */}
                {formData.confirmPassword && (
                  <div className={`mt-2 flex items-center text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? <FiCheck className="w-4 h-4 mr-2" /> : <FiX className="w-4 h-4 mr-2" />}
                    {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                  </div>
                )}
              </div>

              {/* Ejemplo de contraseña */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="font-semibold text-blue-800 mb-2">💡 Ejemplo de contraseña válida:</div>
                <div className="text-blue-700 font-mono bg-white px-3 py-2 rounded border">MiContraseña123!</div>
              </div>

              {/* Botón de registro */}
              <button
                onClick={handleSubmit}
                disabled={loading || !isPasswordValid || !passwordsMatch}
                className={`w-full py-4 px-6 text-lg font-semibold rounded-xl transition-all duration-200 flex items-center justify-center ${
                  loading || !isPasswordValid || !passwordsMatch
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                    Creando tu cuenta...
                  </>
                ) : (
                  <>
                    <FiUserPlus className="w-6 h-6 mr-3" />
                    Crear Mi Cuenta
                  </>
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-8 space-y-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🎉 ¿Qué sucede después del registro?</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Se creará automáticamente tu empresa</li>
                  <li>• Tendrás acceso completo al sistema ERP</li>
                  <li>• Podrás gestionar bodegas, productos e inventarios</li>
                  <li>• Recibirás soporte técnico completo</li>
                </ul>
              </div>

              <p className="text-center text-sm text-gray-600">
                Al registrarte, aceptas nuestros términos de servicio y política de privacidad
              </p>

              {/* Demo info */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="font-semibold text-yellow-800 mb-1">🧪 Modo Demo:</div>
                <div className="text-yellow-700 text-sm">
                  Usa el email "test@error.com" para simular errores del servidor
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}