import { PrismaClient, Bodega } from '@prisma/client'

const prisma = new PrismaClient()

const BodegaService = {
  async getAllByEmpresa(empresaId: number): Promise<Bodega[]> {
    try {
      console.log('Buscando bodegas para empresaId:', empresaId)
      
      const bodegas = await prisma.bodega.findMany({
        where: { empresaId },
        orderBy: { createdAt: 'desc' }
      })
      
      console.log('Bodegas encontradas:', bodegas.length)
      return bodegas
    } catch (error) {
      console.error('Error en getAllByEmpresa:', error)
      throw new Error('Error al obtener bodegas de la base de datos')
    }
  },

  async create(data: Omit<Bodega, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bodega> {
    try {
      console.log('Creando bodega con datos:', data)
      
      // Validar que empresaId esté presente
      if (!data.empresaId) {
        throw new Error('empresaId es requerido para crear una bodega')
      }

      // Verificar que la empresa existe
      const empresaExists = await prisma.empresa.findUnique({
        where: { id: data.empresaId }
      });

      if (!empresaExists) {
        throw new Error('La empresa especificada no existe')
      }

      // Verificar que no existe otra bodega con el mismo nombre en la empresa
      const existingBodega = await prisma.bodega.findFirst({
        where: {
          nombre: data.nombre,
          empresaId: data.empresaId
        }
      })

      if (existingBodega) {
        throw new Error('Ya existe una bodega con ese nombre en tu empresa')
      }

      const bodega = await prisma.bodega.create({
        data: {
          nombre: data.nombre,
          direccion: data.direccion,
          empresaId: data.empresaId
        }
      })

      console.log('Bodega creada exitosamente:', bodega)
      return bodega
    } catch (error) {
      console.error('Error en create:', error)
      throw error
    }
  },

  async update(id: number, data: Partial<Bodega>, empresaId: number): Promise<Bodega> {
    try {
      console.log('Actualizando bodega:', { id, data, empresaId })
      
      // Verificar que la bodega existe y pertenece a la empresa
      const exists = await prisma.bodega.findFirst({
        where: { id, empresaId }
      })

      if (!exists) {
        throw new Error('Bodega not found or access denied.')
      }

      // Si se está actualizando el nombre, verificar que no exista otra con el mismo nombre
      if (data.nombre && data.nombre !== exists.nombre) {
        const existingBodega = await prisma.bodega.findFirst({
          where: {
            nombre: data.nombre,
            empresaId: empresaId,
            id: { not: id } // Excluir la bodega actual
          }
        })

        if (existingBodega) {
          throw new Error('Ya existe una bodega con ese nombre en tu empresa')
        }
      }

      const updatedBodega = await prisma.bodega.update({
        where: { id },
        data: {
          ...(data.nombre && { nombre: data.nombre }),
          ...(data.direccion && { direccion: data.direccion })
        }
      })

      console.log('Bodega actualizada exitosamente:', updatedBodega)
      return updatedBodega
    } catch (error) {
      console.error('Error en update:', error)
      throw error
    }
  },

  async delete(id: number, empresaId: number): Promise<void> {
    try {
      console.log('Eliminando bodega:', { id, empresaId })
      
      // Verificar que la bodega existe y pertenece a la empresa
      const exists = await prisma.bodega.findFirst({
        where: { id, empresaId }
      })

      if (!exists) {
        throw new Error('Bodega not found or access denied.')
      }

      // Verificar si la bodega tiene inventario asociado
      const inventarioCount = await prisma.skuInventario.count({
        where: { bodegaId: id }
      })

      if (inventarioCount > 0) {
        throw new Error('No se puede eliminar la bodega porque tiene inventario asociado')
      }

      // Verificar si la bodega tiene compras asociadas
      const comprasCount = await prisma.compra.count({
        where: { bodegaId: id }
      })

      if (comprasCount > 0) {
        throw new Error('No se puede eliminar la bodega porque tiene compras asociadas')
      }

      await prisma.bodega.delete({ 
        where: { id } 
      })

      console.log('Bodega eliminada exitosamente')
    } catch (error) {
      console.error('Error en delete:', error)
      throw error
    }
  },

  async getById(id: number, empresaId: number): Promise<Bodega | null> {
    try {
      const bodega = await prisma.bodega.findFirst({
        where: { 
          id, 
          empresaId 
        }
      })

      return bodega
    } catch (error) {
      console.error('Error en getById:', error)
      throw new Error('Error al obtener bodega por ID')
    }
  }
}

export default BodegaService