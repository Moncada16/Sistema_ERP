  'use client'

  import { useState } from 'react'
  import { useRouter } from 'next/navigation'
  import api from '../app/lib/api'
  import { useAuth } from '../app/context/AuthContext'
import { ValidationError } from 'next/dist/compiled/amphtml-validator'

  interface RegisterFormData {
    nombre: string
    email: string
    telefono: string
    password: string
    confirmPassword: string // Añadido este campo a la interfaz
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
      // setValidationErrors(prev => ({
      //   ...prev,
      //   [name]: undefined
      // }))
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete el formulario para registrarse
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                getFieldError('nombre') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingresa tu nombre completo"
            />
            {getFieldError('nombre') && (
              <div className="mt-1 text-sm text-red-600">
                {getFieldError('nombre')}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                getFieldError('email') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="correo@ejemplo.com"
            />
            {getFieldError('email') && (
              <div className="mt-1 text-sm text-red-600">
                {getFieldError('email')}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                getFieldError('telefono') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="3001234567"
            />
            {getFieldError('telefono') && (
              <div className="mt-1 text-sm text-red-600">
                {getFieldError('telefono')}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border px-3 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  getFieldError('password') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L7.05 7.05M9.878 9.878a3 3 0 105.304-.304m0 0a3 3 0 105.304-.304M15.182 15.182L21.95 21.95" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            {getFieldError('password') && (
              <div className="mt-1 text-sm text-red-600">
                {getFieldError('password')}
              </div>
            )}
            
            {/* Indicadores de validación de contraseña */}
            {formData.password && (
              <div className="mt-2 text-sm space-y-1">
                <div className="font-medium text-gray-700">Requisitos de contraseña:</div>
                <div className={`flex items-center gap-2 ${passwordValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{passwordValidation.length ? '✅' : '❌'}</span>
                  Al menos 8 caracteres
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{passwordValidation.uppercase ? '✅' : '❌'}</span>
                  Al menos una mayúscula
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{passwordValidation.lowercase ? '✅' : '❌'}</span>
                  Al menos una minúscula
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.number ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{passwordValidation.number ? '✅' : '❌'}</span>
                  Al menos un número
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.special ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{passwordValidation.special ? '✅' : '❌'}</span>
                  Al menos un carácter especial
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full border px-3 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  getFieldError('confirmPassword') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirma tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L7.05 7.05M9.878 9.878a3 3 0 105.304-.304m0 0a3 3 0 105.304-.304M15.182 15.182L21.95 21.95" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            {getFieldError('confirmPassword') && (
              <div className="mt-1 text-sm text-red-600">
                {getFieldError('confirmPassword')}
              </div>
            )}
            
            {/* Indicador de coincidencia de contraseñas */}
            {formData.confirmPassword && (
              <div className={`mt-1 text-sm flex items-center gap-2 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                <span>{passwordsMatch ? '✅' : '❌'}</span>
                {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !isPasswordValid || !passwordsMatch}
            className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              loading || !isPasswordValid || !passwordsMatch
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            } transition-colors`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creando cuenta...
              </span>
            ) : (
              'Crear Cuenta'
            )}
          </button>
          
        </div>
        

        {/* Ejemplo de contraseña válida */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <div className="font-medium text-gray-700 mb-1">Ejemplo de contraseña válida:</div>
          <div className="text-gray-600 font-mono">MiContraseña123!</div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Al registrarte, se creará automáticamente tu empresa y bodega principal
        </p>

        {/* Demo: Prueba con test@error.com para ver errores del servidor */}
        <div className="mt-4 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <strong>Demo:</strong> Usa el email "test@error.com" para simular errores del servidor
        </div>
      </div>
    </div>
  )
}