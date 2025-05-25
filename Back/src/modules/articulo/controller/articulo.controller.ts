// import { Request, Response } from 'express'
// // import * as service from '../service/articulo.service'

// export const crearArticulo = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const empresaId = req.user?.empresaId
//     const { nombre, descripcion, precio } = req.body

//     if (typeof empresaId !== 'number' || !nombre || !precio) {
//       res.status(400).json({ error: 'Datos incompletos o empresa no autorizada' })
//       return
//     }

//     const articulo = await service.crearArticulo(empresaId, nombre, descripcion, precio)
//     res.status(201).json(articulo)
//   } catch (error) {
//     res.status(500).json({ error: 'Error al crear artículo' })
//   }
// }

// export const listarArticulos = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const empresaId = req.user?.empresaId

//     if (typeof empresaId !== 'number') {
//       res.status(403).json({ error: 'Empresa no autorizada' })
//       return
//     }

//     const articulos = await service.listarArticulos(empresaId)
//     res.status(200).json(articulos)
//   } catch {
//     res.status(500).json({ error: 'Error al listar artículos' })
//   }
// }


// export const obtenerArticuloPorId = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const id = parseInt(req.params.id)
//     const articulo = await service.obtenerArticuloPorId(id)
//     if (!articulo) {
//       res.status(404).json({ error: 'No encontrado' })
//       return
//     }
//     res.json(articulo)
//   } catch {
//     res.status(500).json({ error: 'Error al obtener artículo' })
//   }
// }

// export const actualizarArticulo = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const id = parseInt(req.params.id)
//     const articulo = await service.actualizarArticulo(id, req.body)
//     res.json(articulo)
//   } catch {
//     res.status(500).json({ error: 'Error al actualizar artículo' })
//   }
// }

// export const eliminarArticulo = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const id = parseInt(req.params.id)
//     await service.eliminarArticulo(id)
//     res.status(204).send()
//   } catch {
//     res.status(500).json({ error: 'Error al eliminar artículo' })
//   }
// }
