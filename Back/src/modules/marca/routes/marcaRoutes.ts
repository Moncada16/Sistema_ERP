import { Router } from 'express'
import MarcaController from '../controller/marca.controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()

// Rutas de marcas
router.get('/', verificarToken, MarcaController.getMarcas)
router.post('/', verificarToken, MarcaController.createMarca)
router.put('/:id', verificarToken, MarcaController.updateMarca)
router.delete('/:id', verificarToken, MarcaController.deleteMarca)

// Ruta especial para crear marcas por defecto
router.post('/crear-defecto', verificarToken, MarcaController.createMarcasDefecto)

export default router