import { Router } from 'express'
import BodegaController from '../controller/bodega.controller'
import { verificarToken } from '../../../middleware/verificarToken'
// Usar la misma importación que en tu EmpresaController
import prisma from '../../../../prisma/client'

const router = Router()

// 🔍 RUTA DE DEBUG - TEMPORAL
router.get('/debug-user', verificarToken, async (req, res) => {
  try {
    console.log('=== DEBUG COMPLETO ===')
    console.log('req.user desde middleware:', req.user)
    
    // Buscar usuario completo
    const usuario = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      include: { 
        empresa: {
          select: {
            id: true,
            nombre: true,
            nit: true
          }
        }
      }
    })
    
    console.log('Usuario completo desde DB:', usuario)
    
    // Decodificar token para ver qué contiene
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')
    let tokenDecoded = null
    
    if (token) {
      const jwt = require('jsonwebtoken')
      tokenDecoded = jwt.decode(token)
    }
    
    res.json({
      paso1_middleware: req.user,
      paso2_database: usuario,
      paso3_token_content: tokenDecoded,
      diagnostico: {
        usuario_existe: !!usuario,
        tiene_empresa_en_db: !!usuario?.empresa,
        empresaId_en_middleware: req.user?.empresaId,
        empresaId_en_db: usuario?.empresaId,
        token_valido: !!token,
        problema_identificado: !usuario?.empresa ? 'Usuario sin empresa en DB' : 
                              !req.user?.empresaId ? 'Token sin empresaId' : 'OK'
      }
    })
  } catch (error) {
    console.error('Error debug:', error)
    res.status(500).json({ error: 'Error debug', details: error })
  }
})

// Middleware para logging de rutas (opcional, útil para debugging)
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Usuario: ${req.user?.userId || 'No autenticado'}`)
  next()
})

// Rutas de bodegas
router.get('/', verificarToken, BodegaController.getBodegas)
router.post('/', verificarToken, BodegaController.createBodega)
router.put('/:id', verificarToken, BodegaController.updateBodega)
router.delete('/:id', verificarToken, BodegaController.deleteBodega)

// Ruta adicional para obtener una bodega específica (opcional)
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const empresaId = req.user?.empresaId

    if (!empresaId || empresaId === null) {
      return res.status(400).json({ error: 'No tienes una empresa asignada. Contacta al administrador.' })
    }

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de bodega inválido' })
    }

    const BodegaService = require('../service/bodega.service').default
    const bodega = await BodegaService.getById(id, empresaId)

    if (!bodega) {
      return res.status(404).json({ error: 'Bodega no encontrada' })
    }

    res.json(bodega)
  } catch (error) {
    console.error('Error al obtener bodega:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router