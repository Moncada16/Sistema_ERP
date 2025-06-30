import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
// Usar la misma importación que en tu EmpresaController
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
    console.log('=== INICIANDO VERIFICACIÓN DE TOKEN ===')
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader)

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('❌ No hay token o formato inválido')
      res.status(401).json({
        error: 'No autorizado',
        message: 'Token no proporcionado o formato inválido'
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token.substring(0, 20) + '...')

    try {
      // Verificar que JWT_SECRET esté definido
      if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET no está definido en variables de entorno')
        res.status(500).json({
          error: 'Error de configuración',
          message: 'Configuración de seguridad incompleta'
        });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: number;
        empresaId?: number;
        rol: string;
        exp: number;
      };

      console.log('Token decodificado:', decoded)

      // ⏰ Verificar expiración del token
      const ahora = Math.floor(Date.now() / 1000);
      if (decoded.exp < ahora) {
        console.log('❌ Token expirado')
        res.status(401).json({
          error: 'Token expirado',
          message: 'La sesión ha expirado, por favor inicia sesión nuevamente'
        });
        return;
      }

      console.log('Buscando usuario con ID:', decoded.userId)

      // 👤 Buscar usuario y verificar estado (CORREGIDO: usar 'user' según tu schema)
      const usuario = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          empresaId: true,
          rol: true,
          email: true,
          nombre: true
        }
      });

      console.log('Usuario encontrado en DB:', usuario)

      if (!usuario) {
        console.log('❌ Usuario no encontrado en DB')
        res.status(401).json({
          error: 'Usuario inválido',
          message: 'El usuario asociado al token no existe'
        });
        return;
      }

      // 🏢 Verificar acceso a empresa si es requerido
      if (decoded.empresaId && usuario.empresaId !== decoded.empresaId) {
        console.log('❌ Usuario no tiene acceso a esta empresa')
        res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes acceso a esta empresa'
        });
        return;
      }

      // ✅ Agregar información del usuario al request
      req.user = {
        userId: usuario.id,
        empresaId: usuario.empresaId, // Esto será el valor real de la DB
        rol: usuario.rol
      };

      console.log('✅ req.user asignado:', req.user)
      console.log('=== VERIFICACIÓN COMPLETADA ===')

      next();
    } catch (tokenError) {
      console.error('❌ Error al verificar token:', tokenError)
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