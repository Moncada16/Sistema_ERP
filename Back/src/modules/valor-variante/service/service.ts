import prisma from '../../../../prisma/client'

// ✅ CREAR ValorVariante SIN articuloId (solo nombre y tipoVarianteId)
export const crear = async (tipoVarianteId: number, nombre: string) => {
  return await prisma.valorVariante.create({
    data: { 
      nombre, 
      tipoVarianteId
      // ❌ REMOVIDO: articuloId (no existe en el modelo)
      // ❌ REMOVIDO: valor (parámetro duplicado con nombre)
    },
    include: {
      tipoVariante: true
    }
  })
}

// ✅ CREAR ValorVariante Y vincular a artículo en una sola operación
export const crearYVincular = async (tipoVarianteId: number, nombre: string, articuloId: number) => {
  // Primero crear el ValorVariante
  const valorVariante = await prisma.valorVariante.create({
    data: { 
      nombre, 
      tipoVarianteId
    },
    include: {
      tipoVariante: true
    }
  })

  // Luego crear la relación en ArticuloVariante
  await prisma.articuloVariante.create({
    data: {
      articuloId: articuloId,
      valorId: valorVariante.id
    }
  })

  return valorVariante
}

export const listarPorTipo = async (tipoVarianteId: number) => {
  return await prisma.valorVariante.findMany({
    where: { tipoVarianteId },
    include: {
      tipoVariante: true,
      articuloValores: {
        include: {
          articulo: {
            select: {
              id: true,
              nombre: true,
              codigo: true
            }
          }
        }
      }
    }
  })
}

// ✅ LISTAR valores de variante de un artículo específico
export const listarPorArticulo = async (articuloId: number) => {
  return await prisma.articuloVariante.findMany({
    where: { articuloId },
    include: {
      valor: {
        include: {
          tipoVariante: true
        }
      }
    }
  })
}

export const actualizar = async (id: number, nombre: string) => {
  return await prisma.valorVariante.update({
    where: { id },
    data: { nombre },
    include: {
      tipoVariante: true
    }
  })
}

export const eliminar = async (id: number) => {
  // ✅ PRIMERO eliminar las relaciones en ArticuloVariante
  await prisma.articuloVariante.deleteMany({
    where: { valorId: id }
  })

  // ✅ LUEGO eliminar el ValorVariante
  return await prisma.valorVariante.delete({
    where: { id }
  })
}

// ✅ FUNCIÓN AUXILIAR: Buscar o crear ValorVariante
export const buscarOCrear = async (tipoVarianteId: number, nombre: string) => {
  // Buscar si ya existe
  let valorVariante = await prisma.valorVariante.findFirst({
    where: {
      nombre: nombre,
      tipoVarianteId: tipoVarianteId
    },
    include: {
      tipoVariante: true
    }
  })

  // Si no existe, crearlo
  if (!valorVariante) {
    valorVariante = await prisma.valorVariante.create({
      data: {
        nombre: nombre,
        tipoVarianteId: tipoVarianteId
      },
      include: {
        tipoVariante: true
      }
    })
  }

  return valorVariante
}