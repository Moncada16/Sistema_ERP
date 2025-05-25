 import { Request, Response } from 'express'
  import * as service from '../service/inventario.service'

 export const asignarInventario = async (req: Request, res: Response) => {
   const varianteId = parseInt(req.params.id)
   const { bodegaId, cantidad } = req.body
   const inv = await service.asignarInventario(varianteId, bodegaId, cantidad)
   res.status(201).json(inv)
 }

 export const verInventario = async (req: Request, res: Response) => {
   const varianteId = parseInt(req.params.id)
   const inventario = await service.verInventarioPorVariante(varianteId)
   res.json(inventario)
 }
