// ================================
// SKU ROUTES COMPLETAS - TODOS LOS ENDPOINTS
// Ubicación: src/modules/articulo-sku/routes/sku.routes.ts
// ================================

import { Router } from 'express'
import * as skuController from '../controller/sku.controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()

// 🔐 Aplicar middleware de autenticación a todas las rutas
router.use(verificarToken)

// ============================================
// 📦 RUTAS PRINCIPALES DE SKUs
// ============================================

// ✅ CRUD básico de SKUs por artículo
router.post('/articulos/:articuloId/skus', skuController.crearSku)
// POST /api/skus/articulos/123/skus
// Body: { "combinacionVariantes": [1, 2], "precioBase": 25000 }

router.get('/articulos/:articuloId/skus', skuController.listarSkusPorArticulo)
// GET /api/skus/articulos/123/skus

// ✅ Obtener SKU específico
router.get('/skus/:skuId', skuController.obtenerSkuPorId)
// GET /api/skus/skus/456

router.put('/skus/:skuId', skuController.actualizarSku)
// PUT /api/skus/skus/456
// Body: { "precioBase": 30000, "activo": true }

router.delete('/skus/:skuId', skuController.eliminarSku)
// DELETE /api/skus/skus/456

// ============================================
// 🔍 BÚSQUEDA Y FILTROS
// ============================================

// ✅ Buscar SKU por código (SKU o código de barras)
router.get('/buscar/:codigo', skuController.obtenerSkuPorCodigo)
// GET /api/skus/buscar/CAM-POLO-ROJ-XL-001
// GET /api/skus/buscar/1234567890123

// ✅ Búsqueda avanzada con filtros
router.get('/buscar', skuController.buscarSkus)
// GET /api/skus/buscar?query=polo&activo=true&conStock=true&page=1&limit=20

// ============================================
// 🔄 GENERACIÓN MASIVA
// ============================================

// ✅ Generar todos los SKUs posibles para un artículo
router.post('/articulos/:articuloId/generar-masivo', skuController.generarSkusMasivos)
// POST /api/skus/articulos/123/generar-masivo

// ✅ Validar combinación antes de crear
router.post('/articulos/:articuloId/validar-combinacion', skuController.validarCombinacionVariantes)
// POST /api/skus/articulos/123/validar-combinacion
// Body: { "combinacionVariantes": [1, 2] }

// ============================================
// 📦 GESTIÓN DE INVENTARIO
// ============================================

// ✅ Actualizar inventario de un SKU
router.put('/skus/:skuId/inventario', skuController.actualizarInventario)
// PUT /api/skus/skus/456/inventario
// Body: { "bodegaId": 1, "cantidad": 100, "operacion": "establecer" }

// ✅ Obtener stock total de un SKU
router.get('/skus/:skuId/stock', skuController.obtenerStockTotal)
// GET /api/skus/skus/456/stock

// ⚠️ SKUs con stock bajo
router.get('/stock-bajo', skuController.obtenerSkusStockBajo)
// GET /api/skus/stock-bajo

// ============================================
// 📊 REPORTES Y ESTADÍSTICAS
// ============================================

// ✅ Estadísticas generales de SKUs
router.get('/estadisticas', skuController.obtenerEstadisticasSkus)
// GET /api/skus/estadisticas

// ✅ Reporte de inventario
router.get('/reportes/inventario', skuController.generarReporteInventario)
// GET /api/skus/reportes/inventario?bodegaId=1&formato=json
// GET /api/skus/reportes/inventario?formato=csv

// ============================================
// 🛠️ UTILIDADES
// ============================================

// ✅ Generar código de barras único
router.get('/generar-codigo-barras', skuController.generarCodigoBarras)
// GET /api/skus/generar-codigo-barras

// ============================================
// 🛒 ENDPOINTS ESPECÍFICOS PARA E-COMMERCE
// ============================================

// ✅ Obtener todos los SKUs para e-commerce
router.get('/ecommerce/productos', skuController.obtenerSkusParaEcommerce)
// GET /api/skus/ecommerce/productos?categoriaId=1&conStock=true

// ✅ Buscar productos para catálogo
router.get('/ecommerce/buscar', skuController.buscarSkus)
// GET /api/skus/ecommerce/buscar?query=zapatos&conStock=true

