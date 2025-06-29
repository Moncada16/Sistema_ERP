import { Router } from 'express'

// 🧩 Importa sólo tus routers de back-end
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
import tipoPrecioRoutes     from '../modules/TipoPrecio/routes/tipoPrecio.routes'
import precioArticuloRoutes from '../modules/precio-articulo/routes/precio-articulo.routes'

const router = Router()

// ✅ Agrupa tus endpoints bajo los prefijos correctos
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/usuarios/fotos', fotoUserRoutes)
router.use('/mi-empresa', empresaRoutes)
router.use('/bodegas', bodegaRoutes)
router.use('/articulos', articuloRoutes)
router.use('/articulos/fotos', fotoRoutes)
router.use('/inventario', inventarioRoutes)
router.use('/tipos-variante', tipoVarianteRoutes)
router.use('/valor-variante', valorVarianteRoutes)
router.use('/compras', compraRoutes)
router.use('/proveedores', proveedorRoutes)
router.use('/cuentas-por-pagar', cxpRoutes)
router.use('/tipoPrecio', tipoPrecioRoutes)
router.use('/precio-articulo', precioArticuloRoutes)

export default router
