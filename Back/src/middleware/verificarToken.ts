import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../../prisma/client'

// ✅ Extiende la interfaz Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number
        empresaId: number | null
        rol: string
      }
    }
  }
}

// 🔐 Tipos de roles permitidos
type RolPermitido = 'admin' | 'gerente' | 'empleado';

// 🛡️ Verificar roles específicos
export const verificarRol = (rolesPermitidos: RolPermitido[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRol = req.user?.rol;
    if (!userRol || !rolesPermitidos.includes(userRol as RolPermitido)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes los permisos necesarios para esta acción'
      });
    }
    next();
  };
};

// 🎫 Verificar token y permisos
export const verificarToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'No autorizado',
        message: 'Token no proporcionado o formato inválido'
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: number;
        empresaId?: number;
        rol: string;
        exp: number;
      };

      // ⏰ Verificar expiración del token
      const ahora = Math.floor(Date.now() / 1000);
      if (decoded.exp < ahora) {
        res.status(401).json({
          error: 'Token expirado',
          message: 'La sesión ha expirado, por favor inicia sesión nuevamente'
        });
        return;
      }

      // 👤 Buscar usuario y verificar estado
      const usuario = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          empresaId: true,
          rol: true,
          email: true
        }
      });

      if (!usuario) {
        res.status(401).json({
          error: 'Usuario inválido',
          message: 'El usuario asociado al token no existe'
        });
        return;
      }

      // 🏢 Verificar acceso a empresa si es requerido
      if (decoded.empresaId && usuario.empresaId !== decoded.empresaId) {
        res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes acceso a esta empresa'
        });
        return;
      }

      // ✅ Agregar información del usuario al request
      req.user = {
        userId: usuario.id,
        empresaId: usuario.empresaId,
        rol: usuario.rol
      };

      next();
    } catch (tokenError) {
      res.status(401).json({
        error: 'Token inválido',
        message: 'El token proporcionado no es válido'
      });
      return;
    }
  } catch (error) {
    console.error('🔐 Error en verificación de token:', error);
    res.status(500).json({
      error: 'Error de autenticación',
      message: 'Error al procesar la autenticación'
    });
    return;
  }
}
