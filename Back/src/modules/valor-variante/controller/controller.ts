import { Request, Response } from 'express'
import * as service from '../service/service'

export const crear = async (req: Request, res: Response) => {
  const tipoVarianteId = parseInt(req.params.tipoId)
  const { nombre, articuloId, valor } = req.body
  const valorVariante = await service.crear(tipoVarianteId, nombre, articuloId, valor)
  res.status(201).json(valorVariante)
}

export const listarPorTipo = async (req: Request, res: Response) => {
  const tipoVarianteId = parseInt(req.params.tipoId)
  const valores = await service.listarPorTipo(tipoVarianteId)
  res.json(valores)
}
export const actualizar = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const { nombre } = req.body
  const valor = await service.actualizar(id, nombre)
  res.json(valor)
}

export const eliminar = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  await service.eliminar(id)
  res.status(204).send()
}
