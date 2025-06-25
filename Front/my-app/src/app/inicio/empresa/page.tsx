'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'
import EmpresaModal from '@/app/empresa/EmpresaModal'
import { Empresa } from '@/app/empresa/EmpresaDTO'


export default function EmpresaPage() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modo, setModo] = useState<'crear' | 'editar'>('crear')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await api.get('/mi-empresa')
        if (res.data && res.data.id) {
          setEmpresa(res.data)
        } else {
          setEmpresa(null)
        }
      } catch (Error) {
        console.error('❌ Error al obtener empresa:', Error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmpresa()
  }, [])

  const handleSubmit = async (data: Empresa) => {
    setError('')
    try {
      if (modo === 'editar' && !data.id) {
        setError('No hay empresa para editar.')
        return
      }

      const res = modo === 'crear'
        ? await api.post('/mi-empresa', data)
        : await api.put('/mi-empresa', data)

      setEmpresa(res.data)

      // if (modo === 'crear') {
      //   try {
      //     // const refreshRes = await api.get('/users/refresh')
      //     // const newToken = refreshRes.data.token

      //     // // Si usas tokens manuales:
      //     // // login(newToken, {
      //     // //   userId: user?.userId!,
      //     // //   empresaId: res.data.id,
      //     // //   rol: user?.rol!
      //     // // })
      //   } catch {
      //     console.warn('⚠️ No se pudo refrescar token después de crear empresa.')
      //   }
      // }

      setModalOpen(false)
    } catch (error) {
      console.error('❌ Error desde backend:', error)
      setError( 'Error al guardar empresa')
    }
  }

  if (loading) {
    return <p className="p-6">Cargando empresa...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Empresa</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {empresa ? (
        <div className="bg-gray-400 text-black p-6 border rounded shadow max-w-xl space-y-2">
          <p><strong>Nombre:</strong> {empresa.nombre}</p>
          <p><strong>NIT:</strong> {empresa.nit}</p>
          <p><strong>Dirección:</strong> {empresa.direccion}</p>
          <p><strong>Ciudad:</strong> {empresa.ciudad}</p>
          <p><strong>Email:</strong> {empresa.email}</p>
          <p><strong>Teléfono:</strong> {empresa.telefono}</p>
          <p><strong>Moneda:</strong> {empresa.moneda}</p>
          <p><strong>Zona Horaria:</strong> {empresa.zonaHoraria}</p>

          <button
            onClick={() => {
              setModo('editar')
              setModalOpen(true)
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            ✏️ Editar Empresa
          </button>
        </div>
      ) : (
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">No tienes empresa registrada aún.</p>
          <button
            onClick={() => {
              setModo('crear')
              setModalOpen(true)
            }}
            className="bg-black text-white px-4 py-2 rounded"
          >
            ➕ Crear Empresa
          </button>
        </div>
      )}

      <EmpresaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={modo === 'editar' && empresa ? empresa : undefined}
      />
    </div>
  )
}
