import { Router } from 'express';
import { register, login, logout } from '../controller/auth.controller';
import { verificarToken } from '../../../middleware/verificarToken';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verificarToken, logout);

export default router;
