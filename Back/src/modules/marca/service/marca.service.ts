
import { PrismaClient, Marca } from '@prisma/client'

const prisma = new PrismaClient()

// Marcas predeterminadas específicas para ropa, zapatos y accesorios
const MARCAS_PREDETERMINADAS = [
  // === ROPA ===
  { nombre: 'Zara', descripcion: 'Moda rápida española, ropa moderna y elegante', logo: null },
  { nombre: 'H&M', descripcion: 'Moda accesible sueca, ropa casual y formal', logo: null },
  { nombre: 'Pull & Bear', descripcion: 'Ropa juvenil y urbana del grupo Inditex', logo: null },
  { nombre: 'Bershka', descripcion: 'Moda joven y tendencias actuales', logo: null },
  { nombre: 'Stradivarius', descripcion: 'Ropa femenina moderna y sofisticada', logo: null },
  { nombre: 'Massimo Dutti', descripcion: 'Moda elegante y sofisticada', logo: null },
  { nombre: 'Uniqlo', descripcion: 'Ropa básica japonesa de calidad', logo: null },
  { nombre: 'Forever 21', descripcion: 'Moda joven y asequible', logo: null },
  
  // === ZAPATOS ===
  { nombre: 'Nike', descripcion: 'Calzado deportivo y lifestyle líder mundial', logo: null },
  { nombre: 'Adidas', descripcion: 'Zapatos deportivos alemanes de alta calidad', logo: null },
  { nombre: 'Converse', descripcion: 'Zapatillas icónicas y casuales', logo: null },
  { nombre: 'Vans', descripcion: 'Calzado urbano y para skateboarding', logo: null },
  { nombre: 'Puma', descripcion: 'Zapatos deportivos alemanes', logo: null },
  { nombre: 'Reebok', descripcion: 'Calzado deportivo y fitness', logo: null },
  { nombre: 'Dr. Martens', descripcion: 'Botas y zapatos resistentes británicos', logo: null },
  { nombre: 'Clarks', descripcion: 'Zapatos casuales y formales británicos', logo: null },
  
  // === ACCESORIOS ===
  { nombre: 'Ray-Ban', descripcion: 'Gafas de sol icónicas americanas', logo: null },
  { nombre: 'Oakley', descripcion: 'Gafas deportivas y de sol', logo: null },
  { nombre: 'Fossil', descripcion: 'Relojes y accesorios lifestyle', logo: null },
  { nombre: 'Casio', descripcion: 'Relojes japoneses durables y funcionales', logo: null },
  { nombre: 'Michael Kors', descripcion: 'Bolsos y accesorios de lujo accesible', logo: null },
  { nombre: 'Coach', descripcion: 'Bolsos y accesorios de cuero premium', logo: null },
  { nombre: 'Pandora', descripcion: 'Joyería y pulseras personalizables', logo: null },
  { nombre: 'Swatch', descripcion: 'Relojes suizos coloridos y modernos', logo: null },
  
  // === MARCAS GENÉRICAS ===
  { nombre: 'Sin Marca', descripcion: 'Para productos sin marca específica', logo: null },
  { nombre: 'Marca Propia', descripcion: 'Para productos de marca propia de la tienda', logo: null }
]

