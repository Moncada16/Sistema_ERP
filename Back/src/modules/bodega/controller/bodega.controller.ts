import { Request, Response } from 'express'
import BodegaService from '../service/bodega.service'

const BodegaController = {
  async getBodegas(req: Request, res: Response): Promise<void> {
    try {
      console.log('Usuario en req:', req.user)
      
      const empresaId = req.user?.empresaId
      
      // Verificar que empresaId no sea null o undefined
      if (!empresaId || empresaId === null) {
        res.status(400).json({ 
          error: 'No tienes una empresa asignada. Contacta al administrador.',
          user: req.user 
        })
        return
      }

      const bodegas = await BodegaService.getAllByEmpresa(empresaId)
      console.log('Bodegas encontradas:', bodegas.length)
      
      res.json(bodegas)
    } catch (error) {
      console.error('Error en getBodegas:', error)
      res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  },

  async createBodega(req: Request, res: Response): Promise<void> {
    try {
      console.log('Usuario completo en createBodega:', req.user)
      console.log('Datos recibidos:', req.body)
      
      const empresaId = req.user?.empresaId
      
      // Verificar que empresaId no sea null o undefined
      if (!empresaId || empresaId === null) {
        res.status(400).json({ 
          error: 'No tienes una empresa asignada. Contacta al administrador.',
          user: req.user 
        })
        return
      }

      const data = req.body
      
      // Validar que se envíen los campos requeridos
      if (!data.nombre || !data.direccion) {
        res.status(400).json({ 
          error: 'Nombre y dirección son campos requeridos',
          received: data
        })
        return
      }

      // Validar longitud de campos
      if (data.nombre.trim().length < 2) {
        res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' })
        return
      }

      if (data.direccion.trim().length < 5) {
        res.status(400).json({ error: 'La dirección debe tener al menos 5 caracteres' })
        return
      }

      const bodegaData = {
        nombre: data.nombre.trim(),
        direccion: data.direccion.trim(),
        empresaId: empresaId
      }

      console.log('Creando bodega con datos:', bodegaData)
      
      const bodega = await BodegaService.create(bodegaData)
      
      console.log('Bodega creada exitosamente:', bodega)
      res.status(201).json(bodega)
      
    } catch (error) {
      console.error('Error en createBodega:', error)
      res.status(500).json({ 
        error: 'Error interno del servidor al crear bodega',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  },

  async updateBodega(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const empresaId = req.user?.empresaId
      const data = req.body

      console.log('Actualizando bodega:', { id, empresaId, data })

      if (!empresaId || empresaId === null) {
        res.status(400).json({ error: 'No tienes una empresa asignada. Contacta al administrador.' })
        return
      }

      if (isNaN(id)) {
        res.status(400).json({ error: 'ID de bodega inválido' })
        return
      }

      const updated = await BodegaService.update(id, data, empresaId)
      
      console.log('Bodega actualizada:', updated)
      res.json(updated)
      
    } catch (error) {
      console.error('Error en updateBodega:', error)
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: 'Bodega no encontrada o sin permisos' })
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al actualizar bodega',
          details: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  },

  async deleteBodega(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id)
      const empresaId = req.user?.empresaId

      console.log('Eliminando bodega:', { id, empresaId })

      if (!empresaId || empresaId === null) {
        res.status(400).json({ error: 'No tienes una empresa asignada. Contacta al administrador.' })
        return
      }

      if (isNaN(id)) {
        res.status(400).json({ error: 'ID de bodega inválido' })
        return
      }

      await BodegaService.delete(id, empresaId)
      
      console.log('Bodega eliminada exitosamente')
      res.status(204).send()
      
    } catch (error) {
      console.error('Error en deleteBodega:', error)
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: 'Bodega no encontrada o sin permisos' })
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor al eliminar bodega',
          details: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  }
}

export default BodegaController