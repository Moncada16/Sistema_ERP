// Backend: service/service.ts - ELIMINACIÓN SEGURA COMPLETA
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

// ✅ VERIFICACIÓN COMPLETA DE DEPENDENCIAS
export const verificarDependencias = async (id: number) => {
  try {
    // 1. Obtener valores del tipo de variante
    const valores = await prisma.valorVariante.findMany({
      where: { tipoVarianteId: id },
      select: {
        id: true,
        nombre: true, // Campo correcto según tu esquema
        tipoVarianteId: true,
        articuloValores: {
          select: {
            id: true,
            articuloId: true,
            valorId: true,
            // Si quieres incluir datos del artículo, descomenta:
            // articulo: {
            //   select: {
            //     id: true,
            //     nombre: true
            //   }
            // }
          }
        }
      }
    })

    // 2. Contar dependencias críticas
    let totalArticulosAfectados = 0
    let valoresConDependencias: any[] = []
    
    valores.forEach(valor => {
      if (valor.articuloValores.length > 0) {
        totalArticulosAfectados += valor.articuloValores.length
        valoresConDependencias.push({
          id: valor.id,
          nombre: valor.nombre,
          articulosCount: valor.articuloValores.length
        })
      }
    })

    const puedeEliminar = totalArticulosAfectados === 0

    return {
      valoresCount: valores.length,
      valores: valores.map(v => ({
        id: v.id,
        valor: v.nombre, // Mapeo nombre → valor para el frontend
        tipoVarianteId: v.tipoVarianteId,
        articulosCount: v.articuloValores.length
      })),
      puedeEliminar,
      dependencias: {
        valores: valores.length,
        articulosAfectados: totalArticulosAfectados,
        valoresConDependencias
      },
      razonBloqueo: !puedeEliminar 
        ? `Este tipo tiene ${valores.length} valor(es), de los cuales ${valoresConDependencias.length} están siendo usados en ${totalArticulosAfectados} producto(s).`
        : null
    }
  } catch (error) {
    console.error('Error en verificarDependencias:', error)
    throw new Error('Error al verificar dependencias del tipo de variante')
  }
}

// ✅ ELIMINACIÓN SOLO SI ES COMPLETAMENTE SEGURA
export const eliminar = async (id: number) => {
  try {
    // 1. Verificación completa de dependencias
    const verificacion = await verificarDependencias(id)
    
    if (!verificacion.puedeEliminar) {
      throw new Error(verificacion.razonBloqueo || 'No se puede eliminar por dependencias activas')
    }

    // 2. Verificar que el tipo existe
    const tipoExistente = await prisma.tipoVariante.findUnique({
      where: { id }
    })
    
    if (!tipoExistente) {
      throw new Error('El tipo de variante no existe')
    }

    // 3. Eliminar valores (solo si no tienen dependencias)
    const valoresEliminados = await prisma.valorVariante.deleteMany({
      where: { tipoVarianteId: id }
    })
    
    // 4. Eliminar el tipo de variante
    const tipoEliminado = await prisma.tipoVariante.delete({ 
      where: { id } 
    })

    return {
      mensaje: 'Tipo de variante eliminado exitosamente',
      tipo: tipoEliminado,
      valoresEliminados: valoresEliminados.count
    }
  } catch (error: any) {
    console.error('Error en eliminar:', error)
    throw error
  }
}

// ✅ ELIMINACIÓN FORZADA (SOLO PARA ADMIN - ÚSALA CON CUIDADO)
export const eliminarForzado = async (id: number) => {
  try {
    console.warn(`⚠️ ELIMINACIÓN FORZADA del tipo de variante ${id}`)
    
    // 1. Eliminar dependencias en cascada
    const valores = await prisma.valorVariante.findMany({
      where: { tipoVarianteId: id }
    })

    // 2. Eliminar ArticuloVariante que dependen de estos valores
    for (const valor of valores) {
      await prisma.articuloVariante.deleteMany({
        where: { valorId: valor.id } // Campo correcto: valorId
      })
    }

    // 3. Eliminar valores
    await prisma.valorVariante.deleteMany({
      where: { tipoVarianteId: id }
    })
    
    // 4. Eliminar tipo
    const tipoEliminado = await prisma.tipoVariante.delete({ 
      where: { id } 
    })

    return {
      mensaje: 'Tipo de variante eliminado forzadamente (incluyendo dependencias)',
      tipo: tipoEliminado,
      advertencia: 'Se eliminaron productos que dependían de este tipo'
    }
  } catch (error: any) {
    console.error('Error en eliminarForzado:', error)
    throw error
  }
}

// ✅ FUNCIÓN AUXILIAR: Obtener productos afectados
export const obtenerProductosAfectados = async (id: number) => {
  try {
    const valores = await prisma.valorVariante.findMany({
      where: { tipoVarianteId: id },
      include: {
        articuloValores: {
          select: {
            id: true,
            articuloId: true,
            valorId: true,
            // Descomenta si tienes la relación con Articulo
            // articulo: {
            //   select: {
            //     id: true,
            //     nombre: true,
            //     codigo: true
            //   }
            // }
          }
        }
      }
    })

    const productosAfectados = valores.flatMap(valor => 
      valor.articuloValores.map(av => ({
        articuloVarianteId: av.id,
        articuloId: av.articuloId,
        valorVariante: valor.nombre,
        valorId: av.valorId
      }))
    )

    return {
      totalProductos: productosAfectados.length,
      productos: productosAfectados
    }
  } catch (error) {
    console.error('Error obteniendo productos afectados:', error)
    throw error
  }
}