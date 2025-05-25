// src/modules/foto/routes/foto.routes.ts
import { Router } from 'express'
import * as controller from '../controller/foto.controller'
import upload from '../../../middleware/upload.middleware'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()
router.use(verificarToken)

router.post('/:id', upload.single('imagen'), controller.agregarFoto)
router.get('/:id', controller.listarFotos)
router.delete('/:id', controller.eliminarFoto)

export default router