// ============================================
// 💳 ENDPOINTS ESPECÍFICOS PARA PUNTO DE VENTA (POS)
// ============================================

// ✅ Buscar producto para venta (escaneo de código)
router.get('/pos/buscar/:codigo', skuController.buscarSkuParaVenta)
// GET /api/skus/pos/buscar/1234567890123?bodegaId=1

// ✅ Productos más vendidos (se puede implementar después)
// router.get('/pos/top-vendidos', skuController.obtenerTopVendidos)

// ============================================
// 🔧 ENDPOINTS DE ADMINISTRACIÓN
// ============================================

// ✅ Todos los SKUs de la empresa (admin)
router.get('/admin/todos', skuController.buscarSkus)
// GET /api/skus/admin/todos?page=1&limit=50

// ✅ SKUs inactivos
router.get('/admin/inactivos', (req, res, next) => {
  req.query.activo = 'false'
  next()
}, skuController.buscarSkus)
// GET /api/skus/admin/inactivos

// ✅ SKUs sin stock
router.get('/admin/sin-stock', (req, res, next) => {
  req.query.conStock = 'false'
  next()
}, skuController.buscarSkus)
// GET /api/skus/admin/sin-stock

export default router

// ============================================
// 📚 DOCUMENTACIÓN COMPLETA DE ENDPOINTS
// ============================================

