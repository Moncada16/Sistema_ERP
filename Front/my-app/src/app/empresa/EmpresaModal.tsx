'use client'

import { Empresa } from './EmpresaDTO'
import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: Empresa) => void
  initialData?: Empresa
}

export default function EmpresaModal({ open, onClose, onSubmit, initialData }: Props) {
  const [form, setForm] = useState<Empresa>({
    nombre: '',
    nit: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    email: '',
    moneda: '',
    zonaHoraria: ''
  })

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
    } else {
      setForm({
        nombre: '',
        nit: '',
        direccion: '',
        ciudad: '',
        telefono: '',
        email: '',
        moneda: '',
        zonaHoraria: ''
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSubmit(form)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen text-black px-4 py-8 bg-white/50 backdrop-blur-sm">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-md max-w-md w-full space-y-4 border border-gray-200">
          <Dialog.Title className="text-xl font-semibold text-gray-800">
            {initialData ? 'Editar Empresa' : 'Nueva Empresa'}
          </Dialog.Title>

          {Object.entries(form).map(([key, value]) =>
            key !== 'id' ? (
              <input
                key={key}
                name={key}
                value={value}
                onChange={handleChange}
                placeholder={key}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              />
            ) : null
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 text-gray-700 hover:underline"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition"
            >
              Guardar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
