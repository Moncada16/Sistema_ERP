// ================================
// SKU CONTROLLER COMPLETO - TODAS LAS FUNCIONES
// Ubicación: src/modules/articulo-sku/controller/sku.controller.ts
// ================================

import { Request, Response } from 'express'
import * as skuService from '../service/sku.service'

// ============================================
// INTERFACES PARA REQUESTS
// ============================================

interface CrearSkuRequest {
  combinacionVariantes: number[]
  precioBase?: number
  codigoBarras?: string
}

interface ActualizarSkuRequest {
  precioBase?: number
  activo?: boolean
  codigoBarras?: string
}

interface ActualizarInventarioRequest {
  bodegaId: number
  cantidad: number
  operacion?: 'suma' | 'resta' | 'establecer'
}

interface BuscarSkusRequest {
  query?: string
  articuloId?: number
  activo?: boolean
  conStock?: boolean
  page?: number
  limit?: number
}

// ============================================
// ENDPOINTS PRINCIPALES
// ============================================

export const crearSku = async (req: Request, res: Response): Promise<void> => {
  try {
    const articuloId = parseInt(req.params.articuloId)
    const { combinacionVariantes, precioBase, codigoBarras }: CrearSkuRequest = req.body

    console.log('🎯 Controller - Crear SKU:', { articuloId, combinacionVariantes, precioBase })

    // Validaciones
    if (isNaN(articuloId)) {
      res.status(400).json({ error: 'ID de artículo inválido' })
      return
    }

    if (!Array.isArray(combinacionVariantes) || combinacionVariantes.length === 0) {
      res.status(400).json({ error: 'Combinación de variantes requerida' })
      return
    }

    // Verificar que todos los IDs de variantes sean números válidos
    const variantesValidas = combinacionVariantes.every(id => Number.isInteger(id) && id > 0)
    if (!variantesValidas) {
      res.status(400).json({ error: 'IDs de variantes inválidos' })
      return
    }

    const sku = await skuService.crearSku({
      articuloId,
      combinacionVariantes,
      precioBase,
      codigoBarras
    })

    console.log('✅ Controller - SKU creado exitosamente')
    res.status(201).json(sku)

  } catch (error: any) {
    console.error('❌ Controller - Error creando SKU:', error)
    
    if (error.message.includes('Ya existe un SKU')) {
      res.status(409).json({ error: error.message })
    } else if (error.message.includes('no encontrado')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Error interno del servidor al crear SKU' })
    }
  }
}

export const listarSkusPorArticulo = async (req: Request, res: Response): Promise<void> => {
  try {
    const articuloId = parseInt(req.params.articuloId)

    console.log('📋 Controller - Listar SKUs del artículo:', articuloId)

    if (isNaN(articuloId)) {
      res.status(400).json({ error: 'ID de artículo inválido' })
      return
    }

    const skus = await skuService.listarSkusPorArticulo(articuloId)

    console.log(`✅ Controller - ${skus.length} SKUs encontrados`)
    res.status(200).json(skus)

  } catch (error: any) {
    console.error('❌ Controller - Error listando SKUs:', error)
    res.status(500).json({ error: 'Error interno del servidor al listar SKUs' })
  }
}

export const obtenerSkuPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const skuId = parseInt(req.params.skuId)

    console.log('🔍 Controller - Obtener SKU por ID:', skuId)

    if (isNaN(skuId)) {
      res.status(400).json({ error: 'ID de SKU inválido' })
      return
    }

    const sku = await skuService.obtenerSkuCompleto(skuId)

    console.log('✅ Controller - SKU encontrado:', sku.sku)
    res.status(200).json(sku)

  } catch (error: any) {
    console.error('❌ Controller - Error obteniendo SKU:', error)
    
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Error interno del servidor al obtener SKU' })
    }
  }
}

export const obtenerSkuPorCodigo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo } = req.params // Puede ser SKU o código de barras

    console.log('🔍 Controller - Buscar SKU por código:', codigo)

    if (!codigo || codigo.trim().length === 0) {
      res.status(400).json({ error: 'Código requerido' })
      return
    }

    // Buscar por SKU o código de barras
    const skuEncontrado = await skuService.buscarSkuPorCodigo(codigo.trim())
    
    if (!skuEncontrado) {
      res.status(404).json({ error: 'SKU no encontrado' })
      return
    }

    const sku = await skuService.obtenerSkuCompleto(skuEncontrado.id)

    console.log('✅ Controller - SKU encontrado por código:', sku.sku)
    res.status(200).json(sku)

  } catch (error: any) {
    console.error('❌ Controller - Error buscando SKU por código:', error)
    res.status(500).json({ error: 'Error interno del servidor al buscar SKU' })
  }
}

