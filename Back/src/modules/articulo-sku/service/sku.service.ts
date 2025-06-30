// ================================
// SKU SERVICE COMPLETO - TODAS LAS FUNCIONES
// Ubicación: src/modules/articulo-sku/service/sku.service.ts
// ================================

import prisma from '../../../../prisma/client'

// ============================================
// INTERFACES Y TIPOS
// ============================================

export interface CrearSkuDTO {
  articuloId: number
  combinacionVariantes: number[] // IDs de ValorVariante
  precioBase?: number
  codigoBarras?: string
}

export interface SkuCompletoDTO {
  id: number
  sku: string
  codigoBarras?: string
  precioBase?: number
  activo: boolean
  articulo: {
    id: number
    nombre: string
    codigo: string
    descripcion?: string
    precio: number
  }
  combinacion: {
    tipo: string
    valor: string
    codigo?: string
    hexColor?: string
    imagen?: string
  }[]
  inventario: {
    bodegaId: number
    bodegaNombre: string
    cantidad: number
    minimo: number
    ubicacion?: string
  }[]
  precios: {
    tipo: string
    valor: number
  }[]
}

export interface FiltrosBusquedaSkus {
  query?: string
  articuloId?: number
  activo?: boolean
  conStock?: boolean
  page: number
  limit: number
}

