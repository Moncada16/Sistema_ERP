// src/modules/fotoUser/routes/fotoUser.routes.ts
import { Router } from 'express'
import { subirFotoPerfil } from '../controller/fotoUser.controller'
import upload from '../../../middleware/upload.middleware'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()
router.use(verificarToken)

router.post('/usuario/foto/:id', upload.single('imagen'), subirFotoPerfil)

export default router
