import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { registerUser, loginUser } from '../service/auth.service'

const JWT_SECRET = process.env.JWT_SECRET as string

const generarAccessToken = (payload: { id: number; empresaId: number | null; rol: string }) => {
  return jwt.sign(
    {
      userId: payload.id,
      empresaId: payload.empresaId,
      rol: payload.rol
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  )
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { nombre, email, telefono, password, confirmPassword } = req.body

  if (!nombre || !email || !telefono || !password || !confirmPassword) {
    res.status(400).json({ error: 'Todos los campos son obligatorios' })
    return
  }

  if (password !== confirmPassword) {
    res.status(400).json({ error: 'Las contraseñas no coinciden' })
    return
  }

  try {
    const user = await registerUser({ nombre, email, telefono, password })

    const token = generarAccessToken({
      id: user.id,
      empresaId: user.empresaId,
      rol: user.rol
    })

    res.status(201).json({
      message: 'Registro y login exitosos',
      token,
      user
    })
  } catch (err) {
    res.status(400).json({ error: (err as Error).message })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    const { user } = await loginUser(email, password)

    const token = generarAccessToken({
      id: user.id,
      empresaId: user.empresaId,
      rol: user.rol
    })

    res.status(200).json({ token, user })
  } catch (err) {
    res.status(401).json({ error: (err as Error).message })
  }
}

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(204).send()
}
