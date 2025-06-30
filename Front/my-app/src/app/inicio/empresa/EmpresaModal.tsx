'use client'

import { useEffect, useState } from 'react'
import { FiHome, FiSave, FiX, FiCheck, FiAlertCircle, FiMapPin, FiPhone, FiMail, FiCreditCard, FiGlobe, FiInfo } from 'react-icons/fi'
import { Empresa } from './EmpresaDTO'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: Empresa) => void
  initialData?: Empresa
}

const defaultForm: Empresa = {
  nombre: '',
  nit: '',
  direccion: '',
  ciudad: '',
  telefono: '',
  email: '',
  moneda: 'COP',
  zonaHoraria: 'America/Bogota'
}

export default function EmpresaModal({ open, onClose, onSubmit, initialData }: Props) {
  const [form, setForm] = useState<Empresa>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
    } else {
      setForm(defaultForm)
    }
    setErrors({})
    setCurrentStep(1)
  }, [initialData, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      // Paso 1: Información básica
      if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
      if (!form.nit.trim()) newErrors.nit = 'El NIT es requerido'
      if (!form.direccion.trim()) newErrors.direccion = 'La dirección es requerida'
      if (!form.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida'
    } else if (step === 2) {
      // Paso 2: Contacto
      if (!form.email.trim()) newErrors.email = 'El email es requerido'
      if (!form.telefono.trim()) newErrors.telefono = 'El teléfono es requerido'
      
      // Validaciones específicas
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = 'Email inválido'
      }
      if (form.telefono && !/^\+?[\d\s-]{10,}$/.test(form.telefono)) {
        newErrors.telefono = 'Teléfono inválido'
      }
    } else if (step === 3) {
      // Paso 3: Configuración
      if (!form.moneda.trim()) newErrors.moneda = 'La moneda es requerida'
      if (!form.zonaHoraria.trim()) newErrors.zonaHoraria = 'La zona horaria es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar todos los pasos
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setCurrentStep(1) // Volver al primer paso con errores
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(form)
      onClose()
    } catch (error) {
      console.error('❌ Sistema SC - Error en modal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setForm(defaultForm)
    setErrors({})
    setCurrentStep(1)
    onClose()
  }

  const ciudadesComunes = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
    'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto',
    'Manizales', 'Neiva', 'Villavicencio', 'Armenia'
  ]

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <FiHome className="w-8 h-8 mr-4" />
              <div>
                <h2 className="text-2xl font-bold">
                  {initialData ? 'Editar Empresa' : 'Configurar Empresa'}
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  {initialData 
                    ? 'Modifica la información de tu empresa' 
                    : 'Paso ' + currentStep + ' de ' + totalSteps + ' - Configura tu empresa en el Sistema SC'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-white hover:text-purple-200 transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Progress bar */}
          {!initialData && (
            <div className="mt-6">
              <div className="bg-purple-800/30 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-purple-100">
                <span className={currentStep >= 1 ? 'font-bold' : ''}>Información Básica</span>
                <span className={currentStep >= 2 ? 'font-bold' : ''}>Contacto</span>
                <span className={currentStep >= 3 ? 'font-bold' : ''}>Configuración</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Paso 1: Información Básica */}
            {(currentStep === 1 || initialData) && (
              <div className="space-y-6">
                <div className="flex items-center text-purple-600 mb-4">
                  <FiHome className="w-6 h-6 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Información Básica</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la empresa *
                    </label>
                    <div className="relative">
                      <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Bendito Calzado S.A.S"
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.nombre ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                        maxLength={100}
                      />
                    </div>
                    {errors.nombre && (
                      <div className="flex items-center mt-1 text-red-600">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        <p className="text-xs">{errors.nombre}</p>
                      </div>
                    )}
                  </div>

                  {/* NIT */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIT *
                    </label>
                    <div className="relative">
                      <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="nit"
                        value={form.nit}
                        onChange={handleChange}
                        placeholder="123456789-1"
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.nit ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                        maxLength={20}
                      />
                    </div>
                    {errors.nit && (
                      <div className="flex items-center mt-1 text-red-600">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        <p className="text-xs">{errors.nit}</p>
                      </div>
                    )}
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        name="ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none ${
                          errors.ciudad ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Seleccionar ciudad</option>
                        {ciudadesComunes.map((ciudad) => (
                          <option key={ciudad} value={ciudad}>{ciudad}</option>
                        ))}
                      </select>
                    </div>
                    {errors.ciudad && (
                      <div className="flex items-center mt-1 text-red-600">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        <p className="text-xs">{errors.ciudad}</p>
                      </div>
                    )}
                  </div>

                  {/* Dirección */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        placeholder="Calle 123 #45-67, Barrio Centro"
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.direccion ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                        maxLength={150}
                      />
                    </div>
                    {errors.direccion && (
                      <div className="flex items-center mt-1 text-red-600">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        <p className="text-xs">{errors.direccion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2: Información de Contacto */}
            {(currentStep === 2 || initialData) && (
              <div className="space-y-6">
                <div className="flex items-center text-purple-600 mb-4">
                  <FiPhone className="w-6 h-6 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Información de Contacto</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email corporativo *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="contacto@empresa.com"
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                        maxLength={100}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center mt-1 text-red-600">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        <p className="text-xs">{errors.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        placeholder="+57 300 123 4567"
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.telefono ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                        maxLength={20}
                      />
                    </div>
                    {errors.telefono && (
                      <div className="flex items-center mt-1 text-red-600">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        <p className="text-xs">{errors.telefono}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Configuración Regional */}
            {(currentStep === 3 || initialData) && (
              <div className="space-y-6">
                <div className="flex items-center text-purple-600 mb-4">
                  <FiGlobe className="w-6 h-6 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Configuración Regional</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Moneda */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moneda *
                    </label>
                    <div className="relative">
                      <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        name="moneda"
                        value={form.moneda}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none ${
                          errors.moneda ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Seleccionar moneda</option>
                        <option value="COP">🇨🇴 Peso Colombiano (COP)</option>
                        <option value="USD">💵 Dólar Americano (USD)</option>
                        <option value="EUR">💶 Euro (EUR)</option>
                      </select>
                    </div>
                    {errors.moneda && (
                      <div className="flex items-center mt-1 text-red-600">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        <p className="text-xs">{errors.moneda}</p>
                      </div>
                    )}
                  </div>

                  {/* Zona Horaria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zona horaria *
                    </label>
                    <div className="relative">
                      <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        name="zonaHoraria"
                        value={form.zonaHoraria}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none ${
                          errors.zonaHoraria ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Seleccionar zona horaria</option>
                        <option value="America/Bogota">🇨🇴 Bogotá (GMT-5)</option>
                        <option value="America/New_York">🗽 Nueva York (GMT-4)</option>
                        <option value="Europe/Madrid">🇪🇸 Madrid (GMT+2)</option>
                        <option value="America/Mexico_City">🇲🇽 Ciudad de México (GMT-6)</option>
                      </select>
                    </div>
                    {errors.zonaHoraria && (
                      <div className="flex items-center mt-1 text-red-600">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        <p className="text-xs">{errors.zonaHoraria}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vista previa final */}
                {form.nombre.trim() && form.nit.trim() && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-4 flex items-center">
                      <FiCheck className="w-5 h-5 mr-2" />
                      Resumen de la Empresa
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-purple-700 font-medium">Empresa:</span>
                          <span className="font-bold text-purple-900">{form.nombre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700 font-medium">NIT:</span>
                          <span className="font-mono text-purple-900">{form.nit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700 font-medium">Ciudad:</span>
                          <span className="text-purple-900">{form.ciudad || 'Por definir'}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-purple-700 font-medium">Email:</span>
                          <span className="text-purple-900">{form.email || 'Por definir'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700 font-medium">Teléfono:</span>
                          <span className="text-purple-900">{form.telefono || 'Por definir'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700 font-medium">Moneda:</span>
                          <span className="text-purple-900">{form.moneda || 'Por definir'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Información importante */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <FiInfo className="w-5 h-5 mr-2" />
                Información Importante
              </h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Todos los campos marcados con (*) son obligatorios
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  La información puede ser modificada posteriormente
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {initialData 
                    ? 'Los cambios se aplicarán inmediatamente' 
                    : 'Al crear la empresa tendrás acceso completo al Sistema SC'
                  }
                </li>
              </ul>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              {!initialData && currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
              )}
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiX className="w-5 h-5 mr-2 inline" />
                Cancelar
              </button>
              
              {!initialData && currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl font-medium transform hover:scale-105"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5 mr-2" />
                      {initialData ? 'Guardar Cambios' : 'Crear Empresa'}
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}