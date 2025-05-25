import { Request, Response } from 'express'
import prisma from '../../../../prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        empresaId: true,
        empresa: true,
        imgPublicId: true,
        img: true,
        createdAt: true
      }
    })

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' })
  }
}

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId
  const { nombre, telefono, email } = req.body

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { nombre, telefono, email },
      select: {
        id: true,
        nombre: true,
        telefono: true,
        email: true,
        updatedAt: true,
        imgPublicId: true,
        img: true
      }
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' })
  }
}

export const cambiarPassword = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId
  const { actual, nueva, confirmar } = req.body

  if (!actual || !nueva || !confirmar) {
    res.status(400).json({ error: 'Se requieren contraseña actual, nueva y confirmación' })
    return
  }

  if (nueva.length < 6) {
    res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })
    return
  }

  if (nueva !== confirmar) {
    res.status(400).json({ error: 'Las nuevas contraseñas no coinciden' })
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    const isMatch = await bcrypt.compare(actual, user.password)

    if (!isMatch) {
      res.status(401).json({ error: 'Contraseña actual incorrecta' })
      return
    }

    const nuevaHasheada = await bcrypt.hash(nueva, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: nuevaHasheada }
    })

    res.status(200).json({ message: 'Contraseña actualizada con éxito' })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, rol: true, empresaId: true }
    })

    if (!user || !user.empresaId) {
      res.status(403).json({ error: 'Empresa no asignada' })
      return
    }

    const token = jwt.sign(
      { userId: user.id, empresaId: user.empresaId, rol: user.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    )

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Error al generar token' })
  }
}
