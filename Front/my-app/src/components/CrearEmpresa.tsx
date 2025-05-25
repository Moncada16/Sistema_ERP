'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

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

      // El backend devuelve token actualizado con empresaId (si así fue implementado)
      const { token } = res.data
      if (token) {
        // Si usas tokens manuales:
        // login(token, {
        //   userId: user?.userId!,
        //   empresaId: res.data.id,
        //   rol: user?.rol!
        // })
      }

      setSuccess('✅ Empresa creada correctamente')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('❌ Error al crear empresa:', error)
      setSuccess('')
      setError('❌ Error al crear empresa. Por favor, verifica los datos ingresados.')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-500 p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-black">🏢 Registrar Empresa</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border p-2 rounded text-black" required />
        <input type="text" placeholder="NIT" value={nit} onChange={(e) => setNit(e.target.value)} className="w-full border p-2 rounded text-black" required />
        <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full border p-2 rounded text-black" required />
        <input type="text" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="w-full border p-2 rounded text-black" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded text-black" required />
        <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full border p-2 rounded text-black" required />

        <select value={moneda} onChange={(e) => setMoneda(e.target.value)} className="w-full border p-2 rounded text-black" required>
          <option value="COP">🇨🇴 Peso Colombiano (COP)</option>
          <option value="USD">💵 Dólar (USD)</option>
        </select>

        <select value={zonaHoraria} onChange={(e) => setZonaHoraria(e.target.value)} className="w-full border p-2 rounded text-black" required>
          <option value="America/Bogota">🇨🇴 Bogotá (GMT-5)</option>
          <option value="America/New_York">🗽 Nueva York (GMT-4)</option>
          <option value="Europe/Madrid">🇪🇸 Madrid (GMT+2)</option>
        </select>

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          ➕ Crear Empresa
        </button>
      </form>
    </div>
  )
}
