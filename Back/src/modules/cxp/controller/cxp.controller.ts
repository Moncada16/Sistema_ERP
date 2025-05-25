import { Request, Response } from 'express'
import * as service from '../service/cxp.service'

export const crear = async (req: Request, res: Response) => {
  try {
    const data = await service.crearCuentaPorPagar(req.body)
    res.status(201).json(data)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export const listar = async (_req: Request, res: Response) => {
  const cuentas = await service.listarCuentas()
  res.json(cuentas)
}

export const abonar = async (req: Request, res: Response) => {
  try {
    const abono = await service.registrarAbono(req.body)
    res.status(201).json(abono)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export const verDetalle = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const cuenta = await service.verCuentaPorId(id)
    res.json(cuenta)
  } catch {
    res.status(404).json({ error: 'Cuenta no encontrada' })
  }
}
