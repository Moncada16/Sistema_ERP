// src/modules/empresa/routes/empresa.routes.ts
import { Router } from 'express'
import EmpresaController from '../controller/empresa.controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()

// 👉 SIN prefijo adicional
router.post('/',verificarToken, EmpresaController.createEmpresa)
router.get('/', verificarToken, EmpresaController.getMiEmpresa)
router.put('/', verificarToken, EmpresaController.updateMiEmpresa)
router.delete('/', verificarToken, EmpresaController.deleteMiEmpresa)

export default router
