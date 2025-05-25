// src/modules/fotoUser/service/fotoUser.service.ts
import prisma from '../../../../prisma/client'

export const obtenerUsuario = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      img: true,
      imgPublicId: true
    }
  })
}

export const actualizarFotoPerfil = async (userId: number, url: string, publicId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      img: url,
      imgPublicId: publicId
    }
  })
}
