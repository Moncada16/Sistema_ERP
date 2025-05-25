"use client"
import { useEffect, useState } from 'react'

export default function Footer() {
  const [year, setYear] = useState('')

  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])

  return (
    <footer className="bg-gray-900 text-gray-200 px-4 md:px-10 py-10 mt-20 border-t border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ... tus secciones anteriores ... */}
      </div>

      <div className="text-center text-xs text-gray-400 mt-10">
        {year && <>© {year} Bendito Calzado. Todos los derechos reservados.</>}
      </div>
    </footer>
  )
}