const MarcaService = {
  async getAllByEmpresa(empresaId: number): Promise<Marca[]> {
    try {
      const marcas = await prisma.marca.findMany({
        where: { empresaId },
        include: {
          _count: {
            select: { articulos: true }
          }
        },
        orderBy: { nombre: 'asc' }
      })
      
      return marcas
    } catch (error) {
      console.error('Error en getAllByEmpresa:', error)
      throw new Error('Error al obtener marcas de la base de datos')
    }
  },

  async create(data: Omit<Marca, 'id' | 'createdAt' | 'updatedAt'>): Promise<Marca> {
    try {
      // Verificar que la empresa existe
      const empresaExists = await prisma.empresa.findUnique({
        where: { id: data.empresaId }
      })

      if (!empresaExists) {
        throw new Error('La empresa especificada no existe')
      }

      // Verificar que no existe otra marca con el mismo nombre en la empresa
      const existingMarca = await prisma.marca.findFirst({
        where: {
          nombre: data.nombre,
          empresaId: data.empresaId
        }
      })

      if (existingMarca) {
        throw new Error('Ya existe una marca con ese nombre en tu empresa')
      }

      const marca = await prisma.marca.create({
        data: {
          nombre: data.nombre,
          descripcion: data.descripcion,
          logo: data.logo,
          empresaId: data.empresaId
        }
      })

      return marca
    } catch (error) {
      console.error('Error en create:', error)
      throw error
    }
  },

  async update(id: number, data: Partial<Marca>, empresaId: number): Promise<Marca> {
    try {
      // Verificar que la marca existe y pertenece a la empresa
      const exists = await prisma.marca.findFirst({
        where: { id, empresaId }
      })

      if (!exists) {
        throw new Error('Marca not found or access denied.')
      }

      // Si se está actualizando el nombre, verificar que no exista otra con el mismo nombre
      if (data.nombre && data.nombre !== exists.nombre) {
        const existingMarca = await prisma.marca.findFirst({
          where: {
            nombre: data.nombre,
            empresaId: empresaId,
            id: { not: id }
          }
        })

        if (existingMarca) {
          throw new Error('Ya existe una marca con ese nombre en tu empresa')
        }
      }

      const updatedMarca = await prisma.marca.update({
        where: { id },
        data: {
          ...(data.nombre && { nombre: data.nombre }),
          ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
          ...(data.logo !== undefined && { logo: data.logo })
        }
      })

      return updatedMarca
    } catch (error) {
      console.error('Error en update:', error)
      throw error
    }
  },

  async delete(id: number, empresaId: number): Promise<void> {
    try {
      // Verificar que la marca existe y pertenece a la empresa
      const exists = await prisma.marca.findFirst({
        where: { id, empresaId }
      })

      if (!exists) {
        throw new Error('Marca not found or access denied.')
      }

      // Verificar si la marca tiene artículos asociados
      const articulosCount = await prisma.articulo.count({
        where: { marcaId: id }
      })

      if (articulosCount > 0) {
        throw new Error('No se puede eliminar la marca porque tiene artículos asociados')
      }

      await prisma.marca.delete({ 
        where: { id } 
      })
    } catch (error) {
      console.error('Error en delete:', error)
      throw error
    }
  },

  async createMarcasDefecto(empresaId: number): Promise<Marca[]> {
    try {
      // Verificar que la empresa existe
      const empresaExists = await prisma.empresa.findUnique({
        where: { id: empresaId }
      })

      if (!empresaExists) {
        throw new Error('La empresa especificada no existe')
      }

      // Verificar cuántas marcas ya tiene la empresa
      const marcasExistentes = await prisma.marca.count({
        where: { empresaId }
      })

      if (marcasExistentes > 0) {
        throw new Error('Ya tienes marcas creadas. Las marcas por defecto solo se pueden crear en empresas sin marcas.')
      }

      // Crear todas las marcas predeterminadas
      const marcasCreadas = await Promise.all(
        MARCAS_PREDETERMINADAS.map(marca =>
          prisma.marca.create({
            data: {
              ...marca,
              empresaId
            }
          })
        )
      )

      return marcasCreadas
    } catch (error) {
      console.error('Error en createMarcasDefecto:', error)
      throw error
    }
  },

  async getById(id: number, empresaId: number): Promise<Marca | null> {
    try {
      const marca = await prisma.marca.findFirst({
        where: { 
          id, 
          empresaId 
        },
        include: {
          articulos: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
              precio: true
            }
          }
        }
      })

      return marca
    } catch (error) {
      console.error('Error en getById:', error)
      throw new Error('Error al obtener marca por ID')
    }
  }
}

export default MarcaService