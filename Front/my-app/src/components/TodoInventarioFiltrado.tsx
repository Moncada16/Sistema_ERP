'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'

type Registro = {
  cantidad: number
  bodega: { id: number; nombre: string }
  variante: {
    nombre: string
    articulo: { id: number; nombre: string }
    valores?: { nombre: string }[]
  }
}

export default function TodoInventarioFiltrado() {
  const [datos, setDatos] = useState<Registro[]>([])
  const [filtroArticulo, setFiltroArticulo] = useState('')
  const [filtroBodega, setFiltroBodega] = useState('')
  const [filtroValorVariante, setFiltroValorVariante] = useState('')

  useEffect(() => {
    api.get('/inventario/todo')
      .then((res) => setDatos(res.data))
      .catch((err) => console.error('❌ Inventario error:', err))
  }, [])

  // 🔄 Generar filtros únicos
  const articulos = Array.from(
    new Set(datos.map((d) => `${d.variante.articulo.id}-${d.variante.articulo.nombre}`))
  )
  const bodegas = Array.from(new Set(datos.map((d) => `${d.bodega.id}-${d.bodega.nombre}`)))
  const valoresVariante = Array.from(
    new Set(
      datos.flatMap((d) => d.variante.valores?.map((v) => v.nombre) || [])
    )
  )

  // 🔎 Filtrado avanzado
  const filtrado = datos.filter((d) => {
    const articuloMatch =
      filtroArticulo === '' ||
      `${d.variante.articulo.id}-${d.variante.articulo.nombre}` === filtroArticulo

    const bodegaMatch =
      filtroBodega === '' ||
      `${d.bodega.id}-${d.bodega.nombre}` === filtroBodega

    const valorMatch =
      filtroValorVariante === '' ||
      (d.variante.valores?.some((v) => v.nombre === filtroValorVariante) ?? false)

    return articuloMatch && bodegaMatch && valorMatch
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📋 Inventario General con Filtros</h2>

      <div className="flex gap-4 flex-wrap">
        {/* 🔍 Artículo */}
        <select
          value={filtroArticulo}
          onChange={(e) => setFiltroArticulo(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">🧾 Todos los artículos</option>
          {articulos.map((a) => {
            const [id, nombre] = a.split('-')
            return (
              <option key={a} value={a}>
                {nombre} (ID: {id})
              </option>
            )
          })}
        </select>

        {/* 🏬 Bodega */}
        <select
          value={filtroBodega}
          onChange={(e) => setFiltroBodega(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">🏬 Todas las bodegas</option>
          {bodegas.map((b) => {
            const [id, nombre] = b.split('-')
            return (
              <option key={b} value={b}>
                {nombre} (ID: {id})
              </option>
            )
          })}
        </select>

        {/* 🎯 Valor de variante */}
        <select
          value={filtroValorVariante}
          onChange={(e) => setFiltroValorVariante(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">🎯 Todos los valores de variantes</option>
          {valoresVariante.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* 🧾 Tabla */}
      <table className="w-full border text-sm mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Artículo</th>
            <th className="p-2">Variante</th>
            <th className="p-2">Bodega</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Valores</th>
          </tr>
        </thead>
        <tbody>
          {filtrado.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{item.variante.articulo.nombre}</td>
              <td className="p-2">{item.variante.nombre}</td>
              <td className="p-2">{item.bodega.nombre}</td>
              <td className="p-2">{item.cantidad}</td>
              <td className="p-2">
                {item.variante.valores?.map((v) => v.nombre).join(', ') || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
