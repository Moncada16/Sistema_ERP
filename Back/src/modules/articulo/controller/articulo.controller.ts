// ================================
// ARTÍCULO CONTROLLER - CON FUNCIONES SKU INTEGRADAS
// Ubicación: src/modules/articulo/controller/articulo.controller.ts
// ================================

import { Request, Response } from 'express'
import * as service from '../service/articulo.service'

// 🚀 IMPORTAR SERVICIOS SKU
import * as skuService from '../../articulo-sku/service/sku.service'
// import * as skuAdditionalService from '../../articulo-sku/service/sku-additional.service'

interface ArticuloRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  variantes?: { tipoVarianteId: number; valor: string }[];
  precios?: { tipoPrecioId: number; valor: number }[];
}

// ============================================
// FUNCIONES EXISTENTES (SIN CAMBIOS)
// ============================================

export const crearArticulo = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔥 === INICIO crearArticulo ===')
    console.log('🔥 req.user:', req.user)
    console.log('🔥 req.body:', JSON.stringify(req.body, null, 2))
    
    const empresaId = req.user?.empresaId
    const { nombre, descripcion, precio, variantes, precios }: ArticuloRequest = req.body

    console.log('🔥 empresaId extraído:', empresaId)
    console.log('🔥 datos extraídos:', { nombre, descripcion, precio, variantes, precios })

    if (typeof empresaId !== 'number') {
      console.log('❌ empresaId no es número:', typeof empresaId)
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    if (!nombre || !precio || precio <= 0) {
      console.log('❌ Validación falló:', { nombre: !!nombre, precio, precioValido: precio > 0 })
      res.status(400).json({ error: 'Nombre y precio son requeridos. El precio debe ser mayor a 0.' })
      return
    }

    console.log('✅ Validaciones pasaron, llamando al service...')
    console.log('🔥 Parámetros para service:', {
      empresaId, 
      nombre, 
      descripcion: descripcion || '', 
      precio,
      variantes,
      precios
    })

    const articulo = await service.crearArticulo(
      empresaId, 
      nombre, 
      descripcion || '', 
      precio,
      variantes,
      precios
    )
    
    console.log('✅ Service devolvió:', articulo)
    console.log('🔥 === FIN crearArticulo EXITOSO ===')
    
    res.status(201).json(articulo)
  } catch (error) {
    console.error('❌ === ERROR en crearArticulo ===')
    console.error('❌ Error completo:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack available')
    console.error('❌ Error message:', error instanceof Error ? error.message : String(error))
    console.error('❌ === FIN ERROR ===')
    
    res.status(500).json({ error: 'Error interno del servidor al crear artículo' })
  }
}

export const listarArticulos = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId

    if (typeof empresaId !== 'number') {
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    const articulos = await service.listarArticulos(empresaId)
    
    res.status(200).json(articulos)
  } catch (error) {
    console.error('Error al listar artículos:', error)
    res.status(500).json({ error: 'Error interno del servidor al listar artículos' })
  }
}

export const obtenerArticuloPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' })
      return
    }

    const articulo = await service.obtenerArticuloPorId(id)
    
    if (!articulo) {
      res.status(404).json({ error: 'Artículo no encontrado' })
      return
    }

    res.status(200).json(articulo)
  } catch (error) {
    console.error('Error al obtener artículo:', error)
    res.status(500).json({ error: 'Error interno del servidor al obtener artículo' })
  }
}

export const actualizarArticulo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' })
      return
    }

    const articuloExistente = await service.obtenerArticuloPorId(id)
    if (!articuloExistente) {
      res.status(404).json({ error: 'Artículo no encontrado' })
      return
    }

    const articulo = await service.actualizarArticulo(id, req.body)
    res.status(200).json(articulo)
  } catch (error) {
    console.error('Error al actualizar artículo:', error)
    res.status(500).json({ error: 'Error interno del servidor al actualizar artículo' })
  }
}

export const eliminarArticulo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' })
      return
    }

    const articuloExistente = await service.obtenerArticuloPorId(id)
    if (!articuloExistente) {
      res.status(404).json({ error: 'Artículo no encontrado' })
      return
    }

    await service.eliminarArticulo(id)
    res.status(200).json({ message: 'Artículo eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar artículo:', error)
    res.status(500).json({ error: 'Error interno del servidor al eliminar artículo' })
  }
}

// ============================================
// 🚀 NUEVAS FUNCIONES SKU INTEGRADAS
// ============================================

