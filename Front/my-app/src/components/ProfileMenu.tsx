'use client'

import { useState, useRef} from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { useAuth } from '@/app/context/AuthContext'
import Image from 'next/image'



export default function ProfileMenu() {
  const { user} = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const {logout} = useAuth()
 

  // Cerrar menú al hacer clic fuera
  

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  if (!user) return null

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón perfil */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-gray-800 focus:outline-none"
      >
        <Image
          src={user.photo}
          alt="Foto de perfil"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-gray-200 text-sm font-medium">
          {user.nombre}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 text-gray-200 rounded-md shadow-lg z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
            <Image
            src={user.photo}
            alt="Foto de perfil"
            className="h-8 w-8 rounded-full object-cover"
            />
              <div>
                <p className="font-semibold">{user.nombre}</p>
                <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col p-2">
            <button
              onClick={() => router.push('/inicio/perfil')}
              className={clsx('w-full text-left px-3 py-2 rounded-md hover:bg-gray-700')}
            >
              Perfil de usuario
            </button>
            <button
              onClick={handleLogout}
              className={clsx('w-full text-left px-3 py-2 rounded-md hover:bg-red-700 text-red-400')}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
