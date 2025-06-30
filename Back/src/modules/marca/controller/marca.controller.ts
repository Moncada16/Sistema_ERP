
import { Request, Response } from 'express'
import MarcaService from '../service/marca.service'

const MarcaController = {
  async getMarcas(req: Request, res: Response): Promise<void> {
    try {
      const empresaId = req.user?.empresaId
      
      if (!empresaId || empresaId === null) {
        res.status(400).json({ 
          error: 'No tienes una empresa asignada. Contacta al administrador.' 
        })
        return
      }

      const marcas = await MarcaService.getAllByEmpresa(empresaId)
      res.json(marcas)
    } catch (error) {
      console.error('Error en getMarcas:', error)
      res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  },

  async createMarca(req: Request, res: Response): Promise<void> {
    try {
      const empresaId = req.user?.empresaId
      
      if (!empresaId || empresaId === null) {
        res.status(400).json({ 
          error: 'No tienes una empresa asignada. Contacta al administrador.' 
        })
        return
      }

      const { nombre, descripcion, logo } = req.body
      
      if (!nombre || !nombre.trim()) {
        res.status(400).json({ error: 'El nombre es requerido' })
        return
      }

      const marcaData = {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        logo: logo?.trim() || null,
        empresaId
      }

      const marca = await MarcaService.create(marcaData)
      res.status(201).json(marca)
    } catch (error) {
      console.error('Error en createMarca:', error)
      
      if (error instanceof Error && error.message.includes('Ya existe una marca')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al crear marca',
          details: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  },

  async updateMarca(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const empresaId = req.user?.empresaId
      const { nombre, descripcion, logo } = req.body

      if (!empresaId || empresaId === null) {
        res.status(400).json({ error: 'No tienes una empresa asignada' })
        return
      }

      if (isNaN(id)) {
        res.status(400).json({ error: 'ID de marca inválido' })
        return
      }

      const updateData = {
        ...(nombre && { nombre: nombre.trim() }),
        ...(descripcion !== undefined && { descripcion: descripcion?.trim() || null }),
        ...(logo !== undefined && { logo: logo?.trim() || null })
      }

      const marca = await MarcaService.update(id, updateData, empresaId)
      res.json(marca)
    } catch (error) {
      console.error('Error en updateMarca:', error)
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: 'Marca no encontrada' })
      } else if (error instanceof Error && error.message.includes('Ya existe una marca')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al actualizar marca',
          details: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  },

  async deleteMarca(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const empresaId = req.user?.empresaId

      if (!empresaId || empresaId === null) {
        res.status(400).json({ error: 'No tienes una empresa asignada' })
        return
      }

      if (isNaN(id)) {
        res.status(400).json({ error: 'ID de marca inválido' })
        return
      }

      await MarcaService.delete(id, empresaId)
      res.status(204).send()
    } catch (error) {
      console.error('Error en deleteMarca:', error)
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: 'Marca no encontrada' })
      } else if (error instanceof Error && error.message.includes('artículos asociados')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al eliminar marca',
          details: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  },

  async createMarcasDefecto(req: Request, res: Response): Promise<void> {
    try {
      const empresaId = req.user?.empresaId
      
      if (!empresaId || empresaId === null) {
        res.status(400).json({ 
          error: 'No tienes una empresa asignada. Contacta al administrador.' 
        })
        return
      }

      const marcas = await MarcaService.createMarcasDefecto(empresaId)
      
      res.status(201).json({
        message: `Se crearon ${marcas.length} marcas por defecto`,
        marcas
      })
    } catch (error) {
      console.error('Error en createMarcasDefecto:', error)
      
      if (error instanceof Error && error.message.includes('Ya tienes marcas')) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al crear marcas por defecto',
          details: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  }
}

export default MarcaController