'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'
import { useAuth } from '@/app/context/AuthContext'
import BodegaModal from '@/app/bodega/BodegaModal'

type Bodega = {
  id: number
  nombre: string
  direccion: string
}

export default function BodegaPage() {
  const { user, isLoading } = useAuth()
  const [bodegas, setBodegas] = useState<Bodega[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modo, setModo] = useState<'crear' | 'editar'>('crear')
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<Bodega | null>(null)
  const [error, setError] = useState('')

  const obtenerBodegas = async () => {
    try {
      const res = await api.get('/bodegas')
      setBodegas(res.data)
    } catch {
      setError('❌ NO TIENES BODEGAS CREA UNA.')
    }
  }

  useEffect(() => {
    if (user?.empresaId) {
      obtenerBodegas()
    }
  }, [user])

  const handleCrear = () => {
    setModo('crear')
    setBodegaSeleccionada(null)
    setModalAbierto(true)
  }

  const handleEditar = (bodega: Bodega) => {
    setModo('editar')
    setBodegaSeleccionada(bodega)
    setModalAbierto(true)
  }

  const handleEliminar = async (id: number) => {
    try {
      await api.delete(`/bodegas/${id}`)
      obtenerBodegas()
    } catch {
      setError('❌ Error al eliminar bodega')
    }
  }

  const handleGuardar = async (data: Partial<Bodega>, id?: number) => {
    try {
      if (modo === 'crear') {
        await api.post('/bodegas', data)
      } else if (id) {
        await api.put(`/bodegas/${id}`, data)
      }
      setModalAbierto(false)
      obtenerBodegas()
    } catch {
      setError('❌ Error al guardar bodega')
    }
  }

  if (isLoading) {
    return (
      <main className="p-6 text-center text-gray-600">
        🔄 Cargando sesión...
      </main>
    )
  }

  if (!user?.empresaId) {
    return (
      <main className="p-6 text-center text-red-600">
        ⚠️ Debes tener una empresa registrada para gestionar bodegas.
      </main>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🏬 Mis Bodegas</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleCrear}
        className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition"
      >
        ➕ Crear Bodega
      </button>

      <div className="border rounded-md overflow-hidden shadow-sm">
        <table className="w-full text-sm text-gray-800 bg-white">
          <thead className="bg-gray-100 border-b text-gray-700">
            <tr>
              <th className="p-3 text-left font-medium">Nombre</th>
              <th className="p-3 text-left font-medium">Dirección</th>
              <th className="p-3 text-left font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bodegas.map((bodega) => (
              <tr
                key={bodega.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{bodega.nombre}</td>
                <td className="p-3">{bodega.direccion}</td>
                <td className="p-3 flex gap-3 flex-wrap">
                  <button
                    onClick={() => handleEditar(bodega)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(bodega.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <BodegaModal
          open={modalAbierto}
          modo={modo}
          initialData={bodegaSeleccionada ?? undefined}
          onClose={() => setModalAbierto(false)}
          onSubmit={handleGuardar}
        />
      )}
    </div>
  )
}
