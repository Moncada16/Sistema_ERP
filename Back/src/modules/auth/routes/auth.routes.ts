import { Router } from 'express';
import { register, login, logout } from '../controller/auth.controller';
import { verificarToken } from '../../../middleware/verificarToken';
import { validate } from '../../../middleware/validator';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { asyncHandler } from '../../../utils/asyncHandler';

// 🛣️ Configuración del router
const router = Router();

// 📝 Documentación de rutas
/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Public
 */

router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(register)
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(login)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post(
  '/logout',
  verificarToken,
  asyncHandler(logout)
);

export default router;
