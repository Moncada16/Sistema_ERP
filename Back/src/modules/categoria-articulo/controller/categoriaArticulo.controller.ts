import { Request, Response } from 'express'
import CategoriaArticuloService from '../service/categoriaArticulo.service'

const CategoriaArticuloController = {
  async getCategorias(req: Request, res: Response): Promise<void> {
    try {
      const empresaId = req.user?.empresaId
      
      if (!empresaId || empresaId === null) {
        res.status(400).json({ 
          error: 'No tienes una empresa asignada. Contacta al administrador.' 
        })
        return
      }

      const categorias = await CategoriaArticuloService.getAllByEmpresa(empresaId)
      res.json(categorias)
    } catch (error) {
      console.error('Error en getCategorias:', error)
      res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  },

  async createCategoria(req: Request, res: Response): Promise<void> {
    try {
      const empresaId = req.user?.empresaId
      
      if (!empresaId || empresaId === null) {
        res.status(400).json({ 
          error: 'No tienes una empresa asignada. Contacta al administrador.' 
        })
        return
      }

      const { nombre, descripcion, icono } = req.body
      
      if (!nombre || !nombre.trim()) {
        res.status(400).json({ error: 'El nombre es requerido' })
        return
      }

      const categoriaData = {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        icono: icono?.trim() || null,
        empresaId
      }

      const categoria = await CategoriaArticuloService.create(categoriaData)
      res.status(201).json(categoria)
    } catch (error) {
      console.error('Error en createCategoria:', error)
      
      if (error instanceof Error && error.message.includes('Ya existe una categoría')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al crear categoría',
          details: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  },

  async updateCategoria(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const empresaId = req.user?.empresaId
      const { nombre, descripcion, icono } = req.body

      if (!empresaId || empresaId === null) {
        res.status(400).json({ error: 'No tienes una empresa asignada' })
        return
      }

      if (isNaN(id)) {
        res.status(400).json({ error: 'ID de categoría inválido' })
        return
      }

      const updateData = {
        ...(nombre && { nombre: nombre.trim() }),
        ...(descripcion !== undefined && { descripcion: descripcion?.trim() || null }),
        ...(icono !== undefined && { icono: icono?.trim() || null })
      }

      const categoria = await CategoriaArticuloService.update(id, updateData, empresaId)
      res.json(categoria)
    } catch (error) {
      console.error('Error en updateCategoria:', error)
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: 'Categoría no encontrada' })
      } else if (error instanceof Error && error.message.includes('Ya existe una categoría')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al actualizar categoría',
          details: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  },

  async deleteCategoria(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const empresaId = req.user?.empresaId

      if (!empresaId || empresaId === null) {
        res.status(400).json({ error: 'No tienes una empresa asignada' })
        return
      }

      if (isNaN(id)) {
        res.status(400).json({ error: 'ID de categoría inválido' })
        return
      }

      await CategoriaArticuloService.delete(id, empresaId)
      res.status(204).send()
    } catch (error) {
      console.error('Error en deleteCategoria:', error)
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: 'Categoría no encontrada' })
      } else if (error instanceof Error && error.message.includes('artículos asociados')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al eliminar categoría',
          details: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  },

  async createCategoriasDefecto(req: Request, res: Response): Promise<void> {
    try {
      const empresaId = req.user?.empresaId
      
      if (!empresaId || empresaId === null) {
        res.status(400).json({ 
          error: 'No tienes una empresa asignada. Contacta al administrador.' 
        })
        return
      }

      const categorias = await CategoriaArticuloService.createCategoriasDefecto(empresaId)
      
      res.status(201).json({
        message: `Se crearon ${categorias.length} categorías por defecto`,
        categorias
      })
    } catch (error) {
      console.error('Error en createCategoriasDefecto:', error)
      
      if (error instanceof Error && error.message.includes('Ya tienes categorías')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al crear categorías por defecto',
          details: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  }
}

export default CategoriaArticuloController