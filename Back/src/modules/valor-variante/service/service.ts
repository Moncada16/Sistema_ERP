import prisma from '../../../../prisma/client'

export const crear = async (tipoVarianteId: number, nombre: string, articuloId: number, valor: string) => {
  return await prisma.valorVariante.create({
    data: { nombre, tipoVarianteId, articuloId, valor }
  })
}

export const listarPorTipo = async (tipoVarianteId: number) => {
  return await prisma.valorVariante.findMany({
    where: { tipoVarianteId }
  })
}
export const actualizar = async (id: number, nombre: string) => {
  return await prisma.valorVariante.update({
    where: { id },
    data: { nombre }
  })
}

export const eliminar = async (id: number) => {
  return await prisma.valorVariante.delete({
    where: { id }
  })
}
