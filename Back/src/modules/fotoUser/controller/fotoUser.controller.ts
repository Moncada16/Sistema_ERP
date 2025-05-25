import { Request, Response } from 'express'
import cloudinary from '../../../config/cloudinary'
import * as userFotoService from '../service/fotoUser.service'

export const subirFotoPerfil = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id)
  const file = req.file

  if (!file) {
    res.status(400).json({ error: 'Imagen requerida' })
    return
  }

  try {
    // Convertir el archivo a base64 para subir a Cloudinary
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`

    // Obtener al usuario para acceder a imgPublicId y eliminar la imagen anterior si existe
    const user = await userFotoService.obtenerUsuario(userId)

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    if (user.imgPublicId) {
      await cloudinary.uploader.destroy(user.imgPublicId)
    }

    // Subir nueva imagen
    const result = await cloudinary.uploader.upload(base64, {
      folder: `erp/usuarios/${userId}`
    })

    // Actualizar la imagen en la base de datos
    const userActualizado = await userFotoService.actualizarFotoPerfil(
      userId,
      result.secure_url,
      result.public_id
    )

    // ✅ Devolver solo la URL de la nueva imagen
    res.status(200).json({ photo: userActualizado.imgPublicId})
  } catch (error) {
    console.error('❌ Error al subir foto de usuario:', error)
    res.status(500).json({ error: 'Error al subir foto de usuario' })
  }
}
