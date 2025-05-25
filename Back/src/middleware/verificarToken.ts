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

export const verificarToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token no proporcionado' })
      return
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number
      rol: string
    }

    // ✅ Buscamos el usuario con empresa actualizada
    const usuario = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        empresaId: true,
        rol: true
      }
    })

    if (!usuario) {
      res.status(401).json({ error: 'Usuario no encontrado' })
      return
    }

    req.user = {
      userId: usuario.id,
      empresaId: usuario.empresaId,
      rol: usuario.rol
    }

    console.log('✅ Usuario autenticado:', req.user)
    next()
  } catch (error) {
    console.error('❌ Error en verificarToken:', error)
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
