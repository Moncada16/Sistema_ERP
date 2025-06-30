import { Router } from 'express'
import CategoriaArticuloController from '../controller/categoriaArticulo.controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()

// Rutas de categorías de artículos
router.get('/', verificarToken, CategoriaArticuloController.getCategorias)
router.post('/', verificarToken, CategoriaArticuloController.createCategoria)
router.put('/:id', verificarToken, CategoriaArticuloController.updateCategoria)
router.delete('/:id', verificarToken, CategoriaArticuloController.deleteCategoria)

// Ruta especial para crear categorías por defecto
router.post('/crear-defecto', verificarToken, CategoriaArticuloController.createCategoriasDefecto)

export default router