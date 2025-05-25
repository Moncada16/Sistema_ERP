import { Request, Response } from 'express'
import {
  upsertPrecioArticuloService,
  listarPreciosService,
  actualizarPrecioService,
  eliminarPrecioService,
} from '../service/precioArticulo.service'

export const crearOCrearOActualizar = async (req: Request, res: Response) => {
  const articuloId = Number(req.params.articuloId)
  const { tipoPrecioId, valor } = req.body

  if (isNaN(articuloId) || isNaN(tipoPrecioId) || typeof valor !== 'number') {
    return res.status(400).json({ mensaje: 'Datos inválidos' })
  }

  try {
    const precio = await upsertPrecioArticuloService(articuloId, {
      tipoPrecioId,
      valor,
    })
    return res.status(201).json(precio)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensaje: 'Error al guardar precio' })
  }
}

export const listarPreciosPorArticulo = async (
  req: Request,
  res: Response
) => {
  const articuloId = Number(req.params.articuloId)
  if (isNaN(articuloId)) {
    return res.status(400).json({ mensaje: 'ID de artículo inválido' })
  }

  try {
    const precios = await listarPreciosService(articuloId)
    return res.json(precios)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensaje: 'Error al listar precios' })
  }
}

export const actualizarPrecio = async (req: Request, res: Response) => {
  const id    = Number(req.params.id)
  const { valor } = req.body
  if (isNaN(id) || typeof valor !== 'number') {
    return res.status(400).json({ mensaje: 'Datos inválidos' })
  }

  try {
    const precio = await actualizarPrecioService(id, valor)
    return res.json(precio)
  } catch (error: any) {
    console.error(error)
    if (error.code === 'P2025') {
      return res.status(404).json({ mensaje: 'Precio no existe' })
    }
    return res.status(500).json({ mensaje: 'Error al actualizar' })
  }
}

export const eliminarPrecio = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' })
  }

  try {
    await eliminarPrecioService(id)
    return res.sendStatus(204)
  } catch (error: any) {
    console.error(error)
    if (error.code === 'P2025') {
      return res.status(404).json({ mensaje: 'Precio no encontrado' })
    }
    return res.status(500).json({ mensaje: 'Error al eliminar' })
  }
}
