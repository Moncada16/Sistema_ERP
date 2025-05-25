'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

  useEffect(() => {
    const fetchMiEmpresa = async () => {
      try {
        const res = await api.get('/empresas/mia')
        const empresa = res.data

        setNombre(empresa.nombre)
        setDireccion(empresa.direccion)
        setTelefono(empresa.telefono)
        setCiudad(empresa.ciudad)
        setEmail(empresa.email)
        setNit(empresa.nit)
        setMoneda(empresa.moneda || 'COP')
        setZonaHoraria(empresa.zonaHoraria || 'America/Bogota')
      } catch (error) {
        console.error('❌ Error al cargar empresa:', error)
        setError('Error al cargar empresa: ')
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

      setSuccess('✅ Empresa actualizada correctamente.')
      setTimeout(() => {
        router.push('/empresas/ver')
      }, 1500)
    } catch (err) {
      console.error('❌ Error al actualizar empresa:', err)
      setError( 'Error al actualizar empresa')
    }
  }

  const handleEliminar = async () => {
    if (!confirm('⚠️ ¿Estás seguro de eliminar tu empresa? Esta acción no se puede deshacer.')) return

    try {
      await api.delete('/empresas/mia')
      alert('Empresa eliminada correctamente.')
      router.push('/empresas/ver')
    } catch (error) {
      console.error('❌ Error al eliminar empresa:', error)
      setError('Error al eliminar empresa: ')
    }
  }

  if (loading) return <p className="p-6">Cargando empresa...</p>

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">✏️ Editar Mi Empresa</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="text" placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
        <input type="text" placeholder="NIT" value={nit} onChange={(e) => setNit(e.target.value)} className="w-full border p-2 rounded" required />

        {/* Select moneda */}
        <select value={moneda} onChange={(e) => setMoneda(e.target.value)} className="w-full border p-2 rounded text-black" required>
          <option value="COP">🇨🇴 Peso Colombiano (COP)</option>
          <option value="USD">💵 Dólar Estadounidense (USD)</option>
        </select>

        {/* Select zona horaria */}
        <select value={zonaHoraria} onChange={(e) => setZonaHoraria(e.target.value)} className="w-full border p-2 rounded text-black" required>
          <option value="America/Bogota">🇨🇴 Bogotá (GMT-5)</option>
          <option value="America/New_York">🗽 Nueva York (GMT-4)</option>
          <option value="Europe/Madrid">🇪🇸 Madrid (GMT+2)</option>
        </select>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            ✅ Guardar Cambios
          </button>
          <button type="button" onClick={handleEliminar} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            ❌ Eliminar Empresa
          </button>
        </div>
      </form>
    </div>
  )
}
