import prisma from '../../../../prisma/client'
import { CrearCompraDTO } from '../dto/compra.dto'

export const registrarCompra = async (data: CrearCompraDTO) => {
  // 🧠 Validaciones
  if (!['credito', 'contado'].includes(data.tipoPago)) {
    throw new Error('Tipo de pago inválido')
  }

  const proveedor = await prisma.proveedor.findUnique({ where: { id: data.proveedorId } })
  if (!proveedor) throw new Error('Proveedor no encontrado')

  const bodega = await prisma.bodega.findUnique({ where: { id: data.bodegaId } })
  if (!bodega) throw new Error('Bodega no encontrada')

  for (const d of data.detalles) {
    if (d.cantidad <= 0) throw new Error('Cantidad inválida')
    if (d.valorCompra <= 0) throw new Error('Valor de compra inválido')
    if (d.valorVenta <= 0) throw new Error('Valor de venta inválido')
  }

  // 🧾 Registrar compra con detalles
  const compra = await prisma.compra.create({
    data: {
      numero: data.numero, // Asegúrate de que 'numero' esté presente en CrearCompraDTO y sea proporcionado
      proveedorId: data.proveedorId,
      tipoPago: data.tipoPago,
      bodegaId: data.bodegaId,
      detalles: {
        create: data.detalles.map(d => ({
          cantidad: d.cantidad,
          valorCompra: d.valorCompra,
          valorVenta: d.valorVenta,
          sku: { connect: { id: d.varianteId } }
        }))
      }
    },
    include: { detalles: true }
  })

  // 📦 Actualizar inventario
  for (const d of data.detalles) {
    await prisma.skuInventario.upsert({
      where: {
        skuId_bodegaId_ubicacion: { // Use the actual composite unique key name from your Prisma schema
          skuId: d.varianteId,
          bodegaId: data.bodegaId,
          ubicacion: d.ubicacion ?? '' // Asegúrate de que 'ubicacion' sea opcional en CrearCompraDTO
        }
      },
      update: {
        cantidad: { increment: d.cantidad }
      },
      create: {
        skuId: d.varianteId,
        bodegaId: data.bodegaId,
        cantidad: d.cantidad
      }
    })
  }

  return compra
}
