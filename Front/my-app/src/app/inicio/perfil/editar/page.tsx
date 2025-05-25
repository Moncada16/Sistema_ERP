'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/app/lib/api'

export default function EditarPerfilPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    api.get('/users/me/info')
      .then(res => {
        const { nombre, email, telefono } = res.data
        setNombre(nombre)
        setEmail(email)
        setTelefono(telefono || '')
        setLoading(false)
      })
      .catch(() => router.replace('/login'))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put('/users/me', { nombre, email, telefono })
      alert('Perfil actualizado correctamente')
      router.push('/inicio/perfil')
    } catch {
      alert('Error al actualizar el perfil')
    }
  }

  if (loading) return <p className="text-center mt-10">Cargando...</p>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nombre</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium">Correo</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium">Teléfono</label>
          <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar cambios</button>
      </form>
    </div>
  )
}
