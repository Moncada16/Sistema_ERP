import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const EmpresaService = {
async createEmpresa(data: any, userId: number) {
  const nuevaEmpresa = await prisma.empresa.create({
    data: {
      nombre: data.nombre,
      nit: data.nit,
      direccion: data.direccion,
      ciudad: data.ciudad,
      telefono: data.telefono,
      email: data.email,
      moneda: data.moneda,
      zonaHoraria: data.zonaHoraria,
      usuarios: {
        connect: { id: userId }
      }
    }
  });

  // Asignar empresa al usuario (clave para req.user.empresaId)
  await prisma.user.update({
    where: { id: userId },
    data: { empresaId: nuevaEmpresa.id }
  });

  return nuevaEmpresa;
},

async getEmpresaByUserId(userId: number) {
  const userWithEmpresa = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      empresa: {
        select: {
          id: true,
          nombre: true,
          nit: true,
          direccion: true,
          ciudad: true,
          telefono: true,
          email: true,
          moneda: true,
          zonaHoraria: true,
          createdAt: true,
          updatedAt: true,
          usuarios: {
            select: {
              id: true,
              nombre: true,
              email: true,
              telefono: true,
              rol: true
            }
          }
        }
      }
    }
  });

  return userWithEmpresa?.empresa;
},
  async updateEmpresa(id: number, data: any) {
    // Elimina usuarios y timestamps si vienen desde el frontend por error
    const { usuarios, createdAt, updatedAt, ...safeData } = data

    return await prisma.empresa.update({
      where: { id },
      data: safeData
    })
  },

  async deleteEmpresa(id: number) {
    return await prisma.empresa.delete({
      where: { id }
    })
  }
}

export default EmpresaService
