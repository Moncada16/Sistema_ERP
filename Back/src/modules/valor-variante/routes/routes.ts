import { Router } from 'express'
import * as controller from '../../valor-variante/controller/controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()
router.use(verificarToken)

router.post('/tipos/:tipoId/valores', controller.crear)
router.get('/tipos/:tipoId/valores', controller.listarPorTipo)
router.put('/valores/:id', controller.actualizar)
router.delete('/valores/:id', controller.eliminar)

export default router
