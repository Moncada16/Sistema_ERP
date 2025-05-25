'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'
import type { TipoVariante } from '../../tipos-variante/typedto'
import CrearTipoVariante from '@/components/CrearTipoVariante'
import EditarTipoVariante from '@/components/EditarTipoVariante'
import EliminarTipoVariante from '@/components/EliminarTipoVariante'
import CrearValorVariante from '@/components/CrearValorVariante'
import ModalInteractivo from '@/components/ModalInteractivo'

export default function TiposVariantePage() {
  const [tipos, setTipos] = useState<TipoVariante[]>([])
  const [editando, setEditando] = useState<TipoVariante | null>(null)
  const [eliminando, setEliminando] = useState<TipoVariante | null>(null)
  const [creandoValor, setCreandoValor] = useState<TipoVariante | null>(null)
  const [mostrarCrear, setMostrarCrear] = useState(false)

  const cargarTipos = async () => {
    const res = await api.get('/tipos-variante')
    setTipos(res.data)
  }

  useEffect(() => {
    cargarTipos()
  }, [])

  return (
    <section className="p-6 max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-black">🎯 Tipos de Variante</h1>
        <button
          onClick={() => {
            setMostrarCrear(true)
            setEditando(null)
          }}
          className="bg-black text-white px-5 py-2 rounded hover:opacity-90 transition"
        >
          ➕ Nuevo Tipo
        </button>
      </header>

      <div className="space-y-4">
        {tipos.map((tipo) => ( 
          <div
            key={tipo.id}
            className="border border-gray-300 rounded-xl p-4 bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-black">{tipo.nombre}</h2>
                <p className="text-gray-700 mt-1">
                  <span className="font-medium">Valores:</span>{' '}
                  {tipo.valores.length
                    ? tipo.valores.map((v) => v.nombre).join(', ')
                    : '—'}
                </p>
              </div>
              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => setEditando(tipo)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => setCreandoValor(tipo)}
                  className="text-green-600 hover:underline text-sm"
                >
                  ➕ Valor
                </button>
                <button
                  onClick={() => setEliminando(tipo)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModalInteractivo
        isOpen={mostrarCrear}
        title="➕ Crear Tipo de Variante"
        onClose={() => setMostrarCrear(false)}
      >
        <CrearTipoVariante
          onClose={() => setMostrarCrear(false)}
          onCreated={cargarTipos}
        />
      </ModalInteractivo>

      <ModalInteractivo
        isOpen={!!editando}
        title="✏️ Editar Tipo de Variante"
        onClose={() => setEditando(null)}
      >
        {editando && (
          <EditarTipoVariante
            tipo={editando}
            onClose={() => setEditando(null)}
            onUpdated={cargarTipos}
          />
        )}
      </ModalInteractivo>

      <ModalInteractivo
        isOpen={!!eliminando}
        title="🗑️ Eliminar Tipo de Variante"
        onClose={() => setEliminando(null)}
      >
        {eliminando && (
          <EliminarTipoVariante
            tipo={eliminando}
            onClose={() => setEliminando(null)}
            onDeleted={cargarTipos}
          />
        )}
      </ModalInteractivo>

      <ModalInteractivo
        isOpen={!!creandoValor}
        title="➕ Agregar Valor a Tipo"
        onClose={() => setCreandoValor(null)}
      >
        {creandoValor && (
          <CrearValorVariante
            tipo={creandoValor}
            onClose={() => setCreandoValor(null)}
            onCreated={cargarTipos}
          />
        )}
      </ModalInteractivo>
    </section>
  )
}
