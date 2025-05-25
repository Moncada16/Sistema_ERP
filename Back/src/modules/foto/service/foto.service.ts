// src/modules/foto/service/foto.service.ts
import prisma from '../../../../prisma/client'

type FotoInput = {
  articuloId: number
  url: string
  publicId: string
  orden?: number
}

export const agregarFoto = async ({ articuloId, url, publicId, orden }: FotoInput) => {
  const nuevaFoto = await prisma.foto.create({
    data: {
      articuloId,
      url,
      publicId,
      orden
    }
  })

  const articulo = await prisma.articulo.findUnique({
    where: { id: articuloId },
    select: { fotoPrincipal: true }
  })

  if (!articulo?.fotoPrincipal) {
    await prisma.articulo.update({
      where: { id: articuloId },
      data: { fotoPrincipal: url }
    })
  }

  return nuevaFoto
}

export const listarFotos = (articuloId: number) => {
  return prisma.foto.findMany({
    where: { articuloId },
    orderBy: { orden: 'asc' }
  })
}

export const eliminarFoto = async (fotoId: number) => {
  const foto = await prisma.foto.findUnique({ where: { id: fotoId } })
  if (!foto) throw new Error('Foto no encontrada')

  return await prisma.foto.delete({ where: { id: fotoId } })
}
