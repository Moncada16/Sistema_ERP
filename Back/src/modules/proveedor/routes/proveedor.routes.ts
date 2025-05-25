import { Router } from 'express'
import { verificarToken } from '../../../middleware/verificarToken'
import * as controller from '../controller/proveedor.controller'

const router = Router()

// 🔐 Middleware aplicado a todas las rutas
router.use(verificarToken)

// 📦 Proveedores
router.get('/', controller.listar)        // 🔍 Listar proveedores
router.post('/', controller.crear)        // ➕ Crear proveedor
router.put('/:id', controller.actualizar) // ✏️ Actualizar proveedor
router.delete('/:id', controller.eliminar) // ❌ Eliminar proveedor

export default router
