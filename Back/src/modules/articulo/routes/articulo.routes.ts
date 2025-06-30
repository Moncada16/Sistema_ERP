// ================================
// ARTÍCULO ROUTES - CON ENDPOINTS SKU INTEGRADOS
// Ubicación: src/modules/articulo/routes/articulo.routes.ts
// ================================

import { Router } from 'express'
import * as controller from '../controller/articulo.controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()

// 🔐 Aplicar middleware de autenticación a todas las rutas
router.use(verificarToken)

// ============================================
// 📦 RUTAS BÁSICAS DE ARTÍCULOS (EXISTENTES)
// ============================================

router.post('/', controller.crearArticulo)          // POST /api/articulos
router.get('/', controller.listarArticulos)         // GET /api/articulos  
router.get('/:id', controller.obtenerArticuloPorId) // GET /api/articulos/:id
router.put('/:id', controller.actualizarArticulo)   // PUT /api/articulos/:id
router.delete('/:id', controller.eliminarArticulo)  // DELETE /api/articulos/:id

// ============================================
// 🚀 NUEVAS RUTAS SKU INTEGRADAS
// ============================================

// ✅ RESOLVER ERROR 404 - Obtener variantes/SKUs de un artículo
router.get('/:id/variantes', controller.obtenerVariantesArticulo)
// GET /api/articulos/123/variantes
// Resuelve el error 404 que tenías con /api/variantes

// ✅ Obtener artículo completo con todos sus SKUs
router.get('/:id/completo', controller.obtenerArticuloCompleto)
// GET /api/articulos/123/completo

// ✅ Generar todos los SKUs posibles para un artículo
router.post('/:id/generar-skus', controller.generarSkusMasivos)
// POST /api/articulos/123/generar-skus

// ✅ Obtener estadísticas de SKUs de un artículo
router.get('/:id/estadisticas', controller.obtenerEstadisticasArticulo)
// GET /api/articulos/123/estadisticas

// ✅ Búsqueda avanzada de artículos con información de SKUs
router.get('/buscar/con-skus', controller.buscarArticulosConSkus)
// GET /api/articulos/buscar/con-skus?query=polo&conStock=true

export default router

// ============================================
// 📚 DOCUMENTACIÓN DE NUEVOS ENDPOINTS
// ============================================

/*
🎯 ENDPOINTS NUEVOS AGREGADOS:

1. 🔧 RESOLVER ERROR 404:
   GET /api/articulos/:id/variantes
   - Reemplaza el /api/variantes que estaba fallando
   - Devuelve SKUs en formato compatible con tu frontend actual
   
   Respuesta:
   [
     {
       "id": 456,
       "sku": "CAM-POLO-ROJ-XL-001",
       "codigoBarras": "1234567890123",
       "nombre": "Rojo - XL",
       "combinacion": [
         {"tipo": "Color", "valor": "Rojo"},
         {"tipo": "Talla", "valor": "XL"}
       ],
       "precio": 25000,
       "stock": 50,
       "activo": true
     }
   ]

2. 📊 ARTÍCULO COMPLETO:
   GET /api/articulos/:id/completo
   - Artículo + todos sus SKUs + estadísticas
   
3. 🔄 GENERAR SKUs MASIVOS:
   POST /api/articulos/:id/generar-skus
   - Genera automáticamente todos los SKUs posibles
   - Basado en las variantes configuradas

4. 📈 ESTADÍSTICAS:
   GET /api/articulos/:id/estadisticas
   - Información detallada de SKUs, inventario y variantes

5. 🔍 BÚSQUEDA AVANZADA:
   GET /api/articulos/buscar/con-skus?query=polo&conStock=true
   - Buscar artículos con información de SKUs incluida

🚀 COMPATIBILIDAD:
- Todos los endpoints existentes siguen funcionando igual
- El nuevo endpoint /variantes resuelve el error 404
- Compatible con tu frontend actual
- Preparado para e-commerce futuro

📝 PARA TU FRONTEND:
Cambiar:
  GET /api/variantes 
Por:
  GET /api/articulos/:id/variantes

Ejemplo:
  GET /api/articulos/123/variantes
*/