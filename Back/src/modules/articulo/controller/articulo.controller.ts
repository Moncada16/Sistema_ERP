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
    console.log('🔥 === INICIO crearArticulo ===')
    console.log('🔥 req.user:', req.user)
    console.log('🔥 req.body:', JSON.stringify(req.body, null, 2))
    
    const empresaId = req.user?.empresaId
    const { nombre, descripcion, precio, variantes, precios }: ArticuloRequest = req.body

    console.log('🔥 empresaId extraído:', empresaId)
    console.log('🔥 datos extraídos:', { nombre, descripcion, precio, variantes, precios })

    if (typeof empresaId !== 'number') {
      console.log('❌ empresaId no es número:', typeof empresaId)
      res.status(403).json({ error: 'Empresa no autorizada' })
      return
    }

    if (!nombre || !precio || precio <= 0) {
      console.log('❌ Validación falló:', { nombre: !!nombre, precio, precioValido: precio > 0 })
      res.status(400).json({ error: 'Nombre y precio son requeridos. El precio debe ser mayor a 0.' })
      return
    }

    console.log('✅ Validaciones pasaron, llamando al service...')
    console.log('🔥 Parámetros para service:', {
      empresaId, 
      nombre, 
      descripcion: descripcion || '', 
      precio,
      variantes,
      precios
    })

    const articulo = await service.crearArticulo(
      empresaId, 
      nombre, 
      descripcion || '', 
      precio,
      variantes,
      precios
    )
    
    console.log('✅ Service devolvió:', articulo)
    console.log('🔥 === FIN crearArticulo EXITOSO ===')
    
    res.status(201).json(articulo)
  } catch (error) {
    console.error('❌ === ERROR en crearArticulo ===')
    console.error('❌ Error completo:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack available')
    console.error('❌ Error message:', error instanceof Error ? error.message : String(error))
    console.error('❌ === FIN ERROR ===')
    
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