  'use client'

  import { useState } from 'react'
  import { useRouter } from 'next/navigation'
  import api from '../app/lib/api'
  import { useAuth } from '../app/context/AuthContext'

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

    const [formData, setFormData] = useState({
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: ''
    })

    const [fieldErrors, setFieldErrors] = useState<FieldError>({})
    const [isLoading, setIsLoading] = useState(false)
    const [generalError, setGeneralError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
      // Limpiar errores al escribir
      setFieldErrors(prev => ({ ...prev, [name]: null }))
      setGeneralError('')
    }

    const validateForm = (): boolean => {
      const errors: FieldError = {}
      
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
      } else if (formData.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres'
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Debe confirmar la contraseña'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden'
      }

      setFieldErrors(errors)
      return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setGeneralError('')
      setFieldErrors({})
      
      if (!validateForm()) {
        return
      }

      setIsLoading(true)

      try {
        // Preparar datos para el registro
        const registerData: RegisterFormData = {
          nombre: formData.nombre.trim(),
          email: formData.email.toLowerCase().trim(),
          telefono: formData.telefono.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword 
        }

        console.log("Enviando datos de registro:", registerData);

        // Intentar registro
const response = await api.post('/auth/register', registerData)
        
        console.log("Respuesta del servidor:", response.data);
        
        if (!response.data?.token || !response.data?.user) {
          throw new Error('Respuesta inválida del servidor')
        }

        const { token, user } = response.data

        // Iniciar sesión con los datos del usuario
        login(token,user)
        
        router.push('/inicio')
      } catch (error) {
        console.error('Error de registro completo:', error)

    }
  }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Crear Cuenta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Complete el formulario para registrarse
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {generalError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{generalError}</h3>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="nombre" className="sr-only">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    fieldErrors.nombre ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Nombre completo"
                />
                {fieldErrors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.nombre}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Correo electrónico"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="telefono" className="sr-only">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    fieldErrors.telefono ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Teléfono"
                />
                {fieldErrors.telefono && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.telefono}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    fieldErrors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Contraseña"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Confirmar Contraseña"
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
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
          </form>

          <p className="mt-2 text-center text-sm text-gray-600">
            Al registrarte, se creará automáticamente tu empresa y bodega principal
          </p>
        </div>
      </div>
    )
  }