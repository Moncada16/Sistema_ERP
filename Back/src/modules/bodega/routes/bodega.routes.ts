import { Router } from 'express'
import BodegaController from '../controller/bodega.controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()

router.get('/', verificarToken, BodegaController.getBodegas)
router.post('/', verificarToken, BodegaController.createBodega)
router.put('/:id', verificarToken, BodegaController.updateBodega)
router.delete('/:id', verificarToken, BodegaController.deleteBodega)

export default router
