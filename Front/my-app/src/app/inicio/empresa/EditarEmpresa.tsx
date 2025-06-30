'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiHome, FiMapPin, FiPhone, FiMail, FiCreditCard, FiGlobe, FiCheck, FiAlertCircle, FiSave, FiTrash2, FiEdit3, FiArrowLeft } from 'react-icons/fi'
import api from '@/app/lib/api'

export default function EditarMiEmpresaPage() {
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [email, setEmail] = useState('')
  const [nit, setNit] = useState('')
  const [moneda, setMoneda] = useState('COP')
  const [zonaHoraria, setZonaHoraria] = useState('America/Bogota')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchMiEmpresa = async () => {
      try {
        setLoading(true)
        const res = await api.get('/empresas/mia')
        const empresa = res.data

        setNombre(empresa.nombre || '')
        setDireccion(empresa.direccion || '')
        setTelefono(empresa.telefono || '')
        setCiudad(empresa.ciudad || '')
        setEmail(empresa.email || '')
        setNit(empresa.nit || '')
        setMoneda(empresa.moneda || 'COP')
        setZonaHoraria(empresa.zonaHoraria || 'America/Bogota')
      } catch (error) {
        console.error('❌ Error al cargar empresa:', error)
        setError('Error al cargar la información de la empresa')
      } finally {
        setLoading(false)
      }
    }

    fetchMiEmpresa()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await api.put('/empresas/mia', {
        nombre,
        direccion,
        telefono,
        ciudad,
        email,
        nit,
        moneda,
        zonaHoraria,
      })

      setSuccess('✅ Empresa actualizada correctamente')
      setTimeout(() => {
        router.push('/inicio/empresa')
      }, 2000)
    } catch (err: any) {
      console.error('❌ Error al actualizar empresa:', err)
      setError(err.response?.data?.error || 'Error al actualizar la empresa')
    } finally {
      setSaving(false)
    }
  }

  const handleEliminar = async () => {
    if (!confirm('⚠️ ¿Estás seguro de eliminar tu empresa? Esta acción eliminará TODOS los datos y no se puede deshacer.')) return

    setDeleting(true)
    try {
      await api.delete('/empresas/mia')
      alert('Empresa eliminada correctamente.')
      router.push('/login')
    } catch (error: any) {
      console.error('❌ Error al eliminar empresa:', error)
      setError(error.response?.data?.error || 'Error al eliminar la empresa')
    } finally {
      setDeleting(false)
    }
  }

  const ciudadesComunes = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 
    'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Cargando información de la empresa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiEdit3 className="w-10 h-10 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Editar Mi Empresa</h1>
                <p className="mt-2 text-purple-100">
                  Modifica la información de tu empresa y configuraciones del sistema
                </p>
              </div>
            </div>
            
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </button>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Información de la Empresa</h2>
                <p className="text-gray-600 text-sm mt-1">Actualiza los datos principales de tu empresa</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                        placeholder="Nombre de tu empresa"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                        disabled={saving}
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                        disabled={saving}
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                        required
                        disabled={saving}
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
                        placeholder="Dirección completa"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                        disabled={saving}
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                        disabled={saving}
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                        disabled={saving}
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                        required
                        disabled={saving}
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                        required
                        disabled={saving}
                      >
                        <option value="America/Bogota">🇨🇴 Bogotá (GMT-5)</option>
                        <option value="America/New_York">🗽 Nueva York (GMT-4)</option>
                        <option value="Europe/Madrid">🇪🇸 Madrid (GMT+2)</option>
                        <option value="America/Mexico_City">🇲🇽 Ciudad de México (GMT-6)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-5 h-5 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Información actual */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FiHome className="w-5 h-5 mr-2 text-purple-600" />
                Información Actual
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Empresa:</span>
                  <span className="font-medium text-gray-900">{nombre || 'Sin definir'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NIT:</span>
                  <span className="font-mono text-gray-900">{nit || 'Sin definir'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ciudad:</span>
                  <span className="text-gray-900">{ciudad || 'Sin definir'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Moneda:</span>
                  <span className="text-gray-900">{moneda}</span>
                </div>
              </div>
            </div>

            {/* Zona de peligro */}
            <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6">
              <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center">
                <FiTrash2 className="w-5 h-5 mr-2 text-red-600" />
                Zona de Peligro
              </h3>
              <p className="text-red-700 text-sm mb-4">
                Eliminar la empresa borrará permanentemente todos los datos, incluyendo artículos, inventarios, compras y configuraciones.
              </p>
              <button
                type="button"
                onClick={handleEliminar}
                disabled={deleting}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-5 h-5 mr-2" />
                    Eliminar Empresa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}