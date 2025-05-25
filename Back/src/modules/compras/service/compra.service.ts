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
      proveedorId: data.proveedorId,
      tipoPago: data.tipoPago,
      bodegaId: data.bodegaId,
      detalles: {
        create: data.detalles
      }
    },
    include: { detalles: true }
  })

  // 📦 Actualizar inventario
  for (const d of data.detalles) {
    await prisma.inventario.upsert({
      where: {
        varianteId_bodegaId: {
          varianteId: d.varianteId,
          bodegaId: data.bodegaId
        }
      },
      update: {
        cantidad: { increment: d.cantidad }
      },
      create: {
        varianteId: d.varianteId,
        bodegaId: data.bodegaId,
        cantidad: d.cantidad
      }
    })
  }

  return compra
}
