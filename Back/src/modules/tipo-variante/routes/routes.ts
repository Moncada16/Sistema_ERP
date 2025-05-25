import { Router } from 'express'
import * as controller from '../../tipo-variante/controller/controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()
router.use(verificarToken)

router.post('/', controller.crear)
router.get('/', controller.listar)
router.put('/:id', controller.actualizar)
router.delete('/:id', controller.eliminar)

export default router
