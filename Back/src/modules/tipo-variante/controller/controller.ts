import { Request, Response } from 'express'
import * as service from '../service/service'

export const crear = async (req: Request, res: Response) => {
  const { nombre } = req.body
  const tipo = await service.crear(nombre)
  res.status(201).json(tipo)
}

export const listar = async (_req: Request, res: Response) => {
  const tipos = await service.listar()
  res.json(tipos)
}
export const actualizar = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const { nombre } = req.body
  const tipo = await service.actualizar(id, nombre)
  res.json(tipo)
}

export const eliminar = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  await service.eliminar(id)
  res.status(204).send()
}
