import { PrismaClient, CategoriaArticulo } from '@prisma/client'

const prisma = new PrismaClient()

// Categorías predeterminadas con iconos
const CATEGORIAS_PREDETERMINADAS = [
  { nombre: 'Ropa', descripcion: 'Prendas de vestir en general', icono: '👕' },
  { nombre: 'Calzado', descripcion: 'Zapatos, botas, sandalias', icono: '👟' },
  { nombre: 'Gorras', descripcion: 'Sombreros y gorras', icono: '🧢' },
  { nombre: 'Accesorios', descripcion: 'Complementos y accesorios', icono: '👜' },
  { nombre: 'Joyería', descripcion: 'Joyas y bisutería', icono: '💍' },
  { nombre: 'Electrónicos', descripcion: 'Dispositivos electrónicos', icono: '📱' },
  { nombre: 'Hogar', descripcion: 'Artículos para el hogar', icono: '🏠' },
  { nombre: 'Deportes', descripcion: 'Artículos deportivos', icono: '⚽' },
  { nombre: 'Belleza', descripcion: 'Productos de belleza y cuidado', icono: '💄' },
  { nombre: 'Libros', descripcion: 'Libros y material de lectura', icono: '📚' },
  { nombre: 'Juguetes', descripcion: 'Juguetes y entretenimiento', icono: '🧸' },
  { nombre: 'Automóvil', descripcion: 'Accesorios para vehículos', icono: '🚗' },
  { nombre: 'Mascotas', descripcion: 'Productos para mascotas', icono: '🐕' },
  { nombre: 'Herramientas', descripcion: 'Herramientas y equipos', icono: '🔧' },
  { nombre: 'Jardín', descripcion: 'Jardinería y plantas', icono: '🌱' },
  { nombre: 'Cocina', descripcion: 'Utensilios de cocina', icono: '🍳' },
  { nombre: 'Bebidas', descripcion: 'Bebidas y líquidos', icono: '🥤' },
  { nombre: 'Alimentos', descripcion: 'Productos alimenticios', icono: '🍕' },
  { nombre: 'Oficina', descripcion: 'Artículos de oficina', icono: '📋' },
  { nombre: 'Arte', descripcion: 'Materiales artísticos', icono: '🎨' }
]

const CategoriaArticuloService = {
  async getAllByEmpresa(empresaId: number): Promise<CategoriaArticulo[]> {
    try {
      const categorias = await prisma.categoriaArticulo.findMany({
        where: { empresaId },
        include: {
          _count: {
            select: { articulos: true } // Contar artículos por categoría
          }
        },
        orderBy: { nombre: 'asc' }
      })
      
      return categorias
    } catch (error) {
      console.error('Error en getAllByEmpresa:', error)
      throw new Error('Error al obtener categorías de la base de datos')
    }
  },

  async create(data: Omit<CategoriaArticulo, 'id' | 'createdAt' | 'updatedAt'>): Promise<CategoriaArticulo> {
    try {
      // Verificar que la empresa existe
      const empresaExists = await prisma.empresa.findUnique({
        where: { id: data.empresaId }
      })

      if (!empresaExists) {
        throw new Error('La empresa especificada no existe')
      }

      // Verificar que no existe otra categoría con el mismo nombre en la empresa
      const existingCategoria = await prisma.categoriaArticulo.findFirst({
        where: {
          nombre: data.nombre,
          empresaId: data.empresaId
        }
      })

      if (existingCategoria) {
        throw new Error('Ya existe una categoría con ese nombre en tu empresa')
      }

      const categoria = await prisma.categoriaArticulo.create({
        data: {
          nombre: data.nombre,
          descripcion: data.descripcion,
          icono: data.icono,
          empresaId: data.empresaId
        }
      })

      return categoria
    } catch (error) {
      console.error('Error en create:', error)
      throw error
    }
  },

  async update(id: number, data: Partial<CategoriaArticulo>, empresaId: number): Promise<CategoriaArticulo> {
    try {
      // Verificar que la categoría existe y pertenece a la empresa
      const exists = await prisma.categoriaArticulo.findFirst({
        where: { id, empresaId }
      })

      if (!exists) {
        throw new Error('Categoría not found or access denied.')
      }

      // Si se está actualizando el nombre, verificar que no exista otra con el mismo nombre
      if (data.nombre && data.nombre !== exists.nombre) {
        const existingCategoria = await prisma.categoriaArticulo.findFirst({
          where: {
            nombre: data.nombre,
            empresaId: empresaId,
            id: { not: id }
          }
        })

        if (existingCategoria) {
          throw new Error('Ya existe una categoría con ese nombre en tu empresa')
        }
      }

      const updatedCategoria = await prisma.categoriaArticulo.update({
        where: { id },
        data: {
          ...(data.nombre && { nombre: data.nombre }),
          ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
          ...(data.icono !== undefined && { icono: data.icono })
        }
      })

      return updatedCategoria
    } catch (error) {
      console.error('Error en update:', error)
      throw error
    }
  },

  async delete(id: number, empresaId: number): Promise<void> {
    try {
      // Verificar que la categoría existe y pertenece a la empresa
      const exists = await prisma.categoriaArticulo.findFirst({
        where: { id, empresaId }
      })

      if (!exists) {
        throw new Error('Categoría not found or access denied.')
      }

      // Verificar si la categoría tiene artículos asociados
      const articulosCount = await prisma.articulo.count({
        where: { categoriaId: id }
      })

      if (articulosCount > 0) {
        throw new Error('No se puede eliminar la categoría porque tiene artículos asociados')
      }

      await prisma.categoriaArticulo.delete({ 
        where: { id } 
      })
    } catch (error) {
      console.error('Error en delete:', error)
      throw error
    }
  },

  async createCategoriasDefecto(empresaId: number): Promise<CategoriaArticulo[]> {
    try {
      // Verificar que la empresa existe
      const empresaExists = await prisma.empresa.findUnique({
        where: { id: empresaId }
      })

      if (!empresaExists) {
        throw new Error('La empresa especificada no existe')
      }

      // Verificar cuántas categorías ya tiene la empresa
      const categoriasExistentes = await prisma.categoriaArticulo.count({
        where: { empresaId }
      })

      if (categoriasExistentes > 0) {
        throw new Error('Ya tienes categorías creadas. Las categorías por defecto solo se pueden crear en empresas sin categorías.')
      }

      // Crear todas las categorías predeterminadas
      const categoriasCreadas = await Promise.all(
        CATEGORIAS_PREDETERMINADAS.map(categoria =>
          prisma.categoriaArticulo.create({
            data: {
              ...categoria,
              empresaId
            }
          })
        )
      )

      return categoriasCreadas
    } catch (error) {
      console.error('Error en createCategoriasDefecto:', error)
      throw error
    }
  },

  async getById(id: number, empresaId: number): Promise<CategoriaArticulo | null> {
    try {
      const categoria = await prisma.categoriaArticulo.findFirst({
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

      return categoria
    } catch (error) {
      console.error('Error en getById:', error)
      throw new Error('Error al obtener categoría por ID')
    }
  }
}

export default CategoriaArticuloService