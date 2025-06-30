// Backend: routes/routes.ts - CON ELIMINACIÓN SEGURA
import { Router } from 'express'
import * as controller from '../../tipo-variante/controller/controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()
router.use(verificarToken)

// ✅ RUTAS BÁSICAS
router.get('/', controller.listar)
router.post('/', controller.crear)
router.put('/:id', controller.actualizar)

// ✅ RUTAS DE VERIFICACIÓN
router.get('/:id/dependencias', controller.verificarDependencias)
router.get('/:id/productos-afectados', controller.obtenerProductosAfectados)

// ✅ RUTAS DE ELIMINACIÓN
router.delete('/:id', controller.eliminar) // Eliminación segura (predeterminada)
router.delete('/:id/forzado', controller.eliminarForzado) // Eliminación forzada (admin)

export default router