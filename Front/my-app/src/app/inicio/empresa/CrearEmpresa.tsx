'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiHome, FiMapPin, FiPhone, FiMail, FiCreditCard, FiGlobe, FiCheck, FiAlertCircle, FiSave } from 'react-icons/fi'
import api from '@/app/lib/api'

export default function CrearEmpresa() {
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [nit, setNit] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [moneda, setMoneda] = useState('COP')
  const [zonaHoraria, setZonaHoraria] = useState('America/Bogota')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await api.post('/empresa', {
        nombre,
        nit,
        direccion,
        ciudad,
        telefono,
        email,
        moneda,
        zonaHoraria,
      })

      const { token } = res.data
      if (token) {
        // Si usas tokens manuales, aquí puedes actualizar el contexto
      }

      setSuccess('✅ Empresa creada correctamente')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('❌ Error al crear empresa:', error)
      setError('❌ Error al crear empresa. Por favor, verifica los datos ingresados.')
    } finally {
      setLoading(false)
    }
  }

  const ciudadesComunes = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 
    'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl mb-6">
            <FiHome className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Registrar Empresa
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Configura la información de tu empresa para comenzar a usar el sistema ERP
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <FiCheck className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-xl font-bold text-white">Información de la Empresa</h2>
            <p className="text-blue-100 mt-1">Completa todos los campos requeridos</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Empresa *
                </label>
                <div className="relative">
                  <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Ej: El Sistema SC"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* NIT */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NIT / Documento *
                </label>
                <div className="relative">
                  <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="123456789-1"
                    value={nit}
                    onChange={(e) => setNit(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ciudad *
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    required
                  >
                    <option value="">Selecciona una ciudad</option>
                    {ciudadesComunes.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                    <option value="otra">Otra ciudad</option>
                  </select>
                </div>
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección *
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Ej: Calle 123 #45-67, Barrio Centro"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Corporativo *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="contacto@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono *
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="+57 300 123 4567"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Moneda */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Moneda Principal
                </label>
                <div className="relative">
                  <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={moneda}
                    onChange={(e) => setMoneda(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    required
                  >
                    <option value="COP">🇨🇴 Peso Colombiano (COP)</option>
                    <option value="USD">💵 Dólar Americano (USD)</option>
                    <option value="EUR">💶 Euro (EUR)</option>
                  </select>
                </div>
              </div>

              {/* Zona Horaria */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Zona Horaria
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={zonaHoraria}
                    onChange={(e) => setZonaHoraria(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    required
                  >
                    <option value="America/Bogota">🇨🇴 Bogotá (GMT-5)</option>
                    <option value="America/New_York">🗽 Nueva York (GMT-4)</option>
                    <option value="Europe/Madrid">🇪🇸 Madrid (GMT+2)</option>
                    <option value="America/Mexico_City">🇲🇽 Ciudad de México (GMT-6)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3">📋 Información Importante</h3>
              <ul className="text-blue-800 text-sm space-y-2">
                <li className="flex items-center">
                  <FiCheck className="w-4 h-4 mr-2 text-blue-600" />
                  Todos los campos marcados con (*) son obligatorios
                </li>
                <li className="flex items-center">
                  <FiCheck className="w-4 h-4 mr-2 text-blue-600" />
                  La información puede ser modificada posteriormente
                </li>
                <li className="flex items-center">
                  <FiCheck className="w-4 h-4 mr-2 text-blue-600" />
                  El NIT debe ser válido según la DIAN
                </li>
              </ul>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                  Creando empresa...
                </>
              ) : (
                <>
                  <FiSave className="w-6 h-6 mr-3" />
                  Crear Empresa
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer informativo */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            ¿Necesitas ayuda? Contacta nuestro soporte técnico
          </p>
        </div>
      </div>
    </div>
  )
}