import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../../../prisma/client'

const SALT_ROUNDS = 10

export const createUser = async (
  nombre: string,
  telefono: string,
  email: string,
  password: string
) => {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      nombre,
      telefono,
      email,
      password: hashed,
      rol: 'gerente'
      // empresaId no se pasa aún
    }
  })

  const token = jwt.sign(
    { userId: user.id, empresaId: user.empresaId, rol: user.rol },
    process.env.JWT_SECRET as string,
    { expiresIn: '8h' }
  )

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      createdAt: user.createdAt
    },
    token
  }
}

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      telefono: true,
      createdAt: true
    }
  })
}

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      nombre: true,
      email: true,
      telefono: true,
      createdAt: true
    }
  })
}

export const getUserWithEmpresa = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      email: true,
      empresa: true
    }
  })
}
