'use client'

import { useEffect, useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/app/lib/api'

interface UserProfile {
  id: number
  nombre: string
  email: string
  telefono?: string
  photo : string
  createdAt: string
  img: string
}

export default function PerfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    api.get('/users/me/info')
      .then(res => setUser(res.data))
      .catch(() => router.replace('/login'))
  }, [router])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return
    const formData = new FormData()
    formData.append('imagen', selectedFile)
    setUploading(true)

    try {
      const res = await api.post(`/usuarios/fotos/usuario/foto/${user.id}`, formData)
      setUser(prev => prev ? { ...prev, img: res.data.img } : prev)
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch {
      alert('Error al subir la foto')
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen text-lg text-gray-700">Cargando perfil...</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 text-gray-800">
      <h1 className="text-3xl font-bold text-center">Perfil de Usuario</h1>

      {/* Foto de perfil */}
      <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 flex flex-col items-center space-y-4">
        <div className="relative group">
          <Image
            src={previewUrl || user.img || '/default-avatar.png'}
            alt="Foto de perfil"
            width={100}
            height={100}
            className="rounded-full border-2 border-gray-300 object-cover"
            
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
          />
        </div>

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {uploading ? 'Subiendo...' : 'Guardar nueva foto'}
          </button>
        )}
      </div>

      {/* Info del perfil */}
      <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 space-y-4">
        <p><span className="font-semibold text-gray-700">Nombre:</span> {user.nombre}</p>
        <p><span className="font-semibold text-gray-700">Correo:</span> {user.email}</p>
        {user.telefono && <p><span className="font-semibold text-gray-700">Teléfono:</span> {user.telefono}</p>}
        <p><span className="font-semibold text-gray-700">Cuenta creada:</span> {new Date(user.createdAt).toLocaleString('es-CO')}</p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => router.push('/inicio/perfil/editar')}
        >
          Editar perfil
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          onClick={() => router.push('/inicio/cambiar-contrasena')}
        >
          Cambiar contraseña
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          onClick={() => {
            localStorage.removeItem('token')
            router.replace('/login')
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
