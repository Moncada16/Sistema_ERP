import { Request, Response } from 'express'
import {
  crearTipoPrecioService,
  listarTipoPreciosService,
  obtenerTipoPrecioService,
  actualizarTipoPrecioService,
  eliminarTipoPrecioService,
} from '../service/tipoPrecio.service'

export const crearTipoPrecio = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { nombre } = req.body
  if (!nombre) {
    res.status(400).json({ mensaje: 'Nombre obligatorio' })
    return
  }

  try {
    const tipo = await crearTipoPrecioService(nombre)
    res.status(201).json(tipo)
  } catch (error: any) {
    console.error(error)
    if (error.code === 'P2002') {
      res.status(409).json({ mensaje: 'Ese tipo ya existe' })
    } else {
      res.status(500).json({ mensaje: 'Error al crear tipo de precio' })
    }
  }
}

export const listarTipoPrecios = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const tipos = await listarTipoPreciosService()
    res.json(tipos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al listar tipos' })
  }
}

export const obtenerTipoPrecio = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    res.status(400).json({ mensaje: 'ID inválido' })
    return
  }

  try {
    const tipo = await obtenerTipoPrecioService(id)
    if (!tipo) {
      res.status(404).json({ mensaje: 'Tipo no encontrado' })
      return
    }
    res.json(tipo)
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al obtener tipo' })
  }
}

export const actualizarTipoPrecio = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id)
  const { nombre } = req.body
  if (isNaN(id) || !nombre) {
    res.status(400).json({ mensaje: 'Datos inválidos' })
    return
  }

  try {
    const tipo = await actualizarTipoPrecioService(id, nombre)
    res.json(tipo)
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al actualizar tipo' })
  }
}

export const eliminarTipoPrecio = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    res.status(400).json({ mensaje: 'ID inválido' })
    return
  }

  try {
    await eliminarTipoPrecioService(id)
    res.sendStatus(204)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al eliminar tipo' })
  }
}
