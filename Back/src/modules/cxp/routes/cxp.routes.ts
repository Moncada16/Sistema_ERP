import { Router } from 'express'
import { verificarToken } from '../../../middleware/verificarToken'
import * as controller from '../controller/cxp.controller'

const router = Router()

router.use(verificarToken)

router.get('/', controller.listar)
router.post('/', controller.crear)
router.get('/:id', controller.verDetalle)
router.post('/abono', controller.abonar)

export default router