export const actualizarSku = async (req: Request, res: Response): Promise<void> => {
  try {
    const skuId = parseInt(req.params.skuId)
    const datosActualizacion: ActualizarSkuRequest = req.body

    console.log('✏️ Controller - Actualizar SKU:', skuId, datosActualizacion)

    if (isNaN(skuId)) {
      res.status(400).json({ error: 'ID de SKU inválido' })
      return
    }

    const sku = await skuService.actualizarSku(skuId, datosActualizacion)

    console.log('✅ Controller - SKU actualizado exitosamente')
    res.status(200).json(sku)

  } catch (error: any) {
    console.error('❌ Controller - Error actualizando SKU:', error)
    
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Error interno del servidor al actualizar SKU' })
    }
  }
}

export const eliminarSku = async (req: Request, res: Response): Promise<void> => {
  try {
    const skuId = parseInt(req.params.skuId)

    console.log('🗑️ Controller - Eliminar SKU:', skuId)

    if (isNaN(skuId)) {
      res.status(400).json({ error: 'ID de SKU inválido' })
      return
    }

    await skuService.eliminarSku(skuId)

    console.log('✅ Controller - SKU eliminado exitosamente')
    res.status(200).json({ message: 'SKU eliminado exitosamente' })

  } catch (error: any) {
    console.error('❌ Controller - Error eliminando SKU:', error)
    
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Error interno del servidor al eliminar SKU' })
    }
  }
}

// ============================================
// GENERACIÓN MASIVA
// ============================================

export const generarSkusMasivos = async (req: Request, res: Response): Promise<void> => {
  try {
    const articuloId = parseInt(req.params.articuloId)

    console.log('🔄 Controller - Generar SKUs masivos:', articuloId)

    if (isNaN(articuloId)) {
      res.status(400).json({ error: 'ID de artículo inválido' })
      return
    }

    const skus = await skuService.generarSkusMasivos(articuloId)

    console.log(`✅ Controller - ${skus.length} SKUs generados masivamente`)
    res.status(201).json({
      message: `${skus.length} SKUs generados exitosamente`,
      skus
    })

  } catch (error: any) {
    console.error('❌ Controller - Error generando SKUs masivos:', error)
    
    if (error.message.includes('no tiene variantes')) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Error interno del servidor al generar SKUs' })
    }
  }
}

// ============================================
// GESTIÓN DE INVENTARIO
// ============================================

export const actualizarInventario = async (req: Request, res: Response): Promise<void> => {
  try {
    const skuId = parseInt(req.params.skuId)
    const { bodegaId, cantidad, operacion = 'establecer' }: ActualizarInventarioRequest = req.body

    console.log('📦 Controller - Actualizar inventario:', { skuId, bodegaId, cantidad, operacion })

    if (isNaN(skuId) || isNaN(bodegaId) || typeof cantidad !== 'number') {
      res.status(400).json({ error: 'Datos de inventario inválidos' })
      return
    }

    if (cantidad < 0) {
      res.status(400).json({ error: 'La cantidad no puede ser negativa' })
      return
    }

    await skuService.actualizarInventarioSku(skuId, bodegaId, cantidad, operacion)

    const stockTotal = await skuService.obtenerStockTotal(skuId)

    console.log('✅ Controller - Inventario actualizado exitosamente')
    res.status(200).json({
      message: 'Inventario actualizado exitosamente',
      stockTotal
    })

  } catch (error: any) {
    console.error('❌ Controller - Error actualizando inventario:', error)
    
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Error interno del servidor al actualizar inventario' })
    }
  }
}

export const obtenerStockTotal = async (req: Request, res: Response): Promise<void> => {
  try {
    const skuId = parseInt(req.params.skuId)

    console.log('📊 Controller - Obtener stock total:', skuId)

    if (isNaN(skuId)) {
      res.status(400).json({ error: 'ID de SKU inválido' })
      return
    }

    const stockTotal = await skuService.obtenerStockTotal(skuId)

    console.log('✅ Controller - Stock total obtenido:', stockTotal)
    res.status(200).json({ stockTotal })

  } catch (error: any) {
    console.error('❌ Controller - Error obteniendo stock total:', error)
    res.status(500).json({ error: 'Error interno del servidor al obtener stock' })
  }
}

