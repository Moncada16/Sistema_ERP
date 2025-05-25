import { Router } from 'express'
import * as ctrl from '../controller/tipoPrecio.controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()

// Aplica autenticación a todas las rutas
router.use(verificarToken)

// CRUD TipoPrecio
router.post('/',       ctrl.crearTipoPrecio)
router.get('/',        ctrl.listarTipoPrecios)
router.get('/:id',     ctrl.obtenerTipoPrecio)
router.put('/:id',     ctrl.actualizarTipoPrecio)
router.delete('/:id',  ctrl.eliminarTipoPrecio)

export default router
