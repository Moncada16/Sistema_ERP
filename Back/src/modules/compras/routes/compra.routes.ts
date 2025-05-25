import { Router } from 'express'
import { verificarToken } from '../../../middleware/verificarToken'
import { crearCompra } from '../controller/compra.controller'

const router = Router()

router.use(verificarToken)

router.post('/', crearCompra)

export default router
