'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from './context/AuthContext'
import Image from 'next/image'

// const productos = [
//   { nombre: 'Zapatilla Urbana', imagen: '/img/zapato1.jpg' },
//   { nombre: 'Tenis Deportivo', imagen: '/img/zapato2.jpg' },
//   { nombre: 'Botín Casual', imagen: '/img/zapato3.jpg' }
// ]

const reseñas = [
  {
    nombre: 'Laura García',
    foto: '/img/user1.jpg',
    texto: 'Me encantó el servicio y la calidad. ¡Volveré a comprar!'
  },
  {
    nombre: 'Carlos Pérez',
    foto: '/img/user2.jpg',
    texto: 'Muy intuitivo y fácil de usar. Lo recomiendo para cualquier empresa.'
  },
  {
    nombre: 'Valentina Ríos',
    foto: '/img/user3.jpg',
    texto: 'Bendito Calzado me ayudó a organizar todo mi inventario sin esfuerzo.'
  }
]

export default function Home() {
  const router = useRouter()
  const { isLoading, user } = useAuth()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/inicio')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <main className="flex items-center justify-center h-screen bg-gray-800">
        <p className="text-gray-300">🔄 Cargando sesión...</p>
      </main>
    )
  }

  return (
    
      <main className="px-4 md:px-10 py-12 space-y-20 bg-gray-900 text-gray-200">
        <Navbar/>
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenido a Bendito Calzado</h1>
          <p className="text-gray-400 text-lg">Tu sistema ERP para crecer sin límites 🚀</p>
        </section>

        {/* Carrusel de productos
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Productos destacados</h2>
          <div className="flex gap-6 overflow-x-auto pb-2">
            {productos.map((producto, i) => (
              <div key={i} className="min-w-[250px] bg-gray-800 rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105">
                <img src={producto.imagen} alt={producto.nombre} className="w-full h-48 object-cover rounded" />
                <h3 className="mt-2 text-lg font-semibold">{producto.nombre}</h3>
              </div>
            ))}
          </div>
        </section> */}

        {/* Reseñas de usuarios */}
        <section className="bg-gray-700 py-12">
          <h2 className="text-2xl font-bold text-center mb-10">Lo que dicen nuestros usuarios</h2>
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {reseñas.map((resena, i) => (
              <div key={i} className="w-72 bg-gray-800 rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105">
                <Image src={resena.foto} alt={resena.nombre} className="mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0" />
                <h3 className="font-semibold text-lg">{resena.nombre}</h3>
                <p className="text-sm text-gray-400 mt-2">“{resena.texto}”</p>
              </div>
            ))}
          </div>
        </section>
        <Footer/>
        </main>
)
}
