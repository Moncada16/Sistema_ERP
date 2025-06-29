// ================================
// 1. BACKEND - CONTROLLER CORREGIDO (articulo.controller.ts)
// ================================
import { Request, Response } from 'express'
import * as service from '../service/articulo.service'

interface ArticuloRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  variantes?: { tipoVarianteId: number; valor: string }[];
  precios?: { tipoPrecioId: number; valor: number }[];
}

export const crearArticulo = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId
    const { nombre, descripcion, precio, variantes, precios }: ArticuloRequest = req.body

    if (typeof empresaId !== 'number') {
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    if (!nombre || !precio || precio <= 0) {
      res.status(400).json({ error: 'Nombre y precio son requeridos. El precio debe ser mayor a 0.' })
      return
    }

    const articulo = await service.crearArticulo(
      empresaId, 
      nombre, 
      descripcion || '', 
      precio,
      variantes,
      precios
    )
    
    // ✅ RESPUESTA CONSISTENTE - Solo devolver la data
    res.status(201).json(articulo)
  } catch (error) {
    console.error('Error al crear artículo:', error)
    res.status(500).json({ error: 'Error interno del servidor al crear artículo' })
  }
}

export const listarArticulos = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresaId = req.user?.empresaId

    if (typeof empresaId !== 'number') {
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    const articulos = await service.listarArticulos(empresaId)
    
    // ✅ IMPORTANTE: Devolver directamente el array para que coincida con el frontend
    res.status(200).json(articulos)
  } catch (error) {
    console.error('Error al listar artículos:', error)
    res.status(500).json({ error: 'Error interno del servidor al listar artículos' })
  }
}

export const obtenerArticuloPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' })
      return
    }

    const articulo = await service.obtenerArticuloPorId(id)
    
    if (!articulo) {
      res.status(404).json({ error: 'Artículo no encontrado' })
      return
    }

    res.status(200).json(articulo)
  } catch (error) {
    console.error('Error al obtener artículo:', error)
    res.status(500).json({ error: 'Error interno del servidor al obtener artículo' })
  }
}

export const actualizarArticulo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' })
      return
    }

    const articuloExistente = await service.obtenerArticuloPorId(id)
    if (!articuloExistente) {
      res.status(404).json({ error: 'Artículo no encontrado' })
      return
    }

    const articulo = await service.actualizarArticulo(id, req.body)
    res.status(200).json(articulo)
  } catch (error) {
    console.error('Error al actualizar artículo:', error)
    res.status(500).json({ error: 'Error interno del servidor al actualizar artículo' })
  }
}

export const eliminarArticulo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' })
      return
    }

    const articuloExistente = await service.obtenerArticuloPorId(id)
    if (!articuloExistente) {
      res.status(404).json({ error: 'Artículo no encontrado' })
      return
    }

    await service.eliminarArticulo(id)
    res.status(200).json({ message: 'Artículo eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar artículo:', error)
    res.status(500).json({ error: 'Error interno del servidor al eliminar artículo' })
  }
}

// ================================
// 2. BACKEND - ROUTES CORREGIDAS (articulo.routes.ts)
// ================================
import { Router } from 'express'
import * as controller from '../controller/articulo.controller'
import { verificarToken } from '../../../middleware/verificarToken'

const router = Router()

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarToken)

// 📦 Artículo CRUD
router.post('/', controller.crearArticulo)          // POST /api/articulos
router.get('/', controller.listarArticulos)         // GET /api/articulos  
router.get('/:id', controller.obtenerArticuloPorId) // GET /api/articulos/:id
router.put('/:id', controller.actualizarArticulo)   // PUT /api/articulos/:id
router.delete('/:id', controller.eliminarArticulo)  // DELETE /api/articulos/:id

export default router