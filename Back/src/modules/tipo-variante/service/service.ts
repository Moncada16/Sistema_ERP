import prisma from '../../../../prisma/client'

export const crear = async (nombre: string) => {
  return await prisma.tipoVariante.create({ data: { nombre } })
}

export const listar = async () => {
  return await prisma.tipoVariante.findMany({
    include: { valores: true },
  })
}
export const actualizar = async (id: number, nombre: string) => {
  return await prisma.tipoVariante.update({
    where: { id },
    data: { nombre }
  })
}

export const eliminar = async (id: number) => {
  return await prisma.tipoVariante.delete({ where: { id } })
}
