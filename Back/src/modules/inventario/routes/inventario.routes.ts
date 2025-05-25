import { Router } from 'express'
import * as controller from '../controller/inventario.controller'
import { verificarToken } from '../../../middleware/verificarToken'


const router = Router()
 router.use(verificarToken)

 router.post('/variantes/:id/inventario', controller.asignarInventario)
 router.get('/variantes/:id/inventario', controller.verInventario)

 export default router
