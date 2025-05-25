import prisma from '../../../../prisma/client'
import { AbonoDTO, CrearCxPDTO } from '../dto/cxp.dto'

export const crearCuentaPorPagar = async ({ compraId, saldoTotal }: CrearCxPDTO) => {
  return prisma.cuentaPorPagar.create({
    data: {
      compraId,
      saldoTotal,
      saldoPendiente: saldoTotal,
      estado: 'PENDIENTE'
    }
  })
}

export const listarCuentas = async () => {
  return prisma.cuentaPorPagar.findMany({
    include: {
      compra: { include: { proveedor: true } },
      abonos: true
    }
  })
}

export const registrarAbono = async ({ cuentaPorPagarId, monto }: AbonoDTO) => {
  const cuenta = await prisma.cuentaPorPagar.findUnique({
    where: { id: cuentaPorPagarId }
  })

  if (!cuenta) throw new Error('Cuenta no encontrada')
  if (cuenta.estado === 'PAGADA') throw new Error('Cuenta ya pagada')
  if (monto <= 0) throw new Error('Monto inválido')

  const nuevoSaldo = cuenta.saldoPendiente - monto
  const estado = nuevoSaldo <= 0 ? 'PAGADA' : 'PENDIENTE'

  await prisma.cuentaPorPagar.update({
    where: { id: cuentaPorPagarId },
    data: {
      saldoPendiente: nuevoSaldo,
      estado
    }
  })

  return prisma.abonoCuenta.create({
    data: {
      cuentaPorPagarId,
      monto
    }
  })
}

export const verCuentaPorId = async (id: number) => {
  return prisma.cuentaPorPagar.findUnique({
    where: { id },
    include: {
      abonos: true,
      compra: { include: { proveedor: true } }
    }
  })
}
