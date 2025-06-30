'use client'

import { useEffect, useState } from 'react'
import { FiShoppingCart, FiPlus, FiTrash2, FiCheck, FiAlertCircle, FiUser, FiCreditCard, FiArchive, FiPackage, FiDollarSign, FiX } from 'react-icons/fi'
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
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
        setError('Error al cargar los datos del sistema')
      } finally {
        setLoading(false)
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
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const totalCompra = detalles.reduce(
    (total, d) => total + d.cantidad * d.valorCompra,
    0
  )
  const totalProductos = detalles.length

  if (loading && proveedores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-rose-600 font-medium">Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center">
            <FiShoppingCart className="w-10 h-10 mr-4" />
            <div>
              <h2 className="text-3xl font-bold">Registrar Nueva Compra</h2>
              <p className="mt-2 text-rose-100">
                Gestiona tus órdenes de compra y actualiza el inventario automáticamente
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <FiCheck className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información General */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FiUser className="w-6 h-6 mr-3 text-rose-600" />
              Información General
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Proveedor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Proveedor *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={proveedorId}
                    onChange={(e) => setProveedorId(parseInt(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Selecciona un proveedor</option>
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tipo de Pago */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Pago
                </label>
                <div className="relative">
                  <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={tipoPago}
                    onChange={(e) => setTipoPago(e.target.value as 'credito' | 'contado')}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  >
                    <option value="contado">💵 Contado</option>
                    <option value="credito">💳 Crédito</option>
                  </select>
                </div>
              </div>

              {/* Bodega */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bodega de Destino *
                </label>
                <div className="relative">
                  <FiArchive className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={bodegaId}
                    onChange={(e) => setBodegaId(parseInt(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Selecciona una bodega</option>
                    {bodegas.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FiPackage className="w-6 h-6 mr-3 text-rose-600" />
                Productos de la Compra
              </h3>
              <button
                type="button"
                onClick={agregarFila}
                className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Agregar Producto
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Variante</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cantidad</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor Compra</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor Venta</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Subtotal</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <select
                          value={detalle.varianteId}
                          onChange={(e) => handleDetalleChange(i, 'varianteId', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          required
                        >
                          <option value={0}>Selecciona variante</option>
                          {variantes.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.nombre} ({v.sku})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          placeholder="0"
                          value={detalle.cantidad || ''}
                          onChange={(e) => handleDetalleChange(i, 'cantidad', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          required
                          min="1"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            placeholder="0.00"
                            value={detalle.valorCompra || ''}
                            onChange={(e) => handleDetalleChange(i, 'valorCompra', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            placeholder="0.00"
                            value={detalle.valorVenta || ''}
                            onChange={(e) => handleDetalleChange(i, 'valorVenta', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-green-600">
                          ${(detalle.cantidad * detalle.valorCompra).toLocaleString('es-CO')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {i === detalles.length - 1 && (
                            <button
                              type="button"
                              onClick={agregarFila}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Agregar fila"
                            >
                              <FiPlus className="w-4 h-4" />
                            </button>
                          )}
                          {detalles.length > 1 && (
                            <button
                              type="button"
                              onClick={() => eliminarFila(i)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                              title="Eliminar fila"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen de la Compra</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <FiPackage className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{totalProductos}</div>
                <div className="text-gray-600">Productos</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <FiDollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-600">
                  ${totalCompra.toLocaleString('es-CO')}
                </div>
                <div className="text-gray-600">Total Compra</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <FiCreditCard className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600 capitalize">{tipoPago}</div>
                <div className="text-gray-600">Tipo de Pago</div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <FiX className="w-5 h-5 mr-2 inline" />
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5 mr-2" />
                  Confirmar Compra
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}