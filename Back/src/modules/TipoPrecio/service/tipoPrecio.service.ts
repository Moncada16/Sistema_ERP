import prisma from '../../../../prisma/client'

export const crearTipoPrecioService = async (nombre: string) => {
  return prisma.tipoPrecio.create({
    data: { nombre },
  })
}

export const listarTipoPreciosService = async () => {
  return prisma.tipoPrecio.findMany({
    orderBy: { creado: 'desc' },
  })
}

export const obtenerTipoPrecioService = async (id: number) => {
  return prisma.tipoPrecio.findUnique({
    where: { id },
  })
}

export const actualizarTipoPrecioService = async (id: number, nombre: string) => {
  return prisma.tipoPrecio.update({
    where: { id },
    data: { nombre },
  })
}

export const eliminarTipoPrecioService = async (id: number) => {
  return prisma.tipoPrecio.delete({
    where: { id },
  })
}