export interface ResultadoBusquedaSkus {
  skus: SkuCompletoDTO[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface EstadisticasSkus {
  totalSkus: number
  skusActivos: number
  skusConStock: number
  stockBajo: number
  valorTotalInventario: number
  articulosConSkus: number
  promedioSkusPorArticulo: number
  topArticulosConMasSkus: {
    articuloId: number
    articuloNombre: string
    cantidadSkus: number
  }[]
  distribucionPorVariante: {
    tipoVariante: string
    valores: {
      valor: string
      cantidad: number
    }[]
  }[]
}

export interface ReporteInventario {
  skus: {
    sku: string
    articulo: string
    bodega: string
    cantidad: number
    minimo: number
    estado: 'OK' | 'STOCK_BAJO' | 'SIN_STOCK'
    valorUnitario: number
    valorTotal: number
  }[]
  resumen: {
    totalItems: number
    valorTotal: number
    itemsStockBajo: number
    itemsSinStock: number
  }
  csv?: string
}

// ============================================
// GENERACIÓN AUTOMÁTICA DE SKUs
// ============================================

export const generarSkuAutomatico = async (
  articuloId: number,
  combinacionVariantes: number[]
): Promise<string> => {
  console.log('🏷️ Generando SKU automático...')
  
  // 1. Obtener información del artículo
  const articulo = await prisma.articulo.findUnique({
    where: { id: articuloId },
    select: { codigo: true, nombre: true }
  })

  if (!articulo) {
    throw new Error('Artículo no encontrado')
  }

  // 2. Obtener los valores de las variantes ordenados
  const valoresVariantes = await prisma.valorVariante.findMany({
    where: { id: { in: combinacionVariantes } },
    include: { tipoVariante: true },
    orderBy: { tipoVariante: { orden: 'asc' } }
  })

  // 3. Construir código base
  let codigoBase = articulo.codigo

  // 4. Agregar códigos de variantes
  const codigosVariantes = valoresVariantes.map(valor => {
    return valor.codigo || generarCodigoCorto(valor.nombre)
  })

  // 5. Contar SKUs existentes para numeración
  const countExistentes = await prisma.articuloSku.count({
    where: { articuloId }
  })

  // 6. Construir SKU final
  const numeroSecuencial = (countExistentes + 1).toString().padStart(3, '0')
  const skuFinal = `${codigoBase}-${codigosVariantes.join('-')}-${numeroSecuencial}`

  console.log('✅ SKU generado:', skuFinal)
  return skuFinal
}

const generarCodigoCorto = (nombre: string): string => {
  const limpio = nombre.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return limpio.substring(0, 3) || 'VAR'
}

// ============================================
// GENERACIÓN DE CÓDIGO DE BARRAS
// ============================================

export const generarCodigoBarras = async (): Promise<string> => {
  console.log('📊 Generando código de barras...')
  
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  let codigo = (timestamp + random).slice(-11)
  const digitoVerificador = calcularDigitoVerificadorEAN13(codigo)
  const codigoCompleto = codigo + digitoVerificador

  // Verificar que no exista
  const existe = await prisma.articuloSku.findUnique({
    where: { codigoBarras: codigoCompleto }
  })

  if (existe) {
    return await generarCodigoBarras() // Recursión si existe
  }

  console.log('✅ Código de barras generado:', codigoCompleto)
  return codigoCompleto
}

const calcularDigitoVerificadorEAN13 = (codigo: string): string => {
  let suma = 0
  
  for (let i = 0; i < codigo.length; i++) {
    const digito = parseInt(codigo[i])
    suma += i % 2 === 0 ? digito : digito * 3
  }
  
  const digitoVerificador = (10 - (suma % 10)) % 10
  return digitoVerificador.toString()
}

// ============================================
// CRUD DE SKUs
// ============================================

export const crearSku = async (data: CrearSkuDTO): Promise<SkuCompletoDTO> => {
  console.log('🚀 Creando SKU:', data)
  
  const { articuloId, combinacionVariantes, precioBase, codigoBarras } = data

  // 1. Validar combinación única
  const existeCombinacion = await validarCombinacionUnica(articuloId, combinacionVariantes)
  if (existeCombinacion) {
    throw new Error('Ya existe un SKU con esta combinación de variantes')
  }

  // 2. Generar SKU y código de barras
  const skuGenerado = await generarSkuAutomatico(articuloId, combinacionVariantes)
  const codigoBarrasGenerado = codigoBarras || await generarCodigoBarras()

  // 3. Crear el SKU
  const nuevoSku = await prisma.articuloSku.create({
    data: {
      sku: skuGenerado,
      codigoBarras: codigoBarrasGenerado,
      articuloId,
      precioBase
    }
  })

  // 4. Crear relaciones con variantes
  for (const valorVarianteId of combinacionVariantes) {
    await prisma.skuVariante.create({
      data: {
        skuId: nuevoSku.id,
        valorVarianteId
      }
    })
  }

  // 5. Inicializar inventario en todas las bodegas
  await inicializarInventarioSku(nuevoSku.id, articuloId)

  console.log('✅ SKU creado exitosamente:', nuevoSku.sku)
  return await obtenerSkuCompleto(nuevoSku.id)
}

export const listarSkusPorArticulo = async (articuloId: number): Promise<SkuCompletoDTO[]> => {
  console.log('📋 Listando SKUs del artículo:', articuloId)
  
  const skus = await prisma.articuloSku.findMany({
    where: { articuloId, activo: true },
    orderBy: { createdAt: 'desc' }
  })

  const skusCompletos: SkuCompletoDTO[] = []
  for (const sku of skus) {
    const skuCompleto = await obtenerSkuCompleto(sku.id)
    skusCompletos.push(skuCompleto)
  }

  return skusCompletos
}

export const obtenerSkuCompleto = async (skuId: number): Promise<SkuCompletoDTO> => {
  const sku = await prisma.articuloSku.findUnique({
    where: { id: skuId },
    include: {
      articulo: {
        include: {
          precios: {
            include: { tipoPrecio: true }
          }
        }
      },
      combinacion: {
        include: {
          valorVariante: {
            include: { tipoVariante: true }
          }
        },
        orderBy: {
          valorVariante: {
            tipoVariante: { orden: 'asc' }
          }
        }
      },
      inventario: {
        include: { bodega: true }
      }
    }
  })

  if (!sku) {
    throw new Error('SKU no encontrado')
  }

  return {
    id: sku.id,
    sku: sku.sku,
    codigoBarras: sku.codigoBarras || undefined,
    precioBase: sku.precioBase || undefined,
    activo: sku.activo,
    articulo: {
      id: sku.articulo.id,
      nombre: sku.articulo.nombre,
      codigo: sku.articulo.codigo,
      descripcion: sku.articulo.descripcion || undefined,
      precio: sku.articulo.precio
    },
    combinacion: sku.combinacion.map(c => ({
      tipo: c.valorVariante.tipoVariante.nombre,
      valor: c.valorVariante.nombre,
      codigo: c.valorVariante.codigo || undefined,
      hexColor: c.valorVariante.hexColor || undefined,
      imagen: c.valorVariante.imagen || undefined
    })),
    inventario: sku.inventario.map(inv => ({
      bodegaId: inv.bodegaId,
      bodegaNombre: inv.bodega.nombre,
      cantidad: inv.cantidad,
      minimo: inv.minimo,
      ubicacion: inv.ubicacion || undefined
    })),
    precios: sku.articulo.precios.map(p => ({
      tipo: p.tipoPrecio.nombre,
      valor: p.valor
    }))
  }
}

export const actualizarSku = async (
  skuId: number,
  data: {
    precioBase?: number
    activo?: boolean
    codigoBarras?: string
  }
): Promise<SkuCompletoDTO> => {
  console.log('✏️ Actualizando SKU:', skuId, data)
  
  await prisma.articuloSku.update({
    where: { id: skuId },
    data
  })

  return await obtenerSkuCompleto(skuId)
}

export const eliminarSku = async (skuId: number): Promise<void> => {
  console.log('🗑️ Eliminando SKU:', skuId)
  
  // Verificar si tiene movimientos de inventario
  const tieneMovimientos = await prisma.compraDetalle.findFirst({
    where: { skuId }
  })

  if (tieneMovimientos) {
    // Solo desactivar si tiene movimientos
    await prisma.articuloSku.update({
      where: { id: skuId },
      data: { activo: false }
    })
    console.log('⚠️ SKU desactivado (tenía movimientos)')
  } else {
    // Eliminar completamente si no tiene movimientos
    await prisma.skuVariante.deleteMany({
      where: { skuId }
    })
    
    await prisma.skuInventario.deleteMany({
      where: { skuId }
    })
    
    await prisma.articuloSku.delete({
      where: { id: skuId }
    })
    console.log('✅ SKU eliminado completamente')
  }
}

// ============================================
// BÚSQUEDA Y FILTROS
// ============================================

export const buscarSkus = async (
  empresaId: number,
  filtros: FiltrosBusquedaSkus
): Promise<ResultadoBusquedaSkus> => {
  console.log('🔍 Búsqueda avanzada de SKUs:', filtros)

  const { query, articuloId, activo, conStock, page, limit } = filtros

  // Construir condiciones WHERE dinámicamente
  const whereConditions: any = {
    articulo: { empresaId }
  }

  // Filtro por texto
  if (query && query.trim().length > 0) {
    whereConditions.OR = [
      { sku: { contains: query.trim(), mode: 'insensitive' } },
      { codigoBarras: { contains: query.trim(), mode: 'insensitive' } },
      { articulo: { nombre: { contains: query.trim(), mode: 'insensitive' } } },
      { articulo: { codigo: { contains: query.trim(), mode: 'insensitive' } } }
    ]
  }

  if (articuloId) {
    whereConditions.articuloId = articuloId
  }

  if (activo !== undefined) {
    whereConditions.activo = activo
  }

  if (conStock !== undefined && conStock) {
    whereConditions.inventario = {
      some: {
        cantidad: { gt: 0 }
      }
    }
  }

  const total = await prisma.articuloSku.count({ where: whereConditions })

  const skus = await prisma.articuloSku.findMany({
    where: whereConditions,
    orderBy: [
      { activo: 'desc' },
      { createdAt: 'desc' }
    ],
    skip: (page - 1) * limit,
    take: limit
  })

  const skusCompletos: SkuCompletoDTO[] = []
  for (const sku of skus) {
    const skuCompleto = await obtenerSkuCompleto(sku.id)
    skusCompletos.push(skuCompleto)
  }

  const totalPages = Math.ceil(total / limit)

  return {
    skus: skusCompletos,
    total,
    page,
    limit,
    totalPages
  }
}

export const buscarSkuPorCodigo = async (codigo: string) => {
  console.log('🔍 Buscando SKU por código:', codigo)

  const sku = await prisma.articuloSku.findFirst({
    where: {
      OR: [
        { sku: { equals: codigo, mode: 'insensitive' } },
        { codigoBarras: codigo }
      ],
      activo: true
    }
  })

  return sku
}

// ============================================
// GENERACIÓN MASIVA
// ============================================

export const generarSkusMasivos = async (articuloId: number): Promise<SkuCompletoDTO[]> => {
  console.log('🔄 Generando SKUs masivos para artículo:', articuloId)
  
  const articuloVariantes = await prisma.articuloVariante.findMany({
    where: { articuloId },
    include: {
      valor: {
        include: { tipoVariante: true }
      }
    }
  })

  if (articuloVariantes.length === 0) {
    throw new Error('El artículo no tiene variantes configuradas')
  }

  // Agrupar por tipo de variante
  const variantes: { [tipoId: number]: number[] } = {}
  
  articuloVariantes.forEach(av => {
    const tipoId = av.valor.tipoVarianteId
    if (!variantes[tipoId]) {
      variantes[tipoId] = []
    }
    variantes[tipoId].push(av.valor.id)
  })

  const tiposIds = Object.keys(variantes).map(Number)
  const combinaciones = generarCombinaciones(variantes, tiposIds)

  console.log(`📊 Se generarán ${combinaciones.length} SKUs`)

  const skusCreados: SkuCompletoDTO[] = []

  for (const combinacion of combinaciones) {
    try {
      const sku = await crearSku({
        articuloId,
        combinacionVariantes: combinacion
      })
      skusCreados.push(sku)
    } catch (error) {
      console.warn(`⚠️ Error creando SKU para combinación ${combinacion.join('-')}:`, error)
    }
  }

  console.log(`✅ Creados ${skusCreados.length} SKUs exitosamente`)
  return skusCreados
}

// ============================================
// ESTADÍSTICAS
// ============================================

export const obtenerEstadisticasSkus = async (empresaId: number): Promise<EstadisticasSkus> => {
  console.log('📊 Calculando estadísticas de SKUs para empresa:', empresaId)

  const [totalSkus, skusActivos, articulosConSkus] = await Promise.all([
    prisma.articuloSku.count({
      where: { articulo: { empresaId } }
    }),
    prisma.articuloSku.count({
      where: { articulo: { empresaId }, activo: true }
    }),
    prisma.articuloSku.groupBy({
      by: ['articuloId'],
      where: { articulo: { empresaId }, activo: true },
      _count: true
    })
  ])

  const skusConStock = await prisma.articuloSku.count({
    where: {
      articulo: { empresaId },
      activo: true,
      inventario: {
        some: { cantidad: { gt: 0 } }
      }
    }
  })

  const stockBajo = await prisma.skuInventario.count({
    where: {
      sku: { articulo: { empresaId } },
      cantidad: { lte: prisma.skuInventario.fields.minimo }
    }
  })

  const inventarioConPrecios = await prisma.skuInventario.findMany({
    where: {
      sku: { articulo: { empresaId } }
    },
    include: {
      sku: {
        include: {
          articulo: {
            include: {
              precios: {
                where: {
                  tipoPrecio: { nombre: 'Mayorista' }
                },
                take: 1
              }
            }
          }
        }
      }
    }
  })

  const valorTotalInventario = inventarioConPrecios.reduce((total, inv) => {
    const precio = inv.sku.precioBase || 
                  inv.sku.articulo.precios[0]?.valor || 
                  inv.sku.articulo.precio
    return total + (inv.cantidad * precio)
  }, 0)

  const topArticulos = await prisma.articuloSku.groupBy({
    by: ['articuloId'],
    where: { articulo: { empresaId }, activo: true },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5
  })

  const topArticulosDetalle = await Promise.all(
    topArticulos.map(async (item) => {
      const articulo = await prisma.articulo.findUnique({
        where: { id: item.articuloId },
        select: { nombre: true }
      })
      return {
        articuloId: item.articuloId,
        articuloNombre: articulo?.nombre || 'Desconocido',
        cantidadSkus: item._count.id
      }
    })
  )

  const promedioSkusPorArticulo = articulosConSkus.length > 0 
    ? totalSkus / articulosConSkus.length 
    : 0

  return {
    totalSkus,
    skusActivos,
    skusConStock,
    stockBajo,
    valorTotalInventario,
    articulosConSkus: articulosConSkus.length,
    promedioSkusPorArticulo: Math.round(promedioSkusPorArticulo * 100) / 100,
    topArticulosConMasSkus: topArticulosDetalle,
    distribucionPorVariante: [] // Se puede implementar después
  }
}

// ============================================
// REPORTES
// ============================================

export const generarReporteInventario = async (
  empresaId: number,
  filtros: { bodegaId?: number } = {}
): Promise<ReporteInventario> => {
  console.log('📋 Generando reporte de inventario:', filtros)

  const whereConditions: any = {
    sku: { articulo: { empresaId }, activo: true }
  }

  if (filtros.bodegaId) {
    whereConditions.bodegaId = filtros.bodegaId
  }

  const inventarios = await prisma.skuInventario.findMany({
    where: whereConditions,
    include: {
      sku: {
        include: {
          articulo: {
            include: {
              precios: {
                where: {
                  tipoPrecio: { nombre: 'Mayorista' }
                },
                take: 1
              }
            }
          }
        }
      },
      bodega: true
    },
    orderBy: [
      { bodega: { nombre: 'asc' } },
      { sku: { sku: 'asc' } }
    ]
  })

  const skus = inventarios.map(inv => {
    const precio = inv.sku.precioBase || 
                  inv.sku.articulo.precios[0]?.valor || 
                  inv.sku.articulo.precio

    let estado: 'OK' | 'STOCK_BAJO' | 'SIN_STOCK' = 'OK'
    if (inv.cantidad === 0) {
      estado = 'SIN_STOCK'
    } else if (inv.cantidad <= inv.minimo) {
      estado = 'STOCK_BAJO'
    }

    return {
      sku: inv.sku.sku,
      articulo: inv.sku.articulo.nombre,
      bodega: inv.bodega.nombre,
      cantidad: inv.cantidad,
      minimo: inv.minimo,
      estado,
      valorUnitario: precio,
      valorTotal: inv.cantidad * precio
    }
  })

  const resumen = {
    totalItems: skus.length,
    valorTotal: skus.reduce((total, item) => total + item.valorTotal, 0),
    itemsStockBajo: skus.filter(item => item.estado === 'STOCK_BAJO').length,
    itemsSinStock: skus.filter(item => item.estado === 'SIN_STOCK').length
  }

  return {
    skus,
    resumen,
    csv: generarCSVInventario(skus, resumen)
  }
}

const generarCSVInventario = (
  skus: ReporteInventario['skus'],
  resumen: ReporteInventario['resumen']
): string => {
  const headers = [
    'SKU',
    'Artículo',
    'Bodega',
    'Cantidad',
    'Mínimo',
    'Estado',
    'Valor Unitario',
    'Valor Total'
  ].join(',')

  const filas = skus.map(item => [
    item.sku,
    `"${item.articulo}"`,
    `"${item.bodega}"`,
    item.cantidad,
    item.minimo,
    item.estado,
    item.valorUnitario,
    item.valorTotal
  ].join(','))

  const resumenCSV = [
    '',
    'RESUMEN',
    `Total Items,${resumen.totalItems}`,
    `Valor Total,${resumen.valorTotal}`,
    `Items Stock Bajo,${resumen.itemsStockBajo}`,
    `Items Sin Stock,${resumen.itemsSinStock}`
  ].join('\n')

  return [headers, ...filas, resumenCSV].join('\n')
}

// ============================================
// GESTIÓN DE INVENTARIO
// ============================================

export const actualizarInventarioSku = async (
  skuId: number,
  bodegaId: number,
  cantidad: number,
  operacion: 'suma' | 'resta' | 'establecer' = 'establecer'
): Promise<void> => {
  console.log(`📦 Actualizando inventario SKU ${skuId}, operación: ${operacion}, cantidad: ${cantidad}`)
  
  const inventario = await prisma.skuInventario.findUnique({
    where: { 
      skuId_bodegaId_ubicacion: {skuId, bodegaId, ubicacion: null as unknown as string} // Asumiendo que la ubicación es opcional
    }
  })

  if (!inventario) {
    throw new Error('Inventario no encontrado')
  }

  let nuevaCantidad: number

  switch (operacion) {
    case 'suma':
      nuevaCantidad = inventario.cantidad + cantidad
      break
    case 'resta':
      nuevaCantidad = Math.max(0, inventario.cantidad - cantidad)
      break
    case 'establecer':
    default:
      nuevaCantidad = cantidad
      break
  }

  await prisma.skuInventario.update({
    where: {
      skuId_bodegaId_ubicacion: {
        skuId,
        bodegaId,
        ubicacion: inventario.ubicacion ?? null
      }
    },
    data: { cantidad: nuevaCantidad }
  })

  console.log(`✅ Inventario actualizado: ${inventario.cantidad} → ${nuevaCantidad}`)
}

export const obtenerStockTotal = async (skuId: number): Promise<number> => {
  const inventarios = await prisma.skuInventario.findMany({
    where: { skuId }
  })

  return inventarios.reduce((total, inv) => total + inv.cantidad, 0)
}

export const obtenerSkusConStockBajo = async (empresaId: number): Promise<SkuCompletoDTO[]> => {
  console.log('⚠️ Buscando SKUs con stock bajo...')
  
  const skusConStockBajo = await prisma.articuloSku.findMany({
    where: {
      articulo: { empresaId },
      activo: true,
      inventario: {
        some: {
          cantidad: { lte: prisma.skuInventario.fields.minimo }
        }
      }
    }
  })

  const skusCompletos: SkuCompletoDTO[] = []

  for (const sku of skusConStockBajo) {
    const skuCompleto = await obtenerSkuCompleto(sku.id)
    skusCompletos.push(skuCompleto)
  }

  console.log(`📊 Encontrados ${skusCompletos.length} SKUs con stock bajo`)
  return skusCompletos
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

export const validarCombinacionUnica = async (
  articuloId: number,
  combinacionVariantes: number[]
): Promise<boolean> => {
  const skusExistentes = await prisma.articuloSku.findMany({
    where: { articuloId },
    include: { combinacion: true }
  })

  for (const sku of skusExistentes) {
    const variantes = sku.combinacion.map(c => c.valorVarianteId).sort()
    const nuevasCombinacion = [...combinacionVariantes].sort()
    
    if (JSON.stringify(variantes) === JSON.stringify(nuevasCombinacion)) {
      return true
    }
  }

  return false
}

const inicializarInventarioSku = async (skuId: number, articuloId: number): Promise<void> => {
  const articulo = await prisma.articulo.findUnique({
    where: { id: articuloId },
    include: { empresa: { include: { bodegas: true } } }
  })

  if (articulo?.empresa.bodegas) {
    for (const bodega of articulo.empresa.bodegas) {
      await prisma.skuInventario.create({
        data: {
          skuId,
          bodegaId: bodega.id,
          cantidad: 0,
          minimo: 5
        }
      })
    }
  }
}

const generarCombinaciones = (
  variantes: { [tipoId: number]: number[] },
  tiposIds: number[],
  combinacionActual: number[] = [],
  indice: number = 0
): number[][] => {
  if (indice === tiposIds.length) {
    return [combinacionActual]
  }

  const tipoActual = tiposIds[indice]
  const valoresDelTipo = variantes[tipoActual]
  const todasLasCombinaciones: number[][] = []

  for (const valor of valoresDelTipo) {
    const nuevaCombinacion = [...combinacionActual, valor]
    const subcombinaciones = generarCombinaciones(
      variantes,
      tiposIds,
      nuevaCombinacion,
      indice + 1
    )
    todasLasCombinaciones.push(...subcombinaciones)
  }

  return todasLasCombinaciones
}