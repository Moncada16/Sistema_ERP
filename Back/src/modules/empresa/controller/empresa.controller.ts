// src/modules/empresa/controller/EmpresaController.ts
import { Request, Response } from 'express'
import EmpresaService from '../service/empresa.service'
import prisma from '../../../../prisma/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

const generarAccessToken = (user: { id: number, empresaId: number | null, rol: string }) => {
  return jwt.sign(
    {
      userId: user.id,
      empresaId: user.empresaId,
      rol: user.rol
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  )
}

const EmpresaController = {
  async getMiEmpresa(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId

    if (!userId) {
      res.status(403).json({ error: 'No autenticado' })
      return
    }

    try {
      const empresa = await EmpresaService.getEmpresaByUserId(userId)

      if (!empresa) {
        res.status(404).json({ error: 'No estás asignado a ninguna empresa' })
        return
      }

      res.json(empresa)
    } catch (err: any) {
      console.error('❌ Error en getMiEmpresa:', err)
      res.status(500).json({ error: err.message })
    }
  },

  async createEmpresa(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId
    const data = req.body

    if (!userId) {
      res.status(403).json({ error: 'Usuario no autenticado' })
      return
    }

    if (!data.nombre || !data.nit || !data.direccion) {
      res.status(400).json({ error: 'Faltan campos requeridos: nombre, nit o dirección' })
      return
    }

    try {
      // Crear empresa y asignar al usuario
      const nuevaEmpresa = await EmpresaService.createEmpresa(data, userId)

      // Consultar usuario actualizado
      const usuarioActualizado = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          empresaId: true,
          rol: true,
          nombre: true,
          email: true
        }
      })

      if (!usuarioActualizado) {
        res.status(404).json({ error: 'Usuario no encontrado después de crear empresa' })
        return
      }

      // ✅ Generar nuevo token con empresaId actualizado
      const token = generarAccessToken(usuarioActualizado)

      res.status(201).json({
        message: 'Empresa creada, usuario vinculado y token actualizado',
        empresa: nuevaEmpresa,
        token,
        usuario: usuarioActualizado
      })
    } catch (err: any) {
      console.error('❌ Error en createEmpresa:', err)
      res.status(500).json({ error: err.message })
    }
  },

  async updateMiEmpresa(req: Request, res: Response): Promise<void> {
    const empresaId = req.user?.empresaId
    const data = req.body

    if (!empresaId) {
      res.status(404).json({ error: 'No estás asignado a ninguna empresa' })
      return
    }

    try {
      const empresa = await EmpresaService.updateEmpresa(empresaId, data)
      res.json(empresa)
    } catch (err: any) {
      console.error('❌ Error en updateMiEmpresa:', err)
      res.status(500).json({ error: err.message })
    }
  },

  async deleteMiEmpresa(req: Request, res: Response): Promise<void> {
    const empresaId = req.user?.empresaId

    if (!empresaId) {
      res.status(404).json({ error: 'No estás asignado a ninguna empresa' })
      return
    }

    try {
      await EmpresaService.deleteEmpresa(empresaId)
      res.status(204).send()
    } catch (err: any) {
      console.error('❌ Error en deleteMiEmpresa:', err)
      res.status(500).json({ error: err.message })
    }
  }
}

export default EmpresaController
