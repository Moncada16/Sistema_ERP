import prisma from '../../../../prisma/client'

export const crearArticulo = async (
  empresaId: number,
  nombre: string,
  descripcion: string,
  precio: number,
  variantes?: { tipoVarianteId: number; valor: string }[],
  precios?: { tipoPrecioId: number; valor: number }[]
) => {
  console.log('🔥 SERVICE - Iniciando creación simple')
  
  const count = await prisma.articulo.count({ where: { empresaId } })
  const codigo = `ART-${empresaId.toString().padStart(3, '0')}-${(count + 1).toString().padStart(4, '0')}`

  console.log('🔥 SERVICE - Código generado:', codigo)
  console.log('🔥 SERVICE - Datos a crear:', { nombre, descripcion, precio, codigo, empresaId })

  // ✅ CREAR SOLO LOS CAMPOS BÁSICOS DEL ARTÍCULO
  try {
    const articulo = await prisma.articulo.create({
      data: {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        codigo: codigo,
        empresaId: empresaId
      }
    })

    console.log('✅ SERVICE - Artículo creado exitosamente:', articulo)

    // ✅ CREAR VARIANTES SI EXISTEN (usando la tabla intermedia)
    if (Array.isArray(variantes) && variantes.length > 0) {
      console.log('🔥 SERVICE - Creando variantes para artículo:', articulo.id)
      
      for (const variante of variantes) {
        // Primero buscar o crear el ValorVariante
        let valorVariante = await prisma.valorVariante.findFirst({
          where: {
            nombre: variante.valor,
            tipoVarianteId: variante.tipoVarianteId
          }
        })

        // Si no existe, crearlo
        if (!valorVariante) {
          valorVariante = await prisma.valorVariante.create({
            data: {
              nombre: variante.valor,
              tipoVarianteId: variante.tipoVarianteId
            }
          })
        }

        // Crear la relación en la tabla intermedia
        await prisma.articuloVariante.create({
          data: {
            articuloId: articulo.id,
            valorId: valorVariante.id  // ✅ CORREGIDO: valorId en lugar de valorVarianteId
          }
        })
      }
    }

    // ✅ CREAR PRECIOS SI EXISTEN
    if (Array.isArray(precios) && precios.length > 0) {
      console.log('🔥 SERVICE - Creando precios para artículo:', articulo.id)
      
      for (const precio of precios) {
        await prisma.precioArticulo.create({
          data: {
            valor: precio.valor,
            tipoPrecioId: precio.tipoPrecioId,
            articuloId: articulo.id
          }
        })
      }
    }

    // ✅ RETORNAR EL ARTÍCULO COMPLETO CON SUS RELACIONES
    return await prisma.articulo.findUnique({
      where: { id: articulo.id },
      include: {
        articuloValores: {
          include: {
            valor: {
              include: {
                tipoVariante: true
              }
            }
          }
        },
        precios: {
          include: {
            tipoPrecio: true
          }
        },
        fotos: true
      }
    })

  } catch (error) {
    console.error('❌ SERVICE - Error en la creación:', error)
    throw error
  }
}

export const listarArticulos = async (empresaId: number) => {
  try {
    return await prisma.articulo.findMany({
      where: { empresaId },
      include: {
        articuloValores: {
          include: {
            valor: {
              include: {
                tipoVariante: true
              }
            }
          }
        },
        precios: {
          include: {
            tipoPrecio: true
          }
        },
        fotos: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('❌ SERVICE - Error al listar artículos:', error)
    throw error
  }
}

export const obtenerArticuloPorId = async (id: number) => {
  try {
    return await prisma.articulo.findUnique({
      where: { id },
      include: {
        articuloValores: {
          include: {
            valor: {
              include: {
                tipoVariante: true
              }
            }
          }
        },
        precios: {
          include: {
            tipoPrecio: true
          }
        },
        fotos: true,
        empresa: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    })
  } catch (error) {
    console.error('❌ SERVICE - Error al obtener artículo por ID:', error)
    throw error
  }
}

export const actualizarArticulo = async (
  id: number, 
  data: {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    fotoPrincipal?: string;
    variantes?: { tipoVarianteId: number; valor: string }[];
    precios?: { tipoPrecioId: number; valor: number }[];
  }
) => {
  try {
    const { variantes, precios, ...articuloData } = data

    // ✅ ACTUALIZAR CAMPOS BÁSICOS
    await prisma.articulo.update({
      where: { id },
      data: articuloData
    })

    // ✅ ACTUALIZAR VARIANTES SI SE PROPORCIONAN
    if (variantes) {
      // Eliminar relaciones existentes
      await prisma.articuloVariante.deleteMany({
        where: { articuloId: id }
      })

      // Crear nuevas relaciones
      for (const variante of variantes) {
        let valorVariante = await prisma.valorVariante.findFirst({
          where: {
            nombre: variante.valor,
            tipoVarianteId: variante.tipoVarianteId
          }
        })

        if (!valorVariante) {
          valorVariante = await prisma.valorVariante.create({
            data: {
              nombre: variante.valor,
              tipoVarianteId: variante.tipoVarianteId
            }
          })
        }

        await prisma.articuloVariante.create({
          data: {
            articuloId: id,
            valorId: valorVariante.id  // ✅ CORREGIDO: valorId
          }
        })
      }
    }

    // ✅ ACTUALIZAR PRECIOS SI SE PROPORCIONAN
    if (precios) {
      await prisma.precioArticulo.deleteMany({
        where: { articuloId: id }
      })

      for (const precio of precios) {
        await prisma.precioArticulo.create({
          data: {
            valor: precio.valor,
            tipoPrecioId: precio.tipoPrecioId,
            articuloId: id
          }
        })
      }
    }

    // ✅ RETORNAR ARTÍCULO ACTUALIZADO
    return await prisma.articulo.findUnique({
      where: { id },
      include: {
        articuloValores: {
          include: {
            valor: {
              include: {
                tipoVariante: true
              }
            }
          }
        },
        precios: {
          include: {
            tipoPrecio: true
          }
        }
      }
    })
  } catch (error) {
    console.error('❌ SERVICE - Error al actualizar artículo:', error)
    throw error
  }
}

export const eliminarArticulo = async (id: number) => {
  try {
    // ✅ ELIMINAR RELACIONES PRIMERO (por las foreign keys)
    await prisma.articuloVariante.deleteMany({
      where: { articuloId: id }
    })

    await prisma.precioArticulo.deleteMany({
      where: { articuloId: id }
    })

    // ✅ ELIMINAR EL ARTÍCULO
    return await prisma.articulo.delete({
      where: { id }
    })
  } catch (error) {
    console.error('❌ SERVICE - Error al eliminar artículo:', error)
    throw error
  }
}