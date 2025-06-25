'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/app/lib/api'

export default function CambiarContrasenaPage() {
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (nueva !== confirmar) {
      alert('Las nuevas contraseñas no coinciden')
      return
    }

    if (nueva.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    setCargando(true)
    try {
      await api.put('/users/me/password', { actual, nueva, confirmar })
      alert('Contraseña actualizada con éxito')
      router.push('/inicio/perfil')
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error)
      alert('Error al cambiar la contraseña. Intenta nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cambiar Contraseña</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Contraseña actual</label>
          <input type="password" value={actual} onChange={e => setActual(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium">Nueva contraseña</label>
          <input type="password" value={nueva} onChange={e => setNueva(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium">Confirmar nueva contraseña</label>
          <input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <button type="submit" disabled={cargando} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {cargando ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </div>
  )
}
