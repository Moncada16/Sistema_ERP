// src/modules/foto/controller/foto.controller.ts
import { Request, Response } from 'express'
import * as fotoService from '../service/foto.service'
import cloudinary from '../../../config/cloudinary'

export const agregarFoto = async (req: Request, res: Response): Promise<void> => {
  const articuloId = parseInt(req.params.id)
  const orden = req.body.orden ? parseInt(req.body.orden) : undefined
  const file = req.file

  if (!file) {
    res.status(400).json({ error: 'Imagen requerida' })
    return
  }

  try {
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    const result = await cloudinary.uploader.upload(base64, {
      folder: `erp/articulos/${articuloId}`
    })

    const nuevaFoto = await fotoService.agregarFoto({
      articuloId,
      url: result.secure_url,
      publicId: result.public_id,
      orden
    })

    res.status(201).json(nuevaFoto)
  } catch (error) {
    console.error('❌ Error al subir foto:', error)
    res.status(500).json({ error: 'Error al subir foto' })
  }
}

export const listarFotos = async (req: Request, res: Response): Promise<void> => {
  const articuloId = parseInt(req.params.id)
  try {
    const fotos = await fotoService.listarFotos(articuloId)
    res.json(fotos)
  } catch {
    res.status(500).json({ error: 'Error al listar fotos' })
  }
}

export const eliminarFoto = async (req: Request, res: Response): Promise<void> => {
  const fotoId = parseInt(req.params.id)
  try {
    await fotoService.eliminarFoto(fotoId)
    res.status(204).send()
  } catch {
    res.status(500).json({ error: 'Error al eliminar foto' })
  }
}
