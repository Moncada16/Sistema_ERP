import { Request, Response } from 'express'
import * as service from '../service/compra.service'

export const crearCompra = async (req: Request, res: Response) => {
  try {
    const compra = await service.registrarCompra(req.body)
    res.status(201).json(compra)
  } catch (err: any) {
    console.error('❌ Error en compra:', err.message)
    res.status(400).json({ error: err.message || 'Error al registrar compra' })
  }
}