// ✅ RESOLVER ERROR 404 - Obtener variantes (ahora SKUs) de un artículo
export const obtenerVariantesArticulo = async (req: Request, res: Response): Promise<void> => {
  try {
    const articuloId = parseInt(req.params.id)

    console.log('🔍 Obteniendo variantes/SKUs del artículo:', articuloId)

    if (isNaN(articuloId)) {
      res.status(400).json({ error: 'ID de artículo inválido' })
      return
    }

    // Verificar que el artículo existe
    const articulo = await service.obtenerArticuloPorId(articuloId)
    if (!articulo) {
      res.status(404).json({ error: 'Artículo no encontrado' })
      return
    }

    // Obtener SKUs del artículo
    const skus = await skuService.listarSkusPorArticulo(articuloId)

    console.log(`✅ ${skus.length} SKUs encontrados para el artículo`)

    // Formato compatible con frontend existente
    const variantes = skus.map(sku => ({
      id: sku.id,
      sku: sku.sku,
      codigoBarras: sku.codigoBarras,
      nombre: sku.combinacion.map(c => c.valor).join(' - '),
      combinacion: sku.combinacion,
      precio: sku.precioBase || sku.articulo.precio,
      stock: sku.inventario.reduce((total, inv) => total + inv.cantidad, 0),
      activo: sku.activo
    }))

    res.status(200).json(variantes)

  } catch (error: any) {
    console.error('❌ Error obteniendo variantes del artículo:', error)
    res.status(500).json({ error: 'Error interno del servidor al obtener variantes' })
  }
}

// ✅ Obtener artículo completo con SKUs
export const obtenerArticuloCompleto = async (req: Request, res: Response): Promise<void> => {
  try {
    const articuloId = parseInt(req.params.id)

    console.log('🔍 Obteniendo artículo completo con SKUs:', articuloId)

    if (isNaN(articuloId)) {
      res.status(400).json({ error: 'ID de artículo inválido' })
      return
    }

    // Obtener artículo básico
    const articulo = await service.obtenerArticuloPorId(articuloId)
    if (!articulo) {
      res.status(404).json({ error: 'Artículo no encontrado' })
      return
    }

    // Obtener SKUs del artículo
    const skus = await skuService.listarSkusPorArticulo(articuloId)

    // Obtener estadísticas
    const stockTotal = skus.reduce((total, sku) => 
      total + sku.inventario.reduce((inv, item) => inv + item.cantidad, 0), 0
    )

    const valorInventario = skus.reduce((total, sku) => {
      const precio = sku.precioBase || articulo.precio
      const stock = sku.inventario.reduce((inv, item) => inv + item.cantidad, 0)
      return total + (precio * stock)
    }, 0)

    const resultado = {
      ...articulo,
      skus,
      estadisticas: {
        totalSkus: skus.length,
        skusActivos: skus.filter(s => s.activo).length,
        stockTotal,
        valorInventario,
        skusConStock: skus.filter(s => 
          s.inventario.some(inv => inv.cantidad > 0)
        ).length
      }
    }

    console.log('✅ Artículo completo obtenido exitosamente')
    res.status(200).json(resultado)

  } catch (error: any) {
    console.error('❌ Error obteniendo artículo completo:', error)
    res.status(500).json({ error: 'Error interno del servidor al obtener artículo completo' })
  }
}

// ✅ Generar SKUs masivos para un artículo
export const generarSkusMasivos = async (req: Request, res: Response): Promise<void> => {
  try {
    const articuloId = parseInt(req.params.id)

    console.log('🔄 Generando SKUs masivos para artículo:', articuloId)

    if (isNaN(articuloId)) {
      res.status(400).json({ error: 'ID de artículo inválido' })
      return
    }

    // Verificar que el artículo existe
    const articulo = await service.obtenerArticuloPorId(articuloId)
    if (!articulo) {
      res.status(404).json({ error: 'Artículo no encontrado' })
      return
    }

    // Generar SKUs masivos
    const skus = await skuService.generarSkusMasivos(articuloId)

    console.log(`✅ ${skus.length} SKUs generados masivamente`)

    res.status(201).json({
      message: `${skus.length} SKUs generados exitosamente`,
      articulo: {
        id: articulo.id,
        nombre: articulo.nombre,
        codigo: articulo.codigo
      },
      skusGenerados: skus.length,
      skus
    })

  } catch (error: any) {
    console.error('❌ Error generando SKUs masivos:', error)
    
    if (error.message.includes('no tiene variantes')) {
      res.status(400).json({ 
        error: 'El artículo debe tener variantes configuradas para generar SKUs',
        sugerencia: 'Agregue tipos de variante (color, talla, etc.) al artículo primero'
      })
    } else {
      res.status(500).json({ error: 'Error interno del servidor al generar SKUs' })
    }
  }
}

