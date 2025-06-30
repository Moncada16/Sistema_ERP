'use client'

import { useState } from 'react'
import { FiUser, FiCreditCard, FiMapPin, FiPhone, FiMail, FiSave, FiX, FiCheck, FiAlertCircle, FiTruck, FiInfo } from 'react-icons/fi'
import api from '@/app/lib/api'

interface Props {
  onClose: () => void
  onCreated: () => void
}

export default function CrearProveedor({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({ 
    nombre: '', 
    nit: '', 
    direccion: '', 
    telefono: '', 
    email: '' 
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validaciones básicas
    if (!form.nombre.trim()) {
      setError('El nombre del proveedor es requerido')
      setLoading(false)
      return
    }

    if (!form.nit.trim()) {
      setError('El NIT del proveedor es requerido')
      setLoading(false)
      return
    }

    try {
      await api.post('/proveedores', {
        nombre: form.nombre.trim(),
        nit: form.nit.trim(),
        direccion: form.direccion.trim() || null,
        telefono: form.telefono.trim() || null,
        email: form.email.trim() || null
      })
      
      setSuccess('Proveedor creado exitosamente')
      
      // Esperar un momento para mostrar el mensaje de éxito
      setTimeout(() => {
        onCreated()
        onClose()
      }, 1000)
    } catch (error: any) {
      console.error('Error al crear proveedor:', error)
      setError(error.response?.data?.error || 'Error al crear el proveedor')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('')
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <FiAlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900">Error</h4>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <FiCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900">Éxito</h4>
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <div className="space-y-6">
          <div className="border-l-4 border-indigo-600 pl-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <FiUser className="w-5 h-5 mr-2 text-indigo-600" />
              Información Básica
            </h3>
            <p className="text-gray-600 text-sm mt-1">Datos principales del proveedor</p>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <FiUser className="inline w-4 h-4 mr-2 text-indigo-600" />
              Nombre del Proveedor
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Distribuidora Nacional S.A.S, Nike Colombia..."
              value={form.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                error && !form.nombre.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
              disabled={loading}
              maxLength={100}
            />
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <FiInfo className="w-4 h-4 mr-1" />
              Nombre completo de la empresa proveedora
            </div>
          </div>

          {/* NIT */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <FiCreditCard className="inline w-4 h-4 mr-2 text-indigo-600" />
              NIT / Documento
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="123456789-1"
              value={form.nit}
              onChange={(e) => handleInputChange('nit', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md font-mono ${
                error && !form.nit.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
              disabled={loading}
            />
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <FiInfo className="w-4 h-4 mr-1" />
              Número de identificación tributaria
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="space-y-6">
          <div className="border-l-4 border-green-600 pl-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <FiPhone className="w-5 h-5 mr-2 text-green-600" />
              Información de Contacto
            </h3>
            <p className="text-gray-600 text-sm mt-1">Datos opcionales para comunicación</p>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <FiMapPin className="inline w-4 h-4 mr-2 text-green-600" />
              Dirección Comercial
            </label>
            <input
              type="text"
              placeholder="Calle 123 #45-67, Ciudad, Departamento"
              value={form.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FiPhone className="inline w-4 h-4 mr-2 text-green-600" />
                Teléfono
              </label>
              <input
                type="text"
                placeholder="+57 300 123 4567"
                value={form.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <FiMail className="inline w-4 h-4 mr-2 text-green-600" />
                Email Corporativo
              </label>
              <input
                type="email"
                placeholder="contacto@proveedor.com"
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Vista previa */}
        {(form.nombre.trim() || form.nit.trim()) && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
            <h4 className="font-bold text-indigo-900 mb-4 flex items-center">
              <FiTruck className="w-5 h-5 mr-2" />
              Vista Previa del Proveedor
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {form.nombre.trim() && (
                <div className="bg-white rounded-lg p-3 border border-indigo-100">
                  <span className="text-sm text-gray-600 font-medium">Nombre:</span>
                  <p className="text-gray-900 font-semibold">{form.nombre}</p>
                </div>
              )}
              {form.nit.trim() && (
                <div className="bg-white rounded-lg p-3 border border-indigo-100">
                  <span className="text-sm text-gray-600 font-medium">NIT:</span>
                  <p className="text-gray-900 font-mono font-semibold">{form.nit}</p>
                </div>
              )}
              {form.direccion.trim() && (
                <div className="bg-white rounded-lg p-3 border border-indigo-100 md:col-span-2">
                  <span className="text-sm text-gray-600 font-medium">Dirección:</span>
                  <p className="text-gray-900 font-semibold">{form.direccion}</p>
                </div>
              )}
              {form.telefono.trim() && (
                <div className="bg-white rounded-lg p-3 border border-indigo-100">
                  <span className="text-sm text-gray-600 font-medium">Teléfono:</span>
                  <p className="text-gray-900 font-semibold">{form.telefono}</p>
                </div>
              )}
              {form.email.trim() && (
                <div className="bg-white rounded-lg p-3 border border-indigo-100">
                  <span className="text-sm text-gray-600 font-medium">Email:</span>
                  <p className="text-gray-900 font-semibold">{form.email}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información importante */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-4 flex items-center">
            <FiInfo className="w-5 h-5 mr-2" />
            Información Importante
          </h4>
          <ul className="text-amber-800 text-sm space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Los campos marcados con (*) son obligatorios para registrar el proveedor
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              El NIT debe ser válido y único en el sistema
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              La información puede ser editada posteriormente
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Los datos de contacto son útiles para gestionar compras
            </li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <FiX className="w-5 h-5 mr-2" />
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading || !form.nombre.trim() || !form.nit.trim()}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Creando proveedor...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5 mr-2" />
                Crear Proveedor
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}