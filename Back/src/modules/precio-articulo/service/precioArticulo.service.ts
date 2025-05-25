import prisma from '../../../../prisma/client'

export interface PrecioArticuloData {
  tipoPrecioId: number
  valor:        number
}

// Crea un precio nuevo o lo actualiza si ya existe (upsert)
export const upsertPrecioArticuloService = async (
  articuloId: number,
  data: PrecioArticuloData
) => {
  return prisma.precioArticulo.upsert({
    where: {
      articuloId_tipoPrecioId: {
        articuloId,
        tipoPrecioId: data.tipoPrecioId,
      },
    },
    create: {
      articuloId,
      tipoPrecioId: data.tipoPrecioId,
      valor:        data.valor,
    },
    update: {
      valor: data.valor,
    },
  })
}

export const listarPreciosService = (articuloId: number) => {
  return prisma.precioArticulo.findMany({
    where: { articuloId },
    include: { tipoPrecio: { select: { nombre: true } } },
    orderBy: { creadoEn: 'desc' },
  })
}

export const actualizarPrecioService = async (
  id: number,
  valor: number
) => {
  return prisma.precioArticulo.update({
    where: { id },
    data:  { valor },
  })
}

export const eliminarPrecioService = (id: number) => {
  return prisma.precioArticulo.delete({ where: { id } })
}