export const obtenerSkusStockBajo = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId

    console.log('⚠️ Controller - Obtener SKUs con stock bajo, empresa:', empresaId)

    if (typeof empresaId !== 'number') {
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    const skusStockBajo = await skuService.obtenerSkusConStockBajo(empresaId)

    console.log(`📊 Controller - ${skusStockBajo.length} SKUs con stock bajo encontrados`)
    res.status(200).json(skusStockBajo)

  } catch (error: any) {
    console.error('❌ Controller - Error obteniendo SKUs con stock bajo:', error)
    res.status(500).json({ error: 'Error interno del servidor al obtener SKUs con stock bajo' })
  }
}

// ============================================
// BÚSQUEDA Y FILTROS
// ============================================

export const buscarSkus = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId
    const { 
      query,
      articuloId,
      activo,
      conStock,
      page = 1,
      limit = 20 
    }: BuscarSkusRequest = req.query as any

    console.log('🔍 Controller - Buscar SKUs:', { 
      empresaId, 
      query, 
      articuloId, 
      activo, 
      conStock,
      page,
      limit 
    })

    if (typeof empresaId !== 'number') {
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    const filtros = {
      query: query as string,
      articuloId: articuloId ? parseInt(articuloId as unknown as string) : undefined,
      activo: activo !== undefined ? String(activo) === 'true' : undefined,
      conStock: conStock !== undefined ? String(conStock) === 'true' : undefined,
      page: parseInt(page as unknown as string) || 1,
      limit: Math.min(parseInt(limit as unknown as string) || 20, 100) // Máximo 100
    }

    const resultados = await skuService.buscarSkus(empresaId, filtros)

    console.log(`✅ Controller - ${resultados.skus.length} SKUs encontrados`)
    res.status(200).json(resultados)

  } catch (error: any) {
    console.error('❌ Controller - Error buscando SKUs:', error)
    res.status(500).json({ error: 'Error interno del servidor al buscar SKUs' })
  }
}

// ============================================
// REPORTES Y ESTADÍSTICAS
// ============================================

export const obtenerEstadisticasSkus = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId

    console.log('📊 Controller - Obtener estadísticas SKUs, empresa:', empresaId)

    if (typeof empresaId !== 'number') {
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    const estadisticas = await skuService.obtenerEstadisticasSkus(empresaId)

    console.log('✅ Controller - Estadísticas obtenidas exitosamente')
    res.status(200).json(estadisticas)

  } catch (error: any) {
    console.error('❌ Controller - Error obteniendo estadísticas:', error)
    res.status(500).json({ error: 'Error interno del servidor al obtener estadísticas' })
  }
}

export const generarReporteInventario = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId
    const { bodegaId, formato = 'json' } = req.query

    console.log('📋 Controller - Generar reporte inventario:', { 
      empresaId, 
      bodegaId, 
      formato 
    })

    if (typeof empresaId !== 'number') {
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    const filtros = {
      bodegaId: bodegaId ? parseInt(bodegaId as string) : undefined
    }

    const reporte = await skuService.generarReporteInventario(empresaId, filtros)

    if (formato === 'csv') {
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-inventario.csv')
      res.status(200).send(reporte.csv)
    } else {
      console.log(`✅ Controller - Reporte generado con ${reporte.skus.length} items`)
      res.status(200).json(reporte)
    }

  } catch (error: any) {
    console.error('❌ Controller - Error generando reporte:', error)
    res.status(500).json({ error: 'Error interno del servidor al generar reporte' })
  }
}

// ============================================
// VALIDACIONES Y UTILIDADES
// ============================================

export const validarCombinacionVariantes = async (req: Request, res: Response): Promise<void> => {
  try {
    const articuloId = parseInt(req.params.articuloId)
    const { combinacionVariantes }: { combinacionVariantes: number[] } = req.body

    console.log('✅ Controller - Validar combinación:', { articuloId, combinacionVariantes })

    if (isNaN(articuloId)) {
      res.status(400).json({ error: 'ID de artículo inválido' })
      return
    }

    if (!Array.isArray(combinacionVariantes) || combinacionVariantes.length === 0) {
      res.status(400).json({ error: 'Combinación de variantes requerida' })
      return
    }

    const existe = await skuService.validarCombinacionUnica(articuloId, combinacionVariantes)
    const skuGenerado = await skuService.generarSkuAutomatico(articuloId, combinacionVariantes)
    const codigoBarrasGenerado = await skuService.generarCodigoBarras()

    console.log('✅ Controller - Validación completada')
    res.status(200).json({
      existe,
      skuPropuesto: skuGenerado,
      codigoBarrasPropuesto: codigoBarrasGenerado,
      valida: !existe
    })

  } catch (error: any) {
    console.error('❌ Controller - Error validando combinación:', error)
    res.status(500).json({ error: 'Error interno del servidor al validar combinación' })
  }
}

