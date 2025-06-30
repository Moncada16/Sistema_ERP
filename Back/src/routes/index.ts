// ================================
// ROUTES INDEX - CON SISTEMA SKU INTEGRADO
// Ubicación: src/routes/index.ts
// ================================

import { Router } from 'express'

// 🧩 Importa tus routers existentes
import authRoutes from '../modules/auth/routes/auth.routes'
import userRoutes from '../modules/user/routes/user.routes'
import fotoUserRoutes from '../modules/fotoUser/routes/fotoUser.routes'
import empresaRoutes from '../modules/empresa/routes/empresa.routes'
import bodegaRoutes from '../modules/bodega/routes/bodega.routes'
import articuloRoutes from '../modules/articulo/routes/articulo.routes'
import fotoRoutes from '../modules/foto/routes/foto.routes'
import inventarioRoutes from '../modules/inventario/routes/inventario.routes'
import tipoVarianteRoutes from '../modules/tipo-variante/routes/routes'
import valorVarianteRoutes from '../modules/valor-variante/routes/routes'
import compraRoutes from '../modules/compras/routes/compra.routes'
import proveedorRoutes from '../modules/proveedor/routes/proveedor.routes'
import cxpRoutes from '../modules/cxp/routes/cxp.routes'
import tipoPrecioRoutes from '../modules/TipoPrecio/routes/tipoPrecio.routes'
import precioArticuloRoutes from '../modules/precio-articulo/routes/precio-articulo.routes'

// ✅ RUTAS EXISTENTES
import categoriaArticuloRoutes from '../modules/categoria-articulo/routes/categoriaArticulo.routes'
import marcaRoutes from '../modules/marca/routes/marcaRoutes'

// 🚀 NUEVA RUTA SKU SYSTEM
import skuRoutes from '../modules/articulo-sku/routes/sku.routes'

const router = Router()

// ✅ Agrupa tus endpoints bajo los prefijos correctos

// 🔐 Autenticación y usuarios
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/usuarios/fotos', fotoUserRoutes)

// 🏢 Empresa y configuración
router.use('/empresa', empresaRoutes)
router.use('/bodegas', bodegaRoutes)

// 📦 Productos y artículos
router.use('/articulos', articuloRoutes)
router.use('/articulos/fotos', fotoRoutes)
router.use('/categoria-articulo', categoriaArticuloRoutes)
router.use('/marcas', marcaRoutes)

// 🏷️ SISTEMA SKU E-COMMERCE + POS (NUEVO)
router.use('/skus', skuRoutes)

// 📊 Inventario y variantes
router.use('/inventario', inventarioRoutes)
router.use('/tipos-variante', tipoVarianteRoutes)
router.use('/valor-variante', valorVarianteRoutes)

// 💰 Precios
router.use('/tipoPrecio', tipoPrecioRoutes)
router.use('/precio-articulo', precioArticuloRoutes)

// 🛒 Compras y proveedores
router.use('/compras', compraRoutes)
router.use('/proveedores', proveedorRoutes)
router.use('/cuentas-por-pagar', cxpRoutes)

// ============================================
// 🔗 RUTAS DE COMPATIBILIDAD PARA FRONTEND EXISTENTE
// ============================================

// ✅ Resolver el error 404 de /api/variantes
// Redirigir al nuevo sistema de SKUs
router.use('/variantes', (req, res, next) => {
  console.log('⚠️ Uso de endpoint legacy /api/variantes detectado')
  console.log('📝 Método:', req.method, 'Ruta:', req.path)
  
  // Para GET /api/variantes, redirigir a función de búsqueda general
  if (req.method === 'GET' && req.path === '/') {
    return res.status(200).json({
      message: '🚀 Endpoint migrado al sistema SKU',
      nuevoEndpoint: '/api/skus/buscar',
      documentacion: 'Usar /api/skus/articulos/:articuloId/skus para SKUs específicos de un artículo',
      ejemplo: 'GET /api/skus/articulos/123/skus'
    })
  }
  
  // Para otros métodos, sugerir el endpoint correcto
  res.status(410).json({
    error: '🔄 Endpoint descontinuado',
    mensaje: 'Este endpoint ha sido migrado al nuevo sistema SKU',
    alternativas: {
      'GET variantes por artículo': '/api/skus/articulos/:articuloId/skus',
      'Buscar por código': '/api/skus/buscar/:codigo',
      'Búsqueda general': '/api/skus/buscar?query=...',
      'Crear SKU': 'POST /api/skus/articulos/:articuloId/skus'
    },
    documentacion: '/api/skus para ver todos los endpoints disponibles'
  })
})

export default router