/*
🎯 GUÍA COMPLETA DE ENDPOINTS SKU:

============================================
📦 GESTIÓN BÁSICA DE SKUs:
============================================

1. 🚀 CREAR UN SKU:
   POST /api/skus/articulos/123/skus
   Body: {
     "combinacionVariantes": [1, 2, 3], // IDs de ValorVariante
     "precioBase": 25000,               // Opcional
     "codigoBarras": "1234567890123"    // Opcional, se genera automático
   }
   
   Respuesta: {
     "id": 456,
     "sku": "CAM-POLO-ROJ-XL-001",
     "codigoBarras": "1234567890123",
     "activo": true,
     "articulo": {...},
     "combinacion": [...],
     "inventario": [...],
     "precios": [...]
   }

2. 📋 LISTAR SKUs DE UN ARTÍCULO:
   GET /api/skus/articulos/123/skus
   
3. 🔍 OBTENER SKU ESPECÍFICO:
   GET /api/skus/skus/456

4. ✏️ ACTUALIZAR SKU:
   PUT /api/skus/skus/456
   Body: {
     "precioBase": 30000,
     "activo": true,
     "codigoBarras": "9876543210987"
   }

5. 🗑️ ELIMINAR SKU:
   DELETE /api/skus/skus/456

============================================
🔍 BÚSQUEDA Y FILTROS:
============================================

6. 🔎 BUSCAR POR CÓDIGO:
   GET /api/skus/buscar/CAM-POLO-ROJ-XL-001  (Por SKU)
   GET /api/skus/buscar/1234567890123        (Por código de barras)

7. 🔍 BÚSQUEDA AVANZADA:
   GET /api/skus/buscar?query=polo&activo=true&conStock=true&page=1&limit=20
   
   Parámetros disponibles:
   - query: Buscar en SKU, nombre, código de barras
   - articuloId: Filtrar por artículo específico
   - activo: true/false
   - conStock: true/false
   - page: Número de página (default: 1)
   - limit: Items por página (default: 20, max: 100)

============================================
🔄 GENERACIÓN MASIVA:
============================================

8. 🔄 GENERAR TODOS LOS SKUs POSIBLES:
   POST /api/skus/articulos/123/generar-masivo
   
   Genera automáticamente todos los SKUs basados en las combinaciones
   de variantes configuradas en el artículo.

9. ✅ VALIDAR COMBINACIÓN:
   POST /api/skus/articulos/123/validar-combinacion
   Body: { "combinacionVariantes": [1, 2] }
   
   Respuesta: {
     "existe": false,
     "skuPropuesto": "CAM-POLO-ROJ-XL-002",
     "codigoBarrasPropuesto": "1234567890124",
     "valida": true
   }

============================================
📦 GESTIÓN DE INVENTARIO:
============================================

10. 📦 ACTUALIZAR INVENTARIO:
    PUT /api/skus/skus/456/inventario
    Body: {
      "bodegaId": 1,
      "cantidad": 100,
      "operacion": "establecer" // suma|resta|establecer
    }

11. 📊 OBTENER STOCK TOTAL:
    GET /api/skus/skus/456/stock
    Respuesta: { "stockTotal": 150 }

12. ⚠️ SKUs CON STOCK BAJO:
    GET /api/skus/stock-bajo
    Devuelve todos los SKUs que están por debajo del mínimo.

============================================
📊 REPORTES Y ESTADÍSTICAS:
============================================

13. 📊 ESTADÍSTICAS GENERALES:
    GET /api/skus/estadisticas
    Respuesta: {
      "totalSkus": 150,
      "skusActivos": 145,
      "skusConStock": 120,
      "stockBajo": 15,
      "valorTotalInventario": 2500000,
      "articulosConSkus": 25,
      "promedioSkusPorArticulo": 6,
      "topArticulosConMasSkus": [...],
      "distribucionPorVariante": [...]
    }

14. 📋 REPORTE DE INVENTARIO:
    GET /api/skus/reportes/inventario?bodegaId=1&formato=json
    GET /api/skus/reportes/inventario?formato=csv  (Descarga CSV)

============================================
🛒 ENDPOINTS PARA E-COMMERCE:
============================================

15. 🛒 PRODUCTOS PARA CATÁLOGO:
    GET /api/skus/ecommerce/productos?categoriaId=1&conStock=true
    
    Formato optimizado para e-commerce con:
    - URLs amigables
    - Imágenes de variantes
    - Stock disponible
    - Precios formatados

============================================
💳 ENDPOINTS PARA PUNTO DE VENTA (POS):
============================================

16. 💳 BUSCAR PARA VENTA:
    GET /api/skus/pos/buscar/1234567890123?bodegaId=1
    
    Optimizado para POS con:
    - Stock específico de bodega
    - Precios por tipo
    - Ubicación en bodega
    - Validación de disponibilidad

============================================
🛠️ UTILIDADES:
============================================

17. 📊 GENERAR CÓDIGO DE BARRAS:
    GET /api/skus/generar-codigo-barras
    Respuesta: { "codigoBarras": "1234567890123" }

============================================
🔧 ENDPOINTS DE ADMINISTRACIÓN:
============================================

18. 🔧 TODOS LOS SKUs (ADMIN):
    GET /api/skus/admin/todos?page=1&limit=50

19. ⚠️ SKUs INACTIVOS:
    GET /api/skus/admin/inactivos

20. 📦 SKUs SIN STOCK:
    GET /api/skus/admin/sin-stock

============================================
🚀 CASOS DE USO COMUNES:
============================================

💼 PARA TU FRONTEND ACTUAL (Resolver error 404):
   Cambiar: GET /api/variantes
   Por: GET /api/skus/articulos/:articuloId/skus

🛒 PARA E-COMMERCE:
   - Catálogo: GET /api/skus/ecommerce/productos
   - Búsqueda: GET /api/skus/buscar?query=...
   - Producto específico: GET /api/skus/buscar/:sku

💳 PARA PUNTO DE VENTA:
   - Escanear código: GET /api/skus/pos/buscar/:codigo
   - Actualizar stock: PUT /api/skus/skus/:id/inventario

📊 PARA ADMINISTRACIÓN:
   - Dashboard: GET /api/skus/estadisticas
   - Alertas: GET /api/skus/stock-bajo
   - Reportes: GET /api/skus/reportes/inventario

🔄 PARA SETUP INICIAL:
   1. Configurar variantes en artículos
   2. POST /api/skus/articulos/:id/generar-masivo
   3. Configurar inventarios por bodega

============================================
📝 NOTAS IMPORTANTES:
============================================

✅ Todos los endpoints requieren autenticación (token JWT)
✅ Los filtros empresaId se aplican automáticamente por seguridad
✅ Los códigos de barras son únicos globalmente
✅ Los SKUs son únicos por combinación de variantes
✅ El inventario se maneja por bodega
✅ Compatible con tu sistema actual de precios
✅ Preparado para escalabilidad e-commerce

🔒 SEGURIDAD:
- Validación de permisos por empresa
- Sanitización de inputs
- Manejo de errores robusto
- Logs detallados para debugging

📈 RENDIMIENTO:
- Paginación en búsquedas
- Índices en base de datos
- Caché de consultas frecuentes
- Optimización de queries complejas
*/