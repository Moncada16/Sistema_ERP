import { Request, Response } from 'express'
import * as service from '../service/proveedor.service'

export const crear = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId
    if (!empresaId) {
      res.status(401).json({ error: 'Empresa no identificada' })
      return
    }

    const nuevo = await service.crearProveedor({
      ...req.body,
      empresaId
    })

    res.status(201).json(nuevo)
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error al crear proveedor' })
  }
}

export const listar = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId
    if (!empresaId) {
      res.status(401).json({ error: 'Empresa no identificada' })
      return
    }

    const data = await service.obtenerProveedores(empresaId)
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Error al listar proveedores' })
  }
}

export const actualizar = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id)
    const actualizado = await service.actualizarProveedor(id, req.body)
    res.json(actualizado)
  } catch {
    res.status(400).json({ error: 'Error al actualizar proveedor' })
  }
}

export const eliminar = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id)
    await service.eliminarProveedor(id)
    res.status(204).send()
  } catch {
    res.status(400).json({ error: 'Error al eliminar proveedor' })
  }
}
