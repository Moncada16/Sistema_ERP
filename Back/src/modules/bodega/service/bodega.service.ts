import { PrismaClient, Bodega } from '@prisma/client'
const prisma = new PrismaClient()

const BodegaService = {
  async getAllByEmpresa(empresaId: number): Promise<Bodega[]> {
    return prisma.bodega.findMany({
      where: { empresaId }
    })
  },

  async create(data: Omit<Bodega, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bodega> {
    return prisma.bodega.create({
      data
    })
  },

  async update(id: number, data: Partial<Bodega>, empresaId: number): Promise<Bodega> {
    const exists = await prisma.bodega.findFirst({
      where: { id, empresaId }
    })

    if (!exists) throw new Error('Bodega not found or access denied.')

    return prisma.bodega.update({
      where: { id },
      data
    })
  },

  async delete(id: number, empresaId: number): Promise<void> {
    const exists = await prisma.bodega.findFirst({
      where: { id, empresaId }
    })

    if (!exists) throw new Error('Bodega not found or access denied.')

    await prisma.bodega.delete({ where: { id } })
  }
}

export default BodegaService
