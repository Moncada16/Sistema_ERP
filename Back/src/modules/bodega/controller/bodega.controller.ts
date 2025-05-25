import { Request, Response } from 'express'
import BodegaService from '../service/bodega.service'

const BodegaController = {
  async getBodegas(req: Request, res: Response): Promise<void> {
    const empresaId = req.user?.empresaId
    const bodegas = await BodegaService.getAllByEmpresa(empresaId!)
    res.json(bodegas)
  },

  async createBodega(req: Request, res: Response): Promise<void> {
    const empresaId = req.user?.empresaId
    const data = req.body
    const bodega = await BodegaService.create({ ...data, empresaId })
    res.status(201).json(bodega)
  },

  async updateBodega(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id)
    const empresaId = req.user?.empresaId
    const data = req.body
    const updated = await BodegaService.update(id, data, empresaId!)
    res.json(updated)
  },

  async deleteBodega(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id)
    const empresaId = req.user?.empresaId
    await BodegaService.delete(id, empresaId!)
    res.status(204).send()
  }
}

export default BodegaController
