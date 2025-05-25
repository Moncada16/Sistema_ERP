import { Router } from 'express'
import * as ctrl from '../controller/precioArticulo.controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()

// Helper to wrap async route handlers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Crear o actualizar precio   (upsert)
router.post('/:articuloId/precios', verificarToken, asyncHandler(ctrl.crearOCrearOActualizar));

// Listar precios de un artículo
router.get('/:articuloId/precios', verificarToken, asyncHandler(ctrl.listarPreciosPorArticulo));

// Actualizar un precio existente
router.put('/precios/:id', verificarToken, asyncHandler(ctrl.actualizarPrecio));

// Eliminar un precio
router.delete('/precios/:id', verificarToken, asyncHandler(ctrl.eliminarPrecio));

export default router
