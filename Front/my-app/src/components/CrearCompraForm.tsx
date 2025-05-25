'use client'

import { useEffect, useState } from 'react'
import api from '@/app/lib/api'

type Variante = { id: number; nombre: string; sku: string }
type Bodega = { id: number; nombre: string }
type Proveedor = { id: number; nombre: string }

type Detalle = {
  varianteId: number
  cantidad: number
  valorCompra: number
  valorVenta: number
}

export default function CrearCompraForm() {
  const [proveedorId, setProveedorId] = useState<number | ''>('') 
  const [tipoPago, setTipoPago] = useState<'credito' | 'contado'>('contado')
  const [bodegaId, setBodegaId] = useState<number | ''>('')

  const [detalles, setDetalles] = useState<Detalle[]>([
    { varianteId: 0, cantidad: 0, valorCompra: 0, valorVenta: 0 },
  ])

  const [bodegas, setBodegas] = useState<Bodega[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [variantes, setVariantes] = useState<Variante[]>([])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resBodegas, resVariantes, resProveedores] = await Promise.all([
          api.get('/bodegas'),
          api.get('/variantes'),
          api.get('/proveedores')
        ])
        setBodegas(resBodegas.data)
        setVariantes(resVariantes.data)
        setProveedores(resProveedores.data)
      } catch (err) {
        console.error('Error cargando datos:', err)
      }
    }

    loadData()
  }, [])

  const handleDetalleChange = (index: number, field: keyof Detalle, value: string) => {
    const updated = [...detalles]
    updated[index][field] = field === 'varianteId' ? parseInt(value) : parseFloat(value)
    setDetalles(updated)
  }

  const agregarFila = () => {
    setDetalles([...detalles, { varianteId: 0, cantidad: 0, valorCompra: 0, valorVenta: 0 }])
  }

  const eliminarFila = (index: number) => {
    const nuevaLista = detalles.filter((_, i) => i !== index)
    setDetalles(nuevaLista)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!proveedorId) return setError('Debe seleccionar un proveedor')
    if (!bodegaId) return setError('Debe seleccionar una bodega')
    if (detalles.length === 0) return setError('Debe añadir al menos un producto')

    for (const d of detalles) {
      if (!d.varianteId || d.cantidad <= 0 || d.valorCompra <= 0 || d.valorVenta <= 0) {
        return setError('Todos los campos del producto deben ser válidos y mayores a cero')
      }
    }

    try {
      await api.post('/compras', {
        proveedorId,
        tipoPago,
        bodegaId,
        detalles
      })

      setSuccess('✅ Compra registrada exitosamente')
      setProveedorId('')
      setBodegaId('')
      setDetalles([{ varianteId: 0, cantidad: 0, valorCompra: 0, valorVenta: 0 }])
    } catch (error) {
      console.error('Error al registrar compra:', error)
      setError('Error al registrar la compra')
    }
  }

  const totalCompra = detalles.reduce(
    (total, d) => total + d.cantidad * d.valorCompra,
    0
  )
  const totalProductos = detalles.length

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold">🧾 Registrar Compra</h2>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Proveedor */}
        <select
          value={proveedorId}
          onChange={(e) => setProveedorId(parseInt(e.target.value))}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">🧑‍💼 Selecciona un proveedor</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        {/* Tipo de pago */}
        <select
          value={tipoPago}
          onChange={(e) => setTipoPago(e.target.value as 'credito' | 'contado')}
          className="w-full border p-2 rounded"
        >
          <option value="contado">💵 Contado</option>
          <option value="credito">💳 Crédito</option>
        </select>

        {/* Bodega */}
        <select
          value={bodegaId}
          onChange={(e) => setBodegaId(parseInt(e.target.value))}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">🏬 Selecciona una bodega</option>
          {bodegas.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nombre}
            </option>
          ))}
        </select>

        {/* Productos */}
        <h3 className="text-lg font-bold pt-4">📦 Productos</h3>

        {detalles.map((detalle, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 items-center">
            <select
              value={detalle.varianteId}
              onChange={(e) => handleDetalleChange(i, 'varianteId', e.target.value)}
              className="border p-2 rounded"
              required
            >
              <option value={0}>🎯 Selecciona variante</option>
              {variantes.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre} ({v.sku})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Cantidad"
              value={detalle.cantidad}
              onChange={(e) => handleDetalleChange(i, 'cantidad', e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Valor compra"
              value={detalle.valorCompra}
              onChange={(e) => handleDetalleChange(i, 'valorCompra', e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Valor venta"
              value={detalle.valorVenta}
              onChange={(e) => handleDetalleChange(i, 'valorVenta', e.target.value)}
              className="border p-2 rounded"
              required
            />
            {i === detalles.length - 1 ? (
              <button
                type="button"
                onClick={agregarFila}
                className="text-sm text-blue-600 underline"
              >
                ➕
              </button>
            ) : (
              <span></span>
            )}
            {detalles.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarFila(i)}
                className="text-sm text-red-600 underline"
              >
                🗑️
              </button>
            )}
          </div>
        ))}

        {/* 🧾 Resumen de compra */}
        <div className="pt-6 border-t mt-6 text-right space-y-1">
          <p className="text-sm text-gray-600">
            🧾 Total de productos: <strong>{totalProductos}</strong>
          </p>
          <p className="text-lg font-bold">
            💰 Total de compra: ${totalCompra.toLocaleString('es-CO')}
          </p>
        </div>

        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded mt-4 float-right"
        >
          ✅ Confirmar Compra
        </button>
      </form>
    </div>
  )
}
