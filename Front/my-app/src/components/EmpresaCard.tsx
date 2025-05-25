'use client'
import api from '@/app/lib/api'
import { useRouter } from 'next/navigation'

type Props = {
  id: number
  nombre: string
  direccion: string
  telefono: string
  onDelete: () => void
  
}

export default function EmpresaCard({ id, nombre, direccion, telefono, onDelete }: Props) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/empresas/editar/${id}`)
  }

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
      try {
        await api.delete(`/empresas/${id}`)
        onDelete() // Actualiza el estado desde la página padre
      } catch (error) {
        console.error('❌ Error al eliminar empresa:', error)
        alert('❌ Error al eliminar empresa')
      }
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow border space-y-2">
      <h3 className="text-lg font-semibold">{nombre}</h3>
      <p className="text-sm text-gray-600">📍 {direccion}</p>
      <p className="text-sm text-gray-600">📞 {telefono}</p>
      <div className="flex gap-4 mt-2">
        <button
          onClick={handleEdit}
          className="text-blue-600 hover:underline text-sm"
        >
          ✏️ Editar
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:underline text-sm"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  )
}