export const generarCodigoBarras = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📊 Controller - Generar código de barras')

    const codigoBarras = await skuService.generarCodigoBarras()

    console.log('✅ Controller - Código de barras generado:', codigoBarras)
    res.status(200).json({ codigoBarras })

  } catch (error: any) {
    console.error('❌ Controller - Error generando código de barras:', error)
    res.status(500).json({ error: 'Error interno del servidor al generar código de barras' })
  }
}

// ============================================
// FUNCIONES ESPECÍFICAS PARA E-COMMERCE
// ============================================

export const obtenerSkusParaEcommerce = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId
    const { categoriaId, marcaId, conStock = true } = req.query

    console.log('🛒 Controller - Obtener SKUs para e-commerce:', { empresaId, categoriaId, marcaId })

    if (typeof empresaId !== 'number') {
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    const filtros = {
      query: '',
      articuloId: undefined,
      activo: true,
      conStock: conStock === 'true',
      page: 1,
      limit: 1000 // Todos los SKUs para e-commerce
    }

    const resultados = await skuService.buscarSkus(empresaId, filtros)

    // Formatear para e-commerce
    const skusEcommerce = resultados.skus.map(sku => ({
      id: sku.id,
      sku: sku.sku,
      codigoBarras: sku.codigoBarras,
      nombre: `${sku.articulo.nombre} - ${sku.combinacion.map(c => c.valor).join(' ')}`,
      descripcion: sku.articulo.descripcion,
      precio: sku.precioBase || sku.articulo.precio,
      imagenes: sku.combinacion
        .filter(c => c.imagen)
        .map(c => c.imagen),
      variantes: sku.combinacion,
      stock: sku.inventario.reduce((total, inv) => total + inv.cantidad, 0),
      disponible: sku.activo && sku.inventario.some(inv => inv.cantidad > 0),
      categoria: sku.articulo.nombre,
      url: `/producto/${sku.articulo.codigo}/${sku.sku.toLowerCase()}`
    }))

    console.log(`✅ Controller - ${skusEcommerce.length} SKUs para e-commerce`)
    res.status(200).json({
      productos: skusEcommerce,
      total: skusEcommerce.length
    })

  } catch (error: any) {
    console.error('❌ Controller - Error obteniendo SKUs para e-commerce:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ============================================
// FUNCIONES ESPECÍFICAS PARA POS
// ============================================

export const buscarSkuParaVenta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo } = req.params
    const { bodegaId } = req.query

    console.log('💳 Controller - Buscar SKU para venta:', { codigo, bodegaId })

    if (!codigo || codigo.trim().length === 0) {
      res.status(400).json({ error: 'Código requerido' })
      return
    }

    const skuEncontrado = await skuService.buscarSkuPorCodigo(codigo.trim())
    
    if (!skuEncontrado) {
      res.status(404).json({ error: 'Producto no encontrado' })
      return
    }

    const sku = await skuService.obtenerSkuCompleto(skuEncontrado.id)

    // Información específica para POS
    const bodegaIdNum = bodegaId ? parseInt(bodegaId as string) : undefined
    const inventarioBodega = bodegaIdNum 
      ? sku.inventario.find(inv => inv.bodegaId === bodegaIdNum)
      : sku.inventario[0]

    const skuVenta = {
      id: sku.id,
      sku: sku.sku,
      codigoBarras: sku.codigoBarras,
      nombre: `${sku.articulo.nombre} - ${sku.combinacion.map(c => c.valor).join(' ')}`,
      precio: sku.precioBase || sku.articulo.precio,
      stock: inventarioBodega?.cantidad || 0,
      disponible: sku.activo && (inventarioBodega?.cantidad || 0) > 0,
      variantes: sku.combinacion.map(c => c.valor).join(' - '),
      precios: sku.precios,
      ubicacion: inventarioBodega?.ubicacion
    }

    console.log('✅ Controller - SKU encontrado para venta')
    res.status(200).json(skuVenta)

  } catch (error: any) {
    console.error('❌ Controller - Error buscando SKU para venta:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}