// ✅ Obtener estadísticas de SKUs de un artículo
export const obtenerEstadisticasArticulo = async (req: Request, res: Response): Promise<void> => {
  try {
    const articuloId = parseInt(req.params.id)

    console.log('📊 Obteniendo estadísticas del artículo:', articuloId)

    if (isNaN(articuloId)) {
      res.status(400).json({ error: 'ID de artículo inválido' })
      return
    }

    // Verificar que el artículo existe
    const articulo = await service.obtenerArticuloPorId(articuloId)
    if (!articulo) {
      res.status(404).json({ error: 'Artículo no encontrado' })
      return
    }

    // Obtener SKUs del artículo
    const skus = await skuService.listarSkusPorArticulo(articuloId)

    // Calcular estadísticas
    const estadisticas = {
      articulo: {
        id: articulo.id,
        nombre: articulo.nombre,
        codigo: articulo.codigo
      },
      skus: {
        total: skus.length,
        activos: skus.filter(s => s.activo).length,
        inactivos: skus.filter(s => !s.activo).length
      },
      inventario: {
        stockTotal: skus.reduce((total, sku) => 
          total + sku.inventario.reduce((inv, item) => inv + item.cantidad, 0), 0
        ),
        skusConStock: skus.filter(s => 
          s.inventario.some(inv => inv.cantidad > 0)
        ).length,
        skusSinStock: skus.filter(s => 
          s.inventario.every(inv => inv.cantidad === 0)
        ).length,
        valorTotal: skus.reduce((total, sku) => {
          const precio = sku.precioBase || articulo.precio
          const stock = sku.inventario.reduce((inv, item) => inv + item.cantidad, 0)
          return total + (precio * stock)
        }, 0)
      },
      variantes: {
        tipos: [...new Set(skus.flatMap(s => s.combinacion.map(c => c.tipo)))],
        combinacionesUnicas: skus.length,
        distribucion: skus.reduce((acc, sku) => {
          sku.combinacion.forEach(comb => {
            if (!acc[comb.tipo]) {
              acc[comb.tipo] = {}
            }
            if (!acc[comb.tipo][comb.valor]) {
              acc[comb.tipo][comb.valor] = 0
            }
            acc[comb.tipo][comb.valor]++
          })
          return acc
        }, {} as any)
      }
    }

    console.log('✅ Estadísticas calculadas exitosamente')
    res.status(200).json(estadisticas)

  } catch (error: any) {
    console.error('❌ Error obteniendo estadísticas:', error)
    res.status(500).json({ error: 'Error interno del servidor al obtener estadísticas' })
  }
}

// ✅ Buscar artículos con información de SKUs
export const buscarArticulosConSkus = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId
    const { query, conStock, page = 1, limit = 20 } = req.query

    console.log('🔍 Buscando artículos con SKUs:', { empresaId, query, conStock })

    if (typeof empresaId !== 'number') {
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    // Obtener artículos básicos
    const articulos = await service.listarArticulos(empresaId)

    // Filtrar por query si se proporciona
    let articulosFiltrados = articulos
    if (query && typeof query === 'string') {
      const queryLower = query.toLowerCase()
      articulosFiltrados = articulos.filter(articulo => 
        articulo.nombre.toLowerCase().includes(queryLower) ||
        articulo.codigo.toLowerCase().includes(queryLower) ||
        (articulo.descripcion && articulo.descripcion.toLowerCase().includes(queryLower))
      )
    }

    // Enriquecer con información de SKUs
    const articulosConSkus = await Promise.all(
      articulosFiltrados.map(async (articulo) => {
        const skus = await skuService.listarSkusPorArticulo(articulo.id)
        
        const stockTotal = skus.reduce((total, sku) => 
          total + sku.inventario.reduce((inv, item) => inv + item.cantidad, 0), 0
        )

        const tieneStock = stockTotal > 0

        return {
          ...articulo,
          totalSkus: skus.length,
          skusActivos: skus.filter(s => s.activo).length,
          stockTotal,
          tieneStock,
          skus: skus.map(sku => ({
            id: sku.id,
            sku: sku.sku,
            combinacion: sku.combinacion.map(c => c.valor).join(' - '),
            stock: sku.inventario.reduce((total, inv) => total + inv.cantidad, 0)
          }))
        }
      })
    )

    // Filtrar por stock si se solicita
    let resultadoFinal = articulosConSkus
    if (conStock === 'true') {
      resultadoFinal = articulosConSkus.filter(art => art.tieneStock)
    }

    // Paginación
    const pageNum = parseInt(page as string) || 1
    const limitNum = parseInt(limit as string) || 20
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum

    const resultadoPaginado = resultadoFinal.slice(startIndex, endIndex)

    console.log(`✅ ${resultadoPaginado.length}/${resultadoFinal.length} artículos encontrados`)

    res.status(200).json({
      articulos: resultadoPaginado,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: resultadoFinal.length,
        totalPages: Math.ceil(resultadoFinal.length / limitNum)
      }
    })

  } catch (error: any) {
    console.error('❌ Error buscando artículos con SKUs:', error)
    res.status(500).json({ error: 'Error interno del servidor al buscar artículos' })
  }
}