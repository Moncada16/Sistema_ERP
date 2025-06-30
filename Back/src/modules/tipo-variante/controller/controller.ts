// Backend: controller/controller.ts - CON ELIMINACIÓN SEGURA
import { Request, Response } from 'express'
import * as service from '../service/service'

export const crear = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body
    
    if (!nombre || nombre.trim().length === 0) {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }
    
    const tipo = await service.crear(nombre.trim())
    res.status(201).json(tipo)
  } catch (error: any) {
    console.error('Error creando tipo de variante:', error)
    res.status(500).json({ error: 'Error al crear tipo de variante' })
  }
}

export const listar = async (_req: Request, res: Response) => {
  try {
    const tipos = await service.listar()
    res.json(tipos)
  } catch (error: any) {
    console.error('Error listando tipos de variante:', error)
    res.status(500).json({ error: 'Error al obtener tipos de variante' })
  }
}

export const actualizar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const { nombre } = req.body
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    
    if (!nombre || nombre.trim().length === 0) {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }
    
    const tipo = await service.actualizar(id, nombre.trim())
    res.json(tipo)
  } catch (error: any) {
    console.error('Error actualizando tipo de variante:', error)
    res.status(500).json({ error: 'Error al actualizar tipo de variante' })
  }
}

// ✅ VERIFICAR DEPENDENCIAS (COMPLETA)
export const verificarDependencias = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    
    const verificacion = await service.verificarDependencias(id)
    res.json(verificacion)
  } catch (error: any) {
    console.error('Error verificando dependencias:', error)
    res.status(500).json({ error: 'Error al verificar dependencias' })
  }
}

// ✅ ELIMINACIÓN SEGURA (PREDETERMINADA)
export const eliminar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    
    const resultado = await service.eliminar(id)
    res.json(resultado)
  } catch (error: any) {
    console.error('Error eliminando tipo de variante:', error)
    
    // Manejo específico de errores de dependencias
    if (error.message.includes('dependencias activas') || 
        error.message.includes('siendo usados en')) {
      return res.status(409).json({ 
        error: error.message,
        code: 'DEPENDENCIES_EXIST'
      })
    }
    
    if (error.message.includes('no existe')) {
      return res.status(404).json({ error: error.message })
    }
    
    res.status(500).json({ error: 'Error al eliminar tipo de variante' })
  }
}

// ✅ ELIMINACIÓN FORZADA (SOLO PARA CASOS EXTREMOS)
export const eliminarForzado = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    
    // Verificación adicional - requiere confirmación explícita
    const { confirmarEliminacionForzada } = req.body
    
    if (!confirmarEliminacionForzada) {
      return res.status(400).json({ 
        error: 'Se requiere confirmación explícita para eliminación forzada',
        requiere: 'confirmarEliminacionForzada: true'
      })
    }
    
    const resultado = await service.eliminarForzado(id)
    res.json(resultado)
  } catch (error: any) {
    console.error('Error en eliminación forzada:', error)
    res.status(500).json({ error: 'Error en eliminación forzada' })
  }
}

// ✅ OBTENER PRODUCTOS AFECTADOS
export const obtenerProductosAfectados = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    
    const productos = await service.obtenerProductosAfectados(id)
    res.json(productos)
  } catch (error: any) {
    console.error('Error obteniendo productos afectados:', error)
    res.status(500).json({ error: 'Error al obtener productos afectados' })
  }
}