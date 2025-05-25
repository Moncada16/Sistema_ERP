import { Router } from 'express';
import {
  getMe,
  updateMe,
  cambiarPassword,
  refreshToken
} from '../controller/user.controller';
import { verificarToken } from '../../../middleware/verificarToken';

const router = Router();

router.get('/me/info', verificarToken, getMe);
router.put('/me', verificarToken, updateMe);
router.put('/me/password', verificarToken, cambiarPassword);
router.get('/refresh', verificarToken, refreshToken);

export default router;
